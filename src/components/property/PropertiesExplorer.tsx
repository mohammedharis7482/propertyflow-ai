"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import PropertyFilters, {
  PropertyFilterState,
} from "@/components/property/PropertyFilters";
import PropertyListCard from "@/components/property/PropertyListCard";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/services/property.service";
import { Property } from "@/types/property";

interface PropertiesExplorerProps {
  properties: Property[];
}

const defaultFilters: PropertyFilterState = {
  location: "all",
  type: "all",
  status: "all",
  priceRange: "all",
  beds: "all",
};

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Most Bedrooms", value: "beds-desc" },
];

export default function PropertiesExplorer({
  properties,
}: PropertiesExplorerProps) {
  const [apiProperties, setApiProperties] = useState(properties);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [filters, setFilters] = useState<PropertyFilterState>(defaultFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const locations = useMemo(
    () => unique(apiProperties.map((property) => property.location)),
    [apiProperties]
  );
  const types = useMemo(
    () => unique(apiProperties.map((property) => property.type)),
    [apiProperties]
  );
  const statuses = useMemo(
    () => unique(apiProperties.map((property) => property.status)),
    [apiProperties]
  );

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      setIsLoading(true);
      const nextProperties = await getProperties(
        toPropertyApiParams(query, filters, sort)
      );

      if (active) {
        setApiProperties(nextProperties);
        setIsLoading(false);
      }
    }

    loadProperties();

    return () => {
      active = false;
    };
  }, [filters, query, sort]);

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return apiProperties
      .filter((property) => {
        const searchable = [
          property.title,
          property.location,
          property.type,
          property.status,
          property.description ?? "",
          ...(property.amenities ?? []),
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery =
          normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
        const matchesLocation =
          filters.location === "all" || property.location === filters.location;
        const matchesType = filters.type === "all" || property.type === filters.type;
        const matchesStatus =
          filters.status === "all" || property.status === filters.status;
        const matchesBeds =
          filters.beds === "all" || property.beds >= Number(filters.beds);
        const matchesPrice = matchesPriceRange(property, filters.priceRange);

        return (
          matchesQuery &&
          matchesLocation &&
          matchesType &&
          matchesStatus &&
          matchesBeds &&
          matchesPrice
        );
      })
      .sort((a, b) => sortProperties(a, b, sort));
  }, [apiProperties, filters, query, sort]);

  const hasFilters =
    query.trim().length > 0 ||
    Object.values(filters).some((value) => value !== "all");

  function updateFilter(key: keyof PropertyFilterState, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setQuery("");
    setSort("recommended");
    setFilters(defaultFilters);
    setShowMobileFilters(false);
  }

  return (
    <>
      <div className="mb-8 rounded-[2rem] border border-border bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="rounded-2xl border border-border bg-secondary p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Search properties
            </span>
            <div className="mt-2 flex items-center gap-3">
              <Search size={20} className="text-primary" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Dubai Marina, Palm Jumeirah, Business Bay..."
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

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-2xl lg:hidden"
              onClick={() => setShowMobileFilters((open) => !open)}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </Button>

            <label className="flex h-11 items-center rounded-2xl border border-border bg-white px-4 text-sm font-semibold">
              <span className="mr-2 text-muted-foreground">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="bg-transparent text-foreground outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {showMobileFilters && (
          <div className="mt-4 lg:hidden">
            <PropertyFilters
              filters={filters}
              locations={locations}
              types={types}
              statuses={statuses}
              onChange={updateFilter}
              onReset={resetFilters}
              className="shadow-none"
            />
          </div>
        )}
      </div>

      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="font-heading text-2xl font-bold">
            {isLoading ? "Loading" : filteredProperties.length} Properties Found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFilters
              ? "Showing listings that match your active search and filters."
              : "Showing curated listings based on premium GCC market demand."}
          </p>
        </div>

        {hasFilters && (
          <Button variant="outline" className="rounded-2xl bg-white" onClick={resetFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden min-w-0 lg:block">
          <PropertyFilters
            filters={filters}
            locations={locations}
            types={types}
            statuses={statuses}
            onChange={updateFilter}
            onReset={resetFilters}
          />
        </div>

        <div className="min-w-0 space-y-5">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyListCard key={property.id} property={property} />
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                <Search size={24} />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold">
                No properties found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Try a different location, budget, property type, or keyword.
              </p>
              <Button className="mt-6 rounded-2xl" onClick={resetFilters}>
                Reset Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function matchesPriceRange(property: Property, range: string) {
  if (range === "all") {
    return true;
  }

  const price = getComparablePrice(property.price);

  if (range === "rental") {
    return property.status === "For Rent";
  }

  if (property.status === "For Rent") {
    return false;
  }

  if (range === "under-2500000") {
    return price < 2500000;
  }

  if (range === "2500000-5000000") {
    return price >= 2500000 && price <= 5000000;
  }

  if (range === "over-5000000") {
    return price > 5000000;
  }

  return true;
}

function sortProperties(a: Property, b: Property, sort: string) {
  if (sort === "price-desc") {
    return getComparablePrice(b.price) - getComparablePrice(a.price);
  }

  if (sort === "price-asc") {
    return getComparablePrice(a.price) - getComparablePrice(b.price);
  }

  if (sort === "beds-desc") {
    return b.beds - a.beds;
  }

  return Number(b.featured ?? false) - Number(a.featured ?? false);
}

function getComparablePrice(price: string) {
  const number = Number(price.replace(/[^0-9.]/g, ""));

  if (price.includes("K")) {
    return number * 1000;
  }

  if (price.includes("M")) {
    return number * 1000000;
  }

  return number;
}

function toPropertyApiParams(
  query: string,
  filters: PropertyFilterState,
  sort: string
) {
  const params: Record<string, string | number> = {};
  const trimmedQuery = query.trim();

  if (trimmedQuery) {
    params.search = trimmedQuery;
  }

  if (filters.location !== "all") {
    const [area, city] = filters.location.split(",").map((item) => item.trim());
    if (city) {
      params.city = city;
      params.area = area;
    } else {
      params.search = [params.search, filters.location].filter(Boolean).join(" ");
    }
  }

  if (filters.type !== "all") {
    params.property_type = filters.type.toUpperCase().replaceAll(" ", "_");
  }

  if (filters.status !== "all") {
    params.purpose = filters.status === "For Rent" ? "RENT" : "SALE";
  }

  if (filters.beds !== "all") {
    params.bedrooms = Number(filters.beds);
  }

  if (filters.priceRange === "rental") {
    params.purpose = "RENT";
  } else if (filters.priceRange === "under-2500000") {
    params.max_price = 2500000;
  } else if (filters.priceRange === "2500000-5000000") {
    params.min_price = 2500000;
    params.max_price = 5000000;
  } else if (filters.priceRange === "over-5000000") {
    params.min_price = 5000000;
  }

  if (sort === "price-desc") {
    params.ordering = "-price";
  } else if (sort === "price-asc") {
    params.ordering = "price";
  }

  return params;
}
