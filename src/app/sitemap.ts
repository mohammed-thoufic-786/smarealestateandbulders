import type { MetadataRoute } from "next";
import { SERVICE_LOCATIONS } from "@/lib/data/locations";
import { OFFICIAL_PROPERTIES, isPublishedProperty } from "@/lib/data/properties";
import { PROPERTY_TYPE_PAGES } from "@/lib/data/property-types";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const publishedProperties = OFFICIAL_PROPERTIES.filter(isPublishedProperty);
  const contentUpdatedAt = publishedProperties.reduce(
    (latest, property) => (property.updatedAt > latest ? property.updatedAt : latest),
    publishedProperties[0]?.updatedAt ?? new Date(0).toISOString(),
  );
  const lastModified = new Date(contentUpdatedAt);
  const publishedSlugs = new Set(publishedProperties.map((property) => property.slug));
  const publishedCategories = new Set(publishedProperties.map((property) => property.category));

  const staticRoutes = [
    "/",
    "/buy",
    "/locations",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  function addEntry(entry: MetadataRoute.Sitemap[number]): void {
    if (seen.has(entry.url)) return;
    seen.add(entry.url);
    entries.push(entry);
  }

  for (const path of staticRoutes) {
    addEntry({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1 : 0.7,
    });
  }

  for (const property of publishedProperties) {
    addEntry({
      url: `${base}/property/${property.slug}`,
      lastModified: new Date(property.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const location of SERVICE_LOCATIONS) {
    if (!location.propertySlugs.some((slug) => publishedSlugs.has(slug))) continue;
    addEntry({
      url: `${base}/locations/${location.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const type of PROPERTY_TYPE_PAGES) {
    if (!publishedCategories.has(type.category)) continue;
    addEntry({
      url: `${base}/buy/type/${type.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
