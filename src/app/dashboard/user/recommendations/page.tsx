import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import AIRecommendationsLive from "@/components/dashboard/user/AIRecommendationsLive";

export default function UserRecommendationsPage() {
  return (
    <DashboardLayout role="user">
      <DashboardPageHeader
        badge="AI Recommendations"
        title="Smart property matches selected for you."
        description="Rule-based AI recommendations based on your saved properties, inquiries, budget signals, and listing quality."
      />

      <AIRecommendationsLive />
    </DashboardLayout>
  );
}
