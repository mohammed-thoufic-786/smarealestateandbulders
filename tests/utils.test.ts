import { describe, it, expect } from "vitest";
import { formatINR, formatArea, slugify, pricePerSqft, initials, clamp, formatNumber } from "@/lib/utils";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Luxury Villa in OMR, Chennai")).toBe("luxury-villa-in-omr-chennai");
  });
  it("collapses repeats and trims", () => {
    expect(slugify("  A  --  B  ")).toBe("a-b");
  });
});

describe("formatINR", () => {
  it("formats compact lakh", () => {
    expect(formatINR(2500000, { compact: true })).toBe("₹25 L");
  });
  it("formats compact crore", () => {
    expect(formatINR(12500000, { compact: true })).toBe("₹1.25 Cr");
  });
  it("formats full Indian grouping", () => {
    expect(formatINR(12500000)).toBe("₹1,25,00,000");
  });
  it("handles non-finite", () => {
    expect(formatINR(NaN)).toBe("—");
  });
});

describe("formatArea", () => {
  it("returns dash for empty", () => {
    expect(formatArea()).toBe("—");
    expect(formatArea(0)).toBe("—");
  });
  it("formats thousands", () => {
    expect(formatArea(1200)).toBe("1.2K sq.ft.");
  });
  it("formats acres", () => {
    expect(formatArea(87120)).toBe("2 acres");
  });
});

describe("pricePerSqft", () => {
  it("computes rate", () => {
    expect(pricePerSqft(6000000, 1200)).toBe(5000);
  });
  it("returns null without area", () => {
    expect(pricePerSqft(6000000)).toBeNull();
    expect(pricePerSqft(6000000, 0)).toBeNull();
  });
});

describe("helpers", () => {
  it("initials", () => {
    expect(initials("Arjun Menon")).toBe("AM");
    expect(initials("Fathima")).toBe("F");
  });
  it("clamp", () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
  });
  it("formatNumber", () => {
    expect(formatNumber(1250000)).toBe("12,50,000");
  });
});
