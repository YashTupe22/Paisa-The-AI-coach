import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
    await supabase.from("profiles").update({
      monthly_income: Number(income) || 0,
      occupation,
      employer,
      financial_goals: goals,
      onboarding_complete: true,
    }).eq("id", user.id);
    await seedDemo(user.id);
    setStep(4);
    setTimeout(() => navigate({ to: "/dashboard" }), 1500);
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
                <button key={g.id} onClick={() => toggleGoal(g.id)} className={`rounded-md border p-4 text-left transition-colors ${on ? "border-accent bg-[var(--hover)]" : "border-[var(--border)] bg-[rgba(255,255,255,0.02)] hover:bg-[var(--hover)]"}`}>
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
          <h2 className="heading-card mt-3">Connect your money</h2>
          <p className="mt-1 text-sm text-muted">We'll set up demo accounts so you can explore Paisa instantly. Real connectors coming soon.</p>
          <div className="mt-6 grid gap-2">
            {["Upload bank statement (PDF/CSV)", "Connect UPI app (GPay / PhonePe / Paytm)", "Add credit card manually"].map((l) => (
              <div key={l} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                <span className="text-sm text-body">{l}</span>
                <span className="pill">Demo</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(2)} className="btn-ghost">Back</button>
            <button onClick={finish} disabled={busy} className="btn-primary">{busy ? "Setting up…" : "Finish & load demo data"}</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="surface-elev p-12 text-center">
          <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-[var(--border)]">
            <div className="h-full w-1/2 animate-pulse bg-accent" />
          </div>
          <h2 className="heading-card mt-6">Analysing your transactions with AI…</h2>
          <p className="mt-2 text-sm text-muted">Just a moment.</p>
        </div>
      )}
    </div>
  );
}

async function seedDemo(userId: string) {
  // Idempotency: skip if already has accounts
  const { data: existing } = await supabase.from("bank_accounts").select("id").eq("user_id", userId).limit(1);
  if (existing && existing.length > 0) return;

  const { data: accountsData } = await supabase.from("bank_accounts").insert([
    { user_id: userId, account_name: "SBI Savings", account_type: "savings", bank_name: "SBI", last4: "4521", balance: 184320 },
    { user_id: userId, account_name: "HDFC Credit Card", account_type: "credit_card", bank_name: "HDFC", last4: "8812", balance: -23410, credit_limit: 150000 },
    { user_id: userId, account_name: "Paytm Wallet", account_type: "wallet", bank_name: "Paytm", last4: "—", balance: 4280 },
  ]).select();

  const accIds = accountsData?.map((a) => a.id) ?? [];

  // 60 transactions across past 60 days
  const cats = ["Food & Dining", "Transport", "Shopping", "Utilities", "Entertainment", "EMI"];
  const merchants: Record<string, string[]> = {
    "Food & Dining": ["Swiggy", "Zomato", "Blue Tokai", "Domino's", "Haldiram's"],
    Transport: ["Uber", "Ola", "Indian Oil", "Metro Card", "Rapido"],
    Shopping: ["Amazon", "Flipkart", "Myntra", "Nykaa", "Decathlon"],
    Utilities: ["Airtel", "Jio Fiber", "BESCOM", "Tata Power", "Gas Bill"],
    Entertainment: ["Netflix", "Spotify", "PVR Cinemas", "BookMyShow", "Hotstar"],
    EMI: ["Home Loan EMI", "Car Loan EMI"],
  };
  const txns: Array<Record<string, unknown>> = [];
  const now = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - Math.floor(Math.random() * 60));
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const merchant = merchants[cat][Math.floor(Math.random() * merchants[cat].length)];
    const baseAmt = cat === "EMI" ? (merchant.startsWith("Home") ? 18500 : 6200) : Math.round(80 + Math.random() * 4200);
    txns.push({
      user_id: userId,
      account_id: accIds[Math.floor(Math.random() * accIds.length)],
      merchant_name: merchant,
      amount: baseAmt,
      type: "debit",
      category: cat,
      ai_category: cat,
      date: d.toISOString().slice(0, 10),
    });
  }
  // Two salary credits
  for (let m = 0; m < 2; m++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - m);
    d.setDate(1);
    txns.push({
      user_id: userId,
      account_id: accIds[0],
      merchant_name: "Salary Credit",
      amount: 120000,
      type: "credit",
      category: "Income",
      ai_category: "Income",
      date: d.toISOString().slice(0, 10),
    });
  }
  await supabase.from("transactions").insert(txns as any);

  await supabase.from("goals").insert([
    { user_id: userId, name: "Emergency Fund", type: "emergency_fund", target_amount: 300000, current_amount: 120000, monthly_contribution: 10000, deadline: addMonths(18), icon: "shield" },
    { user_id: userId, name: "Goa Vacation", type: "vacation", target_amount: 50000, current_amount: 18000, monthly_contribution: 5000, deadline: addMonths(6), icon: "palm" },
    { user_id: userId, name: "Retirement", type: "retirement", target_amount: 10000000, current_amount: 800000, monthly_contribution: 15000, deadline: addMonths(360), icon: "sun" },
  ]);

  await supabase.from("loans").insert([
    { user_id: userId, name: "Home Loan", lender: "HDFC", principal: 4500000, outstanding: 3920000, emi_amount: 18500, emi_day: 5, months_remaining: 198, interest_rate: 8.5, tenure_months: 240 },
    { user_id: userId, name: "Car Loan", lender: "ICICI", principal: 600000, outstanding: 280000, emi_amount: 6200, emi_day: 10, months_remaining: 32, interest_rate: 9.2, tenure_months: 60 },
  ]);

  await supabase.from("investments").insert([
    { user_id: userId, name: "Parag Parikh Flexi Cap", type: "mutual_fund", units: 425.21, avg_buy_price: 62.4, current_value: 31200, invested_amount: 26527, sip_amount: 5000, sip_date: 7 },
    { user_id: userId, name: "Axis Bluechip Fund", type: "mutual_fund", units: 612.5, avg_buy_price: 48.1, current_value: 33800, invested_amount: 29461, sip_amount: 3000, sip_date: 12 },
    { user_id: userId, name: "SBI Fixed Deposit", type: "fd", units: 1, current_value: 150000, invested_amount: 150000 },
    { user_id: userId, name: "Reliance Industries", type: "stock", units: 15, avg_buy_price: 2380, current_value: 39200, invested_amount: 35700 },
  ]);

  await supabase.from("financial_health_scores").insert({
    user_id: userId, total_score: 68, savings_score: 72, debt_score: 60, emergency_score: 65, investment_score: 75,
  });

  await supabase.from("ai_insights").insert([
    { user_id: userId, type: "spend", heading: "You spent 32% more on food this month", body: "Food & dining hit ₹14,820 vs ₹11,230 last month. Cooking 2 dinners a week at home could save ~₹3,000.", cta_label: "See transactions", cta_url: "/transactions" },
    { user_id: userId, type: "goal", heading: "On track for Goa Vacation", body: "At your current pace, you'll hit your ₹50,000 target 1 month early.", cta_label: "View goal", cta_url: "/goals" },
    { user_id: userId, type: "invest", heading: "Idle cash detected", body: "₹84,000 sitting in savings could earn ~₹4,200/yr more in a liquid fund.", cta_label: "Explore investments", cta_url: "/investments" },
    { user_id: userId, type: "tax", heading: "ELSS window closing", body: "You have 60 days left to maximise your 80C limit. ₹40,000 still available.", cta_label: "Learn more" },
  ]);
}

function addMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}
