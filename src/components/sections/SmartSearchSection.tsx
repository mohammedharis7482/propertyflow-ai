import { Building2, Home, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/layout/Container";

const quickFilters = [
  "For Sale",
  "For Rent",
  "Luxury",
  "Commercial",
  "Off Plan",
  "New Projects",
];

const popularSearches = [
  "Dubai Marina",
  "Palm Jumeirah",
  "Downtown Dubai",
  "Business Bay",
  "Abu Dhabi",
  "Doha",
];

export default function SmartSearchSection() {
  return (
    <section className="relative z-20 bg-background pb-20 pt-8 lg:-mt-20 lg:pb-24 lg:pt-0">
      <Container>
        <div className="rounded-3xl border border-border bg-white p-5 shadow-2xl shadow-slate-200/70 lg:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-heading text-2xl font-bold">
                Smart Property Search
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Find GCC properties faster with intelligent search filters.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-emerald-50 hover:text-primary"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_.8fr_auto]">
            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Location
              </p>
              <div className="mt-2 flex items-center gap-3">
                <MapPin size={20} className="text-primary" />
                <span className="font-medium text-foreground">
                  Dubai Marina, UAE
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Property Type
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Building2 size={20} className="text-primary" />
                <span className="font-medium text-foreground">
                  Villa / Apartment
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Price Range
              </p>
              <div className="mt-2 flex items-center gap-3">
                <SlidersHorizontal size={20} className="text-primary" />
                <span className="font-medium text-foreground">
                  AED 1M - 5M
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Bedrooms
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Home size={20} className="text-primary" />
                <span className="font-medium text-foreground">3+</span>
              </div>
            </div>

            <Button className="min-h-[76px] rounded-2xl px-8 text-base">
              <Search size={20} className="mr-2" />
              Search
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <span className="text-sm font-semibold text-foreground">
              Popular:
            </span>

            {popularSearches.map((item) => (
              <button
                key={item}
                className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-emerald-50 hover:text-primary"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}