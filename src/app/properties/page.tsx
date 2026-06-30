import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PropertiesExplorer from "@/components/property/PropertiesExplorer";
import { getProperties } from "@/services/property.service";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <Navbar />

      <main>
        <section className="border-b border-border bg-[radial-gradient(circle_at_72%_18%,rgba(16,185,129,0.13),transparent_34%),linear-gradient(180deg,#ffffff,#f8fafc)]">
          <Container>
            <div className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_.75fr] lg:items-end lg:py-24">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                  Premium GCC Properties
                </div>

                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
                  Explore premium properties across high-growth GCC markets.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Browse curated villas, apartments, commercial spaces, and
                  investment-ready listings with clean data and premium visuals.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-[2rem] border border-border bg-white p-5 shadow-xl shadow-slate-200/70">
                <div>
                  <p className="font-heading text-3xl font-bold text-primary">
                    {properties.length}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Listings
                  </p>
                </div>

                <div>
                  <p className="font-heading text-3xl font-bold text-primary">
                    12+
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cities
                  </p>
                </div>

                <div>
                  <p className="font-heading text-3xl font-bold text-primary">
                    96%
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Match
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Section className="bg-white">
          <Container>
            <PropertiesExplorer properties={properties} />
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  );
}
