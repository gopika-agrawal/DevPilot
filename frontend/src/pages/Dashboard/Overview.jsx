import RequireAuth from "../../components/providers/RequireAuth";
import AppShell from "../../components/layout/AppShell";
import OverviewDashboard from "../../components/dashboard/OverviewDashboard";

function Overview() {
  return (
    <RequireAuth>
      <AppShell
        title="Overview"
        description="Workspace stats and recent repository activity"
      >
        <OverviewDashboard />
      </AppShell>
    </RequireAuth>
  );
}

export default Overview;
export { Overview };