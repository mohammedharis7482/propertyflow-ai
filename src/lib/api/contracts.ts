export type ApiStatus = "success" | "error";

export interface ApiResult<T = undefined> {
  status: ApiStatus;
  message: string;
  data?: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  accountType: string;
  accepted: boolean;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export interface UserProfilePayload {
  name: string;
  email: string;
  role: string;
  preferredMarket: string;
  budget: string;
  propertyIntent: string;
}

export interface AgentProfilePayload {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  languages: string;
  specialties: string;
  bio: string;
}

export interface AuthSession {
  role: "user" | "agent" | "admin";
  redirectTo: string;
}

export type DashboardActionType =
  | "add_listing"
  | "schedule_viewing"
  | "reply_inquiry"
  | "review_approval";

export interface DashboardActionPayload {
  type: DashboardActionType;
  title: string;
  fields: Record<string, string>;
}
