import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TABLES = ["transactions", "bank_accounts", "goals", "investments", "loans", "ai_insights", "financial_health_scores", "profiles"];

export function useRealtimeInvalidate() {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase.channel("app-data-changes");
    TABLES.forEach((t) => {
      channel.on("postgres_changes" as never, { event: "*", schema: "public", table: t }, () => {
        qc.invalidateQueries();
      });
    });
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);
}
