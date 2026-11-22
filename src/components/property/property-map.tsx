import { ChevronDown, MapPin, Navigation } from "lucide-react";

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
      <details className="group overflow-hidden rounded-2xl border border-gold/25 bg-espresso">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-nav font-semibold text-white">{label}</span>
            <span className="block text-sm text-white/60">Verified map coordinates not available yet</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-nav font-semibold text-gold">
            View location
            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <div className="space-y-2 border-t border-gold/25 px-5 py-4 text-body text-white/85">
          <p className="font-medium text-white">{address ?? label}</p>
          <p className="text-sm leading-relaxed text-white/60">
            We only display a map when exact coordinates have been verified. This location text comes
            from the original brochure and can be updated with a verified map location later.
          </p>
        </div>
      </details>
    );
  }

  const src = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/25">
      <iframe
        title={`Map of ${label}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[16/9] w-full grayscale-[0.3]"
        style={{ border: 0 }}
      />
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
