"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Heart,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Video,
  X,
} from "lucide-react";

import ActivityFeed from "@/components/dashboard/shared/ActivityFeed";
import AIInsightCard from "@/components/dashboard/shared/AIInsightCard";
import MarketPulseCard from "@/components/dashboard/shared/MarketPulseCard";
import DashboardActionDrawer from "@/components/dashboard/shared/DashboardActionDrawer";
import DashboardStatCard from "@/components/dashboard/shared/DashboardStatCard";
import RecommendedPropertyCard from "@/components/dashboard/user/RecommendedPropertyCard";
import SavedPropertiesExplorer from "@/components/dashboard/user/SavedPropertiesExplorer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { cancelAppointment } from "@/services/appointment.service";
import { unsaveProperty } from "@/services/property-actions.service";
import {
  getSavedProperties,
  getUserAppointments,
  getUserDashboard,
  getUserInquiries,
} from "@/services/user-dashboard.service";
import type { DashboardActivity, DashboardStat } from "@/types/dashboard";
import type {
  DashboardAppointment,
  DashboardInquiry,
  UserDashboardResponse,
} from "@/types/user-dashboard";
import {
  DashboardEmptyPanel,
  DashboardErrorState,
  DashboardPanelSkeleton,
  DashboardSkeletonGrid,
  MetricCard,
  StatusBadge,
  appointmentPropertyTitle,
  appointmentTimeLabel,
  getAgentName,
  inquiryPropertyTitle,
  toDashboardProperty,
  useLiveData,
} from "./live-utils";
import ActionMessage from "@/components/shared/ActionMessage";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { formatDateTime, formatEnumLabel, formatNumber, safeText } from "@/lib/formatters";

export function UserDashboardLive() {
  const loader = useCallback(() => getUserDashboard(), []);
  const { data, error, isLoading } = useLiveData(loader);

  if (isLoading) {
    return (
      <>
        <DashboardSkeletonGrid />
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_.75fr]">
          <div className="space-y-8">
            <DashboardPanelSkeleton rows={2} />
            <DashboardPanelSkeleton rows={2} />
          </div>
          <aside className="space-y-8">
            <DashboardPanelSkeleton rows={2} />
          </aside>
        </div>
      </>
    );
  }

  if (error || !data) {
    return <DashboardErrorState message={error ?? undefined} />;
  }

  const stats = userStats(data);
  const recommendations = (data.recommendation_preview ?? []).map(toDashboardProperty);
  const appointments = data.upcoming_appointments ?? [];
  const activities = userActivities(data);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard key={stat.title} stat={stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.45fr_.75fr]">
        <div className="space-y-8">
          <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  AI Recommended Properties
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ranked from backend-ready property signals until AI matching is connected.
                </p>
              </div>

              <Button variant="outline" className="rounded-2xl" asChild>
                <Link href="/dashboard/user/recommendations">
                  <Sparkles size={18} className="mr-2" />
                  View All
                </Link>
              </Button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {recommendations.slice(0, 4).map((property) => (
                  <RecommendedPropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <DashboardEmptyPanel
                icon={Sparkles}
                title="No recommendations yet"
                description="Featured and saved-area recommendations will appear here as backend data grows."
              />
            )}
          </div>

          <UserAppointmentPanel appointments={appointments} compact />
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Your dashboard is live."
            description="Saved properties, inquiries, appointments, and notifications now come from the Django API."
            action="Analyze Market"
            href="/insights"
          />

          <MarketPulseCard />

          <ActivityFeed activities={activities} />
        </aside>
      </div>
    </>
  );
}

export function UserSavedPropertiesLive() {
  const loader = useCallback(() => getSavedProperties(), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const { showToast } = useToast();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");
  const properties = useMemo(() => (data ?? []).map(toDashboardProperty), [data]);

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

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard icon={Heart} label="Saved Listings" value={properties.length} />
        <MetricCard icon={Sparkles} label="Best AI Match" value={properties.length ? "96%" : "0%"} highlight />
        <MetricCard
          icon={SlidersHorizontal}
          label="Compared Areas"
          value={new Set(properties.map((property) => property.location)).size}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
        <div>
          <div className="mt-8">
            <ActionMessage message={actionMessage} type={actionType} />
          </div>
          {properties.length > 0 ? (
            <SavedPropertiesExplorer
              properties={properties}
              onRemove={async (property) => {
                try {
                  await unsaveProperty(property.slug);
                  setActionType("success");
                  setActionMessage("Property removed from saved list.");
                  showToast("Property removed from saved list.");
                  reload();
                } catch (error) {
                  const errorMessage = getActionErrorMessage(error);
                  setActionType("error");
                  setActionMessage(errorMessage);
                  showToast(errorMessage, "error");
                }
              }}
            />
          ) : (
            <div className="mt-8 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
              <DashboardEmptyPanel
                icon={Heart}
                title="No saved properties yet"
                description="Save listings from the public property pages and they will appear here."
              />
            </div>
          )}
        </div>

        <aside className="mt-8 space-y-8">
          <AIInsightCard
            title="Saved collection is backend-ready."
            description="This page is now reading your authenticated saved properties from Django."
            action="Compare Saved"
            href="/dashboard/user/recommendations"
          />
          <MarketPulseCard />
        </aside>
      </div>
    </>
  );
}

export function UserInquiriesLive() {
  const loader = useCallback(() => getUserInquiries(), []);
  const { data, error, isLoading } = useLiveData(loader);
  const [query, setQuery] = useState("");
  const inquiries = data ?? [];
  const filtered = filterInquiries(inquiries, query);

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

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard icon={MessageCircle} label="Active Inquiries" value={inquiries.length} />
        <MetricCard
          icon={CheckCircle2}
          label="Agent Replies"
          value={inquiries.filter((item) => item.status && item.status !== "NEW").length}
          highlight
        />
        <MetricCard icon={Sparkles} label="AI Priority" value={inquiries.some((item) => item.priority === "HIGH") ? "High" : "Normal"} />
      </div>

      <SearchBlock
        label="Search Inquiries"
        value={query}
        onChange={setQuery}
        placeholder="Search by property, agent, priority, or status..."
      />

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold">Inquiry Pipeline</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your latest conversations with verified agents.
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4">
              {filtered.map((item) => (
                <InquiryCard key={item.id} item={item} perspective="user" />
              ))}
            </div>
          ) : (
            <DashboardEmptyPanel
              icon={MessageCircle}
              title={query ? "No matching inquiries" : "No active inquiries"}
              description="Property inquiries submitted from the website will appear here."
            />
          )}
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Lead history is connected."
            description="Inquiry status, priority, and contact details are now pulled from the backend workflow layer."
            action="View Appointments"
            href="/dashboard/user/appointments"
          />
          <MarketPulseCard />
        </aside>
      </div>
    </>
  );
}

export function UserAppointmentsLive() {
  const loader = useCallback(() => getUserAppointments(), []);
  const { data, error, isLoading, reload } = useLiveData(loader);
  const { showToast } = useToast();
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"success" | "error">("success");

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

  if (error) {
    return <DashboardErrorState message={error} />;
  }

  const appointments = data ?? [];

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard icon={CalendarCheck} label="Upcoming Viewings" value={appointments.length} />
        <MetricCard
          icon={Video}
          label="Virtual Tours"
          value={appointments.filter((item) => item.visit_type === "VIRTUAL").length}
          highlight
        />
        <MetricCard icon={Sparkles} label="AI Scheduling Score" value={appointments.length ? "94%" : "0%"} />
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div>
          <ActionMessage message={actionMessage} type={actionType} />
          <div className="mt-4">
            <UserAppointmentPanel
              appointments={appointments}
              onCancel={async (appointment) => {
                try {
                  await cancelAppointment(appointment.id);
                  setActionType("success");
                  setActionMessage("Appointment cancelled.");
                  showToast("Appointment cancelled.");
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
            title="Viewing calendar is live."
            description="Your appointment list now reflects authenticated backend viewing requests."
            action="Review Matches"
            href="/dashboard/user/recommendations"
          />
          <MarketPulseCard />
        </aside>
      </div>
    </>
  );
}

function UserAppointmentPanel({
  appointments,
  compact,
  onCancel,
}: {
  appointments: DashboardAppointment[];
  compact?: boolean;
  onCancel?: (appointment: DashboardAppointment) => Promise<void>;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Upcoming Appointments</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Scheduled property visits and virtual tours.
          </p>
        </div>
        <CalendarCheck size={22} className="text-primary" />
      </div>

      {appointments.length > 0 ? (
        <div className="grid gap-5">
          {appointments.slice(0, compact ? 3 : appointments.length).map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={onCancel}
            />
          ))}
        </div>
      ) : (
        <DashboardEmptyPanel
          icon={CalendarCheck}
          title="No appointments scheduled"
          description="Viewing requests and confirmed tours will appear here once appointments are created."
        />
      )}
    </div>
  );
}

export function InquiryCard({
  item,
  perspective,
}: {
  item: DashboardInquiry;
  perspective: "user" | "agent";
}) {
  const property = inquiryPropertyTitle(item);
  const contact = perspective === "agent" ? safeText(item.full_name ?? item.email, "Client") : getAgentName(item.agent);

  return (
    <div className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="min-w-0 truncate font-heading text-xl font-bold">
              {perspective === "agent" ? contact : property}
            </h3>
            <StatusBadge value={item.priority} />
            <StatusBadge value={item.status} />
          </div>
          <p className="mt-2 truncate text-sm text-muted-foreground">
            {perspective === "agent" ? `Interested in ${property}` : `Agent: ${contact}`}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={15} />
            {formatEnumLabel(item.source) || "Inquiry"} · {formatDateTime(item.created_at)}
          </div>
          {item.message && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {item.message}
            </p>
          )}
        </div>

        <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <DashboardActionDrawer
            actionType="reply_inquiry"
            title={`Reply about ${property}`}
            description="Draft a frontend note for this live inquiry. Backend messaging can connect in the next action phase."
            triggerLabel={perspective === "agent" ? "Reply" : "Open Chat"}
            submitLabel="Save Reply"
            buttonSize="sm"
            buttonClassName="rounded-xl"
            fields={[
              {
                name: "message",
                label: "Message",
                placeholder: `Write a response about ${property}...`,
                type: "textarea",
              },
            ]}
          />
          <DashboardActionDrawer
            actionType="schedule_viewing"
            title={`Schedule ${property}`}
            description="Prepare a viewing request. API action wiring is intentionally left for the next phase."
            triggerLabel="Schedule"
            submitLabel="Save Viewing"
            buttonSize="sm"
            buttonVariant="outline"
            buttonClassName="rounded-xl bg-white"
            fields={[
              { name: "date", label: "Date", placeholder: "Jul 1, 2026" },
              { name: "time", label: "Time", placeholder: "10:30 AM" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({
  appointment,
  onCancel,
}: {
  appointment: DashboardAppointment;
  onCancel?: (appointment: DashboardAppointment) => Promise<void>;
}) {
  const property = appointmentPropertyTitle(appointment);
  const [cancelling, setCancelling] = useState(false);

  return (
    <div className="rounded-[1.5rem] border border-border bg-[#F8FAF9] p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="min-w-0 truncate font-heading text-xl font-bold">
              {property}
            </h3>
            <StatusBadge value={appointment.visit_type} />
            <StatusBadge value={appointment.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Agent: {getAgentName(appointment.agent)}
          </p>
          {appointment.notes && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {appointment.notes}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <Clock size={16} />
            <span className="font-semibold">{appointmentTimeLabel(appointment)}</span>
          </div>
        </div>
      </div>

      {onCancel && canCancelAppointment(appointment.status) && (
        <div className="mt-5 border-t border-border pt-5">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl bg-white"
            disabled={cancelling}
            onClick={async () => {
              setCancelling(true);
              try {
                await onCancel(appointment);
              } finally {
                setCancelling(false);
              }
            }}
          >
            {cancelling ? "Cancelling..." : "Cancel Appointment"}
          </Button>
        </div>
      )}
    </div>
  );
}

function canCancelAppointment(status?: string | null) {
  return ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(
    safeText(status, "").toUpperCase()
  );
}

function SearchBlock({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="mt-8 rounded-[2rem] border border-border bg-white p-5 shadow-sm">
      <label className="block rounded-2xl border border-border bg-[#F8FAF9] p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Search size={20} className="shrink-0 text-primary" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
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
      </label>
    </div>
  );
}

function filterInquiries(inquiries: DashboardInquiry[], query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return inquiries;
  }

  return inquiries.filter((item) =>
    [
      inquiryPropertyTitle(item),
      getAgentName(item.agent),
      item.full_name,
      item.email,
      item.status,
      item.priority,
      item.message,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}

function userStats(data: UserDashboardResponse): DashboardStat[] {
  const stats = data.stats ?? {};

  return [
    {
      title: "Saved Properties",
      value: formatNumber(stats.saved_properties),
      change: "Live from backend",
      trend: "neutral",
      icon: Heart,
    },
    {
      title: "Inquiries",
      value: formatNumber(stats.inquiries),
      change: "Authenticated data",
      trend: "neutral",
      icon: MessageCircle,
    },
    {
      title: "Appointments",
      value: formatNumber(stats.appointments),
      change: "Viewing workflow",
      trend: "neutral",
      icon: CalendarCheck,
    },
    {
      title: "Unread Alerts",
      value: formatNumber(stats.notifications_unread),
      change: "Notifications",
      trend: "neutral",
      icon: Sparkles,
    },
  ];
}

function userActivities(data: UserDashboardResponse): DashboardActivity[] {
  const inquiries = (data.recent_inquiries ?? []).slice(0, 3).map((item) => ({
    id: `inquiry-${item.id}`,
    title: `Inquiry: ${inquiryPropertyTitle(item)}`,
    description: safeText(item.message, "Inquiry status updated."),
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
      id: "empty-activity",
      title: "Dashboard connected",
      description: "Recent backend activity will appear here.",
      time: "Now",
      type: "system",
    },
  ];
}
