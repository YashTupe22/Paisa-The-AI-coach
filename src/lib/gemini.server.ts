// Server-only: parses a PDF bank/credit-card statement into structured transactions
// via Lovable AI Gateway → google/gemini-3-flash-preview using raw chat-completions
// (the AI SDK doesn't currently emit PDF file parts, so we hit the gateway directly).

export type ParsedTxn = {
  date: string;          // YYYY-MM-DD
  merchant_name: string;
  amount: number;        // positive number
  type: "debit" | "credit";
  suggested_category: string;
};

const SYSTEM = `You are a bank-statement parser. Extract every transaction from the PDF and return strict JSON of the form:
{"transactions":[{"date":"YYYY-MM-DD","merchant_name":"string","amount":1234.56,"type":"debit"|"credit","suggested_category":"Food & Dining"|"Transport"|"Shopping"|"Utilities"|"Entertainment"|"Salary"|"EMI"|"Investment"|"Transfer"|"Other"}]}
Rules:
- amount is always positive.
- type is "debit" for money out (withdrawals, purchases) and "credit" for money in (salary, refunds, transfers in).
- Skip headers, balances, and summary rows.
- If no transactions, return {"transactions":[]}.
Return ONLY the JSON object, no prose, no markdown fences.`;

export async function parsePdfWithGemini(pdfBase64: string, filename: string): Promise<ParsedTxn[]> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("LOVABLE_API_KEY not configured");

  const body = {
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: SYSTEM },
      {
        role: "user",
        content: [
          { type: "text", text: "Parse this statement and return the JSON." },
          { type: "file", file: { filename, file_data: `data:application/pdf;base64,${pdfBase64}` } },
        ],
      },
    ],
    response_format: { type: "json_object" },
  };

  console.log(`[parsePdfWithGemini] filename=${filename} base64Bytes=${pdfBase64.length}`);

  let res: Response;
  try {
    res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "raw-fetch",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[parsePdfWithGemini] network error", err);
    throw new Error("Could not reach the AI gateway. Please try again.");
  }

  if (!res.ok) {
    const text = await res.text();
    console.error(`[parsePdfWithGemini] gateway ${res.status}: ${text.slice(0, 500)}`);
    if (res.status === 429) throw new Error("AI rate limit reached, try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    if (res.status === 413) throw new Error("PDF too large for the model. Try a smaller file.");
    throw new Error(`Gemini failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const content: string = json?.choices?.[0]?.message?.content ?? "{}";
  let parsed: { transactions?: ParsedTxn[] };
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : { transactions: [] };
  }
  console.log(`[parsePdfWithGemini] extracted ${parsed.transactions?.length ?? 0} transactions`);
  return (parsed.transactions ?? []).filter((t) => t.date && t.amount && t.merchant_name);
}
