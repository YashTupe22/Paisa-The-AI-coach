import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { a as formatINR, f as formatDate } from "./format-uDnLSmtZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, T as Target, j as Trash2, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function GoalsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [contribFor, setContribFor] = reactExports.useState(null);
  const {
    data: goals = []
  } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => (await supabase.from("goals").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["goals"]
      });
      toast.success("Deleted");
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section", children: "Goals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: "Track and fund what matters." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "btn-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " New goal"
      ] })
    ] }),
    goals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev grid place-items-center p-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-8 w-8 text-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted", children: "No goals yet. Create one to start tracking." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: goals.map((g) => {
      const pct = Math.min(100, Math.round(Number(g.current_amount) / Number(g.target_amount) * 100));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted", children: g.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "heading-card mt-0.5", children: g.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(g.id), className: "text-muted hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-2 rounded-full bg-[var(--border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-accent transition-all", style: {
          width: `${pct}%`
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex justify-between text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(Number(g.current_amount)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "num text-muted", children: [
            "/ ",
            formatINR(Number(g.target_amount))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between text-xs text-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            pct,
            "%"
          ] }),
          g.deadline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(g.deadline) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setContribFor({
          id: g.id,
          name: g.name
        }), className: "btn-ghost mt-4 w-full", children: "Add contribution" })
      ] }, g.id);
    }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(GoalDialog, { onClose: () => setOpen(false), onSaved: () => qc.invalidateQueries({
      queryKey: ["goals"]
    }) }),
    contribFor && /* @__PURE__ */ jsxRuntimeExports.jsx(ContribDialog, { goal: contribFor, onClose: () => setContribFor(null), onSaved: () => qc.invalidateQueries({
      queryKey: ["goals"]
    }) })
  ] });
}
function GoalDialog({
  onClose,
  onSaved
}) {
  const [f, setF] = reactExports.useState({
    name: "",
    type: "emergency_fund",
    target_amount: "",
    monthly_contribution: "",
    deadline: ""
  });
  const [busy, setBusy] = reactExports.useState(false);
  async function save() {
    setBusy(true);
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const {
      error
    } = await supabase.from("goals").insert({
      user_id: user.id,
      name: f.name,
      type: f.type,
      target_amount: Number(f.target_amount),
      current_amount: 0,
      monthly_contribution: f.monthly_contribution ? Number(f.monthly_contribution) : null,
      deadline: f.deadline || null
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Goal created");
    onSaved();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev w-full max-w-md p-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "New goal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", placeholder: "Goal name (e.g. Emergency Fund)", value: f.name, onChange: (e) => setF({
        ...f,
        name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field", value: f.type, onChange: (e) => setF({
        ...f,
        type: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "emergency_fund", children: "Emergency Fund" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "retirement", children: "Retirement" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "home", children: "Buy a Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "education", children: "Education" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vacation", children: "Vacation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debt_payoff", children: "Debt Payoff" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wealth_building", children: "Wealth Building" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Target amount (₹)", value: f.target_amount, onChange: (e) => setF({
        ...f,
        target_amount: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Monthly contribution (optional)", value: f.monthly_contribution, onChange: (e) => setF({
        ...f,
        monthly_contribution: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "input-field", value: f.deadline, onChange: (e) => setF({
        ...f,
        deadline: e.target.value
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", disabled: busy || !f.name || !f.target_amount, onClick: save, children: "Create" })
    ] })
  ] }) });
}
function ContribDialog({
  goal,
  onClose,
  onSaved
}) {
  const [amount, setAmount] = reactExports.useState("");
  async function save() {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const amt = Number(amount);
    const {
      data: g
    } = await supabase.from("goals").select("current_amount").eq("id", goal.id).single();
    await supabase.from("goals").update({
      current_amount: Number(g?.current_amount ?? 0) + amt
    }).eq("id", goal.id);
    await supabase.from("goal_contributions").insert({
      user_id: user.id,
      goal_id: goal.id,
      amount: amt,
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
    toast.success("Contribution added");
    onSaved();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev w-full max-w-sm p-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "heading-card mb-4", children: [
      "Add to ",
      goal.name
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Amount (₹)", value: amount, onChange: (e) => setAmount(e.target.value.replace(/\D/g, "")) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", disabled: !amount, onClick: save, children: "Add" })
    ] })
  ] }) });
}
export {
  GoalsPage as component
};
