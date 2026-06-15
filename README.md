# Paisa - The AI Coach

Your AI-powered personal finance coach built for Indian users. Paisa helps you connect bank accounts, track expenses, manage investments, and get personalized financial advice powered by Google Gemini AI.

## Features

- **Bank Statement Parsing** - Upload PDF, CSV, or Excel bank statements and let AI automatically categorize every transaction
- **AI Financial Coach** - Chat with an AI that understands Indian finance (PPF, NPS, ELSS, UPI, mutual funds) and receives your complete financial snapshot for personalized advice
- **Dashboard** - Overview of balance, income, expenses, financial health score (0-100), and AI-generated insights
- **Transaction Management** - Full transaction table with search, filter, inline category editing, and CSV export
- **Goals Tracking** - Set and track financial goals (Emergency Fund, Retirement, Home, Education, etc.) with progress visualization
- **Investment Portfolio** - Track mutual funds, stocks, FDs, PPF, NPS, gold, and ETFs with allocation charts
- **EMI / Loan Tracker** - Monitor loans with EMI-to-income ratio and burden classification
- **Reports** - Monthly reports with 6-month cashflow charts, spending breakdowns, and PDF export
- **Credit Card Management** - Track credit limits, outstanding balances, utilization, and pay bills

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | Frontend UI |
| TanStack Start + Router | Full-stack framework with SSR |
| Vite 7 | Build tool |
| Supabase | Database, Auth, Storage, Real-time |
| Google Gemini AI | Statement parsing and chat |
| Vercel AI SDK | Streaming chat responses |
| Tailwind CSS 4 | Styling |
| shadcn/ui | Component library |
| Recharts | Charts and visualizations |
| Framer Motion | Animations |

## Getting Started

### Prerequisites

- Node.js v18+
- Bun (recommended) or npm
- Supabase project
- Google Gemini API key

### Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Preview

```bash
bun run preview
```

## Project Structure

```
src/
├── components/       # UI components (shadcn/ui + custom)
├── hooks/            # React hooks
├── integrations/     # Supabase & Lovable integrations
├── lib/              # Utilities, AI, finance logic
└── routes/           # File-based routing
    ├── auth.*        # Login, register, forgot/reset password
    ├── api/          # Server endpoints (chat)
    └── _authenticated/
        ├── dashboard.tsx
        ├── transactions.tsx
        ├── goals.tsx
        ├── investments.tsx
        ├── emi.tsx
        ├── chat.tsx
        ├── reports.tsx
        ├── settings.tsx
        └── onboarding.tsx
```

## Database

Supabase migrations are in `supabase/migrations/`. Key tables:

- `profiles` - User profiles with income and onboarding status
- `bank_accounts` - Savings, current, credit card, wallet
- `transactions` - All financial transactions with categories
- `goals` / `goal_contributions` - Financial goals and contributions
- `investments` - Investment holdings
- `loans` - Loan and EMI tracking
- `chat_sessions` / `chat_messages` - AI chat history

All tables have Row Level Security (RLS) policies scoped to authenticated users.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set the required environment variables in the Vercel dashboard:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy - Vercel will automatically detect the build configuration

Alternatively, deploy via Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Manual Build

```bash
NITRO_PRESET=vercel bun run build
```

## License

MIT
