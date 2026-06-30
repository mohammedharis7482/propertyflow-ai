import {
    BarChart3,
    Bot,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Sparkles,
  } from "lucide-react";
  
  import Container from "@/components/layout/Container";
  import Section from "@/components/layout/Section";
  import SectionHeader from "@/components/shared/SectionHeader";
  
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Matching",
      description:
        "Recommend properties based on budget, location, lifestyle, investment goals, and buyer intent.",
    },
    {
      icon: BarChart3,
      title: "Market Intelligence",
      description:
        "Show pricing movement, demand trends, location growth, and investment potential clearly.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Listings",
      description:
        "Build trust with verified agents, clean property details, accurate images, and transparent data.",
    },
    {
      icon: Clock,
      title: "Faster Decisions",
      description:
        "Help buyers, agents, and admins reduce manual work with structured workflows and smart insights.",
    },
  ];
  
  export default function WhyPropertyFlowSection() {
    return (
      <Section className="relative overflow-hidden bg-secondary/50">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-yellow-100/50 blur-3xl" />
  
        <Container className="relative">
          <SectionHeader
            badge="Why PropertyFlow AI"
            title="A smarter real estate experience for buyers, agents, and property teams."
            description="PropertyFlow AI combines premium property discovery, intelligent recommendations, agent productivity, and market analytics into one modern platform."
          />
  
          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
  
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                    <Icon size={28} />
                  </div>
  
                  <h3 className="mt-6 font-heading text-xl font-bold">
                    {feature.title}
                  </h3>
  
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
  
          <div className="mt-16 grid overflow-hidden rounded-3xl border border-border bg-white shadow-xl lg:grid-cols-[1fr_.9fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <div className="mb-5 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles size={16} className="mr-2" />
                Built for GCC real estate workflows
              </div>
  
              <h3 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                From property discovery to operational control.
              </h3>
  
              <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
                The future version of PropertyFlow AI will connect the public
                website with user, agent, and admin dashboards. This makes it more
                than a listing website — it becomes a complete real estate
                management system.
              </p>
  
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Public property discovery",
                  "Agent listing workflows",
                  "Admin performance control",
                  "AI recommendation engine",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-primary" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="border-t border-border bg-[radial-gradient(circle_at_top,#ecfdf5,transparent_45%),linear-gradient(135deg,#ffffff,#f8fafc)] p-8 lg:border-l lg:border-t-0">
              <div className="grid gap-4">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">AI match score</p>
                  <p className="mt-2 font-heading text-4xl font-bold text-primary">
                    96%
                  </p>
                </div>
  
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    Estimated market growth
                  </p>
                  <p className="mt-2 font-heading text-4xl font-bold">
                    +18.6%
                  </p>
                </div>
  
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    Faster property shortlisting
                  </p>
                  <p className="mt-2 font-heading text-4xl font-bold">
                    3.5x
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }