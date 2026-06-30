import { apiFetch } from "@/lib/api";
import type { NotificationItem, NotificationListResponse } from "@/types/notification";

export async function getNotifications() {
  const payload = await apiFetch<NotificationListResponse | NotificationItem[]>(
    "/notifications/"
  );

  return Array.isArray(payload) ? payload : payload.results ?? [];
}

export async function getNotificationSummary() {
  const payload = await apiFetch<NotificationListResponse | NotificationItem[]>(
    "/notifications/"
  );

  const results = Array.isArray(payload) ? payload : payload.results ?? [];
  const unreadCount = Array.isArray(payload)
    ? results.filter((item) => !item.is_read).length
    : payload.unread_count ?? results.filter((item) => !item.is_read).length;

  return { results, unreadCount };
}

export function markNotificationRead(id: number | string) {
  return apiFetch<NotificationItem>(`/notifications/${id}/read/`, {
    method: "PATCH",
  });
}

export function markAllNotificationsRead() {
  return apiFetch<{ message?: string }>("/notifications/mark-all-read/", {
    method: "PATCH",
  });
}
