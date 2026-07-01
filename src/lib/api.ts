import type { PaginatedResponse, QueryParams } from "@/types/api";
import { clearTokens, getAccessToken } from "@/lib/auth-token";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function buildApiUrl(path: string, params?: QueryParams) {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  let normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedBase.endsWith("/api/v1") && normalizedPath.startsWith("/api/v1/")) {
    normalizedPath = normalizedPath.replace(/^\/api\/v1/, "");
  }

  const url = new URL(`${normalizedBase}${normalizedPath}`);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { params?: QueryParams; auth?: boolean } = {}
): Promise<T> {
  const { params, headers, auth = true, ...fetchOptions } = options;
  const token = auth ? getAccessToken() : null;
  let response: Response;

  try {
    response = await fetch(buildApiUrl(path, params), {
      ...fetchOptions,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      cache: fetchOptions.cache ?? "no-store",
    });
  } catch (error) {
    throw new ApiError(
      "Unable to reach PropertyFlow API. Check the backend URL and allowed CORS origin.",
      0,
      {
        cause: error instanceof Error ? error.message : String(error),
      }
    );
  }

  const contentType = response.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");
  let payload: unknown = null;

  if (hasJson) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearTokens();
    }

    const baseMessage =
      isRecord(payload) && typeof payload.detail === "string"
        ? payload.detail
        : isRecord(payload) && typeof payload.message === "string"
          ? payload.message
          : `API request failed with status ${response.status}`;
    const message = baseMessage.includes(String(response.status))
      ? baseMessage
      : `${baseMessage} (status ${response.status})`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export function unwrapPaginated<T>(payload: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.results;
}

export * from "./api/index";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
