import { BarChart3, CalendarCheck, Home, MessageCircle } from "lucide-react";
import {
  DashboardActivity,
  DashboardInquiry,
  DashboardStat,
} from "@/types/dashboard";

export const agentStats: DashboardStat[] = [
  {
    title: "Active Listings",
    value: "32",
    change: "+5 this month",
    trend: "up",
    icon: Home,
  },
  {
    title: "New Inquiries",
    value: "48",
    change: "+18%",
    trend: "up",
    icon: MessageCircle,
  },
  {
    title: "Viewings",
    value: "14",
    change: "This week",
    trend: "neutral",
    icon: CalendarCheck,
  },
  {
    title: "Conversion Rate",
    value: "24%",
    change: "+3.2%",
    trend: "up",
    icon: BarChart3,
  },
];

export const agentInquiries: DashboardInquiry[] = [
  {
    id: "1",
    name: "Mohammed Ali",
    property: "Palm View Residence",
    status: "New",
    time: "10 min ago",
  },
  {
    id: "2",
    name: "Sarah Ahmed",
    property: "Marina Sky Apartment",
    status: "Contacted",
    time: "1 hour ago",
  },
  {
    id: "3",
    name: "David Khan",
    property: "Dubai Hills Family Villa",
    status: "Viewing Scheduled",
    time: "4 hours ago",
  },
];

export const agentActivities: DashboardActivity[] = [
  {
    id: "1",
    title: "New lead received",
    description: "A buyer asked about Palm View Residence.",
    time: "10 min ago",
    type: "inquiry",
  },
  {
    id: "2",
    title: "Listing performance updated",
    description: "Marina Sky Apartment received 240 views this week.",
    time: "2 hours ago",
    type: "property",
  },
  {
    id: "3",
    title: "Viewing scheduled",
    description: "Dubai Hills Family Villa viewing booked.",
    time: "Yesterday",
    type: "appointment",
  },
];