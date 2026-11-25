import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/property/property-card";
import { getPropertiesByIds } from "@/lib/data/repository";
import { SERVICE_LOCATIONS, getServiceLocation } from "@/lib/data/locations";
import { pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_LOCATIONS.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const location = getServiceLocation(slug);
  if (!location) {
    return pageMetadata({
      title: "Location not found",
      description: "The requested SMA service location is not available.",
      path: "/locations",
    });
  }

  return pageMetadata({
    title: `Plots for Sale in ${location.name}, Tamil Nadu`,
    description: `${location.intro} Browse official SMA properties, layout plans and enquiry options.`,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = getServiceLocation(slug);
  if (!location) notFound();

  const properties = await getPropertiesByIds(location.propertySlugs);
  const nearby = location.nearbyAreas
    .map((areaSlug) => getServiceLocation(areaSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const otherLocations = SERVICE_LOCATIONS.filter((item) => item.slug !== location.slug).slice(0, 3);

  const faqs = [
    {
      q: `Are there SMA properties in ${location.name}?`,
      a: properties.length
        ? `Yes. SMA currently publishes ${properties.length} official ${properties.length === 1 ? "property" : "properties"} connected with ${location.name}. Each page includes the original layout drawing where available.`
        : `SMA does not currently publish an official property in ${location.name}. Use the enquiry button on this page and our team will share what is available.`,
    },
    {
      q: `Can I ask about a site visit in ${location.name}?`,
      a: `Yes. Send a WhatsApp message or use the contact form and tell us which type of property you are looking for in ${location.name}. Our team will reply with the next steps.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Location"
        title={`Plots for Sale in ${location.name}, Tamil Nadu`}
        description={location.intro}
      />

      <div className="container-x py-8 sm:py-14">
        <Breadcrumbs
          items={[
            { label: "Locations", href: "/locations" },
            { label: location.name },
          ]}
        />

        <section className="mt-8 max-w-3xl">
          <h2 className="font-display text-heading font-bold text-foreground">
            About {location.name}
          </h2>
          <p className="mt-3 text-pretty text-body leading-relaxed text-muted">{location.intro}</p>
          <p className="mt-2 flex items-center gap-2 text-body text-muted">
            <MapPin className="h-4 w-4 shrink-0 text-gold" /> {location.district}, Tamil Nadu
          </p>
        </section>

        <section className="mt-12" aria-labelledby="location-properties">
          <h2 id="location-properties" className="font-display text-heading font-bold text-foreground">
            SMA properties in {location.name}
          </h2>
          {properties.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            // TODO: Owner should add verified local copy if this location page stays thin.
            <div className="mt-6 rounded-2xl border border-gold/25 bg-surface p-6 text-body leading-relaxed text-muted">
              <p>
                We do not currently publish a property in {location.name}. Tell us what you are looking
                for and our team will help with available options across Tamil Nadu.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={whatsappLink(
                    `Hello SMA Real Estate & Builders, I would like to enquire about property options in ${location.name}. Please share the details.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ size: "lg" })}
                >
                  <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
                </a>
                <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                  Contact us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-heading font-bold text-foreground">
            Property enquiries in {location.name}
          </h2>
          <p className="mt-3 text-body leading-relaxed text-muted">
            Ask about current availability, documents and site visits. Prices are shared on request.
          </p>
          <a
            href={whatsappLink(
              `Hello SMA Real Estate & Builders, I am interested in plots and property options in ${location.name}. Please share more details.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg", className: "mt-5" })}
          >
            <MessageCircle className="h-4 w-4" /> Chat about {location.name}
          </a>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="font-display text-heading font-bold text-foreground">
            Frequently asked questions
          </h2>
          <div className="mt-5">
            <Accordion items={faqs} />
          </div>
          <JsonLd data={faqJsonLd} />
        </section>

        <section className="mt-12">
          <h2 className="font-display text-heading font-bold text-foreground">Continue exploring</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/buy"
              className="rounded-full border border-gold/40 px-5 py-2.5 text-nav font-semibold text-foreground hover:border-gold hover:text-gold"
            >
              All properties <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
            <Link
              href="/locations"
              className="rounded-full border border-gold/40 px-5 py-2.5 text-nav font-semibold text-foreground hover:border-gold hover:text-gold"
            >
              All locations
            </Link>
          </div>
          {(nearby.length > 0 || otherLocations.length > 0) && (
            <div className="mt-6">
              <h3 className="font-display text-subheading font-semibold text-foreground">
                {nearby.length > 0 ? "Nearby areas we serve" : "Other locations we serve"}
              </h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {(nearby.length > 0 ? nearby : otherLocations).map((item) => (
                  <Link
                    key={item.slug}
                    href={`/locations/${item.slug}`}
                    className="text-nav font-semibold text-gold-600 underline-offset-4 hover:underline"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
