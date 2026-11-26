import type { MetadataRoute } from "next";
import { SERVICE_LOCATIONS } from "@/lib/data/locations";
import { PROPERTY_TYPE_PAGES } from "@/lib/data/property-types";
import { getPropertiesByIds, listProperties, listPublishedProperties } from "@/lib/data/repository";
import { SITE } from "@/lib/site";
import type { Property } from "@/lib/types";

const STATIC_ROUTES = [
  "/",
  "/buy",
  "/locations",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
];

function validDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function latestUpdatedAt(items: Property[]): Date | undefined {
  const dates = items
    .map((item) => validDate(item.updatedAt))
    .filter((date): date is Date => Boolean(date));
  if (!dates.length) return undefined;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const publishedProperties = await listPublishedProperties();
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  function addEntry(path: string, lastModified?: Date): void {
    const url = `${base}${path}`;
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, ...(lastModified ? { lastModified } : {}) });
  }

  for (const path of STATIC_ROUTES) {
    addEntry(path);
  }

  for (const property of publishedProperties) {
    addEntry(`/property/${property.slug}`, validDate(property.updatedAt));
  }

  for (const location of SERVICE_LOCATIONS) {
    const properties = await getPropertiesByIds(location.propertySlugs);
    if (!properties.length) continue;
    addEntry(`/locations/${location.slug}`, latestUpdatedAt(properties));
  }

  for (const type of PROPERTY_TYPE_PAGES) {
    const { items } = await listProperties({
      category: type.category,
      listingType: "buy",
      limit: 48,
    });
    if (!items.length) continue;
    addEntry(`/buy/type/${type.slug}`, latestUpdatedAt(items));
  }

  return entries;
}
