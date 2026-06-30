import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminAppointmentsLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminAppointmentsPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Appointment Monitor"
        title="Track platform viewing activity."
        description="Monitor appointment status, visit type, users, agents, and scheduled property tours from the admin API."
      />

      <AdminAppointmentsLive />
    </DashboardLayout>
  );
}
