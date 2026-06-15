import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const GEMINI_MODEL = "gemini-3.1-flash-lite";

export function createGeminiProvider(geminiApiKey: string) {
  return createOpenAICompatible({
    name: "google-gemini",
    apiKey: geminiApiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  });
}
