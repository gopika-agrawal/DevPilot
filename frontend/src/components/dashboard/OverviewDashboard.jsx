import { Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  FolderGit2,
  LoaderCircle,
  MessageSquareCode,
} from "lucide-react";

import RepoCard from "./RepoCard";
import { useRepos } from "../../hooks/use-repos";

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="overview-stat-card">
      <div className="overview-stat-top">
        <div>
          <p className="overview-stat-label">{label}</p>
          <h3 className="overview-stat-value">{value}</h3>
        </div>

        <div className="overview-stat-icon">
          <Icon size={18} />
        </div>
      </div>

      {hint && (
        <p className="overview-stat-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

function LoadingSkeleton({ className = "" }) {
  return (
    <div className={`overview-skeleton ${className}`} />
  );
}

function StatusRow({ label, value, error = false }) {
  return (
    <div className="workspace-status-row">
      <span>{label}</span>

      <span
        className={`workspace-status-value ${
          error ? "workspace-status-error" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function OverviewDashboard() {
  const reposQuery = useRepos();
  const repos = reposQuery.data ?? [];

  const readyCount = repos.filter(
    (repo) => repo.indexStatus === "READY"
  ).length;

  const indexingCount = repos.filter(
    (repo) => repo.indexStatus === "INDEXING"
  ).length;

  const failedCount = repos.filter(
    (repo) => repo.indexStatus === "FAILED"
  ).length;

  const pendingCount = repos.filter(
    (repo) => repo.indexStatus === "PENDING"
  ).length;

  const totalChunks = repos.reduce(
    (sum, repo) => sum + repo.chunkCount,
    0
  );

  const recentRepos = [...repos]
    .sort((a, b) => {
      const aTime = a.indexedAt
        ? new Date(a.indexedAt).getTime()
        : 0;

      const bTime = b.indexedAt
        ? new Date(b.indexedAt).getTime()
        : 0;

      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div className="overview-dashboard">

      {/* =========================
          Statistics
      ========================= */}

      <div className="overview-stats-grid">
        {reposQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <LoadingSkeleton
              key={index}
              className="stat-skeleton"
            />
          ))
        ) : (
          <>
            <StatCard
              label="Repositories"
              value={repos.length}
              hint="Connected from GitHub"
              icon={FolderGit2}
            />

            <StatCard
              label="Ready to chat"
              value={readyCount}
              hint={`${indexingCount} currently indexing`}
              icon={CheckCircle2}
            />

            <StatCard
              label="Indexed chunks"
              value={totalChunks.toLocaleString()}
              hint="Searchable code segments"
              icon={MessageSquareCode}
            />

            <StatCard
              label="Needs attention"
              value={failedCount}
              hint={
                failedCount > 0
                  ? "Review failed indexing jobs"
                  : "All repos healthy"
              }
              icon={
                failedCount > 0
                  ? AlertCircle
                  : LoaderCircle
              }
            />
          </>
        )}
      </div>

      {/* =========================
          Main Content
      ========================= */}

      <div className="overview-main-grid">

        {/* Recent repositories */}

        <section className="overview-section">
          <div className="overview-section-header">
            <div>
              <h2>Recent repositories</h2>

              <p>
                Jump back into a repo you have indexed recently.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="overview-view-all"
            >
              View all
            </Link>
          </div>

          {reposQuery.isLoading ? (
            <div className="recent-repos-grid">
              {Array.from({ length: 2 }).map((_, index) => (
                <LoadingSkeleton
                  key={index}
                  className="repo-skeleton"
                />
              ))}
            </div>
          ) : recentRepos.length > 0 ? (
            <div className="recent-repos-grid">
              {recentRepos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                />
              ))}
            </div>
          ) : (
            <div className="overview-empty-card">
              <div>
                <h3>No repositories yet</h3>

                <p>
                  Sync your GitHub repositories to start
                  indexing and chatting with your code.
                </p>
              </div>

              <Link
                to="/dashboard"
                className="overview-empty-link"
              >
                Go to repositories
              </Link>
            </div>
          )}
        </section>

        {/* Workspace status */}

        <section className="overview-section workspace-section">
          <div className="overview-section-header">
            <div>
              <h2>Workspace status</h2>

              <p>
                A quick snapshot of indexing across your
                connected repos.
              </p>
            </div>
          </div>

          <div className="workspace-status-card">
            {reposQuery.isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton
                  key={index}
                  className="status-skeleton"
                />
              ))
            ) : (
              <>
                <StatusRow
                  label="Ready"
                  value={readyCount}
                />

                <StatusRow
                  label="Indexing"
                  value={indexingCount}
                />

                <StatusRow
                  label="Pending"
                  value={pendingCount}
                />

                <StatusRow
                  label="Failed"
                  value={failedCount}
                  error={failedCount > 0}
                />
              </>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default OverviewDashboard;
export { OverviewDashboard };