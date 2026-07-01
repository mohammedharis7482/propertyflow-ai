import { ApiError, apiFetch } from "@/lib/api";
import {
  clearTokens,
  getRefreshToken,
  saveAccessToken,
  saveTokens,
} from "@/lib/auth-token";

export type AuthRole = "USER" | "AGENT" | "ADMIN";

export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: AuthRole;
  profile_image?: string | null;
  is_verified?: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role: Exclude<AuthRole, "ADMIN">;
}

export async function login(email: string, password: string) {
  const payload = await apiFetch<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
    auth: false,
  });

  saveTokens(payload.access, payload.refresh);
  return payload;
}

export async function register(data: RegisterPayload) {
  const payload = await apiFetch<LoginResponse>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    auth: false,
  });

  clearTokens();
  return payload;
}

export async function refreshToken(refresh: string) {
  const payload = await apiFetch<{ access: string; refresh?: string }>(
    "/auth/token/refresh/",
    {
      method: "POST",
      body: JSON.stringify({ refresh }),
      headers: {
        "Content-Type": "application/json",
      },
      auth: false,
    }
  );

  if (payload.refresh) {
    saveTokens(payload.access, payload.refresh);
  } else {
    saveAccessToken(payload.access);
  }

  return payload;
}

export async function logout(refreshToken?: string | null) {
  const refresh = refreshToken ?? getRefreshToken();

  try {
    if (refresh) {
      await apiFetch<{ detail: string }>("/auth/logout/", {
        method: "POST",
        body: JSON.stringify({ refresh }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 400) {
      console.error("Logout request failed", error);
    }
  } finally {
    clearTokens();
  }
}

export async function getMe() {
  return apiFetch<AuthUser>("/auth/me/");
}

export function getDashboardPath(role: AuthRole) {
  return {
    USER: "/dashboard/user",
    AGENT: "/dashboard/agent",
    ADMIN: "/dashboard/admin",
  }[role];
}

export function getRoleFromDashboardPath(pathname: string): AuthRole | null {
  if (pathname.startsWith("/dashboard/user")) {
    return "USER";
  }
  if (pathname.startsWith("/dashboard/agent")) {
    return "AGENT";
  }
  if (pathname.startsWith("/dashboard/admin")) {
    return "ADMIN";
  }

  return null;
}

type AuthErrorContext = "login" | "register" | "general";

export function getFriendlyAuthError(
  error: unknown,
  context: AuthErrorContext = "general"
) {
  if (error instanceof ApiError) {
    if (context === "login" && (error.status === 400 || error.status === 401)) {
      return "Invalid email or password.";
    }

    if (error.status === 0) {
      return "Unable to reach PropertyFlow API. Check that the Render backend is running and CORS allows your Vercel domain.";
    }

    if (error.status === 403) {
      return "This account does not have permission to sign in here.";
    }

    if (typeof error.payload === "object" && error.payload !== null) {
      const payload = error.payload as Record<string, unknown>;
      const firstError = Object.values(payload).flat().find(Boolean);

      if (typeof firstError === "string") {
        return firstError;
      }
    }

    return error.message;
  }

  return "Unable to reach PropertyFlow API. Check that the Render backend is running and CORS allows your Vercel domain.";
}
