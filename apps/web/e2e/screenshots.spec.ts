import path from "node:path";

import { revealAll, ROUTES, test } from "./fixtures";

/** Visual QA: full-page screenshots of every route at 375, 768 and 1440px → /screenshots. */
const OUT = path.resolve(import.meta.dirname, "../../../screenshots");
const WIDTHS = [375, 768, 1440] as const;

for (const width of WIDTHS) {
  for (const route of ROUTES) {
    test(`${route} @ ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 812 : width < 1440 ? 1024 : 900 });
      await page.goto(route, { waitUntil: "networkidle" });
      await revealAll(page);
      const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "_");
      await page.screenshot({ path: path.join(OUT, `${name}-${width}.png`), fullPage: true });
    });
  }
}
