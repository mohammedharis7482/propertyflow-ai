export type UserRole = "USER" | "AGENT" | "ADMIN";
export type AgentVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type PropertyApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PropertyStatus = "DRAFT" | "PUBLISHED" | "SOLD" | "RENTED" | "ARCHIVED";
export type AdminNotificationTarget = "ALL_USERS" | "ALL_AGENTS" | "SPECIFIC_USER";
export type AdminNotificationType =
  | "SYSTEM"
  | "PROPERTY"
  | "INQUIRY"
  | "APPOINTMENT"
  | "ACCOUNT"
  | "AI";

export interface SendAdminNotificationPayload {
  target_type: AdminNotificationTarget;
  user_id?: string | number;
  title: string;
  message: string;
  notification_type: AdminNotificationType;
}
