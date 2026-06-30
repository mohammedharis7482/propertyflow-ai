import { apiFetch } from "@/lib/api";
import type { AppointmentStatus } from "@/services/appointment.service";
import type { InquiryPriority, InquiryStatus } from "@/services/inquiry.service";
import type {
  AgentVerificationStatus,
  PropertyApprovalStatus,
  PropertyStatus,
  SendAdminNotificationPayload,
  UserRole,
} from "@/types/admin-actions";

export type {
  AgentVerificationStatus,
  PropertyApprovalStatus,
  PropertyStatus,
  SendAdminNotificationPayload,
  UserRole,
};

export function updateUserStatus(id: string | number, isActive: boolean) {
  return apiFetch<{ message?: string }>(`/admin/users/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateUserRole(id: string | number, role: UserRole) {
  return apiFetch<{ message?: string }>(`/admin/users/${id}/role/`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateAgentVerification(
  id: string | number,
  verificationStatus: AgentVerificationStatus
) {
  return apiFetch<{ message?: string }>(`/admin/agents/${id}/verification/`, {
    method: "PATCH",
    body: JSON.stringify({ verification_status: verificationStatus }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateAgentFeature(id: string | number, isFeatured: boolean) {
  return apiFetch<{ message?: string }>(`/admin/agents/${id}/feature/`, {
    method: "PATCH",
    body: JSON.stringify({ is_featured: isFeatured }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateAgencyVerification(id: string | number, isVerified: boolean) {
  return apiFetch<{ message?: string }>(`/admin/agencies/${id}/verification/`, {
    method: "PATCH",
    body: JSON.stringify({ is_verified: isVerified }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updatePropertyApproval(
  id: string | number,
  approvalStatus: PropertyApprovalStatus
) {
  return apiFetch<{ message?: string }>(`/admin/properties/${id}/approval/`, {
    method: "PATCH",
    body: JSON.stringify({ approval_status: approvalStatus }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updatePropertyFeature(id: string | number, isFeatured: boolean) {
  return apiFetch<{ message?: string }>(`/admin/properties/${id}/feature/`, {
    method: "PATCH",
    body: JSON.stringify({ is_featured: isFeatured }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updatePropertyStatus(id: string | number, status: PropertyStatus) {
  return apiFetch<{ message?: string }>(`/admin/properties/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateAdminInquiryStatus(id: string | number, status: InquiryStatus) {
  return apiFetch<{ message?: string }>(`/admin/inquiries/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateAdminInquiryPriority(
  id: string | number,
  priority: InquiryPriority
) {
  return apiFetch<{ message?: string }>(`/admin/inquiries/${id}/priority/`, {
    method: "PATCH",
    body: JSON.stringify({ priority }),
    headers: { "Content-Type": "application/json" },
  });
}

export function updateAdminAppointmentStatus(
  id: string | number,
  status: AppointmentStatus
) {
  return apiFetch<{ message?: string }>(`/admin/appointments/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" },
  });
}

export function sendAdminNotification(data: SendAdminNotificationPayload) {
  return apiFetch<{ message?: string; notified_count?: number }>(
    "/admin/notifications/send/",
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    }
  );
}
