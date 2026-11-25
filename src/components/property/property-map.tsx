"use client";

import dynamic from "next/dynamic";
import { MapPin, Navigation } from "lucide-react";

const MapEmbed = dynamic(
  () => import("./map-embed").then((module) => module.MapEmbed),
  {
    ssr: false,
    loading: () => <div className="aspect-[16/9] w-full animate-pulse bg-ivory-200" aria-hidden="true" />,
  },
);

export function PropertyMap({
  lat,
  lng,
  label,
  address,
}: {
  lat?: number;
  lng?: number;
  label: string;
  address?: string;
}) {
  if (lat == null || lng == null) {
    return (
      <div className="rounded-2xl border border-gold/25 bg-espresso p-5">
        <p className="flex items-center gap-2 text-nav font-semibold text-white">
          <MapPin className="h-4 w-4 shrink-0 text-gold" /> {label}
        </p>
        <p className="mt-2 text-body leading-relaxed text-white/70">{address ?? label}</p>
      </div>
    );
  }

  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/25">
      <MapEmbed src={src} title={`Map of ${label}`} />
      <div className="flex items-center justify-between gap-3 bg-espresso px-5 py-3.5">
        <p className="flex items-center gap-2 text-body text-white">
          <MapPin className="h-4 w-4 text-gold" /> {label}
        </p>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-nav font-semibold text-gold hover:underline"
        >
          <Navigation className="h-3.5 w-3.5" /> Get directions
        </a>
      </div>
    </div>
  );
}
