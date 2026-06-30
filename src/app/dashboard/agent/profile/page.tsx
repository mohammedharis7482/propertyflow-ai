import Link from "next/link";
import { BadgeCheck, Building2, ShieldCheck, Star } from "lucide-react";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import AgentProfileForm from "@/components/dashboard/agent/AgentProfileForm";
import { Button } from "@/components/ui/button";

export default function AgentProfilePage() {
  return (
    <DashboardLayout role="agent">
      <DashboardPageHeader
        badge="Agent Profile"
        title="Manage your agent profile."
        description="Control your advisor profile, verification status, listings, and client-facing details."
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#F8FAF9] p-5">
              <Building2 size={20} className="text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Listings</p>
              <p className="font-heading text-2xl font-bold">32</p>
            </div>

            <div className="rounded-2xl bg-[#F8FAF9] p-5">
              <Star size={20} className="text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Rating</p>
              <p className="font-heading text-2xl font-bold">4.9</p>
            </div>

            <div className="rounded-2xl bg-[#F8FAF9] p-5">
              <BadgeCheck size={20} className="text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Trust Score</p>
              <p className="font-heading text-2xl font-bold text-primary">
                94%
              </p>
            </div>
          </div>

          <AgentProfileForm />
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <BadgeCheck size={24} className="text-primary" />

            <h3 className="mt-5 font-heading text-xl font-bold">
              Verified Advisor
            </h3>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Your advisor profile is verified and visible to users.
            </p>

            <Button className="mt-6 rounded-2xl" asChild>
              <Link href="/agents/ahmed-al-mansoori">View Public Profile</Link>
            </Button>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <ShieldCheck size={24} className="text-primary" />
            <h3 className="mt-5 font-heading text-xl font-bold">
              Profile Quality
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Complete profiles receive stronger placement across buyer search
              and recommendation surfaces.
            </p>
            <div className="mt-5 rounded-2xl bg-[#F8FAF9] p-4">
              <p className="text-xs text-muted-foreground">Completion</p>
              <p className="mt-1 font-heading text-3xl font-bold text-primary">
                94%
              </p>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
