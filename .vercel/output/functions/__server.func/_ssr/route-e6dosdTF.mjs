import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { d as useRouterState, e as useNavigate, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useTheme } from "./router-4-xoO-pc.mjs";
import { b as buildFinancialSnapshot, s as snapshotToJson } from "./financial-context-bu61lb7q.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { W as Wallet, L as LayoutDashboard, R as Receipt, T as Target, a as TrendingUp, C as Calendar, M as MessageSquareText, b as ChartColumn, S as Settings, c as Sun, d as Moon, e as LogOut, f as MessageCircle, g as Sparkles, X, h as Send } from "../_libs/lucide-react.mjs";
import { M as Markdown } from "../_libs/react-markdown.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./ai-gateway.server-DVFdLzU8.mjs";
import "../_libs/ai-sdk__openai-compatible.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/zod.mjs";
import "../_libs/ai.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/@vercel/oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
import "../_libs/devlop.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/remark-rehype.mjs";
import "../_libs/mdast-util-to-hast.mjs";
import "../_libs/ungap__structured-clone.mjs";
import "../_libs/micromark-util-sanitize-uri.mjs";
import "../_libs/unist-util-position.mjs";
import "../_libs/trim-lines.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/hast-util-to-jsx-runtime.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/property-information.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/style-to-js.mjs";
import "../_libs/style-to-object.mjs";
import "../_libs/inline-style-parser.mjs";
import "../_libs/hast-util-whitespace.mjs";
import "../_libs/estree-util-is-identifier-name.mjs";
import "../_libs/html-url-attributes.mjs";
function FloatingChat() {
  const [open, setOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [streaming, setStreaming] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);
  async function send(text) {
    if (!text.trim() || streaming) return;
    const userMsg = { id: crypto.randomUUID(), role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);
    const aid = crypto.randomUUID();
    setMessages((m) => [...m, { id: aid, role: "assistant", content: "" }]);
    try {
      const snapshot = await buildFinancialSnapshot();
      const ctx = snapshot ? snapshotToJson(snapshot) : "";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userContext: ctx,
          messages: next.slice(-10).map((m) => ({ role: m.role, content: m.content }))
        })
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => m.map((x) => x.id === aid ? { ...x, content: acc } : x));
      }
    } catch {
      toast.error("AI request failed");
      setMessages((m) => m.filter((x) => x.id !== aid));
    } finally {
      setStreaming(false);
    }
  }
  if (!open) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(true), className: "fixed bottom-20 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-lg md:bottom-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-20 right-4 z-50 flex h-[min(480px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-panel shadow-xl md:bottom-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-[var(--border)] px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-accent" }),
        " AI Coach"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "text-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 space-y-3 overflow-y-auto p-4", children: [
      messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted", children: "Ask about your spending, goals, or health score." }),
      messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-md px-3 py-2 text-sm ${m.role === "user" ? "ml-8 bg-accent/10 text-foreground" : "mr-8 bg-[var(--hover)] text-body"}`, children: m.role === "assistant" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { children: m.content || "…" }) : m.content }, m.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "flex gap-2 border-t border-[var(--border)] p-3", onSubmit: (e) => {
      e.preventDefault();
      send(input);
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field flex-1", placeholder: "Ask anything…", value: input, onChange: (e) => setInput(e.target.value), disabled: streaming }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: streaming || !input.trim(), className: "btn-primary !px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
    ] })
  ] });
}
const TABLES = ["transactions", "bank_accounts", "goals", "investments", "loans", "ai_insights", "financial_health_scores", "profiles"];
function useRealtimeInvalidate() {
  const qc = useQueryClient();
  reactExports.useEffect(() => {
    const channel = supabase.channel("app-data-changes");
    TABLES.forEach((t) => {
      channel.on("postgres_changes", { event: "*", schema: "public", table: t }, () => {
        qc.invalidateQueries();
      });
    });
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
}
const NAV = [{
  to: "/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard
}, {
  to: "/transactions",
  label: "Transactions",
  icon: Receipt
}, {
  to: "/goals",
  label: "Goals",
  icon: Target
}, {
  to: "/investments",
  label: "Investments",
  icon: TrendingUp
}, {
  to: "/emi",
  label: "EMI Tracker",
  icon: Calendar
}, {
  to: "/chat",
  label: "AI Chat",
  icon: MessageSquareText
}, {
  to: "/reports",
  label: "Reports",
  icon: ChartColumn
}, {
  to: "/settings",
  label: "Settings",
  icon: Settings
}];
function AuthedLayout() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const navigate = useNavigate();
  const {
    theme,
    toggle
  } = useTheme();
  useRealtimeInvalidate();
  const isOnboarding = pathname === "/onboarding";
  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({
      to: "/auth/login",
      replace: true
    });
  }
  if (isOnboarding) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-14 items-center gap-2 border-b border-[var(--border)] px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tracking-tight text-foreground", children: "Paisa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-[240px] shrink-0 flex-col border-r border-[var(--border)] bg-panel md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center gap-2 px-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tracking-tight text-foreground", children: "Paisa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 space-y-0.5 px-2 py-2", children: NAV.map(({
        to,
        label,
        icon: Icon
      }) => {
        const active = pathname === to || pathname.startsWith(to + "/");
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: `group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-[var(--hover)] text-foreground" : "text-body hover:bg-[var(--hover)] hover:text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `block h-4 w-0.5 rounded-full ${active ? "bg-accent" : "bg-transparent"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
        ] }, to);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "m-2 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: toggle, className: "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-[var(--hover)] hover:text-foreground", children: [
          theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }),
          theme === "dark" ? "Light mode" : "Dark mode"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-[var(--hover)] hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
          " Sign out"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 pb-16 md:pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-[var(--border)] bg-panel py-1.5 md:hidden", children: NAV.slice(0, 5).map(({
      to,
      label,
      icon: Icon
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-muted [&.active]:text-accent", activeProps: {
      className: "active"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      " ",
      label
    ] }, to)) }),
    !pathname.startsWith("/chat") && /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingChat, {})
  ] });
}
export {
  AuthedLayout as component
};
