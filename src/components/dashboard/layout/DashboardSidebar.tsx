"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bot,
  Building2,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MessageCircle,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardRole = "user" | "agent" | "admin";

interface DashboardSidebarProps {
  role: DashboardRole;
  open?: boolean;
  onClose?: () => void;
}

const navItems = {
  user: [
    { label: "Overview", href: "/dashboard/user", icon: LayoutDashboard },
    { label: "Saved Properties", href: "/dashboard/user/saved-properties", icon: Heart },
    { label: "Inquiries", href: "/dashboard/user/inquiries", icon: MessageCircle },
    { label: "Appointments", href: "/dashboard/user/appointments", icon: CalendarCheck },
    { label: "AI Recommendations", href: "/dashboard/user/recommendations", icon: Sparkles },
    { label: "Profile", href: "/dashboard/user/profile", icon: User },
  ],
  agent: [
    { label: "Overview", href: "/dashboard/agent", icon: LayoutDashboard },
    { label: "My Listings", href: "/dashboard/agent/listings", icon: Building2 },
    { label: "Inquiries", href: "/dashboard/agent/inquiries", icon: MessageCircle },
    { label: "Appointments", href: "/dashboard/agent/appointments", icon: CalendarCheck },
    { label: "Analytics", href: "/dashboard/agent/analytics", icon: BarChart3 },
    { label: "Profile", href: "/dashboard/agent/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Properties", href: "/dashboard/admin/properties", icon: Building2 },
    { label: "Agents", href: "/dashboard/admin/agents", icon: ShieldCheck },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Inquiries", href: "/dashboard/admin/inquiries", icon: MessageCircle },
    { label: "Appointments", href: "/dashboard/admin/appointments", icon: CalendarCheck },
    { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: Activity },
    { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

export default function DashboardSidebar({
  role,
  open = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = navItems[role];
  const aiHref = {
    user: "/dashboard/user/recommendations",
    agent: "/dashboard/agent/analytics",
    admin: "/dashboard/admin/analytics",
  }[role];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 lg:hidden",
          open ? "block" : "hidden"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-dvh w-[min(292px,calc(100vw-28px))] flex-col overflow-hidden border-r border-border bg-white transition-transform duration-300 lg:z-40 lg:w-[292px] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between bg-white px-4 lg:h-20 lg:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3" onClick={onClose}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-extrabold text-white shadow-lg shadow-emerald-900/20 lg:h-11 lg:w-11 lg:rounded-2xl lg:text-sm">
              PF
            </div>

            <div className="min-w-0">
              <p className="truncate font-heading text-base font-bold tracking-tight text-foreground lg:text-lg">
                PropertyFlow
              </p>
              <p className="text-xs text-muted-foreground">AI Workspace</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border lg:hidden"
            aria-label="Close dashboard menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3 lg:p-4">
          <div className="rounded-[1.15rem] border border-border bg-[#F8FAF9] p-3 lg:rounded-[1.4rem] lg:p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Role
            </p>
            <p className="mt-1 font-heading text-base font-bold capitalize text-foreground lg:text-lg">
              {role} Dashboard
            </p>
          </div>
        </div>

        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 pb-3 lg:px-4 lg:pb-4">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === `/dashboard/${role}`
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex min-w-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition lg:rounded-2xl lg:px-4 lg:py-3",
                  active
                    ? "bg-emerald-50 text-primary"
                    : "text-muted-foreground hover:bg-[#F8FAF9] hover:text-foreground"
                )}
              >
                <Icon size={19} />
                <span className="min-w-0 truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 pt-0 lg:p-4 lg:pt-0">
          <div className="rounded-[1.15rem] border border-border bg-[#F8FAF9] p-3 lg:rounded-[1.5rem] lg:p-5">
            <div className="flex items-center gap-3 lg:block">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm lg:h-10 lg:w-10 lg:rounded-2xl">
                <Bot size={17} className="lg:size-5" />
              </div>

              <div className="min-w-0">
                <h3 className="font-heading text-sm font-bold text-foreground lg:mt-4 lg:text-base">
                  AI Command Center
                </h3>

                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground lg:mt-2 lg:line-clamp-none lg:leading-6">
                  Property matches, leads, ROI, and demand.
                </p>
              </div>
            </div>

            <Link
              href={aiHref}
              onClick={onClose}
              className="mt-3 block w-full rounded-xl bg-primary px-3 py-2 text-center text-xs font-semibold text-white lg:mt-4 lg:rounded-2xl lg:px-4 lg:py-2.5 lg:text-sm"
            >
              Ask AI
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
