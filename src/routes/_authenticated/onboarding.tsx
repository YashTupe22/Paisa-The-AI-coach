import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Wallet, Target, Briefcase, CheckCircle2 } from "lucide-react";

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
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState("");
  const [occupation, setOccupation] = useState("Salaried");
  const [employer, setEmployer] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
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
      employer,
      financial_goals: goals,
      onboarding_complete: true,
    }).eq("id", user.id);
    if (error) { toast.error(error.message); setBusy(false); return; }
    if (goals.length) {
      await supabase.from("goals").insert(
        goals.map((g) => ({
          user_id: user.id,
          name: GOALS.find((x) => x.id === g)?.label ?? g,
          type: g as "emergency_fund",
          target_amount: 100000,
          current_amount: 0,
        })),
      );
    }
    setStep(4);
    setTimeout(() => navigate({ to: "/dashboard" }), 1200);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-center gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-accent" : "bg-[var(--border)]"}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="surface-elev p-8">
          <Briefcase className="h-5 w-5 text-accent" />
          <h2 className="heading-card mt-3">Tell us about your income</h2>
          <p className="mt-1 text-sm text-muted">We use this to compute your savings rate and goal progress.</p>
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
          <p className="mt-1 text-sm text-muted">Pick any that matter to you. You can add more later.</p>
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
            <button onClick={() => setStep(3)} disabled={goals.length === 0} className="btn-primary">Continue</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="surface-elev p-8">
          <Wallet className="h-5 w-5 text-accent" />
          <h2 className="heading-card mt-3">Add your accounts</h2>
          <p className="mt-1 text-sm text-muted">You can add bank accounts, credit cards, and wallets from Settings → Accounts after onboarding. You can also upload PDF statements and let AI categorise your transactions.</p>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="btn-ghost">Back</button>
            <button onClick={finish} disabled={busy} className="btn-primary">{busy ? "Setting up…" : "Finish setup"}</button>
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
