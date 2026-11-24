import { describe, it, expect } from "vitest";
import { OFFICIAL_PROPERTIES, getOfficialProperty } from "@/lib/data/properties";
import { getFeaturedProperties } from "@/lib/data/repository";

describe("official property display locations", () => {
  it("uses only short district-level locations", () => {
    const locations = Object.fromEntries(
      OFFICIAL_PROPERTIES.map((p) => [p.slug, p.location.shortLocation]),
    );
    expect(locations).toEqual({
      "kurunji-garden": "Narasinganur, Villupuram",
      "kmb-garden": "Omalur, Salem",
      "sma-garden": "Orathur, Villupuram",
      "prestige-garden": "Karipatti, Salem",
    });
  });

  it("resolves canonical property details for enquiries", () => {
    const property = getOfficialProperty("kmb-garden");
    expect(property?.title).toBe("K.M.B GARDEN");
    expect(property?.location.shortLocation).toBe("Omalur, Salem");
  });

  it("publishes the Prestige Garden property as an official featured project", () => {
    const property = getOfficialProperty("prestige-garden");
    expect(property?.title).toBe("PRESTIGE GARDEN");
    expect(property?.featured).toBe(true);
  });

  it("keeps catalogue and featured property lists unique", async () => {
    const ids = OFFICIAL_PROPERTIES.map((p) => p._id);
    const slugs = OFFICIAL_PROPERTIES.map((p) => p.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);

    const featuredIds = (await getFeaturedProperties(10)).map((p) => p._id);
    expect(featuredIds).toContain("prestige-garden");
    expect(new Set(featuredIds).size).toBe(featuredIds.length);
  });
});
