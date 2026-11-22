import { ArrowUpRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { PropertyCategory } from "@/lib/types";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/business-config";
import { SectionHeading } from "./section-heading";

const TYPE_CATEGORIES: { category: PropertyCategory; image: string }[] = [
  { category: "residential_plot", image: "/property-types/residential-plot.png" },
  { category: "agricultural_land", image: "/property-types/agricultural-land.jpg" },
  { category: "villa", image: "/property-types/villa.jpg" },
  { category: "apartment", image: "/property-types/apartment.jpg" },
  { category: "independent_house", image: "/property-types/independent-house.jpg" },
  { category: "commercial", image: "/property-types/commercial-space.jpg" },
];

export function ExploreByType() {
  return (
    <section className="border-y border-gold/25 bg-foreground">
      <div className="container-x py-12 sm:py-24">
        <SectionHeading
          title="Find your fit"
          subtitle="Explore by property type"
          description="Browse the kinds of properties we handle, from residential plots to commercial spaces."
          action={{ href: "/buy", label: "View all properties" }}
          inverted
        />
        <div className="mt-6 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {TYPE_CATEGORIES.map(({ category, image }) => (
            <a
              key={category}
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enquire about ${CATEGORY_LABELS[category]}`}
              className={buttonVariants({
                variant: "ghost",
                size: "md",
                className:
                  "group relative block h-auto w-full overflow-hidden rounded-3xl border border-gold/25 bg-transparent p-0 text-left transition-colors hover:border-gold/60 hover:bg-transparent",
              })}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
                <SmartImage
                  src={image}
                  alt={`${CATEGORY_LABELS[category]} illustration`}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                <div>
                  <p className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-gold/80">
                    Property type
                  </p>
                  <h3 className="mt-1.5 font-display text-subheading font-semibold text-white">
                    {CATEGORY_LABELS[category]}
                  </h3>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-foreground/50 text-gold transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
