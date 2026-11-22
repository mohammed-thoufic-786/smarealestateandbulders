import { describe, it, expect } from "vitest";
import { parseSearchParams, queryToSearchParams, activeFilterCount } from "@/lib/search-params";

describe("parseSearchParams", () => {
  it("parses numbers and flags", () => {
    const q = parseSearchParams({
      q: "villa",
      city: "Chennai",
      minPrice: "5000000",
      maxPrice: "10000000",
      bedrooms: "3",
      verified: "true",
      page: "2",
    });
    expect(q.q).toBe("villa");
    expect(q.city).toBe("Chennai");
    expect(q.minPrice).toBe(5000000);
    expect(q.maxPrice).toBe(10000000);
    expect(q.bedrooms).toBe(3);
    expect(q.verified).toBe(true);
    expect(q.page).toBe(2);
  });

  it("applies defaults", () => {
    const q = parseSearchParams({});
    expect(q.page).toBe(1);
    expect(q.limit).toBe(9);
    expect(q.sort).toBe("recent");
    expect(q.amenities).toEqual([]);
  });

  it("normalizes amenity arrays", () => {
    const q = parseSearchParams({ amenity: ["Lift", "Gymnasium"] });
    expect(q.amenities).toEqual(["Lift", "Gymnasium"]);
  });
});

describe("queryToSearchParams", () => {
  it("round-trips core fields", () => {
    const q = parseSearchParams({ q: "plot", city: "Madurai", bedrooms: "2" });
    const s = queryToSearchParams(q);
    expect(s).toContain("q=plot");
    expect(s).toContain("city=Madurai");
    expect(s).toContain("bedrooms=2");
  });

  it("omits default page and sort", () => {
    const s = queryToSearchParams({ page: 1, sort: "recent" });
    expect(s).not.toContain("page=");
    expect(s).not.toContain("sort=");
  });

  it("applies overrides and deletions", () => {
    const s = queryToSearchParams({ city: "Chennai" }, { city: undefined, area: "Adyar" });
    expect(s).not.toContain("city=");
    expect(s).toContain("area=Adyar");
  });
});

describe("activeFilterCount", () => {
  it("counts active filters", () => {
    expect(activeFilterCount({})).toBe(0);
    expect(activeFilterCount({ q: "villa", city: "Chennai", bedrooms: 3 })).toBe(3);
    expect(activeFilterCount({ minPrice: 100, maxPrice: 200 })).toBe(1);
    expect(activeFilterCount({ amenities: ["Lift", "Gym"] })).toBe(2);
  });
});
