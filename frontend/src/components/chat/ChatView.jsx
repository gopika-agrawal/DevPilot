import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import ChatComposer from "./ChatComposer";
import ChatMessages from "./ChatMessages";
import ChatSidebar from "./ChatSidebar";
import IndexingState from "./IndexingState";
import AppShell from "../layout/AppShell";

import {
  useChatMessages,
  useChatSessions,
  useCreateChatSession,
  useStreamChat,
} from "../../hooks/use-chat";

import { useIndexStatus, useRepository } from "../../hooks/use-repos";

function ChatView({ repoId }) {
  const repoQuery = useRepository(repoId);

  const isIndexing =
    repoQuery.data?.indexStatus === "INDEXING";

  const statusQuery = useIndexStatus(
    repoId,
    isIndexing ||
      repoQuery.data?.indexStatus === "PENDING"
  );

  const indexStatus =
    statusQuery.data?.indexStatus ??
    repoQuery.data?.indexStatus;

  const ready = indexStatus === "READY";

  const sessionsQuery = useChatSessions(
    repoId,
    ready
  );

  const createSession =
    useCreateChatSession(repoId);

  const [selectedSessionId, setSelectedSessionId] =
    useState(null);

  const autoCreateRef = useRef(false);

  const sessionId =
    selectedSessionId ??
    sessionsQuery.data?.[0]?.id ??
    null;

  const messagesQuery =
    useChatMessages(sessionId);

  const {
    send,
    stop,
    streaming,
    streamText,
  } = useStreamChat(sessionId);

  // Automatically create the first chat session
  // when the repository is ready.
  useEffect(() => {
    if (!ready || sessionsQuery.isLoading) {
      return;
    }

    if (
      sessionsQuery.data &&
      sessionsQuery.data.length > 0
    ) {
      return;
    }

    if (
      !sessionsQuery.isSuccess ||
      (sessionsQuery.data?.length ?? 0) > 0 ||
      autoCreateRef.current
    ) {
      return;
    }

    autoCreateRef.current = true;

    createSession.mutate(undefined, {
      onSuccess: (session) => {
        setSelectedSessionId(session.id);
      },

      onError: () => {
        autoCreateRef.current = false;
      },
    });
  }, [
    ready,
    sessionsQuery.isLoading,
    sessionsQuery.isSuccess,
    sessionsQuery.data,
    createSession,
  ]);

  // -----------------------------
  // Loading state
  // -----------------------------

  if (repoQuery.isLoading) {
    return (
      <AppShell title="Loading chat…">
        <div className="chat-loading">
          <div className="chat-loading-panel" />
          <div className="chat-loading-panel" />
        </div>
      </AppShell>
    );
  }

  // -----------------------------
  // Error state
  // -----------------------------

  if (
    repoQuery.isError ||
    !repoQuery.data
  ) {
    return (
      <AppShell title="Repository unavailable">
        <div className="chat-error">
          <p>
            {repoQuery.error?.message ??
              "Repository not found"}
          </p>

          <Link
            to="/dashboard"
            className="chat-back-button"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const repo = repoQuery.data;

  // Combine the repository information with
  // the latest indexing status.
  const chatRepo = {
    ...repo,

    indexStatus:
      indexStatus ?? repo.indexStatus,

    filesProcessed:
      statusQuery.data?.filesProcessed ??
      repo.filesProcessed,

    filesTotal:
      statusQuery.data?.filesTotal ??
      repo.filesTotal,

    chunkCount:
      statusQuery.data?.chunkCount ??
      repo.chunkCount,

    errorMessage:
      statusQuery.data?.errorMessage ??
      repo.errorMessage,
  };

  return (
    <AppShell
      title={repo.fullName}
      description={
        ready
          ? "Ask questions grounded in this repository"
          : "Waiting for indexing to finish"
      }
      actions={
        <Link
          to="/dashboard"
          className="chat-repos-button"
        >
          <ArrowLeft size={16} />
          Repos
        </Link>
      }
    >
      <div className="chat-layout">
        <ChatSidebar
          repo={chatRepo}
          sessionId={sessionId}
          onSelectSession={setSelectedSessionId}
        />

        <section className="chat-main">
          {!ready ? (
            <IndexingState
              repo={repo}
              status={statusQuery.data}
            />
          ) : (
            <>
              <ChatMessages
                repo={repo}
                messages={
                  messagesQuery.data ?? []
                }
                streamText={streamText}
                isLoading={
                  messagesQuery.isLoading
                }
              />

              <ChatComposer
                disabled={!sessionId}
                streaming={streaming}
                onSend={send}
                onStop={stop}
              />
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default ChatView;
export { ChatView };