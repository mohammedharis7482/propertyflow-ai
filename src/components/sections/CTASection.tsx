import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Sparkles } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#059669,#047857,#064e3b)] px-5 py-14 text-center shadow-2xl shadow-emerald-900/20 sm:rounded-[2rem] sm:px-10 sm:py-20 lg:px-16">
          <div className="absolute inset-x-0 top-0 h-px bg-white/30" />

          <div className="relative mx-auto max-w-4xl">
            <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
              <Sparkles size={16} className="mr-2" />
              Built for the future of real estate
            </div>

            <h2 className="mt-8 font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Start your smarter property journey with PropertyFlow AI.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg sm:leading-8">
              Discover premium properties, connect with verified agents, track
              market intelligence, and experience AI-powered real estate
              decision making.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-emerald-50">
              {["Verified listings", "Smart recommendations", "Market insights"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={17} />
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
                asChild
              >
                <Link href="/register">
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/70 bg-transparent px-8 text-white hover:bg-white hover:text-foreground"
                asChild
              >
                <Link href="/properties">Explore Properties</Link>
              </Button>
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl gap-6 border-t border-white/15 pt-10 sm:grid-cols-3">
              <div>
                <p className="font-heading text-3xl font-bold text-white">
                  2.4K+
                </p>
                <p className="mt-2 text-sm text-emerald-100">Active Listings</p>
              </div>

              <div>
                <p className="font-heading text-3xl font-bold text-white">
                  180+
                </p>
                <p className="mt-2 text-sm text-emerald-100">Verified Agents</p>
              </div>

              <div>
                <p className="font-heading text-3xl font-bold text-white">
                  12+
                </p>
                <p className="mt-2 text-sm text-emerald-100">GCC Locations</p>
              </div>
            </div>

            <div className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 backdrop-blur">
              <Building2 size={18} className="text-white" />
              <span className="text-sm font-medium text-white">
                PropertyFlow AI Platform
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
