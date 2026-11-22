import {
  businessConfig,
  DEFAULT_WHATSAPP_MESSAGE,
  whatsappLink as buildWhatsappLink,
} from "./business-config";

const whatsappNumber = businessConfig.whatsappNumber;

export const site = {
  name: "SMA Real Estate & Builders",
  legalName: "SMA Real Estate & Builders",
  tagline: "Trust begins here, your future starts here.",
  description:
    "SMA Real Estate & Builders — a Tamil Nadu real-estate company helping families and investors buy plots, villas, apartments and commercial space with clear paperwork and fair pricing.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en_IN",
  phone: "+91 91501 28777",
  whatsapp: whatsappNumber,
  email: businessConfig.businessEmail,
  address: "E.S Hospital near Solai Mahal back side, SMA Apartment, Villupuram, Tamil Nadu 605602",
  social: {
    instagram: businessConfig.instagramUrl,
    facebook: businessConfig.facebookUrl,
    whatsapp: buildWhatsappLink(),
    youtube: "https://youtube.com",
  },
} as const;

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
