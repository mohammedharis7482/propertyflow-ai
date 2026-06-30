import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import AgentCard from "@/components/agent/AgentCard";
import { Button } from "@/components/ui/button";
import { getFeaturedAgents } from "@/services/agent.service";

export default async function TopAgentsSection() {
  const topAgents = await getFeaturedAgents();

  return (
    <Section className="bg-secondary/40">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            badge="Top Agents"
            title="Connect with verified real estate professionals."
            description="Discover experienced agents across GCC markets who can guide buyers, sellers, and investors with confidence."
            center={false}
          />

          <Button variant="outline" asChild>
            <Link href="/agents">
              View All Agents
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>

        {topAgents.length > 0 ? (
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topAgents.slice(0, 3).map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-white p-10 text-center">
            <h3 className="font-heading text-2xl font-bold">
              Agent profiles are being refreshed.
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              Verified advisors from the live directory will appear here as soon
              as the backend is available.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
