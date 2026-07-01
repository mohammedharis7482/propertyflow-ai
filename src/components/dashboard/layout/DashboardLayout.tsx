"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/layout/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/layout/DashboardTopbar";
import { getRequiredDashboardRole } from "@/lib/auth/routes";
import { useAuth } from "@/context/AuthContext";
import {
  getDashboardPath,
  getRoleFromDashboardPath,
} from "@/services/auth.service";

type DashboardRole = "user" | "agent" | "admin";

interface DashboardLayoutProps {
  children: ReactNode;
  role: DashboardRole;
}

export default function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const requiredRole = getRequiredDashboardRole(pathname);
  const requiredBackendRole = getRoleFromDashboardPath(pathname);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredBackendRole && user.role !== requiredBackendRole) {
      router.replace(getDashboardPath(user.role));
    }
  }, [
    isAuthenticated,
    isLoading,
    pathname,
    requiredBackendRole,
    router,
    user,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8F7] p-4 sm:p-6">
        <div className="mx-auto grid w-full max-w-[1440px] gap-5 lg:grid-cols-[292px_minmax(0,1fr)]">
          <div className="hidden rounded-[2rem] border border-border bg-white p-5 shadow-sm lg:block">
            <div className="h-11 w-11 rounded-2xl bg-emerald-50" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-11 rounded-2xl bg-[#F6F8F7]"
                />
              ))}
            </div>
          </div>

          <div className="min-w-0 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <div className="h-8 w-48 rounded-full bg-[#F6F8F7]" />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-[1.5rem] bg-[#F6F8F7]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredBackendRole && user.role !== requiredBackendRole) {
    return null;
  }

  return (
    <div
      className="dashboard-shell min-h-screen max-w-full overflow-x-hidden bg-[#F6F8F7] lg:grid lg:grid-cols-[292px_minmax(0,1fr)]"
      data-required-role={requiredRole ?? role}
    >
      <DashboardSidebar
        role={role}
        open={open}
        onClose={() => setOpen(false)}
      />

      <div className="min-w-0 max-w-full overflow-x-hidden bg-[#F6F8F7] lg:border-l lg:border-border">
        <DashboardTopbar role={role} onMenuClick={() => setOpen(true)} />

        <main className="mx-auto w-full min-w-0 max-w-[1440px] overflow-x-hidden px-4 py-5 sm:px-5 lg:px-8 lg:py-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
