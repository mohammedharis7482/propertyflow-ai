export interface AuditLog {
  id: number | string;
  actor?: {
    id?: number | string;
    email?: string | null;
    full_name?: string | null;
    role?: string | null;
  } | null;
  action?: string | null;
  target_type?: string | null;
  target_id?: string | number | null;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string | null;
}
