import { SERVICE_LOCATIONS } from "./data/locations";
import type { Property } from "./types";
import { propertyDescription, propertyPlace } from "./seo";
import { founder, SITE } from "./site";

function absolute(path: string): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function siteJsonLd() {
  const realEstateAgent = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
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
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: "en-IN",
    publisher: { "@type": "RealEstateAgent", name: SITE.name },
  };

  return [realEstateAgent, webSite];
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

// TODO: Add Offer, AggregateRating or Review schema only when prices and reviews are real and verified.
export function propertyJsonLd(property: Property) {
  const { locality, district } = propertyPlace(property);

  return {
    "@context": "https://schema.org",
    "@type": "Place",
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
  };
}
