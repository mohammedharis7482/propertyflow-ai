import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminAuditLogsLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminAuditLogsPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Audit Logs"
        title="Review sensitive platform actions."
        description="Track admin updates, verification decisions, property approvals, notifications, and operational changes from the live audit API."
      />

      <AdminAuditLogsLive />
    </DashboardLayout>
  );
}
