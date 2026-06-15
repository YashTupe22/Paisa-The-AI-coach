import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, formatDate } from "@/lib/format";
import { ArrowDownRight, ArrowUpRight, Bell, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Paisa" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();

  // Redirect to onboarding if not complete
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (profile && !profile.onboarding_complete) navigate({ to: "/onboarding" });
  }, [profile, navigate]);

  const { data: txns = [] } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      const { data } = await supabase.from("transactions").select("*").order("date", { ascending: false }).limit(8);
      return data ?? [];
    },
  });
  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("*")).data ?? [],
  });
  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => (await supabase.from("goals").select("*").order("created_at")).data ?? [],
  });
  const { data: insights = [] } = useQuery({
    queryKey: ["insights"],
    queryFn: async () => (await supabase.from("ai_insights").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: score } = useQuery({
    queryKey: ["score"],
    queryFn: async () => (await supabase.from("financial_health_scores").select("*").order("calculated_at", { ascending: false }).limit(1).maybeSingle()).data,
  });

  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance ?? 0), 0);
  const monthlyIncome = Number(profile?.monthly_income ?? 0);

  // Compute this month's expenses from txns we fetched (limited sample) — better to query
  const { data: monthTxns = [] } = useQuery({
    queryKey: ["month-txns"],
    queryFn: async () => {
      const start = new Date(); start.setDate(1);
      const { data } = await supabase.from("transactions").select("amount,type,category,date").gte("date", start.toISOString().slice(0, 10));
      return data ?? [];
    },
  });
  const monthExpenses = monthTxns.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const savingsRate = monthlyIncome > 0 ? Math.max(0, Math.round(((monthlyIncome - monthExpenses) / monthlyIncome) * 100)) : 0;

  const scoreVal = score?.total_score ?? 68;
  const scoreColor = scoreVal < 40 ? "text-destructive" : scoreVal < 70 ? "text-[#eab308]" : "text-success";

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-section">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Welcome back{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""}.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`pill ${scoreColor}`}><Sparkles className="h-3 w-3" /> Health {scoreVal}/100</span>
          <button className="relative grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
            <Bell className="h-4 w-4 text-muted" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total balance" value={formatINR(totalBalance)} change={8.4} />
        <SummaryCard label="Monthly income" value={formatINR(monthlyIncome)} change={0} />
        <SummaryCard label="Monthly expenses" value={formatINR(monthExpenses)} change={-12.1} invertColor />
        <SummaryCard label="Savings rate" value={`${savingsRate}%`} change={3.2} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="surface-elev p-6">
          <div className="flex items-center justify-between">
            <h3 className="heading-card">Expense breakdown</h3>
            <span className="text-xs text-muted">This month</span>
          </div>
          <ExpenseBreakdown txns={monthTxns} />
        </div>
        <div className="surface-elev p-6">
          <h3 className="heading-card">Financial health</h3>
          <div className={`num mt-3 text-5xl ${scoreColor}`}>{scoreVal}<span className="text-base text-subtle">/100</span></div>
          <div className="mt-5 space-y-3">
            {[
              ["Savings rate", score?.savings_score ?? 72],
              ["Debt ratio", score?.debt_score ?? 60],
              ["Emergency fund", score?.emergency_score ?? 65],
              ["Investment rate", score?.investment_score ?? 75],
            ].map(([l, v]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted">{l}</span><span className="num text-foreground">{v as number}</span></div>
                <div className="h-1.5 rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-accent" style={{ width: `${v as number}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="surface-elev p-6">
          <div className="flex items-center justify-between">
            <h3 className="heading-card">Recent transactions</h3>
            <Link to="/transactions" className="text-xs text-accent">View all</Link>
          </div>
          <div className="mt-4 divide-y divide-[var(--border-subtle)]">
            {txns.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-[var(--hover)] text-xs text-foreground">{t.merchant_name?.[0]}</div>
                  <div>
                    <div className="text-sm text-foreground">{t.merchant_name}</div>
                    <div className="text-xs text-muted">{formatDate(t.date)} · <span className="pill !h-5 !px-2 !text-[10px]">{t.category}</span></div>
                  </div>
                </div>
                <div className={`num text-sm ${t.type === "debit" ? "text-destructive" : "text-success"}`}>{t.type === "debit" ? "-" : "+"}{formatINR(Number(t.amount))}</div>
              </div>
            ))}
            {txns.length === 0 && <EmptyRow label="No transactions yet" />}
          </div>
        </div>
        <div className="surface-elev p-6">
          <h3 className="heading-card">Active goals</h3>
          <div className="mt-4 space-y-3">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
              return (
                <div key={g.id} className="rounded-md border border-[var(--border-subtle)] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">{g.name}</div>
                    <div className="num text-xs text-muted">{pct}%</div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} /></div>
                  <div className="mt-1.5 flex justify-between text-xs text-muted">
                    <span className="num">{formatINR(Number(g.current_amount), { compact: true })} / {formatINR(Number(g.target_amount), { compact: true })}</span>
                    <span>{g.deadline ? formatDate(g.deadline) : "—"}</span>
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && <EmptyRow label="No goals yet" />}
          </div>
        </div>
      </div>

      <div className="surface-elev mt-4 p-6">
        <h3 className="heading-card">AI Insights</h3>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {insights.map((i) => (
            <div key={i.id} className="min-w-[280px] max-w-[320px] rounded-md border border-[var(--border)] border-l-2 border-l-accent bg-[rgba(255,255,255,0.02)] p-4">
              <div className="flex items-center gap-2 text-xs text-accent"><Sparkles className="h-3 w-3" /> {i.type}</div>
              <div className="mt-2 text-sm font-medium text-foreground">{i.heading}</div>
              <p className="mt-1 text-xs text-body">{i.body}</p>
              {i.cta_label && i.cta_url && <Link to={i.cta_url as "/transactions"} className="mt-3 inline-block text-xs text-accent">{i.cta_label} →</Link>}
            </div>
          ))}
          {insights.length === 0 && <EmptyRow label="No insights yet" />}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, change, invertColor }: { label: string; value: string; change: number; invertColor?: boolean }) {
  const positive = invertColor ? change < 0 : change > 0;
  return (
    <div className="surface-elev p-5">
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="num mt-2 text-2xl text-foreground">{value}</div>
      {change !== 0 && (
        <div className={`mt-1 flex items-center gap-1 text-xs ${positive ? "text-success" : "text-destructive"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {Math.abs(change)}% MoM
        </div>
      )}
    </div>
  );
}

function ExpenseBreakdown({ txns }: { txns: Array<{ amount: number; type: string; category: string | null }> }) {
  const byCat: Record<string, number> = {};
  txns.filter((t) => t.type === "debit").forEach((t) => {
    const c = t.category || "Other";
    byCat[c] = (byCat[c] || 0) + Number(t.amount);
  });
  const total = Object.values(byCat).reduce((s, v) => s + v, 0) || 1;
  const colors = ["#7170ff", "#27a644", "#eab308", "#ec4899", "#3b82f6", "#f97316", "#8a8f98"];
  const entries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  let acc = 0;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-8">
      <svg viewBox="0 0 42 42" className="h-44 w-44">
        <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="var(--border)" strokeWidth="6" />
        {entries.map(([c, v], i) => {
          const dash = (v / total) * 100;
          const offset = 100 - acc;
          acc += dash;
          return <circle key={c} cx="21" cy="21" r="15.9" fill="transparent" stroke={colors[i % colors.length]} strokeWidth="6" strokeDasharray={`${dash} ${100 - dash}`} strokeDashoffset={offset} transform="rotate(-90 21 21)" />;
        })}
        <text x="21" y="22" textAnchor="middle" className="num" fontSize="4" fill="var(--foreground)">{formatINR(total, { compact: true })}</text>
      </svg>
      <ul className="flex-1 space-y-1.5 text-xs">
        {entries.map(([c, v], i) => (
          <li key={c} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-body"><span className="h-2 w-2 rounded-sm" style={{ background: colors[i % colors.length] }} /> {c}</span>
            <span className="num text-foreground">{formatINR(v)} <span className="text-subtle">({Math.round((v / total) * 100)}%)</span></span>
          </li>
        ))}
        {entries.length === 0 && <li className="text-muted">No expenses this month yet.</li>}
      </ul>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <div className="py-6 text-center text-sm text-muted">{label}</div>;
}
