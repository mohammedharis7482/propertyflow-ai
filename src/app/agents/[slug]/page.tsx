import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Languages,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

import { ApiError } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { AgentImage } from "@/components/agent/AgentImage";
import AgentDetailsActions from "@/components/agent/AgentDetailsActions";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { getAgentBySlug } from "@/services/agent.service";
import { getFeaturedProperties } from "@/services/property.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

export default async function AgentDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let agent;
  let featuredProperties;

  try {
    [agent, featuredProperties] = await Promise.all([
      getAgentBySlug(slug),
      getFeaturedProperties(),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return <AgentDetailError />;
  }

  if (!agent) {
    notFound();
  }

  const specialities = agent.specialities ?? [
    "Luxury Sales",
    "Investment Advisory",
    "Residential Properties",
  ];

  const languages = agent.languages ?? ["English", "Arabic"];

  return (
    <>
      <Navbar />

      <main>
        <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
          <Container>
            <div className="py-6 sm:py-8">
              <Button variant="outline" asChild>
                <Link href="/agents">
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Agents
                </Link>
              </Button>
            </div>

            <div className="grid gap-8 pb-12 sm:gap-10 sm:pb-14 lg:grid-cols-[360px_1fr] lg:items-end">
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-200/70">
                <div className="relative h-[300px] overflow-hidden rounded-[1.5rem] bg-secondary sm:h-[420px]">
                  <AgentImage
                    src={agent.image}
                    alt={agent.name}
                    fallbackSeed={agent.slug || agent.id}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 360px"
                    quality={90}
                  />
                </div>

                <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold shadow-sm backdrop-blur">
                  <Star size={15} className="fill-yellow-500 text-yellow-500" />
                  {agent.rating}
                </div>
              </div>

              <div>
                <div className="mb-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                  <BadgeCheck size={16} className="mr-2" />
                  Verified Property Advisor
                </div>

                <h1 className="break-words font-heading text-3xl font-bold tracking-tight sm:text-5xl lg:text-[58px] lg:leading-[1.05]">
                  {agent.name}
                </h1>

                <p className="mt-3 max-w-3xl break-words text-lg font-semibold text-primary sm:text-xl">
                  {agent.role}
                </p>

                <p className="mt-4 flex items-start gap-2 text-base text-muted-foreground sm:text-lg">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-primary" />
                  <span className="break-words">{agent.location}</span>
                </p>

                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {agent.about ??
                    "An experienced real estate professional focused on premium GCC properties, client-first advisory, and data-informed property decisions."}
                </p>

                <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="break-words font-heading text-3xl font-bold leading-tight text-primary">
                      {agent.properties}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Properties
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="break-words font-heading text-3xl font-bold leading-tight text-primary">
                      {agent.experience}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Experience
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                    <p className="break-words font-heading text-3xl font-bold leading-tight text-primary">
                      {agent.rating}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Section className="bg-white">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <div>
                <div>
                  <h2 className="font-heading text-3xl font-bold">
                    Specialities
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {specialities.map((item) => (
                      <span
                        key={item}
                        className="max-w-full break-words rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 rounded-[2rem] border border-border bg-secondary/60 p-6">
                  <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                    About {agent.name}
                  </h2>

                  <p className="mt-5 max-w-3xl break-words text-base leading-8 text-muted-foreground">
                    {agent.name} helps buyers, investors, and property owners
                    make confident real estate decisions using local market
                    knowledge, premium listing access, and client-focused
                    advisory.
                  </p>
                </div>

                <div className="mt-10">
                  <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                    Featured Listings
                  </h2>

                  <p className="mt-2 text-muted-foreground">
                    Premium listings currently represented or recommended by
                    this advisor.
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {featuredProperties.slice(0, 2).map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-[2rem] border border-border bg-white p-6 shadow-xl shadow-slate-200/70">
                  <h3 className="font-heading text-xl font-bold">
                    Contact Agent
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    Request details, schedule a viewing, or ask for investment
                    guidance.
                  </p>

                  <AgentDetailsActions
                    agentName={agent.name}
                    agentRole={agent.role}
                    propertySlug={featuredProperties[0]?.slug}
                  />
                </div>

                <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <BriefcaseBusiness
                      size={22}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <div className="min-w-0">
                      <p className="font-heading font-bold">Experience</p>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        {agent.experience}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
                    <Languages
                      size={22}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <div className="min-w-0">
                      <p className="font-heading font-bold">Languages</p>
                      <p className="mt-1 break-words text-sm text-muted-foreground">
                        {languages.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}

function AgentDetailError() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F8FAF9]">
        <Container>
          <div className="flex min-h-[62vh] items-center justify-center py-16">
            <div className="max-w-xl rounded-[2rem] border border-border bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                <Sparkles size={24} />
              </div>
              <h1 className="mt-5 font-heading text-3xl font-bold">
                Agent details are temporarily unavailable.
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                The advisor profile could not be loaded from the agent API.
                Please try again in a moment or return to the agents page.
              </p>
              <Button className="mt-6 rounded-2xl" asChild>
                <Link href="/agents">Back to Agents</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
