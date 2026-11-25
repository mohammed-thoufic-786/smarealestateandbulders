import { SERVICE_LOCATIONS } from "./data/locations";
import type { Property } from "./types";
import { propertyDescription, propertyPlace } from "./seo";
import { founder, SITE } from "./site";

function absolute(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function siteJsonLd() {
  const organizationId = `${SITE.url}#organization`;

  const realEstateAgent = {
    "@type": "RealEstateAgent",
    "@id": organizationId,
    name: SITE.name,
    url: SITE.url,
    logo: absolute("/brand/sma-logo.png"),
    image: absolute("/brand/sma-logo.png"),
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: SITE.address.country,
    },
    areaServed: SERVICE_LOCATIONS.map((location) => ({
      "@type": "City",
      name: location.name,
    })),
    founder: {
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
    },
    sameAs: [...SITE.sameAs],
  };

  const webSite = {
    "@type": "WebSite",
    "@id": `${SITE.url}#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-IN",
    publisher: { "@id": organizationId },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [realEstateAgent, webSite],
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE.url}#breadcrumb`,
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && index < trail.length - 1
        ? { item: `${SITE.url}${item.href.startsWith("/") ? item.href : `/${item.href}`}` }
        : {}),
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.url}/faq#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function propertyJsonLd(property: Property) {
  const { locality, district } = propertyPlace(property);

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": absolute(`/property/${property.slug}#property`),
    name: property.title,
    description: propertyDescription(property),
    url: absolute(`/property/${property.slug}`),
    image: property.images.map((image) => absolute(image.url)),
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressRegion: district,
      addressCountry: "IN",
    },
    publisher: { "@id": `${SITE.url}#organization` },
  };
}
