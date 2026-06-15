import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { a as formatINR } from "./format-uDnLSmtZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Plus, j as Trash2, X } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, b as Pie, c as Cell, T as Tooltip } from "../_libs/recharts.mjs";
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
const COLORS = ["#4f46e5", "#16a34a", "#eab308", "#ec4899", "#3b82f6", "#f97316"];
function InvestmentsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const {
    data: inv = []
  } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => (await supabase.from("investments").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("investments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["investments"]
      });
      toast.success("Removed");
    }
  });
  const totalInvested = inv.reduce((s, i) => s + Number(i.invested_amount ?? 0), 0);
  const totalCurrent = inv.reduce((s, i) => s + Number(i.current_value ?? 0), 0);
  const gain = totalCurrent - totalInvested;
  const gainPct = totalInvested ? gain / totalInvested * 100 : 0;
  const byType = {};
  inv.forEach((i) => {
    byType[i.type] = (byType[i.type] || 0) + Number(i.current_value ?? 0);
  });
  const pieData = Object.entries(byType).map(([name, value]) => ({
    name,
    value
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section", children: "Investments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted", children: [
          inv.length,
          " holdings"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "btn-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Add"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Invested" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-foreground", children: formatINR(totalInvested) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Current value" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-2 text-2xl text-foreground", children: formatINR(totalCurrent) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase text-muted", children: "Gain / Loss" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `num mt-2 text-2xl ${gain >= 0 ? "text-success" : "text-destructive"}`, children: [
          gain >= 0 ? "+" : "",
          formatINR(gain),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base", children: [
            "(",
            gainPct.toFixed(1),
            "%)"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[2fr_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-elev overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-[var(--border)] text-left text-xs uppercase text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Invested" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Current" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "G/L" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-[var(--border-subtle)]", children: [
          inv.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 6, className: "px-4 py-10 text-center text-muted", children: "No investments. Add one to start tracking." }) }),
          inv.map((i) => {
            const g = Number(i.current_value) - Number(i.invested_amount);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: i.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted", children: i.type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right", children: formatINR(Number(i.invested_amount)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num px-4 py-3 text-right", children: formatINR(Number(i.current_value)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `num px-4 py-3 text-right ${g >= 0 ? "text-success" : "text-destructive"}`, children: [
                g >= 0 ? "+" : "",
                formatINR(g)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(i.id), className: "text-muted hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
            ] }, i.id);
          })
        ] })
      ] }) }),
      pieData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-2", children: "Allocation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: pieData, dataKey: "value", nameKey: "name", innerRadius: 50, outerRadius: 90, paddingAngle: 2, children: pieData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "var(--card)",
            border: "1px solid var(--border)"
          } })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-1 text-xs", children: pieData.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-sm", style: {
              background: COLORS[i % COLORS.length]
            } }),
            " ",
            p.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num", children: formatINR(p.value) })
        ] }, p.name)) })
      ] })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(InvDialog, { onClose: () => setOpen(false), onSaved: () => qc.invalidateQueries({
      queryKey: ["investments"]
    }) })
  ] });
}
function InvDialog({
  onClose,
  onSaved
}) {
  const [f, setF] = reactExports.useState({
    name: "",
    type: "mutual_fund",
    units: "",
    avg_buy_price: "",
    invested_amount: "",
    current_value: "",
    sip_amount: "",
    sip_date: ""
  });
  async function save() {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const {
      error
    } = await supabase.from("investments").insert({
      user_id: user.id,
      name: f.name,
      type: f.type,
      units: f.units ? Number(f.units) : null,
      avg_buy_price: f.avg_buy_price ? Number(f.avg_buy_price) : null,
      invested_amount: Number(f.invested_amount),
      current_value: Number(f.current_value || f.invested_amount),
      sip_amount: f.sip_amount ? Number(f.sip_amount) : null,
      sip_date: f.sip_date ? Number(f.sip_date) : null
    });
    if (error) return toast.error(error.message);
    toast.success("Added");
    onSaved();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev w-full max-w-lg p-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Add investment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field col-span-2", placeholder: "Name", value: f.name, onChange: (e) => setF({
        ...f,
        name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field col-span-2", value: f.type, onChange: (e) => setF({
        ...f,
        type: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mutual_fund", children: "Mutual Fund" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "stock", children: "Stock" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fd", children: "Fixed Deposit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ppf", children: "PPF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nps", children: "NPS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gold", children: "Gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "crypto", children: "Crypto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "other", children: "Other" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "decimal", placeholder: "Units", value: f.units, onChange: (e) => setF({
        ...f,
        units: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "decimal", placeholder: "Avg buy price", value: f.avg_buy_price, onChange: (e) => setF({
        ...f,
        avg_buy_price: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Invested (₹)", value: f.invested_amount, onChange: (e) => setF({
        ...f,
        invested_amount: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Current value (₹)", value: f.current_value, onChange: (e) => setF({
        ...f,
        current_value: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "SIP amount (opt)", value: f.sip_amount, onChange: (e) => setF({
        ...f,
        sip_amount: e.target.value.replace(/\D/g, "")
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "SIP date (1-31)", value: f.sip_date, onChange: (e) => setF({
        ...f,
        sip_date: e.target.value.replace(/\D/g, "")
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", disabled: !f.name || !f.invested_amount, onClick: save, children: "Add" })
    ] })
  ] }) });
}
export {
  InvestmentsPage as component
};
