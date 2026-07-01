"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  Building2,
  CalendarCheck,
  Clock,
  Home,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";

import ActivityFeed from "@/components/dashboard/shared/ActivityFeed";
import AIInsightCard from "@/components/dashboard/shared/AIInsightCard";
import MarketPulseCard from "@/components/dashboard/shared/MarketPulseCard";
import AIBadge from "@/components/ai/AIBadge";
import AIScoreCard from "@/components/ai/AIScoreCard";
import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import RecommendedPropertyCard from "@/components/dashboard/user/RecommendedPropertyCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import {
  getAgentAppointments,
  getAgentDashboard,
  getAgentInquiries,
} from "@/services/agent-dashboard.service";
import { getLeadPriority, getListingQuality } from "@/services/ai.service";
import {
  updateAppointmentStatus,
  type AppointmentStatus,
} from "@/services/appointment.service";
import {
  updateInquiryStatus,
  type InquiryStatus,
} from "@/services/inquiry.service";
import type { AgentDashboardResponse } from "@/types/agent-dashboard";
import type { DashboardActivity, DashboardStat } from "@/types/dashboard";
import type {
  DashboardAppointment,
  DashboardInquiry,
} from "@/types/user-dashboard";
import { formatDateTime, formatEnumLabel, formatNumber, safeText } from "@/lib/formatters";
import {
  DashboardEmptyPanel,
  DashboardErrorState,
  DashboardUnauthorizedState,
  DashboardPanelSkeleton,
  DashboardSkeletonGrid,
  AgentProfileSetupState,
  MetricCard,
  StatusBadge,
  appointmentPropertyTitle,
  appointmentTimeLabel,
  getUserName,
  inquiryPropertyTitle,
  toDashboardProperty,
  useLiveData,
} from "./live-utils";
import { InquiryCard } from "./UserDashboardViews";
import ActionMessage from "@/components/shared/ActionMessage";
import { getActionErrorMessage } from "@/lib/action-feedback";

export function AgentDashboardLive() {
  const loader = useCallback(() => getAgentDashboard(), []);
  const { data, error, errorStatus, isLoading } = useLiveData(loader);

  if (isLoading) {
    return (
      <>
        <DashboardSkeletonGrid />
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_.75fr]">
          <div className="space-y-8">
            <DashboardPanelSkeleton rows={3} />
            <DashboardPanelSkeleton rows={3} />
          </div>
          <aside>
            <DashboardPanelSkeleton rows={2} />
          </aside>
        </div>
      </>
    );
  }

  if (errorStatus === 404) {
    return <AgentProfileSetupState />;
  }

  if (errorStatus === 403) {
    return <DashboardUnauthorizedState />;
  }

  if (error || !data) {
    return <DashboardErrorState message={error ?? "Agent dashboard unavailable."} />;
  }

  const stats = agentStats(data);
  const inquiries = data.recent_inquiries ?? [];
  const appointments = data.upcoming_appointments ?? [];
  const topProperties = (data.top_properties ?? []).map(toDashboardProperty);
  const activities = agentActivities(data);

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Button className="rounded-2xl" asChild>
          <Link href="/dashboard/agent/listings">
            <Plus size={18} className="mr-2" />
            Add New Listing
          </Link>
        </Button>
        <Button variant="outline" className="rounded-2xl bg-white" asChild>
          <Link href="/dashboard/agent/inquiries">
            <MessageCircle size={18} className="mr-2" />
            View Inquiries
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_.75fr]">
        <div className="space-y-8">
          <AgentInquiryPanel inquiries={inquiries} compact />
          <AgentListingPanel properties={topProperties} />
          <AgentAppointmentPanel appointments={appointments} compact />
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Lead workspace is connected."
            description="Agent inquiries, appointments, and top properties now come from the authenticated Django APIs."
            action="View Lead Insights"
            href="/dashboard/agent/analytics"
          />
          <MarketPulseCard />
          <ActivityFeed activities={activities} />
        </aside>
      </div>
    </>
  );
}

export function AgentInquiriesLive() {
  const loader = useCallback(() => getAgentInquiries(), []);
  const { data, error, errorStatus, isLoading, reload } = useLiveData(loader);
  const [query, setQuery] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const inquiries = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(() => filterAgentInquiries(inquiries, query), [inquiries, query]);

  if (isLoading) {
    return (
      <>
        <DashboardSkeletonGrid count={3} />
        <div className="mt-8">
          <DashboardPanelSkeleton rows={4} />
        </div>
      </>
    );
  }

  if (errorStatus === 404) {
    return <AgentProfileSetupState />;
  }

  if (errorStatus === 403) {
    return <DashboardUnauthorizedState />;
  }

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard icon={MessageCircle} label="Total Leads" value={inquiries.length} />
        <MetricCard
          icon={UserCheck}
          label="Contacted"
          value={inquiries.filter((item) => item.status === "CONTACTED").length}
          highlight
        />
        <MetricCard icon={Sparkles} label="High Priority" value={inquiries.filter((item) => item.priority === "HIGH").length} />
      </div>

      <AgentSearch value={query} onChange={setQuery} placeholder="Search by client, property, status, or priority..." />

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div>
          <ActionMessage message={actionMessage} type={actionType} />
          <div className="mt-4">
            <AgentInquiryPanel
              inquiries={filtered}
              onStatusChange={async (id, status) => {
                try {
                  await updateInquiryStatus(id, status);
                  setActionType("success");
                  setActionMessage("Inquiry status updated successfully.");
                  showToast("Inquiry status updated successfully.");
                  reload();
                } catch (error) {
                  const errorMessage = getActionErrorMessage(error);
                  setActionType("error");
                  setActionMessage(errorMessage);
                  showToast(errorMessage, "error");
                }
              }}
            />
          </div>
        </div>
        <aside className="space-y-8">
          <AIInsightCard
            title="Lead list is live."
            description="Only inquiries for this authenticated agent's properties are shown."
            action="Schedule Viewing"
            href="/dashboard/agent/appointments"
          />
          <MarketPulseCard />
        </aside>
      </div>
    </>
  );
}

export function AgentAppointmentsLive() {
  const loader = useCallback(() => getAgentAppointments(), []);
  const { data, error, errorStatus, isLoading, reload } = useLiveData(loader);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const { showToast } = useToast();
  const appointments = data ?? [];

  if (isLoading) {
    return (
      <>
        <DashboardSkeletonGrid count={3} />
        <div className="mt-8">
          <DashboardPanelSkeleton rows={4} />
        </div>
      </>
    );
  }

  if (errorStatus === 404) {
    return <AgentProfileSetupState />;
  }

  if (errorStatus === 403) {
    return <DashboardUnauthorizedState />;
  }

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard icon={CalendarCheck} label="Appointments" value={appointments.length} />
        <MetricCard
          icon={Clock}
          label="Pending"
          value={appointments.filter((item) => item.status === "PENDING").length}
          highlight
        />
        <MetricCard icon={Sparkles} label="Virtual Tours" value={appointments.filter((item) => item.visit_type === "VIRTUAL").length} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div>
          <ActionMessage message={actionMessage} type={actionType} />
          <div className="mt-4">
            <AgentAppointmentPanel
              appointments={appointments}
              onStatusChange={async (id, status) => {
                try {
                  await updateAppointmentStatus(id, status);
                  setActionType("success");
                  setActionMessage("Appointment status updated successfully.");
                  showToast("Appointment status updated successfully.");
                  reload();
                } catch (error) {
                  const errorMessage = getActionErrorMessage(error);
                  setActionType("error");
                  setActionMessage(errorMessage);
                  showToast(errorMessage, "error");
                }
              }}
            />
          </div>
        </div>
        <aside className="space-y-8">
          <AIInsightCard
            title="Viewing schedule is live."
            description="Agent appointment data now comes from the backend viewing workflow."
            action="Review Leads"
            href="/dashboard/agent/inquiries"
          />
          <MarketPulseCard />
        </aside>
      </div>
    </>
  );
}

export function AgentListingsLive() {
  const loader = useCallback(() => getAgentDashboard(), []);
  const { data, error, errorStatus, isLoading } = useLiveData(loader);
  const properties = useMemo(
    () => (data?.top_properties ?? []).map(toDashboardProperty),
    [data]
  );

  if (isLoading) {
    return <DashboardPanelSkeleton rows={4} />;
  }

  if (errorStatus === 404) {
    return <AgentProfileSetupState />;
  }

  if (errorStatus === 403) {
    return <DashboardUnauthorizedState />;
  }

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  return <AgentListingPanel properties={properties} full />;
}

function AgentInquiryPanel({
  inquiries,
  compact,
  onStatusChange,
}: {
  inquiries: DashboardInquiry[];
  compact?: boolean;
  onStatusChange?: (id: string | number, status: InquiryStatus) => Promise<void>;
}) {
  const rows = compact ? inquiries.slice(0, 4) : inquiries;

  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-2xl font-bold">Lead Pipeline</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Buyer and tenant inquiries from your property listings.
          </p>
        </div>
        {compact && (
          <Button variant="outline" className="rounded-2xl bg-white" asChild>
            <Link href="/dashboard/agent/inquiries">View All</Link>
          </Button>
        )}
      </div>

      {rows.length > 0 ? (
        <div className="grid gap-5">
          {rows.map((inquiry) => (
            <div key={inquiry.id} className="space-y-3">
              <InquiryCard item={inquiry} perspective="agent" />
              {!compact && <LeadPrioritySignal inquiryId={inquiry.id} />}
              {!compact && <AgentInquiryContactDetails inquiry={inquiry} />}
              {onStatusChange && (
                <AgentStatusActions
                  id={inquiry.id}
                  currentStatus={inquiry.status}
                  actions={[
                    ["NEW", "New"],
                    ["CONTACTED", "Mark Contacted"],
                    ["QUALIFIED", "Qualify"],
                    ["NEGOTIATION", "Negotiation"],
                    ["CLOSED", "Close"],
                    ["LOST", "Lost"],
                  ]}
                  onStatusChange={onStatusChange}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyPanel
          icon={MessageCircle}
          title="No active leads"
          description="New buyer and tenant inquiries will appear here once users submit property inquiries."
        />
      )}
    </div>
  );
}

function AgentAppointmentPanel({
  appointments,
  compact,
  onStatusChange,
}: {
  appointments: DashboardAppointment[];
  compact?: boolean;
  onStatusChange?: (id: string | number, status: AppointmentStatus) => Promise<void>;
}) {
  const rows = compact ? appointments.slice(0, 3) : appointments;

  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Upcoming Viewings</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Confirmed and requested property appointments.
          </p>
        </div>
        <CalendarCheck size={22} className="text-primary" />
      </div>

      {rows.length > 0 ? (
        <div className="grid gap-4">
          {rows.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="truncate font-heading text-xl font-bold">
                      {appointmentPropertyTitle(appointment)}
                    </h3>
                    <StatusBadge value={appointment.status} />
                    <StatusBadge value={appointment.visit_type} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Client: {getUserName(appointment.user)}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {getUserEmail(appointment.user)}
                  </p>
                  {appointment.notes && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {appointment.notes}
                    </p>
                  )}
                </div>
                <div className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-primary shadow-sm">
                  {appointmentTimeLabel(appointment)}
                </div>
              </div>

              {onStatusChange && (
                <AgentStatusActions
                  id={appointment.id}
                  currentStatus={appointment.status}
                  actions={[
                    ["PENDING", "Pending"],
                    ["CONFIRMED", "Confirm"],
                    ["COMPLETED", "Complete"],
                    ["CANCELLED", "Cancel"],
                    ["RESCHEDULED", "Reschedule"],
                    ["NO_SHOW", "No Show"],
                  ]}
                  onStatusChange={onStatusChange}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyPanel
          icon={CalendarCheck}
          title="No appointments yet"
          description="Viewing requests for your listings will appear here."
        />
      )}
    </div>
  );
}

function AgentInquiryContactDetails({ inquiry }: { inquiry: DashboardInquiry }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border bg-white p-4 text-sm sm:grid-cols-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Client
        </p>
        <p className="mt-1 truncate font-semibold">
          {safeText(inquiry.full_name ?? getUserName(inquiry.user), "Client")}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Email
        </p>
        <p className="mt-1 truncate font-semibold">
          {safeText(inquiry.email ?? getUserEmail(inquiry.user), "Email not provided")}
        </p>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Phone
        </p>
        <p className="mt-1 truncate font-semibold">
          {safeText(inquiry.phone, "Phone not provided")}
        </p>
      </div>
    </div>
  );
}

function LeadPrioritySignal({ inquiryId }: { inquiryId: string | number }) {
  const loader = useCallback(() => getLeadPriority(inquiryId), [inquiryId]);
  const { data, error, isLoading } = useLiveData(loader);

  if (error) {
    return null;
  }

  const priority = data?.priority ?? "AI";
  const priorityTone =
    priority === "HIGH" ? "gold" : priority === "MEDIUM" ? "emerald" : "soft";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <AIBadge label={`${formatEnumLabel(priority)} Priority`} tone={priorityTone} />
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading
            ? "Calculating rule-based lead signal..."
            : data?.summary ?? "Lead signal unavailable."}
        </p>
      </div>
      <div className="shrink-0 rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
        <p className="font-heading text-2xl font-bold text-primary">
          {isLoading ? "--" : data?.score ?? 0}
        </p>
        <p className="text-xs text-muted-foreground">
          Lead Score
        </p>
      </div>
    </div>
  );
}

function ListingQualitySignal({ slug }: { slug: string }) {
  const loader = useCallback(() => getListingQuality(slug), [slug]);
  const { data, error, isLoading } = useLiveData(loader);

  if (error) {
    return null;
  }

  return (
    <AIScoreCard
      title="Listing Quality"
      label="Listing Quality"
      compact
      loading={isLoading}
      score={data?.score ?? 0}
      summary={
        isLoading
          ? "Checking listing completeness..."
          : data?.summary ?? "Listing quality signal unavailable."
      }
      className="shadow-none"
      footer={
        data?.suggestions?.length ? (
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
            {data.suggestions[0]}
          </p>
        ) : null
      }
    />
  );
}

function AgentStatusActions<TStatus extends string>({
  id,
  currentStatus,
  actions,
  onStatusChange,
}: {
  id: string | number;
  currentStatus?: string | null;
  actions: [TStatus, string][];
  onStatusChange: (id: string | number, status: TStatus) => Promise<void>;
}) {
  const [loading, setLoading] = useState<TStatus | null>(null);
  const normalizedCurrentStatus = safeText(currentStatus, "").toUpperCase();

  async function handleStatusChange(status: TStatus) {
    setLoading(status);
    try {
      await onStatusChange(id, status);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-w-0 rounded-2xl border border-border bg-white p-3">
      <label className="block sm:hidden">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Update status
        </span>
        <select
          value={normalizedCurrentStatus}
          disabled={Boolean(loading)}
          onChange={(event) => handleStatusChange(event.target.value as TStatus)}
          className="h-11 w-full min-w-0 rounded-xl border border-border bg-[#F8FAF9] px-3 text-sm font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-emerald-100"
        >
          {actions.map(([status, label]) => (
            <option key={status} value={status}>
              {loading === status ? "Updating..." : label}
            </option>
          ))}
        </select>
      </label>

      <div className="hidden min-w-0 flex-wrap gap-2 sm:flex">
        {actions.map(([status, label]) => {
          const isCurrent = normalizedCurrentStatus === status;

          return (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={isCurrent ? "default" : "outline"}
              className={`min-w-0 rounded-xl ${isCurrent ? "" : "bg-white"}`}
              disabled={Boolean(loading) || isCurrent}
              onClick={() => handleStatusChange(status)}
            >
              {loading === status ? "Updating..." : label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function AgentListingPanel({
  properties,
  full,
}: {
  properties: ReturnType<typeof toDashboardProperty>[];
  full?: boolean;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-heading text-2xl font-bold">
            {full ? "Agent Listings" : "Top Properties"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {full
              ? "A live listing endpoint is not available yet, so this page uses the dashboard top properties response."
              : "Top listing performance from the agent dashboard API."}
          </p>
        </div>
        <DashboardActionDrawer
          actionType="add_listing"
          title="Add listing"
          description="Prepare a listing draft. The real create listing endpoint can connect in the next backend phase."
          triggerLabel="Add Listing"
          submitLabel="Save Draft"
          icon={<Plus size={18} className="mr-2" />}
          buttonClassName="rounded-2xl"
          fields={[
            { name: "title", label: "Title", placeholder: "Palm Jumeirah Signature Villa" },
            { name: "price", label: "Price", placeholder: "AED 8,500,000" },
            { name: "notes", label: "Notes", placeholder: "Property details...", type: "textarea" },
          ]}
        />
      </div>

      {properties.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {properties.slice(0, full ? properties.length : 4).map((property) => (
            <div key={property.id} className="space-y-3">
              <RecommendedPropertyCard property={property} />
              <ListingQualitySignal slug={property.slug} />
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyPanel
          icon={Home}
          title="No listing endpoint connected"
          description="The backend currently exposes top properties on the dashboard response. A dedicated agent listing API can be added later."
        />
      )}
    </div>
  );
}

function AgentSearch({
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
          Search leads
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

function filterAgentInquiries(inquiries: DashboardInquiry[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return inquiries;
  }

  return inquiries.filter((item) =>
    [
      item.full_name,
      item.email,
      item.phone,
      getUserName(item.user),
      getUserEmail(item.user),
      inquiryPropertyTitle(item),
      item.status,
      item.priority,
      item.message,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

function getUserEmail(value: DashboardInquiry["user"] | DashboardAppointment["user"] | null | undefined) {
  if (!value || typeof value === "string") {
    return "Email not provided";
  }

  return safeText(value.email, "Email not provided");
}

function agentStats(data: AgentDashboardResponse): DashboardStat[] {
  const stats = data.stats ?? {};

  return [
    {
      title: "Total Listings",
      value: formatNumber(stats.total_listings),
      change: "Agent properties",
      trend: "neutral",
      icon: Building2,
    },
    {
      title: "Published",
      value: formatNumber(stats.published_listings),
      change: "Live listings",
      trend: "neutral",
      icon: Home,
    },
    {
      title: "Total Inquiries",
      value: formatNumber(stats.total_inquiries),
      change: `${formatNumber(stats.new_inquiries)} new`,
      trend: "up",
      icon: MessageCircle,
    },
    {
      title: "Appointments",
      value: formatNumber(stats.appointments),
      change: `${formatNumber(stats.pending_appointments)} pending`,
      trend: "neutral",
      icon: CalendarCheck,
    },
  ];
}

function agentActivities(data: AgentDashboardResponse): DashboardActivity[] {
  const inquiries = (data.recent_inquiries ?? []).slice(0, 3).map((item) => ({
    id: `inquiry-${item.id}`,
    title: `Lead: ${safeText(item.full_name ?? item.email, "Client")}`,
    description: `${formatEnumLabel(item.status) || "Inquiry"} for ${inquiryPropertyTitle(item)}`,
    time: formatDateTime(item.created_at),
    type: "inquiry" as const,
  }));

  const appointments = (data.upcoming_appointments ?? []).slice(0, 2).map((item) => ({
    id: `appointment-${item.id}`,
    title: `Viewing: ${appointmentPropertyTitle(item)}`,
    description: appointmentTimeLabel(item),
    time: formatDateTime(item.created_at),
    type: "appointment" as const,
  }));

  const activities = [...inquiries, ...appointments];

  if (activities.length > 0) {
    return activities;
  }

  return [
    {
      id: "agent-live",
      title: "Agent APIs connected",
      description: "Recent leads and appointments will appear here.",
      time: "Now",
      type: "system",
    },
  ];
}
