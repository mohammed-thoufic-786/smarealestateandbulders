import { test, expect } from "@playwright/test";

const OFFICIAL_SLUGS = ["kurunji-garden", "kmb-garden", "sma-garden"];
const OFFICIAL_TITLES = ["KURUNJI GARDEN", "K.M.B GARDEN", "S.M.A GARDEN"];

test("browse page lists only the three official SMA properties", async ({ page }) => {
  await page.goto("/buy");
  await expect(page.getByText(/3 properties found/)).toBeVisible();

  for (const slug of OFFICIAL_SLUGS) {
    await expect(page.locator(`a[href="/property/${slug}"]`).first()).toBeVisible();
  }
  for (const title of OFFICIAL_TITLES) {
    await expect(page.getByRole("link", { name: title, exact: true }).first()).toBeVisible();
  }
});

test("browse page opens an official detail page with the layout viewer", async ({ page }) => {
  await page.goto("/buy");
  await page.locator('a[href="/property/kurunji-garden"]').first().click();

  await expect(page).toHaveURL(/\/property\/kurunji-garden$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("KURUNJI GARDEN");
  await expect(page.getByRole("button", { name: /zoom in on the layout/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /view layout full screen/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /enquire now/i }).first()).toBeVisible();
});

test("URL query narrows the catalogue and can be cleared", async ({ page }) => {
  await page.goto("/buy?q=Villupuram");
  await expect(page.getByText(/2 properties found/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Villupuram/ })).toBeVisible();

  await page.getByRole("button", { name: /clear all/i }).click();
  await expect(page).toHaveURL(/\/buy$/);
  await expect(page.getByText(/3 properties found/)).toBeVisible();
});

test("enquiry opens WhatsApp with the selected official property", async ({ page }) => {
  await page.goto("/property/kmb-garden");

  const link = page.getByRole("link", { name: /enquire now/i }).first();
  const href = (await link.getAttribute("href")) ?? "";
  const message = decodeURIComponent(href);
  expect(message).toContain("https://wa.me/919150128777?text=");
  expect(message).toContain("I am interested in K.M.B GARDEN.");
});
