import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Sign in — Paisa" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  }

  async function onGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) toast.error(String(r.error.message ?? r.error));
    else if (!r.redirected) navigate({ to: "/dashboard" });
  }

  return <AuthShell title="Welcome back" subtitle="Sign in to your Paisa account">
    <button onClick={onGoogle} className="btn-ghost w-full">Continue with Google</button>
    <Divider />
    <form onSubmit={onSubmit} className="space-y-3">
      <Field label="Email"><input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
      <Field label="Password" right={<Link to="/auth/forgot-password" className="text-xs text-accent hover:text-[color:var(--accent-hover)]">Forgot?</Link>}>
        <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <button disabled={loading} className="btn-primary w-full">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
    <p className="mt-6 text-center text-sm text-muted">
      New here? <Link to="/auth/register" className="text-accent hover:text-[color:var(--accent-hover)]">Create an account</Link>
    </p>
  </AuthShell>;
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <div className="w-full max-w-[400px]">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 text-foreground">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary"><Wallet className="h-4 w-4" /></div>
          <span className="font-medium tracking-tight">Paisa</span>
        </Link>
        <div className="surface-elev p-7">
          <h1 className="heading-card">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-6 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, right, children }: { label: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        {right}
      </div>
      {children}
    </label>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--border)]" />
      <span className="text-xs text-subtle">or</span>
      <div className="h-px flex-1 bg-[var(--border)]" />
    </div>
  );
}
