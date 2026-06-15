import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { b as buildFinancialSnapshot, s as snapshotToJson } from "./financial-context-bu61lb7q.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, g as Sparkles, h as Send } from "../_libs/lucide-react.mjs";
import { M as Markdown } from "../_libs/react-markdown.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
const SUGGESTIONS = ["How much did I spend on food last month?", "Am I on track for my retirement goal?", "Where can I cut expenses?", "Explain my financial health score"];
function ChatPage() {
  const [sessions, setSessions] = reactExports.useState([]);
  const [activeId, setActiveId] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [input, setInput] = reactExports.useState("");
  const [streaming, setStreaming] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  async function loadSessions() {
    const {
      data
    } = await supabase.from("chat_sessions").select("id,title,created_at").order("created_at", {
      ascending: false
    });
    setSessions(data ?? []);
  }
  reactExports.useEffect(() => {
    loadSessions();
  }, []);
  reactExports.useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    supabase.from("chat_messages").select("id,role,content").eq("session_id", activeId).order("created_at").then(({
      data
    }) => {
      setMessages(data ?? []);
    });
  }, [activeId]);
  reactExports.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, streaming]);
  async function newSession() {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const {
      data
    } = await supabase.from("chat_sessions").insert({
      user_id: user.id,
      title: "New chat"
    }).select().single();
    if (data) {
      await loadSessions();
      setActiveId(data.id);
    }
  }
  async function buildUserContext() {
    const snapshot = await buildFinancialSnapshot();
    return snapshot ? snapshotToJson(snapshot) : "";
  }
  async function send(text) {
    if (!text.trim() || streaming) return;
    let sessionId = activeId;
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    if (!sessionId) {
      const {
        data
      } = await supabase.from("chat_sessions").insert({
        user_id: user.id,
        title: text.slice(0, 40)
      }).select().single();
      if (!data) return;
      sessionId = data.id;
      setActiveId(sessionId);
      await loadSessions();
    }
    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text
    };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput("");
    await supabase.from("chat_messages").insert({
      session_id: sessionId,
      user_id: user.id,
      role: "user",
      content: text
    });
    setStreaming(true);
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, {
      id: assistantId,
      role: "assistant",
      content: ""
    }]);
    try {
      const userContext = await buildUserContext();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userContext,
          messages: nextMsgs.slice(-10).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const {
          done,
          value
        } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, {
          stream: true
        });
        setMessages((m) => m.map((x) => x.id === assistantId ? {
          ...x,
          content: acc
        } : x));
      }
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        user_id: user.id,
        role: "assistant",
        content: acc
      });
    } catch (e) {
      toast.error("AI request failed");
      setMessages((m) => m.filter((x) => x.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden flex-col border-r border-[var(--border)] bg-panel md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: newSession, className: "btn-ghost w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " New chat"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-2", children: sessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveId(s.id), className: `mb-0.5 w-full rounded-md px-3 py-2 text-left text-sm ${activeId === s.id ? "bg-[var(--hover)] text-foreground" : "text-body hover:bg-[var(--hover)]"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate", children: s.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-subtle", children: new Date(s.created_at).toLocaleDateString("en-IN") })
      ] }, s.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex h-screen flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-14 items-center gap-2 border-b border-[var(--border)] px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-medium text-foreground", children: "AI Coach" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: scrollRef, className: "flex-1 overflow-y-auto px-4 py-6 md:px-12", children: [
        messages.length === 0 && !streaming && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--card)] text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-card mt-4", children: "How can I help with your money today?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-2 sm:grid-cols-2", children: SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send(s), className: "rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3 text-left text-sm text-body hover:bg-[var(--hover)]", children: s }, s)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl space-y-4", children: [
          messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: m.role === "user" ? "flex justify-end" : "flex gap-3", children: [
            m.role === "assistant" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--card)] text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: m.role === "user" ? "max-w-[80%] rounded-lg bg-primary px-3.5 py-2 text-sm text-foreground" : "max-w-[85%] rounded-lg bg-[var(--card)] px-3.5 py-2 text-sm text-body prose prose-invert prose-sm", children: m.role === "assistant" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Markdown, { children: m.content || "…" }) : m.content })
          ] }, m.id)),
          streaming && messages[messages.length - 1]?.role === "user" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 grid h-7 w-7 place-items-center rounded-full bg-[var(--card)] text-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 rounded-lg bg-[var(--card)] px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, {}),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 150 }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 300 })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: (e) => {
        e.preventDefault();
        send(input);
      }, className: "border-t border-[var(--border)] p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-2xl items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(input);
          }
        }, placeholder: "Ask anything about your money…", rows: 1, className: "input-field max-h-32 resize-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !input.trim() || streaming, className: "btn-primary h-10 w-10 !p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
      ] }) })
    ] })
  ] });
}
function Dot({
  delay = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted", style: {
    animationDelay: `${delay}ms`
  } });
}
export {
  ChatPage as component
};
