import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardHero from "@/components/dashboard/shared/DashboardHero";
import { UserDashboardLive } from "@/components/dashboard/live/UserDashboardViews";

export default function UserDashboardPage() {
  return (
    <DashboardLayout role="user">
      <DashboardHero
        badge="User Dashboard"
        title="Good afternoon. Your property workspace is now connected."
        description="Track saved properties, inquiries, viewings, and backend-powered recommendations from one premium command center."
        metric="Live"
        metricLabel="Django API connected"
      />

      <UserDashboardLive />
    </DashboardLayout>
  );
}
