import { apiFetch } from "@/lib/api";
import type {
  CreateInquiryPayload,
  InquiryPriority,
  InquiryStatus,
} from "@/types/inquiry";

export type { CreateInquiryPayload, InquiryPriority, InquiryStatus };

export function createInquiry(data: CreateInquiryPayload) {
  return apiFetch<{ message?: string; inquiry?: unknown }>("/inquiries/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function updateInquiryStatus(id: string | number, status: InquiryStatus) {
  return apiFetch<{ message?: string }>(`/inquiries/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function updateInquiryPriority(id: string | number, priority: InquiryPriority) {
  return apiFetch<{ message?: string }>(`/admin/inquiries/${id}/priority/`, {
    method: "PATCH",
    body: JSON.stringify({ priority }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
