import AxeBuilder from "@axe-core/playwright";

import { expect, revealAll, ROUTES, test } from "./fixtures";

test.use({ reducedMotion: "reduce" });

for (const route of ROUTES) {
  test(`${route} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    await revealAll(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      serious.map(
        (v) =>
          `${v.id}: ${v.nodes
            .map((n) => n.target.join(" "))
            .slice(0, 3)
            .join(" | ")}`,
      ),
    ).toEqual([]);
  });
}
