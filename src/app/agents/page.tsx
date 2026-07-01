import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import AgentsExplorer from "@/components/agent/AgentsExplorer";
import { getAgents } from "@/services/agent.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <>
      <Navbar />

      <main>
        <section className="border-b border-border bg-[radial-gradient(circle_at_70%_10%,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,#ffffff,#f8fafc)]">
          <Container>
            <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.8fr] lg:items-end lg:py-24">
              <div>
                <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                  Verified Real Estate Agents
                </div>

                <h1 className="max-w-4xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Connect with trusted GCC property professionals.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Discover experienced agents specialized in luxury properties,
                  investment opportunities, rentals, commercial spaces, and
                  off-plan projects.
                </p>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-border bg-white p-5 shadow-xl shadow-slate-200/70 sm:grid-cols-3">
                <div>
                  <p className="font-heading text-3xl font-bold text-primary">
                    180+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Verified Agents
                  </p>
                </div>

                <div>
                  <p className="font-heading text-3xl font-bold text-primary">
                    12+
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    GCC Cities
                  </p>
                </div>

                <div>
                  <p className="font-heading text-3xl font-bold text-primary">
                    4.8
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Avg Rating
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Section className="bg-white">
          <Container>
            <AgentsExplorer agents={agents} />
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
