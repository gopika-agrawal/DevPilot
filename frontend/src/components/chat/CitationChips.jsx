import { ExternalLink } from "lucide-react";

export function citationHref(repo, citation) {
  const line =
    citation.startLine != null
      ? `#L${citation.startLine}${
          citation.endLine &&
          citation.endLine !== citation.startLine
            ? `-L${citation.endLine}`
            : ""
        }`
      : "";

  return `https://github.com/${repo.fullName}/blob/${repo.defaultBranch}/${citation.filePath}${line}`;
}

function CitationChips({ repo, citations = [] }) {
  if (!citations.length) {
    return null;
  }

  return (
    <div className="citation-chips">
      {citations.map((citation, index) => (
        <a
          key={`${citation.filePath}-${index}`}
          href={citationHref(repo, citation)}
          target="_blank"
          rel="noreferrer"
          className="citation-chip"
          title={`Open ${citation.filePath} on GitHub`}
        >
          <span className="citation-file">
            {citation.filePath}
            {citation.startLine != null
              ? `:${citation.startLine}`
              : ""}
          </span>

          <ExternalLink
            size={12}
            className="citation-external-icon"
          />
        </a>
      ))}
    </div>
  );
}

export default CitationChips;