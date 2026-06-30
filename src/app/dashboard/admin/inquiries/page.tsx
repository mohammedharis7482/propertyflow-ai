import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminInquiriesLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminInquiriesPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Inquiry Monitor"
        title="Monitor platform-wide lead activity."
        description="Review inquiry status, source, priority, agent assignment, and customer messages from the admin API."
      />

      <AdminInquiriesLive />
    </DashboardLayout>
  );
}
