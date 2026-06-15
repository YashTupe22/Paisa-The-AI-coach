
-- Add credit_card-related fields to bank_accounts (credit_card type already exists)
ALTER TABLE public.bank_accounts
  ADD COLUMN IF NOT EXISTS statement_day int,
  ADD COLUMN IF NOT EXISTS due_day int,
  ADD COLUMN IF NOT EXISTS outstanding_balance numeric DEFAULT 0;

-- Payment intents table (for Stripe wiring later; usable now for "mark as paid")
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status text NOT NULL DEFAULT 'pending',
  purpose text NOT NULL DEFAULT 'credit_card_payment',
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_intents TO authenticated;
GRANT ALL ON public.payment_intents TO service_role;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own payment intents" ON public.payment_intents
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER set_updated_at_payment_intents BEFORE UPDATE ON public.payment_intents
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Storage policies for the 'statements' bucket (bucket created via tool)
CREATE POLICY "statements: users read own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'statements' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "statements: users insert own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'statements' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "statements: users delete own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'statements' AND auth.uid()::text = (storage.foldername(name))[1]);
