import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SmartImage } from "@/components/ui/smart-image";
import { getLocationStats } from "@/lib/data/repository";

export const metadata: Metadata = {
  title: "Explore Locations in Tamil Nadu",
  description:
    "Explore the exact locations of the three official SMA properties in Tamil Nadu.",
  alternates: { canonical: "/locations" },
};

export default async function LocationsPage() {
  const locations = await getLocationStats();

  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Where we operate"
        title="Explore locations"
        description="We list properties only in the areas we actively cover, so every count you see reflects real, current listings."
        breadcrumb={[{ href: "/locations", label: "Locations" }]}
      />

      <div className="container-x py-8 sm:py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <Link
              key={loc.city}
              href={`/buy?q=${encodeURIComponent(loc.city)}`}
              className="group overflow-hidden rounded-2xl border border-gold/25 bg-espresso transition-colors hover:border-gold/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={loc.image}
                  alt={loc.city}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent opacity-70" />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="flex items-center gap-1.5 text-eyebrow font-semibold text-white/60">
                    <MapPin className="h-3.5 w-3.5 text-gold" /> {loc.district ? `${loc.district} district` : loc.city}
                  </p>
                  <h2 className="mt-1 font-display text-subheading font-semibold text-white">{loc.city}</h2>
                  <p className="mt-0.5 text-sm text-white/60">
                    {loc.count} {loc.count === 1 ? "property" : "properties"} · Price on request
                  </p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/30 text-white transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-gold/25 bg-foreground p-8 text-center sm:mt-14">
          <h2 className="font-display text-subheading font-semibold text-white">
            Don&apos;t see your area yet?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body text-line">
            We&apos;re expanding across Tamil Nadu. Tell us where you&apos;re looking and we&apos;ll notify you
            when listings go live there.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-nav font-semibold text-ink transition-colors hover:bg-gold-400"
          >
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
