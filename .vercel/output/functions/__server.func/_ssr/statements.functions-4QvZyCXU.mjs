import { c as createServerRpc } from "./createServerRpc-BHgXp4ZS.mjs";
import { b as createServerFn } from "./server-BTM9F0kO.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DT31IUtl.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { h as objectType, m as enumType, j as stringType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const Input = objectType({
  fileBase64: stringType().min(1),
  filename: stringType().min(1).max(255),
  fileType: enumType(["pdf", "csv", "xlsx", "xls"])
});
const parseStatement_createServerFn_handler = createServerRpc({
  id: "529679f31bb3665b04d0812e6a33f58f04ee783a74f3a28b5204b63d12ce5572",
  name: "parseStatement",
  filename: "src/lib/statements.functions.ts"
}, (opts) => parseStatement.__executeServer(opts));
const parseStatement = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator((d) => Input.parse(d)).handler(parseStatement_createServerFn_handler, async ({
  data
}) => {
  const {
    parsePdfWithGemini,
    parseSpreadsheetWithGemini
  } = await import("./gemini.server-BLvXsdWC.mjs");
  if (data.fileType === "pdf") {
    const txns2 = await parsePdfWithGemini(data.fileBase64, data.filename);
    return {
      transactions: txns2
    };
  }
  const {
    spreadsheetToText
  } = await import("./spreadsheet.server-Crp6fkqT.mjs");
  const csvType = data.fileType === "csv" ? "csv" : data.fileType;
  const text = await spreadsheetToText(data.fileBase64, csvType);
  if (!text.trim()) throw new Error("Spreadsheet appears empty.");
  const txns = await parseSpreadsheetWithGemini(text, data.filename);
  if (txns.length === 0) throw new Error("AI could not find transactions. Try exporting a different format from your bank.");
  return {
    transactions: txns
  };
});
export {
  parseStatement_createServerFn_handler
};
