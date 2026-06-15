
-- Enums
CREATE TYPE public.account_type AS ENUM ('savings','current','credit_card','wallet');
CREATE TYPE public.txn_type AS ENUM ('debit','credit');
CREATE TYPE public.goal_type AS ENUM ('emergency_fund','retirement','home','education','vacation','debt_payoff','wealth_building','other');
CREATE TYPE public.investment_type AS ENUM ('mutual_fund','stock','fd','gold','ppf','nps','etf');
CREATE TYPE public.statement_status AS ENUM ('processing','done','failed');
CREATE TYPE public.chat_role AS ENUM ('user','assistant');
CREATE TYPE public.app_role AS ENUM ('admin','user');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- profiles (mirrors auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  occupation TEXT,
  employer TEXT,
  monthly_income NUMERIC(14,2) DEFAULT 0,
  risk_appetite TEXT DEFAULT 'moderate',
  financial_goals TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role) RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- transaction categories (shared lookup)
CREATE TABLE public.transaction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT
);
GRANT SELECT ON public.transaction_categories TO authenticated, anon;
GRANT ALL ON public.transaction_categories TO service_role;
ALTER TABLE public.transaction_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories readable" ON public.transaction_categories FOR SELECT USING (true);
INSERT INTO public.transaction_categories (name, icon, color) VALUES
  ('Food & Dining','utensils','#f97316'),
  ('Transport','car','#3b82f6'),
  ('Shopping','shopping-bag','#ec4899'),
  ('Utilities','plug','#eab308'),
  ('Entertainment','film','#a855f7'),
  ('EMI','landmark','#ef4444'),
  ('Income','arrow-down-circle','#27a644'),
  ('Other','more-horizontal','#8a8f98');

-- bank accounts
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_type public.account_type NOT NULL DEFAULT 'savings',
  bank_name TEXT,
  last4 TEXT,
  credit_limit NUMERIC(14,2),
  balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;
GRANT ALL ON public.bank_accounts TO service_role;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own accounts" ON public.bank_accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- upi accounts
CREATE TABLE public.upi_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upi_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.upi_accounts TO authenticated;
GRANT ALL ON public.upi_accounts TO service_role;
ALTER TABLE public.upi_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own upi" ON public.upi_accounts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  merchant_name TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  type public.txn_type NOT NULL,
  category TEXT,
  ai_category TEXT,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX transactions_user_date_idx ON public.transactions(user_id, date DESC);

-- goals
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.goal_type NOT NULL DEFAULT 'other',
  target_amount NUMERIC(14,2) NOT NULL,
  current_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  monthly_contribution NUMERIC(14,2) DEFAULT 0,
  deadline DATE,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own goals" ON public.goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- goal contributions
CREATE TABLE public.goal_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(14,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goal_contributions TO authenticated;
GRANT ALL ON public.goal_contributions TO service_role;
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own contributions" ON public.goal_contributions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- investments
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type public.investment_type NOT NULL,
  units NUMERIC(14,4),
  avg_buy_price NUMERIC(14,2),
  current_value NUMERIC(14,2) NOT NULL DEFAULT 0,
  invested_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  sip_amount NUMERIC(14,2),
  sip_date INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investments TO authenticated;
GRANT ALL ON public.investments TO service_role;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own investments" ON public.investments FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- loans
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lender TEXT,
  principal NUMERIC(14,2) NOT NULL,
  outstanding NUMERIC(14,2) NOT NULL,
  emi_amount NUMERIC(14,2) NOT NULL,
  emi_day INTEGER NOT NULL DEFAULT 5,
  next_due DATE,
  tenure_months INTEGER,
  months_remaining INTEGER,
  interest_rate NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.loans TO authenticated;
GRANT ALL ON public.loans TO service_role;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own loans" ON public.loans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- financial health scores
CREATE TABLE public.financial_health_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score INTEGER NOT NULL,
  savings_score INTEGER NOT NULL,
  debt_score INTEGER NOT NULL,
  emergency_score INTEGER NOT NULL,
  investment_score INTEGER NOT NULL,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financial_health_scores TO authenticated;
GRANT ALL ON public.financial_health_scores TO service_role;
ALTER TABLE public.financial_health_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scores" ON public.financial_health_scores FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- chat
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_sessions TO authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own sessions" ON public.chat_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER chat_sessions_updated_at BEFORE UPDATE ON public.chat_sessions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.chat_role NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX chat_messages_session_idx ON public.chat_messages(session_id, created_at);

-- ai insights
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  heading TEXT NOT NULL,
  body TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_insights TO authenticated;
GRANT ALL ON public.ai_insights TO service_role;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own insights" ON public.ai_insights FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- uploaded statements
CREATE TABLE public.uploaded_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT,
  status public.statement_status NOT NULL DEFAULT 'processing',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uploaded_statements TO authenticated;
GRANT ALL ON public.uploaded_statements TO service_role;
ALTER TABLE public.uploaded_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own statements" ON public.uploaded_statements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifs" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- budget allocations
CREATE TABLE public.budget_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  monthly_limit NUMERIC(14,2) NOT NULL,
  month_year TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, category, month_year)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budget_allocations TO authenticated;
GRANT ALL ON public.budget_allocations TO service_role;
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own budgets" ON public.budget_allocations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
