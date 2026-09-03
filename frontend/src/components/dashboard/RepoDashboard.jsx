import { useMemo, useState } from "react";
import { FolderGit2, LoaderCircle } from "lucide-react";

import DashboardHeader from "./DashboardHeader";
import RepoCard from "./RepoCard";

import { useRefreshRepos, useRepos } from "../../hooks/use-repos";

function RepoDashboard() {
  const reposQuery = useRepos();
  const refresh = useRefreshRepos();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [visibility, setVisibility] = useState("all");

  /*
   * Filter repositories based on:
   * - Search text
   * - Index status
   * - Public/private visibility
   */
  const filtered = useMemo(() => {
    const list = reposQuery.data || [];
    const query = search.trim().toLowerCase();

    return list.filter((repo) => {
      // Index status filter
      if (
        status !== "ALL" &&
        repo.indexStatus !== status
      ) {
        return false;
      }

      // Visibility filter
      if (
        visibility === "private" &&
        !repo.isPrivate
      ) {
        return false;
      }

      if (
        visibility === "public" &&
        repo.isPrivate
      ) {
        return false;
      }

      // Search filter
      if (!query) {
        return true;
      }

      return (
        repo.fullName
          .toLowerCase()
          .includes(query) ||

        (repo.description || "")
          .toLowerCase()
          .includes(query) ||

        (repo.language || "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [
    reposQuery.data,
    search,
    status,
    visibility,
  ]);

  /*
   * Number of repositories that have
   * completed indexing.
   */
  const readyCount =
    reposQuery.data?.filter(
      (repo) => repo.indexStatus === "READY"
    ).length || 0;

  return (
    <div className="repo-dashboard">

      {/* Dashboard controls */}
      <DashboardHeader
        search={search}
        onSearchChange={setSearch}

        visibility={visibility}
        onVisibilityChange={setVisibility}

        status={status}
        onStatusChange={setStatus}

        totalCount={reposQuery.data?.length || 0}
        readyCount={readyCount}

        onSync={() => refresh.mutate()}

        isSyncing={
          refresh.isPending ||
          reposQuery.isFetching
        }
      />

      <div className="repo-dashboard-content">

        {/* Loading */}
        {reposQuery.isLoading && (
          <div className="repo-grid">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="repo-skeleton"
                >
                  <div className="skeleton-line large" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line small" />

                  <div className="skeleton-bottom" />
                </div>
              )
            )}
          </div>
        )}

        {/* Error */}
        {reposQuery.isError && (
          <div className="dashboard-empty">
            <div className="empty-icon">
              <FolderGit2 size={22} />
            </div>

            <h2>
              Couldn't load repositories
            </h2>

            <p>
              {reposQuery.error?.message ||
                "Something went wrong while loading your repositories."}
            </p>

            <button
              className="retry-button"
              onClick={() => reposQuery.refetch()}
            >
              Try again
            </button>
          </div>
        )}

        {/* No matching repositories */}
        {reposQuery.isSuccess &&
          filtered.length === 0 && (
            <div className="dashboard-empty">
              <div className="empty-icon">
                <FolderGit2 size={22} />
              </div>

              <h2>
                No repositories match
              </h2>

              <p>
                Try clearing your filters or
                syncing your GitHub repositories again.
              </p>
            </div>
          )}

        {/* Repository list */}
        {reposQuery.isSuccess &&
          filtered.length > 0 && (
            <div className="repo-grid">
              {filtered.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

export default RepoDashboard;
export { RepoDashboard };