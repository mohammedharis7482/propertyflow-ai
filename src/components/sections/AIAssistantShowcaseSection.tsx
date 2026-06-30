import {
  Bot,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Wand2,
} from "lucide-react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";

const benefits = [
  "Natural language property search",
  "Personalized property recommendations",
  "Location and ROI comparison",
  "Buyer and investor decision guidance",
];

const suggestions = [
  "Find villas under AED 5M near Palm Jumeirah",
  "Compare Dubai Marina vs Downtown Dubai ROI",
  "Show family-friendly apartments with metro access",
];

export default function AIAssistantShowcaseSection() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <SectionHeader
              badge="AI Assistant"
              title="Guide every property decision with intelligent assistance."
              description="Ask natural questions, compare properties, understand market signals, and shortlist better options faster with an AI-powered real estate assistant."
              center={false}
            />

            <div className="mt-8 grid gap-4">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <Button className="mt-8" size="lg" asChild>
              <Link href="/dashboard/user/recommendations">
                <Sparkles size={18} className="mr-2" />
                Preview AI Experience
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative rounded-[2rem] border border-border bg-secondary/70 p-4 shadow-2xl shadow-slate-200/80">
              <div className="rounded-[1.5rem] border border-border bg-white">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Bot size={22} />
                    </div>

                    <div>
                      <p className="font-heading font-bold">
                        PropertyFlow Assistant
                      </p>
                      <p className="text-xs text-muted-foreground">
                        AI property advisor
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-primary">
                    Online
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <div className="max-w-[86%] rounded-2xl rounded-tl-sm bg-secondary p-4">
                    <p className="text-sm leading-7 text-foreground">
                      Hi, I can help you discover properties, compare locations,
                      and understand investment signals.
                    </p>
                  </div>

                  <div className="ml-auto max-w-[86%] rounded-2xl rounded-tr-sm bg-primary p-4">
  <p className="text-sm leading-7 text-white">
    Find me a luxury villa in Dubai with good ROI potential.
  </p>
</div>

                  <div className="rounded-2xl rounded-tl-sm bg-secondary p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Wand2 size={17} className="text-primary" />
                      Smart recommendation
                    </div>

                    <p className="text-sm leading-7 text-muted-foreground">
                      Palm Jumeirah and Dubai Hills show strong lifestyle value,
                      premium demand, and long-term appreciation potential.
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-muted-foreground">
                          Best match
                        </p>
                        <p className="mt-1 text-sm font-semibold">
                          Palm View Residence
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-3">
                        <p className="text-xs text-muted-foreground">
                          Match score
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary">
                          96%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-white p-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageCircle size={17} />
                      Ask about location, budget, ROI, or lifestyle...
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
