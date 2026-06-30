import { apiFetch } from "@/lib/api";
import type {
  AIRecommendationsResponse,
  LeadPriority,
  ListingQuality,
  MarketSignals,
  PropertyMatchScore,
} from "@/types/ai";

export function getAIRecommendations() {
  return apiFetch<AIRecommendationsResponse>("/ai/recommendations/");
}

export function getPropertyMatchScore(slug: string) {
  return apiFetch<PropertyMatchScore>(
    `/ai/properties/${encodeURIComponent(slug)}/match-score/`
  );
}

export function getLeadPriority(id: string | number) {
  return apiFetch<LeadPriority>(`/ai/inquiries/${id}/lead-priority/`);
}

export function getListingQuality(slug: string) {
  return apiFetch<ListingQuality>(
    `/ai/properties/${encodeURIComponent(slug)}/listing-quality/`
  );
}

export function getMarketSignals() {
  return apiFetch<MarketSignals>("/ai/market-signals/");
}
