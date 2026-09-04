import { code } from "@streamdown/code";
import { Streamdown } from "streamdown";

import "./chat-markdown.css";

const streamdownPlugins = {
  code,
};

function ChatMarkdown({
  content,
  isStreaming = false,
  className = "",
}) {
  return (
    <Streamdown
      className={`chat-markdown ${className}`}
      mode={isStreaming ? "streaming" : "static"}
      plugins={streamdownPlugins}
      shikiTheme={["github-light", "github-dark"]}
      isAnimating={isStreaming}
    >
      {content}
    </Streamdown>
  );
}

export default ChatMarkdown;
export { ChatMarkdown };