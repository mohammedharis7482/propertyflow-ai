import { allAgents, topAgents } from "@/data/agents";
import { adminActivities, adminApprovals, adminStats } from "@/data/dashboard/admin";
import { agentActivities, agentInquiries, agentStats } from "@/data/dashboard/agent";
import {
  recommendedProperties,
  userActivities,
  userStats,
} from "@/data/dashboard/user";
import { featuredProperties, allProperties } from "@/data/properties";

export const propertiesApi = {
  list: async () => allProperties,
  featured: async () => featuredProperties,
  getBySlug: async (slug: string) =>
    allProperties.find((property) => property.slug === slug) ?? null,
};

export const agentsApi = {
  list: async () => allAgents,
  top: async () => topAgents,
  getBySlug: async (slug: string) =>
    allAgents.find((agent) => agent.slug === slug) ?? null,
};

export const dashboardApi = {
  userOverview: async () => ({
    stats: userStats,
    recommendedProperties,
    activities: userActivities,
  }),
  agentOverview: async () => ({
    stats: agentStats,
    inquiries: agentInquiries,
    activities: agentActivities,
  }),
  adminOverview: async () => ({
    stats: adminStats,
    approvals: adminApprovals,
    activities: adminActivities,
  }),
};
