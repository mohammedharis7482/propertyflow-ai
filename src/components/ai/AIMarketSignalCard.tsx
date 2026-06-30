import { Building2, MapPin, MessageCircle, TrendingUp } from "lucide-react";

import AIBadge from "@/components/ai/AIBadge";
import { formatEnumLabel, formatNumber, safeText } from "@/lib/formatters";
import type { MarketSignals } from "@/types/ai";

interface AIMarketSignalCardProps {
  data: MarketSignals;
}

export default function AIMarketSignalCard({ data }: AIMarketSignalCardProps) {
  const topCities = data.top_cities?.slice(0, 3) ?? [];
  const topTypes = data.popular_property_types?.slice(0, 3) ?? [];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-[#F8FAF9] p-5">
        <AIBadge label="AI Market Signals" />
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {safeText(
            data.demand_summary,
            "Market signals will strengthen as listing and inquiry activity grows."
          )}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <SignalMetric
          icon={Building2}
          label="Listings"
          value={formatNumber(data.listing_counts)}
        />
        <SignalMetric
          icon={MessageCircle}
          label="Inquiries"
          value={formatNumber(data.inquiry_counts)}
        />
        <SignalMetric
          icon={TrendingUp}
          label="Appointments"
          value={formatNumber(data.appointment_counts)}
        />
      </div>

      <div className="space-y-3">
        {topCities.map((item) => (
          <div
            key={item.city}
            className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              <MapPin size={17} className="shrink-0 text-primary" />
              <p className="truncate text-sm font-semibold">
                {safeText(item.city, "Market")}
              </p>
            </div>
            <span className="shrink-0 text-sm font-bold text-primary">
              {formatNumber(item.listing_count)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {topTypes.map((item) => (
          <span
            key={item.property_type}
            className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted-foreground"
          >
            {formatEnumLabel(item.property_type) || "Property"}
          </span>
        ))}
      </div>
    </div>
  );
}

function SignalMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F8FAF9] p-4">
      <Icon size={17} className="text-primary" />
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-xl font-bold">{value}</p>
    </div>
  );
}
