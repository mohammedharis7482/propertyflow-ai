"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bath, BedDouble, CheckCircle2, Heart, MapPin, Maximize2 } from "lucide-react";

import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { getActionErrorMessage } from "@/lib/action-feedback";
import { getAccessToken } from "@/lib/auth-token";
import { saveProperty, unsaveProperty } from "@/services/property-actions.service";

interface PropertyListCardProps {
  property: Property;
}

export default function PropertyListCard({ property }: PropertyListCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const stats = [
    { icon: BedDouble, label: "Beds", value: property.beds },
    { icon: Bath, label: "Baths", value: property.baths },
    { icon: Maximize2, label: "Area", value: property.area },
  ];

  return (
    <article className="group grid min-w-0 overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[260px_minmax(0,1fr)]">
      <Link
        href={`/properties/${property.slug}`}
        className="relative block min-h-[220px] overflow-hidden bg-secondary sm:min-h-[260px]"
      >
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 260px"
        />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">
            {property.status}
          </span>

          {property.featured && (
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
              Featured
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-col p-4 sm:p-6">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-sm font-semibold text-primary">
              {property.type}
            </p>

            <Link href={`/properties/${property.slug}`}>
              <h3 className="mt-1 line-clamp-2 font-heading text-xl font-bold tracking-tight transition group-hover:text-primary sm:text-2xl">
                {property.title}
              </h3>
            </Link>

            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              <span className="line-clamp-2">{property.location}</span>
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={async () => {
              if (!getAccessToken()) {
                router.push("/login");
                return;
              }

              try {
                setSaving(true);
                if (saved) {
                  await unsaveProperty(property.slug);
                  setSaved(false);
                  showToast("Property removed from saved list.");
                } else {
                  await saveProperty(property.slug);
                  setSaved(true);
                  showToast("Property saved successfully.");
                }
              } catch (error) {
                showToast(getActionErrorMessage(error), "error");
              } finally {
                setSaving(false);
              }
            }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:text-primary disabled:opacity-70"
            aria-label={saved ? "Remove saved property" : "Save property"}
          >
            {saved ? <CheckCircle2 size={18} className="text-primary" /> : <Heart size={18} />}
          </button>
        </div>

        <p className="mt-5 break-words font-heading text-2xl font-bold leading-tight text-foreground">
          {property.price}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-5 sm:gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="flex min-h-[86px] flex-col justify-center rounded-2xl bg-secondary p-3 sm:p-4"
              >
                <Icon size={18} className="text-primary" />
                <p className="mt-2 line-clamp-2 break-words font-heading text-lg font-bold leading-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button className="w-full rounded-2xl sm:w-auto" asChild>
            <Link href={`/properties/${property.slug}`}>View Details</Link>
          </Button>

          <Button variant="outline" className="w-full rounded-2xl sm:w-auto" asChild>
            <Link href={`/properties/${property.slug}`}>Contact Agent</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
