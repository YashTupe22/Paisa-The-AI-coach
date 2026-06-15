import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { l as lovable } from "./index-BGnq3aH7.mjs";
import { A as AuthShell, D as Divider, F as Field } from "./router-4-xoO-pc.mjs";
import "../_libs/lovable.dev__cloud-auth-js.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./ai-gateway.server-DVFdLzU8.mjs";
import "../_libs/ai-sdk__openai-compatible.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/zod.mjs";
import "../_libs/ai.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/@vercel/oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
import "../_libs/lucide-react.mjs";
function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const {
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/onboarding",
        data: {
          name,
          phone: phone ? `+91${phone}` : null
        }
      }
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    navigate({
      to: "/onboarding"
    });
  }
  async function onGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/onboarding"
    });
    if (r.error) toast.error(String(r.error.message ?? r.error));
    else if (!r.redirected) navigate({
      to: "/onboarding"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthShell, { title: "Create your account", subtitle: "Start tracking your money in 60 seconds", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onGoogle, className: "btn-ghost w-full", children: "Continue with Google" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", value: name, onChange: (e) => setName(e.target.value), required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-stretch gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid place-items-center rounded-l-md border border-r-0 border-[var(--border)] bg-[var(--card)] px-3 text-sm text-muted", children: "+91" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field rounded-l-none", inputMode: "numeric", maxLength: 10, value: phone, onChange: (e) => setPhone(e.target.value.replace(/\D/g, "")) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input-field", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "btn-primary w-full", children: loading ? "Creating…" : "Create account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-muted", children: [
      "Already have one? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/login", className: "text-accent hover:text-[color:var(--accent-hover)]", children: "Sign in" })
    ] })
  ] });
}
export {
  RegisterPage as component
};
