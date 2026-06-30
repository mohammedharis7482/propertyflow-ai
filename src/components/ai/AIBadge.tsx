import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface AIBadgeProps {
  label?: string;
  tone?: "emerald" | "soft" | "gold";
  className?: string;
}

export default function AIBadge({
  label = "PropertyFlow AI",
  tone = "emerald",
  className,
}: AIBadgeProps) {
  const toneClass = {
    emerald: "border-emerald-200 bg-emerald-50 text-primary",
    soft: "border-border bg-[#F8FAF9] text-muted-foreground",
    gold: "border-amber-200 bg-amber-50 text-amber-700",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        toneClass,
        className
      )}
    >
      <Sparkles size={13} className="mr-1.5" />
      {label}
    </span>
  );
}
