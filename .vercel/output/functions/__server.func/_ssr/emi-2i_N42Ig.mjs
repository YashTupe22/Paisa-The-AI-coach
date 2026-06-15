import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { a as formatINR } from "./format-uDnLSmtZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, j as Trash2, X } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function EmiPage() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const {
    data: loans = []
  } = useQuery({
    queryKey: ["loans"],
    queryFn: async () => (await supabase.from("loans").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return null;
      return (await supabase.from("profiles").select("monthly_income").eq("id", user.id).maybeSingle()).data;
    }
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("loans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["loans"]
      });
      toast.success("Loan removed");
    }
  });
  const totalEmi = loans.reduce((s, l) => s + Number(l.emi_amount ?? 0), 0);
  const income = Number(profile?.monthly_income ?? 0);
  const burdenPct = income ? Math.round(totalEmi / income * 100) : 0;
  const chart = loans.map((l) => ({
    name: l.name,
    EMI: Number(l.emi_amount)
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section", children: "EMI Tracker" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted", children: [
          loans.length,
          " active loans"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "btn-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add loan"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Monthly EMI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-foreground", children: formatINR(totalEmi) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "EMI / Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "num mt-2 text-2xl text-foreground", children: [
          burdenPct,
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-muted", children: burdenPct > 40 ? "High burden" : burdenPct > 20 ? "Moderate" : "Healthy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Total outstanding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-foreground", children: formatINR(loans.reduce((s, l) => s + Number(l.outstanding ?? 0), 0)) })
      ] })
    ] }),
    loans.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev mb-4 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-4", children: "EMI per loan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chart, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--border)", strokeDasharray: "3 3", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", stroke: "var(--muted)", fontSize: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted)", fontSize: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "var(--card)",
          border: "1px solid var(--border)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "EMI", fill: "var(--accent)", radius: [4, 4, 0, 0] })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-elev overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-[var(--border)] text-left text-xs uppercase text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Loan" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Lender" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "EMI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Outstanding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Months left" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-[var(--border-subtle)]", children: [
        loans.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-10 text-center text-muted", children: "No loans tracked." }) }),
        loans.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: l.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted", children: l.lender }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right text-foreground", children: formatINR(Number(l.emi_amount)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right text-foreground", children: formatINR(Number(l.outstanding)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right text-muted", children: l.months_remaining }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(l.id), className: "text-muted hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
        ] }, l.id))
      ] })
    ] }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(LoanDialog, { onClose: () => setOpen(false), onSaved: () => qc.invalidateQueries({
      queryKey: ["loans"]
    }) })
  ] });
}
function LoanDialog({
  onClose,
  onSaved
}) {
  const [f, setF] = reactExports.useState({
    name: "",
    lender: "",
    principal: "",
    outstanding: "",
    emi_amount: "",
    emi_day: "5",
    interest_rate: "",
    tenure_months: "",
    months_remaining: ""
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
    } = await supabase.from("loans").insert({
      user_id: user.id,
      name: f.name,
      lender: f.lender,
      principal: Number(f.principal),
      outstanding: Number(f.outstanding || f.principal),
      emi_amount: Number(f.emi_amount),
      emi_day: Number(f.emi_day) || 1,
      interest_rate: f.interest_rate ? Number(f.interest_rate) : null,
      tenure_months: Number(f.tenure_months) || 0,
      months_remaining: Number(f.months_remaining || f.tenure_months) || 0
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Loan added");
    onSaved();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev w-full max-w-lg p-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Add loan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field col-span-2", placeholder: "Loan name", value: f.name, onChange: (e) => setF({
        ...f,
        name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field col-span-2", placeholder: "Lender", value: f.lender, onChange: (e) => setF({
        ...f,
        lender: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Principal (₹)", value: f.principal, onChange: (e) => setF({
        ...f,
        principal: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Outstanding (₹)", value: f.outstanding, onChange: (e) => setF({
        ...f,
        outstanding: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "EMI (₹)", value: f.emi_amount, onChange: (e) => setF({
        ...f,
        emi_amount: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "EMI day (1-31)", value: f.emi_day, onChange: (e) => setF({
        ...f,
        emi_day: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "decimal", placeholder: "Interest rate %", value: f.interest_rate, onChange: (e) => setF({
        ...f,
        interest_rate: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Tenure months", value: f.tenure_months, onChange: (e) => setF({
        ...f,
        tenure_months: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num col-span-2", inputMode: "numeric", placeholder: "Months remaining", value: f.months_remaining, onChange: (e) => setF({
        ...f,
        months_remaining: e.target.value.replace(/\D/g, "")
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", disabled: busy || !f.name || !f.emi_amount, onClick: save, children: "Add" })
    ] })
  ] }) });
}
export {
  EmiPage as component
};
