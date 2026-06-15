import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { id: string; role: "user" | "assistant"; content: string };

async function buildUserContext(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "";
  const [profile, accounts, txns, goals, loans, investments] = await Promise.all([
    supabase.from("profiles").select("name,monthly_income,monthly_expenses,city,age").eq("id", user.id).maybeSingle(),
    supabase.from("bank_accounts").select("account_name,account_type,balance,outstanding_balance"),
    supabase.from("transactions").select("date,merchant_name,category,type,amount").order("date", { ascending: false }).limit(30),
    supabase.from("goals").select("name,target_amount,current_amount,deadline"),
    supabase.from("loans").select("name,principal,outstanding,emi_amount,interest_rate"),
    supabase.from("investments").select("name,type,current_value,invested_amount"),
  ]);
  const monthStart = new Date(); monthStart.setDate(1);
  const monthTxns = (txns.data ?? []).filter((t) => new Date(t.date) >= monthStart);
  const monthExpense = monthTxns.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const monthIncome = monthTxns.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const byCat: Record<string, number> = {};
  monthTxns.filter((t) => t.type === "debit").forEach((t) => { byCat[t.category || "Other"] = (byCat[t.category || "Other"] || 0) + Number(t.amount); });

  return JSON.stringify({
    profile: profile.data,
    totalBalance: (accounts.data ?? []).reduce((s, a) => s + Number(a.balance ?? 0), 0),
    accounts: accounts.data,
    thisMonth: { income: monthIncome, expense: monthExpense, byCategory: byCat },
    recentTransactions: (txns.data ?? []).slice(0, 15),
    goals: goals.data,
    loans: loans.data,
    investments: investments.data,
  });
}

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
      const ctx = await buildUserContext();
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

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-50 grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 md:bottom-6 md:right-6"
        aria-label="AI Coach"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-36 right-4 z-50 flex h-[520px] max-h-[80vh] w-[360px] max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-[var(--border)] bg-panel shadow-2xl md:bottom-24 md:right-6">
          <header className="flex h-12 items-center gap-2 border-b border-[var(--border)] px-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">AI Coach</span>
            <span className="ml-auto text-[10px] text-subtle">Uses your data</span>
          </header>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <div className="space-y-2 text-center text-xs text-muted">
                <p>Ask me anything about your money.</p>
                <div className="grid gap-1.5">
                  {["How much did I spend this month?", "Where can I cut expenses?", "Am I on track for my goals?"].map((s) => (
                    <button key={s} onClick={() => send(s)} className="rounded-md border border-[var(--border)] px-2 py-1.5 text-left text-xs text-body hover:bg-[var(--hover)]">{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <div className={m.role === "user"
                    ? "max-w-[85%] rounded-lg bg-primary px-3 py-1.5 text-xs text-white"
                    : "max-w-[90%] rounded-lg bg-[var(--card)] px-3 py-1.5 text-xs text-body prose prose-sm prose-invert"
                  }>
                    {m.role === "assistant" ? <ReactMarkdown>{m.content || "…"}</ReactMarkdown> : m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-[var(--border)] p-2">
            <div className="flex items-end gap-1.5">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Ask…"
                rows={1}
                className="input-field max-h-24 min-h-9 resize-none !py-1.5 text-xs"
              />
              <button type="submit" disabled={!input.trim() || streaming} className="btn-primary h-9 w-9 !p-0"><Send className="h-3.5 w-3.5" /></button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
