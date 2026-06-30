import {
  AgentProfilePayload,
  ApiResult,
  AuthSession,
  ContactPayload,
  DashboardActionPayload,
  LoginPayload,
  RegisterPayload,
  UserProfilePayload,
} from "./contracts";

const roleRedirects: Record<AuthSession["role"], string> = {
  user: "/dashboard/user",
  agent: "/dashboard/agent",
  admin: "/dashboard/admin",
};

function delay<T>(value: T, ms = 450): Promise<T> {
  return new Promise((resolve) => {
    globalThis.setTimeout(() => resolve(value), ms);
  });
}

function inferRole(email: string): AuthSession["role"] {
  if (email.includes("admin")) return "admin";
  if (email.includes("agent")) return "agent";
  return "user";
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResult<AuthSession>> => {
    const role = inferRole(payload.email);

    return delay({
      status: "success",
      message: "Credentials accepted. Backend auth can connect here later.",
      data: {
        role,
        redirectTo: roleRedirects[role],
      },
    });
  },

  register: async (payload: RegisterPayload): Promise<ApiResult<AuthSession>> => {
    const normalizedRole =
      payload.accountType === "Agent" ? "agent" : ("user" as const);

    return delay({
      status: "success",
      message: "Account details look good. Backend registration can connect here later.",
      data: {
        role: normalizedRole,
        redirectTo: roleRedirects[normalizedRole],
      },
    });
  },
};

export const contactApi = {
  submit: async (payload: ContactPayload): Promise<ApiResult> => {
    void payload;

    return delay({
      status: "success",
      message:
        "Message received. Our team will review your request and respond with the right next step.",
    });
  },
};

export const profileApi = {
  updateUser: async (payload: UserProfilePayload): Promise<ApiResult> => {
    void payload;

    return delay({
      status: "success",
      message: "Profile preferences are ready to sync when the backend is connected.",
    });
  },

  updateAgent: async (payload: AgentProfilePayload): Promise<ApiResult> => {
    void payload;

    return delay({
      status: "success",
      message: "Profile changes are ready to sync when the backend is connected.",
    });
  },
};

export const dashboardActionApi = {
  submit: async (payload: DashboardActionPayload): Promise<ApiResult> => {
    void payload;

    return delay({
      status: "success",
      message: "Action captured. Backend workflow can connect here later.",
    });
  },
};
