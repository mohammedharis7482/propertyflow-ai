import { apiFetch, unwrapPaginated } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type {
  DashboardAppointment,
  DashboardInquiry,
  DashboardPropertySummary,
  UserDashboardResponse,
} from "@/types/user-dashboard";

export function getUserDashboard() {
  return apiFetch<UserDashboardResponse>("/users/me/dashboard/");
}

export async function getSavedProperties() {
  const payload = await apiFetch<
    PaginatedResponse<DashboardPropertySummary> | DashboardPropertySummary[]
  >("/users/me/saved-properties/");

  return unwrapPaginated(payload);
}

export async function getUserInquiries() {
  const payload = await apiFetch<
    PaginatedResponse<DashboardInquiry> | DashboardInquiry[]
  >("/users/me/inquiries/");

  return unwrapPaginated(payload);
}

export async function getUserAppointments() {
  const payload = await apiFetch<
    PaginatedResponse<DashboardAppointment> | DashboardAppointment[]
  >("/users/me/appointments/");

  return unwrapPaginated(payload);
}
