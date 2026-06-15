import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Plus, X, Trash2, Target as TargetIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/goals")({
  head: () => ({ meta: [{ title: "Goals — Paisa" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [contribFor, setContribFor] = useState<{ id: string; name: string } | null>(null);

  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => (await supabase.from("goals").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("goals").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["goals"] }); toast.success("Deleted"); },
  });

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div><h1 className="heading-section">Goals</h1><p className="mt-1 text-sm text-muted">Track and fund what matters.</p></div>
        <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> New goal</button>
      </header>

      {goals.length === 0 ? (
        <div className="surface-elev grid place-items-center p-16 text-center">
          <TargetIcon className="h-8 w-8 text-muted" />
          <p className="mt-3 text-sm text-muted">No goals yet. Create one to start tracking.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100));
            return (
              <div key={g.id} className="surface-elev p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted">{g.type}</div>
                    <div className="heading-card mt-0.5">{g.name}</div>
                  </div>
                  <button onClick={() => del.mutate(g.id)} className="text-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 h-2 rounded-full bg-[var(--border)]"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} /></div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="num text-foreground">{formatINR(Number(g.current_amount))}</span>
                  <span className="num text-muted">/ {formatINR(Number(g.target_amount))}</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted">
                  <span>{pct}%</span>
                  {g.deadline && <span>{formatDate(g.deadline)}</span>}
                </div>
                <button onClick={() => setContribFor({ id: g.id, name: g.name })} className="btn-ghost mt-4 w-full">Add contribution</button>
              </div>
            );
          })}
        </div>
      )}

      {open && <GoalDialog onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["goals"] })} />}
      {contribFor && <ContribDialog goal={contribFor} onClose={() => setContribFor(null)} onSaved={() => qc.invalidateQueries({ queryKey: ["goals"] })} />}
    </div>
  );
}

function GoalDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: "", type: "emergency_fund", target_amount: "", monthly_contribution: "", deadline: "" });
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { error } = await supabase.from("goals").insert({
      user_id: user.id, name: f.name, type: f.type as "emergency_fund",
      target_amount: Number(f.target_amount), current_amount: 0,
      monthly_contribution: f.monthly_contribution ? Number(f.monthly_contribution) : null,
      deadline: f.deadline || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Goal created"); onSaved(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="surface-elev w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="heading-card">New goal</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div className="space-y-3">
          <input className="input-field" placeholder="Goal name (e.g. Emergency Fund)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <select className="input-field" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="emergency_fund">Emergency Fund</option><option value="retirement">Retirement</option>
            <option value="home">Buy a Home</option><option value="education">Education</option>
            <option value="vacation">Vacation</option><option value="debt_payoff">Debt Payoff</option><option value="wealth_building">Wealth Building</option>
          </select>
          <input className="input-field num" inputMode="numeric" placeholder="Target amount (₹)" value={f.target_amount} onChange={(e) => setF({ ...f, target_amount: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="Monthly contribution (optional)" value={f.monthly_contribution} onChange={(e) => setF({ ...f, monthly_contribution: e.target.value.replace(/\D/g, "") })} />
          <input type="date" className="input-field" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} />
        </div>
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy || !f.name || !f.target_amount} onClick={save}>Create</button></div>
      </div>
    </div>
  );
}

function ContribDialog({ goal, onClose, onSaved }: { goal: { id: string; name: string }; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState("");
  async function save() {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const amt = Number(amount);
    const { data: g } = await supabase.from("goals").select("current_amount").eq("id", goal.id).single();
    await supabase.from("goals").update({ current_amount: Number(g?.current_amount ?? 0) + amt }).eq("id", goal.id);
    await supabase.from("goal_contributions").insert({ user_id: user.id, goal_id: goal.id, amount: amt, date: new Date().toISOString().slice(0, 10) });
    toast.success("Contribution added"); onSaved(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="surface-elev w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="heading-card mb-4">Add to {goal.name}</h3>
        <input className="input-field num" inputMode="numeric" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!amount} onClick={save}>Add</button></div>
      </div>
    </div>
  );
}
