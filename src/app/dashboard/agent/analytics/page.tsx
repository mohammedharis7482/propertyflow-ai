"use client";

import dynamic from "next/dynamic";
import {
  BarChart3,
  Eye,
  MessageCircle,
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

const performanceStats = [
  {
    title: "Total Views",
    value: "12.8K",
    change: "+18.2%",
    icon: Eye,
  },
  {
    title: "Total Leads",
    value: "486",
    change: "+12.4%",
    icon: MessageCircle,
  },
  {
    title: "Conversion Rate",
    value: "24%",
    change: "+3.2%",
    icon: TrendingUp,
  },
];

const viewsData = [
  { month: "Jan", views: 1200, leads: 42 },
  { month: "Feb", views: 1800, leads: 58 },
  { month: "Mar", views: 2100, leads: 76 },
  { month: "Apr", views: 2600, leads: 92 },
  { month: "May", views: 3200, leads: 118 },
  { month: "Jun", views: 3800, leads: 142 },
];

const propertyData = [
  { name: "Palm View", leads: 36 },
  { name: "Marina Sky", leads: 28 },
  { name: "Dubai Hills", leads: 19 },
  { name: "Business Bay", leads: 16 },
];

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

export default function AgentAnalyticsPage() {
  return (
    <DashboardLayout role="agent">
      <DashboardPageHeader
        badge="Agent Analytics"
        title="Track listing performance and lead growth."
        description="Analyze views, leads, conversion rate, high-performing listings, and AI-powered sales insights."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {performanceStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-[2rem] border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Icon size={24} className="text-primary" />

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                  {stat.change}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {stat.title}
              </p>

              <p className="mt-1 font-heading text-4xl font-bold">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Views & Leads Trend
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly property visibility and lead generation.
                </p>
              </div>

              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
                +18.2% growth
              </div>
            </div>

            <div className="h-[280px] min-h-[280px] min-w-0 sm:h-[360px] sm:min-h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={viewsData}>
                  <defs>
                    <linearGradient
                      id="viewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#059669"
                        stopOpacity={0.24}
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
                    type="monotone"
                    dataKey="views"
                    stroke="#059669"
                    fill="url(#viewsGradient)"
                    strokeWidth={3}
                  />

                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#10B981"
                    fill="transparent"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <ChartDataStatus
              source="Agent analytics mock adapter"
              points={viewsData.length}
              note="Ready for DRF time-series payloads"
            />
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold">
                  Leads by Property
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Highest performing listings by lead volume.
                </p>
              </div>

              <BarChart3 size={22} className="text-primary" />
            </div>

            <div className="h-[280px] min-h-[280px] min-w-0 sm:h-[340px] sm:min-h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={propertyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#059669" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ChartDataStatus
              source="Listing performance mock adapter"
              points={propertyData.length}
              note="Ready for property analytics API"
            />
          </div>
        </div>

        <aside className="space-y-8">
          <AIInsightCard
            title="Palm View Residence is your strongest performer."
            description="AI detected higher view-to-lead conversion and stronger buyer intent compared with your other listings."
            action="Optimize Listing"
            href="/dashboard/agent/listings"
          />

          <MarketPulseCard />

          <div className="rounded-[2rem] border border-border bg-white p-5 shadow-sm">
            <h3 className="font-heading text-lg font-bold">
              Analytics Summary
            </h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <Users size={18} className="text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Active Buyers
                </p>
                <p className="mt-1 font-heading text-3xl font-bold">
                  132
                </p>
              </div>

              <div className="rounded-2xl bg-[#F8FAF9] p-4">
                <Sparkles size={18} className="text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  AI Listing Score
                </p>
                <p className="mt-1 font-heading text-3xl font-bold text-primary">
                  92%
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
