import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, FileText, LayoutTemplate, MapPin } from "lucide-react";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/data/repository";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { LayoutViewer } from "@/components/property/layout-viewer";
import { PropertyMap } from "@/components/property/property-map";
import { EnquiryPanel, MobileActionBar } from "@/components/property/property-contact";
import { PropertyCard } from "@/components/property/property-card";
import { propertyJsonLd } from "@/lib/schema";
import { pageMetadata, propertyMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return pageMetadata({
      title: "Property not found",
      description: "The requested SMA property is not available.",
      path: "/buy",
      robots: { index: false, follow: false },
    });
  }

  return propertyMetadata(property);
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const others = await getSimilarProperties(property, 3);
  const layout =
    property.images.find((image) => image.url.includes("layout")) ?? property.images[0];
  const siteImage = property.images.find((image) => image.url.includes("site"));
  const brochure = property.documents.find((doc) => doc.url?.endsWith(".pdf"))?.url;

  const displayLocation = property.location.shortLocation ?? property.location.address;

  const summary = {
    id: property._id,
    title: property.title,
    slug: property.slug,
    location: displayLocation,
    price: property.price,
    listingType: property.listingType,
    verified: property.verified,
  };

  return (
    <div className="bg-cream pb-12 pt-24 sm:pb-24 sm:pt-24 lg:pb-16">
      <JsonLd data={propertyJsonLd(property)} />

      <div className="container-x">
        <Breadcrumbs
          items={[
            { label: "Buy", href: "/buy" },
            { label: property.title },
          ]}
        />

        <div className="mt-5 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="gold">Official SMA property</Badge>
              <Badge tone="neutral">Original layout available</Badge>
            </div>
            <h1 className="mt-4 text-balance font-display text-display-3 font-bold text-foreground">
              {property.title}
            </h1>
            <p className="mt-3 flex items-start gap-2 text-body leading-relaxed text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {displayLocation}
            </p>
          </div>
          <Link
            href="/buy"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-nav font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to properties
          </Link>
        </div>

        <section className="mt-8" id="layout">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="eyebrow">Inspect the original</p>
              <h2 className="mt-2 font-display text-subheading font-semibold text-foreground">
                Original layout drawing
              </h2>
            </div>
            <p className="max-w-md text-body leading-relaxed text-muted">
              Zoom and pan to inspect plot numbers, plot boundaries and roads. The drawing is shown
              exactly as printed in the source brochure.
            </p>
          </div>
          {layout ? (
            <LayoutViewer
              src={layout.url}
              alt={layout.alt || `${property.title} original layout`}
              title={property.title}
            />
          ) : (
            <div className="grid aspect-[16/10] place-items-center rounded-2xl bg-deep text-body text-white/60">
              Layout drawing is not available.
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-8 sm:mt-10 sm:gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="min-w-0 space-y-8 sm:space-y-10">
            <section id="brochure">
              <h2 className="font-display text-subheading font-semibold text-foreground">About this property</h2>
              <p className="mt-4 whitespace-pre-line text-pretty text-body leading-relaxed text-muted">
                {property.description}
              </p>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold/[0.04] p-4 text-body leading-relaxed text-foreground/80">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <p>{property.approvalNotes}</p>
              </div>
              {brochure && (
                <a
                  href={brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-nav font-semibold text-gold hover:underline"
                >
                  <FileText className="h-4 w-4" /> View original brochure (PDF)
                </a>
              )}
            </section>

            {siteImage && siteImage.url !== layout?.url && (
              <section>
                <h2 className="font-display text-subheading font-semibold text-foreground">Property site image</h2>
                <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-espresso">
                  <SmartImage
                    src={siteImage.url}
                    alt={siteImage.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-contain"
                  />
                </div>
              </section>
            )}

            <section>
              <h2 className="font-display text-subheading font-semibold text-foreground">Location</h2>
              <div className="mt-5">
                <PropertyMap
                  lat={property.location.coordinates?.lat}
                  lng={property.location.coordinates?.lng}
                  label={property.location.area}
                  address={displayLocation}
                />
              </div>
            </section>

            <section className="flex items-start gap-3 rounded-2xl border border-gold/25 bg-deep/60 p-4 text-sm leading-relaxed text-white/60">
              <LayoutTemplate className="h-4 w-4 shrink-0 text-gold" />
              <p>
                All details on this page come from the supplied brochure. Please confirm plot
                availability, approvals and pricing with our team before making a decision.
              </p>
            </section>
          </div>

          <div className="lg:pt-0">
            <EnquiryPanel property={summary} />
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-12 sm:mt-20">
            <h2 className="font-display text-display-3 font-bold text-foreground">Other properties</h2>
            <div className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <PropertyCard key={item._id} property={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <MobileActionBar property={summary} />
    </div>
  );
}
