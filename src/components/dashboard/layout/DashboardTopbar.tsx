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
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-20 sm:px-5 lg:px-8 xl:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-white lg:hidden"
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white shadow-sm"
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
              <div className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-2xl shadow-slate-200/80">
                <div className="flex items-center justify-between gap-3 border-b border-border p-4">
                  <div>
                    <p className="font-heading text-lg font-bold">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl bg-white"
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
                          className={`rounded-2xl border p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/40 disabled:opacity-70 ${
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

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-1.5 shadow-sm sm:px-3 sm:py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xs font-bold text-white">
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
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-muted-foreground shadow-sm transition hover:text-primary"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-4 sm:px-5 lg:hidden">
        <label className="flex h-12 items-center gap-3 rounded-2xl border border-border bg-[#F6F8F7] px-4">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
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
