import { createFileRoute } from "@tanstack/react-router";
import { createGeminiProvider, GEMINI_MODEL } from "@/lib/ai-gateway.server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

type Body = {
  messages?: Array<{ role: "user" | "assistant"; content: string }>;
  userContext?: string;
};

const BASE_PROMPT = `You are an expert AI Personal Finance Coach for Indian users. Provide concise, actionable advice in simple language. Use bullet points and ₹ symbols. Reference Indian tax laws and products (PPF, NPS, ELSS, FD, mutual funds, UPI). Never recommend specific stocks. Keep responses under 200 words unless asked for detail.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, userContext } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages required", { status: 400 });
        }
        const key = process.env.GEMINI_API_KEY;
        if (!key) return new Response("Missing GEMINI_API_KEY", { status: 500 });

        const gemini = createGeminiProvider(key);
        const model = gemini(GEMINI_MODEL);

        const system = userContext
          ? `${BASE_PROMPT}\n\nThe user's current financial data (JSON):\n${userContext}\n\nUse this data to answer specifically. Cite exact ₹ amounts, merchants, and categories from it. If asked about something not in the data, say so.`
          : BASE_PROMPT;

        const uiMessages: UIMessage[] = messages.slice(-10).map((m, i) => ({
          id: String(i),
          role: m.role,
          parts: [{ type: "text", text: m.content }],
        })) as UIMessage[];

        const result = streamText({
          model,
          system,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
