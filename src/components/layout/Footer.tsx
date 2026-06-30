import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/layout/Container";
import { mainNavigation } from "@/constants/navigation";

const platformLinks = [
  "User Dashboard",
  "Agent Dashboard",
  "Admin Dashboard",
  "AI Recommendations",
];

const legalLinks = ["Privacy Policy", "Terms", "Security"];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/70">
      <Container>
        <div className="grid gap-12 py-14 lg:grid-cols-[1.5fr_.8fr_.9fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Building2 size={22} />
              </div>

              <div>
                <p className="font-heading text-xl font-bold">
                  PropertyFlow AI
                </p>
                <p className="text-sm text-muted-foreground">
                  AI-powered real estate platform
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
              A premium full-stack real estate platform built for property
              discovery, agent workflows, market intelligence, and AI-powered
              decision making.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">Pages</h4>
            <div className="mt-5 flex flex-col gap-3">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground transition hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">Platform</h4>
            <div className="mt-5 flex flex-col gap-3">
              {platformLinks.map((item) => (
                <p key={item} className="text-sm text-muted-foreground">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold">Contact</h4>
            <div className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                Dubai, UAE
              </p>
              <p className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                hello@propertyflow.ai
              </p>
              <p className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                +971 00 000 0000
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-border py-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>© 2026 PropertyFlow AI. All rights reserved.</p>

          <div className="flex flex-wrap gap-4">
            {legalLinks.map((item) => (
              <span key={item} className="transition hover:text-primary">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}