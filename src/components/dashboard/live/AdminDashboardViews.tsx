"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import {
  Activity,
  BadgeCheck,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import ActivityFeed from "@/components/dashboard/shared/ActivityFeed";
import AIInsightCard from "@/components/dashboard/shared/AIInsightCard";
import MarketPulseCard from "@/components/dashboard/shared/MarketPulseCard";
import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import { Button } from "@/components/ui/button";
import {
  getAdminAgents,
  getAdminAppointments,
  getAdminDashboard,
  getAdminInquiries,
  getAdminProperties,
  getAdminUsers,
  getAuditLogs,
} from "@/services/admin-dashboard.service";
import {
  updateAdminAppointmentStatus,
  updateAdminInquiryPriority,
  updateAdminInquiryStatus,
  updateAgentFeature,
  updateAgentVerification,
  updatePropertyApproval,
  updatePropertyFeature,
  updatePropertyStatus,
  updateUserRole,
  updateUserStatus,
  type PropertyStatus,
  type UserRole,
} from "@/services/admin-actions.service";
import type {
  AdminAgent,
  AdminDashboardResponse,
  AdminUser,
} from "@/types/admin-dashboard";
import type { DashboardActivity, DashboardStat } from "@/types/dashboard";
import type { DashboardPropertySummary } from "@/types/user-dashboard";
import { formatDateTime, formatEnumLabel, formatNumber, safeText } from "@/lib/formatters";
import {
  DashboardEmptyPanel,
  DashboardErrorState,
  DashboardPanelSkeleton,
  DashboardSkeletonGrid,
  MetricCard,
  StatusBadge,
  appointmentPropertyTitle,
  appointmentTimeLabel,
  getUserName,
  getPropertyLocation,
  inquiryPropertyTitle,
  toDashboardProperty,
  useLiveData,
} from "./live-utils";
import ActionMessage from "@/components/shared/ActionMessage";
import { useToast } from "@/context/ToastContext";
import { getActionErrorMessage } from "@/lib/action-feedback";

export function AdminDashboardLive() {
  const loader = useCallback(() => getAdminDashboard(), []);
  const { data, error, isLoading } = useLiveData(loader);

  if (isLoading) {
    return (
      <>
        <DashboardSkeletonGrid />
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_.75fr]">
          <div className="space-y-8">
            <DashboardPanelSkeleton rows={4} />
            <DashboardPanelSkeleton rows={3} />
          </div>
          <aside>
            <DashboardPanelSkeleton rows={2} />
          </aside>
        </div>
      </>
    );
  }

  if (error || !data) {
    return <DashboardErrorState message={error ?? "Admin dashboard unavailable."} />;
  }

  const stats = adminStats(data);
  const approvals = [
    ...(data.pending_agents ?? []).map((agent) => ({
      id: `agent-${agent.id}`,
      title: agentName(agent),
      description: safeText(agent.license_number, "Agent verification"),
      status: agent.verification_status,
      href: "/dashboard/admin/agents",
    })),
    ...(data.pending_properties ?? []).map((property) => ({
      id: `property-${property.id}`,
      title: safeText(property.title, "Premium Property"),
      description: safeText(property.city ?? property.area, "Property approval"),
      status: property.approval_status ?? property.status,
      href: "/dashboard/admin/properties",
    })),
  ];
  const activities = adminActivities(data);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_.75fr]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold">Pending Approvals</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agents and property submissions awaiting review.
                </p>
              </div>
              <Button variant="outline" className="rounded-2xl bg-white" asChild>
                <Link href="/dashboard/admin/properties">View All</Link>
              </Button>
            </div>

            {approvals.length > 0 ? (
              <div className="grid gap-4">
                {approvals.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-[#F8FAF9] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge value={item.status} />
                      <Button size="sm" variant="outline" className="rounded-xl bg-white" asChild>
                        <Link href={item.href}>Review</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardEmptyPanel
                icon={ShieldCheck}
                title="No pending approvals"
                description="Agent verification and property approval queues are currently clear."
              />
            )}
          </div>

          <AdminPlatformMetrics data={data} />
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Admin control layer is connected."
            description="Platform stats, approvals, inquiries, and audit signals now come from live admin APIs."
            action="View Analytics"
            href="/dashboard/admin/analytics"
          />
          <MarketPulseCard />
          <ActivityFeed activities={activities} />
        </aside>
      </div>
    </>
  );
}

export function AdminUsersLive() {
  const loader = useCallback(() => getAdminUsers({ ordering: "-created_at" }), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const [query, setQuery] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const users = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(() => filterUsers(users, query), [users, query]);

  if (isLoading) return <AdminListLoading />;
  if (error) return <DashboardErrorState message={error} />;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard icon={Users} label="Total Users" value={users.length} />
        <MetricCard icon={UserCheck} label="Verified Users" value={users.filter((user) => user.is_verified).length} highlight />
        <MetricCard icon={ShieldCheck} label="Active Accounts" value={users.filter((user) => user.is_active).length} />
        <MetricCard icon={Sparkles} label="Admin Accounts" value={users.filter((user) => user.role === "ADMIN").length} />
      </div>
      <div className="mt-6">
        <ActionMessage message={actionMessage} type={actionType} />
      </div>
      <AdminSearch value={query} onChange={setQuery} placeholder="Search by user, email, phone, or role..." />
      <AdminDirectory
        title="User Directory"
        description="Platform users from the admin API."
        emptyTitle="No users found"
        rows={filtered.map((user) => ({
          id: user.id,
          title: safeText(user.full_name, "Platform User"),
          subtitle: safeText(user.email, "Email unavailable"),
          badges: [user.role, user.is_active ? "ACTIVE" : "INACTIVE", user.is_verified ? "VERIFIED" : "UNVERIFIED"],
          metrics: [
            ["Phone", safeText(user.phone, "Not added")],
            ["Joined", formatDateTime(user.date_joined ?? user.created_at)],
          ],
          actions: [
            {
              label: user.is_active ? "Deactivate" : "Activate",
              confirm: `Update status for ${safeText(user.email, "this user")}?`,
              run: () =>
                runAdminAction(
                  () => updateUserStatus(user.id, !user.is_active),
                  "User status updated successfully.",
                  setActionType,
                  setActionMessage,
                  reload,
                  showToast
                ),
            },
            ...(["USER", "AGENT", "ADMIN"] as UserRole[])
              .filter((role) => role !== user.role)
              .map((role) => ({
                label: `Make ${formatEnumLabel(role)}`,
                confirm: `Change ${safeText(user.email, "this user")} role to ${formatEnumLabel(role)}?`,
                run: () =>
                  runAdminAction(
                    () => updateUserRole(user.id, role),
                    "User role updated successfully.",
                    setActionType,
                    setActionMessage,
                    reload,
                    showToast
                  ),
              })),
          ],
        }))}
      />
    </>
  );
}

export function AdminAgentsLive() {
  const loader = useCallback(() => getAdminAgents({ ordering: "-created_at" }), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const agents = data ?? [];

  if (isLoading) return <AdminListLoading />;
  if (error) return <DashboardErrorState message={error} />;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard icon={BadgeCheck} label="Agents" value={agents.length} />
        <MetricCard icon={ShieldCheck} label="Verified" value={agents.filter((agent) => agent.verification_status === "VERIFIED").length} highlight />
        <MetricCard icon={Sparkles} label="Featured" value={agents.filter((agent) => agent.is_featured).length} />
        <MetricCard icon={Building2} label="Pending" value={agents.filter((agent) => agent.verification_status === "PENDING").length} />
      </div>
      <div className="mt-6">
        <ActionMessage message={actionMessage} type={actionType} />
      </div>
      <AdminDirectory
        title="Agent Directory"
        description="Verification and feature status from the admin agent API."
        emptyTitle="No agents found"
        rows={agents.map((agent) => ({
          id: agent.id,
          title: agentName(agent),
          subtitle: safeText(
            typeof agent.agency === "string" ? agent.agency : agent.agency?.name,
            "Independent agent"
          ),
          badges: [agent.verification_status, agent.is_featured ? "FEATURED" : "STANDARD"],
          metrics: [
            ["License", safeText(agent.license_number, "Pending")],
            ["Rating", safeText(agent.rating, "New")],
          ],
          actions: [
            {
              label: "Verify",
              confirm: `Verify ${agentName(agent)}?`,
              run: () =>
                runAdminAction(
                  () => updateAgentVerification(agent.id, "VERIFIED"),
                  "Agent verification updated successfully.",
                  setActionType,
                  setActionMessage,
                  reload,
                  showToast
                ),
            },
            {
              label: "Reject",
              confirm: `Reject ${agentName(agent)}?`,
              run: () =>
                runAdminAction(
                  () => updateAgentVerification(agent.id, "REJECTED"),
                  "Agent verification updated successfully.",
                  setActionType,
                  setActionMessage,
                  reload,
                  showToast
                ),
            },
            {
              label: "Pending",
              confirm: `Move ${agentName(agent)} back to pending review?`,
              run: () =>
                runAdminAction(
                  () => updateAgentVerification(agent.id, "PENDING"),
                  "Agent verification updated successfully.",
                  setActionType,
                  setActionMessage,
                  reload,
                  showToast
                ),
            },
            {
              label: agent.is_featured ? "Unfeature" : "Feature",
              confirm: `Update featured status for ${agentName(agent)}?`,
              run: () =>
                runAdminAction(
                  () => updateAgentFeature(agent.id, !agent.is_featured),
                  "Agent feature status updated successfully.",
                  setActionType,
                  setActionMessage,
                  reload,
                  showToast
                ),
            },
          ],
        }))}
      />
    </>
  );
}

export function AdminPropertiesLive() {
  const loader = useCallback(() => getAdminProperties({ ordering: "-created_at" }), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const properties = data ?? [];

  if (isLoading) return <AdminListLoading />;
  if (error) return <DashboardErrorState message={error} />;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard icon={Building2} label="Properties" value={properties.length} />
        <MetricCard icon={ClipboardCheck} label="Approved" value={properties.filter((item) => item.approval_status === "APPROVED").length} highlight />
        <MetricCard icon={ShieldCheck} label="Pending" value={properties.filter((item) => item.approval_status === "PENDING").length} />
        <MetricCard icon={Sparkles} label="Featured" value={properties.filter((item) => item.is_featured).length} />
      </div>
      <div className="mt-6">
        <ActionMessage message={actionMessage} type={actionType} />
      </div>
      <div className="mt-8 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold">Property Review Queue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Listings from the admin property API.
            </p>
          </div>
        </div>
        {properties.length > 0 ? (
          <div className="grid gap-4">
            {properties.slice(0, 10).map((item) => (
              <AdminPropertyReviewCard
                key={item.id}
                item={item}
                reload={reload}
                setActionMessage={setActionMessage}
                setActionType={setActionType}
                showToast={showToast}
              />
            ))}
          </div>
        ) : (
          <DashboardEmptyPanel
            icon={Building2}
            title="No properties found"
            description="Property review data will appear here when listings exist."
          />
        )}
      </div>
    </>
  );
}

export function AdminInquiriesLive() {
  const loader = useCallback(() => getAdminInquiries({ ordering: "-created_at" }), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const inquiries = data ?? [];

  if (isLoading) return <AdminListLoading />;
  if (error) return <DashboardErrorState message={error} />;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard icon={MessageCircle} label="Inquiries" value={inquiries.length} />
        <MetricCard icon={Sparkles} label="New" value={inquiries.filter((item) => item.status === "NEW").length} highlight />
        <MetricCard icon={ShieldCheck} label="High Priority" value={inquiries.filter((item) => item.priority === "HIGH").length} />
        <MetricCard icon={Activity} label="Qualified" value={inquiries.filter((item) => item.status === "QUALIFIED").length} />
      </div>
      <div className="mt-6">
        <ActionMessage message={actionMessage} type={actionType} />
      </div>
      <AdminDirectory
        title="Inquiry Monitor"
        description="Platform-wide lead activity from the admin API."
        emptyTitle="No inquiries found"
        rows={inquiries.map((item) => ({
          id: item.id,
          title: inquiryPropertyTitle(item),
          subtitle: safeText(item.full_name ?? item.email, "Lead contact unavailable"),
          badges: [item.status, item.priority, item.source],
          metrics: [
            ["Created", formatDateTime(item.created_at)],
            ["Contact", safeText(item.email ?? item.phone, "No contact")],
            ["Message", safeText(item.message, "No message")],
          ],
          actions: [
            ...(["NEW", "CONTACTED", "QUALIFIED", "NEGOTIATION", "CLOSED", "LOST"] as const)
              .filter((status) => status !== item.status)
              .slice(0, 4)
              .map((status) => ({
                label: formatEnumLabel(status),
                confirm: `Update inquiry status to ${formatEnumLabel(status)}?`,
                run: () =>
                  runAdminAction(
                    () => updateAdminInquiryStatus(item.id, status),
                    "Inquiry status updated successfully.",
                    setActionType,
                    setActionMessage,
                    reload,
                    showToast
                  ),
              })),
            ...(["LOW", "MEDIUM", "HIGH"] as const)
              .filter((priority) => priority !== item.priority)
              .map((priority) => ({
                label: `${formatEnumLabel(priority)} Priority`,
                confirm: `Update inquiry priority to ${formatEnumLabel(priority)}?`,
                run: () =>
                  runAdminAction(
                    () => updateAdminInquiryPriority(item.id, priority),
                    "Inquiry priority updated successfully.",
                    setActionType,
                    setActionMessage,
                    reload,
                    showToast
                  ),
              })),
          ],
        }))}
      />
    </>
  );
}

function AdminPropertyReviewCard({
  item,
  reload,
  setActionMessage,
  setActionType,
  showToast,
}: {
  item: DashboardPropertySummary;
  reload: () => void;
  setActionMessage: (message: string | null) => void;
  setActionType: (type: "success" | "error") => void;
  showToast: (message: string, type?: "success" | "error") => void;
}) {
  const property = toDashboardProperty(item);
  const propertyId = item.id ?? property.id;
  const location = getPropertyLocation(item);
  const approvalStatus = safeText(item.approval_status, "PENDING");
  const listingStatus = safeText(item.status, "DRAFT");
  const statusOptions = (["DRAFT", "PUBLISHED", "SOLD", "RENTED", "ARCHIVED"] as PropertyStatus[])
    .filter((status) => status !== listingStatus)
    .slice(0, 4);

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-border bg-[#F8FAF9] shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[176px_minmax(0,1fr)]">
        <div className="relative h-44 overflow-hidden bg-secondary lg:h-full lg:min-h-[190px]">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 176px"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <StatusBadge value={approvalStatus} />
            {item.is_featured && <StatusBadge value="FEATURED" />}
          </div>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge value={listingStatus} />
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                  {safeText(item.property_type, "Property")}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                  {safeText(item.purpose, "Listing")}
                </span>
              </div>

              <h3 className="mt-3 line-clamp-2 font-heading text-xl font-bold leading-tight">
                {property.title}
              </h3>

              <p className="mt-2 flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary" />
                <span className="line-clamp-1">{location}</span>
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <AdminMiniMetric label="Price" value={property.price} />
                <AdminMiniMetric label="Size" value={property.area} />
                <AdminMiniMetric
                  label="Beds / Baths"
                  value={`${formatNumber(property.beds)} / ${formatNumber(property.baths)}`}
                />
              </div>
            </div>

            <div className="min-w-0 rounded-[1.25rem] border border-border bg-white p-4 shadow-sm">
              <div className="grid gap-4">
                <AdminActionGroup title="Approval">
                  <AdminActionButton
                    label="Approve"
                    tone="primary"
                    confirm={`Approve ${property.title}?`}
                    run={() =>
                      runAdminAction(
                        () => updatePropertyApproval(propertyId, "APPROVED"),
                        "Property approval updated successfully.",
                        setActionType,
                        setActionMessage,
                        reload,
                        showToast
                      )
                    }
                  />
                  <AdminActionButton
                    label="Reject"
                    tone="danger"
                    confirm={`Reject ${property.title}?`}
                    run={() =>
                      runAdminAction(
                        () => updatePropertyApproval(propertyId, "REJECTED"),
                        "Property approval updated successfully.",
                        setActionType,
                        setActionMessage,
                        reload,
                        showToast
                      )
                    }
                  />
                </AdminActionGroup>

                <AdminActionGroup title="Feature">
                  <AdminActionButton
                    label={item.is_featured ? "Unfeature" : "Feature"}
                    confirm={`Update featured status for ${property.title}?`}
                    run={() =>
                      runAdminAction(
                        () => updatePropertyFeature(propertyId, !item.is_featured),
                        "Property feature status updated successfully.",
                        setActionType,
                        setActionMessage,
                        reload,
                        showToast
                      )
                    }
                  />
                </AdminActionGroup>

                <AdminActionGroup title="Status">
                  {statusOptions.map((status) => (
                    <AdminActionButton
                      key={status}
                      label={formatEnumLabel(status)}
                      confirm={`Change ${property.title} status to ${formatEnumLabel(status)}?`}
                      run={() =>
                        runAdminAction(
                          () => updatePropertyStatus(propertyId, status),
                          "Property status updated successfully.",
                          setActionType,
                          setActionMessage,
                          reload,
                          showToast
                        )
                      }
                    />
                  ))}
                </AdminActionGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function AdminAppointmentsLive() {
  const loader = useCallback(() => getAdminAppointments({ ordering: "-appointment_date" }), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const appointments = data ?? [];

  if (isLoading) return <AdminListLoading />;
  if (error) return <DashboardErrorState message={error} />;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard icon={CalendarCheck} label="Appointments" value={appointments.length} />
        <MetricCard icon={ShieldCheck} label="Pending" value={appointments.filter((item) => item.status === "PENDING").length} highlight />
        <MetricCard icon={Sparkles} label="Virtual" value={appointments.filter((item) => item.visit_type === "VIRTUAL").length} />
        <MetricCard icon={Activity} label="Completed" value={appointments.filter((item) => item.status === "COMPLETED").length} />
      </div>
      <div className="mt-6">
        <ActionMessage message={actionMessage} type={actionType} />
      </div>
      <AdminDirectory
        title="Appointment Monitor"
        description="Platform-wide viewing schedule from the admin API."
        emptyTitle="No appointments found"
        rows={appointments.map((item) => ({
          id: item.id,
          title: appointmentPropertyTitle(item),
          subtitle: getUserName(item.user),
          badges: [item.status, item.visit_type],
          metrics: [
            ["Schedule", appointmentTimeLabel(item)],
            ["Notes", safeText(item.notes, "No notes")],
          ],
          actions: (["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"] as const)
            .filter((status) => status !== item.status)
            .slice(0, 5)
            .map((status) => ({
              label: formatEnumLabel(status),
              confirm: `Update appointment status to ${formatEnumLabel(status)}?`,
              run: () =>
                runAdminAction(
                  () => updateAdminAppointmentStatus(item.id, status),
                  "Appointment status updated successfully.",
                  setActionType,
                  setActionMessage,
                  reload,
                  showToast
                ),
            })),
        }))}
      />
    </>
  );
}

export function AdminAuditLogsLive() {
  const loader = useCallback(() => getAuditLogs({ ordering: "-created_at" }), []);
  const { data, error, isLoading } = useLiveData(loader);
  const logs = data ?? [];

  if (isLoading) return <DashboardPanelSkeleton rows={4} />;
  if (error) return <DashboardErrorState message={error} />;

  return (
    <AdminDirectory
      title="Recent Admin Actions"
      description="Audit log entries from the backend control layer."
      emptyTitle="No audit logs yet"
      rows={logs.slice(0, 8).map((log) => ({
        id: log.id,
        title: formatEnumLabel(log.action) || "Admin Action",
        subtitle: safeText(log.description, "No description"),
        badges: [log.target_type],
        metrics: [
          ["Actor", safeText(log.actor?.email ?? log.actor?.full_name, "System")],
          ["Created", formatDateTime(log.created_at)],
          ["Target", safeText(log.target_id, "Not linked")],
        ],
      }))}
    />
  );
}

function AdminPlatformMetrics({ data }: { data: AdminDashboardResponse }) {
  const stats = data.stats ?? {};
  const metrics = [
    ["Published Properties", stats.published_properties, Building2],
    ["Approved Properties", stats.approved_properties, ClipboardCheck],
    ["New Inquiries", stats.new_inquiries, MessageCircle],
    ["Pending Appointments", stats.pending_appointments, CalendarCheck],
  ] as const;

  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Platform Metrics</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Marketplace indicators from the admin dashboard API.
          </p>
        </div>
        <TrendingUp size={22} className="text-primary" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map(([label, value, Icon]) => (
          <div key={label} className="rounded-2xl border border-border bg-[#F8FAF9] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
              <Icon size={20} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-heading text-3xl font-bold">
              {formatNumber(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDirectory({
  title,
  description,
  emptyTitle,
  rows,
}: {
  title: string;
  description: string;
  emptyTitle: string;
  rows: {
    id: string | number;
    title: string;
    subtitle: string;
    badges: (string | null | undefined)[];
    metrics: [string, string | number][];
    actions?: AdminRowAction[];
  }[];
}) {
  return (
    <div className="mt-8 rounded-[2rem] border border-border bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h2 className="font-heading text-2xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <DashboardActionDrawer
          actionType="review_approval"
          title={`${title} action`}
          description="Record operational review notes while table actions update the live admin API."
          triggerLabel="Review Rules"
          submitLabel="Save Notes"
          buttonClassName="rounded-2xl"
          fields={[
            { name: "status", label: "Status", placeholder: "Review status" },
            { name: "notes", label: "Admin Notes", placeholder: "Notes...", type: "textarea" },
          ]}
        />
      </div>

      {rows.length > 0 ? (
        <div className="grid gap-4">
          {rows.map((row) => (
            <div
              key={row.id}
              className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-4 sm:p-5"
            >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] xl:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="min-w-0 truncate font-heading text-xl font-bold">
                      {row.title}
                    </h3>
                    {row.badges.filter(Boolean).slice(0, 3).map((badge) => (
                      <StatusBadge key={badge} value={badge} />
                    ))}
                  </div>
                  <p className="mt-2 truncate text-sm text-muted-foreground">
                    {row.subtitle}
                  </p>
                </div>
                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {row.metrics.slice(0, 2).map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="mt-1 line-clamp-2 break-words font-heading text-base font-bold leading-snug">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {row.actions && row.actions.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                  {row.actions.map((action) => (
                    <AdminActionButton key={action.label} {...action} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyPanel
          icon={ShieldCheck}
          title={emptyTitle}
          description="No matching backend records are available for this admin view."
        />
      )}
    </div>
  );
}

interface AdminRowAction {
  label: string;
  confirm: string;
  run: () => Promise<void>;
  tone?: "default" | "primary" | "danger";
}

function AdminActionButton({ label, confirm, run, tone = "default" }: AdminRowAction) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleRun() {
    setLoading(true);
    try {
      await run();
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant={tone === "primary" ? "default" : "outline"}
        className={`rounded-xl ${
          tone === "danger"
            ? "border-red-100 bg-white text-red-700 hover:bg-red-50"
            : tone === "primary"
              ? ""
              : "bg-white"
        }`}
        disabled={loading}
        onClick={() => setConfirmOpen(true)}
      >
        {loading ? "Updating..." : label}
      </Button>

      {confirmOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[2rem] border border-border bg-white p-5 shadow-2xl shadow-slate-950/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
              <ShieldCheck size={22} />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-bold">
              Confirm admin action
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {confirm}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                className="rounded-2xl"
                disabled={loading}
                onClick={handleRun}
              >
                {loading ? "Updating..." : "Confirm"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl bg-white"
                disabled={loading}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AdminMiniMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-heading text-base font-bold">{value}</p>
    </div>
  );
}

function AdminActionGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

async function runAdminAction(
  action: () => Promise<unknown>,
  successMessage: string,
  setActionType: (type: "success" | "error") => void,
  setActionMessage: (message: string | null) => void,
  reload: () => void,
  showToast?: (message: string, type?: "success" | "error") => void
) {
  try {
    await action();
    setActionType("success");
    setActionMessage(successMessage);
    showToast?.(successMessage);
    reload();
  } catch (error) {
    const errorMessage = getActionErrorMessage(error);
    setActionType("error");
    setActionMessage(errorMessage);
    showToast?.(errorMessage, "error");
  }
}

function AdminSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mt-8 rounded-[2rem] border border-border bg-white p-5 shadow-sm">
      <div className="rounded-2xl border border-border bg-[#F8FAF9] p-4">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Search
        </label>
        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
          <Search size={20} className="shrink-0 text-primary" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            placeholder={placeholder}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8FAF9] text-muted-foreground transition hover:text-primary"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminListLoading() {
  return (
    <>
      <DashboardSkeletonGrid count={4} />
      <div className="mt-8">
        <DashboardPanelSkeleton rows={4} />
      </div>
    </>
  );
}

function filterUsers(users: AdminUser[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return users;

  return users.filter((user) =>
    [user.full_name, user.email, user.phone, user.role]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

function agentName(agent: AdminAgent) {
  return safeText(agent.full_name ?? agent.user?.full_name, "Verified Agent");
}

function adminStats(data: AdminDashboardResponse): DashboardStat[] {
  const stats = data.stats ?? {};

  return [
    {
      title: "Total Users",
      value: formatNumber(stats.total_users),
      change: "Platform accounts",
      trend: "neutral",
      icon: Users,
    },
    {
      title: "Properties",
      value: formatNumber(stats.total_properties),
      change: `${formatNumber(stats.pending_properties)} pending`,
      trend: "neutral",
      icon: Building2,
    },
    {
      title: "Inquiries",
      value: formatNumber(stats.total_inquiries),
      change: `${formatNumber(stats.new_inquiries)} new`,
      trend: "up",
      icon: MessageCircle,
    },
    {
      title: "Appointments",
      value: formatNumber(stats.total_appointments),
      change: `${formatNumber(stats.pending_appointments)} pending`,
      trend: "neutral",
      icon: CalendarCheck,
    },
  ];
}

function adminActivities(data: AdminDashboardResponse): DashboardActivity[] {
  const inquiries = (data.recent_inquiries ?? []).slice(0, 3).map((item) => ({
    id: `inquiry-${item.id}`,
    title: `Inquiry: ${inquiryPropertyTitle(item)}`,
    description: safeText(item.full_name ?? item.email, "New lead"),
    time: formatDateTime(item.created_at),
    type: "inquiry" as const,
  }));

  const appointments = (data.upcoming_appointments ?? []).slice(0, 2).map((item) => ({
    id: `appointment-${item.id}`,
    title: `Appointment: ${appointmentPropertyTitle(item)}`,
    description: appointmentTimeLabel(item),
    time: formatDateTime(item.created_at),
    type: "appointment" as const,
  }));

  const users = (data.recent_users ?? []).slice(0, 2).map((item) => ({
    id: `user-${item.id}`,
    title: `User: ${safeText(item.full_name, "Platform User")}`,
    description: safeText(item.email, "New account"),
    time: formatDateTime(item.created_at ?? item.date_joined),
    type: "system" as const,
  }));

  const activities = [...inquiries, ...appointments, ...users];

  if (activities.length > 0) {
    return activities;
  }

  return [
    {
      id: "admin-live",
      title: "Admin APIs connected",
      description: "Recent platform actions will appear here.",
      time: "Now",
      type: "system",
    },
  ];
}
