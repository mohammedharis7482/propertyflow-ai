"use client";

import { useCallback } from "react";
import Link from "next/link";

import AIScoreCard from "@/components/ai/AIScoreCard";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "@/lib/auth-token";
import { getPropertyMatchScore } from "@/services/ai.service";
import { useLiveData } from "@/components/dashboard/live/live-utils";

interface PropertyAIMatchCardProps {
  slug: string;
}

export default function PropertyAIMatchCard({ slug }: PropertyAIMatchCardProps) {
  const hasToken = Boolean(getAccessToken());
  const loader = useCallback(async () => {
    if (!getAccessToken()) {
      return null;
    }
    return getPropertyMatchScore(slug);
  }, [slug]);
  const { data, error, isLoading } = useLiveData(loader);

  if (!hasToken) {
    return (
      <AIScoreCard
        title="AI Match Score"
        score={0}
        label="AI Match"
        summary="Login to see your AI match score based on saved properties, inquiries, budget, and location signals."
        footer={
          <Button className="w-full rounded-2xl" asChild>
            <Link href="/login">Login to View Match</Link>
          </Button>
        }
      />
    );
  }

  return (
    <AIScoreCard
      title="AI Match Score"
      score={data?.score ?? 0}
      label="AI Match"
      loading={isLoading}
      summary={
        error
          ? "AI match is temporarily unavailable. Your property details are still ready to review."
          : data?.summary ??
            "Rule-based AI score uses saved properties, inquiries, location, budget, and listing quality."
      }
    />
  );
}
