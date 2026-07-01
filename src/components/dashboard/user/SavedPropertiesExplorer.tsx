"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Heart,
  MapPin,
  Maximize2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";

interface SavedPropertiesExplorerProps {
  properties: Property[];
  onRemove?: (property: Property) => Promise<void>;
}

const filterOptions = [
  { label: "All saved", value: "all" },
  { label: "For Sale", value: "For Sale" },
  { label: "For Rent", value: "For Rent" },
  { label: "Featured", value: "featured" },
];

export default function SavedPropertiesExplorer({
  properties,
  onRemove,
}: SavedPropertiesExplorerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return properties.filter((property) => {
      const searchable = [
        property.title,
        property.location,
        property.type,
        property.status,
        ...(property.amenities ?? []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      const matchesFilter =
        filter === "all" ||
        property.status === filter ||
        (filter === "featured" && property.featured);

      return matchesQuery && matchesFilter;
    });
  }, [filter, properties, query]);

  function reset() {
    setQuery("");
    setFilter("all");
  }

  return (
    <>
      <div className="mt-8 max-w-full overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-sm">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="min-w-0 rounded-2xl border border-border bg-[#F8FAF9] p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Search saved properties
            </span>

            <div className="mt-2 flex min-w-0 items-center gap-3">
              <Search size={20} className="shrink-0 text-primary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search by property, location, type, or amenity..."
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-muted-foreground transition hover:text-primary"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </label>

          <div className="grid min-w-0 gap-3 sm:flex sm:flex-wrap sm:justify-end">
            <label className="flex h-11 min-w-0 items-center rounded-2xl border border-border bg-white px-4 text-sm font-semibold">
              <SlidersHorizontal size={18} className="mr-2 shrink-0 text-primary" />
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-foreground outline-none"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <Button className="rounded-2xl">
              <Heart size={18} className="mr-2" />
              {filteredProperties.length} Saved
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h2 className="font-heading text-2xl font-bold">
              Saved Properties
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredProperties.length} bookmarked opportunities ready for comparison.
            </p>
          </div>

          {(query || filter !== "all") && (
            <Button
              variant="outline"
              className="w-full rounded-2xl bg-white sm:w-auto"
              onClick={reset}
            >
              Clear
            </Button>
          )}
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid gap-4">
            {filteredProperties.map((property, index) => (
              <SavedPropertyRow
                key={property.id}
                property={property}
                matchScore={96 - index * 3}
                onRemove={onRemove}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-[#F8FAF9] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
              <Heart size={24} />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-bold">
              No saved matches found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
              Try another keyword or filter to review your saved properties.
            </p>
            <Button className="mt-6 rounded-2xl" onClick={reset}>
              Reset Saved Search
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function SavedPropertyRow({
  property,
  matchScore,
  onRemove,
}: {
  property: Property;
  matchScore: number;
  onRemove?: (property: Property) => Promise<void>;
}) {
  const [removing, setRemoving] = useState(false);
  const stats = [
    { icon: BedDouble, label: "Beds", value: property.beds },
    { icon: Bath, label: "Baths", value: property.baths },
    { icon: Maximize2, label: "Area", value: property.area },
  ];

  return (
    <article className="group min-w-0 overflow-hidden rounded-[1.75rem] border border-border bg-[#F8FAF9] p-3 transition hover:border-emerald-200 hover:bg-white hover:shadow-lg sm:p-4">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[240px_minmax(0,1fr)_190px] lg:items-stretch xl:grid-cols-[260px_minmax(0,1fr)_204px]">
        <Link
          href={`/properties/${property.slug}`}
          className="relative block h-48 overflow-hidden rounded-[1.35rem] bg-secondary md:h-44 lg:h-full lg:min-h-[176px]"
        >
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 260px"
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">
              {property.status}
            </span>
            {property.featured && (
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
                Featured
              </span>
            )}
          </div>
        </Link>

        <div className="flex min-w-0 flex-col justify-center px-1 py-1 lg:py-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <p className="line-clamp-1 text-sm font-semibold text-primary">
              {property.type}
            </p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
              {matchScore}% AI match
            </span>
          </div>

          <Link href={`/properties/${property.slug}`}>
            <h3 className="mt-2 line-clamp-2 font-heading text-2xl font-bold leading-tight transition group-hover:text-primary">
              {property.title}
            </h3>
          </Link>

          <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin size={16} className="shrink-0 text-primary" />
            <span className="line-clamp-2">{property.location}</span>
          </p>

          <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex min-h-[58px] min-w-0 items-center gap-2 rounded-2xl bg-white px-3 py-2"
                >
                  <Icon size={15} className="shrink-0 text-primary" />
                  <span className="line-clamp-2 text-sm font-bold leading-tight text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid min-w-0 gap-3 rounded-[1.35rem] bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center lg:flex lg:min-w-0 lg:flex-col lg:items-stretch lg:justify-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Saved Value
            </p>
            <p className="mt-1 break-words font-heading text-2xl font-bold leading-tight">
              {property.price}
            </p>
          </div>

          <Button className="h-10 w-full rounded-2xl px-4 sm:w-auto lg:w-full" asChild>
            <Link href={`/properties/${property.slug}`}>
              View
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>

          <Button variant="outline" className="h-10 w-full rounded-2xl bg-white px-4 sm:w-auto lg:w-full" asChild>
            <Link href="/dashboard/user/appointments">Schedule</Link>
          </Button>

          {onRemove && (
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full rounded-2xl bg-white px-4 sm:w-auto lg:w-full"
              disabled={removing}
              onClick={async () => {
                setRemoving(true);
                try {
                  await onRemove(property);
                } finally {
                  setRemoving(false);
                }
              }}
            >
              {removing ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
