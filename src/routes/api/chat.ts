import { createFileRoute } from "@tanstack/react-router";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

type Body = { messages?: Array<{ role: "user" | "assistant"; content: string }> };

const SYSTEM_PROMPT = `You are an expert AI Personal Finance Coach for Indian users. You have access to the user's financial data including transactions, account balances, goals, investments, and EMIs. Provide concise, actionable advice in simple language. Format responses clearly with bullet points and ₹ symbols. Always contextualize advice for Indian tax laws, investment products (PPF, NPS, ELSS, FD, mutual funds), and UPI/banking norms. Never recommend specific stocks. Keep responses under 200 words unless the user asks for detail.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("Messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        // Convert simple {role, content} to UIMessage parts
        const uiMessages: UIMessage[] = messages.slice(-10).map((m, i) => ({
          id: String(i),
          role: m.role,
          parts: [{ type: "text", text: m.content }],
        })) as UIMessage[];

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
