import type { BackendPropertyListItem } from "@/types/property";

export interface AIRecommendation {
  property: BackendPropertyListItem;
  match_score: number;
  reason: string;
}

export interface AIRecommendationsResponse {
  results: AIRecommendation[];
}

export interface PropertyMatchScore {
  property_slug: string;
  score: number;
  summary: string;
  reasons?: string[];
}

export interface LeadPriority {
  inquiry_id: number | string;
  score: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | string;
  summary: string;
}

export interface ListingQuality {
  property_slug: string;
  score: number;
  summary: string;
  suggestions: string[];
}

export interface MarketSignalItem {
  city?: string;
  property__city?: string;
  property_type?: string;
  listing_count?: number;
  inquiry_count?: number;
}

export interface MarketSignals {
  top_cities: MarketSignalItem[];
  popular_property_types: MarketSignalItem[];
  demand_signals: MarketSignalItem[];
  listing_counts: number;
  inquiry_counts: number;
  appointment_counts: number;
  demand_summary: string;
}
