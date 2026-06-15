import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { buildFinancialSnapshot, snapshotToJson } from "@/lib/financial-context";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, streaming]);

  async function send(text: string) {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text };
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
          messages: next.slice(-10).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => m.map((x) => (x.id === aid ? { ...x, content: acc } : x)));
      }
    } catch {
      toast.error("AI request failed");
      setMessages((m) => m.filter((x) => x.id !== aid));
    } finally {
      setStreaming(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-lg md:bottom-6">
        <MessageCircle className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex h-[min(480px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-panel shadow-xl md:bottom-6">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground"><Sparkles className="h-4 w-4 text-accent" /> AI Coach</div>
        <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-center text-xs text-muted">Ask about your spending, goals, or health score.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`rounded-md px-3 py-2 text-sm ${m.role === "user" ? "ml-8 bg-accent/10 text-foreground" : "mr-8 bg-[var(--hover)] text-body"}`}>
            {m.role === "assistant" ? <ReactMarkdown>{m.content || "…"}</ReactMarkdown> : m.content}
          </div>
        ))}
      </div>
      <form className="flex gap-2 border-t border-[var(--border)] p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input className="input-field flex-1" placeholder="Ask anything…" value={input} onChange={(e) => setInput(e.target.value)} disabled={streaming} />
        <button type="submit" disabled={streaming || !input.trim()} className="btn-primary !px-3"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}
