import { defineConfig, devices } from "@playwright/test";

const CI = Boolean(process.env.CI);
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const apiURL = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

/**
 * End-to-end, accessibility and visual QA. Runs against the production build
 * (`pnpm build` first). Both servers are reused if already running locally.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 60_000,
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    {
      name: "desktop",
      testIgnore: /screenshots\.spec/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      testIgnore: /screenshots\.spec/,
      use: { ...devices["Pixel 7"] },
    },
    {
      // Safari engine: catches WebKit-only issues (e.g. CSP upgrades on plain-HTTP hosts).
      name: "webkit",
      testMatch: /(smoke|trial|navigation)\.spec/,
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "screenshots",
      testMatch: /screenshots\.spec/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : [
        {
          command: "uv run uvicorn app.main:create_app --factory --host 127.0.0.1 --port 8000",
          cwd: "../api",
          url: `${apiURL}/health`,
          reuseExistingServer: !CI,
          timeout: 120_000,
          env: { LEAD_RATE_LIMIT: "100", LOG_JSON: "true" },
        },
        {
          command: "pnpm start",
          url: `${baseURL}/api/health`,
          reuseExistingServer: !CI,
          timeout: 120_000,
        },
      ],
});
