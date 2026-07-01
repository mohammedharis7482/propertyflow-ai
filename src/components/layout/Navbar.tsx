"use client";

import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { mainNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/85 backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300",
        scrolled
          ? "border-border/80 shadow-sm shadow-slate-200/70"
          : "border-border/50 shadow-none"
      )}
    >
      <Container>
        <nav
          className={cn(
            "flex min-w-0 items-center justify-between gap-3 transition-[height] duration-300 sm:h-[76px] lg:h-[88px]",
            scrolled ? "h-14" : "h-16"
          )}
        >
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white shadow-lg shadow-emerald-900/20 sm:h-11 sm:w-11 sm:rounded-2xl lg:h-12 lg:w-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.35),transparent_36%)]" />
              <span className="relative font-heading text-sm font-extrabold tracking-tight sm:text-base">
                PF
              </span>
            </div>

            <div className="min-w-0 leading-none">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-heading text-[17px] font-bold tracking-[-0.03em] text-foreground sm:text-[20px] lg:text-[21px]">
                  PropertyFlow
                </span>

                <span className="shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-primary sm:px-2 sm:text-xs">
                  AI
                </span>
              </div>

              <p className="mt-1 truncate text-[11px] font-medium tracking-wide text-muted-foreground sm:mt-1.5 sm:text-xs">
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
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-white shadow-sm sm:h-11 sm:w-11 sm:rounded-2xl lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        <div
          className={cn(
            "grid overflow-hidden transition-all duration-300 lg:hidden",
            open ? "grid-rows-[1fr] pb-4 sm:pb-6" : "grid-rows-[0fr]"
          )}
        >
          <div className="min-h-0">
            <div className="rounded-[1.35rem] border border-border bg-white p-2.5 shadow-xl sm:rounded-[1.5rem] sm:p-3">
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
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition sm:rounded-2xl sm:px-4 sm:py-3",
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
