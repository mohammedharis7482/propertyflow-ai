import Link from "next/link";
import { Heart, Search, ShieldCheck, Sparkles, User } from "lucide-react";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import UserProfileForm from "@/components/dashboard/user/UserProfileForm";
import { Button } from "@/components/ui/button";

export default function UserProfilePage() {
  return (
    <DashboardLayout role="user">
      <DashboardPageHeader
        badge="Profile"
        title="Manage your user profile."
        description="Update your account details, preferences, verification status, and property search profile."
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <Heart size={20} className="text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Saved</p>
              <p className="font-heading text-2xl font-bold">18</p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <Sparkles size={20} className="text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Best Match</p>
              <p className="font-heading text-2xl font-bold text-primary">
                96%
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <Search size={20} className="text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">Search Fit</p>
              <p className="font-heading text-2xl font-bold">Premium</p>
            </div>
          </div>

          <UserProfileForm />
        </div>

        <aside className="space-y-8">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <ShieldCheck size={24} className="text-primary" />

            <h3 className="mt-5 font-heading text-xl font-bold">
              Verification Status
            </h3>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Your profile is ready for property inquiries and AI-powered matching.
            </p>

            <Button className="mt-6 rounded-2xl" asChild>
              <Link href="/dashboard/user/recommendations">
                <User size={18} className="mr-2" />
                View AI Matches
              </Link>
            </Button>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <Sparkles size={24} className="text-primary" />
            <h3 className="mt-5 font-heading text-xl font-bold">
              Match Readiness
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Complete buyer preferences help AI rank listings by budget,
              location, yield, lifestyle fit, and risk.
            </p>
            <div className="mt-5 rounded-2xl bg-[#F8FAF9] p-4">
              <p className="text-xs text-muted-foreground">Profile Quality</p>
              <p className="mt-1 font-heading text-3xl font-bold text-primary">
                92%
              </p>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
