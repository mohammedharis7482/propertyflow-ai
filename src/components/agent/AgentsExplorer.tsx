"use client";

import { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Languages,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";

import AgentCard from "@/components/agent/AgentCard";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/agent";

interface AgentsExplorerProps {
  agents: Agent[];
}

const defaultFilters = {
  location: "all",
  speciality: "all",
  language: "all",
  rating: "all",
  listings: "all",
};

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Highest Rating", value: "rating-desc" },
  { label: "Most Listings", value: "properties-desc" },
  { label: "Most Experience", value: "experience-desc" },
];

export default function AgentsExplorer({ agents }: AgentsExplorerProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recommended");
  const [filters, setFilters] = useState(defaultFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const locations = useMemo(
    () => unique(agents.map((agent) => agent.location)),
    [agents]
  );
  const specialities = useMemo(
    () => unique(agents.flatMap((agent) => agent.specialities ?? [])),
    [agents]
  );
  const languages = useMemo(
    () => unique(agents.flatMap((agent) => agent.languages ?? [])),
    [agents]
  );

  const filteredAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return agents
      .filter((agent) => {
        const searchable = [
          agent.name,
          agent.role,
          agent.location,
          agent.about ?? "",
          ...(agent.specialities ?? []),
          ...(agent.languages ?? []),
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery =
          normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
        const matchesLocation =
          filters.location === "all" || agent.location === filters.location;
        const matchesSpeciality =
          filters.speciality === "all" ||
          (agent.specialities ?? []).includes(filters.speciality);
        const matchesLanguage =
          filters.language === "all" ||
          (agent.languages ?? []).includes(filters.language);
        const matchesRating =
          filters.rating === "all" || agent.rating >= Number(filters.rating);
        const matchesListings =
          filters.listings === "all" ||
          agent.properties >= Number(filters.listings);

        return (
          matchesQuery &&
          matchesLocation &&
          matchesSpeciality &&
          matchesLanguage &&
          matchesRating &&
          matchesListings
        );
      })
      .sort((a, b) => sortAgents(a, b, sort));
  }, [agents, filters, query, sort]);

  const hasFilters =
    query.trim().length > 0 ||
    Object.values(filters).some((value) => value !== "all");

  function updateFilter(key: keyof typeof defaultFilters, value: string) {
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
      <div className="mb-8 max-w-full overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-sm">
        <div className="grid min-w-0 gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid min-w-0 gap-3 md:grid-cols-[1fr_1fr]">
            <label className="min-w-0 rounded-2xl border border-border bg-secondary p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Search agents
              </span>
              <div className="mt-2 flex min-w-0 items-center gap-3">
                <Search size={20} className="shrink-0 text-primary" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Name, location, speciality, language..."
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

            <label className="min-w-0 rounded-2xl border border-border bg-secondary p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </span>
              <div className="mt-2 flex items-center gap-3">
                <MapPin size={20} className="text-primary" />
                <select
                  value={filters.location}
                  onChange={(event) => updateFilter("location", event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none"
                >
                  <option value="all">All locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row lg:justify-end">
            <Button
              variant="outline"
              className="w-full rounded-2xl sm:w-auto lg:hidden"
              onClick={() => setShowMobileFilters((open) => !open)}
            >
              <SlidersHorizontal size={18} className="mr-2" />
              Filters
            </Button>

            <label className="flex h-11 min-w-0 items-center rounded-2xl border border-border bg-white px-4 text-sm font-semibold">
              <Star size={17} className="mr-2 shrink-0 text-primary" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="min-w-0 flex-1 truncate bg-transparent text-foreground outline-none"
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

        <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
          {specialities.slice(0, 8).map((item) => {
            const active = filters.speciality === item;

            return (
              <button
                key={item}
                onClick={() => updateFilter("speciality", active ? "all" : item)}
                className={`max-w-full truncate rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "border-primary bg-emerald-50 text-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:bg-emerald-50 hover:text-primary"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {showMobileFilters && (
          <div className="mt-5 lg:hidden">
            <AgentFilters
              filters={filters}
              specialities={specialities}
              languages={languages}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </div>
        )}
      </div>

      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <h2 className="font-heading text-2xl font-bold">
            {filteredAgents.length} Verified Agents
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasFilters
              ? "Showing agents that match your search and advisory needs."
              : "Browse experienced property advisors across premium GCC markets."}
          </p>
        </div>

        {hasFilters && (
          <Button variant="outline" className="w-full rounded-2xl bg-white sm:w-auto" onClick={resetFilters}>
            Clear All
          </Button>
        )}
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="hidden min-w-0 lg:block">
          <AgentFilters
            filters={filters}
            specialities={specialities}
            languages={languages}
            onChange={updateFilter}
            onReset={resetFilters}
          />
        </div>

        <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border bg-white p-10 text-center md:col-span-2 xl:col-span-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                <Users size={24} />
              </div>
              <h3 className="mt-5 font-heading text-2xl font-bold">
                No agents found
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
                Try a different city, speciality, rating, language, or search term.
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

interface AgentFiltersProps {
  filters: typeof defaultFilters;
  specialities: string[];
  languages: string[];
  onChange: (key: keyof typeof defaultFilters, value: string) => void;
  onReset: () => void;
}

function AgentFilters({
  filters,
  specialities,
  languages,
  onChange,
  onReset,
}: AgentFiltersProps) {
  return (
    <aside className="w-full max-w-none overflow-hidden rounded-[2rem] border border-border bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
      <div className="mb-6">
        <h3 className="font-heading text-xl font-bold">Agent Filters</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Refine advisors by expertise, language, rating, and listing volume.
        </p>
      </div>

      <div className="grid gap-4">
        <FilterSelect
          icon={BriefcaseBusiness}
          label="Speciality"
          value={filters.speciality}
          options={[
            { label: "All specialities", value: "all" },
            ...specialities.map((item) => ({ label: item, value: item })),
          ]}
          onChange={(value) => onChange("speciality", value)}
        />

        <FilterSelect
          icon={Languages}
          label="Language"
          value={filters.language}
          options={[
            { label: "Any language", value: "all" },
            ...languages.map((item) => ({ label: item, value: item })),
          ]}
          onChange={(value) => onChange("language", value)}
        />

        <FilterSelect
          icon={Star}
          label="Minimum Rating"
          value={filters.rating}
          options={[
            { label: "Any rating", value: "all" },
            { label: "4.7+", value: "4.7" },
            { label: "4.8+", value: "4.8" },
            { label: "4.9+", value: "4.9" },
          ]}
          onChange={(value) => onChange("rating", value)}
        />

        <FilterSelect
          icon={Users}
          label="Listing Volume"
          value={filters.listings}
          options={[
            { label: "Any volume", value: "all" },
            { label: "50+ listings", value: "50" },
            { label: "65+ listings", value: "65" },
            { label: "75+ listings", value: "75" },
          ]}
          onChange={(value) => onChange("listings", value)}
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

function unique(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function sortAgents(a: Agent, b: Agent, sort: string) {
  if (sort === "rating-desc") {
    return b.rating - a.rating;
  }

  if (sort === "properties-desc") {
    return b.properties - a.properties;
  }

  if (sort === "experience-desc") {
    return getExperienceYears(b.experience) - getExperienceYears(a.experience);
  }

  return b.rating + b.properties / 100 - (a.rating + a.properties / 100);
}

function getExperienceYears(experience: string) {
  return Number(experience.replace(/[^0-9]/g, ""));
}
