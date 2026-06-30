import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Sparkles } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { aboutFeatures, aboutStats, techStack } from "@/data/about";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="border-b border-border bg-[radial-gradient(circle_at_72%_18%,rgba(16,185,129,0.13),transparent_34%),linear-gradient(180deg,#ffffff,#f8fafc)]">
          <Container>
            <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.85fr] lg:items-center lg:py-24">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                  <Sparkles size={16} className="mr-2" />
                  About PropertyFlow AI
                </div>

                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-[58px] lg:leading-[1.05]">
                  Building smarter real estate experiences for GCC markets.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  PropertyFlow AI combines property discovery, verified agents,
                  market intelligence, and AI-powered recommendations into one
                  modern real estate platform.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {["AI Matching", "Verified Listings", "Market Intelligence"].map(
                    (item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm"
                      >
                        <CheckCircle2 size={16} className="text-primary" />
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-border bg-white p-6 shadow-xl shadow-slate-200/70">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                  <Building2 size={28} />
                </div>

                <h2 className="mt-6 font-heading text-2xl font-bold">
                  Our Mission
                </h2>

                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Help buyers, investors, tenants, owners, and agents make
                  confident property decisions through clean data, premium UI,
                  and intelligent digital workflows.
                </p>
              </div>
            </div>
          </Container>
        </section>

        <Section className="bg-white">
          <Container>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {aboutStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm"
                >
                  <p className="font-heading text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="bg-secondary/40">
          <Container>
            <SectionHeader
              badge="Platform Capabilities"
              title="Designed as a complete real estate ecosystem."
              description="PropertyFlow AI is planned to connect public discovery, dashboards, AI recommendations, market analytics, and mobile experiences."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {aboutFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[1.5rem] border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                      <Icon size={24} />
                    </div>

                    <h3 className="mt-5 font-heading text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        <Section className="bg-white">
          <Container>
            <div className="grid gap-8 rounded-[2rem] border border-border bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12),transparent_35%),#ffffff] p-8 shadow-xl shadow-slate-200/70 lg:grid-cols-[1fr_.85fr] lg:p-12">
              <div>
                <div className="mb-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
                  Platform Vision
                </div>

                <h2 className="font-heading text-3xl font-bold tracking-tight lg:text-4xl">
                  The future of real estate intelligence.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                  PropertyFlow AI will grow from a premium website into a
                  complete platform with user dashboards, agent workflows, admin
                  management, analytics, AI assistant features, and future mobile
                  access.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
  {[
    "Public Website",
    "User Dashboard",
    "Agent Dashboard",
    "Admin Dashboard",
    "AI Assistant",
    "Mobile App",
  ].map((item, index) => (
    <div
      key={item}
      className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-primary">
        {String(index + 1).padStart(2, "0")}
      </div>

      <p className="font-heading text-base font-bold text-foreground">
        {item}
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Planned as part of the complete PropertyFlow AI platform ecosystem.
      </p>
    </div>
  ))}
</div>
            </div>
          </Container>
        </Section>

        <Section className="bg-secondary/40">
          <Container>
            <SectionHeader
              badge="Technology Foundation"
              title="Modern full-stack architecture planned for scale."
              description="The current website is the first phase. The complete platform will expand into backend, authentication, analytics, AI, and mobile."
            />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {techStack.map((tech) => {
                const Icon = tech.icon;

                return (
                  <div
                    key={tech.name}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                      <Icon size={20} />
                    </div>

                    <span className="text-sm font-semibold text-foreground">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </Container>
        </Section>

        <Section className="bg-white">
          <Container>
            <div className="rounded-[2rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-8 text-white shadow-2xl shadow-emerald-900/20 lg:p-12">
              <div className="max-w-3xl">
                <h2 className="font-heading text-3xl font-bold lg:text-4xl">
                  Ready to discover smarter real estate?
                </h2>

                <p className="mt-4 text-base leading-8 text-emerald-50">
                  Explore premium properties, verified agents, and AI-powered
                  market insights through PropertyFlow AI.
                </p>

                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-8 rounded-full"
                  asChild
                >
                  <Link href="/properties">
                    Explore Properties
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}