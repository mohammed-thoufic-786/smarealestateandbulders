import { test, expect } from "@playwright/test";

test("home page renders and links into the catalogue", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href^="/property/"]').first()).toBeVisible();
  await expect(page.locator('a[href="/buy"]').first()).toBeVisible();
});

test("home page features only the official SMA properties", async ({ page }) => {
  await page.goto("/");
  const expectedSlugs = ["kurunji-garden", "kmb-garden", "sma-garden", "prestige-garden"];
  for (const slug of expectedSlugs) {
    await expect(page.locator(`a[href="/property/${slug}"]`).first()).toBeVisible();
  }

  const uniqueSlugs = await page
    .locator('a[href^="/property/"]')
    .evaluateAll((links) =>
      Array.from(new Set(links.map((link) => link.getAttribute("href")?.split("/").pop() ?? ""))),
    );
  expect(uniqueSlugs.sort()).toEqual(expectedSlugs.sort());
});

test("home page keeps property type and location exploration separate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 2, name: "Find your fit" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Where we operate" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Villupuram/ }).first()).toBeVisible();
});

test("primary navigation reaches the buy page", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/buy"]').first().click();
  await expect(page).toHaveURL(/\/buy/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("home hero uses the exact premium positioning copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /^Explore premium residential plots and villas in Villupuram, Salem and across Tamil Nadu with SMA Real Estate & Builders\.$/,
  );
});

test("home page shows the supplied customer reviews and avatars", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Naanga plot vaanganum nu search pannitu irundhom/)).toBeVisible();
  await expect(page.getByText(/Starting la konjam doubts irundhuchu/)).toBeVisible();
  await expect(page.getByText(/SMA Real Estate & Builders team-oda experience nalla irundhuchu/)).toBeVisible();
  for (const name of ["Iyyanar Appan", "Vengatesh", "Saranraj"]) {
    await expect(page.locator(`img[alt="${name}"]`)).toBeVisible();
  }
});

