import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  fileBase64: z.string().min(1),
  filename: z.string().min(1).max(255),
  fileType: z.enum(["pdf", "csv", "xlsx", "xls"]),
});

export const parseStatement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const { parsePdfWithGemini, parseSpreadsheetWithGemini } = await import("./gemini.server");

    if (data.fileType === "pdf") {
      const txns = await parsePdfWithGemini(data.fileBase64, data.filename);
      return { transactions: txns };
    }

    const { spreadsheetToText } = await import("./spreadsheet.server");
    const csvType = data.fileType === "csv" ? "csv" : data.fileType;
    const text = await spreadsheetToText(data.fileBase64, csvType);
    if (!text.trim()) throw new Error("Spreadsheet appears empty.");

    const txns = await parseSpreadsheetWithGemini(text, data.filename);
    if (txns.length === 0) throw new Error("AI could not find transactions. Try exporting a different format from your bank.");
    return { transactions: txns };
  });
