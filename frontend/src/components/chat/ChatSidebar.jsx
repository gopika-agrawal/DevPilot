import { formatDistanceToNow } from "date-fns";
import { Plus, RotateCcw, LoaderCircle } from "lucide-react";

import { IndexStatusBadge } from "../dashboard/RepoStatus";

import {
  useChatSessions,
  useCreateChatSession,
} from "../../hooks/use-chat";

import { useStartIndexing } from "../../hooks/use-repos";

function ChatSidebar({
  repo,
  sessionId,
  onSelectSession,
}) {
  const ready = repo.indexStatus === "READY";

  const sessionsQuery =
    useChatSessions(repo.id, ready);

  const createSession =
    useCreateChatSession(repo.id);

  const reindex = useStartIndexing();

  function handleNewChat() {
    createSession.mutate("New chat", {
      onSuccess: (session) => {
        onSelectSession(session.id);
      },
    });
  }

  function handleReindex() {
    reindex.mutate(repo.id);
  }

  return (
    <aside className="chat-sidebar">
      {/* Repository information */}
      <div className="chat-sidebar-header">
        <div className="chat-sidebar-repo">
          <p className="chat-sidebar-repo-name">
            {repo.fullName}
          </p>

          <div className="chat-sidebar-repo-meta">
            <IndexStatusBadge
              status={repo.indexStatus}
            />

            {repo.isPrivate && (
              <span className="chat-private-label">
                Private
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="chat-sidebar-actions">
          <button
            type="button"
            className="new-chat-button"
            disabled={
              !ready ||
              createSession.isPending
            }
            onClick={handleNewChat}
          >
            {createSession.isPending ? (
              <LoaderCircle
                size={15}
                className="chat-sidebar-spinner"
              />
            ) : (
              <Plus size={16} />
            )}

            New chat
          </button>

          <button
            type="button"
            className="reindex-button"
            disabled={
              reindex.isPending ||
              repo.indexStatus === "INDEXING"
            }
            onClick={handleReindex}
            aria-label="Re-index repository"
            title="Re-index repository"
          >
            <RotateCcw
              size={16}
              className={
                reindex.isPending
                  ? "chat-sidebar-spinner"
                  : ""
              }
            />
          </button>
        </div>
      </div>

      <div className="chat-sidebar-divider" />

      {/* Sessions heading */}
      <div className="chat-sessions-heading">
        Sessions
      </div>

      {/* Sessions */}
      <div className="chat-sessions-list">
        {!ready && (
          <p className="chat-sessions-info">
            Sessions unlock after indexing completes.
          </p>
        )}

        {sessionsQuery.isLoading &&
          Array.from({ length: 3 }).map(
            (_, index) => (
              <div
                key={index}
                className="chat-session-skeleton"
              >
                <div />
                <div />
              </div>
            )
          )}

        {sessionsQuery.data?.map((session) => {
          const selected =
            sessionId === session.id;

          return (
            <button
              key={session.id}
              type="button"
              onClick={() =>
                onSelectSession(session.id)
              }
              className={`chat-session-item ${
                selected
                  ? "chat-session-selected"
                  : ""
              }`}
            >
              <p className="chat-session-title">
                {session.title}
              </p>

              <p className="chat-session-time">
                {formatDistanceToNow(
                  new Date(session.createdAt),
                  {
                    addSuffix: true,
                  }
                )}
              </p>
            </button>
          );
        })}

        {ready &&
          sessionsQuery.isSuccess &&
          sessionsQuery.data.length === 0 && (
            <p className="chat-sessions-info">
              No chats yet. Start one to begin.
            </p>
          )}
      </div>
    </aside>
  );
}

export default ChatSidebar;
export { ChatSidebar };