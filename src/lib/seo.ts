import type { Metadata } from "next";
import { SITE } from "./site";
import type { Property } from "./types";

const DEFAULT_OG_IMAGE = "/og-home.jpg";
const DEFAULT_OG_IMAGE_ALT = "SMA Real Estate & Builders — plots and villas in Tamil Nadu";
const BRAND_SUFFIX = "SMA Real Estate";
export const HOME_TITLE = "Plots & Villas in Villupuram & Salem | SMA Real Estate";

export const HOME_DESCRIPTION = `Official plots, villas and land enquiries in Villupuram, Salem and across Tamil Nadu. Document-first process. Call us on ${SITE.displayPhone}.`;

export interface MetaImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export function trimAtWordBoundary(value: string, max = 155): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;

  const slice = clean.slice(0, max);
  const boundary = slice.lastIndexOf(" ");
  const text = (boundary > 0 ? slice.slice(0, boundary) : slice)
    .trimEnd()
    .replace(/[,;:.]+$/, "");
  return `${text}…`;
}

export function metaPath(path: string): string {
  const value = path.startsWith("/") ? path : `/${path}`;
  return value === "/" ? "/" : value.replace(/\/+$/, "");
}

export interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: MetaImage;
  maxDescription?: number;
  absoluteTitle?: string;
  canonical?: string | null;
  robots?: Metadata["robots"];
}

export function pageMetadata({
  title,
  description,
  path,
  image = { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: DEFAULT_OG_IMAGE_ALT },
  maxDescription = 160,
  absoluteTitle,
  canonical,
  robots,
}: PageMetaInput): Metadata {
  const resolvedCanonical = canonical === undefined ? metaPath(path) : canonical;
  const trimmed = trimAtWordBoundary(description, maxDescription);
  const resolvedTitle = absoluteTitle ?? `${title} | ${BRAND_SUFFIX}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description: trimmed,
    ...(robots ? { robots } : {}),
    alternates: { canonical: resolvedCanonical },
    openGraph: resolvedCanonical
      ? {
          type: "website",
          locale: SITE.locale,
          url: resolvedCanonical,
          siteName: SITE.name,
          title: resolvedTitle,
          description: trimmed,
          images: [{ ...image, alt: image.alt ?? DEFAULT_OG_IMAGE_ALT }],
        }
      : null,
    twitter: resolvedCanonical
      ? {
          card: "summary_large_image",
          title: resolvedTitle,
          description: trimmed,
          images: [image.url],
        }
      : null,
  };
}

export function propertyPlace(property: Property): { locality: string; district: string } {
  const parts = property.location.shortLocation
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const locality = parts?.[0] ?? property.location.area;
  const district = property.location.district || parts?.[1] || property.location.city;
  return { locality, district };
}

export function propertyTitle(property: Property): string {
  const { locality } = propertyPlace(property);
  return trimAtWordBoundary(`${property.title} – Plots in ${locality}`, 41);
}

export function propertyDescription(property: Property): string {
  const { locality, district } = propertyPlace(property);
  const hasVerifiedApproval = property.verified && Boolean(property.dtcpNumber);
  const approval = hasVerifiedApproval ? `DTCP-approved plots (No. ${property.dtcpNumber})` : "Plots";

  return trimAtWordBoundary(
    `${property.title}: ${approval} in ${locality}, ${district}. View the original layout plan, brochure and enquire on WhatsApp.`,
    155,
  );
}

export function propertyMetadata(property: Property): Metadata {
  const cover = property.images.find((image) => image.isCover) ?? property.images[0];
  const image: MetaImage = cover
    ? {
        url: cover.url,
        width: cover.width,
        height: cover.height,
        alt: cover.alt || `${property.title}, ${propertyPlace(property).locality}`,
      }
    : { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: DEFAULT_OG_IMAGE_ALT };

  return pageMetadata({
    title: propertyTitle(property),
    description: propertyDescription(property),
    path: `/property/${property.slug}`,
    image,
    maxDescription: 155,
  });
}
