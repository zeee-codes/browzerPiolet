import { NextRequest } from "next/server";
import { runAgentOrchestrator } from "@/lib/agent/orchestrator";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, data: string) => {
        const payload = JSON.stringify({ type, data });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      };

      try {
        await runAgentOrchestrator(prompt, (event) => {
          sendEvent(event.type, event.data);
        });
      } catch (err: any) {
        sendEvent("error", err.message || "Unknown orchestrator error");
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
