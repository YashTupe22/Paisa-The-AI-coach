import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn, c as computeHealthScore } from "./health-score.functions-DfT1C-uF.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { a as formatINR, f as formatDate } from "./format-uDnLSmtZ.mjs";
import { a as currentMonthKey, c as computePeriodStats, m as monthRange } from "./finance-stats-DagrJW-9.mjs";
import "../_libs/seroval.mjs";
import { l as LoaderCircle, g as Sparkles, o as Bell, p as ArrowUpRight, q as ArrowDownRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "./server-BTM9F0kO.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-DT31IUtl.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Dashboard() {
  const qc = useQueryClient();
  const computeFn = useServerFn(computeHealthScore);
  const scoringRef = reactExports.useRef(false);
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
      const {
        data
      } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    }
  });
  const {
    data: txns = []
  } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("transactions").select("*").order("date", {
        ascending: false
      }).limit(8);
      return data ?? [];
    }
  });
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("*")).data ?? []
  });
  const {
    data: goals = []
  } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => (await supabase.from("goals").select("*").order("created_at")).data ?? []
  });
  const {
    data: investments = []
  } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => (await supabase.from("investments").select("current_value,invested_amount")).data ?? []
  });
  const {
    data: insights = []
  } = useQuery({
    queryKey: ["insights"],
    queryFn: async () => (await supabase.from("ai_insights").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const {
    data: score,
    isLoading: scoreLoading
  } = useQuery({
    queryKey: ["score"],
    queryFn: async () => (await supabase.from("financial_health_scores").select("*").order("calculated_at", {
      ascending: false
    }).limit(1).maybeSingle()).data
  });
  const totalBalance = accounts.reduce((s, a) => s + Number(a.balance ?? 0), 0);
  const totalInvestments = investments.reduce((s, i) => s + Number(i.current_value ?? 0), 0);
  const monthlyIncome = Number(profile?.monthly_income ?? 0);
  const {
    data: monthTxns = []
  } = useQuery({
    queryKey: ["period-txns", currentMonthKey()],
    queryFn: async () => {
      const {
        start,
        end
      } = monthRange(currentMonthKey());
      const {
        data
      } = await supabase.from("transactions").select("amount,type,category,merchant_name,date").gte("date", start).lte("date", end);
      return data ?? [];
    }
  });
  const {
    data: prevMonthTxns = []
  } = useQuery({
    queryKey: ["period-txns", (() => {
      const d = /* @__PURE__ */ new Date();
      d.setMonth(d.getMonth() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    })()],
    queryFn: async () => {
      const d = /* @__PURE__ */ new Date();
      d.setMonth(d.getMonth() - 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const {
        start,
        end
      } = monthRange(key);
      const {
        data
      } = await supabase.from("transactions").select("amount,type,date").gte("date", start).lte("date", end);
      return data ?? [];
    }
  });
  const periodStats = computePeriodStats(monthTxns, monthlyIncome);
  const prevStats = computePeriodStats(prevMonthTxns, monthlyIncome);
  const monthExpenses = periodStats.expense;
  const savingsRate = periodStats.savingsRate;
  const expenseChange = prevStats.expense > 0 ? Math.round((monthExpenses - prevStats.expense) / prevStats.expense * 100) : 0;
  const scoreStale = !score || Date.now() - new Date(score.calculated_at).getTime() > 24 * 60 * 60 * 1e3;
  const hasData = monthTxns.length > 0 || accounts.length > 0 || investments.length > 0;
  reactExports.useEffect(() => {
    if (!profile?.onboarding_complete || !hasData || !scoreStale || scoringRef.current) return;
    scoringRef.current = true;
    computeFn({
      data: void 0
    }).then(() => {
      qc.invalidateQueries({
        queryKey: ["score"]
      });
      qc.invalidateQueries({
        queryKey: ["insights"]
      });
    }).catch(() => {
      scoringRef.current = false;
    });
  }, [profile?.onboarding_complete, hasData, scoreStale, computeFn, qc]);
  const scoreVal = score?.total_score ?? null;
  const scoreColor = scoreVal == null ? "text-muted" : scoreVal < 40 ? "text-destructive" : scoreVal < 70 ? "text-[#eab308]" : "text-success";
  const computing = scoreLoading || scoreStale && hasData && scoreVal == null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section", children: "Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted", children: [
          "Welcome back",
          profile?.name ? `, ${profile.name.split(" ")[0]}` : "",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `pill ${scoreColor}`, children: [
          computing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
          computing ? "Scoring…" : scoreVal != null ? `Health ${scoreVal}/100` : "Add data for score"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "relative grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Total balance", value: formatINR(totalBalance), sub: `${accounts.length} account${accounts.length !== 1 ? "s" : ""}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Monthly income", value: formatINR(monthlyIncome), sub: "From profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Monthly expenses", value: formatINR(monthExpenses), change: expenseChange, invertColor: true, sub: `${periodStats.txnCount} transactions` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { label: "Investments", value: formatINR(totalInvestments), sub: periodStats.investmentOutflow > 0 ? `${formatINR(periodStats.investmentOutflow)} invested this month` : `${savingsRate}% savings rate` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Expense breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/reports", className: "text-xs text-accent", children: "Full report →" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExpenseBreakdown, { categories: periodStats.byCategory, total: periodStats.expense, txnCount: periodStats.txnCount }),
        (periodStats.investmentOutflow > 0 || periodStats.emiOutflow > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-wrap gap-3 border-t border-[var(--border-subtle)] pt-4 text-xs", children: [
          periodStats.investmentOutflow > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/investments", className: "rounded-md border border-[var(--border)] px-3 py-1.5 text-body hover:bg-[var(--hover)]", children: [
            "Investment outflow: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(periodStats.investmentOutflow) })
          ] }),
          periodStats.emiOutflow > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/emi", className: "rounded-md border border-[var(--border)] px-3 py-1.5 text-body hover:bg-[var(--hover)]", children: [
            "EMI paid: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(periodStats.emiOutflow) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Financial health" }),
        scoreVal != null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `num mt-3 text-5xl ${scoreColor}`, children: [
            scoreVal,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base text-subtle", children: "/100" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-3", children: [["Savings rate", score.savings_score], ["Debt ratio", score.debt_score], ["Emergency fund", score.emergency_score], ["Investment rate", score.investment_score]].map(([l, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: l }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: v })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-[var(--border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-accent", style: {
              width: `${v}%`
            } }) })
          ] }, l)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-sm text-muted", children: [
          hasData ? "AI is calculating your score…" : "Add transactions, accounts, or investments to get your AI-powered health score.",
          !hasData && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "mt-2 block text-accent", children: "Upload a statement →" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Recent transactions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/transactions", className: "text-xs text-accent", children: "View all" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 divide-y divide-[var(--border-subtle)]", children: [
          txns.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-md bg-[var(--hover)] text-xs text-foreground", children: t.merchant_name?.[0] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: t.merchant_name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted", children: [
                  formatDate(t.date),
                  " · ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill !h-5 !px-2 !text-[10px]", children: t.category })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `num text-sm ${t.type === "debit" ? "text-destructive" : "text-success"}`, children: [
              t.type === "debit" ? "-" : "+",
              formatINR(Number(t.amount))
            ] })
          ] }, t.id)),
          txns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyRow, { label: "No transactions yet — upload a statement in Settings" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Active goals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
          goals.map((g) => {
            const pct = Math.min(100, Math.round(Number(g.current_amount) / Number(g.target_amount) * 100));
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-[var(--border-subtle)] p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: g.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "num text-xs text-muted", children: [
                  pct,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1.5 rounded-full bg-[var(--border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-accent", style: {
                width: `${pct}%`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex justify-between text-xs text-muted", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num", children: [
                  formatINR(Number(g.current_amount), {
                    compact: true
                  }),
                  " / ",
                  formatINR(Number(g.target_amount), {
                    compact: true
                  })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: g.deadline ? formatDate(g.deadline) : "—" })
              ] })
            ] }, g.id);
          }),
          goals.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyRow, { label: "No goals yet" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev mt-4 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "AI Insights" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-3 overflow-x-auto pb-2", children: [
        insights.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-[280px] max-w-[320px] rounded-md border border-[var(--border)] border-l-2 border-l-accent bg-[rgba(255,255,255,0.02)] p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-accent", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3" }),
            " ",
            i.type
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm font-medium text-foreground", children: i.heading }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-body", children: i.body }),
          i.cta_label && i.cta_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: i.cta_url, className: "mt-3 inline-block text-xs text-accent", children: [
            i.cta_label,
            " →"
          ] })
        ] }, i.id)),
        insights.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyRow, { label: hasData ? "Insights will appear after your health score is calculated" : "Add financial data to get AI insights" })
      ] })
    ] })
  ] });
}
function SummaryCard({
  label,
  value,
  change,
  invertColor,
  sub
}) {
  const positive = change != null ? invertColor ? change < 0 : change > 0 : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wide text-muted", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-foreground", children: value }),
    change != null && change !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-1 flex items-center gap-1 text-xs ${positive ? "text-success" : "text-destructive"}`, children: [
      positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3 w-3" }),
      " ",
      Math.abs(change),
      "% vs last month"
    ] }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted", children: sub })
  ] });
}
function ExpenseBreakdown({
  categories,
  total,
  txnCount
}) {
  const colors = ["#7170ff", "#27a644", "#eab308", "#ec4899", "#3b82f6", "#f97316", "#8a8f98"];
  let acc = 0;
  const denom = total || 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap items-center gap-8", children: categories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full py-6 text-center text-sm text-muted", children: [
    "No categorized expenses yet.",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "mt-2 block text-accent", children: "Upload a statement for AI categorization →" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 42 42", className: "h-44 w-44", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "21", cy: "21", r: "15.9", fill: "transparent", stroke: "var(--border)", strokeWidth: "6" }),
      categories.map(({
        name,
        value
      }, i) => {
        const dash = value / denom * 100;
        const offset = 100 - acc;
        acc += dash;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "21", cy: "21", r: "15.9", fill: "transparent", stroke: colors[i % colors.length], strokeWidth: "6", strokeDasharray: `${dash} ${100 - dash}`, strokeDashoffset: offset, transform: "rotate(-90 21 21)" }, name);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "21", y: "22", textAnchor: "middle", className: "num", fontSize: "4", fill: "var(--foreground)", children: formatINR(total, {
        compact: true
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "flex-1 space-y-1.5 text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "mb-2 text-subtle", children: [
        txnCount,
        " transactions this month"
      ] }),
      categories.map(({
        name,
        value
      }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-sm", style: {
            background: colors[i % colors.length]
          } }),
          " ",
          name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-foreground", children: [
          formatINR(value),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-subtle", children: [
            "(",
            Math.round(value / denom * 100),
            "%)"
          ] })
        ] })
      ] }, name))
    ] })
  ] }) });
}
function EmptyRow({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-sm text-muted", children: label });
}
export {
  Dashboard as component
};
