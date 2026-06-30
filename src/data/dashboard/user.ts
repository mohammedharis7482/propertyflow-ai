import { CalendarCheck, Heart, MessageCircle, Sparkles } from "lucide-react";
import {
  DashboardActivity,
  DashboardProperty,
  DashboardStat,
} from "@/types/dashboard";

export const userStats: DashboardStat[] = [
  {
    title: "Saved Properties",
    value: "18",
    change: "+4 this week",
    trend: "up",
    icon: Heart,
  },
  {
    title: "Active Inquiries",
    value: "6",
    change: "+2 new",
    trend: "up",
    icon: MessageCircle,
  },
  {
    title: "Viewings Booked",
    value: "3",
    change: "Next: Tomorrow",
    trend: "neutral",
    icon: CalendarCheck,
  },
  {
    title: "AI Matches",
    value: "12",
    change: "96% best fit",
    trend: "up",
    icon: Sparkles,
  },
];

export const recommendedProperties: DashboardProperty[] = [
  {
    id: "1",
    title: "Palm View Residence",
    location: "Palm Jumeirah, Dubai",
    price: "AED 4.8M",
    status: "96% AI Match",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Marina Sky Apartment",
    location: "Dubai Marina, UAE",
    price: "AED 2.2M",
    status: "91% AI Match",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=900&auto=format&fit=crop",
  },
];

export const userActivities: DashboardActivity[] = [
  {
    id: "1",
    title: "New AI recommendation",
    description: "Palm View Residence was added to your recommendations.",
    time: "12 min ago",
    type: "property",
  },
  {
    id: "2",
    title: "Viewing confirmed",
    description: "Dubai Marina apartment viewing confirmed for tomorrow.",
    time: "1 hour ago",
    type: "appointment",
  },
  {
    id: "3",
    title: "Agent replied",
    description: "Ahmed Al Mansoori responded to your inquiry.",
    time: "3 hours ago",
    type: "inquiry",
  },
];