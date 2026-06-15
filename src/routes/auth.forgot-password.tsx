import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./auth.login";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Paisa" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password",
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Check your inbox");
  }

  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a reset link">
      {sent ? (
        <p className="text-sm text-body">If an account exists for <span className="text-foreground">{email}</span>, a reset link is on its way.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <Field label="Email"><input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <button disabled={loading} className="btn-primary w-full">{loading ? "Sending…" : "Send reset link"}</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted"><Link to="/auth/login" className="text-accent">Back to sign in</Link></p>
    </AuthShell>
  );
}
