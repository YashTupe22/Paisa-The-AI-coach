DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['transactions','bank_accounts','goals','investments','loans','ai_insights','financial_health_scores','profiles']
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
  END LOOP;
END $$;