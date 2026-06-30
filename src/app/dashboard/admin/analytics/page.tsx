"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import {
  Activity,
  Building2,
  DollarSign,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardPageHeader from "@/components/dashboard/shared/DashboardPageHeader";
import AIInsightCard from "@/components/dashboard/shared/AIInsightCard";
import MarketPulseCard from "@/components/dashboard/shared/MarketPulseCard";
import ChartDataStatus from "@/components/dashboard/shared/ChartDataStatus";
import AIMarketSignalCard from "@/components/ai/AIMarketSignalCard";
import {
  DashboardPanelSkeleton,
  useLiveData,
} from "@/components/dashboard/live/live-utils";
import { getMarketSignals } from "@/services/ai.service";

const kpis = [
  {
    title: "Revenue",
    value: "$248K",
    change: "+18.6%",
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "12.4K",
    change: "+14.2%",
    icon: Users,
  },
  {
    title: "Properties",
    value: "1,248",
    change: "+11.4%",
    icon: Building2,
  },
  {
    title: "Inquiries",
    value: "4,820",
    change: "+21.8%",
    icon: Activity,
  },
];

const growthData = [
  { month: "Jan", users: 2400, properties: 420 },
  { month: "Feb", users: 3100, properties: 510 },
  { month: "Mar", users: 4200, properties: 640 },
  { month: "Apr", users: 5800, properties: 780 },
  { month: "May", users: 8100, properties: 980 },
  { month: "Jun", users: 12400, properties: 1248 },
];

const conversionData = [
  { stage: "Visitors", value: 12000 },
  { stage: "Leads", value: 4800 },
  { stage: "Viewings", value: 1700 },
  { stage: "Deals", value: 620 },
];

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

export default function AdminAnalyticsPage() {
  return (
    <DashboardLayout role="admin">
      <DashboardPageHeader
        badge="Executive Analytics"
        title="Platform growth and business intelligence."
        description="Monitor platform growth, marketplace activity, conversion performance, and AI-generated executive insights."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[2rem] border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon size={24} className="text-primary" />

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                  {item.change}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {item.title}
              </p>

              <p className="mt-1 font-heading text-4xl font-bold">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold">
                Platform Growth
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                User and property growth across the platform.
              </p>
            </div>

            <div className="h-[280px] min-h-[280px] min-w-0 sm:h-[380px] sm:min-h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient
                      id="usersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#059669"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#059669"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Area
                    dataKey="users"
                    stroke="#059669"
                    fill="url(#usersGradient)"
                    strokeWidth={3}
                  />

                  <Area
                    dataKey="properties"
                    stroke="#10B981"
                    fill="transparent"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <ChartDataStatus
              source="Admin analytics mock adapter"
              points={growthData.length}
              note="Ready for platform growth API"
            />
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-heading text-2xl font-bold">
                Conversion Funnel
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Visitor to deal conversion performance.
              </p>
            </div>

            <div className="h-[280px] min-h-[280px] min-w-0 sm:h-[340px] sm:min-h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="#059669"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ChartDataStatus
              source="Conversion funnel mock adapter"
              points={conversionData.length}
              note="Ready for funnel analytics API"
            />
          </div>
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Platform growth is accelerating."
            description="AI detected stronger demand from GCC investors and higher listing engagement compared with the previous quarter."
            action="View Executive Report"
            href="/dashboard/admin/settings"
          />

          <MarketPulseCard />

          <div className="rounded-[2rem] border border-border bg-white p-5 shadow-sm">
            <h3 className="font-heading text-lg font-bold">
              Executive Summary
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <TrendingUp size={18} className="text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Revenue Growth
                </p>
                <p className="mt-1 font-heading text-3xl font-bold text-primary">
                  +18.6%
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <Users size={18} className="text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  User Growth
                </p>
                <p className="mt-1 font-heading text-3xl font-bold">
                  +14.2%
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <Sparkles size={18} className="text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  AI Health Score
                </p>
                <p className="mt-1 font-heading text-3xl font-bold text-primary">
                  96%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-5 shadow-sm">
            <h3 className="font-heading text-lg font-bold">
              Market Signal
            </h3>

            <MarketSignalsPanel />
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function MarketSignalsPanel() {
  const loader = useCallback(() => getMarketSignals(), []);
  const { data, error, isLoading } = useLiveData(loader);

  if (isLoading) {
    return (
      <div className="mt-5">
        <DashboardPanelSkeleton rows={2} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        Market signals are temporarily unavailable. Existing analytics remain
        ready for the next data refresh.
      </p>
    );
  }

  return <div className="mt-5"><AIMarketSignalCard data={data} /></div>;
}
