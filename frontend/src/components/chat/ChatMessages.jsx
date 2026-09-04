import { Bot, UserRound } from "lucide-react";
import { useEffect, useRef } from "react";

import ChatMarkdown from "./ChatMarkdown";
import CitationChips from "./CitationChips";

function ChatMessages({
  repo,
  messages = [],
  streamText = "",
  isLoading = false,
}) {
  const bottomRef = useRef(null);

  // Keep the latest message visible while chatting
  // or while the AI is streaming its response.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, streamText]);

  // -----------------------------
  // Loading state
  // -----------------------------

  if (isLoading) {
    return (
      <div className="chat-messages-loading">
        <div className="message-skeleton message-skeleton-large" />
        <div className="message-skeleton message-skeleton-user" />
        <div className="message-skeleton message-skeleton-medium" />
      </div>
    );
  }

  return (
    <div className="chat-messages-scroll">
      <div className="chat-messages-container">
        {/* Empty conversation */}
        {messages.length === 0 && !streamText && (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">
              <Bot size={21} />
            </div>

            <p className="chat-empty-title">
              Ask anything about this codebase
            </p>

            <p className="chat-empty-description">
              Try "Where is authentication handled?"
              or "Explain the repository indexing flow."
            </p>
          </div>
        )}

        {/* Existing messages */}
        <div className="chat-message-list">
          {messages.map((message) => {
            const isUser = message.role === "USER";

            return (
              <div
                key={message.id}
                className={`chat-message-row ${
                  isUser
                    ? "chat-message-user"
                    : "chat-message-assistant"
                }`}
              >
                <div
                  className={`chat-message-avatar ${
                    isUser
                      ? "chat-avatar-user"
                      : "chat-avatar-bot"
                  }`}
                >
                  {isUser ? (
                    <UserRound size={15} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <div className="chat-message-body">
                  <div
                    className={`chat-message-bubble ${
                      isUser
                        ? "chat-bubble-user"
                        : "chat-bubble-assistant"
                    }`}
                  >
                    {isUser ? (
                      <span className="chat-user-message">
                        {message.content}
                      </span>
                    ) : (
                      <ChatMarkdown
                        content={message.content}
                      />
                    )}
                  </div>

                  {/* Citations attached to AI responses */}
                  {!isUser &&
                    message.citations?.length > 0 && (
                      <div className="chat-message-citations">
                        <CitationChips
                          repo={repo}
                          citations={message.citations}
                        />
                      </div>
                    )}
                </div>
              </div>
            );
          })}

          {/* Streaming AI response */}
          {streamText && (
            <div className="chat-message-row chat-message-assistant">
              <div className="chat-message-avatar chat-avatar-bot">
                <Bot size={16} />
              </div>

              <div className="chat-message-body">
                <div className="chat-message-bubble chat-bubble-assistant chat-streaming-bubble">
                  <ChatMarkdown
                    content={streamText}
                    isStreaming
                  />

                  <span className="chat-streaming-cursor" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default ChatMessages;
export { ChatMessages };