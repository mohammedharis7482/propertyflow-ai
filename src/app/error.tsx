"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-12">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={30} />
        </div>

        <h1 className="mt-6 font-heading text-4xl font-bold">
          Something needs a refresh.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
          The interface hit an unexpected issue. You can retry this screen or
          return to the property discovery experience.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button className="rounded-2xl" onClick={() => unstable_retry()}>
            <RefreshCw size={17} className="mr-2" />
            Try Again
          </Button>

          <Button variant="outline" className="rounded-2xl bg-white" asChild>
            <Link href="/properties">Explore Properties</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
