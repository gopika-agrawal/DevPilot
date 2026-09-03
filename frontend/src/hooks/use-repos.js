import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { api } from "../lib/api";
import { queryKeys } from "../lib/query-keys";
import { toast } from "../components/ui/toast";

const INDEXING_POLL_MS = 2000;


/*
 * Check whether at least one repository
 * is currently being indexed.
 */
function hasIndexingRepos(repos) {
  return (
    repos?.some(
      (repo) => repo.indexStatus === "INDEXING"
    ) ?? false
  );
}


/*
 * Update one repository inside the
 * cached repository list.
 */
function updateRepoInListCache(queryClient, repo) {
  queryClient.setQueryData(
    queryKeys.repos.list(),
    (current) => {
      if (!current) {
        return current;
      }

      return current.map((item) =>
        item.id === repo.id
          ? repo
          : item
      );
    }
  );
}


/*
 * Get all repositories.
 */
export function useRepos() {
  return useQuery({
    queryKey: queryKeys.repos.list(),

    queryFn: async () => {
      // First try the cached/backend data
      const repos = await api.listRepos(false);

      // If there are no repositories,
      // force a fresh GitHub sync.
      if (repos.length === 0) {
        return api.listRepos(true);
      }

      return repos;
    },

    staleTime: 30_000,

    /*
     * While a repository is being indexed,
     * periodically check for status changes.
     */
    refetchInterval: (query) =>
      hasIndexingRepos(query.state.data)
        ? INDEXING_POLL_MS
        : false,
  });
}


/*
 * Get details of one repository.
 */
export function useRepository(repoId) {
  return useQuery({
    queryKey: queryKeys.repos.detail(repoId),

    queryFn: () => api.getRepo(repoId),

    enabled: Boolean(repoId),

    /*
     * Keep checking while this repository
     * is being indexed.
     */
    refetchInterval: (query) =>
      query.state.data?.indexStatus === "INDEXING"
        ? INDEXING_POLL_MS
        : false,
  });
}


/*
 * Get the indexing status of a repository.
 */
export function useIndexStatus(
  repoId,
  enabled = false
) {
  return useQuery({
    queryKey: queryKeys.repos.status(repoId),

    queryFn: () => api.indexStatus(repoId),

    enabled:
      Boolean(repoId) && enabled,

    refetchInterval: (query) =>
      query.state.data?.indexStatus === "INDEXING"
        ? 1500
        : false,
  });
}


/*
 * Start repository indexing.
 */
export function useStartIndexing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repoId) =>
      api.startIndex(repoId),

    onSuccess: (repo) => {
      // Update repository detail cache
      queryClient.setQueryData(
        queryKeys.repos.detail(repo.id),
        repo
      );

      // Update repository list cache
      updateRepoInListCache(
        queryClient,
        repo
      );

      // Refresh indexing status
      queryClient.invalidateQueries({
        queryKey: queryKeys.repos.status(
          repo.id
        ),
      });

      toast.add({
        title: "Indexing started",

        description:
          `Indexing ${repo.fullName}...`,

        type: "loading",
      });
    },

    onError: (error) => {
      toast.add({
        title: "Could not start indexing",

        description:
          error?.message ||
          "Something went wrong.",

        type: "error",
      });
    },
  });
}


/*
 * Sync repositories from GitHub.
 */
export function useRefreshRepos() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      toast.promise(
        api.listRepos(true),
        {
          loading: {
            title: "Syncing repositories",

            description:
              "Fetching the latest repos from GitHub...",

            type: "loading",
          },

          success: (repos) => ({
            title: "Sync successful",

            description:
              `${repos.length} repositories loaded`,

            type: "success",
          }),

          error: (error) => ({
            title: "Sync failed",

            description:
              error instanceof Error
                ? error.message
                : "Could not sync repositories",

            type: "error",
          }),
        }
      ),

    onSuccess: (repos) => {
      queryClient.setQueryData(
        queryKeys.repos.list(),
        repos
      );
    },
  });
}


/*
 * Calculate indexing progress percentage.
 */
export function getRepoProgress(repo) {
  if (!repo.filesTotal) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (repo.filesProcessed /
        repo.filesTotal) *
        100
    )
  );
}