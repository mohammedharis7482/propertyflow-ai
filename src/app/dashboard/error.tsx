"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
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
    <main className="min-h-screen bg-[#F6F8F7] px-5 py-10">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center rounded-[2rem] border border-border bg-white p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertTriangle size={30} />
        </div>

        <h1 className="mt-6 font-heading text-4xl font-bold">
          Dashboard data could not load.
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
          This screen is protected by a frontend error boundary. Retry the
          request or sign in again if your session has expired.
        </p>

        <Button className="mt-7 rounded-2xl" onClick={() => unstable_retry()}>
          <RefreshCw size={17} className="mr-2" />
          Retry Dashboard
        </Button>
      </div>
    </main>
  );
}
