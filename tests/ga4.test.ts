import { describe, it, expect } from "vitest";
import {
  getSafePageLocation,
  getSafePagePath,
  safeLinkText,
  safeWhatsappUrl,
} from "@/lib/ga4";

describe("GA4 URL sanitization", () => {
  it("keeps safe listing filters and removes free-text queries", () => {
    const url = "https://www.smarealestates.com/buy?q=private+name&category=villa&page=2";
    expect(getSafePagePath(url)).toBe("/buy?category=villa&page=2");
    expect(getSafePageLocation(url)).toBe(
      "https://www.smarealestates.com/buy?category=villa&page=2",
    );
  });

  it("removes WhatsApp numbers and message contents", () => {
    expect(safeWhatsappUrl("https://wa.me/919150128777?text=private+message")).toBe(
      "https://wa.me/",
    );
    expect(safeWhatsappUrl("https://api.whatsapp.com/send?phone=919150128777&text=private")).toBe(
      "https://api.whatsapp.com/send",
    );
  });

  it("redacts phone numbers and email addresses from link text", () => {
    expect(safeLinkText("+91 91501 28777", "Call")).toBe("Call");
    expect(safeLinkText("owner@example.com", "Email")).toBe("Email");
    expect(safeLinkText("Enquire now", "WhatsApp")).toBe("Enquire now");
  });
});
