import Link from "next/link";
import { Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIInsightCardProps {
  title: string;
  description: string;
  action?: string;
  href?: string;
}

export default function AIInsightCard({
  title,
  description,
  action = "View Insight",
  href,
}: AIInsightCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-5 text-white shadow-xl shadow-emerald-900/20 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-white/30" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <Brain size={24} />
        </div>

        <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-50">
          <Sparkles size={14} className="mr-1" />
          PropertyFlow AI
        </div>

        <h3 className="mt-4 font-heading text-xl font-bold leading-tight sm:text-2xl">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-emerald-50">
          {description}
        </p>

        {href ? (
          <Button variant="secondary" className="mt-6 rounded-2xl" asChild>
            <Link href={href}>{action}</Link>
          </Button>
        ) : (
          <Button variant="secondary" className="mt-6 rounded-2xl">
            {action}
          </Button>
        )}
      </div>
    </div>
  );
}
