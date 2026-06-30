import {
    BarChart3,
    Bot,
    Building2,
    CheckCircle2,
    Database,
    Fingerprint,
    Globe2,
    Layers3,
    Rocket,
    ShieldCheck,
    Smartphone,
    Users,
  } from "lucide-react";
  
  export const aboutStats = [
    { value: "2.4K+", label: "Listed Properties" },
    { value: "180+", label: "Verified Agents" },
    { value: "12+", label: "GCC Cities" },
    { value: "96%", label: "AI Match Score" },
  ];
  
  export const aboutFeatures = [
    {
      icon: Bot,
      title: "AI Property Matching",
      description:
        "Smart recommendations based on location, budget, lifestyle, and investment intent.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Listings",
      description:
        "Clean property data, trusted agents, premium images, and transparent listing details.",
    },
    {
      icon: BarChart3,
      title: "Market Intelligence",
      description:
        "Pricing movement, demand signals, rental yield, and location growth insights.",
    },
    {
      icon: Users,
      title: "Trusted Advisors",
      description:
        "Connect with experienced GCC real estate agents and property consultants.",
    },
    {
      icon: Database,
      title: "Scalable Platform",
      description:
        "Designed to grow into public website, dashboards, analytics, and mobile app.",
    },
    {
      icon: Rocket,
      title: "Future Ready",
      description:
        "Built with modern full-stack architecture for AI and automation workflows.",
    },
  ];
  
  export const techStack = [
    { name: "Next.js", icon: Globe2 },
    { name: "TypeScript", icon: Layers3 },
    { name: "Tailwind CSS", icon: CheckCircle2 },
    { name: "shadcn/ui", icon: Fingerprint },
    { name: "PostgreSQL", icon: Database },
    { name: "Prisma", icon: Database },
    { name: "Auth.js", icon: ShieldCheck },
    { name: "FastAPI", icon: Bot },
    { name: "AI Services", icon: Bot },
    { name: "Flutter", icon: Smartphone },
    { name: "Dashboards", icon: Building2 },
    { name: "Analytics", icon: BarChart3 },
  ];