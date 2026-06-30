"use client";

import { useState } from "react";
import { RefreshCw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RecommendationRefreshAction() {
  const [refreshing, setRefreshing] = useState(false);
  const [updated, setUpdated] = useState(false);

  function refreshMatches() {
    setRefreshing(true);
    setUpdated(false);

    window.setTimeout(() => {
      setRefreshing(false);
      setUpdated(true);
    }, 650);
  }

  return (
    <div className="grid gap-2 sm:justify-items-end">
      <Button
        variant="outline"
        className="rounded-2xl bg-white"
        onClick={refreshMatches}
        disabled={refreshing}
        type="button"
      >
        {refreshing ? (
          <RefreshCw size={18} className="mr-2 animate-spin" />
        ) : (
          <Sparkles size={18} className="mr-2" />
        )}
        {refreshing ? "Refreshing..." : "Refresh Matches"}
      </Button>

      {updated && (
        <p className="text-xs font-medium text-primary">
          AI matches refreshed locally.
        </p>
      )}
    </div>
  );
}
