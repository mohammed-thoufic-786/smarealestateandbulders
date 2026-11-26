import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

const BASE_URL = "https://www.smarealestates.com";

describe("robots.txt metadata", () => {
  it("uses only supported directives", () => {
    expect(robots()).toEqual({
      rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
      sitemap: `${BASE_URL}/sitemap.xml`,
    });
  });
});

describe("sitemap metadata", () => {
  it("includes only canonical, published and indexable routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toContain(`${BASE_URL}/`);
    expect(urls).toContain(`${BASE_URL}/property/kurunji-garden`);
    expect(urls).not.toContain(`${BASE_URL}/buy/type/villa`);
    expect(urls).not.toContain(`${BASE_URL}/buy/type/apartment`);
    expect(urls.every((url) => url.startsWith(`${BASE_URL}/`) || url === BASE_URL)).toBe(true);
    expect(
      entries.every(
        (entry) => !("changeFrequency" in entry) && !("priority" in entry),
      ),
    ).toBe(true);
  });

  it("does not invent last-modified dates for static pages", async () => {
    const entries = await sitemap();
    const staticPaths = [
      "/",
      "/buy",
      "/locations",
      "/about",
      "/contact",
      "/faq",
      "/privacy",
      "/terms",
    ];
    for (const path of staticPaths) {
      const entry = entries.find((item) => item.url === `${BASE_URL}${path}`);
      expect(entry).toBeDefined();
      expect(entry).not.toHaveProperty("lastModified");
    }
  });
});

describe("page metadata", () => {
  it("adds a self-referencing canonical and branded social title", () => {
    const metadata = pageMetadata({
      title: "Contact Us",
      description: "Contact SMA.",
      path: "/contact",
    });

    expect(metadata.alternates).toEqual({ canonical: "/contact" });
    expect(metadata.openGraph).toMatchObject({
      url: "/contact",
      title: "Contact Us | SMA Real Estate",
    });
    expect(metadata.twitter).toMatchObject({ title: "Contact Us | SMA Real Estate" });
  });

  it("removes canonical and social tags when explicitly disabled", () => {
    const metadata = pageMetadata({
      title: "Page not found",
      description: "Not available.",
      path: "/missing",
      canonical: null,
      robots: { index: false, follow: false },
    });

    expect(metadata.alternates).toEqual({ canonical: null });
    expect(metadata.openGraph).toBeNull();
    expect(metadata.twitter).toBeNull();
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe("structured data identifiers", () => {
  it("uses page-specific breadcrumb and FAQ identifiers", () => {
    expect(breadcrumbJsonLd([{ label: "FAQ" }], "/faq")["@id"]).toBe(
      `${BASE_URL}/faq#breadcrumb`,
    );
    expect(faqJsonLd([], "/faq")["@id"]).toBe(`${BASE_URL}/faq#faq`);
    expect(faqJsonLd([], "/locations/salem")["@id"]).toBe(
      `${BASE_URL}/locations/salem#faq`,
    );
  });
});
