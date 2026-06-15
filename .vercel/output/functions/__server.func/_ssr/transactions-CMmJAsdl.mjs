import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { f as formatDate, a as formatINR } from "./format-uDnLSmtZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Download, P as Plus, j as Trash2, X } from "../_libs/lucide-react.mjs";
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
const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Utilities", "Entertainment", "Salary", "EMI", "Investment", "Transfer", "Other"];
function TransactionsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = reactExports.useState({
    category: "",
    type: "",
    q: ""
  });
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("*")).data ?? []
  });
  const {
    data: txns = [],
    isLoading
  } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: async () => {
      let q = supabase.from("transactions").select("*").order("date", {
        ascending: false
      }).limit(200);
      if (filter.category) q = q.eq("category", filter.category);
      if (filter.type) q = q.eq("type", filter.type);
      if (filter.q) q = q.ilike("merchant_name", `%${filter.q}%`);
      return (await q).data ?? [];
    }
  });
  const updateCat = useMutation({
    mutationFn: async ({
      id,
      category
    }) => {
      const {
        error
      } = await supabase.from("transactions").update({
        category
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["transactions"]
    })
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["transactions"]
      });
      toast.success("Deleted");
    }
  });
  function exportCSV() {
    const header = "Date,Merchant,Category,Type,Amount\n";
    const rows = txns.map((t) => `${t.date},"${t.merchant_name}",${t.category ?? ""},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header + rows], {
      type: "text/csv"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section", children: "Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted", children: [
          txns.length,
          " transactions"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: exportCSV, className: "btn-ghost", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
          " Export CSV"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAddOpen(true), className: "btn-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Add"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field max-w-[240px]", placeholder: "Search merchant…", value: filter.q, onChange: (e) => setFilter({
        ...filter,
        q: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field max-w-[180px]", value: filter.category, onChange: (e) => setFilter({
        ...filter,
        category: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All categories" }),
        CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field max-w-[140px]", value: filter.type, onChange: (e) => setFilter({
        ...filter,
        type: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All types" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debit", children: "Debit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "credit", children: "Credit" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-elev overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "border-b border-[var(--border)] text-left text-xs uppercase text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Merchant" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y divide-[var(--border-subtle)]", children: [
        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-10 text-center text-muted", children: "Loading…" }) }),
        !isLoading && txns.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-10 text-center text-muted", children: "No transactions. Add one or upload a PDF in Settings." }) }),
        txns.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-[var(--hover)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-muted whitespace-nowrap", children: formatDate(t.date) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-foreground", children: t.merchant_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "bg-transparent text-xs text-body", value: t.category ?? "", onChange: (e) => updateCat.mutate({
            id: t.id,
            category: e.target.value
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "—" }),
            CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c))
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `num px-4 py-2.5 text-right ${t.type === "debit" ? "text-destructive" : "text-success"}`, children: [
            t.type === "debit" ? "-" : "+",
            formatINR(Number(t.amount))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(t.id), className: "text-muted hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) }) })
        ] }, t.id))
      ] })
    ] }) }),
    addOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(AddTxnDialog, { accounts, onClose: () => setAddOpen(false), onAdded: () => qc.invalidateQueries({
      queryKey: ["transactions"]
    }) })
  ] });
}
function AddTxnDialog({
  accounts,
  onClose,
  onAdded
}) {
  const [form, setForm] = reactExports.useState({
    merchant_name: "",
    amount: "",
    type: "debit",
    category: "Other",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    account_id: accounts[0]?.id ?? ""
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
    } = await supabase.from("transactions").insert({
      user_id: user.id,
      merchant_name: form.merchant_name,
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      account_id: form.account_id || null
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Added");
    onAdded();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev w-full max-w-md p-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Add transaction" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", placeholder: "Merchant", value: form.merchant_name, onChange: (e) => setForm({
        ...form,
        merchant_name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "decimal", placeholder: "Amount", value: form.amount, onChange: (e) => setForm({
          ...form,
          amount: e.target.value
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field", value: form.type, onChange: (e) => setForm({
          ...form,
          type: e.target.value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debit", children: "Debit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "credit", children: "Credit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input-field", value: form.category, onChange: (e) => setForm({
          ...form,
          category: e.target.value
        }), children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: "input-field", value: form.date, onChange: (e) => setForm({
          ...form,
          date: e.target.value
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field", value: form.account_id, onChange: (e) => setForm({
        ...form,
        account_id: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— no account —" }),
        accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.account_name }, a.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", disabled: busy || !form.merchant_name || !form.amount, onClick: save, children: "Save" })
    ] })
  ] }) });
}
export {
  TransactionsPage as component
};
