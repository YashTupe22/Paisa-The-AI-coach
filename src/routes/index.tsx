import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, MessageSquareText, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Paisa — Your AI-Powered Financial Coach" },
      { name: "description", content: "Connect bank, UPI and cards. Get AI-driven expense insights, goal tracking and a personal AI financial advisor — built for India." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-body">
      <header className="border-b border-[var(--border-subtle)]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="font-medium tracking-tight">Paisa</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link to="/auth/login" className="text-sm text-muted hover:text-foreground">Sign in</Link>
            <Link to="/auth/register" className="btn-primary">Get started</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-16 py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <span className="pill"><Sparkles className="h-3 w-3 text-accent" /> AI built for Indian money</span>
            <h1 className="display-1 mt-6 max-w-[18ch]">Your AI‑powered financial coach.</h1>
            <p className="mt-6 max-w-[52ch] text-body text-[17px] leading-relaxed">
              Paisa connects your bank, UPI and credit cards, then quietly works in the background — categorising spends, scoring your financial health, and answering money questions in plain language.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/register" className="btn-primary">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how" className="btn-ghost">See how it works</a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-subtle">
              <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> Bank-grade encryption</span>
              <span className="flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5" /> Live goal tracking</span>
              <span className="flex items-center gap-2"><MessageSquareText className="h-3.5 w-3.5" /> 24×7 AI advisor</span>
            </div>
          </div>

          <DashboardPreview />
        </section>

        <section id="how" className="border-t border-[var(--border-subtle)] py-20">
          <h2 className="heading-section max-w-[24ch]">Built for the way India actually spends.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Connect everything", d: "Bank statements, UPI apps and credit cards in one place." },
              { t: "AI categorisation", d: "Every transaction tagged automatically and explained." },
              { t: "Ask anything", d: "Chat with an advisor that knows PPF, NPS, ELSS and your spends." },
            ].map((f) => (
              <div key={f.t} className="surface p-6">
                <div className="heading-card">{f.t}</div>
                <p className="mt-2 text-sm text-muted">{f.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-subtle)] py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-subtle">
          <span>© {new Date().getFullYear()} Paisa</span>
          <span>Made in India</span>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="surface-elev relative overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted">Total balance</div>
          <div className="num mt-1 text-2xl text-foreground">₹4,82,310</div>
        </div>
        <span className="pill text-success">+8.4% MoM</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          { l: "Income", v: "₹1,20,000", c: "text-success" },
          { l: "Expenses", v: "₹68,420", c: "text-destructive" },
          { l: "Savings rate", v: "43%", c: "text-foreground" },
          { l: "Health score", v: "72/100", c: "text-accent" },
        ].map((s) => (
          <div key={s.l} className="rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3">
            <div className="text-[11px] text-muted">{s.l}</div>
            <div className={`num mt-1 text-base ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-[var(--border)] p-4">
        <div className="text-xs text-muted">This week's spend</div>
        <div className="mt-3 flex items-end gap-1.5">
          {[20, 35, 24, 48, 30, 60, 42].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-accent/40" style={{ height: `${h}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
