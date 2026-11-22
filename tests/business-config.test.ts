import { describe, it, expect } from "vitest";
import {
  businessConfig,
  contactWhatsappMessage,
  whatsappLink,
  propertyWhatsappMessage,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/business-config";

describe("businessConfig", () => {
  it("uses the published WhatsApp number with India country code", () => {
    expect(businessConfig.whatsappNumber).toBe("919150128777");
  });

  it("uses the supplied normalized social links", () => {
    expect(businessConfig.facebookUrl).toBe("https://www.facebook.com/share/1UP65RyDmK/?mibextid=wwXIfr");
    expect(businessConfig.instagramUrl).toContain("s.m.a_realestate_and_builders");
  });
});

describe("whatsappLink", () => {
  it("prefills the general enquiry message by default", () => {
    const href = whatsappLink();
    expect(href).toContain("https://wa.me/919150128777?text=");
    expect(decodeURIComponent(href)).toContain(DEFAULT_WHATSAPP_MESSAGE);
  });
});

describe("propertyWhatsappMessage", () => {
  it("uses the exact Kurinji Garden message", () => {
    expect(propertyWhatsappMessage("KURUNJI GARDEN", "kurunji-garden")).toBe(
      "Hello SMA Real Estate & Builders, I am interested in Kurinji Garden. I would like to know more about the property, pricing, location and availability. Please share the details.",
    );
  });

  it("uses the exact message for other properties", () => {
    expect(propertyWhatsappMessage("K.M.B GARDEN", "kmb-garden")).toBe(
      "Hello SMA Real Estate & Builders, I am interested in K.M.B GARDEN. I would like to know more about this property. Please share the details.",
    );
  });
});

describe("contactWhatsappMessage", () => {
  it("includes all visitor details in the supplied format", () => {
    expect(
      contactWhatsappMessage({
        name: "Ravi Kumar",
        phone: "9876543210",
        email: "ravi@example.com",
        message: "I want details.",
      }),
    ).toBe(
      [
        "Hello SMA Real Estate & Builders,",
        "",
        "I would like to make an enquiry.",
        "",
        "Name: Ravi Kumar",
        "Phone: 9876543210",
        "Email: ravi@example.com",
        "",
        "Message: I want details.",
        "",
        "Please contact me regarding my enquiry.",
      ].join("\n"),
    );
  });
});
