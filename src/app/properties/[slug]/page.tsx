import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  MapPin,
  Maximize2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { ApiError } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PropertyAIMatchCard from "@/components/property/PropertyAIMatchCard";
import PropertyDetailsActions from "@/components/property/PropertyDetailsActions";
import { Button } from "@/components/ui/button";
import { getPropertyBySlug } from "@/services/property.service";

export const dynamic = "force-dynamic";

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { slug } = await params;

  if (!isValidSlug(slug)) {
    notFound();
  }

  let property;

  try {
    property = await getPropertyBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    return <PropertyDetailError />;
  }

  if (!property) {
    notFound();
  }

  const amenities = property.amenities ?? [
    "Verified Listing",
    "Premium Location",
    "Parking",
    "Security",
    "Smart Home Ready",
    "Nearby Facilities",
  ];
  const galleryImages =
    property.gallery && property.gallery.length > 0
      ? property.gallery
      : [property.image, property.image];
  const previewImages = [
    galleryImages[0] ?? property.image,
    galleryImages[1] ?? galleryImages[0] ?? property.image,
  ];

  return (
    <>
      <Navbar />

      <main>
        <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
          <Container>
            <div className="py-8">
              <Button variant="outline" asChild>
                <Link href="/properties">
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Properties
                </Link>
              </Button>
            </div>

            <div className="grid gap-8 pb-10 sm:pb-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                  {property.type}
                </div>

                <h1 className="max-w-4xl break-words font-heading text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {property.title}
                </h1>

                <p className="mt-4 flex items-start gap-2 text-base text-muted-foreground sm:text-lg">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-primary" />
                  <span className="break-words">{property.location}</span>
                </p>
              </div>

              <div className="min-w-0 lg:text-right">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Price
                </p>
                <p className="mt-2 break-words font-heading text-3xl font-bold leading-tight text-primary sm:text-4xl">
                  {property.price}
                </p>

                <PropertyDetailsActions
                  propertySlug={property.slug}
                  propertyTitle={property.title}
                  propertyLocation={property.location}
                />
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-white">
          <Container>
            <div className="grid gap-4 py-6 sm:py-8 lg:grid-cols-[1.4fr_.6fr]">
              <div className="relative h-[300px] overflow-hidden rounded-[1.5rem] bg-secondary sm:h-[420px] sm:rounded-[2rem] lg:h-[520px]">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {previewImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-[180px] overflow-hidden rounded-[1.5rem] bg-secondary sm:h-[220px] sm:rounded-[2rem] lg:h-[252px]"
                  >
                    <Image
                      src={image}
                      alt={`${property.title} preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <Section className="bg-white">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-secondary p-5">
                    <BedDouble size={22} className="text-primary" />
                    <p className="mt-3 break-words font-heading text-2xl font-bold leading-tight">
                      {property.beds}
                    </p>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary p-5">
                    <Bath size={22} className="text-primary" />
                    <p className="mt-3 break-words font-heading text-2xl font-bold leading-tight">
                      {property.baths}
                    </p>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary p-5">
                    <Maximize2 size={22} className="text-primary" />
                    <p className="mt-3 break-words font-heading text-2xl font-bold leading-tight">
                      {property.area}
                    </p>
                    <p className="text-sm text-muted-foreground">Area</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary p-5">
                    <Building2 size={22} className="text-primary" />
                    <p className="mt-3 break-words font-heading text-2xl font-bold leading-tight">
                      {property.status}
                    </p>
                    <p className="text-sm text-muted-foreground">Status</p>
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="font-heading text-3xl font-bold">
                    Property Overview
                  </h2>

                  <p className="mt-5 max-w-3xl break-words text-base leading-8 text-muted-foreground">
                    {property.description ??
                      "This premium property is designed for modern living with strong location value, high-quality interiors, and excellent access to lifestyle, business, and investment opportunities."}
                  </p>
                </div>

                <div className="mt-10">
                  <h2 className="font-heading text-3xl font-bold">
                    Amenities
                  </h2>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {amenities.map((item) => (
                      <div
                        key={item}
                        className="flex min-w-0 items-start gap-3 rounded-2xl border border-border bg-white p-4"
                      >
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                        <span className="break-words font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 rounded-[2rem] border border-border bg-secondary p-6">
                  <div className="mb-4 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
                    <Sparkles size={16} className="mr-2" />
                    AI Market Insight
                  </div>

                  <h3 className="font-heading text-2xl font-bold">
                    Strong match for premium lifestyle buyers.
                  </h3>

                  <p className="mt-3 leading-8 text-muted-foreground">
                    Based on location, property type, and current demand
                    signals, this listing shows strong lifestyle value and
                    long-term appreciation potential.
                  </p>
                </div>
              </div>

              <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                <PropertyAIMatchCard slug={property.slug} />

                <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold">
                    Contact Agent
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Speak with a verified property advisor for more details,
                    viewing schedule, and pricing support.
                  </p>

                  <PropertyDetailsActions
                    propertySlug={property.slug}
                    propertyTitle={property.title}
                    propertyLocation={property.location}
                    compact
                  />
                </div>

                <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <TrendingUp size={22} className="mt-0.5 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="font-heading font-bold">Market Growth</p>
                      <p className="text-sm text-muted-foreground">
                        Estimated location signal
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 font-heading text-3xl font-bold text-primary">
                    +18.6%
                  </p>
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

function PropertyDetailError() {
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
                Property details are temporarily unavailable.
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                The listing could not be loaded from the property API. Please try
                again in a moment or return to the listings page.
              </p>
              <Button className="mt-6 rounded-2xl" asChild>
                <Link href="/properties">Back to Properties</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function isValidSlug(slug?: string) {
  if (!slug) {
    return false;
  }

  const normalized = slug.trim().toLowerCase();
  return Boolean(normalized) && normalized !== "undefined" && normalized !== "null";
}
