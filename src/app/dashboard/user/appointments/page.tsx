import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { UserAppointmentsLive } from "@/components/dashboard/live/UserDashboardViews";

export default function UserAppointmentsPage() {
  return (
    <DashboardLayout role="user">
      <DashboardPageHeader
        badge="Appointments"
        title="Manage your property viewings."
        description="Track upcoming property visits, virtual tours, agent meetings, and scheduled appointments."
      />

      <UserAppointmentsLive />
    </DashboardLayout>
  );
}
