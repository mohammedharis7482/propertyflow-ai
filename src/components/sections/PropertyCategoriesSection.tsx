import Link from "next/link";
import {
  Building2,
  Home,
  Hotel,
  Landmark,
  Building,
  Warehouse,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";

const categories = [
  {
    title: "Apartments",
    icon: Building2,
    count: "1,240 Properties",
  },
  {
    title: "Villas",
    icon: Home,
    count: "850 Properties",
  },
  {
    title: "Luxury Homes",
    icon: Hotel,
    count: "320 Properties",
  },
  {
    title: "Commercial",
    icon: Landmark,
    count: "670 Properties",
  },
  {
    title: "Office Spaces",
    icon: Building,
    count: "480 Properties",
  },
  {
    title: "Warehouses",
    icon: Warehouse,
    count: "190 Properties",
  },
];

export default function PropertyCategoriesSection() {
  return (
    <Section className="bg-secondary/40">
      <Container>
        <SectionHeader
          badge="Categories"
          title="Browse properties by category."
          description="Explore residential, commercial, luxury, and investment opportunities across GCC markets."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href="/properties"
                className="group rounded-3xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
                  <Icon size={28} />
                </div>

                <h3 className="mt-5 font-heading text-xl font-bold">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {category.count}
                </p>

                <div className="mt-6 flex items-center text-primary">
                  <span className="text-sm font-semibold">
                    Explore
                  </span>

                  <ArrowRight
                    size={18}
                    className="ml-2 transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}