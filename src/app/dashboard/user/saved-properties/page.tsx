import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { UserSavedPropertiesLive } from "@/components/dashboard/live/UserDashboardViews";

export default function UserSavedPropertiesPage() {
  return (
    <DashboardLayout role="user">
      <DashboardPageHeader
        badge="Saved Properties"
        title="Your saved property collection."
        description="Review saved properties, compare opportunities, and continue your real estate journey with API-powered guidance."
      />

      <UserSavedPropertiesLive />
    </DashboardLayout>
  );
}
