import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { parseStatement } from "@/lib/statements.functions";
import { formatINR, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Upload, Plus, Trash2, X, CreditCard, FileText, Sparkles, Loader2, Wallet } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Paisa" }] }),
  component: SettingsPage,
});

const TABS = ["Profile", "Accounts", "Statements", "Appearance", "Security"] as const;
type Tab = typeof TABS[number];

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("Profile");
  return (
    <div className="p-6 md:p-8">
      <h1 className="heading-section mb-6">Settings</h1>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-sm transition-colors ${tab === t ? "border-b-2 border-accent text-foreground" : "text-muted hover:text-foreground"}`}>{t}</button>
        ))}
      </div>
      {tab === "Profile" && <ProfileTab />}
      {tab === "Accounts" && <AccountsTab />}
      {tab === "Statements" && <StatementsTab />}
      {tab === "Appearance" && <AppearanceTab />}
      {tab === "Security" && <SecurityTab />}
    </div>
  );
}

function ProfileTab() {
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser(); if (!user) return null;
      return (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data;
    },
  });
  const [f, setF] = useState({ name: "", monthly_income: "", occupation: "" });
  const initialized = useRef(false);
  if (profile && !initialized.current) {
    initialized.current = true;
    setF({ name: profile.name ?? "", monthly_income: String(profile.monthly_income ?? ""), occupation: profile.occupation ?? "" });
  }

  async function save() {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { error } = await supabase.from("profiles").update({ name: f.name, monthly_income: Number(f.monthly_income) || 0, occupation: f.occupation }).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Saved"); qc.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="surface-elev max-w-xl space-y-4 p-6">
      <label className="block"><span className="text-xs text-muted">Name</span><input className="input-field mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
      <label className="block"><span className="text-xs text-muted">Monthly income (₹)</span><input className="input-field num mt-1" inputMode="numeric" value={f.monthly_income} onChange={(e) => setF({ ...f, monthly_income: e.target.value.replace(/\D/g, "") })} /></label>
      <label className="block"><span className="text-xs text-muted">Occupation</span>
        <select className="input-field mt-1" value={f.occupation} onChange={(e) => setF({ ...f, occupation: e.target.value })}>
          <option value="">—</option><option>Salaried</option><option>Self-employed</option><option>Business</option>
        </select>
      </label>
      <button onClick={save} className="btn-primary">Save</button>
    </div>
  );
}

function AccountsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("bank_accounts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["accounts"] }); toast.success("Removed"); },
  });

  async function payCreditCardBill(account: { id: string; outstanding_balance?: number | null; account_name: string }) {
    const amt = Number(account.outstanding_balance ?? 0);
    if (amt <= 0) return toast.info("Nothing to pay.");
    if (!confirm(`Mark ${formatINR(amt)} as paid for ${account.account_name}?`)) return;
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    await supabase.from("payment_intents").insert({ user_id: user.id, account_id: account.id, amount: amt, status: "succeeded", purpose: "credit_card_payment" });
    await supabase.from("bank_accounts").update({ outstanding_balance: 0 }).eq("id", account.id);
    await supabase.from("transactions").insert({ user_id: user.id, account_id: account.id, merchant_name: `${account.account_name} bill payment`, amount: amt, type: "debit", category: "EMI", date: new Date().toISOString().slice(0, 10) });
    qc.invalidateQueries({ queryKey: ["accounts"] }); toast.success("Marked as paid");
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><button onClick={() => setOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add account</button></div>
      {accounts.length === 0 ? (
        <div className="surface-elev grid place-items-center p-12 text-center"><Wallet className="h-8 w-8 text-muted" /><p className="mt-3 text-sm text-muted">No accounts yet.</p></div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {accounts.map((a) => {
            const isCC = a.account_type === "credit_card";
            const util = isCC && a.credit_limit ? Math.round((Number(a.outstanding_balance ?? 0) / Number(a.credit_limit)) * 100) : null;
            return (
              <div key={a.id} className="surface-elev p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {isCC ? <CreditCard className="h-4 w-4 text-accent" /> : <Wallet className="h-4 w-4 text-accent" />}
                      <div className="text-sm font-medium text-foreground">{a.account_name}</div>
                    </div>
                    <div className="mt-0.5 text-xs text-muted">{a.bank_name} • {a.account_type} {a.last4 && `• ••${a.last4}`}</div>
                  </div>
                  <button onClick={() => del.mutate(a.id)} className="text-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                {isCC ? (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted">Outstanding</span><span className="num text-destructive">{formatINR(Number(a.outstanding_balance ?? 0))}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted">Limit</span><span className="num text-foreground">{formatINR(Number(a.credit_limit ?? 0))}</span></div>
                    {util !== null && <div className="h-1.5 rounded-full bg-[var(--border)]"><div className={`h-full rounded-full ${util > 70 ? "bg-destructive" : "bg-accent"}`} style={{ width: `${Math.min(100, util)}%` }} /></div>}
                    {a.due_day && <div className="text-xs text-muted">Due on day {a.due_day} • Statement day {a.statement_day ?? "—"}</div>}
                    <button onClick={() => payCreditCardBill(a)} className="btn-primary mt-2 w-full">Pay bill</button>
                  </div>
                ) : (
                  <div className="num mt-4 text-xl text-foreground">{formatINR(Number(a.balance))}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {open && <AccountDialog onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["accounts"] })} />}
    </div>
  );
}

function AccountDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ account_name: "", account_type: "savings", bank_name: "", last4: "", balance: "", credit_limit: "", outstanding_balance: "", statement_day: "", due_day: "" });
  const isCC = f.account_type === "credit_card";
  async function save() {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const payload: Record<string, unknown> = {
      user_id: user.id, account_name: f.account_name, account_type: f.account_type, bank_name: f.bank_name || null, last4: f.last4 || null,
      balance: Number(f.balance) || 0,
    };
    if (isCC) {
      payload.credit_limit = Number(f.credit_limit) || 0;
      payload.outstanding_balance = Number(f.outstanding_balance) || 0;
      payload.statement_day = f.statement_day ? Number(f.statement_day) : null;
      payload.due_day = f.due_day ? Number(f.due_day) : null;
    }
    const { error } = await supabase.from("bank_accounts").insert(payload as never);
    if (error) return toast.error(error.message);
    toast.success("Added"); onSaved(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="surface-elev w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="heading-card">Add account</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input-field col-span-2" placeholder="Account name" value={f.account_name} onChange={(e) => setF({ ...f, account_name: e.target.value })} />
          <select className="input-field" value={f.account_type} onChange={(e) => setF({ ...f, account_type: e.target.value })}>
            <option value="savings">Savings</option><option value="current">Current</option>
            <option value="credit_card">Credit Card</option><option value="wallet">Wallet</option><option value="upi">UPI</option>
          </select>
          <input className="input-field" placeholder="Bank name" value={f.bank_name} onChange={(e) => setF({ ...f, bank_name: e.target.value })} />
          <input className="input-field" placeholder="Last 4 digits" value={f.last4} onChange={(e) => setF({ ...f, last4: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
          <input className="input-field num" inputMode="numeric" placeholder={isCC ? "Available limit" : "Balance"} value={f.balance} onChange={(e) => setF({ ...f, balance: e.target.value.replace(/\D/g, "") })} />
          {isCC && <>
            <input className="input-field num" inputMode="numeric" placeholder="Credit limit" value={f.credit_limit} onChange={(e) => setF({ ...f, credit_limit: e.target.value.replace(/\D/g, "") })} />
            <input className="input-field num" inputMode="numeric" placeholder="Outstanding balance" value={f.outstanding_balance} onChange={(e) => setF({ ...f, outstanding_balance: e.target.value.replace(/\D/g, "") })} />
            <input className="input-field num" inputMode="numeric" placeholder="Statement day (1-31)" value={f.statement_day} onChange={(e) => setF({ ...f, statement_day: e.target.value.replace(/\D/g, "") })} />
            <input className="input-field num" inputMode="numeric" placeholder="Due day (1-31)" value={f.due_day} onChange={(e) => setF({ ...f, due_day: e.target.value.replace(/\D/g, "") })} />
          </>}
        </div>
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!f.account_name} onClick={save}>Add</button></div>
      </div>
    </div>
  );
}

type Parsed = { date: string; merchant_name: string; amount: number; type: "debit" | "credit"; suggested_category: string };

function StatementsTab() {
  const qc = useQueryClient();
  const parseFn = useServerFn(parseStatement);
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [review, setReview] = useState<Parsed[] | null>(null);
  const [reviewFilename, setReviewFilename] = useState("");

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("id,account_name")).data ?? [],
  });
  const [targetAccount, setTargetAccount] = useState("");

  const { data: uploaded = [] } = useQuery({
    queryKey: ["statements"],
    queryFn: async () => (await supabase.from("uploaded_statements").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith(".pdf")) return toast.error("Please upload a PDF.");
    if (file.size > 15 * 1024 * 1024) return toast.error("Max 15 MB.");
    setParsing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setParsing(false); return; }

    // 1. Upload to storage
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const up = await supabase.storage.from("statements").upload(path, file);
    if (up.error) { setParsing(false); return toast.error(up.error.message); }

    const { data: stmt } = await supabase.from("uploaded_statements").insert({
      user_id: user.id, file_name: file.name, file_url: path, status: "processing",
    }).select().single();

    // 2. base64 + send to Gemini
    try {
      const b64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => { const s = String(r.result); res(s.slice(s.indexOf(",") + 1)); };
        r.onerror = () => rej(new Error("read error"));
        r.readAsDataURL(file);
      });
      const out = await parseFn({ data: { pdfBase64: b64, filename: file.name } });
      await supabase.from("uploaded_statements").update({ status: "done", parsed_count: out.transactions.length }).eq("id", stmt!.id);
      qc.invalidateQueries({ queryKey: ["statements"] });
      setReview(out.transactions); setReviewFilename(file.name);
      if (out.transactions.length === 0) toast.info("No transactions found in this PDF.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Parse failed";
      await supabase.from("uploaded_statements").update({ status: "error" }).eq("id", stmt!.id);
      toast.error(msg);
    } finally {
      setParsing(false);
    }
  }

  async function importParsed() {
    if (!review) return;
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const rows = review.map((t) => ({
      user_id: user.id, account_id: targetAccount || null,
      merchant_name: t.merchant_name, amount: t.amount, type: t.type, category: t.suggested_category,
      ai_category: t.suggested_category, date: t.date,
    }));
    const { error } = await supabase.from("transactions").insert(rows as never);
    if (error) return toast.error(error.message);
    toast.success(`Imported ${rows.length} transactions`); setReview(null);
    qc.invalidateQueries({ queryKey: ["transactions"] });
  }

  return (
    <div className="space-y-4">
      <div className="surface-elev p-6">
        <h3 className="heading-card flex items-center gap-2"><Sparkles className="h-4 w-4 text-accent" /> Upload statement PDF</h3>
        <p className="mt-1 text-sm text-muted">Gemini will read the PDF and extract transactions. Review before importing.</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
          onClick={() => fileRef.current?.click()}
          className="mt-4 grid cursor-pointer place-items-center rounded-md border-2 border-dashed border-[var(--border)] py-10 text-center hover:bg-[var(--hover)]"
        >
          {parsing ? <><Loader2 className="h-6 w-6 animate-spin text-accent" /><p className="mt-2 text-sm text-muted">Parsing with Gemini…</p></> :
            <><Upload className="h-6 w-6 text-muted" /><p className="mt-2 text-sm text-muted">Drag a PDF here or click to choose</p></>}
        </div>
        <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      </div>

      {uploaded.length > 0 && (
        <div className="surface-elev p-6">
          <h3 className="heading-card mb-3">Previous uploads</h3>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {uploaded.map((u) => (
              <li key={u.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-muted" /><div><div className="text-sm text-foreground">{u.file_name}</div><div className="text-xs text-muted">{formatDate(u.created_at)} • {u.parsed_count ?? 0} txns</div></div></div>
                <span className={`pill ${u.status === "done" ? "text-success" : u.status === "error" ? "text-destructive" : "text-muted"}`}>{u.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {review && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="surface-elev max-h-[80vh] w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
              <h3 className="heading-card">Review {review.length} transactions from {reviewFilename}</h3>
              <button onClick={() => setReview(null)}><X className="h-4 w-4" /></button>
            </div>
            <div className="border-b border-[var(--border)] p-4">
              <label className="text-xs text-muted">Assign to account</label>
              <select className="input-field mt-1" value={targetAccount} onChange={(e) => setTargetAccount(e.target.value)}>
                <option value="">— none —</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.account_name}</option>)}
              </select>
            </div>
            <div className="max-h-[40vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-[var(--border)] bg-card text-xs uppercase text-muted"><tr><th className="px-3 py-2 text-left">Date</th><th className="px-3 py-2 text-left">Merchant</th><th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-right">Amount</th></tr></thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {review.map((t, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-muted">{t.date}</td>
                      <td className="px-3 py-2 text-foreground">{t.merchant_name}</td>
                      <td className="px-3 py-2 text-muted">{t.suggested_category}</td>
                      <td className={`num px-3 py-2 text-right ${t.type === "debit" ? "text-destructive" : "text-success"}`}>{t.type === "debit" ? "-" : "+"}{formatINR(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--border)] p-4">
              <button onClick={() => setReview(null)} className="btn-ghost">Cancel</button>
              <button onClick={importParsed} disabled={review.length === 0} className="btn-primary">Import all</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="surface-elev max-w-md p-6">
      <h3 className="heading-card mb-1">Theme</h3>
      <p className="text-sm text-muted">Choose how Paisa looks.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(["light", "dark"] as const).map((t) => (
          <button key={t} onClick={() => setTheme(t)} className={`flex items-center gap-2 rounded-md border p-4 ${theme === t ? "border-accent bg-[var(--hover)]" : "border-[var(--border)] hover:bg-[var(--hover)]"}`}>
            {t === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="text-sm text-foreground capitalize">{t}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SecurityTab() {
  const [pw, setPw] = useState("");
  async function change() {
    if (pw.length < 8) return toast.error("Minimum 8 characters");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password updated"); setPw("");
  }
  return (
    <div className="surface-elev max-w-md space-y-3 p-6">
      <h3 className="heading-card">Change password</h3>
      <input type="password" className="input-field" placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} />
      <button onClick={change} className="btn-primary" disabled={!pw}>Update password</button>
    </div>
  );
}
