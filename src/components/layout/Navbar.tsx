"use client";

import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { mainNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 backdrop-blur-xl">
      <Container>
        <nav className="flex h-[88px] min-w-0 items-center justify-between gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white shadow-lg shadow-emerald-900/20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_36%)]" />
              <span className="relative font-heading text-base font-extrabold tracking-tight">
                PF
              </span>
            </div>

            <div className="min-w-0 leading-none">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-heading text-[19px] font-bold tracking-[-0.03em] text-foreground sm:text-[21px]">
                  PropertyFlow
                </span>

                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-primary">
                  AI
                </span>
              </div>

              <p className="mt-1.5 truncate text-xs font-medium tracking-wide text-muted-foreground">
                Real Estate Intelligence
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-9 lg:flex">
            {mainNavigation.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-200",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {item.label === "Market Insights" ? "Insights" : item.label}

                  <span
                    className={cn(
                      "absolute -bottom-3 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
                      active && "w-full"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>

            <Button asChild className="rounded-full px-6">
              <Link href="/register">
                Get Started
                <ChevronRight size={17} className="ml-1" />
              </Link>
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white shadow-sm lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        <div
          className={cn(
            "grid overflow-hidden transition-all duration-300 lg:hidden",
            open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0">
            <div className="rounded-[1.5rem] border border-border bg-white p-3 shadow-xl">
              {mainNavigation.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-emerald-50 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>

                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
