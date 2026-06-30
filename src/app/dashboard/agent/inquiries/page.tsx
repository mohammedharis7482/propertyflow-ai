import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AgentInquiriesLive } from "@/components/dashboard/live/AgentDashboardViews";

export default function AgentInquiriesPage() {
  return (
    <DashboardLayout role="agent">
      <DashboardPageHeader
        badge="Agent CRM"
        title="Manage buyer and tenant lead pipeline."
        description="Track inquiry priority, response status, and follow-up actions from one premium CRM workspace."
      />

      <AgentInquiriesLive />
    </DashboardLayout>
  );
}
