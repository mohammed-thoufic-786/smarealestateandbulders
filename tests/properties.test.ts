import { describe, it, expect } from "vitest";
import { OFFICIAL_PROPERTIES, getOfficialProperty } from "@/lib/data/properties";

describe("official property display locations", () => {
  it("uses only short district-level locations", () => {
    const locations = Object.fromEntries(
      OFFICIAL_PROPERTIES.map((p) => [p.slug, p.location.shortLocation]),
    );
    expect(locations).toEqual({
      "kurunji-garden": "Narasinganur, Villupuram",
      "kmb-garden": "Omalur, Salem",
      "sma-garden": "Orathur, Villupuram",
    });
  });

  it("resolves canonical property details for enquiries", () => {
    const property = getOfficialProperty("kmb-garden");
    expect(property?.title).toBe("K.M.B GARDEN");
    expect(property?.location.shortLocation).toBe("Omalur, Salem");
  });
});
