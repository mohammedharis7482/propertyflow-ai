import Link from "next/link";
import { Home, Search } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-background">
        <Container>
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-emerald-50 px-5 py-2 text-sm font-semibold text-primary">
              Error 404
            </div>

            <h1 className="mt-6 font-heading text-6xl font-bold">
              Page Not Found
            </h1>

            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/">
                  <Home size={18} className="mr-2" />
                  Back Home
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/properties">
                  <Search size={18} className="mr-2" />
                  Browse Properties
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
