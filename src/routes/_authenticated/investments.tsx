import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { Plus, X, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/investments")({
  head: () => ({ meta: [{ title: "Investments — Paisa" }] }),
  component: InvestmentsPage,
});

const COLORS = ["#4f46e5", "#16a34a", "#eab308", "#ec4899", "#3b82f6", "#f97316"];

function InvestmentsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: inv = [] } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => (await supabase.from("investments").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("investments").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["investments"] }); toast.success("Removed"); },
  });

  const totalInvested = inv.reduce((s, i) => s + Number(i.invested_amount ?? 0), 0);
  const totalCurrent = inv.reduce((s, i) => s + Number(i.current_value ?? 0), 0);
  const gain = totalCurrent - totalInvested;
  const gainPct = totalInvested ? (gain / totalInvested) * 100 : 0;

  const byType: Record<string, number> = {};
  inv.forEach((i) => { byType[i.type] = (byType[i.type] || 0) + Number(i.current_value ?? 0); });
  const pieData = Object.entries(byType).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex items-center justify-between">
        <div><h1 className="heading-section">Investments</h1><p className="mt-1 text-sm text-muted">{inv.length} holdings</p></div>
        <button onClick={() => setOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add</button>
      </header>

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Invested</div><div className="num mt-2 text-2xl text-foreground">{formatINR(totalInvested)}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Current value</div><div className="num mt-2 text-2xl text-foreground">{formatINR(totalCurrent)}</div></div>
        <div className="surface-elev p-5"><div className="text-xs uppercase text-muted">Gain / Loss</div><div className={`num mt-2 text-2xl ${gain >= 0 ? "text-success" : "text-destructive"}`}>{gain >= 0 ? "+" : ""}{formatINR(gain)} <span className="text-base">({gainPct.toFixed(1)}%)</span></div></div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="surface-elev overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] text-left text-xs uppercase text-muted">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3 text-right">Invested</th><th className="px-4 py-3 text-right">Current</th><th className="px-4 py-3 text-right">G/L</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {inv.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No investments. Add one to start tracking.</td></tr>}
              {inv.map((i) => {
                const g = Number(i.current_value) - Number(i.invested_amount);
                return (
                  <tr key={i.id}>
                    <td className="px-4 py-3 text-foreground">{i.name}</td>
                    <td className="px-4 py-3 text-muted">{i.type}</td>
                    <td className="num px-4 py-3 text-right">{formatINR(Number(i.invested_amount))}</td>
                    <td className="num px-4 py-3 text-right">{formatINR(Number(i.current_value))}</td>
                    <td className={`num px-4 py-3 text-right ${g >= 0 ? "text-success" : "text-destructive"}`}>{g >= 0 ? "+" : ""}{formatINR(g)}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => del.mutate(i.id)} className="text-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pieData.length > 0 && (
          <div className="surface-elev p-5">
            <h3 className="heading-card mb-2">Allocation</h3>
            <div className="h-64"><ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
              </PieChart>
            </ResponsiveContainer></div>
            <ul className="mt-3 space-y-1 text-xs">
              {pieData.map((p, i) => (
                <li key={p.name} className="flex justify-between"><span className="flex items-center gap-2 text-body"><span className="h-2 w-2 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} /> {p.name}</span><span className="num">{formatINR(p.value)}</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {open && <InvDialog onClose={() => setOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ["investments"] })} />}
    </div>
  );
}

function InvDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: "", type: "mutual_fund", units: "", avg_buy_price: "", invested_amount: "", current_value: "", sip_amount: "", sip_date: "" });
  async function save() {
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return;
    const { error } = await supabase.from("investments").insert({
      user_id: user.id, name: f.name, type: f.type as "mutual_fund",
      units: f.units ? Number(f.units) : null,
      avg_buy_price: f.avg_buy_price ? Number(f.avg_buy_price) : null,
      invested_amount: Number(f.invested_amount),
      current_value: Number(f.current_value || f.invested_amount),
      sip_amount: f.sip_amount ? Number(f.sip_amount) : null,
      sip_date: f.sip_date ? Number(f.sip_date) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Added"); onSaved(); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="surface-elev w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="heading-card">Add investment</h3><button onClick={onClose}><X className="h-4 w-4" /></button></div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input-field col-span-2" placeholder="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <select className="input-field col-span-2" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="mutual_fund">Mutual Fund</option><option value="stock">Stock</option><option value="fd">Fixed Deposit</option>
            <option value="ppf">PPF</option><option value="nps">NPS</option><option value="gold">Gold</option><option value="crypto">Crypto</option><option value="other">Other</option>
          </select>
          <input className="input-field num" inputMode="decimal" placeholder="Units" value={f.units} onChange={(e) => setF({ ...f, units: e.target.value })} />
          <input className="input-field num" inputMode="decimal" placeholder="Avg buy price" value={f.avg_buy_price} onChange={(e) => setF({ ...f, avg_buy_price: e.target.value })} />
          <input className="input-field num" inputMode="numeric" placeholder="Invested (₹)" value={f.invested_amount} onChange={(e) => setF({ ...f, invested_amount: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="Current value (₹)" value={f.current_value} onChange={(e) => setF({ ...f, current_value: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="SIP amount (opt)" value={f.sip_amount} onChange={(e) => setF({ ...f, sip_amount: e.target.value.replace(/\D/g, "") })} />
          <input className="input-field num" inputMode="numeric" placeholder="SIP date (1-31)" value={f.sip_date} onChange={(e) => setF({ ...f, sip_date: e.target.value.replace(/\D/g, "") })} />
        </div>
        <div className="mt-6 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={!f.name || !f.invested_amount} onClick={save}>Add</button></div>
      </div>
    </div>
  );
}
