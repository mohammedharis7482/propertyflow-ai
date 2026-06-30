export type {
  DashboardActivity,
  DashboardInquiry,
  DashboardProperty,
  DashboardStat,
} from "./dashboard/index";

export type {
  DashboardAppointment as ApiDashboardAppointment,
  DashboardInquiry as ApiDashboardInquiry,
  DashboardPropertySummary,
  DashboardUserStats,
  UserDashboardResponse,
} from "./user-dashboard";

export type { AgentDashboardResponse, AgentDashboardStats } from "./agent-dashboard";
export type {
  AdminAgent,
  AdminAgency,
  AdminDashboardResponse,
  AdminDashboardStats,
  AdminUser,
  AuditLog,
} from "./admin-dashboard";
export type { NotificationItem, NotificationListResponse } from "./notification";
