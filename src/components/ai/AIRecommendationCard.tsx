"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, MapPin } from "lucide-react";

import AIBadge from "@/components/ai/AIBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { safeText } from "@/lib/formatters";
import { saveProperty } from "@/services/property-actions.service";
import type { DashboardProperty } from "@/types/dashboard";

interface AIRecommendationCardProps {
  property: DashboardProperty;
  matchScore: number;
  reason?: string | null;
}

export default function AIRecommendationCard({
  property,
  matchScore,
  reason,
}: AIRecommendationCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const propertySlug = safeText(property.slug, "");

  async function handleSave() {
    if (!propertySlug) {
      showToast("Property details are temporarily unavailable.", "error");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setSaving(true);
      await saveProperty(propertySlug);
      setSaved(true);
      showToast("Property saved successfully.");
    } catch (error) {
      showToast(getActionErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 overflow-hidden bg-secondary">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 420px"
        />

        <div className="absolute left-4 top-4">
          <AIBadge label={`AI Match ${matchScore}%`} />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || saved}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-primary shadow-sm backdrop-blur transition hover:bg-white disabled:opacity-70"
          aria-label="Save property"
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-heading text-xl font-bold tracking-tight">
              {property.title}
            </h3>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="line-clamp-1">{property.location}</span>
            </p>
          </div>
          <p className="shrink-0 font-heading text-lg font-bold text-primary">
            {property.price}
          </p>
        </div>

        <div className="mt-5 rounded-2xl bg-[#F8FAF9] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Why this matches
          </p>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {safeText(
              reason,
              "Matches your saved properties, inquiries, and current GCC market signals."
            )}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-5">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">AI score</p>
            <p className="font-heading text-2xl font-bold text-primary">
              {matchScore}%
            </p>
          </div>

          {propertySlug ? (
            <Button size="sm" className="rounded-xl" asChild>
              <Link href={`/properties/${propertySlug}`}>View Details</Link>
            </Button>
          ) : (
            <Button size="sm" className="rounded-xl" disabled>
              View Details
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
