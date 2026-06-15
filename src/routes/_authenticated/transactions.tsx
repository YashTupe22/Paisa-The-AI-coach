import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Plus, Download, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Paisa" }] }),
  component: TransactionsPage,
});

const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Utilities", "Entertainment", "Salary", "EMI", "Investment", "Transfer", "Other"];

function TransactionsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState({ category: "", type: "", q: "" });
  const [addOpen, setAddOpen] = useState(false);

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("*")).data ?? [],
  });

  const { data: txns = [], isLoading } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: async () => {
      let q = supabase.from("transactions").select("*").order("date", { ascending: false }).limit(200);
      if (filter.category) q = q.eq("category", filter.category);
      if (filter.type) q = q.eq("type", filter.type as "debit");
      if (filter.q) q = q.ilike("merchant_name", `%${filter.q}%`);
      return (await q).data ?? [];
    },
  });

  const updateCat = useMutation({
    mutationFn: async ({ id, category }: { id: string; category: string }) => {
      const { error } = await supabase.from("transactions").update({ category }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["transactions"] }); toast.success("Deleted"); },
  });

  function exportCSV() {
    const header = "Date,Merchant,Category,Type,Amount\n";
    const rows = txns.map((t) => `${t.date},"${t.merchant_name}",${t.category ?? ""},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-section">Transactions</h1>
          <p className="mt-1 text-sm text-muted">{txns.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="btn-ghost"><Download className="h-4 w-4" /> Export CSV</button>
          <button onClick={() => setAddOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
        </div>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <input className="input-field max-w-[240px]" placeholder="Search merchant…" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
        <select className="input-field max-w-[180px]" value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="input-field max-w-[140px]" value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
          <option value="">All types</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      <div className="surface-elev overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] text-left text-xs uppercase text-muted">
            <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Merchant</th><th className="px-4 py-3">Category</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {isLoading && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">Loading…</td></tr>}
            {!isLoading && txns.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-muted">No transactions. Add one or upload a PDF in Settings.</td></tr>}
            {txns.map((t) => (
              <tr key={t.id} className="hover:bg-[var(--hover)]">
                <td className="px-4 py-2.5 text-muted whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-4 py-2.5 text-foreground">{t.merchant_name}</td>
                <td className="px-4 py-2.5">
                  <select className="bg-transparent text-xs text-body" value={t.category ?? ""} onChange={(e) => updateCat.mutate({ id: t.id, category: e.target.value })}>
                    <option value="">—</option>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td className={`num px-4 py-2.5 text-right ${t.type === "debit" ? "text-destructive" : "text-success"}`}>{t.type === "debit" ? "-" : "+"}{formatINR(Number(t.amount))}</td>
                <td className="px-4 py-2.5 text-right"><button onClick={() => del.mutate(t.id)} className="text-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && <AddTxnDialog accounts={accounts} onClose={() => setAddOpen(false)} onAdded={() => qc.invalidateQueries({ queryKey: ["transactions"] })} />}
    </div>
  );
}

function AddTxnDialog({ accounts, onClose, onAdded }: { accounts: Array<{ id: string; account_name: string }>; onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({ merchant_name: "", amount: "", type: "debit", category: "Other", date: new Date().toISOString().slice(0, 10), account_id: accounts[0]?.id ?? "" });
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      merchant_name: form.merchant_name,
      amount: Number(form.amount),
      type: form.type as "debit",
      category: form.category,
      date: form.date,
      account_id: form.account_id || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Added"); onAdded(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="surface-elev w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="heading-card">Add transaction</h3>
          <button onClick={onClose}><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-3">
          <input className="input-field" placeholder="Merchant" value={form.merchant_name} onChange={(e) => setForm({ ...form, merchant_name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input-field num" inputMode="decimal" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="debit">Debit</option><option value="credit">Credit</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input type="date" className="input-field" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <select className="input-field" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}>
            <option value="">— no account —</option>
            {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_name}</option>)}
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={busy || !form.merchant_name || !form.amount} onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
