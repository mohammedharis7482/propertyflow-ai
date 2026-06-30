import type {
  DashboardAppointment,
  DashboardInquiry,
  DashboardPropertySummary,
} from "@/types/user-dashboard";
import type { AuditLog } from "@/types/audit-log";

export interface AdminDashboardStats {
  total_users?: number;
  total_agents?: number;
  total_agencies?: number;
  total_properties?: number;
  published_properties?: number;
  pending_properties?: number;
  approved_properties?: number;
  rejected_properties?: number;
  total_inquiries?: number;
  new_inquiries?: number;
  total_appointments?: number;
  pending_appointments?: number;
  unread_notifications?: number;
}

export interface AdminUser {
  id: number | string;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  date_joined?: string | null;
  created_at?: string | null;
}

export interface AdminAgent {
  id: number | string;
  slug?: string | null;
  user?: AdminUser | null;
  full_name?: string | null;
  email?: string | null;
  agency?: string | { name?: string | null } | null;
  license_number?: string | null;
  verification_status?: string | null;
  is_featured?: boolean;
  rating?: number | string | null;
  created_at?: string | null;
}

export interface AdminAgency {
  id: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  is_verified?: boolean;
  created_at?: string | null;
}

export type { AuditLog };

export interface AdminDashboardResponse {
  stats?: AdminDashboardStats;
  recent_users?: AdminUser[];
  pending_agents?: AdminAgent[];
  pending_properties?: DashboardPropertySummary[];
  recent_inquiries?: DashboardInquiry[];
  upcoming_appointments?: DashboardAppointment[];
  top_properties?: DashboardPropertySummary[];
}
