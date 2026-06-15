import { c as createServerRpc } from "./createServerRpc-BHgXp4ZS.mjs";
import { b as createServerFn } from "./server-BTM9F0kO.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DT31IUtl.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
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
const computeHealthScore_createServerFn_handler = createServerRpc({
  id: "a5d6090938d741d43be3931ee520be6d67b4804d44735619f4f3685befd6519b",
  name: "computeHealthScore",
  filename: "src/lib/health-score.functions.ts"
}, (opts) => computeHealthScore.__executeServer(opts));
const computeHealthScore = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(computeHealthScore_createServerFn_handler, async ({
  context
}) => {
  const {
    computeAndStoreHealthScore
  } = await import("./health-score.server-L4BNbVeI.mjs");
  const result = await computeAndStoreHealthScore(context.supabase, context.userId);
  return result;
});
export {
  computeHealthScore_createServerFn_handler
};
