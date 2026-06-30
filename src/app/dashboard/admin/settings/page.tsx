import {
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import AdminNotificationSender from "@/components/dashboard/admin/AdminNotificationSender";

const settingGroups = [
  {
    title: "Platform Settings",
    description: "Regional defaults, marketplace rules, currencies, and operating regions.",
    icon: Settings,
    status: "Healthy",
    signal: "12 GCC cities active",
  },
  {
    title: "Security & Access",
    description: "Admin roles, session policies, login protection, and privileged access.",
    icon: Lock,
    status: "Protected",
    signal: "2FA enforced",
  },
  {
    title: "Verification Rules",
    description: "Agent verification, listing approval rules, document checks, and quality gates.",
    icon: ShieldCheck,
    status: "Active",
    signal: "64 reviews pending",
  },
  {
    title: "Notifications",
    description: "Email alerts, admin digests, inquiry notifications, and escalation routing.",
    icon: Bell,
    status: "Configured",
    signal: "4 channels live",
  },
];

const platformControls = [
  { label: "Default Region", value: "United Arab Emirates", icon: MapPin },
  { label: "Primary Currency", value: "AED", icon: Globe2 },
  { label: "Marketplace Mode", value: "Premium Listings", icon: SlidersHorizontal },
];

const securityRules = [
  {
    title: "Admin two-factor authentication",
    description: "Require verified admins to use a second authentication step.",
    active: true,
  },
  {
    title: "Sensitive action confirmation",
    description: "Ask for confirmation before approvals, suspensions, and permission changes.",
    active: true,
  },
  {
    title: "Session timeout protection",
    description: "Expire inactive admin sessions after a controlled security window.",
    active: true,
  },
];

const verificationRules = [
  { label: "Agent license check", value: "Required", tone: "primary" },
  { label: "Property image quality", value: "AI screened", tone: "primary" },
  { label: "Duplicate listing review", value: "Manual review", tone: "warning" },
  { label: "Ownership document status", value: "Required", tone: "primary" },
];

const notificationChannels = [
  { label: "Approval queue digest", detail: "Daily at 09:00", icon: Mail },
  { label: "High-intent inquiry alert", detail: "Instant", icon: Bell },
  { label: "Agent verification updates", detail: "Every 4 hours", icon: UserCheck },
];

const aiControls = [
  "Lead priority scoring",
  "Listing quality detection",
  "Market demand alerts",
  "Admin risk summaries",
];

function Toggle({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
        active ? "justify-end bg-primary" : "justify-start bg-muted"
      }`}
    >
      <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
    </span>
  );
}

export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Settings"
        title="Control platform rules and operations."
        description="Configure marketplace defaults, security policies, verification workflows, notification routing, and AI governance across PropertyFlow AI."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {settingGroups.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                  <Icon size={23} />
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                  {item.status}
                </span>
              </div>

              <h2 className="mt-5 font-heading text-xl font-bold">
                {item.title}
              </h2>

              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {item.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.signal}
                </span>
                <ChevronRight size={18} className="text-primary" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Platform Defaults
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Core marketplace settings used across public pages and dashboards.
                </p>
              </div>

              <DashboardActionDrawer
                actionType="review_approval"
                title="Save Platform Defaults"
                description="Stage marketplace defaults for backend settings persistence."
                triggerLabel="Save Changes"
                submitLabel="Save Defaults"
                icon={<Save size={18} className="mr-2" />}
                buttonClassName="rounded-2xl"
                fields={[
                  {
                    name: "approvalMode",
                    label: "Approval Mode",
                    placeholder: "AI assisted with admin review",
                  },
                  {
                    name: "coverage",
                    label: "Market Coverage",
                    placeholder: "GCC premium markets",
                  },
                ]}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {platformControls.map((control) => {
                const Icon = control.icon;

                return (
                  <div
                    key={control.label}
                    className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-5"
                  >
                    <Icon size={21} className="text-primary" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {control.label}
                    </p>
                    <p className="mt-2 font-heading text-xl font-bold">
                      {control.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Listing approval mode
                </span>
                <select className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm font-medium outline-none">
                  <option>AI assisted with admin review</option>
                  <option>Manual admin review only</option>
                  <option>Auto approve verified agents</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Default market coverage
                </span>
                <select className="mt-2 h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm font-medium outline-none">
                  <option>GCC premium markets</option>
                  <option>United Arab Emirates only</option>
                  <option>All active regions</option>
                </select>
              </label>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">
                    Security Controls
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Admin access and sensitive operation safeguards.
                  </p>
                </div>
                <KeyRound size={22} className="text-primary" />
              </div>

              <div className="space-y-4">
                {securityRules.map((rule) => (
                  <div
                    key={rule.title}
                    className="flex items-start justify-between gap-4 rounded-[1.35rem] border border-border bg-[#F8FAF9] p-4"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {rule.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {rule.description}
                      </p>
                    </div>
                    <Toggle active={rule.active} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading text-2xl font-bold">
                    Verification Rules
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Quality gates for agents, properties, and listing data.
                  </p>
                </div>
                <ShieldCheck size={22} className="text-primary" />
              </div>

              <div className="space-y-4">
                {verificationRules.map((rule) => (
                  <div
                    key={rule.label}
                    className="flex flex-col gap-3 rounded-[1.35rem] border border-border bg-[#F8FAF9] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {rule.label}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Current rule
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        rule.tone === "warning"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-primary"
                      }`}
                    >
                      {rule.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Notification Routing
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Decide when admins, agents, and operations teams receive alerts.
                </p>
              </div>

              <AdminNotificationSender />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {notificationChannels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <div
                    key={channel.label}
                    className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Icon size={21} className="text-primary" />
                      <Toggle active />
                    </div>
                    <p className="mt-4 font-semibold text-foreground">
                      {channel.label}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {channel.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-8">
          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                <CheckCircle2 size={23} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <h3 className="font-heading text-xl font-bold">
                  Controls healthy
                </h3>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <p className="text-xs text-muted-foreground">
                  Marketplace Score
                </p>
                <p className="mt-1 font-heading text-4xl font-bold text-primary">
                  94%
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <p className="text-xs text-muted-foreground">
                  Pending Admin Reviews
                </p>
                <p className="mt-1 font-heading text-4xl font-bold">64</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold">
                AI Governance
              </h3>
              <Bot size={22} className="text-primary" />
            </div>

            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              AI assists admins with prioritization and quality signals while
              keeping final control with the platform team.
            </p>

            <div className="mt-5 space-y-3">
              {aiControls.map((control) => (
                <div
                  key={control}
                  className="flex items-center justify-between rounded-2xl bg-[#F8FAF9] px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    {control}
                  </span>
                  <Toggle active />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold">
                Change Window
              </h3>
              <Clock3 size={22} className="text-primary" />
            </div>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Next recommended platform review is scheduled for Monday at
              09:00, covering approval speed, user trust, and agent compliance.
            </p>

            <DashboardActionDrawer
              actionType="review_approval"
              title="Schedule Platform Review"
              description="Create a governance review placeholder for backend calendar integration."
              triggerLabel="Schedule Review"
              submitLabel="Save Review Window"
              buttonVariant="outline"
              buttonClassName="mt-5 w-full rounded-2xl bg-white"
              fields={[
                {
                  name: "date",
                  label: "Date",
                  placeholder: "Monday",
                },
                {
                  name: "time",
                  label: "Time",
                  placeholder: "09:00",
                },
                {
                  name: "scope",
                  label: "Review Scope",
                  placeholder: "Approval speed, user trust, agent compliance",
                  type: "textarea",
                },
              ]}
            />
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
