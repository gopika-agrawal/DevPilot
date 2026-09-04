import {
  LogOut,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";

import { GitHubIcon } from "../icons/GitHubIcon";
import ModeToggle from "../ui/ModeToggle";
import { useCurrentUser, useLogout } from "../../hooks/use-auth";

function SettingsCard({ title, description, children }) {
  return (
    <section className="settings-card">
      <div className="settings-card-header">
        <h2>{title}</h2>

        <p>{description}</p>
      </div>

      <div className="settings-card-content">
        {children}
      </div>
    </section>
  );
}

function UserAvatar({ user }) {
  const initials = (user?.displayName || "DP")
    .slice(0, 2)
    .toUpperCase();

  return user?.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt={user.displayName || "User"}
      className="settings-avatar"
    />
  ) : (
    <div className="settings-avatar settings-avatar-fallback">
      {initials}
    </div>
  );
}

function SettingsDashboard() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <div className="settings-dashboard">

      {/* =========================
          Profile
      ========================= */}

      <SettingsCard
        title="Profile"
        description="Your GitHub account connected to DevPilot."
      >
        <div className="settings-profile">
          <UserAvatar user={user} />

          <div className="settings-profile-info">
            <p className="settings-display-name">
              {user?.displayName || "—"}
            </p>

            <p className="settings-username">
              @{user?.githubUsername || "—"}
            </p>
          </div>
        </div>

        <div className="settings-divider" />

        <div className="settings-info-list">
          <div className="settings-info-row">
            <span>Display name</span>
            <strong>
              {user?.displayName || "—"}
            </strong>
          </div>

          <div className="settings-info-row">
            <span>GitHub username</span>
            <strong>
              @{user?.githubUsername || "—"}
            </strong>
          </div>

          <div className="settings-info-row">
            <span>Authentication</span>

            <strong className="github-auth">
              <GitHubIcon width={16} height={16} />
              GitHub OAuth
            </strong>
          </div>
        </div>
      </SettingsCard>

      {/* =========================
          Appearance
      ========================= */}

      <SettingsCard
        title="Appearance"
        description="Customize how DevPilot looks on your device."
      >
        <div className="appearance-option">
          <div>
            <h3>Theme</h3>

            <p>
              Switch between light and dark themes.
            </p>
          </div>

          <ModeToggle />
        </div>

        <div className="settings-divider" />

        <div className="appearance-option">
          <div>
            <h3>Current appearance</h3>

            <p>
              Use the theme button to change the interface.
            </p>
          </div>

          <div className="appearance-icons">
            <Sun size={17} />
            <Moon size={17} />
          </div>
        </div>
      </SettingsCard>

      {/* =========================
          Account Actions
      ========================= */}

      <SettingsCard
        title="Account actions"
        description="Manage your session and connected workspace."
      >
        <div className="settings-actions">

          <button
            type="button"
            className="settings-github-button"
            disabled
          >
            <UserRound size={16} />
            Manage on GitHub
          </button>

          <button
            type="button"
            className="settings-logout-button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut size={16} />

            {logout.isPending
              ? "Logging out..."
              : "Log out"}
          </button>

        </div>
      </SettingsCard>

    </div>
  );
}

export default SettingsDashboard;
export { SettingsDashboard };