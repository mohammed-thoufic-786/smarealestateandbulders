import type { MetadataRoute } from "next";
import { SERVICE_LOCATIONS } from "@/lib/data/locations";
import { OFFICIAL_PROPERTIES } from "@/lib/data/properties";
import { PROPERTY_TYPE_PAGES } from "@/lib/data/property-types";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();

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

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const property of OFFICIAL_PROPERTIES) {
    entries.push({
      url: `${base}/property/${property.slug}`,
      lastModified: new Date(property.updatedAt),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const location of SERVICE_LOCATIONS) {
    entries.push({
      url: `${base}/locations/${location.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const type of PROPERTY_TYPE_PAGES) {
    entries.push({
      url: `${base}/buy/type/${type.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return entries;
}
