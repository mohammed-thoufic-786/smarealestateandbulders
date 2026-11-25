import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { SmartImage } from "@/components/ui/smart-image";
import { SERVICE_LOCATIONS } from "@/lib/data/locations";
import { getPropertiesByIds } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Locations We Serve: Villupuram, Salem, Ulundurpet & More",
    description:
      "Explore the Tamil Nadu towns we cover, including Villupuram, Salem, Ulundurpet, Vikravandi and Kanchipuram. See SMA properties by location.",
    path: "/locations",
  });
}

export default async function LocationsPage() {
  const locations = await Promise.all(
    SERVICE_LOCATIONS.map(async (location) => {
      const properties = await getPropertiesByIds(location.propertySlugs);
      const cover = properties[0]?.images.find((image) => image.isCover) ?? properties[0]?.images[0];
      return {
        ...location,
        count: properties.length,
        image: cover?.url ?? "/home/sma-hero-background.png",
      };
    }),
  );

  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Where we operate"
        title="Explore locations"
        description="Browse the Tamil Nadu towns we serve and see the official SMA properties connected with each location."
      />

      <div className="container-x py-8 sm:py-14">
        <Breadcrumbs items={[{ label: "Locations" }]} />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/locations/${location.slug}`}
              className="group overflow-hidden rounded-2xl border border-gold/25 bg-espresso transition-colors hover:border-gold/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SmartImage
                  src={location.image}
                  alt={`SMA properties and property enquiries in ${location.name}, Tamil Nadu`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent opacity-70" />
              </div>
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="flex items-center gap-1.5 text-eyebrow font-semibold text-white/60">
                    <MapPin className="h-3.5 w-3.5 text-gold" /> {location.district}
                  </p>
                  <h2 className="mt-1 font-display text-subheading font-semibold text-white">
                    {location.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-white/60">
                    {location.count > 0
                      ? `${location.count} ${location.count === 1 ? "property" : "properties"} · Price on request`
                      : "Enquire about available options"}
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
            Tell us where you&apos;re looking and we&apos;ll share the property options we can help with.
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
