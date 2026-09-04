import RequireAuth from "../../components/providers/RequireAuth";
import AppShell from "../../components/layout/AppShell";
import SettingsDashboard from "../../components/dashboard/SettingsDashboard";

function Settings() {
  return (
    <RequireAuth>
      <AppShell
        title="Settings"
        description="Profile, appearance, and account preferences"
      >
        <SettingsDashboard />
      </AppShell>
    </RequireAuth>
  );
}

export default Settings;
export { Settings };