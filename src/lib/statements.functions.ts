import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({ pdfBase64: z.string().min(1), filename: z.string().min(1).max(255) });

export const parseStatement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { parsePdfWithGemini } = await import("./gemini.server");
    const txns = await parsePdfWithGemini(data.pdfBase64, data.filename);
    return { transactions: txns };
  });
