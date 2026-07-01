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

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const stats = [
    {
      icon: BedDouble,
      value: property.beds,
      label: property.beds === 1 ? "Bed" : "Beds",
    },
    {
      icon: Bath,
      value: property.baths,
      label: property.baths === 1 ? "Bath" : "Baths",
    },
    {
      icon: Maximize2,
      value: property.area,
      label: "Area",
    },
  ];

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[1.22/1] overflow-hidden bg-secondary">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
              {property.status}
            </span>

            {property.featured && (
              <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-800 shadow-sm">
                Featured
              </span>
            )}
          </div>

          <button
            aria-label="Save property"
            disabled={saving}
            onClick={async (event) => {
              event.preventDefault();
              event.stopPropagation();

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
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-sm backdrop-blur transition hover:bg-white hover:text-primary disabled:opacity-70"
          >
            {saved ? <CheckCircle2 size={18} className="text-primary" /> : <Heart size={18} />}
          </button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-primary">
                {property.type}
              </p>

              <Link href={`/properties/${property.slug}`}>
                <h3 className="mt-1 min-h-[56px] line-clamp-2 font-heading text-xl font-bold leading-tight tracking-tight transition group-hover:text-primary">
                  {property.title}
                </h3>
              </Link>

              <p className="mt-2 flex min-h-[40px] items-start gap-2 text-sm leading-5 text-muted-foreground">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                <span className="line-clamp-2">{property.location}</span>
              </p>
            </div>

            <p className="max-w-full shrink-0 break-words text-left font-heading text-lg font-bold leading-tight text-foreground sm:max-w-[140px] sm:text-right">
              {property.price}
            </p>
          </div>

          <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex min-h-[72px] flex-col justify-center rounded-2xl bg-secondary px-2 py-3 sm:min-h-[76px] sm:px-3"
                >
                  <Icon size={16} className="mb-2 text-primary" />

                  <p className="line-clamp-2 break-words text-sm font-bold leading-tight text-foreground">
                    {item.value}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <Button variant="outline" className="mt-5 w-full rounded-2xl" asChild>
          <Link href={`/properties/${property.slug}`}>View Details</Link>
        </Button>
      </div>
    </article>
  );
}
