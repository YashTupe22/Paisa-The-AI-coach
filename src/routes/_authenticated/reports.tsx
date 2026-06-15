import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { computePeriodStats, monthRange } from "@/lib/finance-stats";
import { Printer, TrendingUp, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — Paisa" }] }),
  component: ReportsPage,
});

const COLORS = ["#4f46e5", "#16a34a", "#eab308", "#ec4899", "#3b82f6", "#f97316", "#64748b"];

function ReportsPage() {
  const today = new Date();
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return (await supabase.from("profiles").select("monthly_income").eq("id", user.id).maybeSingle()).data;
    },
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => (await supabase.from("investments").select("name,current_value,type")).data ?? [],
  });

  const { data: txns = [] } = useQuery({
    queryKey: ["period-txns", month],
    queryFn: async () => {
      const { start, end } = monthRange(month);
      const { data } = await supabase.from("transactions").select("amount,type,category,merchant_name,date").gte("date", start).lte("date", end);
      return data ?? [];
    },
  });

  const { data: trend = [] } = useQuery({
    queryKey: ["reports-trend"],
    queryFn: async () => {
      const start = new Date(); start.setMonth(start.getMonth() - 5); start.setDate(1);
      const { data } = await supabase.from("transactions").select("amount,type,date,category").gte("date", start.toISOString().slice(0, 10));
      return data ?? [];
    },
  });

  const profileIncome = Number(profile?.monthly_income ?? 0);
  const stats = useMemo(() => computePeriodStats(txns, profileIncome), [txns, profileIncome]);

  const monthlyTrend = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    trend.forEach((t) => {
      const k = t.date.slice(0, 7);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      if (t.type === "credit") map[k].income += Number(t.amount);
      else map[k].expense += Number(t.amount);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({
      month: k.slice(5),
      income: profileIncome > 0 ? profileIncome : v.income,
      expense: v.expense,
    }));
  }, [trend, profileIncome]);

  const totalPortfolio = investments.reduce((s, i) => s + Number(i.current_value ?? 0), 0);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="heading-section">Reports</h1>
          <p className="mt-1 text-sm text-muted">
            {stats.txnCount > 0
              ? `${stats.txnCount} transactions · same data as dashboard breakdown`
              : "Upload statements in Settings — AI categorizes, then data flows here"}
          </p>
        </div>
        <div className="flex gap-2">
          <input type="month" className="input-field max-w-[160px]" value={month} onChange={(e) => setMonth(e.target.value)} />
          <button onClick={() => window.print()} className="btn-ghost"><Printer className="h-4 w-4" /> Print / PDF</button>
        </div>
      </header>

      {stats.txnCount === 0 && (
        <div className="surface-elev mb-4 p-6 text-center">
          <p className="text-sm text-muted">No transaction data for this month.</p>
          <Link to="/settings" className="mt-2 inline-block text-sm text-accent">Upload CSV, Excel, or PDF → AI will categorize →</Link>
        </div>
      )}

      <div className="mb-4 grid gap-4 md:grid-cols-4">
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Income</div><div className="num mt-2 text-2xl text-success">{formatINR(stats.income)}</div><div className="mt-1 text-xs text-muted">{profileIncome > 0 ? "Profile income" : "From credits"}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Expense</div><div className="num mt-2 text-2xl text-destructive">{formatINR(stats.expense)}</div><div className="mt-1 text-xs text-muted">From debits</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Savings</div><div className={`num mt-2 text-2xl ${stats.savings >= 0 ? "text-foreground" : "text-destructive"}`}>{formatINR(stats.savings)}</div><div className="mt-1 text-xs text-muted">{stats.savingsRate}% rate</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Portfolio</div><div className="num mt-2 text-2xl text-foreground">{formatINR(totalPortfolio)}</div><Link to="/investments" className="mt-1 inline-block text-xs text-accent">View holdings →</Link></div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="surface-elev p-6">
          <h3 className="heading-card mb-3">6-month cashflow</h3>
          <div className="h-64"><ResponsiveContainer><BarChart data={monthlyTrend}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} /><YAxis stroke="var(--muted)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
            <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#dc2626" radius={[4, 4, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
        </div>
        <div className="surface-elev p-6">
          <h3 className="heading-card mb-3">Spend by category</h3>
          {stats.byCategory.length === 0 ? <p className="text-sm text-muted">No spend this month.</p> : (
            <div className="flex gap-6">
              <div className="h-48 w-48"><ResponsiveContainer>
                <PieChart><Pie data={stats.byCategory} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>{stats.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} /></PieChart>
              </ResponsiveContainer></div>
              <ul className="flex-1 space-y-1 text-xs">
                {stats.byCategory.map((c, i) => (
                  <li key={c.name} className="flex justify-between"><span className="flex items-center gap-2 text-body"><span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} /> {c.name}</span><span className="num">{formatINR(c.value)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="surface-elev p-6">
          <h3 className="heading-card mb-3">Top merchants</h3>
          {stats.topMerchants.length === 0 ? <p className="text-sm text-muted">No merchants this month.</p> : (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {stats.topMerchants.slice(0, 5).map((m) => (
                <li key={m.name} className="flex justify-between py-2.5"><span className="text-body">{m.name}</span><span className="num text-foreground">{formatINR(m.value)}</span></li>
              ))}
            </ul>
          )}
        </div>
        <div className="surface-elev p-6">
          <h3 className="heading-card mb-3">Linked outflows</h3>
          <p className="mb-3 text-xs text-muted">Transaction categories tied to other sections</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-between rounded-md border border-[var(--border-subtle)] p-3">
              <span className="flex items-center gap-2 text-body"><TrendingUp className="h-4 w-4 text-accent" /> Investment (from txns)</span>
              <span className="num text-foreground">{formatINR(stats.investmentOutflow)}</span>
            </li>
            <li className="flex items-center justify-between rounded-md border border-[var(--border-subtle)] p-3">
              <span className="flex items-center gap-2 text-body"><CreditCard className="h-4 w-4 text-accent" /> EMI (from txns)</span>
              <span className="num text-foreground">{formatINR(stats.emiOutflow)}</span>
            </li>
            <li className="flex items-center justify-between rounded-md border border-[var(--border-subtle)] p-3">
              <span className="flex items-center gap-2 text-body"><TrendingUp className="h-4 w-4 text-muted" /> Portfolio (holdings)</span>
              <Link to="/investments" className="num text-accent">{formatINR(totalPortfolio)} →</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
