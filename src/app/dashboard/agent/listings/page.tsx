import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AgentListingsLive } from "@/components/dashboard/live/AgentDashboardViews";

export default function AgentListingsPage() {
  return (
    <DashboardLayout role="agent">
      <DashboardPageHeader
        badge="Listings"
        title="Manage your property portfolio."
        description="Review your backend dashboard top properties while the dedicated agent listing endpoint is prepared."
      />

      <AgentListingsLive />
    </DashboardLayout>
  );
}
