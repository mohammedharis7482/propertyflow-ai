import { Database, LineChart } from "lucide-react";

interface ChartDataStatusProps {
  source: string;
  points: number;
  note: string;
}

export default function ChartDataStatus({
  source,
  points,
  note,
}: ChartDataStatusProps) {
  return (
    <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
      <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF9] px-4 py-3">
        <Database size={18} className="text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">Data Source</p>
          <p className="text-sm font-semibold text-foreground">{source}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF9] px-4 py-3">
        <LineChart size={18} className="text-primary" />
        <div>
          <p className="text-xs text-muted-foreground">{points} data points</p>
          <p className="text-sm font-semibold text-foreground">{note}</p>
        </div>
      </div>
    </div>
  );
}
