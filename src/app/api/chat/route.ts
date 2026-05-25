import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { WEDDING_CONCIERGE_SYSTEM_PROMPT } from "@/lib/wedding-concierge-prompt";

export const maxDuration = 60;
export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

function getSystemPrompt() {
  const currentDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "America/Mexico_City",
  }).format(new Date());

  return [
    WEDDING_CONCIERGE_SYSTEM_PROMPT,
    `Current date in San Miguel de Allende: ${currentDate}.`,
  ].join("\n\n");
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Chat is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown }).messages;

  if (!Array.isArray(messages)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = streamText({
    model: anthropic(MODEL),
    system: getSystemPrompt(),
    messages: await convertToModelMessages(messages as UIMessage[]),
    temperature: 0.4,
    tools: {
      web_search: anthropic.tools.webSearch_20250305({
        maxUses: 4,
        userLocation: {
          type: "approximate",
          country: "MX",
          city: "San Miguel de Allende",
          timezone: "America/Mexico_City",
        },
      }),
      web_fetch: anthropic.tools.webFetch_20250910({ maxUses: 2 }),
    },
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
  });
}
