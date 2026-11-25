import type { Metadata } from "next";
import { SITE } from "./site";
import type { Property } from "./types";

const DEFAULT_OG_IMAGE = "/og-home.jpg";

export const HOME_TITLE = "DTCP Approved Plots in Villupuram & Salem | SMA Real Estate";
export const HOME_DESCRIPTION = `DTCP-approved plots, villas and land in Villupuram, Salem and across Tamil Nadu. Document-first process, 40+ years experience. Call us on ${SITE.displayPhone}.`;

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
}

export function pageMetadata({
  title,
  description,
  path,
  image = { url: DEFAULT_OG_IMAGE, width: 1200, height: 630 },
  maxDescription = 160,
  absoluteTitle,
}: PageMetaInput): Metadata {
  const canonical = metaPath(path);
  const trimmed = trimAtWordBoundary(description, maxDescription);
  const resolvedTitle = absoluteTitle ?? title;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description: trimmed,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url: canonical,
      siteName: SITE.name,
      title: resolvedTitle,
      description: trimmed,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: trimmed,
      images: [image.url],
    },
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
  const hasDtcp =
    Boolean(property.dtcpNumber) || property.approvalNotes?.toLowerCase().includes("dtcp");
  const approval = hasDtcp
    ? `DTCP-approved plots${property.dtcpNumber ? ` (No. ${property.dtcpNumber})` : ""}`
    : "Plots";

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
    : { url: DEFAULT_OG_IMAGE, width: 1200, height: 630 };

  return pageMetadata({
    title: propertyTitle(property),
    description: propertyDescription(property),
    path: `/property/${property.slug}`,
    image,
    maxDescription: 155,
  });
}
