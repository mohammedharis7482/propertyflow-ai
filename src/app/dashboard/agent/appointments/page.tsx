import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AgentAppointmentsLive } from "@/components/dashboard/live/AgentDashboardViews";

export default function AgentAppointmentsPage() {
  return (
    <DashboardLayout role="agent">
      <DashboardPageHeader
        badge="Agent Calendar"
        title="Coordinate property viewings."
        description="Review appointment requests, upcoming tours, and viewing preparation from your live backend workflow."
      />

      <AgentAppointmentsLive />
    </DashboardLayout>
  );
}
