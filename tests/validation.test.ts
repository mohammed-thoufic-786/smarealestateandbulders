import { describe, it, expect } from "vitest";
import { leadSchema, sellRequestSchema, registerSchema, loginSchema } from "@/lib/validation";

const token = "test-submission-token-1234567890";

describe("leadSchema", () => {
  it("accepts a valid lead", () => {
    const r = leadSchema.safeParse({
      name: "Ganesh S",
      phone: "+91 98765 43210",
      email: "ganesh@example.com",
      source: "website_enquiry",
      budget: 4500000,
      propertyLocation: "Omalur, Salem",
      submissionToken: token,
    });
    expect(r.success).toBe(true);
  });

  it("rejects a short name and bad phone", () => {
    const r = leadSchema.safeParse({ name: "G", phone: "12", source: "website_enquiry" });
    expect(r.success).toBe(false);
  });

  it("requires a valid email", () => {
    const base = { name: "Ganesh", phone: "+91 98765 43210", source: "website_enquiry" as const, submissionToken: token };
    expect(leadSchema.safeParse(base).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: "ganesh@example.com" }).success).toBe(true);
  });

  it("rejects an unknown source", () => {
    const r = leadSchema.safeParse({
      name: "Ganesh",
      phone: "+91 98765 43210",
      email: "ganesh@example.com",
      source: "carrier_pigeon",
      submissionToken: token,
    });
    expect(r.success).toBe(false);
  });

  it("rejects a missing submission token", () => {
    const r = leadSchema.safeParse({
      name: "Ganesh",
      phone: "+91 98765 43210",
      email: "ganesh@example.com",
      source: "whatsapp",
    });
    expect(r.success).toBe(false);
  });

  it("coerces string budgets", () => {
    const r = leadSchema.safeParse({
      name: "Ganesh",
      phone: "+91 98765 43210",
      email: "ganesh@example.com",
      source: "whatsapp",
      budget: "5000000",
      submissionToken: token,
    });
    expect(r.success && r.data.budget).toBe(5000000);
  });
});

describe("registerSchema", () => {
  it("requires a strong-ish password", () => {
    expect(registerSchema.safeParse({ name: "Test User", email: "t@e.com", password: "abcdefgh" }).success).toBe(false);
    expect(registerSchema.safeParse({ name: "Test User", email: "t@e.com", password: "abcd1234" }).success).toBe(true);
  });

  it("rejects bad email", () => {
    expect(registerSchema.safeParse({ name: "Test", email: "nope", password: "abcd1234" }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires email and password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });
});

describe("sellRequestSchema", () => {
  it("accepts a valid sell request", () => {
    const r = sellRequestSchema.safeParse({
      name: "Owner One",
      phone: "+91 90000 00000",
      intent: "sell",
      category: "villa",
      city: "Coimbatore",
      expectedPrice: 15000000,
    });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid intent", () => {
    const r = sellRequestSchema.safeParse({
      name: "Owner One",
      phone: "+91 90000 00000",
      intent: "give_away",
      category: "villa",
      city: "Coimbatore",
    });
    expect(r.success).toBe(false);
  });
});
