import { test, expect } from "@playwright/test";

test("home page renders and links into the catalogue", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('a[href^="/property/"]').first()).toBeVisible();
  await expect(page.locator('a[href="/buy"]').first()).toBeVisible();
});

test("home page features only the official SMA properties", async ({ page }) => {
  await page.goto("/");
  for (const slug of ["kurunji-garden", "kmb-garden", "sma-garden"]) {
    await expect(page.locator(`a[href="/property/${slug}"]`).first()).toBeVisible();
  }
});

test("home page keeps property type and location exploration separate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 3, name: "Find your fit" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 3, name: "Where we operate" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Villupuram/ }).first()).toBeVisible();
});

test("primary navigation reaches the buy page", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/buy"]').first().click();
  await expect(page).toHaveURL(/\/buy/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("home page shows the supplied customer reviews and avatars", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Site visit romba nalla explain panninga/)).toBeVisible();
  await expect(page.getByText(/selva sezipa irunga/)).toBeVisible();
  await expect(page.getByText(/romba trustable and good service/)).toBeVisible();
  await expect(page.getByText(/customer service ku 9\/10 kudukala/)).toBeVisible();
  for (const name of ["Iyyanar Appan", "Vengatesh", "Mohammed Thoufic", "Saranraj"]) {
    await expect(page.locator(`img[alt="${name}"]`)).toBeVisible();
  }
});

