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
          "fixed left-0 top-0 z-50 flex h-dvh w-[min(292px,calc(100vw-28px))] flex-col border-r border-border bg-white transition-transform duration-300 lg:sticky lg:top-0 lg:z-40 lg:w-[292px] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 items-center justify-between bg-white px-5">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/20">
              PF
            </div>

            <div>
              <p className="font-heading text-lg font-bold tracking-tight text-foreground">
                PropertyFlow
              </p>
              <p className="text-xs text-muted-foreground">AI Workspace</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border lg:hidden"
            aria-label="Close dashboard menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="rounded-[1.4rem] border border-border bg-[#F8FAF9] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Role
            </p>
            <p className="mt-1 font-heading text-lg font-bold capitalize text-foreground">
              {role} Dashboard
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
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
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  active
                    ? "bg-emerald-50 text-primary"
                    : "text-muted-foreground hover:bg-[#F8FAF9] hover:text-foreground"
                )}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 pt-0">
          <div className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <Bot size={20} />
            </div>

            <h3 className="mt-4 font-heading text-base font-bold text-foreground">
              AI Command Center
            </h3>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Ask about property matches, leads, ROI signals, and market demand.
            </p>

            <Link
              href={aiHref}
              onClick={onClose}
              className="mt-4 block w-full rounded-2xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
            >
              Ask AI
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
