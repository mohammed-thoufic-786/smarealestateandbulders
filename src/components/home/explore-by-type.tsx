import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { PROPERTY_TYPE_PAGES } from "@/lib/data/property-types";
import { SectionHeading } from "./section-heading";

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
        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {PROPERTY_TYPE_PAGES.map((type) => (
            <Link
              key={type.slug}
              href={`/buy/type/${type.slug}`}
              aria-label={`Browse ${type.label} information`}
              className="group relative block aspect-[16/11] w-full overflow-hidden rounded-3xl border border-gold/25 isolate transform-gpu bg-deep transition-[transform,border-color,box-shadow] duration-300 ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:border-gold [@media(hover:hover)]:hover:shadow-glow sm:aspect-[4/3]"
            >
              <SmartImage
                src={type.image}
                alt={type.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="absolute inset-0 object-cover transition-transform duration-[900ms] ease-smooth [@media(hover:hover)]:group-hover:scale-[1.06]"
                style={{ objectPosition: type.objectPosition }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent via-[45%]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 transform-gpu isolate p-5">
                <div>
                  <p className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-white/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
                    Property type
                  </p>
                  <h3 className="mt-1.5 font-display text-subheading font-semibold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.75)]">
                    {type.label}
                  </h3>
                </div>
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-foreground/50 text-gold transition-all [@media(hover:hover)]:group-hover:border-gold [@media(hover:hover)]:group-hover:bg-gold [@media(hover:hover)]:group-hover:text-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
