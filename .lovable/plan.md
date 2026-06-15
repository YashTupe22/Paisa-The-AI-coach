
# AI Finance Coach — Build Plan

A dark, Linear-inspired personal finance app for Indian users with bank/UPI/card data, goals, EMIs, investments, reports, and an AI chat coach.

## Stack decisions

- TanStack Start (current template) + TypeScript + Tailwind v4 + shadcn/ui + Recharts + lucide-react + framer-motion.
- Lovable Cloud (Supabase) for auth, Postgres, Storage, RLS.
- AI: Lovable AI Gateway via a server function. Spec requests Anthropic Claude; Lovable AI Gateway does not currently expose Anthropic models, so I'll default to `google/gemini-3-flash-preview` with the same system prompt and conversation contract. If you'd rather use Anthropic directly with your own key, say the word and I'll switch to a direct Anthropic call behind a secret.
- Inter Variable (Google Fonts via `<link>` in root head) with `font-feature-settings: "cv01","ss03"` globally. Berkeley Mono is proprietary — I'll use `JetBrains Mono` as the mono fallback (or swap to a self-hosted Berkeley Mono if you provide the files).

## Design system (src/styles.css)

Replace tokens with Linear palette exactly as specified, expose Tailwind utilities:

- `--background #08090a`, `--panel #0f1011`, `--card #191a1b`, `--hover #28282c`
- `--foreground #f7f8f8`, `--body #d0d6e0`, `--muted #8a8f98`, `--subtle #62666d`
- `--primary #5e6ad2`, `--accent #7170ff`, `--accent-hover #828fff`, `--success #27a644`
- Borders: `--border rgba(255,255,255,0.08)`, `--border-subtle rgba(255,255,255,0.05)`
- Radii, button/input/card/badge variants per spec. No drop shadows; elevation via bg stepping.
- Typography scale (display 48 / section 32 / card 20 / body 16 / label 13–14) with the exact weights (300/400/510/590) and letter-spacing values.
- Utility classes: `.font-mono`, `.num` (mono + tabular-nums), `.card-surface`, `.btn-primary`, `.btn-ghost`, `.input`, `.badge`.

## Routing (TanStack file-based)

Public:
- `/` landing, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`

Onboarding + app (under `_authenticated/`, ssr:false gate provided by integration):
- `/onboarding` (4-step wizard with internal state machine)
- `/dashboard`
- `/transactions`
- `/goals`
- `/investments`
- `/emi`
- `/chat` and `/chat/$sessionId` (threaded)
- `/reports`
- `/settings` (tabs: profile/accounts/notifications/security)

Server routes / functions:
- `src/lib/*.functions.ts` for CRUD reads (transactions, goals, dashboard summary, health score, insights).
- `src/routes/api/chat.ts` streaming chat endpoint using AI SDK + Lovable Gateway.
- `src/lib/statements.functions.ts` for signed upload URL to Storage.

## Database (Supabase migrations)

Create enums (`account_type`, `txn_type`, `goal_type`, `loan_status`, `investment_type`, `app_role`) and tables per spec:

`users` (synced from auth via trigger), `user_profiles`, `bank_accounts`, `upi_accounts`, `transactions`, `transaction_categories`, `goals`, `goal_contributions`, `investments`, `loans`, `financial_health_scores`, `chat_sessions`, `chat_messages`, `ai_insights`, `uploaded_statements`, `notifications`, `budget_allocations`, `user_roles`.

For every table:
- `GRANT SELECT,INSERT,UPDATE,DELETE ... TO authenticated; GRANT ALL TO service_role;`
- `ENABLE ROW LEVEL SECURITY`
- Owner-scoped policies via `auth.uid() = user_id` (child tables join through parent).
- `transaction_categories` is reference data: select-only to authenticated, seeded.
- `user_roles` separate with `has_role()` security-definer function.

Storage bucket `statements` (private) with RLS on `storage.objects` scoped to `auth.uid()`.

## Seed / mock data

Server function `seedDemoData` (authenticated, idempotent per user) inserts the spec'd demo set on first onboarding completion or via a "Load demo data" button in Settings: 3 accounts, 60 transactions across 2 months, 3 goals, 2 loans, 4 investments, computed health score (~68), 4 insights.

## AI chat

- `src/routes/api/chat.ts` streams via AI SDK + Lovable Gateway, model `google/gemini-3-flash-preview`, with the exact system prompt from the spec, and last 10 messages of history.
- Persist sessions + messages in `chat_sessions` / `chat_messages` keyed by route `sessionId`.
- AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`) for the UI. Suggested-prompt chips on empty state. Markdown rendering for assistant responses.

## Screens (build order)

1. Auth: landing + login + register + forgot/reset (Google OAuth via Lovable broker; email/password).
2. Onboarding wizard (income → goals → connect data → processing animation → dashboard).
3. Dashboard: 4 summary cards, expense donut, health-score gauge, recent transactions, active goals, AI insights rail.
4. Transactions: filter bar, table with inline category edit, CSV export, pagination.
5. AI Chat: thread list + streaming chat + suggested prompts.
6. Goals: grid + create modal + contribution timeline.
7. EMI: loans list + month calendar + EMI/income bar + add-loan modal.
8. Settings: 4 tabs with editable forms.
9. Investments + Reports: holdings table, allocation donut, SIP list, recommendations; reports charts + PDF export placeholder.

## Cross-cutting

- `formatINR()` using `toLocaleString('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 })`.
- `formatDate()` → `DD MMM YYYY`.
- Skeletons for every async surface; empty states with CTA; sonner toasts for success/error.
- Mobile: sidebar collapses into bottom nav under 768px.
- Framer-motion fade/slide on route mount and chart entrance.
- Focus rings using multi-layer shadow stack.

## Open items I'll assume unless you say otherwise

- AI provider: Lovable AI Gateway with Gemini 3 Flash (not Anthropic).
- Mono font: JetBrains Mono fallback (no Berkeley Mono license).
- UPI/bank "connections" are UI-only placeholders (no real account aggregator).
- PDF statement upload stores the file and marks `status='done'` without real parsing (parsing is out of scope unless you want it).
- Report "Export PDF" is a placeholder button.

Reply "go" to start building, or tell me which assumptions to change.
