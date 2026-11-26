import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { PropertyCard } from "@/components/property/property-card";
import { buttonVariants } from "@/components/ui/button";
import { getPropertyTypePage, PROPERTY_TYPE_PAGES } from "@/lib/data/property-types";
import { listProperties } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROPERTY_TYPE_PAGES.map((type) => ({ slug: type.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const type = getPropertyTypePage(slug);
  if (!type) {
    return pageMetadata({
      title: "Property type not found",
      description: "The requested SMA property type is not available.",
      path: "/buy",
      canonical: null,
      robots: { index: false, follow: false },
    });
  }

  const { items } = await listProperties({
    category: type.category,
    listingType: "buy",
    limit: 48,
  });
  const hasListings = items.length > 0;

  return pageMetadata({
    title: hasListings
      ? `${type.label} for Sale in Tamil Nadu`
      : `${type.label} Enquiries, Tamil Nadu`,
    description: hasListings
      ? `${type.intro} View official SMA listings, layout plans and enquiry options.`
      : `${type.intro} Ask our team about current availability and documents.`,
    path: `/buy/type/${type.slug}`,
    robots: hasListings ? undefined : { index: false, follow: true },
  });
}

export default async function PropertyTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const type = getPropertyTypePage(slug);
  if (!type) notFound();

  const { items } = await listProperties({
    category: type.category,
    listingType: "buy",
    limit: 48,
  });
  const hasListings = items.length > 0;

  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Property type"
        title={hasListings ? `${type.label} for Sale` : `${type.label} enquiries`}
        description={type.intro}
      />

      <div className="container-x py-8 sm:py-14">
        <Breadcrumbs
          items={[
            { label: "Buy", href: "/buy" },
            { label: type.label },
          ]}
          path={`/buy/type/${slug}`}
        />

        <section className="mt-8 max-w-3xl">
          <h2 className="font-display text-heading font-bold text-foreground">
            {hasListings
              ? `Browse ${type.label.toLowerCase()} options`
              : `Ask about ${type.label.toLowerCase()} options`}
          </h2>
          <p className="mt-3 text-pretty text-body leading-relaxed text-muted">{type.intro}</p>
        </section>

        <section className="mt-12" aria-labelledby="type-listings">
          <h2 id="type-listings" className="font-display text-heading font-bold text-foreground">
            Official SMA listings
          </h2>
          {items.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-gold/25 bg-surface p-6 text-body leading-relaxed text-muted">
              <p>
                We do not currently publish an official {type.label.toLowerCase()} on this website.
                Tell us what you need and our team will share the options we can help with.
              </p>
              <a
                href={whatsappLink(
                  `Hello SMA Real Estate & Builders, I am interested in ${type.label.toLowerCase()} options in Tamil Nadu. Please share the details.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-location="property_type_empty_state"
                className={buttonVariants({ size: "lg", className: "mt-5" })}
              >
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-heading font-bold text-foreground">
            Explore other property types
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {PROPERTY_TYPE_PAGES.filter((item) => item.slug !== type.slug).map((item) => (
              <Link
                key={item.slug}
                href={`/buy/type/${item.slug}`}
                data-analytics-event="select_content"
                data-analytics-content-id="explore_property_type"
                data-analytics-content-name={item.label}
                data-analytics-location="property_type_page"
                className="rounded-full border border-gold/40 px-5 py-2.5 text-nav font-semibold text-foreground hover:border-gold hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/buy"
              data-analytics-event="select_content"
              data-analytics-content-id="view_properties"
              data-analytics-location="property_type_page"
              className="rounded-full border border-gold/40 px-5 py-2.5 text-nav font-semibold text-foreground hover:border-gold hover:text-gold"
            >
              All properties <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
