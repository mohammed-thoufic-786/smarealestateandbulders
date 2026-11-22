import { afterEach, describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createLead, listLeads, updateLeadStatus } from "@/lib/data/repository";
import { getOfficialProperty } from "@/lib/data/properties";

const file = path.join(process.cwd(), "data", "enquiries.json");
const original = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;

afterEach(() => {
  if (original === null) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  } else {
    fs.writeFileSync(file, original, "utf8");
  }
});

describe("enquiry persistence", () => {
  it("saves an enquiry with the canonical property association", async () => {
    const property = getOfficialProperty("kurunji-garden")!;
    const lead = await createLead({
      name: "Verification Buyer",
      phone: "+91 90000 11111",
      email: "verify@example.com",
      requirements: "Interested in plot availability",
      source: "website_enquiry",
      propertyId: property._id,
      propertyTitle: property.title,
      propertySlug: property.slug,
    });

    expect(lead._id).toMatch(/^enq-/);
    expect(lead.status).toBe("new");
    expect(lead.property).toEqual({
      _id: property._id,
      title: property.title,
      slug: property.slug,
    });

    const stored = JSON.parse(fs.readFileSync(file, "utf8")) as typeof lead[];
    expect(stored.some((item) => item._id === lead._id)).toBe(true);
    expect(stored.find((item) => item._id === lead._id)?.property?.title).toBe("KURUNJI GARDEN");
  });

  it("never associates an enquiry with a different official property", async () => {
    const kmb = getOfficialProperty("kmb-garden")!;
    const lead = await createLead({
      name: "Verification Buyer",
      phone: "+91 90000 22222",
      source: "website_enquiry",
      propertyId: kmb._id,
      propertyTitle: "KURUNJI GARDEN",
      propertySlug: "kurunji-garden",
    });

    expect(lead.property?.title).toBe("K.M.B GARDEN");
    expect(lead.property?._id).toBe("kmb-garden");
  });

  it("updates and persists enquiry status", async () => {
    const lead = await createLead({
      name: "Verification Buyer",
      phone: "+91 90000 33333",
      source: "website_enquiry",
      propertyId: "sma-garden",
    });
    const updated = await updateLeadStatus(lead._id, "contacted");
    expect(updated?.status).toBe("contacted");

    const stored = JSON.parse(fs.readFileSync(file, "utf8")) as typeof lead[];
    expect(stored.find((item) => item._id === lead._id)?.status).toBe("contacted");
    expect((await listLeads()).some((item) => item._id === lead._id)).toBe(true);
  });
});
