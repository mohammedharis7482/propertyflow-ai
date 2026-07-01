import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "2.4K+", label: "Active Listings" },
  { value: "180+", label: "Verified Agents" },
  { value: "12+", label: "GCC Cities" },
];

const trustItems = [
  "Verified Listings",
  "AI Matching",
  "Market Insights",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <Container className="relative">
        <div className="grid items-center gap-10 py-10 pb-16 sm:py-16 sm:pb-24 lg:min-h-[700px] lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:py-20 lg:pb-28">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm sm:mb-6 sm:text-sm">
              <Sparkles size={16} />
              AI-powered real estate platform
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-[64px] lg:leading-[1.02]">
              Smarter property decisions for modern real estate.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              Discover premium GCC properties, compare market signals, connect
              with verified agents, and make confident real estate decisions
              faster with PropertyFlow AI.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="h-13 w-full px-7 sm:w-auto" asChild>
                <Link href="/properties">
                  Explore Properties
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full px-7 sm:w-auto"
                asChild
              >
                <Link href="/agents">Meet Top Agents</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm"
                >
                  <BadgeCheck size={16} className="text-primary" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-9 grid max-w-lg grid-cols-3 gap-3 border-t border-border pt-7 sm:gap-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -left-4 top-20 z-20 rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="font-heading font-bold">+18.6%</p>
                  <p className="text-sm text-muted-foreground">Growth signal</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-3 bottom-28 z-20 rounded-2xl border border-border bg-white/95 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="font-heading font-bold">AI Matched</p>
                  <p className="text-sm text-muted-foreground">
                    96% property fit
                  </p>
                </div>
              </div>
            </div>

            <div className="relative ml-auto max-w-[650px]">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-emerald-100/80 via-white to-yellow-100/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-300/60">
                <div className="relative h-[510px] overflow-hidden rounded-[1.55rem] bg-secondary">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop"
                    alt="Luxury modern property"
                    fill
                    priority
                    className="object-cover"
                    sizes="650px"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

                  <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-foreground shadow-lg backdrop-blur">
                    Premium Villa · Dubai
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-[1.4rem] border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading text-2xl font-bold tracking-tight">
                          Palm View Residence
                        </h3>

                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={16} />
                          Palm Jumeirah, Dubai
                        </p>
                      </div>

                      <p className="rounded-full bg-emerald-50 px-4 py-2 font-heading text-lg font-bold text-primary">
                        AED 4.8M
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                      {["4 Beds", "5 Baths", "3,800 sqft"].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl bg-secondary px-4 py-3 text-center font-semibold text-foreground"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-20 z-20 rounded-2xl border border-border bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Premium value
                    </p>
                    <p className="font-heading font-bold text-primary">
                      AED 4.8M
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-2 lg:hidden">
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-xl">
              <div className="relative h-[280px] overflow-hidden rounded-[1.5rem] bg-secondary sm:h-[360px]">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                  alt="Luxury modern property"
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-30 -mt-6 pb-14 sm:-mt-8 sm:pb-16 lg:-mt-12 lg:pb-20">
          <div className="rounded-[1.75rem] border border-border bg-white p-4 shadow-2xl shadow-slate-200/70 sm:rounded-[2rem] sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="font-heading text-xl font-bold sm:text-2xl">
                  Smart Property Search
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Find GCC properties faster with intelligent search filters.
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
                {["For Sale", "For Rent", "Luxury", "Commercial", "Off Plan", "New Projects"].map(
                  (filter) => (
                    <button
                      key={filter}
                      className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary hover:bg-emerald-50 hover:text-primary"
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,.8fr)_auto]">
              <div className="min-w-0 rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </p>
                <div className="mt-2 flex min-w-0 items-center gap-3">
                  <MapPin size={20} className="shrink-0 text-primary" />
                  <span className="min-w-0 truncate font-medium text-foreground">
                    Dubai Marina, UAE
                  </span>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Property Type
                </p>
                <div className="mt-2 flex min-w-0 items-center gap-3">
                  <Building2 size={20} className="shrink-0 text-primary" />
                  <span className="min-w-0 truncate font-medium text-foreground">
                    Villa / Apartment
                  </span>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Price Range
                </p>
                <div className="mt-2 flex min-w-0 items-center gap-3">
                  <SlidersHorizontal size={20} className="shrink-0 text-primary" />
                  <span className="min-w-0 truncate font-medium text-foreground">AED 1M - 5M</span>
                </div>
              </div>

              <div className="min-w-0 rounded-2xl border border-border bg-secondary p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bedrooms
                </p>
                <div className="mt-2 flex min-w-0 items-center gap-3">
                  <Home size={20} className="shrink-0 text-primary" />
                  <span className="min-w-0 truncate font-medium text-foreground">3+</span>
                </div>
              </div>

              <Button className="min-h-13 w-full rounded-2xl px-8 text-base lg:min-h-[76px] lg:w-auto" asChild>
                <Link href="/properties">
                  <Search size={20} className="mr-2" />
                  Search
                </Link>
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
              <span className="text-sm font-semibold text-foreground">
                Popular:
              </span>

              {["Dubai Marina", "Palm Jumeirah", "Downtown Dubai", "Business Bay", "Abu Dhabi", "Doha"].map(
                (item) => (
                  <Link
                    key={item}
                    href="/properties"
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-emerald-50 hover:text-primary"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
