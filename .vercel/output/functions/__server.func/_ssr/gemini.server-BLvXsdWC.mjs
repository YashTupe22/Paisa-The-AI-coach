import { G as GEMINI_MODEL } from "./ai-gateway.server-DVFdLzU8.mjs";
import "../_libs/ai-sdk__openai-compatible.mjs";
import "../_libs/ai-sdk__provider.mjs";
import "../_libs/ai-sdk__provider-utils.mjs";
import "../_libs/eventsource-parser.mjs";
import "../_libs/zod.mjs";
const CATEGORIES = "Food & Dining|Transport|Shopping|Utilities|Entertainment|Salary|EMI|Investment|Transfer|Other";
const SYSTEM = `You are a bank-statement parser for Indian users. Extract every transaction and assign a spending category.

Return strict JSON:
{"transactions":[{"date":"YYYY-MM-DD","merchant_name":"string","amount":1234.56,"type":"debit"|"credit","suggested_category":"${CATEGORIES}"}]}

Rules:
- amount is always positive.
- type "debit" = money out (purchases, withdrawals, EMI, SIP, transfers out).
- type "credit" = money in (salary, refunds, interest, transfers in).
- suggested_category: infer from merchant/description (e.g. Swiggy/Zomato → Food & Dining, Uber/Ola → Transport, SIP/mutual fund → Investment, loan EMI → EMI, salary → Salary).
- Skip headers, opening/closing balance rows, and summary lines.
- Handle any column layout — banks use different formats.
- If no transactions found, return {"transactions":[]}.
Return ONLY the JSON object, no prose, no markdown fences.`;
async function callGemini(parts, label) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not configured");
  const body = {
    system_instruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: "user", parts }],
    generationConfig: { responseMimeType: "application/json" }
  };
  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body) }
    );
  } catch {
    throw new Error("Could not reach the AI gateway. Please try again.");
  }
  if (!res.ok) {
    const text = await res.text();
    console.error(`[${label}] Gemini API ${res.status}: ${text.slice(0, 500)}`);
    if (res.status === 429) throw new Error("AI rate limit reached, try again in a minute.");
    if (res.status === 413) throw new Error("File too large for the model. Try a smaller export.");
    throw new Error(`AI analysis failed (${res.status})`);
  }
  const json = await res.json();
  const content = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : { transactions: [] };
  }
  const txns = (parsed.transactions ?? []).filter((t) => t.date && t.amount && t.merchant_name);
  console.log(`[${label}] extracted ${txns.length} transactions`);
  return txns;
}
async function parsePdfWithGemini(pdfBase64, filename) {
  return callGemini(
    [
      { text: `Parse the attached bank statement (${filename}) and categorize every transaction.` },
      { inline_data: { mime_type: "application/pdf", data: pdfBase64 } }
    ],
    "parsePdf"
  );
}
async function parseSpreadsheetWithGemini(csvText, filename) {
  const maxChars = 12e4;
  const truncated = csvText.length > maxChars;
  const text = truncated ? csvText.slice(0, maxChars) : csvText;
  const note = truncated ? "\n\n(Note: file was truncated — parse all visible rows.)" : "";
  return callGemini(
    [{ text: `Analyze this bank statement export (${filename}) and extract + categorize every transaction:

${text}${note}` }],
    "parseSpreadsheet"
  );
}
export {
  parsePdfWithGemini,
  parseSpreadsheetWithGemini
};
