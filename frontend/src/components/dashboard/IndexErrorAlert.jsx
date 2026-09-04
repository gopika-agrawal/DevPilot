import { useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

const SUMMARY_LIMIT = 100;

function getErrorSummary(message) {
  const line =
    message
      .split("\n")
      .find((part) => part.trim())
      ?.trim() || message;

  if (line.length <= SUMMARY_LIMIT) {
    return line;
  }

  return `${line.slice(0, SUMMARY_LIMIT - 1)}…`;
}

function IndexErrorAlert({ message }) {
  const [open, setOpen] = useState(false);

  const summary = getErrorSummary(message);
  const isExpandable = message.trim().length > summary.length;

  return (
    <div className="index-error-alert">
      <div className="index-error-header">
        <AlertCircle size={16} />

        <span className="index-error-title">
          Indexing failed
        </span>
      </div>

      {!isExpandable ? (
        <p className="index-error-message">
          {message}
        </p>
      ) : (
        <div className="index-error-details">
          {!open && (
            <p className="index-error-message">
              {summary}
            </p>
          )}

          <button
            type="button"
            className={`error-details-button ${
              open ? "error-details-open" : ""
            }`}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "Hide details" : "Show details"}

            <ChevronDown size={14} />
          </button>

          {open && (
            <div className="error-message-box">
              <p>{message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default IndexErrorAlert;
export { IndexErrorAlert };