import { c as createOpenAICompatible } from "../_libs/ai-sdk__openai-compatible.mjs";
const GEMINI_MODEL = "gemini-3.1-flash-lite";
function createGeminiProvider(geminiApiKey) {
  return createOpenAICompatible({
    name: "google-gemini",
    apiKey: geminiApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
  });
}
export {
  GEMINI_MODEL as G,
  createGeminiProvider as c
};
