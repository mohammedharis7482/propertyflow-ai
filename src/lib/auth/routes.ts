export type DashboardRole = "user" | "agent" | "admin";

export const protectedDashboardRoutes: Record<DashboardRole, string[]> = {
  user: [
    "/dashboard/user",
    "/dashboard/user/saved-properties",
    "/dashboard/user/inquiries",
    "/dashboard/user/appointments",
    "/dashboard/user/recommendations",
    "/dashboard/user/profile",
  ],
  agent: [
    "/dashboard/agent",
    "/dashboard/agent/listings",
    "/dashboard/agent/inquiries",
    "/dashboard/agent/appointments",
    "/dashboard/agent/analytics",
    "/dashboard/agent/profile",
  ],
  admin: [
    "/dashboard/admin",
    "/dashboard/admin/properties",
    "/dashboard/admin/agents",
    "/dashboard/admin/users",
    "/dashboard/admin/inquiries",
    "/dashboard/admin/appointments",
    "/dashboard/admin/audit-logs",
    "/dashboard/admin/analytics",
    "/dashboard/admin/settings",
  ],
};

export function getRequiredDashboardRole(pathname: string) {
  return Object.entries(protectedDashboardRoutes).find(([, routes]) =>
    routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  )?.[0] as DashboardRole | undefined;
}
