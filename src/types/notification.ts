export interface NotificationItem {
  id: number | string;
  title?: string | null;
  message?: string | null;
  notification_type?: string | null;
  is_read?: boolean;
  created_at?: string | null;
}

export interface NotificationListResponse {
  count?: number;
  unread_count?: number;
  results?: NotificationItem[];
}
