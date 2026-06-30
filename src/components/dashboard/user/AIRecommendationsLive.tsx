"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Brain, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

import AIInsightCard from "@/components/dashboard/shared/AIInsightCard";
import MarketPulseCard from "@/components/dashboard/shared/MarketPulseCard";
import AIRecommendationCard from "@/components/ai/AIRecommendationCard";
import {
  DashboardEmptyPanel,
  DashboardErrorState,
  DashboardPanelSkeleton,
  MetricCard,
  toDashboardProperty,
  useLiveData,
} from "@/components/dashboard/live/live-utils";
import RecommendationRefreshAction from "@/components/dashboard/user/RecommendationRefreshAction";
import { Button } from "@/components/ui/button";
import { getAIRecommendations } from "@/services/ai.service";
import { formatNumber } from "@/lib/formatters";

const recommendationFactors = [
  "Saved property history",
  "Inquiry locations",
  "Property type preference",
  "Purpose and budget fit",
  "Verified agent signal",
  "Listing media quality",
];

export default function AIRecommendationsLive() {
  const loader = useCallback(() => getAIRecommendations(), []);
  const { data, error, isLoading } = useLiveData(loader);

  if (isLoading) {
    return <DashboardPanelSkeleton rows={5} />;
  }

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  const recommendations = data?.results ?? [];
  const best = recommendations[0];
  const bestProperty = best ? toDashboardProperty(best.property) : null;
  const averageScore = recommendations.length
    ? Math.round(
        recommendations.reduce((total, item) => total + item.match_score, 0) /
          recommendations.length
      )
    : 0;
  const highDemandLocations = new Set(
    recommendations
      .map((item) => item.property.city)
      .filter((city): city is string => Boolean(city))
  ).size;

  return (
    <>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
              <Brain size={16} className="mr-2" />
              PropertyFlow AI Match Engine
            </div>

            <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-tight lg:text-4xl">
              {bestProperty
                ? `${bestProperty.title} is your strongest current match.`
                : "Your AI recommendations will improve with more activity."}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              {best?.reason ??
                "Save or inquire about properties to improve your recommendations."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {["Rule-Based AI", "GCC Market Signals", "No Paid AI API"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-[#F8FAF9] px-4 py-2 text-sm font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#F8FAF9] p-6 text-center">
            <p className="text-sm text-muted-foreground">Best AI Match</p>
            <p className="mt-2 font-heading text-6xl font-bold text-primary">
              {formatNumber(best?.match_score ?? 0)}%
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {best ? "Personalized from your saved and inquiry history." : "Waiting for user signals."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <MetricCard icon={Sparkles} label="Recommendations" value={recommendations.length} />
        <MetricCard icon={TrendingUp} label="Average Match" value={`${averageScore}%`} highlight />
        <MetricCard icon={Brain} label="High-Demand Locations" value={highDemandLocations} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-2xl font-bold">
                Recommended Properties
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by rule-based match score, intent history, and listing quality signals.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <RecommendationRefreshAction />
              <Button variant="outline" className="rounded-2xl bg-white" asChild>
                <Link href="/properties">
                  <Sparkles size={18} className="mr-2" />
                  Explore More
                </Link>
              </Button>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((item) => (
                <AIRecommendationCard
                  key={item.property.id}
                  property={toDashboardProperty(item.property)}
                  matchScore={item.match_score}
                  reason={item.reason}
                />
              ))}
            </div>
          ) : (
            <DashboardEmptyPanel
              icon={Sparkles}
              title="No AI recommendations yet"
              description="Save or inquire about properties to improve your recommendations."
            />
          )}
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Market signal engine is active."
            description="Recommendations are generated by backend rule-based scoring and can be upgraded to OpenAI later."
            action="View Market Insights"
            href="/insights"
          />

          <div className="rounded-[2rem] border border-border bg-white p-5 shadow-sm">
            <h3 className="font-heading text-lg font-bold">
              Recommendation Logic
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              PropertyFlow AI ranks listings using saved properties, inquiry history, pricing, location, agent verification, and listing quality.
            </p>
            <div className="mt-5 space-y-3">
              {recommendationFactors.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <MarketPulseCard />
        </aside>
      </div>
    </>
  );
}
