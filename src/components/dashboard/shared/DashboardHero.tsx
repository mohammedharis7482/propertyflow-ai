import Link from "next/link";
import { ArrowRight, Brain, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeroProps {
  badge: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  href?: string;
}

export default function DashboardHero({
  badge,
  title,
  description,
  metric,
  metricLabel,
  href = "/dashboard/user/recommendations",
}: DashboardHeroProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8 lg:p-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_280px] lg:items-center">
        <div>
          <div className="mb-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles size={16} className="mr-2" />
            {badge}
          </div>

          <h1 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.05]">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {description}
          </p>

          <Button className="mt-7 rounded-2xl" asChild>
            <Link href={href}>
              View AI Insights
              <ArrowRight size={17} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="rounded-[1.75rem] border border-border bg-[#F8FAF9] p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
            <Brain size={24} />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">{metricLabel}</p>
          <p className="mt-2 font-heading text-4xl font-bold text-primary sm:text-5xl">
            {metric}
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm text-primary">
            <TrendingUp size={16} />
            Demand signal improving
          </div>
        </div>
      </div>
    </section>
  );
}
