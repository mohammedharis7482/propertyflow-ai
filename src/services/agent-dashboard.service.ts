import { apiFetch, unwrapPaginated } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type { AgentDashboardResponse } from "@/types/agent-dashboard";
import type {
  DashboardAppointment,
  DashboardInquiry,
} from "@/types/user-dashboard";

export function getAgentDashboard() {
  return apiFetch<AgentDashboardResponse>("/agents/me/dashboard/");
}

export async function getAgentInquiries() {
  const payload = await apiFetch<
    PaginatedResponse<DashboardInquiry> | DashboardInquiry[]
  >("/agents/me/inquiries/");

  return unwrapPaginated(payload);
}

export async function getAgentAppointments() {
  const payload = await apiFetch<
    PaginatedResponse<DashboardAppointment> | DashboardAppointment[]
  >("/agents/me/appointments/");

  return unwrapPaginated(payload);
}
