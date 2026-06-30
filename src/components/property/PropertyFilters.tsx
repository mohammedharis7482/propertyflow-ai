"use client";

import { Building2, Home, MapPin, SlidersHorizontal, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PropertyFilterState {
  location: string;
  type: string;
  status: string;
  priceRange: string;
  beds: string;
}

interface PropertyFiltersProps {
  filters: PropertyFilterState;
  locations: string[];
  types: string[];
  statuses: string[];
  onChange: (key: keyof PropertyFilterState, value: string) => void;
  onReset: () => void;
  className?: string;
}

const priceRanges = [
  { label: "Any budget", value: "all" },
  { label: "Under AED 2.5M", value: "under-2500000" },
  { label: "AED 2.5M - 5M", value: "2500000-5000000" },
  { label: "AED 5M+", value: "over-5000000" },
  { label: "Rental listings", value: "rental" },
];

const bedroomRanges = [
  { label: "Any bedrooms", value: "all" },
  { label: "Studio / Commercial", value: "0" },
  { label: "2+ bedrooms", value: "2" },
  { label: "3+ bedrooms", value: "3" },
  { label: "4+ bedrooms", value: "4" },
  { label: "5+ bedrooms", value: "5" },
];

export default function PropertyFilters({
  filters,
  locations,
  types,
  statuses,
  onChange,
  onReset,
  className,
}: PropertyFiltersProps) {
  return (
    <aside
      className={`w-full max-w-none overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start ${
        className ?? ""
      }`}
    >
      <div className="mb-6">
        <h3 className="font-heading text-xl font-bold">Filters</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Refine properties by location, type, budget, and lifestyle.
        </p>
      </div>

      <div className="grid gap-4">
        <FilterSelect
          icon={MapPin}
          label="Location"
          value={filters.location}
          options={[
            { label: "All locations", value: "all" },
            ...locations.map((location) => ({
              label: location,
              value: location,
            })),
          ]}
          onChange={(value) => onChange("location", value)}
        />

        <FilterSelect
          icon={Building2}
          label="Property Type"
          value={filters.type}
          options={[
            { label: "All property types", value: "all" },
            ...types.map((type) => ({ label: type, value: type })),
          ]}
          onChange={(value) => onChange("type", value)}
        />

        <FilterSelect
          icon={Tag}
          label="Status"
          value={filters.status}
          options={[
            { label: "All statuses", value: "all" },
            ...statuses.map((status) => ({ label: status, value: status })),
          ]}
          onChange={(value) => onChange("status", value)}
        />

        <FilterSelect
          icon={SlidersHorizontal}
          label="Price Range"
          value={filters.priceRange}
          options={priceRanges}
          onChange={(value) => onChange("priceRange", value)}
        />

        <FilterSelect
          icon={Home}
          label="Bedrooms"
          value={filters.beds}
          options={bedroomRanges}
          onChange={(value) => onChange("beds", value)}
        />
      </div>

      <Button variant="outline" className="mt-6 w-full rounded-2xl" onClick={onReset}>
        Reset Filters
      </Button>
    </aside>
  );
}

interface FilterSelectProps {
  icon: React.ElementType;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

function FilterSelect({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-secondary p-4">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      <div className="mt-3 flex min-w-0 items-center gap-3">
        <Icon size={20} className="shrink-0 text-primary" />
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 flex-1 truncate bg-transparent text-sm font-semibold text-foreground outline-none"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
