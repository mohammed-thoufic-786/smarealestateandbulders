import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests. They run against a production build by default:
 *
 *   npm run build && npm run test:e2e
 *
 * The suite starts its own server on a dedicated port (default 3100) so it never
 * clashes with a dev server on 3000. Override with `E2E_PORT` / `E2E_BASE_URL`.
 */
const port = process.env.E2E_PORT || "3100";
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          PORT: port,
          AUTH_SECRET: "e2e-secret-at-least-32-characters-long-xx",
          NEXT_PUBLIC_SITE_URL: baseURL,
        },
      },
});
