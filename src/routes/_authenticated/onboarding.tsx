import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Target, Briefcase, CheckCircle2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Paisa" }] }),
  component: Onboarding,
});

const GOALS = [
  { id: "emergency_fund", label: "Emergency Fund", desc: "3–6 months of expenses." },
  { id: "retirement", label: "Retirement", desc: "Plan for the long haul." },
  { id: "home", label: "Buy a Home", desc: "Down payment + EMI ready." },
  { id: "education", label: "Child Education", desc: "Future tuition fees." },
  { id: "vacation", label: "Vacation", desc: "That dream trip." },
  { id: "debt_payoff", label: "Debt Payoff", desc: "Clear loans faster." },
  { id: "wealth_building", label: "Wealth Building", desc: "Grow long-term wealth." },
];

function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("Salaried");
  const [employer, setEmployer] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("savings");
  const [bankName, setBankName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [busy, setBusy] = useState(false);

  function toggleGoal(id: string) {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));
  }

  async function finish() {
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }

    const { error } = await supabase.from("profiles").update({
      monthly_income: Number(income) || 0,
      occupation,
      employer: employer || null,
      financial_goals: goals,
      onboarding_complete: true,
    }).eq("id", user.id);
    if (error) { toast.error(error.message); setBusy(false); return; }

    if (accountName.trim()) {
      const { error: accErr } = await supabase.from("bank_accounts").insert({
        user_id: user.id,
        account_name: accountName.trim(),
        account_type: accountType as "savings",
        bank_name: bankName || null,
        balance: Number(accountBalance) || 0,
      });
      if (accErr) toast.error(`Account not saved: ${accErr.message}`);
    }

    if (goals.length) {
      const { data: existing } = await supabase.from("goals").select("type").eq("user_id", user.id);
      const existingTypes = new Set((existing ?? []).map((g) => g.type));
      const newGoals = goals.filter((g) => !existingTypes.has(g as "emergency_fund"));
      if (newGoals.length) {
        const { error: goalsErr } = await supabase.from("goals").insert(
          newGoals.map((g) => ({
            user_id: user.id,
            name: GOALS.find((x) => x.id === g)?.label ?? g,
            type: g as "emergency_fund",
            target_amount: 100000,
            current_amount: 0,
          })),
        );
        if (goalsErr) toast.error(`Goals not saved: ${goalsErr.message}`);
      }
    }

    await qc.invalidateQueries({ queryKey: ["profile"] });
    await qc.invalidateQueries({ queryKey: ["goals"] });
    await qc.invalidateQueries({ queryKey: ["accounts"] });
    setStep(4);
    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-2 text-center text-xs text-muted">Step {Math.min(step, 3)} of 3</div>
      <div className="mb-8 flex items-center gap-1.5">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-accent" : "bg-[var(--border)]"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="surface-elev p-8">
          <Briefcase className="h-5 w-5 text-accent" />
          <h2 className="heading-card mt-3">Tell us about your income</h2>
          <p className="mt-1 text-sm text-muted">We use this to compute your savings rate, EMI burden, and financial health score.</p>
          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-muted">Monthly income (₹)</span>
              <input className="input-field mt-1.5 num" inputMode="numeric" value={income} onChange={(e) => setIncome(e.target.value.replace(/\D/g, ""))} placeholder="80000" />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">Occupation</span>
              <select className="input-field mt-1.5" value={occupation} onChange={(e) => setOccupation(e.target.value)}>
                <option>Salaried</option><option>Self-employed</option><option>Business</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted">Employer (optional)</span>
              <input className="input-field mt-1.5" value={employer} onChange={(e) => setEmployer(e.target.value)} />
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={() => setStep(2)} disabled={!income} className="btn-primary">Continue</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="surface-elev p-8">
          <Target className="h-5 w-5 text-accent" />
          <h2 className="heading-card mt-3">What are you saving for?</h2>
          <p className="mt-1 text-sm text-muted">Pick any that matter. You can skip and add goals later.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {GOALS.map((g) => {
              const on = goals.includes(g.id);
              return (
                <button key={g.id} onClick={() => toggleGoal(g.id)} className={`rounded-md border p-4 text-left transition-colors ${on ? "border-accent bg-[var(--hover)]" : "border-[var(--border)] hover:bg-[var(--hover)]"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{g.label}</span>
                    {on && <CheckCircle2 className="h-4 w-4 text-accent" />}
                  </div>
                  <p className="mt-1 text-xs text-muted">{g.desc}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(1)} className="btn-ghost">Back</button>
            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="btn-ghost">Skip</button>
              <button onClick={() => setStep(3)} disabled={goals.length === 0} className="btn-primary">Continue</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="surface-elev p-8">
          <Wallet className="h-5 w-5 text-accent" />
          <h2 className="heading-card mt-3">Add your first account</h2>
          <p className="mt-1 text-sm text-muted">Link a bank account or wallet. You can also upload statements (PDF, CSV, Excel) from Settings later.</p>
          <div className="mt-6 space-y-3">
            <input className="input-field" placeholder="Account name (e.g. HDFC Savings)" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <select className="input-field" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                <option value="savings">Savings</option><option value="current">Current</option>
                <option value="credit_card">Credit Card</option><option value="wallet">Wallet</option><option value="upi">UPI</option>
              </select>
              <input className="input-field" placeholder="Bank name" value={bankName} onChange={(e) => setBankName(e.target.value)} />
            </div>
            <input className="input-field num" inputMode="numeric" placeholder="Current balance (₹)" value={accountBalance} onChange={(e) => setAccountBalance(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="btn-ghost">Back</button>
            <div className="flex gap-2">
              <button onClick={finish} disabled={busy} className="btn-ghost">{busy ? "Setting up…" : "Skip for now"}</button>
              <button onClick={finish} disabled={busy} className="btn-primary"><Plus className="h-4 w-4" />{busy ? "Setting up…" : "Finish setup"}</button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="surface-elev p-12 text-center">
          <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-[var(--border)]">
            <div className="h-full w-1/2 animate-pulse bg-accent" />
          </div>
          <h2 className="heading-card mt-6">All set!</h2>
          <p className="mt-2 text-sm text-muted">Taking you to your dashboard.</p>
        </div>
      )}
    </div>
  );
}
