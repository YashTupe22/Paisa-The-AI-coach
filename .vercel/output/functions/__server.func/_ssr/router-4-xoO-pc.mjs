import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-BHmQHd0X.mjs";
import { c as createGeminiProvider, G as GEMINI_MODEL } from "./ai-gateway.server-DVFdLzU8.mjs";
import { s as streamText, c as convertToModelMessages } from "../_libs/ai.mjs";
import { W as Wallet } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/ai-sdk__openai-compatible.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/zod.mjs";
import "../_libs/ai-sdk__gateway.mjs";
import "../_libs/@vercel/oidc.mjs";
import "path";
import "fs";
import "os";
import "../_libs/opentelemetry__api.mjs";
const appCss = "/assets/styles-_p-L4DZb.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const ThemeCtx = reactExports.createContext({
  theme: "light",
  setTheme: () => {
  },
  toggle: () => {
  }
});
function ThemeProvider({ children }) {
  const [theme, setThemeState] = reactExports.useState("light");
  reactExports.useEffect(() => {
    const stored = typeof window !== "undefined" && localStorage.getItem("paisa-theme");
    const initial = stored === "dark" || stored === "light" ? stored : "light";
    setThemeState(initial);
  }, []);
  reactExports.useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("paisa-theme", theme);
    } catch {
    }
  }, [theme]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeCtx.Provider, { value: { theme, setTheme: setThemeState, toggle: () => setThemeState((t) => t === "dark" ? "light" : "dark") }, children });
}
const useTheme = () => reactExports.useContext(ThemeCtx);
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "display-1", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 heading-card", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted", children: "This page doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "btn-primary", children: "Go home" }) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "heading-card", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        router2.invalidate();
        reset();
      }, className: "btn-primary", children: "Try again" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "btn-ghost", children: "Home" })
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Paisa — AI Personal Finance Coach for India" },
      { name: "description", content: "AI-powered financial coach for Indian users. Track expenses, build goals, and chat with an AI advisor about your money." },
      { name: "theme-color", content: "#fafafa" },
      { property: "og:title", content: "Paisa — AI Personal Finance Coach" },
      { property: "og:description", content: "Track expenses, build goals, and get AI-powered financial advice tailored for India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `try{var t=localStorage.getItem('paisa-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}`
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router2.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ThemeProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toaster,
      {
        position: "bottom-right",
        toastOptions: {
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)"
          }
        }
      }
    )
  ] }) });
}
const $$splitComponentImporter$e = () => import("./route-e6dosdTF.mjs");
const Route$f = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({
    location
  }) => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth/login"
    });
    const {
      data: profile
    } = await supabase.from("profiles").select("onboarding_complete").eq("id", data.user.id).maybeSingle();
    const onOnboarding = location.pathname === "/onboarding";
    if (!profile?.onboarding_complete && !onOnboarding) {
      throw redirect({
        to: "/onboarding"
      });
    }
    if (profile?.onboarding_complete && onOnboarding) {
      throw redirect({
        to: "/dashboard"
      });
    }
    return {
      user: data.user,
      profile
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-CzTB60Vv.mjs");
const Route$e = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Paisa — Your AI-Powered Financial Coach"
    }, {
      name: "description",
      content: "Connect bank, UPI and cards. Get AI-driven expense insights, goal tracking and a personal AI financial advisor — built for India."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./auth.reset-password-HxrnzoLH.mjs");
const Route$d = createFileRoute("/auth/reset-password")({
  head: () => ({
    meta: [{
      title: "Set new password — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./auth.register-DGxPtDvH.mjs");
const Route$c = createFileRoute("/auth/register")({
  head: () => ({
    meta: [{
      title: "Create account — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./auth.login-DEmcn_Xd.mjs");
const Route$b = createFileRoute("/auth/login")({
  head: () => ({
    meta: [{
      title: "Sign in — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
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
const $$splitComponentImporter$9 = () => import("./auth.forgot-password-99EFKlLk.mjs");
const Route$a = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [{
      title: "Reset password — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const BASE_PROMPT = `You are an expert AI Personal Finance Coach for Indian users. Provide concise, actionable advice in simple language. Use bullet points and ₹ symbols. Reference Indian tax laws and products (PPF, NPS, ELSS, FD, mutual funds, UPI). Never recommend specific stocks. Keep responses under 200 words unless asked for detail.`;
const Route$9 = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, userContext } = await request.json();
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages required", { status: 400 });
        }
        const key = process.env.GEMINI_API_KEY;
        if (!key) return new Response("Missing GEMINI_API_KEY", { status: 500 });
        const gemini = createGeminiProvider(key);
        const model = gemini(GEMINI_MODEL);
        const system = userContext ? `${BASE_PROMPT}

The user's current financial data (JSON):
${userContext}

Use this data to answer specifically. Cite exact ₹ amounts, merchants, and categories from it. If asked about something not in the data, say so.` : BASE_PROMPT;
        const uiMessages = messages.slice(-10).map((m, i) => ({
          id: String(i),
          role: m.role,
          parts: [{ type: "text", text: m.content }]
        }));
        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(uiMessages)
        });
        return result.toTextStreamResponse();
      }
    }
  }
});
const $$splitComponentImporter$8 = () => import("./transactions-CMmJAsdl.mjs");
const Route$8 = createFileRoute("/_authenticated/transactions")({
  head: () => ({
    meta: [{
      title: "Transactions — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./settings-Ct8aoAw4.mjs");
const Route$7 = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [{
      title: "Settings — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./reports-DJ9qUiRI.mjs");
const Route$6 = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [{
      title: "Reports — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./onboarding-CA8fiN7r.mjs");
const Route$5 = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{
      title: "Welcome — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./investments-CS7wDumz.mjs");
const Route$4 = createFileRoute("/_authenticated/investments")({
  head: () => ({
    meta: [{
      title: "Investments — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./goals-BA3uo5W8.mjs");
const Route$3 = createFileRoute("/_authenticated/goals")({
  head: () => ({
    meta: [{
      title: "Goals — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./emi-2i_N42Ig.mjs");
const Route$2 = createFileRoute("/_authenticated/emi")({
  head: () => ({
    meta: [{
      title: "EMI Tracker — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./dashboard-BMikOLoD.mjs");
const Route$1 = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./chat-DDsafqmL.mjs");
const Route = createFileRoute("/_authenticated/chat")({
  head: () => ({
    meta: [{
      title: "AI Chat — Paisa"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AuthenticatedRouteRoute = Route$f.update({
  id: "/_authenticated",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$e.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const AuthResetPasswordRoute = Route$d.update({
  id: "/auth/reset-password",
  path: "/auth/reset-password",
  getParentRoute: () => Route$g
});
const AuthRegisterRoute = Route$c.update({
  id: "/auth/register",
  path: "/auth/register",
  getParentRoute: () => Route$g
});
const AuthLoginRoute = Route$b.update({
  id: "/auth/login",
  path: "/auth/login",
  getParentRoute: () => Route$g
});
const AuthForgotPasswordRoute = Route$a.update({
  id: "/auth/forgot-password",
  path: "/auth/forgot-password",
  getParentRoute: () => Route$g
});
const ApiChatRoute = Route$9.update({
  id: "/api/chat",
  path: "/api/chat",
  getParentRoute: () => Route$g
});
const AuthenticatedTransactionsRoute = Route$8.update({
  id: "/transactions",
  path: "/transactions",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedSettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedReportsRoute = Route$6.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedOnboardingRoute = Route$5.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedInvestmentsRoute = Route$4.update({
  id: "/investments",
  path: "/investments",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedGoalsRoute = Route$3.update({
  id: "/goals",
  path: "/goals",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedEmiRoute = Route$2.update({
  id: "/emi",
  path: "/emi",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$1.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedChatRoute = Route.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedChatRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedEmiRoute,
  AuthenticatedGoalsRoute,
  AuthenticatedInvestmentsRoute,
  AuthenticatedOnboardingRoute,
  AuthenticatedReportsRoute,
  AuthenticatedSettingsRoute,
  AuthenticatedTransactionsRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  ApiChatRoute,
  AuthForgotPasswordRoute,
  AuthLoginRoute,
  AuthRegisterRoute,
  AuthResetPasswordRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  AuthShell as A,
  Divider as D,
  Field as F,
  router as r,
  useTheme as u
};
