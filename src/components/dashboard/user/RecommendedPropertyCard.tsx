import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { DashboardProperty } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

interface RecommendedPropertyCardProps {
  property: DashboardProperty;
  matchScore?: number;
}

export default function RecommendedPropertyCard({
  property,
  matchScore = 96,
}: RecommendedPropertyCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-secondary">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 420px"
        />

        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          <Sparkles size={14} className="mr-1" />
          {property.status}
        </div>

        <div className="absolute bottom-4 right-4 rounded-2xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-xs text-muted-foreground">AI Confidence</p>
          <p className="font-heading text-xl font-bold text-primary">{matchScore}%</p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-xl font-bold tracking-tight">
          {property.title}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="text-primary" />
          {property.location}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#F8FAF9] p-3">
            <TrendingUp size={17} className="text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">ROI</p>
            <p className="font-heading text-base font-bold">High</p>
          </div>

          <div className="rounded-2xl bg-[#F8FAF9] p-3">
            <BarChart3 size={17} className="text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Yield</p>
            <p className="font-heading text-base font-bold">7.4%</p>
          </div>

          <div className="rounded-2xl bg-[#F8FAF9] p-3">
            <ShieldCheck size={17} className="text-primary" />
            <p className="mt-2 text-xs text-muted-foreground">Risk</p>
            <p className="font-heading text-base font-bold">Low</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
          <p className="font-heading text-xl font-bold">{property.price}</p>

          <Button size="sm" className="rounded-xl" asChild>
            <Link href="/dashboard/user/recommendations">View Match</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
