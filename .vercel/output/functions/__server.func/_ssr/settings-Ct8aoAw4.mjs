import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { u as useServerFn, c as computeHealthScore, a as createSsrRpc } from "./health-score.functions-DfT1C-uF.mjs";
import { b as createServerFn } from "./server-BTM9F0kO.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DT31IUtl.mjs";
import { E as EXPENSE_CATEGORIES } from "./finance-stats-DagrJW-9.mjs";
import { a as formatINR, f as formatDate } from "./format-uDnLSmtZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useTheme } from "./router-4-xoO-pc.mjs";
import "../_libs/seroval.mjs";
import { P as Plus, W as Wallet, k as CreditCard, j as Trash2, g as Sparkles, l as LoaderCircle, U as Upload, F as FileText, X, c as Sun, d as Moon } from "../_libs/lucide-react.mjs";
import { h as objectType, m as enumType, j as stringType } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./ai-gateway.server-DVFdLzU8.mjs";
import "../_libs/ai-sdk__openai-compatible.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/ai.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/@vercel/oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
const Input = objectType({
  fileBase64: stringType().min(1),
  filename: stringType().min(1).max(255),
  fileType: enumType(["pdf", "csv", "xlsx", "xls"])
});
const parseStatement = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => Input.parse(d)).handler(createSsrRpc("529679f31bb3665b04d0812e6a33f58f04ee783a74f3a28b5204b63d12ce5572"));
const TABS = ["Profile", "Accounts", "Statements", "Appearance", "Security"];
function SettingsPage() {
  const [tab, setTab] = reactExports.useState("Profile");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-section mb-6", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex gap-1 overflow-x-auto border-b border-[var(--border)]", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `px-3 py-2 text-sm transition-colors ${tab === t ? "border-b-2 border-accent text-foreground" : "text-muted hover:text-foreground"}`, children: t }, t)) }),
    tab === "Profile" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileTab, {}),
    tab === "Accounts" && /* @__PURE__ */ jsxRuntimeExports.jsx(AccountsTab, {}),
    tab === "Statements" && /* @__PURE__ */ jsxRuntimeExports.jsx(StatementsTab, {}),
    tab === "Appearance" && /* @__PURE__ */ jsxRuntimeExports.jsx(AppearanceTab, {}),
    tab === "Security" && /* @__PURE__ */ jsxRuntimeExports.jsx(SecurityTab, {})
  ] });
}
function ProfileTab() {
  const qc = useQueryClient();
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
      return (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data;
    }
  });
  const [f, setF] = reactExports.useState({
    name: "",
    monthly_income: "",
    occupation: "",
    employer: ""
  });
  const initialized = reactExports.useRef(false);
  if (profile && !initialized.current) {
    initialized.current = true;
    setF({
      name: profile.name ?? "",
      monthly_income: String(profile.monthly_income ?? ""),
      occupation: profile.occupation ?? "",
      employer: profile.employer ?? ""
    });
  }
  async function save() {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const {
      error
    } = await supabase.from("profiles").update({
      name: f.name,
      monthly_income: Number(f.monthly_income) || 0,
      occupation: f.occupation,
      employer: f.employer || null
    }).eq("id", user.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({
      queryKey: ["profile"]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev max-w-xl space-y-4 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field mt-1", value: f.name, onChange: (e) => setF({
        ...f,
        name: e.target.value
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted", children: "Monthly income (₹)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num mt-1", inputMode: "numeric", value: f.monthly_income, onChange: (e) => setF({
        ...f,
        monthly_income: e.target.value.replace(/\D/g, "")
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted", children: "Occupation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field mt-1", value: f.occupation, onChange: (e) => setF({
        ...f,
        occupation: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Salaried" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Self-employed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Business" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted", children: "Employer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field mt-1", value: f.employer, onChange: (e) => setF({
        ...f,
        employer: e.target.value
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: save, className: "btn-primary", children: "Save" })
  ] });
}
function AccountsTab() {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("*").order("created_at", {
      ascending: false
    })).data ?? []
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("bank_accounts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["accounts"]
      });
      toast.success("Removed");
    }
  });
  async function payCreditCardBill(account) {
    const amt = Number(account.outstanding_balance ?? 0);
    if (amt <= 0) return toast.info("Nothing to pay.");
    if (!confirm(`Mark ${formatINR(amt)} as paid for ${account.account_name}?`)) return;
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("payment_intents").insert({
      user_id: user.id,
      account_id: account.id,
      amount: amt,
      status: "succeeded",
      purpose: "credit_card_payment"
    });
    await supabase.from("bank_accounts").update({
      outstanding_balance: 0
    }).eq("id", account.id);
    await supabase.from("transactions").insert({
      user_id: user.id,
      account_id: account.id,
      merchant_name: `${account.account_name} bill payment`,
      amount: amt,
      type: "debit",
      category: "EMI",
      date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
    });
    qc.invalidateQueries({
      queryKey: ["accounts"]
    });
    toast.success("Marked as paid");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpen(true), className: "btn-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
      " Add account"
    ] }) }),
    accounts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev grid place-items-center p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-8 w-8 text-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted", children: "No accounts yet." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 md:grid-cols-2", children: accounts.map((a) => {
      const isCC = a.account_type === "credit_card";
      const util = isCC && a.credit_limit ? Math.round(Number(a.outstanding_balance ?? 0) / Number(a.credit_limit) * 100) : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              isCC ? /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground", children: a.account_name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-xs text-muted", children: [
              a.bank_name,
              " • ",
              a.account_type,
              " ",
              a.last4 && `• ••${a.last4}`
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => del.mutate(a.id), className: "text-muted hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] }),
        isCC ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "Outstanding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-destructive", children: formatINR(Number(a.outstanding_balance ?? 0)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "Limit" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "num text-foreground", children: formatINR(Number(a.credit_limit ?? 0)) })
          ] }),
          util !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-[var(--border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${util > 70 ? "bg-destructive" : "bg-accent"}`, style: {
            width: `${Math.min(100, util)}%`
          } }) }),
          a.due_day && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted", children: [
            "Due on day ",
            a.due_day,
            " • Statement day ",
            a.statement_day ?? "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => payCreditCardBill(a), className: "btn-primary mt-2 w-full", children: "Pay bill" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "num mt-4 text-xl text-foreground", children: formatINR(Number(a.balance)) })
      ] }, a.id);
    }) }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(AccountDialog, { onClose: () => setOpen(false), onSaved: () => qc.invalidateQueries({
      queryKey: ["accounts"]
    }) })
  ] });
}
function AccountDialog({
  onClose,
  onSaved
}) {
  const [f, setF] = reactExports.useState({
    account_name: "",
    account_type: "savings",
    bank_name: "",
    last4: "",
    balance: "",
    credit_limit: "",
    outstanding_balance: "",
    statement_day: "",
    due_day: ""
  });
  const isCC = f.account_type === "credit_card";
  async function save() {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const payload = {
      user_id: user.id,
      account_name: f.account_name,
      account_type: f.account_type,
      bank_name: f.bank_name || null,
      last4: f.last4 || null,
      balance: Number(f.balance) || 0
    };
    if (isCC) {
      payload.credit_limit = Number(f.credit_limit) || 0;
      payload.outstanding_balance = Number(f.outstanding_balance) || 0;
      payload.statement_day = f.statement_day ? Number(f.statement_day) : null;
      payload.due_day = f.due_day ? Number(f.due_day) : null;
    }
    const {
      error
    } = await supabase.from("bank_accounts").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Added");
    onSaved();
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev w-full max-w-lg p-6", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Add account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field col-span-2", placeholder: "Account name", value: f.account_name, onChange: (e) => setF({
        ...f,
        account_name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field", value: f.account_type, onChange: (e) => setF({
        ...f,
        account_type: e.target.value
      }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "savings", children: "Savings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "current", children: "Current" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "credit_card", children: "Credit Card" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wallet", children: "Wallet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "upi", children: "UPI" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", placeholder: "Bank name", value: f.bank_name, onChange: (e) => setF({
        ...f,
        bank_name: e.target.value
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", placeholder: "Last 4 digits", value: f.last4, onChange: (e) => setF({
        ...f,
        last4: e.target.value.replace(/\D/g, "").slice(0, 4)
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: isCC ? "Available limit" : "Balance", value: f.balance, onChange: (e) => setF({
        ...f,
        balance: e.target.value.replace(/\D/g, "")
      }) }),
      isCC && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Credit limit", value: f.credit_limit, onChange: (e) => setF({
          ...f,
          credit_limit: e.target.value.replace(/\D/g, "")
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Outstanding balance", value: f.outstanding_balance, onChange: (e) => setF({
          ...f,
          outstanding_balance: e.target.value.replace(/\D/g, "")
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Statement day (1-31)", value: f.statement_day, onChange: (e) => setF({
          ...f,
          statement_day: e.target.value.replace(/\D/g, "")
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Due day (1-31)", value: f.due_day, onChange: (e) => setF({
          ...f,
          due_day: e.target.value.replace(/\D/g, "")
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", disabled: !f.account_name, onClick: save, children: "Add" })
    ] })
  ] }) });
}
const ACCEPTED = [".pdf", ".csv", ".xls", ".xlsx"];
const MIME_MAP = {
  "application/pdf": "pdf",
  "text/csv": "csv",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx"
};
function detectFileType(file) {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "pdf") return "pdf";
  if (ext === "csv") return "csv";
  if (ext === "xls") return "xls";
  if (ext === "xlsx") return "xlsx";
  return MIME_MAP[file.type] ?? null;
}
function StatementsTab() {
  const qc = useQueryClient();
  const parseFn = useServerFn(parseStatement);
  const scoreFn = useServerFn(computeHealthScore);
  const fileRef = reactExports.useRef(null);
  const [parsing, setParsing] = reactExports.useState(false);
  const [parsePhase, setParsePhase] = reactExports.useState(null);
  const [review, setReview] = reactExports.useState(null);
  const [reviewFilename, setReviewFilename] = reactExports.useState("");
  const {
    data: accounts = []
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => (await supabase.from("bank_accounts").select("id,account_name")).data ?? []
  });
  const [targetAccount, setTargetAccount] = reactExports.useState("");
  const {
    data: uploaded = []
  } = useQuery({
    queryKey: ["statements"],
    queryFn: async () => (await supabase.from("uploaded_statements").select("*").order("uploaded_at", {
      ascending: false
    })).data ?? []
  });
  async function handleFile(file) {
    const fileType = detectFileType(file);
    if (!fileType) return toast.error("Please upload a PDF, CSV, or Excel file.");
    const maxSize = fileType === "pdf" ? 6 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) return toast.error(`Max ${fileType === "pdf" ? "6" : "10"} MB for this file type.`);
    setParsing(true);
    setParsePhase("uploading");
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) {
      setParsing(false);
      setParsePhase(null);
      return;
    }
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const up = await supabase.storage.from("statements").upload(path, file);
    if (up.error) {
      setParsing(false);
      setParsePhase(null);
      return toast.error(up.error.message);
    }
    const {
      data: stmt,
      error: stmtErr
    } = await supabase.from("uploaded_statements").insert({
      user_id: user.id,
      file_name: file.name,
      file_path: path,
      status: "processing"
    }).select().single();
    if (stmtErr || !stmt) {
      setParsing(false);
      setParsePhase(null);
      return toast.error(stmtErr?.message ?? "Could not save upload record.");
    }
    try {
      setParsePhase("analyzing");
      const b64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => {
          const s = String(r.result);
          res(s.slice(s.indexOf(",") + 1));
        };
        r.onerror = () => rej(new Error("read error"));
        r.readAsDataURL(file);
      });
      const out = await parseFn({
        data: {
          fileBase64: b64,
          filename: file.name,
          fileType
        }
      });
      const status = out.transactions.length > 0 ? "done" : "failed";
      await supabase.from("uploaded_statements").update({
        status
      }).eq("id", stmt.id);
      qc.invalidateQueries({
        queryKey: ["statements"]
      });
      if (out.transactions.length === 0) {
        toast.error("AI found no transactions. Try a different export from your bank.");
        return;
      }
      setReview(out.transactions);
      setReviewFilename(file.name);
      toast.success(`AI categorized ${out.transactions.length} transactions — review before importing`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Parse failed";
      await supabase.from("uploaded_statements").update({
        status: "failed"
      }).eq("id", stmt.id);
      toast.error(msg);
    } finally {
      setParsing(false);
      setParsePhase(null);
    }
  }
  function updateReviewCategory(index, category) {
    setReview((prev) => prev?.map((t, i) => i === index ? {
      ...t,
      suggested_category: category
    } : t) ?? null);
  }
  async function importParsed() {
    if (!review) return;
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) return;
    const rows = review.map((t) => ({
      user_id: user.id,
      account_id: targetAccount || null,
      merchant_name: t.merchant_name,
      amount: t.amount,
      type: t.type,
      category: t.suggested_category,
      ai_category: t.suggested_category,
      date: t.date
    }));
    const {
      error
    } = await supabase.from("transactions").insert(rows);
    if (error) return toast.error(error.message);
    toast.success(`Imported ${rows.length} transactions — dashboard & reports updated`);
    setReview(null);
    qc.invalidateQueries({
      queryKey: ["transactions"]
    });
    qc.invalidateQueries({
      queryKey: ["period-txns"]
    });
    qc.invalidateQueries({
      queryKey: ["reports-trend"]
    });
    qc.invalidateQueries({
      queryKey: ["dashboard-transactions"]
    });
    scoreFn({
      data: void 0
    }).then(() => {
      qc.invalidateQueries({
        queryKey: ["score"]
      });
      qc.invalidateQueries({
        queryKey: ["insights"]
      });
    }).catch(() => {
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "heading-card flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-accent" }),
        " Upload statement"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: "Upload PDF, CSV, or Excel — AI reads the file, categorizes every transaction, then you review and import." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill", children: "1. Upload" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "→" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill", children: "2. AI categorizes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "→" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill", children: "3. Review & import" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onDragOver: (e) => e.preventDefault(), onDrop: (e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }, onClick: () => fileRef.current?.click(), className: "mt-4 grid cursor-pointer place-items-center rounded-md border-2 border-dashed border-[var(--border)] py-10 text-center hover:bg-[var(--hover)]", children: parsing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted", children: parsePhase === "uploading" ? "Uploading file…" : "AI is analyzing & categorizing…" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-subtle", children: "This may take 10–30 seconds" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted", children: "Drag a PDF, CSV, or Excel file here" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-subtle", children: [
          "Supported: ",
          ACCEPTED.join(", ")
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".pdf,.csv,.xls,.xlsx,application/pdf,text/csv", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
        e.target.value = "";
      } })
    ] }),
    uploaded.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-3", children: "Previous uploads" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-[var(--border-subtle)]", children: uploaded.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground", children: u.file_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted", children: formatDate(u.uploaded_at) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `pill ${u.status === "done" ? "text-success" : u.status === "failed" ? "text-destructive" : "text-muted"}`, children: u.status })
      ] }, u.id)) })
    ] }),
    review && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev max-h-[80vh] w-full max-w-3xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-[var(--border)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Step 2: Review AI categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted", children: [
            review.length,
            " transactions from ",
            reviewFilename,
            " — edit categories if needed, then import"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReview(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-[var(--border)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs text-muted", children: "Assign to account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field mt-1", value: targetAccount, onChange: (e) => setTargetAccount(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— none —" }),
          accounts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.account_name }, a.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[40vh] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 border-b border-[var(--border)] bg-card text-xs uppercase text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Merchant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right", children: "Amount" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-[var(--border-subtle)]", children: review.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted", children: t.date }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground", children: t.merchant_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input-field !h-8 !py-0 text-xs", value: t.suggested_category, onChange: (e) => updateReviewCategory(i, e.target.value), children: [...EXPENSE_CATEGORIES, "Salary"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, children: c }, c)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: `num px-3 py-2 text-right ${t.type === "debit" ? "text-destructive" : "text-success"}`, children: [
            t.type === "debit" ? "-" : "+",
            formatINR(t.amount)
          ] })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 border-t border-[var(--border)] p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setReview(null), className: "btn-ghost", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: importParsed, disabled: review.length === 0, className: "btn-primary", children: "Step 3: Import to dashboard & reports" })
      ] })
    ] }) })
  ] });
}
function AppearanceTab() {
  const {
    theme,
    setTheme
  } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev max-w-md p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card mb-1", children: "Theme" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted", children: "Choose how Paisa looks." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 grid grid-cols-2 gap-3", children: ["light", "dark"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTheme(t), className: `flex items-center gap-2 rounded-md border p-4 ${theme === t ? "border-accent bg-[var(--hover)]" : "border-[var(--border)] hover:bg-[var(--hover)]"}`, children: [
      t === "light" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground capitalize", children: t })
    ] }, t)) })
  ] });
}
function SecurityTab() {
  const [pw, setPw] = reactExports.useState("");
  async function change() {
    if (pw.length < 8) return toast.error("Minimum 8 characters");
    const {
      error
    } = await supabase.auth.updateUser({
      password: pw
    });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPw("");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev max-w-md space-y-3 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "heading-card", children: "Change password" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", className: "input-field", placeholder: "New password", value: pw, onChange: (e) => setPw(e.target.value) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: change, className: "btn-primary", disabled: !pw, children: "Update password" })
  ] });
}
export {
  SettingsPage as component
};
