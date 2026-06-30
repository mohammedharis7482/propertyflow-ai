import { TrendingUp } from "lucide-react";

const markets = [
  { name: "Dubai Marina", signal: "+18.6%", status: "High" },
  { name: "Palm Jumeirah", signal: "+21.4%", status: "Very High" },
  { name: "Business Bay", signal: "+15.2%", status: "Strong" },
  { name: "Doha West Bay", signal: "+11.7%", status: "Growing" },
];

export default function MarketPulseCard() {
  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-bold">Market Pulse</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Live demand signals by area.
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
          <TrendingUp size={20} />
        </div>
      </div>

      <div className="space-y-3">
        {markets.map((market) => (
          <div
            key={market.name}
            className="flex items-center justify-between gap-4 rounded-2xl bg-secondary p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {market.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {market.status} demand
              </p>
            </div>

            <p className="shrink-0 font-heading text-lg font-bold text-primary">
              {market.signal}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
