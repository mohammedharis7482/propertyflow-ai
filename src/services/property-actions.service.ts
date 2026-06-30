import { apiFetch } from "@/lib/api";

export function saveProperty(slug: string) {
  return apiFetch<{ message?: string }>(`/properties/${slug}/save/`, {
    method: "POST",
  });
}

export function unsaveProperty(slug: string) {
  return apiFetch<{ message?: string }>(`/properties/${slug}/unsave/`, {
    method: "DELETE",
  });
}
