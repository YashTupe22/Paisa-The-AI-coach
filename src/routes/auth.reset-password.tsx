import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, Field } from "./auth.login";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — Paisa" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose something memorable but strong">
      <form onSubmit={onSubmit} className="space-y-3">
        <Field label="New password"><input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></Field>
        <button disabled={loading} className="btn-primary w-full">{loading ? "Updating…" : "Update password"}</button>
      </form>
    </AuthShell>
  );
}
