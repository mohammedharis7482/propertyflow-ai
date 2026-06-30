export type PropertyStatus = "For Sale" | "For Rent";

export interface BackendAgentSummary {
  id: number;
  slug: string;
  full_name: string;
  profile_image: string | null;
  profile_image_url?: string | null;
  rating: number | string;
  agency_name?: string | null;
  agency?: string | null;
}

export interface BackendAgency {
  id: number;
  name: string;
  slug: string;
  logo?: string | null;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  description?: string;
  is_verified?: boolean;
}

export interface BackendPropertyImage {
  id: number;
  image?: string | null;
  image_url?: string | null;
  url?: string | null;
  alt_text?: string;
  is_primary?: boolean;
  order?: number;
}

export interface BackendPropertyFeature {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface BackendPropertyListItem {
  id: number;
  slug: string;
  title: string;
  location_display?: string;
  price: string | number;
  currency: string;
  city: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  size_sqft: number;
  property_type: string;
  purpose: "SALE" | "RENT" | string;
  is_featured: boolean;
  primary_image?: string | null;
  agent?: BackendAgentSummary | null;
}

export interface BackendPropertyDetail extends BackendPropertyListItem {
  description?: string;
  country?: string;
  address?: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  parking_spaces?: number;
  furnishing_status?: string;
  status?: string;
  approval_status?: string;
  features?: BackendPropertyFeature[];
  images?: BackendPropertyImage[];
  gallery_images?: BackendPropertyImage[];
  agency?: BackendAgency | null;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  status: PropertyStatus;
  image: string;
  beds: number;
  baths: number;
  area: string;
  type: string;
  featured?: boolean;
  description?: string;
  amenities?: string[];
  gallery?: string[];
  agent?: BackendAgentSummary | null;
  raw?: BackendPropertyListItem | BackendPropertyDetail;
}
