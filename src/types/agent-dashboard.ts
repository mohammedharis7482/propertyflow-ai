import type {
  DashboardAppointment,
  DashboardInquiry,
  DashboardPropertySummary,
} from "@/types/user-dashboard";

export interface AgentDashboardStats {
  total_listings?: number;
  published_listings?: number;
  total_inquiries?: number;
  new_inquiries?: number;
  appointments?: number;
  pending_appointments?: number;
}

export interface AgentDashboardResponse {
  stats?: AgentDashboardStats;
  recent_inquiries?: DashboardInquiry[];
  upcoming_appointments?: DashboardAppointment[];
  top_properties?: DashboardPropertySummary[];
}
