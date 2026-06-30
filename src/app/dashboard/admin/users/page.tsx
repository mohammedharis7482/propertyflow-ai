import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminUsersLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminUsersPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="User Management"
        title="Manage platform users and engagement."
        description="Monitor user activity, verification status, roles, and account health from the live admin API."
      />

      <AdminUsersLive />
    </DashboardLayout>
  );
}
