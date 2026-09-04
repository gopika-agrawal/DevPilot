import {
  getApiBaseUrl,
  ApiError,
} from "./api";

export async function streamChatMessage(
  sessionId,
  content,
  handlers = {}
) {
  const res = await fetch(
    `${getApiBaseUrl()}/api/chat/sessions/${sessionId}/messages`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
      signal: handlers.signal,
    }
  );

  // -----------------------------
  // HTTP error
  // -----------------------------

  if (!res.ok) {
    let message = res.statusText;

    try {
      const data = await res.json();

      message =
        data.message ??
        data.error ??
        message;
    } catch {
      // Response wasn't JSON.
    }

    throw new ApiError(
      res.status,
      message
    );
  }

  // -----------------------------
  // Make sure streaming exists
  // -----------------------------

  if (!res.body) {
    throw new Error(
      "No response body for SSE stream"
    );
  }

  const reader =
    res.body.getReader();

  const decoder = new TextDecoder();

  let buffer = "";

  // -----------------------------
  // Read SSE stream
  // -----------------------------

  while (true) {
    const { done, value } =
      await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    /*
     * SSE events are separated by
     *
     * \n\n
     *
     * Keep incomplete data in the buffer
     * until the next network chunk arrives.
     */
    const parts = buffer.split("\n\n");

    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (!part.trim()) {
        continue;
      }

      const lines = part.split("\n");

      let event = "message";
      const dataLines = [];

      for (const line of lines) {
        if (line.startsWith("event:")) {
          event = line
            .slice(6)
            .trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(
            line.slice(5).trimStart()
          );
        }
      }

      const data =
        dataLines.join("\n");

      if (!data) {
        continue;
      }

      try {
        // AI generated token
        if (event === "token") {
          handlers.onToken?.(
            JSON.parse(data)
          );
        }

        // Saved user message
        else if (
          event === "user_message"
        ) {
          handlers.onUserMessage?.(
            JSON.parse(data)
          );
        }

        // Completed assistant message
        else if (
          event === "assistant_message"
        ) {
          handlers.onAssistantMessage?.(
            JSON.parse(data)
          );
        }

        // Stream completed
        else if (event === "done") {
          handlers.onDone?.();
        }
      } catch (error) {
        handlers.onError?.(
          error instanceof Error
            ? error
            : new Error(
                "Failed to parse SSE event"
              )
        );
      }
    }
  }

  // Ensure completion is reported even if
  // the backend closes without a final done event.
  handlers.onDone?.();
}

export default streamChatMessage;