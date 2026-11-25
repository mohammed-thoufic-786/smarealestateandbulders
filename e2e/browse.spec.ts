import { test, expect, type Page } from "@playwright/test";

const OFFICIAL_SLUGS = [
  "kurunji-garden",
  "kmb-garden",
  "sma-garden",
  "prestige-garden",
];
const OFFICIAL_TITLES = [
  "KURUNJI GARDEN",
  "K.M.B GARDEN",
  "S.M.A GARDEN",
  "PRESTIGE GARDEN",
];

async function gotoReady(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load", { timeout: 5_000 }).catch(() => {});
  await page.waitForTimeout(250);
}

test("browse page lists only the four official SMA properties", async ({ page }) => {
  await gotoReady(page, "/buy");
  await expect(page.getByText(/4 properties found/)).toBeVisible();

  for (const slug of OFFICIAL_SLUGS) {
    await expect(page.locator(`a[href="/property/${slug}"]`).first()).toBeVisible();
  }
  for (const title of OFFICIAL_TITLES) {
    await expect(page.getByRole("link", { name: title, exact: true }).first()).toBeVisible();
  }

  const uniqueSlugs = await page
    .locator('a[href^="/property/"]')
    .evaluateAll((links) =>
      Array.from(new Set(links.map((link) => link.getAttribute("href")?.split("/").pop() ?? ""))),
    );
  expect(uniqueSlugs.sort()).toEqual([...OFFICIAL_SLUGS].sort());
});

test("browse page keeps all four price-on-request labels compact", async ({ page }) => {
  await gotoReady(page, "/buy");

  const prices = page.getByText("Price on request", { exact: true });
  await expect(prices).toHaveCount(4);

  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    const fontSizes = await prices.evaluateAll((nodes) =>
      nodes.map((node) => getComputedStyle(node).fontSize),
    );
    expect(fontSizes).toEqual(["13px", "13px", "13px", "13px"]);
  }
});

test("browse page opens an official detail page with the layout viewer", async ({ page }) => {
  await gotoReady(page, "/buy");
  await page.locator('a[href="/property/kurunji-garden"]').first().click();

  await expect(page).toHaveURL(/\/property\/kurunji-garden$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("KURUNJI GARDEN");
  await expect(
    page.getByRole("button", { name: /open full-screen view of kurunji garden layout/i }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /zoom in on the layout/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /zoom out of the layout/i })).toHaveCount(0);
  await expect(page.getByText(/scroll to zoom/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /enquire now/i }).first()).toBeVisible();
});

test("layout preview opens a clean full-screen image view on desktop and mobile", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await gotoReady(page, "/property/kurunji-garden");

    const preview = page.getByRole("button", { name: /open full-screen view of kurunji garden layout/i });
    await preview.click();

    const dialog = page.getByRole("dialog", { name: /kurunji garden original layout drawing/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: /close full-screen layout view/i })).toBeVisible();
    await expect(dialog.locator("img").first()).toHaveCSS("object-fit", "contain");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await preview.click();
    await page.mouse.click(12, 12);
    await expect(dialog).toBeHidden();
  }
});

test("URL query narrows the catalogue and can be cleared", async ({ page }) => {
  await gotoReady(page, "/buy?q=Villupuram");
  await expect(page.getByText(/2 properties found/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Villupuram/ })).toBeVisible();

  await page.getByRole("button", { name: /clear all/i }).click();
  await expect(page).toHaveURL(/\/buy$/);
  await expect(page.getByText(/4 properties found/)).toBeVisible();
});

test("enquiry opens WhatsApp with the selected official property", async ({ page }) => {
  await gotoReady(page, "/property/kmb-garden");

  const link = page.getByRole("link", { name: /enquire now/i }).first();
  const href = (await link.getAttribute("href")) ?? "";
  const message = decodeURIComponent(href);
  expect(message).toContain("https://wa.me/919150128777?text=");
  expect(message).toContain("I am interested in K.M.B GARDEN.");
});
