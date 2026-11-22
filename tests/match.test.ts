import { describe, it, expect } from "vitest";
import { matchScore } from "@/lib/data/repository";
import type { Property } from "@/lib/types";

function prop(overrides: Partial<Property>): Property {
  return {
    _id: "p1",
    title: "Test Property",
    slug: "test-property",
    description: "A test property",
    category: "apartment",
    listingType: "buy",
    price: 5000000,
    priceUnit: "total",
    location: {
      address: "Adyar, Chennai",
      area: "Adyar",
      city: "Chennai",
      district: "Chennai",
      state: "Tamil Nadu",
      pincode: "600020",
    },
    specifications: { builtUpArea: 1200, bedrooms: 3, bathrooms: 2 },
    amenities: [],
    nearby: [],
    images: [],
    documents: [],
    owner: { _id: "o1", name: "Owner" },
    approvalStatus: "approved",
    availabilityStatus: "available",
    verified: true,
    featured: false,
    isDemo: true,
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Property;
}

describe("matchScore", () => {
  it("scores within-budget matches higher", () => {
    const within = matchScore(prop({ price: 4000000 }), { budgetMax: 5000000 });
    const over = matchScore(prop({ price: 9000000 }), { budgetMax: 5000000 });
    expect(within.score).toBeGreaterThan(over.score);
    expect(within.reasons).toContain("Within your budget");
  });

  it("rewards city matches", () => {
    const r = matchScore(prop({ location: { ...prop({}).location, city: "Madurai" } }), { cities: ["Madurai"] });
    expect(r.reasons).toContain("Located in Madurai");
  });

  it("clamps score to a sensible range", () => {
    const r = matchScore(prop({}), {
      budgetMax: 10000000,
      cities: ["Chennai"],
      categories: ["apartment"],
      bedrooms: 2,
      purpose: "living",
    });
    expect(r.score).toBeGreaterThanOrEqual(35);
    expect(r.score).toBeLessThanOrEqual(99);
  });
});
