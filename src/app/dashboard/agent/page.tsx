import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AgentDashboardLive } from "@/components/dashboard/live/AgentDashboardViews";

export default function AgentDashboardPage() {
  return (
    <DashboardLayout role="agent">
      <DashboardPageHeader
        badge="Agent Dashboard"
        title="Manage listings, leads, and client viewings."
        description="Track property performance, respond to inquiries, schedule viewings, and monitor your real estate sales pipeline."
      />

      <AgentDashboardLive />
    </DashboardLayout>
  );
}
