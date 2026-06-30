import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminDashboardLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Admin Dashboard"
        title="Platform operations and growth analytics."
        description="Monitor platform performance, users, agents, listings, approvals, and overall marketplace health."
      />

      <AdminDashboardLive />
    </DashboardLayout>
  );
}
