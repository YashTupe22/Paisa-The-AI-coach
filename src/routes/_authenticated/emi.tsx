import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { Plus, X, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_authenticated/emi")({
  head: () => ({ meta: [{ title: "EMI Tracker — Paisa" }] }),
  component: EmiPage,
});

function EmiPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: loans = [] } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => (await supabase.from("loans").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser(); if (!user) return null;
      return (await supabase.from("profiles").select("monthly_income").eq("id", user.id).maybeSingle()).data;
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("loans").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["loans"] }); toast.success("Loan removed"); },
  });

  const totalEmi = loans.reduce((s, l) => s + Number(l.emi_amount ?? 0), 0);
  const income = Number(profile?.monthly_income ?? 0);
  const burdenPct = income ? Math.round((totalEmi / income) * 100) : 0;

  const chart = loans.map((l) => ({ name: l.name, EMI: Number(l.emi_amount) }));

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div><h1 className="heading-section">EMI Tracker</h1><p className="mt-1 text-sm text-muted">{loans.length} active loans</p></div>
        <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add loan</button>
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Monthly EMI</div><div className="num mt-2 text-2xl text-foreground">{formatINR(totalEmi)}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">EMI / Income</div><div className="num mt-2 text-2xl text-foreground">{burdenPct}%</div><div className="mt-1 text-xs text-muted">{burdenPct > 40 ? "High burden" : burdenPct > 20 ? "Moderate" : "Healthy"}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Total outstanding</div><div className="num mt-2 text-2xl text-foreground">{formatINR(loans.reduce((s, l) => s + Number(l.outstanding ?? 0), 0))}</div></div>
      </div>

      {loans.length > 0 && (
        <div className="surface-elev mb-4 p-6">
          <h3 className="heading-card mb-4">EMI per loan</h3>
          <div className="h-64">
            <ResponsiveContainer><BarChart data={chart}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} /><YAxis stroke="var(--muted)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
              <Bar dataKey="EMI" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart></ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="surface-elev overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] text-left text-xs uppercase text-muted">
            <tr><th className="px-4 py-3">Loan</th><th className="px-4 py-3">Lender</th><th className="px-4 py-3 text-right">EMI</th><th className="px-4 py-3 text-right">Outstanding</th><th className="px-4 py-3 text-right">Months left</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {loans.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No loans tracked.</td></tr>}
            {loans.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 text-foreground">{l.name}</td>
                <td className="px-4 py-3 text-muted">{l.lender}</td>
                <td className="num px-4 py-3 text-right text-foreground">{formatINR(Number(l.emi_amount))}</td>
                <td className="num px-4 py-3 text-right text-foreground">{formatINR(Number(l.outstanding))}</td>
                <td className="num px-4 py-3 text-right text-muted">{l.months_remaining}</td>
                <td className="px-4 py-3 text-right"><button onClick={() => del.mutate(l.id)} className="text-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <LoanDialog onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["loans"] })} />}
    </div>
  );
}

function LoanDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: "", lender: "", principal: "", outstanding: "", emi_amount: "", emi_day: "5", interest_rate: "", tenure_months: "", months_remaining: "" });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { error } = await supabase.from("loans").insert({
      user_id: user.id, name: f.name, lender: f.lender,
      principal: Number(f.principal), outstanding: Number(f.outstanding || f.principal),
      emi_amount: Number(f.emi_amount), emi_day: Number(f.emi_day) || 1,
      interest_rate: f.interest_rate ? Number(f.interest_rate) : null,
      tenure_months: Number(f.tenure_months) || 0,
      months_remaining: Number(f.months_remaining || f.tenure_months) || 0,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Loan added"); onSaved(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="surface-elev w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="heading-card">Add loan</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input-field col-span-2" placeholder="Loan name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className="input-field col-span-2" placeholder="Lender" value={f.lender} onChange={(e) => setF({ ...f, lender: e.target.value })} />
          <input className="input-field num" inputMode="numeric" placeholder="Principal (₹)" value={f.principal} onChange={(e) => setF({ ...f, principal: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="Outstanding (₹)" value={f.outstanding} onChange={(e) => setF({ ...f, outstanding: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="EMI (₹)" value={f.emi_amount} onChange={(e) => setF({ ...f, emi_amount: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="EMI day (1-31)" value={f.emi_day} onChange={(e) => setF({ ...f, emi_day: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="decimal" placeholder="Interest rate %" value={f.interest_rate} onChange={(e) => setF({ ...f, interest_rate: e.target.value })} />
          <input className="input-field num" inputMode="numeric" placeholder="Tenure months" value={f.tenure_months} onChange={(e) => setF({ ...f, tenure_months: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num col-span-2" inputMode="numeric" placeholder="Months remaining" value={f.months_remaining} onChange={(e) => setF({ ...f, months_remaining: e.target.value.replace(/\D/g, "") })} />
        </div>
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy || !f.name || !f.emi_amount} onClick={save}>Add</button></div>
      </div>
    </div>
  );
}
