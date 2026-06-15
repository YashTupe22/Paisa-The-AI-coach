import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const computeHealthScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { computeAndStoreHealthScore } = await import("./health-score.server");
    const result = await computeAndStoreHealthScore(context.supabase, context.userId);
    return result;
  });
