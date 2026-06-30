import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { UserInquiriesLive } from "@/components/dashboard/live/UserDashboardViews";

export default function UserInquiriesPage() {
  return (
    <DashboardLayout role="user">
      <DashboardPageHeader
        badge="Inquiries"
        title="Track your property conversations."
        description="View agent responses, inquiry status, follow-up actions, and property conversations from one clean dashboard."
      />

      <UserInquiriesLive />
    </DashboardLayout>
  );
}
