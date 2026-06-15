import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { l as lovable } from "./index-BGnq3aH7.mjs";
import "../_libs/lovable.dev__cloud-auth-js.mjs";
import { W as Wallet } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({
      to: "/dashboard"
    });
  }
  async function onGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard"
    });
    if (r.error) toast.error(String(r.error.message ?? r.error));
    else if (!r.redirected) navigate({
      to: "/dashboard"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthShell, { title: "Welcome back", subtitle: "Sign in to your Paisa account", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onGoogle, className: "btn-ghost w-full", children: "Continue with Google" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", right: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/forgot-password", className: "text-xs text-accent hover:text-[color:var(--accent-hover)]", children: "Forgot?" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "btn-primary w-full", children: loading ? "Signing in…" : "Sign in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted", children: [
      "New here? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/register", className: "text-accent hover:text-[color:var(--accent-hover)]", children: "Create an account" })
    ] })
  ] });
}
function AuthShell({
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-[400px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-8 flex items-center justify-center gap-2 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-7 w-7 place-items-center rounded-md bg-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium tracking-tight", children: "Paisa" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "surface-elev p-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-card", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted", children: subtitle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children })
    ] })
  ] }) });
}
function Field({
  label,
  right,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted", children: label }),
      right
    ] }),
    children
  ] });
}
function Divider() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-[var(--border)]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-subtle", children: "or" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-[var(--border)]" })
  ] });
}
export {
  AuthShell,
  Divider,
  Field,
  LoginPage as component
};
