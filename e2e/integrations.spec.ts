import { test, expect } from "@playwright/test";

const WHATSAPP_NUMBER = "919150128777";
const FACEBOOK_URL = "https://www.facebook.com/share/1UP65RyDmK/";
const INSTAGRAM_URL = "https://www.instagram.com/s.m.a_realestate_and_builders";
const GENERAL_MESSAGE =
  "Hello SMA Real Estate & Builders, I would like to enquire about your properties and services. Please contact me.";

const LOCATIONS = [
  { name: "Salem", slug: "salem" },
  { name: "Ulundurpet", slug: "ulundurpet" },
  { name: "Villupuram", slug: "villupuram" },
  { name: "Vikravandi", slug: "vikravandi" },
  { name: "Acharapakam", slug: "acharapakam" },
  { name: "Melmaruvathur", slug: "melmaruvathur" },
  { name: "Madurantakam", slug: "madurantakam" },
  { name: "Kanchipuram", slug: "kanchipuram" },
  { name: "Vandavasi", slug: "vandavasi" },
];

test("WhatsApp and social links use the business configuration", async ({ page }) => {
  await page.goto("/");

  const floating = page.getByRole("link", { name: /chat with sma real estate.*whatsapp/i });
  await expect(floating).toBeVisible();
  const whatsappHref = (await floating.getAttribute("href")) ?? "";
  expect(whatsappHref).toContain(`https://wa.me/${WHATSAPP_NUMBER}`);
  expect(decodeURIComponent(whatsappHref)).toContain(GENERAL_MESSAGE);

  await expect(page.locator('footer a[aria-label="Facebook"]')).toHaveAttribute("href", FACEBOOK_URL);
  await expect(page.locator('footer a[aria-label="Instagram"]')).toHaveAttribute("href", INSTAGRAM_URL);
});

test("property enquiry opens WhatsApp with the exact property message", async ({ page }) => {
  await page.goto("/property/kmb-garden");

  const link = page.getByRole("link", { name: /enquire now/i }).first();
  const href = (await link.getAttribute("href")) ?? "";
  expect(decodeURIComponent(href)).toContain(
    "Hello SMA Real Estate & Builders, I am interested in K.M.B GARDEN. I would like to know more about this property. Please share the details.",
  );
});

test("contact form opens WhatsApp with visitor details", async ({ page }) => {
  await page.goto("/contact");

  const contact = page.getByTestId("contact-grid");
  const popupPromise = page.waitForEvent("popup");
  await contact.getByLabel(/full name/i).fill("E2E Integration Buyer");
  await contact.getByLabel(/phone number/i).fill("+91 98765 43210");
  await contact.getByLabel(/email address/i).fill("integration@example.com");
  await contact.getByLabel(/message/i).fill("Please share current options.");
  await contact.getByRole("button", { name: /send via whatsapp/i }).click();

  const popup = await popupPromise;
  await popup.waitForLoadState("domcontentloaded").catch(() => undefined);
  const popupUrl = new URL(popup.url());
  const text = popupUrl.searchParams.get("text") ?? "";
  expect(popupUrl.href).toContain(WHATSAPP_NUMBER);
  expect(text).toContain("Name: E2E Integration Buyer");
  expect(text).toContain("Phone: +91 98765 43210");
  expect(text).toContain("Email: integration@example.com");
  expect(text).toContain("Message: Please share current options.");
  await popup.close();
});

test("explore by property type opens a crawlable type page", async ({ page }) => {
  await page.goto("/");

  const link = page.getByRole("link", { name: /residential plot/i }).first();
  await expect(link).toHaveAttribute("href", "/buy/type/residential-plot");
  await link.click();
  await expect(page).toHaveURL("/buy/type/residential-plot");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Residential Plot for Sale");
});

test("explore by location opens a crawlable location page", async ({ page }) => {
  await page.goto("/");

  for (const location of LOCATIONS) {
    const link = page.getByRole("link", {
      name: `View properties and enquiries in ${location.name}`,
      exact: true,
    });
    await expect(link).toHaveAttribute("href", `/locations/${location.slug}`);
    await link.click();
    await expect(page).toHaveURL(`/locations/${location.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(location.name);
    await page.goto("/");
  }
});
