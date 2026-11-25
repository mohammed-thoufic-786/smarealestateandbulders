import { test, expect, type Page } from "@playwright/test";

const desktopViewports = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1366", width: 1366, height: 768 },
  { name: "768", width: 768, height: 1024 },
] as const;

const mobileViewports = [
  { name: "430", width: 430, height: 932 },
  { name: "390", width: 390, height: 844 },
  { name: "360", width: 360, height: 780 },
] as const;

const fullWidthViewports = [
  { name: "1920", width: 1920, height: 1080 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1366", width: 1366, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
] as const;

const mobileSpacingViewports = [
  { name: "360", width: 360, height: 780 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "414", width: 414, height: 896 },
  { name: "440", width: 440, height: 956 },
] as const;

const allRoutes = [
  "/",
  "/buy",
  "/property/kurunji-garden",
  "/property/prestige-garden",
  "/locations",
  "/about",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
] as const;

async function expectNoHorizontalOverflow(page: Page, width: number) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(width + 1);
}

async function expectFullWidthContainers(page: Page, width: number) {
  const boxes = await page.locator(".container-x").evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, width: rect.width };
    }),
  );

  expect(boxes.length).toBeGreaterThan(0);
  for (const box of boxes) {
    expect(box.x).toBeLessThanOrEqual(1);
    expect(box.width).toBeGreaterThanOrEqual(width - 2);
    expect(box.width).toBeLessThanOrEqual(width + 2);
  }
}

async function expectMobileSpacing(page: Page, route: string, width: number) {
  const metrics = await page.evaluate(() => {
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const h1 = main?.querySelector("h1");
    if (!header || !main || !footer || !h1) return null;

    const headerRect = header.getBoundingClientRect();
    const h1Rect = h1.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();

    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    let firstContentTop: number | null = null;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent?.trim()) continue;
      const element = node.parentElement;
      if (!element || element.closest("script,style")) continue;
      const style = getComputedStyle(element);
      if (style.visibility === "hidden" || style.display === "none") continue;
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) continue;
      firstContentTop = firstContentTop === null ? rect.top : Math.min(firstContentTop, rect.top);
    }

    const candidates = Array.from(
      main.querySelectorAll("h1,h2,h3,h4,p,a,button,img,iframe,svg"),
    ).filter((element) => {
      const style = getComputedStyle(element);
      if (style.position === "fixed" || style.position === "absolute") return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    const lastBottom = candidates.length
      ? Math.max(...candidates.map((element) => element.getBoundingClientRect().bottom))
      : h1Rect.bottom;

    return {
      firstContentGap: firstContentTop === null ? null : firstContentTop - headerRect.bottom,
      bottomGap: footerRect.top - lastBottom,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });

  expect(metrics, `${route} is missing header, main, footer or h1`).not.toBeNull();
  if (!metrics) return;

  expect(metrics.firstContentGap, `${route} content overlaps the header`).not.toBeNull();
  if (metrics.firstContentGap !== null) {
    expect(metrics.firstContentGap).toBeGreaterThanOrEqual(8);
    expect(metrics.firstContentGap).toBeLessThanOrEqual(48);
  }
  expect(metrics.bottomGap, `${route} content is too close to the footer`).toBeGreaterThanOrEqual(24);
  expect(metrics.bottomGap, `${route} has excessive space before the footer`).toBeLessThanOrEqual(160);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(width + 1);
}

for (const viewport of desktopViewports) {
  test(`header is one aligned horizontal row at ${viewport.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const header = page.getByTestId("site-header");
    const headerBox = await header.boundingBox();
    expect(headerBox?.width).toBe(viewport.width);
    expect(headerBox?.height).toBeGreaterThanOrEqual(80);
    expect(headerBox?.height).toBeLessThanOrEqual(91);

    const background = await header.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(background).toContain("248, 245, 237");

    const logoBox = await header.getByRole("link", { name: /SMA Real Estate/i }).first().boundingBox();
    expect(logoBox?.x ?? 0).toBeGreaterThan(24);

    const nav = header.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    const navBox = await nav.boundingBox();
    expect(Math.abs((logoBox?.y ?? 0) - (navBox?.y ?? 0))).toBeLessThan(24);
    expect(navBox?.height).toBeLessThanOrEqual(44);
    const navCenter = (navBox?.x ?? 0) + (navBox?.width ?? 0) / 2;
    expect(Math.abs(navCenter - viewport.width / 2)).toBeLessThan(160);

    const contact = header.getByRole("link", { name: "Contact Us", exact: true });
    await expect(contact).toBeVisible();
    const browse = header.getByRole("link", { name: "Browse Properties", exact: true });
    await expect(browse).toBeVisible();
    const browseBackground = await browse.evaluate((element) => getComputedStyle(element).backgroundColor);
    expect(browseBackground).toContain("18, 63, 43");
    const contactBox = await contact.boundingBox();
    const browseBox = await browse.boundingBox();
    expect(contactBox?.height).toBeLessThanOrEqual(44);
    expect(browseBox?.height).toBeLessThanOrEqual(48);
    expect(browseBox?.x ?? 0).toBeGreaterThan(contactBox?.x ?? 0);

    await expectNoHorizontalOverflow(page, viewport.width);
    await page.screenshot({ path: `test-results/header-${viewport.name}.png`, fullPage: false });
  });
}

for (const viewport of mobileViewports) {
  test(`mobile drawer works cleanly at ${viewport.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const header = page.getByTestId("site-header");
    await expect(header.getByRole("navigation", { name: "Primary" })).toBeHidden();
    const menuButton = header.getByRole("button", { name: /open menu/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const drawer = page.getByRole("dialog", { name: /site navigation/i });
    await expect(drawer).toBeVisible();
    for (const label of ["Home", "Buy", "Location", "About", "Contact"]) {
      await expect(drawer.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(drawer.getByRole("link", { name: /browse properties/i })).toBeVisible();
    await expect(drawer.getByRole("link", { name: /\+91 91501 28777/ })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
    await expectNoHorizontalOverflow(page, viewport.width);
    await page.screenshot({ path: `test-results/header-${viewport.name}.png`, fullPage: false });
  });
}

test("contact page keeps the 45/55 desktop split and stacks on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact");

  const leftBox = await page.getByTestId("contact-details").boundingBox();
  const formBox = await page.locator("form").first().boundingBox();
  const gap = (formBox?.x ?? 0) - ((leftBox?.x ?? 0) + (leftBox?.width ?? 0));
  const ratio = (formBox?.width ?? 0) / ((leftBox?.width ?? 0) + (formBox?.width ?? 0));
  expect(gap).toBeGreaterThanOrEqual(28);
  expect(gap).toBeLessThanOrEqual(44);
  expect(ratio).toBeGreaterThan(0.52);
  expect(ratio).toBeLessThan(0.58);
  await expectNoHorizontalOverflow(page, 1440);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  const mobileLeftBox = await page.getByTestId("contact-details").boundingBox();
  const mobileFormBox = await page.locator("form").first().boundingBox();
  expect(mobileFormBox?.y ?? 0).toBeGreaterThan((mobileLeftBox?.y ?? 0) + (mobileLeftBox?.height ?? 0) - 2);
  await expectNoHorizontalOverflow(page, 390);
});

for (const viewport of fullWidthViewports) {
  test(`all pages use full-width containers at ${viewport.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of allRoutes) {
      await page.goto(route);
      await expect(page.getByTestId("site-header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      await expectFullWidthContainers(page, viewport.width);
      await expectNoHorizontalOverflow(page, viewport.width);
    }

    await page.goto("/");
    await page.screenshot({ path: `test-results/full-width-${viewport.name}.png`, fullPage: false });
  });
}

for (const viewport of mobileSpacingViewports) {
  test(`all pages have balanced mobile vertical spacing at ${viewport.name}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of allRoutes) {
      await page.goto(route);
      await expect(page.getByTestId("site-header")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      await expectMobileSpacing(page, route, viewport.width);
    }

    await page.goto("/");
    await page.screenshot({ path: `test-results/mobile-spacing-${viewport.name}.png`, fullPage: false });
  });
}

test("explore by location cards expand with the section", async ({ page }) => {
  for (const viewport of fullWidthViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const section = page.locator("section").filter({ hasText: "Where we operate" }).first();
    const sectionBox = await section.boundingBox();
    const gridBox = await section.locator(".grid").first().boundingBox();
    const padding = await section.evaluate((element) => parseFloat(getComputedStyle(element).paddingLeft));

    expect(sectionBox?.x ?? 0).toBeLessThanOrEqual(1);
    expect(sectionBox?.width ?? 0).toBeGreaterThanOrEqual(viewport.width - 2);
    expect(Math.abs((gridBox?.x ?? 0) - padding)).toBeLessThan(4);
    expect(gridBox?.width ?? 0).toBeGreaterThanOrEqual(viewport.width - padding * 2 - 4);
    await expectNoHorizontalOverflow(page, viewport.width);
  }
});

test("locations page links to crawlable location pages", async ({ page }) => {
  for (const viewport of [...desktopViewports, ...mobileViewports]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/locations");

    const cards = page.locator('a[href^="/locations/"]');
    await expect(cards).toHaveCount(9);
    await expect(page.getByRole("heading", { name: "Villupuram", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Salem", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Omalur", exact: true })).toHaveCount(0);

    for (const city of ["villupuram", "salem"]) {
      const card = page.locator(`a[href="/locations/${city}"]`);
      await expect(card.getByText(/2 properties/)).toBeVisible();
      await card.click();
      await expect(page).toHaveURL(`/locations/${city}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        city === "villupuram" ? "Villupuram" : "Salem",
      );
      await page.goto("/locations");
    }
  }
});
