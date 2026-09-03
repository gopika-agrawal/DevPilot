import { RefreshCw, Search } from "lucide-react";

import ModeToggle from "../ui/ModeToggle";

const visibilityFilters = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const statusFilters = [
  { value: "ALL", label: "All" },
  { value: "READY", label: "Ready" },
  { value: "INDEXING", label: "Indexing" },
  { value: "PENDING", label: "New" },
  { value: "FAILED", label: "Failed" },
];

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`filter-pill ${active ? "active" : ""}`}
    >
      {children}
    </button>
  );
}

function DashboardHeader({
  search,
  onSearchChange,
  visibility,
  onVisibilityChange,
  status,
  onStatusChange,
  totalCount,
  readyCount,
  onSync,
  isSyncing,
}) {
  return (
    <div className="dashboard-header">

      {/* Top section */}
      <div className="dashboard-header-top">

        <div className="dashboard-title">
          <div>
            <h1>Repositories</h1>

            <p>
              {totalCount !== undefined
                ? `${totalCount} connected · ${
                    readyCount ?? 0
                  } ready`
                : "Sync and index a repo to start chatting"}
            </p>
          </div>
        </div>

        {/* Search + actions */}
        <div className="dashboard-actions">

          <div className="repo-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search repositories..."
            />
          </div>

          <button
            type="button"
            className="sync-button"
            onClick={onSync}
            disabled={isSyncing}
          >
            <RefreshCw
              size={16}
              className={
                isSyncing
                  ? "sync-spinner"
                  : ""
              }
            />

            <span>
              {isSyncing ? "Syncing..." : "Sync"}
            </span>
          </button>

          <ModeToggle />
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters">

        {/* Visibility */}
        <div className="filter-section">
          <span className="filter-label">
            Visibility
          </span>

          {visibilityFilters.map((filter) => (
            <FilterPill
              key={filter.value}
              active={
                visibility === filter.value
              }
              onClick={() =>
                onVisibilityChange(
                  filter.value
                )
              }
            >
              {filter.label}
            </FilterPill>
          ))}
        </div>

        {/* Status */}
        <div className="filter-section">
          <span className="filter-label">
            Status
          </span>

          {statusFilters.map((filter) => (
            <FilterPill
              key={filter.value}
              active={
                status === filter.value
              }
              onClick={() =>
                onStatusChange(
                  filter.value
                )
              }
            >
              {filter.label}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
export { DashboardHeader };