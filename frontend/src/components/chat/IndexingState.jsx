import {
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";

import {
  getRepoProgress,
  useStartIndexing,
} from "../../hooks/use-repos";

function IndexingState({ repo, status }) {
  const indexMutation = useStartIndexing();

  const filesProcessed =
    status?.filesProcessed ??
    repo.filesProcessed ??
    0;

  const filesTotal =
    status?.filesTotal ??
    repo.filesTotal ??
    0;

  const chunkCount =
    status?.chunkCount ??
    repo.chunkCount ??
    0;

  const progress = getRepoProgress({
    filesProcessed,
    filesTotal,
  });

  const indexStatus =
    status?.indexStatus ??
    repo.indexStatus;

  const errorMessage =
    status?.errorMessage ??
    repo.errorMessage;

  // -----------------------------
  // Failed state
  // -----------------------------

  if (indexStatus === "FAILED") {
    return (
      <div className="indexing-state">
        <div className="indexing-content">
          <div className="indexing-icon indexing-icon-error">
            <AlertCircle size={22} />
          </div>

          <h2>Indexing failed</h2>

          <p>
            {errorMessage ||
              "Something went wrong while indexing this repository."}
          </p>

          <button
            type="button"
            className="retry-index-button"
            onClick={() =>
              indexMutation.mutate(repo.id)
            }
            disabled={indexMutation.isPending}
          >
            {indexMutation.isPending ? (
              <Loader2
                size={16}
                className="indexing-spinner"
              />
            ) : (
              <RotateCcw size={16} />
            )}

            {indexMutation.isPending
              ? "Retrying..."
              : "Retry indexing"}
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Indexing state
  // -----------------------------

  const visibleProgress = filesTotal
    ? progress
    : 12;

  return (
    <div className="indexing-state">
      <div className="indexing-content">
        <div className="indexing-icon indexing-icon-loading">
          <Loader2
            size={22}
            className="indexing-spinner"
          />
        </div>

        <h2>
          Indexing {repo.fullName}
        </h2>

        <p>
          {filesTotal > 0
            ? `${filesProcessed} of ${filesTotal} files · ${chunkCount} chunks embedded`
            : "Fetching repository files and preparing embeddings…"}
        </p>

        <div className="indexing-progress-container">
          <div className="indexing-progress-track">
            <div
              className="indexing-progress-bar"
              style={{
                width: `${visibleProgress}%`,
              }}
            />
          </div>

          <span className="indexing-progress-value">
            {visibleProgress}%
          </span>
        </div>

        <p className="indexing-hint">
          You can leave this page open — chat unlocks
          when indexing finishes.
        </p>
      </div>
    </div>
  );
}

export default IndexingState;
export { IndexingState };