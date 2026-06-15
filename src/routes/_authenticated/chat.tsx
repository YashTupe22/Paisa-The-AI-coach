import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildFinancialSnapshot, snapshotToJson } from "@/lib/financial-context";
import { Sparkles, Send, Plus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
export const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({ meta: [{ title: "AI Chat — Paisa" }] }),
  component: ChatPage,
});

type Msg = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How much did I spend on food last month?",
  "Am I on track for my retirement goal?",
  "Where can I cut expenses?",
  "Explain my financial health score",
];

function ChatPage() {
  const [sessions, setSessions] = useState<Array<{ id: string; title: string; created_at: string }>>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function loadSessions() {
    const { data } = await supabase.from("chat_sessions").select("id,title,created_at").order("created_at", { ascending: false });
    setSessions(data ?? []);
  }
  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    supabase.from("chat_messages").select("id,role,content").eq("session_id", activeId).order("created_at").then(({ data }) => {
      setMessages((data ?? []) as Msg[]);
    });
  }, [activeId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, streaming]);

  async function newSession() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("chat_sessions").insert({ user_id: user.id, title: "New chat" }).select().single();
    if (data) { await loadSessions(); setActiveId(data.id); }
  }

  async function buildUserContext(): Promise<string> {
    const snapshot = await buildFinancialSnapshot();
    return snapshot ? snapshotToJson(snapshot) : "";
  }

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    let sessionId = activeId;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!sessionId) {
      const { data } = await supabase.from("chat_sessions").insert({ user_id: user.id, title: text.slice(0, 40) }).select().single();
      if (!data) return;
      sessionId = data.id;
      setActiveId(sessionId);
      await loadSessions();
    }
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput("");
    await supabase.from("chat_messages").insert({ session_id: sessionId, user_id: user.id, role: "user", content: text });

    setStreaming(true);
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const userContext = await buildUserContext();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userContext,
          messages: nextMsgs.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => m.map((x) => (x.id === assistantId ? { ...x, content: acc } : x)));
      }
      await supabase.from("chat_messages").insert({ session_id: sessionId, user_id: user.id, role: "assistant", content: acc });
    } catch (e) {
      toast.error("AI request failed");
      setMessages((m) => m.filter((x) => x.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="hidden flex-col border-r border-[var(--border)] bg-panel md:flex">
        <div className="p-3">
          <button onClick={newSession} className="btn-ghost w-full"><Plus className="h-4 w-4" /> New chat</button>
        </div>
        <div className="flex-1 overflow-y-auto px-2">
          {sessions.map((s) => (
            <button key={s.id} onClick={() => setActiveId(s.id)} className={`mb-0.5 w-full rounded-md px-3 py-2 text-left text-sm ${activeId === s.id ? "bg-[var(--hover)] text-foreground" : "text-body hover:bg-[var(--hover)]"}`}>
              <div className="truncate">{s.title}</div>
              <div className="text-[10px] text-subtle">{new Date(s.created_at).toLocaleDateString("en-IN")}</div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex h-screen flex-col">
        <header className="flex h-14 items-center gap-2 border-b border-[var(--border)] px-6">
          <Sparkles className="h-4 w-4 text-accent" />
          <h1 className="text-sm font-medium text-foreground">AI Coach</h1>
        </header>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-12">
          {messages.length === 0 && !streaming && (
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--card)] text-accent"><Sparkles className="h-5 w-5" /></div>
              <h2 className="heading-card mt-4">How can I help with your money today?</h2>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3 text-left text-sm text-body hover:bg-[var(--hover)]">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mx-auto max-w-2xl space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
                {m.role === "assistant" && <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--card)] text-accent"><Sparkles className="h-3.5 w-3.5" /></div>}
                <div className={m.role === "user" ? "max-w-[80%] rounded-lg bg-primary px-3.5 py-2 text-sm text-foreground" : "max-w-[85%] rounded-lg bg-[var(--card)] px-3.5 py-2 text-sm text-body prose prose-invert prose-sm"}>
                  {m.role === "assistant" ? <ReactMarkdown>{m.content || "…"}</ReactMarkdown> : m.content}
                </div>
              </div>
            ))}
            {streaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="mt-1 grid h-7 w-7 place-items-center rounded-full bg-[var(--card)] text-accent"><Sparkles className="h-3.5 w-3.5" /></div>
                <div className="flex gap-1 rounded-lg bg-[var(--card)] px-4 py-3">
                  <Dot /> <Dot delay={150} /> <Dot delay={300} />
                </div>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-[var(--border)] p-4">
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about your money…"
              rows={1}
              className="input-field max-h-32 resize-none"
            />
            <button type="submit" disabled={!input.trim() || streaming} className="btn-primary h-10 w-10 !p-0"><Send className="h-4 w-4" /></button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Dot({ delay = 0 }: { delay?: number }) {
  return <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${delay}ms` }} />;
}
