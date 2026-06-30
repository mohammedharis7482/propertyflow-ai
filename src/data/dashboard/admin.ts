import { Building2, ShieldCheck, Users, WalletCards } from "lucide-react";
import {
  DashboardActivity,
  DashboardInquiry,
  DashboardStat,
} from "@/types/dashboard";

export const adminStats: DashboardStat[] = [
  {
    title: "Total Properties",
    value: "2,420",
    change: "+124 this month",
    trend: "up",
    icon: Building2,
  },
  {
    title: "Verified Agents",
    value: "180",
    change: "+12 new",
    trend: "up",
    icon: ShieldCheck,
  },
  {
    title: "Platform Users",
    value: "8.6K",
    change: "+21%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Lead Value",
    value: "AED 4.2M",
    change: "+14.8%",
    trend: "up",
    icon: WalletCards,
  },
];

export const adminApprovals: DashboardInquiry[] = [
  {
    id: "1",
    name: "New Agent Verification",
    property: "Ahmed Real Estate LLC",
    status: "Pending",
    time: "20 min ago",
  },
  {
    id: "2",
    name: "Property Approval",
    property: "Downtown Executive Home",
    status: "Review",
    time: "1 hour ago",
  },
  {
    id: "3",
    name: "Listing Image Update",
    property: "Palm View Residence",
    status: "Pending",
    time: "3 hours ago",
  },
];

export const adminActivities: DashboardActivity[] = [
  {
    id: "1",
    title: "New property submitted",
    description: "Business Bay Office Suite awaiting approval.",
    time: "20 min ago",
    type: "property",
  },
  {
    id: "2",
    title: "Agent verification request",
    description: "A new agency requested verification.",
    time: "1 hour ago",
    type: "system",
  },
  {
    id: "3",
    title: "High inquiry volume",
    description: "Dubai Marina listings increased by 18%.",
    time: "Today",
    type: "inquiry",
  },
];