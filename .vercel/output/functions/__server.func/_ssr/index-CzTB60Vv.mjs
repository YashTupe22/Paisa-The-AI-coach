import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { W as Wallet, g as Sparkles, A as ArrowRight, i as ShieldCheck, a as TrendingUp, M as MessageSquareText } from "../_libs/lucide-react.mjs";
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
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-body", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-[var(--border-subtle)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tracking-tight", children: "Paisa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", className: "text-sm text-muted hover:text-foreground", children: "Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", className: "btn-primary", children: "Get started" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-16 py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-accent" }),
            " AI built for Indian money"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "display-1 mt-6 max-w-[18ch]", children: "Your AI‑powered financial coach." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 max-w-[52ch] text-body text-[17px] leading-relaxed", children: "Paisa connects your bank, UPI and credit cards, then quietly works in the background — categorising spends, scoring your financial health, and answering money questions in plain language." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth/register", className: "btn-primary", children: [
              "Get started free ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#how", className: "btn-ghost", children: "See how it works" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-6 text-xs text-subtle", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
              " Bank-grade encryption"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
              " Live goal tracking"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareText, { className: "h-3.5 w-3.5" }),
              " 24×7 AI advisor"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardPreview, {})
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "how", className: "border-t border-[var(--border-subtle)] py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-section max-w-[24ch]", children: "Built for the way India actually spends." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid gap-4 md:grid-cols-3", children: [{
          t: "Connect everything",
          d: "Bank statements, UPI apps and credit cards in one place."
        }, {
          t: "AI categorisation",
          d: "Every transaction tagged automatically and explained."
        }, {
          t: "Ask anything",
          d: "Chat with an advisor that knows PPF, NPS, ELSS and your spends."
        }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "heading-card", children: f.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted", children: f.d })
        ] }, f.t)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t border-[var(--border-subtle)] py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-subtle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Paisa"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Made in India" })
    ] }) })
  ] });
}
function DashboardPreview() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev relative overflow-hidden p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted", children: "Total balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-1 text-2xl text-foreground", children: "₹4,82,310" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill text-success", children: "+8.4% MoM" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-2 gap-3", children: [{
      l: "Income",
      v: "₹1,20,000",
      c: "text-success"
    }, {
      l: "Expenses",
      v: "₹68,420",
      c: "text-destructive"
    }, {
      l: "Savings rate",
      v: "43%",
      c: "text-foreground"
    }, {
      l: "Health score",
      v: "72/100",
      c: "text-accent"
    }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted", children: s.l }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `num mt-1 text-base ${s.c}`, children: s.v })
    ] }, s.l)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-md border border-[var(--border)] p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted", children: "This week's spend" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex items-end gap-1.5", children: [20, 35, 24, 48, 30, 60, 42].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 rounded-sm bg-accent/40", style: {
        height: `${h}px`
      } }, i)) })
    ] })
  ] });
}
export {
  Landing as component
};
