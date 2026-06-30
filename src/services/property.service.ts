import { API_BASE_URL, apiFetch, unwrapPaginated } from "@/lib/api";
import { allProperties } from "@/data/properties";
import type { PaginatedResponse, QueryParams } from "@/types/api";
import type {
  BackendPropertyDetail,
  BackendPropertyFeature,
  BackendPropertyImage,
  BackendPropertyListItem,
  Property,
  PropertyStatus,
} from "@/types/property";

export type PropertyQueryParams = QueryParams;

const fallbackImage = allProperties[0]?.image ?? "/placeholder-property.jpg";
const fallbackTitle = "Premium Property";
const fallbackLocation = "Location available on request";

export async function getProperties(params?: PropertyQueryParams) {
  try {
    const payload = await apiFetch<
      PaginatedResponse<BackendPropertyListItem> | BackendPropertyListItem[]
    >("/properties/", { params });

    return unwrapPaginated(payload).map(normalizeProperty);
  } catch (error) {
    console.error("Failed to load properties from API", error);
    return [];
  }
}

export async function getFeaturedProperties() {
  try {
    const payload = await apiFetch<
      PaginatedResponse<BackendPropertyListItem> | BackendPropertyListItem[]
    >("/properties/featured/");

    const properties = unwrapPaginated(payload).map(normalizeProperty);

    if (properties.length > 0) {
      return properties;
    }

    return getProperties();
  } catch (error) {
    console.error("Failed to load featured properties from API", error);
    return [];
  }
}

export async function getPropertyBySlug(slug?: string) {
  if (!isUsefulText(slug)) {
    return null;
  }

  const property = await apiFetch<BackendPropertyDetail>(
    `/properties/${encodeURIComponent(slug)}/`
  );

  return normalizeProperty(property);
}

export async function getPropertyFeatures() {
  try {
    const payload = await apiFetch<
      PaginatedResponse<BackendPropertyFeature> | BackendPropertyFeature[]
    >("/properties/features/");

    return unwrapPaginated(payload);
  } catch (error) {
    console.error("Failed to load property features from API", error);
    return [];
  }
}

export function normalizeProperty(
  property: BackendPropertyListItem | BackendPropertyDetail
): Property {
  const status = normalizePurpose(property.purpose);
  const location = getLocation(property);
  const gallery = getGallery(property);
  const features =
    "features" in property && property.features
      ? property.features.map((feature) => feature.name)
      : undefined;

  return {
    id: String(property.id),
    slug: cleanText(property.slug, String(property.id)),
    title: cleanText(property.title, fallbackTitle),
    location,
    price: formatPrice(property.price, property.currency, property.purpose),
    status,
    image: normalizeImageUrl(property.primary_image || gallery[0]) || fallbackImage,
    beds: property.bedrooms ?? 0,
    baths: property.bathrooms ?? 0,
    area: `${Number(property.size_sqft ?? 0).toLocaleString()} sqft`,
    type: formatEnumLabel(property.property_type),
    featured: property.is_featured,
    description: "description" in property ? property.description : undefined,
    amenities: features,
    gallery,
    agent: property.agent,
    raw: property,
  };
}

function normalizePurpose(purpose: string): PropertyStatus {
  return purpose === "RENT" ? "For Rent" : "For Sale";
}

function getLocation(property: BackendPropertyListItem | BackendPropertyDetail) {
  if (isUsefulText(property.location_display)) {
    return property.location_display;
  }

  const location = [property.area, property.city, "country" in property ? property.country : ""]
    .filter(Boolean)
    .join(", ");

  return cleanText(location, fallbackLocation);
}

function getGallery(property: BackendPropertyListItem | BackendPropertyDetail) {
  if (!("images" in property) && !("gallery_images" in property)) {
    return [];
  }

  const images = [
    ...(("images" in property ? property.images : []) ?? []),
    ...(("gallery_images" in property ? property.gallery_images : []) ?? []),
  ];

  return images.map(getImageUrl).filter(Boolean) as string[];
}

function getImageUrl(image: BackendPropertyImage) {
  return normalizeImageUrl(image.image || image.image_url || image.url);
}

function formatPrice(price: string | number, currency: string, purpose: string) {
  const safeCurrency = cleanText(currency, "AED");
  const numericPrice =
    typeof price === "number" ? price : Number(String(price).replace(/,/g, ""));
  const formatted = Number.isFinite(numericPrice)
    ? Intl.NumberFormat("en", {
        maximumFractionDigits: 0,
      }).format(numericPrice)
    : cleanText(String(price), "Price on request");

  return `${safeCurrency} ${formatted}${purpose === "RENT" ? "/yr" : ""}`;
}

function formatEnumLabel(value: string) {
  return cleanText(value, "Premium Property")
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeImageUrl(url?: string | null) {
  if (!isUsefulText(url)) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${new URL(API_BASE_URL).origin}${url}`;
  }

  return url;
}

function cleanText(value: string | null | undefined, fallback: string) {
  return isUsefulText(value) ? value.trim() : fallback;
}

function isUsefulText(value: string | null | undefined): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && normalized !== "null" && normalized !== "undefined";
}
