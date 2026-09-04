import { useState } from "react";
import { SendHorizontal, Square, LoaderCircle } from "lucide-react";

function ChatComposer({
  disabled = false,
  streaming = false,
  onSend,
  onStop,
}) {
  const [value, setValue] = useState("");

  async function submit() {
    const content = value.trim();

    if (!content || disabled || streaming) {
      return;
    }

    setValue("");
    await onSend(content);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  return (
    <div className="chat-composer-wrapper">
      <div className="chat-composer-container">
        <div className="chat-input-box">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about architecture, files, flows..."
            disabled={disabled}
            className="chat-textarea"
            rows={2}
          />

          {streaming ? (
            <button
              type="button"
              className="chat-send-button stop-button"
              onClick={onStop}
              aria-label="Stop generating"
              title="Stop generating"
            >
              <Square size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="chat-send-button"
              disabled={disabled || !value.trim()}
              onClick={() => void submit()}
              aria-label="Send message"
              title="Send message"
            >
              {disabled ? (
                <LoaderCircle
                  size={18}
                  className="chat-button-spinner"
                />
              ) : (
                <SendHorizontal size={18} />
              )}
            </button>
          )}
        </div>

        <p className="chat-input-hint">
          Press <span className="chat-kbd">Enter</span> to send
          <span className="hint-separator">·</span>
          <span className="chat-kbd">Shift</span> +{" "}
          <span className="chat-kbd">Enter</span> for a new line
        </p>
      </div>
    </div>
  );
}

export default ChatComposer;
export { ChatComposer };