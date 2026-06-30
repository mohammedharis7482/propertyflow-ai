import { apiFetch } from "@/lib/api";
import type {
  AppointmentStatus,
  CreateAppointmentPayload,
} from "@/types/appointment";

export type { AppointmentStatus, CreateAppointmentPayload };

export function createAppointment(data: CreateAppointmentPayload) {
  return apiFetch<{ message?: string; appointment?: unknown }>("/appointments/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function updateAppointmentStatus(
  id: string | number,
  status: AppointmentStatus
) {
  return apiFetch<{ message?: string }>(`/appointments/${id}/status/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function cancelAppointment(id: string | number) {
  return apiFetch<{ message?: string }>(`/appointments/${id}/cancel/`, {
    method: "PATCH",
  });
}
