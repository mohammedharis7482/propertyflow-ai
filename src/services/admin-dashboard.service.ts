import { apiFetch, unwrapPaginated } from "@/lib/api";
import type { PaginatedResponse, QueryParams } from "@/types/api";
import type {
  AdminAgent,
  AdminAgency,
  AdminDashboardResponse,
  AdminUser,
  AuditLog,
} from "@/types/admin-dashboard";
import type {
  DashboardAppointment,
  DashboardInquiry,
  DashboardPropertySummary,
} from "@/types/user-dashboard";

export function getAdminDashboard() {
  return apiFetch<AdminDashboardResponse>("/admin/dashboard/");
}

export async function getAdminUsers(params?: QueryParams) {
  const payload = await apiFetch<PaginatedResponse<AdminUser> | AdminUser[]>(
    "/admin/users/",
    { params }
  );

  return unwrapPaginated(payload);
}

export async function getAdminAgents(params?: QueryParams) {
  const payload = await apiFetch<PaginatedResponse<AdminAgent> | AdminAgent[]>(
    "/admin/agents/",
    { params }
  );

  return unwrapPaginated(payload);
}

export async function getAdminAgencies(params?: QueryParams) {
  const payload = await apiFetch<PaginatedResponse<AdminAgency> | AdminAgency[]>(
    "/admin/agencies/",
    { params }
  );

  return unwrapPaginated(payload);
}

export async function getAdminProperties(params?: QueryParams) {
  const payload = await apiFetch<
    PaginatedResponse<DashboardPropertySummary> | DashboardPropertySummary[]
  >("/admin/properties/", { params });

  return unwrapPaginated(payload);
}

export async function getAdminInquiries(params?: QueryParams) {
  const payload = await apiFetch<
    PaginatedResponse<DashboardInquiry> | DashboardInquiry[]
  >("/admin/inquiries/", { params });

  return unwrapPaginated(payload);
}

export async function getAdminAppointments(params?: QueryParams) {
  const payload = await apiFetch<
    PaginatedResponse<DashboardAppointment> | DashboardAppointment[]
  >("/admin/appointments/", { params });

  return unwrapPaginated(payload);
}

export async function getAuditLogs(params?: QueryParams) {
  const payload = await apiFetch<PaginatedResponse<AuditLog> | AuditLog[]>(
    "/admin/audit-logs/",
    { params }
  );

  return unwrapPaginated(payload);
}
