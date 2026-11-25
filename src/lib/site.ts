import {
  businessConfig,
  DEFAULT_WHATSAPP_MESSAGE,
  whatsappLink as buildWhatsappLink,
} from "./business-config";

const TRACKING_PARAMS = [
  "cnvx",
  "mibextid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "igshid",
];

export function stripTrackingParams(value: string): string {
  try {
    const url = new URL(value);
    for (const key of TRACKING_PARAMS) url.searchParams.delete(key);
    return url.toString();
  } catch {
    return value;
  }
}

export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.smarealestates.com",
  name: "SMA Real Estate & Builders",
  legalName: "SMA Real Estate & Builders",
  tagline: "Trust begins here, your future starts here.",
  description:
    "SMA Real Estate & Builders — a Tamil Nadu real-estate company helping families and investors buy plots, villas, apartments and commercial space with clear paperwork and fair pricing.",
  locale: "en_IN",
  phone: "+919150128777",
  displayPhone: "+91 91501 28777",
  email: businessConfig.businessEmail,
  address: {
    street: "E.S Hospital near Solai Mahal back side, SMA Apartment",
    city: "Villupuram",
    region: "Tamil Nadu",
    postal: "605602",
    country: "IN",
  },
  whatsapp: buildWhatsappLink(),
  sameAs: [
    stripTrackingParams(businessConfig.instagramUrl),
    stripTrackingParams(businessConfig.facebookUrl),
  ],
  social: {
    instagram: stripTrackingParams(businessConfig.instagramUrl),
    facebook: stripTrackingParams(businessConfig.facebookUrl),
    whatsapp: buildWhatsappLink(),
  },
} as const;

export function formatAddress(address: typeof SITE.address = SITE.address): string {
  const country = address.country === "IN" ? "India" : address.country;
  return `${address.street}, ${address.city}, ${address.region} ${address.postal}, ${country}`;
}

export const site = SITE;

export const whatsappLink = (message: string = DEFAULT_WHATSAPP_MESSAGE) =>
  buildWhatsappLink(message);

export const founder = {
  name: "Haji S.M. Abdul Hakkim",
  role: "Founder & Managing Director",
  image: "/sma-founder.jpeg",
  location: "Villupuram, Tamil Nadu",
  experience: "40+ years in Tamil Nadu real estate",
  quote:
    "Buying land or a home should never feel like a gamble. We built this company to make every step — price, paperwork and possession — clear and honest.",
  bio: "Led by our founder, S.M. Abdul Hakkim, our company was established with a simple vision: to make property buying more transparent, reliable and rewarding for every customer. We believe that buying land is more than a financial investment — it is an important step towards building a family's future. From identifying the right property to guiding customers through documentation and the buying process, we believe in doing things the right way, with honesty and personal attention.",
  promise:
    "Every customer deserves clarity, confidence and a property decision they can feel good about.",
  highlights: [
    "Four decades of on-ground experience across Tamil Nadu",
    "A document-first process on every single listing",
    "Personal attention from first enquiry to registration",
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = {
  explore: [
    { href: "/buy", label: "Buy Properties" },
    { href: "/locations", label: "Explore Locations" },
    { href: "/contact", label: "Book a Call" },
  ],
  tools: [
    { href: "/faq", label: "Help & FAQ" },
    { href: "/contact", label: "Book a Call" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
} as const;
