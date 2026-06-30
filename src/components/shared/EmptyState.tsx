import { LucideIcon, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-[#F8FAF9] p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-primary">
        <Icon size={24} />
      </div>

      <h3 className="mt-5 font-heading text-2xl font-bold">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button className="mt-6 rounded-2xl" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
