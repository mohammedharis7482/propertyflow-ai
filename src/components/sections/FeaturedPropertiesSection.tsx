import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties } from "@/services/property.service";

export default async function FeaturedPropertiesSection() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <Section className="bg-white">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            badge="Featured Listings"
            title="Premium properties selected for smart investors and modern buyers."
            description="Explore high-quality properties across Dubai, Abu Dhabi, Doha, and other growing GCC real estate markets."
            center={false}
          />

          <Button variant="outline" asChild>
            <Link href="/properties">
              View All Properties
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-border bg-secondary/50 p-10 text-center">
            <h3 className="font-heading text-2xl font-bold">
              Featured listings are being refreshed.
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              Premium properties from the live inventory will appear here as soon
              as the backend is available.
            </p>
          </div>
        )}
      </Container>
    </Section>
  );
}
