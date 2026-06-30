import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";

const locations = [
  {
    name: "Dubai Marina",
    country: "UAE",
    properties: "520 Properties",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Palm Jumeirah",
    country: "UAE",
    properties: "310 Properties",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Downtown Dubai",
    country: "UAE",
    properties: "450 Properties",
    image:
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    name: "Doha West Bay",
    country: "Qatar",
    properties: "280 Properties",
    image:
      "https://images.unsplash.com/photo-1536323760109-ca8c07450053?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function PopularLocationsSection() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader
            badge="Popular Locations"
            title="Explore high-demand GCC property markets."
            description="Discover premium real estate opportunities across Dubai, Abu Dhabi, Doha, Riyadh, and other fast-growing locations."
            center={false}
          />

          <Link
            href="/properties"
            className="inline-flex items-center text-sm font-semibold text-primary"
          >
            View all locations
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {locations.map((location, index) => (
            <Link
              key={location.name}
              href="/properties"
              className={`group relative overflow-hidden rounded-3xl ${
                index === 0 ? "md:row-span-2" : ""
              }`}
            >
              <div
                className={`relative ${
                  index === 0 ? "h-[520px]" : "h-[247px]"
                }`}
              >
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="mb-3 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                    <MapPin size={14} className="mr-1 text-primary" />
                    {location.country}
                  </div>

                  <h3 className="font-heading text-3xl font-bold text-white">
                    {location.name}
                  </h3>

                  <p className="mt-2 text-sm text-white/80">
                    {location.properties}
                  </p>

                  <div className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground transition group-hover:bg-primary group-hover:text-white">
                    Explore area
                    <ArrowRight
                      size={16}
                      className="ml-2 transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}