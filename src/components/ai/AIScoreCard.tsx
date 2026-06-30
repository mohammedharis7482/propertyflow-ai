import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

import AIBadge from "@/components/ai/AIBadge";
import { safeText } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface AIScoreCardProps {
  title: string;
  score?: number | null;
  summary?: string | null;
  label?: string;
  loading?: boolean;
  footer?: ReactNode;
  compact?: boolean;
  className?: string;
}

export default function AIScoreCard({
  title,
  score,
  summary,
  label = "AI Signal",
  loading,
  footer,
  compact,
  className,
}: AIScoreCardProps) {
  const safeScore = Math.max(0, Math.min(100, Number(score ?? 0)));

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm",
        className
      )}
    >
      <div className="bg-[linear-gradient(135deg,#ecfdf5,#ffffff)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <AIBadge label={label} />
            <h3 className="mt-4 font-heading text-xl font-bold">{title}</h3>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
            <Sparkles size={22} />
          </div>
        </div>

        <div className={cn("mt-5 flex items-end gap-4", compact && "mt-4")}>
          <p className="font-heading text-5xl font-bold leading-none text-primary">
            {loading ? "--" : safeScore}
          </p>
          <p className="pb-1 text-sm font-semibold text-muted-foreground">/100</p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: loading ? "32%" : `${safeScore}%` }}
          />
        </div>
      </div>

      <div className="p-5">
        <p className="text-sm leading-7 text-muted-foreground">
          {loading
            ? "AI insights are being prepared."
            : safeText(summary, "AI insight is temporarily unavailable.")}
        </p>
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );
}
