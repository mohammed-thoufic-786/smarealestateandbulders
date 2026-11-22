import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listProperties } from "@/lib/data/repository";
import { TN_CITIES } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
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

  try {
    const { items } = await listProperties({ limit: 48 });
    for (const p of items) {
      entries.push({
        url: `${base}/property/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch {
    /* ignore */
  }

  for (const city of TN_CITIES) {
    entries.push({
      url: `${base}/buy?city=${encodeURIComponent(city)}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
