function indexStatusLabel(status) {
  switch (status) {
    case "READY":
      return "Ready";

    case "INDEXING":
      return "Indexing";

    case "FAILED":
      return "Failed";

    default:
      return "Not indexed";
  }
}

function IndexStatusBadge({ status, className = "" }) {
  const statusClass = {
    READY: "status-ready",
    INDEXING: "status-indexing",
    FAILED: "status-failed",
  }[status] || "status-not-indexed";

  return (
    <span className={`index-status-badge ${statusClass} ${className}`}>
      {status === "INDEXING" && (
        <span className="status-dot" />
      )}

      {indexStatusLabel(status)}
    </span>
  );
}

function languageColor(language) {
  const map = {
    TypeScript: "#0ea5e9",
    JavaScript: "#fbbf24",
    Java: "#f97316",
    Python: "#10b981",
    Go: "#06b6d4",
    Rust: "#c2410c",
    Kotlin: "#8b5cf6",
  };

  return map[language || ""] || "#64748b";
}

function RepoMeta({ repo }) {
  return (
    <div className="repo-meta">
      {repo.language && (
        <span className="repo-meta-item">
          <span
            className="language-dot"
            style={{
              backgroundColor: languageColor(repo.language),
            }}
          />

          {repo.language}
        </span>
      )}

      <span className="repo-meta-item">
        {repo.defaultBranch}
      </span>

      {repo.chunkCount > 0 && (
        <span className="repo-meta-item">
          {repo.chunkCount.toLocaleString()} chunks
        </span>
      )}
    </div>
  );
}

export default IndexStatusBadge;

export {
  IndexStatusBadge,
  indexStatusLabel,
  languageColor,
  RepoMeta,
};