import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "property" | "inquiry" | "appointment" | "system";
}

export interface DashboardProperty {
  id: string;
  slug?: string;
  title: string;
  location: string;
  price: string;
  status: string;
  image: string;
}

export interface DashboardInquiry {
  id: string;
  name: string;
  property: string;
  status: string;
  time: string;
}
