import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — Paisa" }] }),
  component: ReportsPage,
});

const COLORS = ["#4f46e5", "#16a34a", "#eab308", "#ec4899", "#3b82f6", "#f97316", "#64748b"];

function ReportsPage() {
  const today = new Date();
  const [month, setMonth] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);

  const { data: txns = [] } = useQuery({
    queryKey: ["reports-txns", month],
    queryFn: async () => {
      const [y, m] = month.split("-").map(Number);
      const start = new Date(y, m - 1, 1).toISOString().slice(0, 10);
      const end = new Date(y, m, 0).toISOString().slice(0, 10);
      const { data } = await supabase.from("transactions").select("amount,type,category,merchant_name,date").gte("date", start).lte("date", end);
      return data ?? [];
    },
  });

  const { data: trend = [] } = useQuery({
    queryKey: ["reports-trend"],
    queryFn: async () => {
      const start = new Date(); start.setMonth(start.getMonth() - 5); start.setDate(1);
      const { data } = await supabase.from("transactions").select("amount,type,date").gte("date", start.toISOString().slice(0, 10));
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    const income = txns.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
    const expense = txns.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
    const savings = income - expense;
    const byCat: Record<string, number> = {};
    const byMerchant: Record<string, number> = {};
    txns.filter((t) => t.type === "debit").forEach((t) => {
      const c = t.category || "Other"; byCat[c] = (byCat[c] || 0) + Number(t.amount);
      byMerchant[t.merchant_name] = (byMerchant[t.merchant_name] || 0) + Number(t.amount);
    });
    return {
      income, expense, savings,
      byCat: Object.entries(byCat).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      topMerchants: Object.entries(byMerchant).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5),
    };
  }, [txns]);

  const monthlyTrend = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    trend.forEach((t) => {
      const k = t.date.slice(0, 7);
      if (!map[k]) map[k] = { income: 0, expense: 0 };
      if (t.type === "credit") map[k].income += Number(t.amount); else map[k].expense += Number(t.amount);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({ month: k.slice(5), ...v }));
  }, [trend]);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="heading-section">Reports</h1><p className="mt-1 text-sm text-muted">Monthly cashflow and breakdowns.</p></div>
        <div className="flex gap-2">
          <input type="month" className="input-field max-w-[160px]" value={month} onChange={(e) => setMonth(e.target.value)} />
          <button onClick={() => window.print()} className="btn-ghost"><Printer className="h-4 w-4" /> Print / PDF</button>
        </div>
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Income</div><div className="num mt-2 text-2xl text-success">{formatINR(stats.income)}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Expense</div><div className="num mt-2 text-2xl text-destructive">{formatINR(stats.expense)}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Savings</div><div className={`num mt-2 text-2xl ${stats.savings >= 0 ? "text-foreground" : "text-destructive"}`}>{formatINR(stats.savings)}</div></div>
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
          {stats.byCat.length === 0 ? <p className="text-sm text-muted">No spend this month.</p> : (
            <div className="flex gap-6">
              <div className="h-48 w-48"><ResponsiveContainer>
                <PieChart><Pie data={stats.byCat} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>{stats.byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} /></PieChart>
              </ResponsiveContainer></div>
              <ul className="flex-1 space-y-1 text-xs">
                {stats.byCat.map((c, i) => (
                  <li key={c.name} className="flex justify-between"><span className="flex items-center gap-2 text-body"><span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} /> {c.name}</span><span className="num">{formatINR(c.value)}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="surface-elev p-6">
        <h3 className="heading-card mb-3">Top merchants</h3>
        {stats.topMerchants.length === 0 ? <p className="text-sm text-muted">No merchants this month.</p> : (
          <ul className="divide-y divide-[var(--border-subtle)]">
            {stats.topMerchants.map((m) => (
              <li key={m.name} className="flex justify-between py-2.5"><span className="text-body">{m.name}</span><span className="num text-foreground">{formatINR(m.value)}</span></li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
