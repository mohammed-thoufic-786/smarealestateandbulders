const DEFAULT_WHATSAPP_NUMBER = "9150128777";

const DEFAULT_FACEBOOK_URL = "https://www.facebook.com/share/1UP65RyDmK/?mibextid=wwXIfr";

const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/s.m.a_realestate_and_builders?cnvx=MTl2cDgwZnpxcXEyaQ%3D%3D&utm_source=qr";

const DEFAULT_BUSINESS_EMAIL = "smarealestatereal@gmail.com";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello SMA Real Estate & Builders, I would like to enquire about your properties and services. Please contact me.";

function normalizeWhatsAppNumber(value?: string | null): string {
  const digits = (value || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits || `91${DEFAULT_WHATSAPP_NUMBER}`;
}

export const businessConfig = {
  whatsappNumber: normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || DEFAULT_FACEBOOK_URL,
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULT_INSTAGRAM_URL,
  businessEmail: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || DEFAULT_BUSINESS_EMAIL,
} as const;

export function whatsappLink(message: string = DEFAULT_WHATSAPP_MESSAGE): string {
  return `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function propertyWhatsappMessage(title: string, slug?: string): string {
  const normalizedTitle = title.trim().toUpperCase().replace(/\s+/g, " ");
  const isKurinji =
    slug === "kurunji-garden" || normalizedTitle === "KURUNJI GARDEN" || normalizedTitle === "KURINJI GARDEN";

  if (isKurinji) {
    return "Hello SMA Real Estate & Builders, I am interested in Kurinji Garden. I would like to know more about the property, pricing, location and availability. Please share the details.";
  }

  return `Hello SMA Real Estate & Builders, I am interested in ${title}. I would like to know more about this property. Please share the details.`;
}

export function contactWhatsappMessage(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): string {
  return [
    "Hello SMA Real Estate & Builders,",
    "",
    "I would like to make an enquiry.",
    "",
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Email: ${input.email.trim()}`,
    "",
    `Message: ${input.message.trim()}`,
    "",
    "Please contact me regarding my enquiry.",
  ].join("\n");
}

export function siteVisitWhatsappMessage(input: {
  propertyTitle: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}): string {
  const lines = [
    "Hello SMA Real Estate & Builders,",
    "",
    "I would like to schedule a site visit.",
    "",
    `Property: ${input.propertyTitle.trim()}`,
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `Email: ${input.email.trim()}`,
    `Preferred date: ${input.preferredDate.trim()}`,
    `Preferred time: ${input.preferredTime.trim()}`,
  ];

  if (input.notes?.trim()) {
    lines.push("", `Notes: ${input.notes.trim()}`);
  }

  lines.push("", "Please confirm the appointment.");
  return lines.join("\n");
}
