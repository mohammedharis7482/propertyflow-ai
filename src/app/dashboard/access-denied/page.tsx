import Link from "next/link";
import { LockKeyhole, LogIn, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardAccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#F6F8F7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-border bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                <ShieldAlert size={26} />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-primary">
                Dashboard Access
              </p>

              <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                This workspace needs the right role.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                When authentication is connected, users, agents, and admins will
                be redirected here if they try to open a dashboard outside their
                assigned access level.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-2xl">
                  <Link href="/login">
                    <LogIn size={18} className="mr-2" />
                    Sign In
                  </Link>
                </Button>

                <Button asChild variant="outline" className="rounded-2xl bg-white">
                  <Link href="/">Back Home</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-[#F8FAF9] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <LockKeyhole size={21} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Future Guard
                  </p>
                  <h2 className="font-heading text-lg font-bold">
                    Role-based access ready
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {["User dashboard", "Agent workspace", "Admin console"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm"
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
