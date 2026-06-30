import { ApiError } from "@/lib/api";

export function getActionErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Please sign in to continue.";
    }
    if (error.status === 403) {
      return "You do not have permission to perform this action.";
    }
    if (error.status === 404) {
      return "The requested item could not be found.";
    }

    if (typeof error.payload === "object" && error.payload !== null) {
      const payload = error.payload as Record<string, unknown>;
      const firstValue = Object.values(payload).flat().find(Boolean);

      if (typeof firstValue === "string") {
        return firstValue;
      }
    }

    return error.message;
  }

  return "Action failed. Please try again.";
}
