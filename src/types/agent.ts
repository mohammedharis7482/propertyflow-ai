import type { BackendAgency, BackendPropertyListItem } from "@/types/property";

export interface BackendAgentListItem {
  id: number;
  slug: string;
  full_name: string;
  profile_image?: string | null;
  profile_image_url?: string | null;
  agency?: BackendAgency | string | null;
  agency_name?: string | null;
  city?: string;
  service_areas?: string;
  rating: number | string;
  total_reviews: number;
  experience_years: number;
  is_featured?: boolean;
  specialization?: string;
}

export interface BackendAgentDetail extends BackendAgentListItem {
  bio?: string;
  languages?: string;
  license_number?: string;
  total_sales?: number;
  verification_status?: string;
  listed_properties_count?: number;
  featured_properties?: BackendPropertyListItem[];
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: string;
  location: string;
  image: string;
  rating: number;
  properties: number;
  experience: string;
  about?: string;
  specialities?: string[];
  languages?: string[];
  agency?: string;
  raw?: BackendAgentListItem | BackendAgentDetail;
}
