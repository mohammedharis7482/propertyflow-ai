import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { DashboardStat } from "@/types/dashboard";

interface DashboardStatCardProps {
  stat: DashboardStat;
}

const points = "0,34 22,26 44,30 66,18 88,22 110,10 132,14";

export default function DashboardStatCard({ stat }: DashboardStatCardProps) {
  const Icon = stat.icon;

  const TrendIcon =
    stat.trend === "up"
      ? ArrowUpRight
      : stat.trend === "down"
      ? ArrowDownRight
      : Minus;

  return (
    <div className="group relative min-w-0 overflow-hidden rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[2rem] sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
          <Icon size={23} />
        </div>

        <span className="flex min-w-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
          <TrendIcon size={14} />
          <span className="truncate">{stat.change}</span>
        </span>
      </div>

      <p className="mt-6 line-clamp-2 text-sm font-medium text-muted-foreground">
        {stat.title}
      </p>

      <p className="mt-2 break-words font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {stat.value}
      </p>

      <svg viewBox="0 0 132 44" className="mt-6 h-12 w-full">
        <path
          d={`M ${points.replaceAll(" ", " L ")}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        <path
          d={`M ${points.replaceAll(" ", " L ")} L 132 44 L 0 44 Z`}
          className="fill-emerald-100"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
