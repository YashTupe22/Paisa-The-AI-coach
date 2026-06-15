import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { a as formatINR } from "./format-uDnLSmtZ.mjs";
import { c as computePeriodStats, m as monthRange } from "./finance-stats-DagrJW-9.mjs";
import { m as Printer, a as TrendingUp, k as CreditCard } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar, P as PieChart, b as Pie, c as Cell } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const COLORS = ["#4f46e5", "#16a34a", "#eab308", "#ec4899", "#3b82f6", "#f97316", "#64748b"];
function ReportsPage() {
  const today = /* @__PURE__ */ new Date();
  const [month, setMonth] = reactExports.useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      return (await supabase.from("profiles").select("monthly_income").eq("id", user.id).maybeSingle()).data;
    }
  });
  const {
    data: investments = []
  } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => (await supabase.from("investments").select("name,current_value,type")).data ?? []
  });
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["period-txns", month],
    queryFn: async () => {
      const {
        start,
        end
      } = monthRange(month);
      const {
        data
      } = await supabase.from("transactions").select("amount,type,category,merchant_name,date").gte("date", start).lte("date", end);
      return data ?? [];
    }
  });
  const {
    data: trend = []
  } = useQuery({
    queryKey: ["reports-trend"],
    queryFn: async () => {
      const start = /* @__PURE__ */ new Date();
      start.setMonth(start.getMonth() - 5);
      start.setDate(1);
      const {
        data
      } = await supabase.from("transactions").select("amount,type,date,category").gte("date", start.toISOString().slice(0, 10));
      return data ?? [];
    }
  });
  const profileIncome = Number(profile?.monthly_income ?? 0);
  const stats = reactExports.useMemo(() => computePeriodStats(txns, profileIncome), [txns, profileIncome]);
  const monthlyTrend = reactExports.useMemo(() => {
    const map = {};
    trend.forEach((t) => {
      const k = t.date.slice(0, 7);
      if (!map[k]) map[k] = {
        income: 0,
        expense: 0
      };
      if (t.type === "credit") map[k].income += Number(t.amount);
      else map[k].expense += Number(t.amount);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({
      month: k.slice(5),
      income: profileIncome > 0 ? profileIncome : v.income,
      expense: v.expense
    }));
  }, [trend, profileIncome]);
  const totalPortfolio = investments.reduce((s, i) => s + Number(i.current_value ?? 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section", children: "Reports" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: stats.txnCount > 0 ? `${stats.txnCount} transactions · same data as dashboard breakdown` : "Upload statements in Settings — AI categorizes, then data flows here" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "month", className: "input-field max-w-[160px]", value: month, onChange: (e) => setMonth(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => window.print(), className: "btn-ghost", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4" }),
          " Print / PDF"
        ] })
      ] })
    ] }),
    stats.txnCount === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev mb-4 p-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted", children: "No transaction data for this month." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "mt-2 inline-block text-sm text-accent", children: "Upload CSV, Excel, or PDF → AI will categorize →" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-success", children: formatINR(stats.income) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted", children: profileIncome > 0 ? "Profile income" : "From credits" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Expense" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-destructive", children: formatINR(stats.expense) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted", children: "From debits" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Savings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `num mt-2 text-2xl ${stats.savings >= 0 ? "text-foreground" : "text-destructive"}`, children: formatINR(stats.savings) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-muted", children: [
          stats.savingsRate,
          "% rate"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Portfolio" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-foreground", children: formatINR(totalPortfolio) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/investments", className: "mt-1 inline-block text-xs text-accent", children: "View holdings →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-3", children: "6-month cashflow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: monthlyTrend, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--border)", strokeDasharray: "3 3", vertical: false }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "month", stroke: "var(--muted)", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted)", fontSize: 12 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--card)",
            border: "1px solid var(--border)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "income", fill: "#16a34a", radius: [4, 4, 0, 0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "expense", fill: "#dc2626", radius: [4, 4, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-3", children: "Spend by category" }),
        stats.byCategory.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted", children: "No spend this month." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-48 w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: stats.byCategory, dataKey: "value", nameKey: "name", innerRadius: 40, outerRadius: 80, children: stats.byCategory.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
              background: "var(--card)",
              border: "1px solid var(--border)"
            } })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex-1 space-y-1 text-xs", children: stats.byCategory.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-sm", style: {
                background: COLORS[i % COLORS.length]
              } }),
              " ",
              c.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: formatINR(c.value) })
          ] }, c.name)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-3", children: "Top merchants" }),
        stats.topMerchants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted", children: "No merchants this month." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-[var(--border-subtle)]", children: stats.topMerchants.slice(0, 5).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-body", children: m.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(m.value) })
        ] }, m.name)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-3", children: "Linked outflows" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-muted", children: "Transaction categories tied to other sections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-md border border-[var(--border-subtle)] p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-accent" }),
              " Investment (from txns)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(stats.investmentOutflow) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-md border border-[var(--border-subtle)] p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-accent" }),
              " EMI (from txns)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(stats.emiOutflow) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-md border border-[var(--border-subtle)] p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-muted" }),
              " Portfolio (holdings)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/investments", className: "num text-accent", children: [
              formatINR(totalPortfolio),
              " →"
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ReportsPage as component
};
