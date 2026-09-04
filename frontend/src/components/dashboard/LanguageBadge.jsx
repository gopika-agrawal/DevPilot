import {
  LanguageIcon,
  getLanguageLabel,
} from "../icons/LanguageIcon";

function LanguageBadge({
  language,
  className = "",
  showLabel = true,
  iconSize = "md",
}) {
  return (
    <div className={`language-badge ${className}`}>
      <LanguageIcon language={language} size={iconSize} />

      {showLabel && (
        <span className="language-badge-label">
          {getLanguageLabel(language)}
        </span>
      )}
    </div>
  );
}

export default LanguageBadge;
export { LanguageBadge };