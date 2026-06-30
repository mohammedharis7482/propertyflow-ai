"use client";

import { useCallback, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { formatDate, formatEnumLabel, formatTime, safeText } from "@/lib/formatters";
import { normalizeProperty } from "@/services/property.service";
import type { Property } from "@/types/property";
import type {
  DashboardAppointment,
  DashboardInquiry,
  DashboardPropertySummary,
} from "@/types/user-dashboard";

export function useLiveData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const reload = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        setErrorStatus(null);
        const payload = await loader();

        if (active) {
          setData(payload);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (active) {
          setError(err instanceof Error ? err.message : "Dashboard data is unavailable.");
          setErrorStatus(err instanceof ApiError ? err.status : null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [loader, refreshKey]);

  return { data, error, errorStatus, isLoading, reload };
}

export function DashboardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-[2rem] border border-border bg-white p-6 shadow-sm"
        >
          <div className="h-8 w-8 rounded-xl bg-secondary" />
          <div className="mt-5 h-3 w-28 rounded-full bg-secondary" />
          <div className="mt-3 h-8 w-20 rounded-full bg-secondary" />
        </div>
      ))}
    </div>
  );
}

export function DashboardPanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="h-6 w-48 animate-pulse rounded-full bg-secondary" />
      <div className="mt-6 grid gap-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-[#F8FAF9]"
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardErrorState({
  title = "Unable to load dashboard data",
  message,
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertCircle size={24} />
      </div>
      <h3 className="mt-5 font-heading text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
        {message ?? "Please check the backend server and your session, then refresh this page."}
      </p>
    </div>
  );
}

export function DashboardEmptyPanel({
  icon: Icon = Inbox,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-[#F8FAF9] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
        <Icon size={24} />
      </div>
      <h3 className="mt-5 font-heading text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function AgentProfileSetupState() {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
        <Inbox size={24} />
      </div>
      <h3 className="mt-5 font-heading text-2xl font-bold">
        Agent profile is not set up yet.
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
        Please contact admin or complete your agent profile before using the agent workspace.
      </p>
    </div>
  );
}

export function DashboardUnauthorizedState() {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
        <AlertCircle size={24} />
      </div>
      <h3 className="mt-5 font-heading text-2xl font-bold">
        This dashboard is not available for your account.
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
        Your current role does not have access to this workspace.
      </p>
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <Icon size={24} className="text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-heading text-4xl font-bold ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function StatusBadge({ value }: { value?: string | null }) {
  const label = formatEnumLabel(value) || "Pending";
  const isWarm = ["Pending", "New", "High", "Rejected"].some((part) =>
    label.includes(part)
  );

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isWarm ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-primary"
      }`}
    >
      {label}
    </span>
  );
}

export function getPropertyTitle(item?: DashboardPropertySummary | DashboardInquiry["property"] | DashboardAppointment["property"] | null) {
  if (!item) {
    return "Premium Property";
  }

  if (typeof item === "string") {
    return safeText(item, "Premium Property");
  }

  return safeText(item.title, "Premium Property");
}

export function getPropertyLocation(item?: DashboardPropertySummary | null) {
  if (!item) {
    return "Location available on request";
  }

  return safeText(
    item.location_display ?? item.location ?? [item.area, item.city].filter(Boolean).join(", "),
    "Location available on request"
  );
}

export function getAgentName(value: DashboardInquiry["agent"] | DashboardAppointment["agent"] | null | undefined, fallback = "Verified Agent") {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return safeText(value, fallback);
  }

  return safeText(value.full_name ?? value.user?.full_name, fallback);
}

export function getUserName(value: DashboardInquiry["user"] | DashboardAppointment["user"] | null | undefined, fallback = "Platform User") {
  if (!value) {
    return fallback;
  }

  if (typeof value === "string") {
    return safeText(value, fallback);
  }

  return safeText(value.full_name ?? value.email, fallback);
}

export function toDashboardProperty(item: DashboardPropertySummary): Property {
  const property = item.property ?? item;

  return normalizeProperty({
    id: Number(property.id ?? item.id ?? 0),
    slug: safeText(property.slug, "premium-property"),
    title: safeText(property.title, "Premium Property"),
    location_display: getPropertyLocation(property),
    price: property.price ?? 0,
    currency: safeText(property.currency, "AED"),
    city: safeText(property.city, ""),
    area: safeText(property.area, ""),
    bedrooms: Number(property.bedrooms ?? 0),
    bathrooms: Number(property.bathrooms ?? 0),
    size_sqft: Number(property.size_sqft ?? 0),
    property_type: safeText(property.property_type, "APARTMENT"),
    purpose: safeText(property.purpose, "SALE"),
    is_featured: Boolean(property.is_featured),
    primary_image: property.primary_image ?? item.image ?? null,
    agent: property.agent ?? null,
  });
}

export function inquiryPropertyTitle(inquiry: DashboardInquiry) {
  return safeText(
    inquiry.property_title ?? getPropertyTitle(inquiry.property),
    "Premium Property"
  );
}

export function appointmentPropertyTitle(appointment: DashboardAppointment) {
  return safeText(
    appointment.property_title ?? getPropertyTitle(appointment.property),
    "Premium Property"
  );
}

export function appointmentTimeLabel(appointment: DashboardAppointment) {
  return `${formatDate(appointment.appointment_date)} · ${formatTime(
    appointment.appointment_time
  )}`;
}

export function InlineActionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button size="sm" variant="outline" className="rounded-xl bg-white" asChild>
      <a href={href}>{children}</a>
    </Button>
  );
}
