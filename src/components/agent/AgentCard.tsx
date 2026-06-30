import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Agent } from "@/types/agent";
import { Button } from "@/components/ui/button";
import { AgentImage } from "@/components/agent/AgentImage";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <AgentImage
          src={agent.image}
          alt={agent.name}
          fallbackSeed={agent.slug || agent.id}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={90}
          loading="lazy"
        />

        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">
          <Star size={14} className="fill-yellow-500 text-yellow-500" />
          {agent.rating}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="line-clamp-1 text-sm font-medium text-primary">
          {agent.role}
        </p>

        <Link href={`/agents/${agent.slug}`}>
          <h3 className="mt-1 min-h-[56px] line-clamp-2 font-heading text-xl font-bold leading-tight tracking-tight transition group-hover:text-primary">
            {agent.name}
          </h3>
        </Link>

        <p className="mt-2 flex min-h-[40px] items-start gap-2 text-sm leading-5 text-muted-foreground">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{agent.location}</span>
        </p>

        {agent.agency && (
          <p className="mt-3 line-clamp-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {agent.agency}
          </p>
        )}

        <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-4">
          <div className="flex min-h-[82px] flex-col justify-center rounded-2xl bg-secondary p-4">
            <p className="font-heading text-xl font-bold leading-tight">
              {agent.properties}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Properties</p>
          </div>

          <div className="flex min-h-[82px] flex-col justify-center rounded-2xl bg-secondary p-4">
            <p className="line-clamp-2 font-heading text-xl font-bold leading-tight">
              {agent.experience}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Experience</p>
          </div>
        </div>

        <Button variant="outline" className="mt-5 w-full" asChild>
          <Link href={`/agents/${agent.slug}`}>View Profile</Link>
        </Button>
      </div>
    </article>
  );
}
