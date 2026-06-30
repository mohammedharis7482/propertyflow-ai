import { API_BASE_URL, apiFetch, unwrapPaginated } from "@/lib/api";
import { topAgents } from "@/data/agents";
import {
  getPremiumAgentFallbackImage,
  premiumDefaultAgentImage,
} from "@/constants/agent-images";
import type { PaginatedResponse, QueryParams } from "@/types/api";
import type { Agent, BackendAgentDetail, BackendAgentListItem } from "@/types/agent";

export type AgentQueryParams = QueryParams;

const fallbackImage = premiumDefaultAgentImage ?? topAgents[0]?.image ?? "/placeholder-agent.jpg";
const fallbackAgentName = "Verified Agent";
const fallbackLocation = "Service area available on request";

export async function getAgents(params?: AgentQueryParams) {
  try {
    const payload = await apiFetch<
      PaginatedResponse<BackendAgentListItem> | BackendAgentListItem[]
    >("/agents/", { params });

    return unwrapPaginated(payload).map(normalizeAgent);
  } catch (error) {
    console.error("Failed to load agents from API", error);
    return [];
  }
}

export async function getFeaturedAgents() {
  try {
    const payload = await apiFetch<
      PaginatedResponse<BackendAgentListItem> | BackendAgentListItem[]
    >("/agents/featured/");

    const agents = unwrapPaginated(payload).map(normalizeAgent);

    if (agents.length > 0) {
      return agents;
    }

    return getAgents();
  } catch (error) {
    console.error("Failed to load featured agents from API", error);
    return [];
  }
}

export async function getAgentBySlug(slug: string) {
  try {
    const agent = await apiFetch<BackendAgentDetail>(`/agents/${slug}/`);

    return normalizeAgent(agent);
  } catch (error) {
    console.error(`Failed to load agent ${slug} from API`, error);
    return null;
  }
}

export function normalizeAgent(agent: BackendAgentListItem | BackendAgentDetail): Agent {
  const serviceAreas = splitList(agent.service_areas);
  const specialities = splitList(agent.specialization);
  const languages = "languages" in agent ? splitList(agent.languages) : [];
  const agencyName = getAgencyName(agent.agency) ?? agent.agency_name;

  return {
    id: String(agent.id),
    slug: cleanText(agent.slug, String(agent.id)),
    name: cleanText(agent.full_name, fallbackAgentName),
    role: cleanText(agent.specialization, "Verified Property Advisor"),
    location: cleanText(serviceAreas[0] ?? agent.city ?? agencyName, fallbackLocation),
    image:
      normalizeImageUrl(agent.profile_image || agent.profile_image_url) ||
      getAgentFallbackImage(agent),
    rating: Number(agent.rating ?? 0) || 4.8,
    properties:
      "listed_properties_count" in agent && agent.listed_properties_count
        ? agent.listed_properties_count
        : "total_reviews" in agent
          ? agent.total_reviews
          : 0,
    experience: `${agent.experience_years ?? 0} Years`,
    about: "bio" in agent ? cleanOptionalText(agent.bio) : undefined,
    specialities: specialities.length > 0 ? specialities : undefined,
    languages: languages.length > 0 ? languages : undefined,
    agency: agencyName ?? undefined,
    raw: agent,
  };
}

function getAgentFallbackImage(agent: BackendAgentListItem | BackendAgentDetail) {
  const seed = String(agent.slug || agent.id || "")
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return getPremiumAgentFallbackImage(seed) || fallbackImage;
}

function splitList(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getAgencyName(agency: BackendAgentListItem["agency"]) {
  if (!agency) {
    return null;
  }

  return typeof agency === "string" ? agency : agency.name;
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

function cleanOptionalText(value: string | null | undefined) {
  return isUsefulText(value) ? value.trim() : undefined;
}

function isUsefulText(value: string | null | undefined): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && normalized !== "null" && normalized !== "undefined";
}
