import Link from "next/link";
import { ArrowRight, Brain, Sparkles, TrendingUp } from "lucide-react";
  
  import Navbar from "@/components/layout/Navbar";
  import Footer from "@/components/layout/Footer";
  import Container from "@/components/layout/Container";
  import Section from "@/components/layout/Section";
  import { Button } from "@/components/ui/button";
  
  import {
    marketStats,
    trendingLocations,
    insightArticles,
  } from "@/data/insights";
  
  export default function InsightsPage() {
    return (
      <>
        <Navbar />
  
        <main>
          {/* Hero */}
  
          <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff,#f8fafc)]">
            <Container>
              <div className="py-12 sm:py-20 lg:py-24">
                <div className="max-w-4xl">
                  <div className="mb-5 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800 sm:text-sm">
                    <Sparkles size={16} className="mr-2" />
                    AI-Powered Market Intelligence
                  </div>
  
                  <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Understand where the real estate market is moving.
                  </h1>
  
                  <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
                    Analyze pricing trends, rental demand, investment potential,
                    and growth opportunities across premium GCC locations.
                  </p>
                </div>
              </div>
            </Container>
          </section>
  
          {/* KPI Cards */}
  
          <Section>
            <Container>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {marketStats.map((stat) => (
                  <div
                    key={stat.title}
                    className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6"
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
  
                    <p className="mt-3 font-heading text-4xl font-bold text-primary sm:text-5xl">
                      {stat.value}
                    </p>
  
                    <p className="mt-3 text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </Section>
  
          {/* Trending Locations */}
  
          <Section className="bg-secondary/40">
            <Container>
              <div className="mb-12">
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                  Trending Locations
                </h2>
  
                <p className="mt-3 text-muted-foreground">
                  Top performing GCC markets based on demand and investment
                  potential.
                </p>
              </div>
  
              <div className="grid gap-6 lg:grid-cols-3">
                {trendingLocations.map((location) => (
                  <div
                    key={location.name}
                    className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6"
                  >
                    <h3 className="font-heading text-2xl font-bold">
                      {location.name}
                    </h3>
  
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Growth</span>
                        <span className="font-semibold text-primary">
                          {location.growth}
                        </span>
                      </div>
  
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Demand Score
                        </span>
                        <span className="font-semibold">
                          {location.demand}/100
                        </span>
                      </div>
  
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Investment Score
                        </span>
                        <span className="font-semibold">
                          {location.investment}/100
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </Section>
  
          {/* Insights */}
  
          <Section>
            <Container>
              <div className="mb-12">
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                  Market Reports & Insights
                </h2>
  
                <p className="mt-3 text-muted-foreground">
                  Data-driven analysis of premium real estate trends.
                </p>
              </div>
  
              <div className="grid gap-6 lg:grid-cols-2">
                {insightArticles.map((article) => (
                  <article
                    key={article.title}
                    className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition hover:shadow-xl sm:rounded-[2rem] sm:p-6"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-primary">
                      {article.category}
                    </div>
  
                    <h3 className="font-heading text-xl font-bold sm:text-2xl">
                      {article.title}
                    </h3>
  
                    <p className="mt-4 leading-8 text-muted-foreground">
                      {article.description}
                    </p>
  
                    <Button variant="ghost" className="mt-6 px-0" asChild>
                      <Link href="/dashboard/user/recommendations">
                        Read Report
                        <ArrowRight size={18} className="ml-2" />
                      </Link>
                    </Button>
                  </article>
                ))}
              </div>
            </Container>
          </Section>
  
          {/* AI Recommendation */}
  
          <Section className="bg-secondary/40">
            <Container>
              <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-xl shadow-slate-200/60 sm:rounded-[2rem] sm:p-8 lg:p-12">
                <div className="mb-5 inline-flex items-center rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-primary">
                  <Brain size={16} className="mr-2" />
                  AI Recommendation Engine
                </div>
  
                <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                  AI suggests Palm Jumeirah and Dubai Hills for long-term growth.
                </h2>
  
                <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Based on demand signals, rental activity, property appreciation,
                  and buyer interest, these locations currently show strong
                  long-term investment potential.
                </p>
  
                <div className="mt-8 grid gap-4 sm:flex sm:flex-wrap">
                  <div className="rounded-2xl bg-secondary px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      Confidence Score
                    </p>
  
                    <p className="font-heading text-3xl font-bold text-primary">
                      96%
                    </p>
                  </div>
  
                  <div className="rounded-2xl bg-secondary px-6 py-4">
                    <p className="text-sm text-muted-foreground">
                      Growth Potential
                    </p>
  
                    <p className="font-heading text-3xl font-bold text-primary">
                      High
                    </p>
                  </div>
                </div>
              </div>
            </Container>
          </Section>
  
          {/* CTA */}
  
          <Section>
            <Container>
              <div className="rounded-[1.75rem] bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white sm:rounded-[2rem] sm:p-10 lg:p-16">
                <div className="max-w-3xl">
                  <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm">
                    <TrendingUp size={16} className="mr-2" />
                    PropertyFlow AI
                  </div>
  
                  <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                    Make smarter real estate decisions.
                  </h2>
  
                  <p className="mt-5 text-base leading-7 text-emerald-50 sm:text-lg">
                    Combine property discovery, agent expertise, and AI-powered
                    market intelligence in one platform.
                  </p>
  
                  <Button
                    size="lg"
                    variant="secondary"
                    className="mt-8 rounded-full"
                    asChild
                  >
                    <Link href="/properties">Explore Properties</Link>
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
