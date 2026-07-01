"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Bot, CheckCheck, LogOut, Menu, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { formatDateTime, formatEnumLabel, safeText } from "@/lib/formatters";
import {
  getNotificationSummary,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notification.service";
import type { NotificationItem } from "@/types/notification";

interface DashboardTopbarProps {
  role: "user" | "agent" | "admin";
  onMenuClick?: () => void;
}

export default function DashboardTopbar({
  role,
  onMenuClick,
}: DashboardTopbarProps) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationActionId, setNotificationActionId] = useState<string | number | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const roleLinks = {
    user: {
      create: "/dashboard/user/inquiries",
      assistant: "/dashboard/user/recommendations",
      notifications: "/dashboard/user/appointments",
    },
    agent: {
      create: "/dashboard/agent/listings",
      assistant: "/dashboard/agent/analytics",
      notifications: "/dashboard/agent/inquiries",
    },
    admin: {
      create: "/dashboard/admin/properties",
      assistant: "/dashboard/admin/analytics",
      notifications: "/dashboard/admin/inquiries",
    },
  }[role];

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  async function handleNotificationsClick() {
    setNotificationsOpen((current) => !current);
  }

  const loadNotifications = useCallback(async () => {
    try {
      setNotificationsLoading(true);
      const summary = await getNotificationSummary();
      setNotifications(summary.results);
      setUnreadCount(summary.unreadCount);
    } catch (error) {
      showToast(getActionErrorMessage(error), "error");
    } finally {
      setNotificationsLoading(false);
    }
  }, [showToast]);

  async function handleMarkRead(notification: NotificationItem) {
    if (notification.is_read) {
      return;
    }

    try {
      setNotificationActionId(notification.id);
      await markNotificationRead(notification.id);
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
      showToast("Notification marked as read.");
    } catch (error) {
      showToast(getActionErrorMessage(error), "error");
    } finally {
      setNotificationActionId(null);
    }
  }

  async function handleMarkAllRead() {
    try {
      setNotificationActionId("all");
      await markAllNotificationsRead();
      setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
      showToast("All notifications marked as read.");
    } catch (error) {
      showToast(getActionErrorMessage(error), "error");
    } finally {
      setNotificationActionId(null);
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadNotifications();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadNotifications]);

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-40 max-w-full overflow-x-clip border-b border-border bg-white/95 backdrop-blur-xl lg:left-[292px]">
      <div className="mx-auto flex h-14 w-full min-w-0 max-w-[1440px] items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-5 lg:h-20 lg:px-8 xl:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white lg:hidden"
            aria-label="Open dashboard menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden h-12 w-full max-w-xl items-center gap-3 rounded-2xl border border-border bg-[#F6F8F7] px-4 lg:flex">
            <Search size={18} className="text-muted-foreground" />
            <span className="truncate text-sm text-muted-foreground">
              Search properties, agents, users, leads...
            </span>
            <span className="ml-auto rounded-lg border border-border bg-white px-2 py-1 text-xs text-muted-foreground">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="hidden rounded-2xl bg-white lg:inline-flex"
            asChild
          >
            <Link href={roleLinks.create}>
              <Plus size={17} className="mr-2" />
              Create
            </Link>
          </Button>

          <Button
            variant="outline"
            className="hidden rounded-2xl bg-white xl:inline-flex"
            onClick={() => setAssistantOpen(true)}
            type="button"
          >
            <Bot size={17} className="mr-2 text-primary" />
            AI Assistant
          </Button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleNotificationsClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white shadow-sm sm:h-11 sm:w-11 sm:rounded-2xl"
              aria-label="Open notifications"
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="fixed inset-x-3 top-[3.75rem] z-50 max-h-[calc(100vh-5rem)] overflow-hidden rounded-[1.35rem] border border-border bg-white shadow-2xl shadow-slate-200/80 sm:absolute sm:inset-x-auto sm:right-0 sm:top-14 sm:w-[calc(100vw-2rem)] sm:max-w-sm sm:rounded-[1.5rem]">
                <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-bold">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl bg-white sm:w-auto"
                    disabled={notificationActionId === "all" || unreadCount === 0}
                    onClick={handleMarkAllRead}
                  >
                    <CheckCheck size={15} className="mr-1.5" />
                    Read All
                  </Button>
                </div>

                <div className="max-h-[360px] overflow-y-auto p-3">
                  {notificationsLoading ? (
                    <div className="grid gap-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-20 rounded-2xl bg-[#F6F8F7]"
                        />
                      ))}
                    </div>
                  ) : notifications.length > 0 ? (
                    <div className="grid gap-2">
                      {notifications.slice(0, 6).map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          disabled={notificationActionId === notification.id}
                          onClick={() => handleMarkRead(notification)}
                          className={`w-full rounded-2xl border p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40 disabled:opacity-70 ${
                            notification.is_read
                              ? "border-transparent bg-[#F8FAF9]"
                              : "border-emerald-100 bg-emerald-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="line-clamp-1 font-semibold">
                              {safeText(notification.title, "PropertyFlow update")}
                            </p>
                            {!notification.is_read && (
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {safeText(notification.message, "You have a new workspace update.")}
                          </p>
                          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {formatEnumLabel(notification.notification_type) || "System"} ·{" "}
                            {formatDateTime(notification.created_at)}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-[#F8FAF9] p-5 text-sm text-muted-foreground">
                      No notifications yet.
                    </div>
                  )}
                </div>

                <div className="border-t border-border p-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl bg-white"
                    onClick={() => {
                      setNotificationsOpen(false);
                      router.push(roleLinks.notifications);
                    }}
                  >
                    Open Related Workspace
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-white p-1 shadow-sm sm:gap-3 sm:rounded-2xl sm:px-3 sm:py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-white sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs">
              {getInitials(user?.full_name)}
            </div>

            <div className="hidden sm:block">
              <p className="max-w-32 truncate text-sm font-semibold">
                {user?.full_name ?? "PropertyFlow"}
              </p>
              <p className="text-xs capitalize text-muted-foreground">
                {role} workspace
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-muted-foreground shadow-sm transition hover:text-primary sm:h-11 sm:w-11 sm:rounded-2xl"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-3 pb-3 sm:px-5 sm:pb-4 lg:hidden">
        <label className="flex h-10 items-center gap-2 rounded-xl border border-border bg-[#F6F8F7] px-3 sm:h-11 sm:gap-3 sm:rounded-2xl sm:px-4">
          <Search size={16} className="shrink-0 text-muted-foreground sm:size-[18px]" />
          <input
            className="min-w-0 flex-1 bg-transparent text-xs font-medium text-foreground outline-none placeholder:text-muted-foreground sm:text-sm"
            placeholder="Search workspace..."
          />
        </label>
      </div>

      <AIAssistantPanel
        open={assistantOpen}
        role={role}
        onOpenChange={setAssistantOpen}
      />
    </header>

    <div aria-hidden="true" className="h-[6.75rem] sm:h-[7.75rem] lg:h-20" />
    </>
  );
}

function getInitials(name?: string) {
  if (!name) {
    return "PF";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
