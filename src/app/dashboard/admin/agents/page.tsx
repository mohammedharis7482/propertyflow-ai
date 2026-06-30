import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminAgentsLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminAgentsPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Agent Management"
        title="Review agent verification and quality."
        description="Manage agent verification, feature status, agencies, and profile readiness from backend data."
      />

      <AdminAgentsLive />
    </DashboardLayout>
  );
}
