import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";
import { whatsappLink, propertyWhatsappMessage } from "@/lib/business-config";
import { cn, formatINR } from "@/lib/utils";

const CARD_IMAGE_OVERRIDES: Record<string, string> = {
  "kmb-garden": "/properties/kmb-garden/card.jpg",
  "sma-garden": "/properties/sma-garden/card.png",
};

export function PropertyCard({
  property,
  priority = false,
  variant = "grid",
  showLocation = true,
  compactTypography = false,
  className,
  priceClassName,
  priceLabel = "Price on request",
}: {
  property: Property;
  priority?: boolean;
  variant?: "grid" | "list";
  showLocation?: boolean;
  compactTypography?: boolean;
  className?: string;
  priceClassName?: string;
  priceLabel?: string;
}) {
  const cardImage = CARD_IMAGE_OVERRIDES[property.slug];
  const displayLocation = property.location.shortLocation ?? property.location.address;
  const cover = cardImage
    ? { url: cardImage, alt: `${property.title} brochure image, ${displayLocation}` }
    : property.images.find((i) => i.isCover) ?? property.images[0];
  const isList = variant === "list";
  const priceText = property.price > 0 ? formatINR(property.price, { compact: true }) : priceLabel;

  return (
    <article
      data-analytics-property-id={property._id}
      data-analytics-property-name={property.title}
      data-analytics-property-location={displayLocation}
      data-analytics-property-category={property.category}
      className={cn(
        "interactive-card group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-cream text-foreground transition-all duration-500 ease-smooth hover:border-gold/60 hover:shadow-glow",
        isList && "sm:flex-row",
        className,
      )}
    >
      <Link
        href={`/property/${property.slug}`}
        className={cn("relative block shrink-0 overflow-hidden", isList ? "sm:w-[42%]" : "")}
        aria-label={`View details for ${property.title}`}
      >
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden",
            isList && "sm:h-full sm:min-h-[260px] sm:aspect-auto",
          )}
        >
          {cover && (
            <SmartImage
              src={cover.url}
              alt={cover.alt || property.title}
              fill
              priority={priority}
              sizes={
                isList
                  ? "(max-width: 640px) 100vw, 40vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className="object-cover transition-transform duration-[900ms] ease-smooth group-hover:scale-[1.06]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-80" />
          <div className="absolute left-3 top-3">
            <Badge tone="neutral" className="backdrop-blur-md border-gold/40 bg-foreground/70 text-white">
              Official property
            </Badge>
          </div>
        </div>
      </Link>

      <div className={cn("flex flex-1 flex-col bg-cream p-5 text-foreground", isList && "sm:p-6")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-eyebrow font-semibold uppercase tracking-[0.16em] text-muted">
              SMA Real Estate
            </p>
            <h3 className="mt-1.5 font-display text-property font-semibold leading-snug text-foreground">
              <Link href={`/property/${property.slug}`} className="hover:text-gold">
                {property.title}
              </Link>
            </h3>
          </div>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>

        {showLocation && (
          <p className="mt-2 flex items-start gap-1.5 text-body leading-relaxed text-muted">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
            <span>{property.location.shortLocation ?? property.location.address}</span>
          </p>
        )}

        {(property.verified || property.tnreraRegistration) && (
          <p className="mt-1.5 text-sm text-muted">
            {property.verified && property.dtcpNumber ? `DTCP No. ${property.dtcpNumber}` : ""}
            {property.verified && property.dtcpNumber && property.tnreraRegistration ? " · " : ""}
            {property.tnreraRegistration ? `TNRERA: ${property.tnreraRegistration}` : ""}
          </p>
        )}

        <p
          className={cn(
            compactTypography
              ? "text-[13px] font-medium text-muted"
              : cn(priceClassName ?? "text-price", "font-semibold text-muted"),
            showLocation ? "mt-3" : "mt-4",
          )}
        >
          {priceText}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Link
            href={`/property/${property.slug}`}
            data-analytics-event="select_content"
            data-analytics-content-id="property_details"
            data-analytics-content-name={property.title}
            data-analytics-location="property_card"
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-line px-4 py-2.5 text-foreground transition-colors hover:border-gold hover:bg-gold hover:text-foreground",
              compactTypography ? "text-[12px] font-medium" : "text-nav font-semibold",
            )}
          >
            View details
          </Link>
          <a
            href={whatsappLink(propertyWhatsappMessage(property.title, property.slug))}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-location="property_card"
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              compactTypography ? "text-[12px] font-medium" : undefined,
            )}
          >
            Enquire now
          </a>
        </div>
      </div>
    </article>
  );
}
