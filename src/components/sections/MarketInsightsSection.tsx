import Link from "next/link";
import { ArrowRight, BarChart3, MapPin, TrendingUp } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { marketInsights } from "@/data/market";

export default function MarketInsightsSection() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            badge="Market Insights"
            title="Understand where the GCC real estate market is moving."
            description="Track demand, pricing movement, rental growth, and investment signals across high-performing real estate locations."
            center={false}
          />

          <Button variant="outline" asChild>
            <Link href="/insights">
              View All Insights
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {marketInsights.map((insight) => (
            <article
              key={insight.id}
              className="rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                  <BarChart3 size={28} />
                </div>

                <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800">
                  {insight.tag}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                {insight.location}
              </div>

              <h3 className="mt-4 font-heading text-xl font-bold leading-snug">
                {insight.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {insight.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Growth signal
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-primary">
                    {insight.growth}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                  <TrendingUp size={20} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}