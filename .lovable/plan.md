
# Phase 1 — Cleanup

1. Delete `src/routes/api/public/seed-test-users.ts` and the `SEED_TOKEN` secret reference.
2. In `src/routes/_authenticated/onboarding.tsx`, remove the demo data block (the 60 transactions / 3 goals / 2 loans / 4 investments insert). Onboarding will only save income/profile + selected goals the user typed in.

# Phase 2 — Theme: light default + toggle

1. Add a `ThemeProvider` (`src/components/theme-provider.tsx`) using `localStorage` key `paisa-theme`, default `light`.
2. Rewrite `src/styles.css` tokens:
   - `:root` = light palette (white background, slate text, indigo primary).
   - `.dark` = current Linear-dark palette.
3. Add toggle in app shell (sidebar footer) using `lucide-react` Sun/Moon.
4. Drop the hardcoded `color-scheme: dark` / `<html class="dark">` defaults.

# Phase 3 — Database additions

Migration:
- Extend `account_type` enum with `credit_card`.
- Add columns to `bank_accounts`: `credit_limit numeric`, `statement_day int`, `due_day int`, `outstanding_balance numeric`.
- Create `payment_intents` table (id, user_id, amount, currency, status, stripe_session_id, purpose, created_at) with RLS + GRANTs.
- Storage bucket `statements` (private) + RLS scoped to `auth.uid()` folder prefix.

# Phase 4 — Server functions / routes

Client-safe `.functions.ts` modules:
- `src/lib/transactions.functions.ts` — list (with filter/pagination), create, update (category), delete, CSV export.
- `src/lib/goals.functions.ts` — CRUD + addContribution.
- `src/lib/loans.functions.ts` — CRUD + monthly EMI summary.
- `src/lib/investments.functions.ts` — CRUD + allocation summary.
- `src/lib/reports.functions.ts` — monthly cashflow, category breakdown, health-score recompute.
- `src/lib/accounts.functions.ts` — CRUD incl. credit_card fields.
- `src/lib/profile.functions.ts` — get/update profile, notification prefs.
- `src/lib/statements.functions.ts` — signed upload URL + `parseStatement` (calls Gemini).

Server-only:
- `src/lib/gemini.server.ts` — wraps Lovable AI Gateway `google/gemini-3-flash-preview` for PDF→JSON statement parsing using `Output.object` schema (date, merchant, amount, type, suggested_category). PDFs are passed as `{type:'file', file:{filename, file_data: dataUrl}}` in chat-completions body via direct `fetch` (AI SDK doesn't support PDF parts), authed with `LOVABLE_API_KEY`.
- `src/lib/stripe.server.ts` — lazy `import('stripe')`, `createCheckoutSession({amount, purpose})` returning hosted URL.

Server route (raw HTTP for Stripe webhook):
- `src/routes/api/public/stripe-webhook.ts` — verifies signature with `STRIPE_WEBHOOK_SECRET`, marks `payment_intents.status='succeeded'`, on `purpose='credit_card_payment'` decrements `bank_accounts.outstanding_balance` and inserts a `transactions` row.

# Phase 5 — Screens

Each replaces the current stub:

- **Transactions** — filter bar (date range, category, type, account), shadcn Table with inline category Select, "Add Transaction" dialog, CSV export button, pagination. Uses TanStack Query.
- **Goals** — card grid, "New Goal" dialog, per-card progress bar + "Add Contribution" sheet, completion confetti via framer-motion.
- **EMI** — loans table (principal, EMI, tenure, next due), "Add Loan" dialog, monthly bar chart (Recharts) of EMI burden vs income.
- **Investments** — holdings table (current value, gain/loss %), allocation donut by `investment_type`, "Add Investment" dialog.
- **Reports** — month picker, cashflow bar chart, category donut, top-merchants list, health-score gauge, "Export PDF" button (uses `window.print()` with print stylesheet — no extra deps).
- **Settings** — tabs:
  - *Profile* (name, income, currency).
  - *Accounts* (CRUD bank/credit card, credit-card-specific fields visible only when type=credit_card; "Pay Bill" button → Stripe Checkout).
  - *Statements* (drag-drop PDF, lists `uploaded_statements`, "Parse with AI" calls Gemini fn → opens review modal → bulk-insert transactions).
  - *Appearance* (theme toggle).
  - *Notifications* (toggle prefs in `profiles`).
  - *Security* (change password via `supabase.auth.updateUser`).

# Phase 6 — Credit cards UI

- Dashboard adds a "Credit Cards" summary card if any exist (utilization %, due date).
- Account dialog: when `type=credit_card`, show `credit_limit`, `statement_day`, `due_day`, `outstanding_balance`.
- "Pay Bill" CTA hits `createCheckoutSession` server fn → redirects to Stripe Checkout.

# Phase 7 — Secrets / dependencies

- Already have `LOVABLE_API_KEY`.
- Will request `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` via `add_secret` (you'll fill them in).
- `bun add stripe recharts framer-motion` (most already present — will verify, only add missing).

# Phase 8 — Cleanup tasks

- Remove `SEED_TOKEN` secret with `delete_secret`.
- Update `.lovable/plan.md` notes section to reflect Stripe + Gemini PDF.

---

## Open assumptions (tell me to change any)

- PDF parser sends the **whole PDF** to Gemini (first 50 pages). No OCR fallback for scanned PDFs in this pass.
- Stripe in **test mode** until you supply live keys.
- "Pay Bill" creates a Checkout Session in INR; settles after webhook (no instant UI update — query refetches on focus).
- Reports "Export PDF" = `window.print()` with a styled print sheet, not a generated PDF.
- Credit card outstanding balance is **manually maintained** + auto-decremented on successful payment; no automatic statement reconciliation.

Reply "go" to start, or tell me what to change.
