import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  Lock,
  MessageSquare,
  RotateCcw,
  Sparkles,
  LoaderCircle,
} from "lucide-react";

import IndexErrorAlert from "./IndexErrorAlert";
import LanguageBadge from "./LanguageBadge";
import IndexStatusBadge from "./RepoStatus";
import { LanguageIcon } from "../icons/LanguageIcon";
import { getRepoProgress, useStartIndexing } from "../../hooks/use-repos";

function RepoCard({ repo }) {
  const navigate = useNavigate();
  const indexMutation = useStartIndexing();

  const isIndexing =
    repo.indexStatus === "INDEXING" || indexMutation.isPending;

  const isFailed = repo.indexStatus === "FAILED";
  const progress = getRepoProgress(repo);

  function openChat() {
    navigate(`/chat/${repo.id}`);
  }

  function handlePrimary() {
    if (repo.indexStatus === "READY") {
      openChat();
      return;
    }

    indexMutation.mutate(repo.id, {
      onSuccess: () => {
        navigate(`/chat/${repo.id}`);
      },
    });
  }

  return (
    <article className={`repo-card ${isFailed ? "repo-card-failed" : ""}`}>
      {/* Card Header */}
      <div className="repo-card-header">
        <div className="repo-card-title-area">
          <LanguageBadge language={repo.language} showLabel={false} />

          <div className="repo-name-area">
            <p className="repo-owner">{repo.owner}</p>
            <h3 className="repo-name">{repo.name}</h3>
          </div>
        </div>

        <IndexStatusBadge status={repo.indexStatus} />
      </div>

      {/* Card Content */}
      <div className="repo-card-content">
        {!isFailed && (
          <p className="repo-description">
            {repo.description || "No description provided."}
          </p>
        )}

        {isFailed && repo.description && (
          <p className="repo-description repo-description-short">
            {repo.description}
          </p>
        )}

        {/* Repository Information */}
        <div className="repo-tags">
          {repo.isPrivate && (
            <span className="repo-tag">
              <Lock size={13} />
              Private
            </span>
          )}

          <span className="repo-tag">
            <GitBranch size={13} />
            {repo.defaultBranch}
          </span>

          {repo.language && (
            <span className="repo-tag">
              <LanguageIcon language={repo.language} size="sm" />
              {repo.language}
            </span>
          )}

          {repo.chunkCount > 0 && (
            <span className={`repo-tag ${isFailed ? "repo-tag-error" : ""}`}>
              {repo.chunkCount.toLocaleString()} chunks
              {isFailed ? " indexed" : ""}
            </span>
          )}
        </div>

        {/* Indexing Progress */}
        {isIndexing && (
          <div className="indexing-box">
            <div className="indexing-info">
              <span>Indexing...</span>

              <span>
                {repo.filesProcessed}/{repo.filesTotal || "?"}
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-bar"
                style={{ width: `${progress || 8}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {isFailed && repo.errorMessage && (
          <IndexErrorAlert message={repo.errorMessage} />
        )}
      </div>

      {/* Card Footer */}
      <div className="repo-card-footer">
        {repo.htmlUrl ? (
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="github-link"
          >
            <ExternalLink size={15} />
            GitHub
          </a>
        ) : (
          <span />
        )}

        <div className="repo-card-actions">
          {repo.indexStatus === "READY" && (
            <button
              type="button"
              className="chat-button"
              onClick={openChat}
            >
              <MessageSquare size={15} />
              Chat
            </button>
          )}

          <button
            type="button"
            className={`index-button ${
              isFailed ? "retry-button" : ""
            }`}
            disabled={isIndexing}
            onClick={handlePrimary}
          >
            {isIndexing ? (
              <>
                <LoaderCircle size={15} className="button-spinner" />
                Indexing
              </>
            ) : repo.indexStatus === "READY" ? (
              <>
                Open
                <ArrowRight size={15} />
              </>
            ) : isFailed ? (
              <>
                <RotateCcw size={15} />
                Retry
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Index
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default RepoCard;
export { RepoCard };