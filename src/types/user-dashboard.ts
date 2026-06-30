import type { BackendPropertyListItem } from "@/types/property";

export interface DashboardUserStats {
  saved_properties?: number;
  inquiries?: number;
  appointments?: number;
  notifications_unread?: number;
}

export interface DashboardPropertySummary extends Partial<BackendPropertyListItem> {
  saved_at?: string;
  location?: string;
  image?: string | null;
  status?: string | null;
  approval_status?: string | null;
  property?: BackendPropertyListItem;
}

export interface DashboardInquiry {
  id: number | string;
  property?: BackendPropertyListItem | string | null;
  property_title?: string | null;
  agent?: string | { full_name?: string; user?: { full_name?: string } } | null;
  agent_name?: string | null;
  user?: string | { full_name?: string; email?: string } | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  status?: string | null;
  priority?: string | null;
  source?: string | null;
  created_at?: string | null;
}

export interface DashboardAppointment {
  id: number | string;
  property?: BackendPropertyListItem | string | null;
  property_title?: string | null;
  location?: string | null;
  user?: string | { full_name?: string; email?: string } | null;
  agent?: string | { full_name?: string; user?: { full_name?: string } } | null;
  agent_name?: string | null;
  appointment_date?: string | null;
  appointment_time?: string | null;
  status?: string | null;
  visit_type?: string | null;
  notes?: string | null;
  created_at?: string | null;
}

export interface UserDashboardResponse {
  stats?: DashboardUserStats;
  recent_saved_properties?: DashboardPropertySummary[];
  recent_inquiries?: DashboardInquiry[];
  upcoming_appointments?: DashboardAppointment[];
  recommendation_preview?: DashboardPropertySummary[];
}
