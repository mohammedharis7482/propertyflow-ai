import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import { AdminPropertiesLive } from "@/components/dashboard/live/AdminDashboardViews";

export default function AdminPropertiesPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Property Inventory"
        title="Moderate platform property listings."
        description="Review approval status, feature placement, publication state, and listing quality from the admin API."
      />

      <AdminPropertiesLive />
    </DashboardLayout>
  );
}
