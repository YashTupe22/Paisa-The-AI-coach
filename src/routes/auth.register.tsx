import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, Field, Divider } from "./auth.login";

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Create account — Paisa" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/onboarding",
        data: { name, phone: phone ? `+91${phone}` : null },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    navigate({ to: "/onboarding" });
  }

  async function onGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/onboarding" });
    if (r.error) toast.error(String(r.error.message ?? r.error));
    else if (!r.redirected) navigate({ to: "/onboarding" });
  }

  return (
    <AuthShell title="Create your account" subtitle="Start tracking your money in 60 seconds">
      <button onClick={onGoogle} className="btn-ghost w-full">Continue with Google</button>
      <Divider />
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="Full name"><input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required /></Field>
        <Field label="Email"><input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="Phone (optional)">
          <div className="flex items-stretch gap-0">
            <span className="grid place-items-center rounded-l-md border border-r-0 border-[var(--border)] bg-[var(--card)] px-3 text-sm text-muted">+91</span>
            <input className="input-field rounded-l-none" inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} />
          </div>
        </Field>
        <Field label="Password"><input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></Field>
        <button disabled={loading} className="btn-primary w-full">{loading ? "Creating…" : "Create account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have one? <Link to="/auth/login" className="text-accent hover:text-[color:var(--accent-hover)]">Sign in</Link>
      </p>
    </AuthShell>
  );
}
