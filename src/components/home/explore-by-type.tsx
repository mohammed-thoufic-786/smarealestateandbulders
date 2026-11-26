import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";
import { PROPERTY_TYPE_PAGES } from "@/lib/data/property-types";
import { SectionHeading } from "./section-heading";

interface PropertyTypeImageStyle {
  fit: "cover" | "contain";
  position: string;
  backdrop?: boolean;
}

const PROPERTY_TYPE_IMAGE_STYLES: Record<string, PropertyTypeImageStyle> = {
  "residential-plot": { fit: "contain", position: "center", backdrop: true },
  "agricultural-land": { fit: "contain", position: "center", backdrop: true },
  villa: { fit: "contain", position: "center", backdrop: true },
  apartment: { fit: "cover", position: "50% 78%" },
  "independent-house": { fit: "cover", position: "50% 62%" },
  "commercial-space": { fit: "cover", position: "70% 50%" },
};

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
        <div className="mt-6 grid gap-5 sm:mt-10 sm:grid-cols-2 xl:grid-cols-3">
          {PROPERTY_TYPE_PAGES.map((type) => {
            const imageStyle = PROPERTY_TYPE_IMAGE_STYLES[type.slug] ?? {
              fit: "cover",
              position: "center",
            };

            return (
              <Link
                key={type.slug}
                href={`/buy/type/${type.slug}`}
                aria-label={`Browse ${type.label} information`}
                className={buttonVariants({
                  variant: "ghost",
                  size: "md",
                  className:
                    "group relative block h-auto w-full overflow-hidden rounded-3xl border border-gold/25 bg-transparent p-0 text-left transition-colors hover:border-gold/60 hover:bg-transparent",
                })}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-deep">
                  {imageStyle.backdrop && (
                    <SmartImage
                      src={type.image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      fallbackLabel=""
                      className="scale-110 object-cover opacity-25 blur-lg"
                    />
                  )}
                  <SmartImage
                    src={type.image}
                    alt={`${type.label} illustration`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.06] ${
                      imageStyle.fit === "contain" ? "object-contain" : "object-cover"
                    }`}
                    style={{ objectPosition: imageStyle.position }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/30 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <p className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-gold/80">
                      Property type
                    </p>
                    <h3 className="mt-1.5 font-display text-subheading font-semibold text-white">
                      {type.label}
                    </h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-foreground/50 text-gold transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
