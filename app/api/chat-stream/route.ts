import { chatWithStream } from "@/server/chat";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, provider = "groq" } = await request.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await chatWithStream(provider as "groq" | "openai", query);

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        let isClosed = false;

        const safeEnqueue = (data: Uint8Array) => {
          if (!isClosed) {
            try {
              controller.enqueue(data);
            } catch (error) {
              console.error("Controller enqueue error:", error);
              isClosed = true;
            }
          }
        };

        const safeClose = () => {
          if (!isClosed) {
            try {
              controller.close();
              isClosed = true;
            } catch (error) {
              console.error("Controller close error:", error);
            }
          }
        };

        stream.on("data", (chunk) => {
          const data = chunk.toString();
          safeEnqueue(encoder.encode(`data: ${data}\n\n`));
        });

        stream.on("end", () => {
          safeEnqueue(encoder.encode("data: \n\n"));
          safeClose();
        });

        stream.on("error", (error) => {
          console.error("Stream error:", error);
          safeEnqueue(
            encoder.encode(`data: {"error": "${error.message}"}\n\n`),
          );
          safeClose();
        });
        stream.on("close", () => {
          safeClose();
        });
      },
      cancel() {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in chat stream:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
