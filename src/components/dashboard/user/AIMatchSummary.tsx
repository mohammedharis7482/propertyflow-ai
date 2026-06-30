import { Brain, CheckCircle2, TrendingUp } from "lucide-react";

const reasons = [
  "Strong location demand",
  "High rental yield signal",
  "Low investment risk",
  "Matches saved preferences",
];

export default function AIMatchSummary() {
  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
          <Brain size={24} />
        </div>

        <div>
          <h3 className="font-heading text-xl font-bold">AI Match Summary</h3>
          <p className="text-sm text-muted-foreground">
            Why these properties are recommended.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] bg-[#F8FAF9] p-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          <p className="font-semibold text-foreground">Top signal</p>
        </div>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Palm Jumeirah and Dubai Marina are showing stronger buyer activity,
          premium demand, and stable rental performance this week.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {reasons.map((reason) => (
          <div key={reason} className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}