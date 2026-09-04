import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useCallback,
  useRef,
  useState,
} from "react";

import { api } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { streamChatMessage } from "../lib/stream-chat";
import { toast } from "../components/ui/toast";

export function useChatSessions(
  repositoryId,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.chat.sessions(repositoryId),
    queryFn: () =>
      api.listSessions(repositoryId),
    enabled:
      Boolean(repositoryId) && enabled,
  });
}

export function useChatMessages(sessionId) {
  return useQuery({
    queryKey: queryKeys.chat.messages(
      sessionId ?? ""
    ),
    queryFn: () =>
      api.getMessages(sessionId),
    enabled: Boolean(sessionId),
  });
}

export function useCreateChatSession(repositoryId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title) =>
      api.createSession(repositoryId, title),

    onSuccess: (session) => {
      void queryClient.invalidateQueries({
        queryKey:
          queryKeys.chat.sessions(repositoryId),
      });

      queryClient.setQueryData(
        queryKeys.chat.messages(session.id),
        []
      );
    },

    onError: (error) => {
      toast.add({
        title: "Could not create chat",
        description:
          error?.message ||
          "Could not create a new chat.",
        type: "error",
      });
    },
  });
}

export function useStreamChat(sessionId) {
  const queryClient = useQueryClient();

  const [streaming, setStreaming] =
    useState(false);

  const [streamText, setStreamText] =
    useState("");

  const abortRef = useRef(null);

  const send = useCallback(
    async (content) => {
      if (
        !sessionId ||
        !content.trim() ||
        streaming
      ) {
        return;
      }

      // Cancel any previous request.
      abortRef.current?.abort();

      const controller =
        new AbortController();

      abortRef.current = controller;

      // Immediately show the user's message
      // before the backend responds.
      const optimisticId =
        `temp-${Date.now()}`;

      const optimisticMessage = {
        id: optimisticId,
        role: "USER",
        content: content.trim(),
        citations: [],
        createdAt:
          new Date().toISOString(),
      };

      queryClient.setQueryData(
        queryKeys.chat.messages(sessionId),
        (previous) => [
          ...(previous ?? []),
          optimisticMessage,
        ]
      );

      setStreaming(true);
      setStreamText("");

      try {
        await streamChatMessage(
          sessionId,
          content.trim(),
          {
            signal: controller.signal,

            // Backend has saved the actual
            // user message.
            onUserMessage: (message) => {
              queryClient.setQueryData(
                queryKeys.chat.messages(
                  sessionId
                ),
                (previous) => [
                  ...(previous ?? []).filter(
                    (item) =>
                      item.id !== optimisticId
                  ),
                  message,
                ]
              );
            },

            // Add each streamed token to the
            // currently displayed response.
            onToken: (token) => {
              setStreamText(
                (previous) =>
                  previous + token
              );
            },

            // AI response is complete.
            onAssistantMessage: (message) => {
              queryClient.setQueryData(
                queryKeys.chat.messages(
                  sessionId
                ),
                (previous) => [
                  ...(previous ?? []),
                  message,
                ]
              );

              setStreamText("");
            },
          }
        );
      } catch (error) {
        // User intentionally stopped generation.
        if (
          error?.name === "AbortError"
        ) {
          return;
        }

        toast.add({
          title: "Message failed",
          description:
            error?.message ||
            "Could not generate a response.",
          type: "error",
        });

        // Remove the optimistic user message
        // if the request failed.
        queryClient.setQueryData(
          queryKeys.chat.messages(sessionId),
          (previous) =>
            (previous ?? []).filter(
              (item) =>
                item.id !== optimisticId
            )
        );

        setStreamText("");
      } finally {
        setStreaming(false);
      }
    },
    [sessionId, streaming, queryClient]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  return {
    send,
    stop,
    streaming,
    streamText,
  };
}