import RequireAuth from "../../components/providers/RequireAuth";
import AppShell from "../../components/layout/AppShell";
import RepoDashboard from "../../components/dashboard/RepoDashboard";

function Dashboard() {
  return (
    <RequireAuth>
      <AppShell hideHeader>
        <RepoDashboard />
      </AppShell>
    </RequireAuth>
  );
}

export default Dashboard;