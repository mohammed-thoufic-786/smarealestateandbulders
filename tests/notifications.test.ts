import { describe, it, expect, afterEach } from "vitest";
import {
  isEmailConfigured,
  isWhatsAppConfigured,
  renderEmailHtml,
  leadAckMessage,
  siteVisitAckMessage,
  sellAckMessage,
} from "@/lib/notifications";

const ORIGINAL = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL };
});

describe("configuration detection", () => {
  it("is disabled without keys", () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.EMAIL_FROM;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
    expect(isEmailConfigured()).toBe(false);
    expect(isWhatsAppConfigured()).toBe(false);
  });

  it("is enabled when all required keys are present", () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.EMAIL_FROM = "Estate <no-reply@example.com>";
    process.env.WHATSAPP_ACCESS_TOKEN = "token";
    process.env.WHATSAPP_PHONE_NUMBER_ID = "123";
    expect(isEmailConfigured()).toBe(true);
    expect(isWhatsAppConfigured()).toBe(true);
  });
});

describe("renderEmailHtml", () => {
  it("escapes html and wraps paragraphs", () => {
    const html = renderEmailHtml("Hi", "Line one\n\n<script>bad</script>");
    expect(html).toContain("Line one");
    expect(html).toContain("&lt;script&gt;bad&lt;/script&gt;");
    expect(html).not.toContain("<script>bad</script>");
  });
});

describe("message builders", () => {
  it("greets the lead by first name", () => {
    const { subject, text } = leadAckMessage("Ganesh Subramanian", "3BHK in OMR");
    expect(subject).toMatch(/enquiry/i);
    expect(text).toContain("Hi Ganesh");
    expect(text).toContain("3BHK in OMR");
  });

  it("includes property and slot in the site visit ack", () => {
    const { text } = siteVisitAckMessage("Nithya R", "Sea View Villa", "2026-01-10", "11:00");
    expect(text).toContain("Hi Nithya");
    expect(text).toContain("Sea View Villa");
    expect(text).toContain("2026-01-10 at 11:00");
  });

  it("summarises a sell request", () => {
    const { subject, text } = sellAckMessage("Owner One", "Sell a villa in Coimbatore");
    expect(subject).toMatch(/listing/i);
    expect(text).toContain("Hi Owner");
    expect(text).toContain("Sell a villa in Coimbatore");
  });
});
