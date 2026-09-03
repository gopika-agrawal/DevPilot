import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Code2,
} from "lucide-react";

import { DevPilotIcon } from "../icons/DevPilotIcon";

import {
  dashboardNavGroups,
  isDashboardNavActive,
} from "../../lib/dashboard-nav";

import ModeToggle from "../ui/ModeToggle";

function AppShell({
  children,
  title,
  description,
  actions,
  hideHeader = false,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Temporary user data.
  // We will connect this to the backend/auth system later.
  const user = {
    displayName: "Developer",
    githubUsername: "github-user",
    avatarUrl: "",
  };

  const navigation = [
    {
      label: "Workspace",
      items: [
        {
          title: "Repositories",
          href: "/dashboard",
          icon: Code2,
        },
      ],
    },
    {
      label: "Account",
      items: [
        {
          title: "Settings",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    // We will connect this to useLogout later.
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* Logo */}
        <div className="sidebar-top">
          <Link to="/dashboard" className="sidebar-brand">
            <DevPilotIcon className="sidebar-logo" />

            {!collapsed && (
              <div className="sidebar-brand-text">
                <strong>DevPilot</strong>
                <span>Chat with your code</span>
              </div>
            )}
          </Link>

          <button
            className="sidebar-collapse"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <ChevronLeft size={17} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-navigation">
  {dashboardNavGroups.map((group) => (
    <div className="sidebar-group" key={group.label}>
      {!collapsed && (
        <div className="sidebar-group-title">
          {group.label}
        </div>
      )}

      <div className="sidebar-items">
        {group.items.map((item) => {
          const Icon = item.icon;

          const active = isDashboardNavActive(
            location.pathname,
            item.href,
            item.exact
          );

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`sidebar-item ${
                active ? "active" : ""
              }`}
              title={collapsed ? item.title : ""}
            >
              <Icon size={18} />

              {!collapsed && (
                <span>{item.title}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  ))}
</nav>

        {/* User section */}
        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                />
              ) : (
                user.displayName.slice(0, 2).toUpperCase()
              )}
            </div>

            {!collapsed && (
              <div className="user-info">
                <strong>{user.displayName}</strong>
                <span>@{user.githubUsername}</span>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="user-actions">
              <button
                onClick={() => navigate("/dashboard/settings")}
                className="user-action"
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="user-action logout"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="app-main">
        {!hideHeader && (
          <header className="app-header">
            <div className="header-content">
              <div>
                {title && (
                  <h1>{title}</h1>
                )}

                {description && (
                  <p>{description}</p>
                )}
              </div>

              <div className="header-actions">
                {actions}

                <div className="header-actions">
  {actions}
  <ModeToggle />
</div>
              </div>
            </div>
          </header>
        )}

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;


/*
 * Simple reusable brand component.
 */
export function BrandMark() {
  return (
    <Link to="/dashboard" className="brand-mark">
      <div className="brand-mark-icon">
        DP
      </div>

      <span>DevPilot</span>
    </Link>
  );
}


/*
 * Simple ghost-style link button.
 */
export function GhostButtonLink({
  href,
  children,
  className = "",
}) {
  return (
    <Link
      to={href}
      className={`ghost-button ${className}`}
    >
      {children}
    </Link>
  );
}