import { createFileRoute, Outlet, redirect, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Receipt, Target, TrendingUp, Calendar, MessageSquareText, BarChart3, Settings, Wallet, LogOut, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";
import { FloatingChat } from "@/components/floating-chat";
import { useRealtimeInvalidate } from "@/hooks/use-realtime-invalidate";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth/login" });
    return { user: data.user };
  },
  component: AuthedLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/investments", label: "Investments", icon: TrendingUp },
  { to: "/emi", label: "EMI Tracker", icon: Calendar },
  { to: "/chat", label: "AI Chat", icon: MessageSquareText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function AuthedLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  useRealtimeInvalidate();

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth/login", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-[var(--border)] bg-panel md:flex">
        <div className="flex h-14 items-center gap-2 px-5">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary"><Wallet className="h-4 w-4 text-white" /></div>
          <span className="font-medium tracking-tight text-foreground">Paisa</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-[var(--hover)] text-foreground" : "text-body hover:bg-[var(--hover)] hover:text-foreground"
                }`}
              >
                <span className={`block h-4 w-0.5 rounded-full ${active ? "bg-accent" : "bg-transparent"}`} />
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="m-2 space-y-1">
          <button onClick={toggle} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-[var(--hover)] hover:text-foreground">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button onClick={signOut} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted hover:bg-[var(--hover)] hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-[var(--border)] bg-panel py-1.5 md:hidden">
        {NAV.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-muted [&.active]:text-accent" activeProps={{ className: "active" }}>
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
