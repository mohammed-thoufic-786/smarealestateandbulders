import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SERVICE_LOCATIONS } from "@/lib/data/locations";
import { SectionHeading } from "./section-heading";

export function ExploreByLocation() {
  return (
    <section className="container-x bg-cream py-12 sm:py-24">
      <SectionHeading
        title="Plots & land across Tamil Nadu"
        subtitle="Where we operate"
        description="Find properties across the Tamil Nadu locations we serve, including plots for sale with enquiries handled directly in Villupuram and Salem."
        action={{ href: "/locations", label: "All locations" }}
      />
      <div className="mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_LOCATIONS.map((location) => (
          <Link
            key={location.slug}
            href={`/locations/${location.slug}`}
            aria-label={`View properties and enquiries in ${location.name}`}
            className={buttonVariants({
              variant: "ghost",
              size: "md",
              className:
                "group flex h-auto w-full items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 text-left text-foreground transition-all duration-300 hover:border-gold/50 hover:bg-surface hover:shadow-glow",
            })}
          >
            <span className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold-600">
                <MapPin className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display text-subheading font-semibold text-foreground">
                  {location.name}
                </span>
              </span>
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-all group-hover:border-gold group-hover:text-gold-600">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
