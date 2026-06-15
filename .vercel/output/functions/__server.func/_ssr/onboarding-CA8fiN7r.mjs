import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { B as Briefcase, T as Target, n as CircleCheck, W as Wallet, P as Plus } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
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
const GOALS = [{
  id: "emergency_fund",
  label: "Emergency Fund",
  desc: "3–6 months of expenses."
}, {
  id: "retirement",
  label: "Retirement",
  desc: "Plan for the long haul."
}, {
  id: "home",
  label: "Buy a Home",
  desc: "Down payment + EMI ready."
}, {
  id: "education",
  label: "Child Education",
  desc: "Future tuition fees."
}, {
  id: "vacation",
  label: "Vacation",
  desc: "That dream trip."
}, {
  id: "debt_payoff",
  label: "Debt Payoff",
  desc: "Clear loans faster."
}, {
  id: "wealth_building",
  label: "Wealth Building",
  desc: "Grow long-term wealth."
}];
function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [step, setStep] = reactExports.useState(1);
  const [income, setIncome] = reactExports.useState("");
  const [occupation, setOccupation] = reactExports.useState("Salaried");
  const [employer, setEmployer] = reactExports.useState("");
  const [goals, setGoals] = reactExports.useState([]);
  const [accountName, setAccountName] = reactExports.useState("");
  const [accountType, setAccountType] = reactExports.useState("savings");
  const [bankName, setBankName] = reactExports.useState("");
  const [accountBalance, setAccountBalance] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  function toggleGoal(id) {
    setGoals((g) => g.includes(id) ? g.filter((x) => x !== id) : [...g, id]);
  }
  async function finish() {
    setBusy(true);
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      return;
    }
    const {
      error
    } = await supabase.from("profiles").update({
      monthly_income: Number(income) || 0,
      occupation,
      employer: employer || null,
      financial_goals: goals,
      onboarding_complete: true
    }).eq("id", user.id);
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    if (accountName.trim()) {
      const {
        error: accErr
      } = await supabase.from("bank_accounts").insert({
        user_id: user.id,
        account_name: accountName.trim(),
        account_type: accountType,
        bank_name: bankName || null,
        balance: Number(accountBalance) || 0
      });
      if (accErr) toast.error(`Account not saved: ${accErr.message}`);
    }
    if (goals.length) {
      const {
        data: existing
      } = await supabase.from("goals").select("type").eq("user_id", user.id);
      const existingTypes = new Set((existing ?? []).map((g) => g.type));
      const newGoals = goals.filter((g) => !existingTypes.has(g));
      if (newGoals.length) {
        const {
          error: goalsErr
        } = await supabase.from("goals").insert(newGoals.map((g) => ({
          user_id: user.id,
          name: GOALS.find((x) => x.id === g)?.label ?? g,
          type: g,
          target_amount: 1e5,
          current_amount: 0
        })));
        if (goalsErr) toast.error(`Goals not saved: ${goalsErr.message}`);
      }
    }
    await qc.invalidateQueries({
      queryKey: ["profile"]
    });
    await qc.invalidateQueries({
      queryKey: ["goals"]
    });
    await qc.invalidateQueries({
      queryKey: ["accounts"]
    });
    setStep(4);
    setTimeout(() => navigate({
      to: "/dashboard"
    }), 1200);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-center text-xs text-muted", children: [
      "Step ",
      Math.min(step, 3),
      " of 3"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8 flex items-center gap-1.5", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-1 flex-1 rounded-full ${n <= step ? "bg-accent" : "bg-[var(--border)]"}` }, n)) }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5 text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-card mt-3", children: "Tell us about your income" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: "We use this to compute your savings rate, EMI burden, and financial health score." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted", children: "Monthly income (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field mt-1.5 num", inputMode: "numeric", value: income, onChange: (e) => setIncome(e.target.value.replace(/\D/g, "")), placeholder: "80000" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted", children: "Occupation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field mt-1.5", value: occupation, onChange: (e) => setOccupation(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Salaried" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Self-employed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: "Business" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted", children: "Employer (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field mt-1.5", value: employer, onChange: (e) => setEmployer(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), disabled: !income, className: "btn-primary", children: "Continue" }) })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5 text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-card mt-3", children: "What are you saving for?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: "Pick any that matter. You can skip and add goals later." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-2 sm:grid-cols-2", children: GOALS.map((g) => {
        const on = goals.includes(g.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleGoal(g.id), className: `rounded-md border p-4 text-left transition-colors ${on ? "border-accent bg-[var(--hover)]" : "border-[var(--border)] hover:bg-[var(--hover)]"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: g.label }),
            on && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-accent" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted", children: g.desc })
        ] }, g.id);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(1), className: "btn-ghost", children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), className: "btn-ghost", children: "Skip" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), disabled: goals.length === 0, className: "btn-primary", children: "Continue" })
        ] })
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5 text-accent" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-card mt-3", children: "Add your first account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: "Link a bank account or wallet. You can also upload statements (PDF, CSV, Excel) from Settings later." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", placeholder: "Account name (e.g. HDFC Savings)", value: accountName, onChange: (e) => setAccountName(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input-field", value: accountType, onChange: (e) => setAccountType(e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "savings", children: "Savings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "current", children: "Current" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "credit_card", children: "Credit Card" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "wallet", children: "Wallet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "upi", children: "UPI" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", placeholder: "Bank name", value: bankName, onChange: (e) => setBankName(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field num", inputMode: "numeric", placeholder: "Current balance (₹)", value: accountBalance, onChange: (e) => setAccountBalance(e.target.value.replace(/\D/g, "")) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(2), className: "btn-ghost", children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: finish, disabled: busy, className: "btn-ghost", children: busy ? "Setting up…" : "Skip for now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: finish, disabled: busy, className: "btn-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            busy ? "Setting up…" : "Finish setup"
          ] })
        ] })
      ] })
    ] }),
    step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto h-1 w-48 overflow-hidden rounded-full bg-[var(--border)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 animate-pulse bg-accent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "heading-card mt-6", children: "All set!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted", children: "Taking you to your dashboard." })
    ] })
  ] });
}
export {
  Onboarding as component
};
