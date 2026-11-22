import { describe, it, expect } from "vitest";
import { enquiryAdminEmail, siteVisitAdminEmail } from "@/lib/email-templates";

const submittedAt = "2026-11-20T10:00:00.000Z";

describe("enquiryAdminEmail", () => {
  it("includes every enquiry field in text and html", () => {
    const mail = enquiryAdminEmail({
      name: "Ravi Kumar",
      phone: "9876543210",
      email: "ravi@example.com",
      interestedProperty: "K.M.B GARDEN",
      propertyLocation: "Omalur, Salem",
      message: "Please share the layout.",
      source: "website_enquiry",
      submittedAt,
    });

    expect(mail.subject).toContain("K.M.B GARDEN");
    for (const value of [
      "Ravi Kumar",
      "9876543210",
      "ravi@example.com",
      "Omalur, Salem",
      "Please share the layout.",
      submittedAt,
    ]) {
      expect(mail.text).toContain(value);
      expect(mail.html).toContain(value);
    }
  });

  it("escapes user supplied html", () => {
    const mail = enquiryAdminEmail({
      name: "<script>alert(1)</script>",
      phone: "9876543210",
      email: "ravi@example.com",
      interestedProperty: "KURUNJI GARDEN",
      propertyLocation: "Narasinganur, Villupuram",
      source: "website_enquiry",
      submittedAt,
    });
    expect(mail.html).not.toContain("<script>alert(1)</script>");
    expect(mail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });
});

describe("siteVisitAdminEmail", () => {
  it("includes the visit slot and property location", () => {
    const mail = siteVisitAdminEmail({
      customerName: "Nithya R",
      phone: "9876543210",
      email: "nithya@example.com",
      interestedProperty: "S.M.A GARDEN",
      propertyLocation: "Orathur, Villupuram",
      preferredDate: "2026-11-25",
      preferredTime: "11:00",
      contactPreference: "whatsapp",
      submittedAt,
    });
    expect(mail.text).toContain("Orathur, Villupuram");
    expect(mail.html).toContain("2026-11-25");
    expect(mail.html).toContain("11:00");
  });
});
