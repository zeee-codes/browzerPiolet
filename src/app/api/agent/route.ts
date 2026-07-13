import { NextRequest } from "next/server";
import { runAgentOrchestrator, AIProvider } from "@/lib/agent/orchestrator";

export const maxDuration = 300; // 5 min timeout for Vercel Pro
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get("prompt");
  const provider = (searchParams.get("provider") || "gemini") as AIProvider;
  const approvalMode = searchParams.get("approval") === "true";

  if (!prompt) {
    return new Response(JSON.stringify({ error: "Missing prompt parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, data: string) => {
        try {
          const payload = JSON.stringify({ type, data });
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // Controller may already be closed
        }
      };

      try {
        await runAgentOrchestrator(
          prompt,
          provider,
          (event) => sendEvent(event.type, event.data),
          approvalMode
        );
      } catch (err: any) {
        sendEvent("error", err.message || "Unknown orchestrator error");
      } finally {
        try { controller.close(); } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
