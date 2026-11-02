import { test as base, expect, type Page } from "@playwright/test";

export const ROUTES = [
  "/",
  "/about",
  "/classes",
  "/classes/bharatanatyam",
  "/classes/western-hip-hop",
  "/classes/yoga",
  "/classes/zumba",
  "/instructors",
  "/gallery",
  "/events",
  "/contact",
  "/trial",
  "/faq",
  "/privacy",
  "/terms",
] as const;

/** Scrolls the whole page so every "reveal on first view" animation has played. */
export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

/** Fails the test on any console error or uncaught exception. */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await use(errors);
    expect(errors, "console errors").toEqual([]);
  },
});

export { expect };
