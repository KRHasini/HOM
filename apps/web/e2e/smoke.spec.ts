import { expect, ROUTES, test } from "./fixtures";

for (const route of ROUTES) {
  test(`${route} renders with one h1, metadata and no console errors`, async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/House of Movements/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflow, "horizontal overflow").toBe(false);
    expect(consoleErrors).toEqual([]);
  });
}

test("unknown routes render the branded 404", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/missed a step/i);
  await expect(page.getByRole("link", { name: /back to the studio/i })).toHaveAttribute(
    "href",
    "/",
  );
});

test("sitemap, robots and health endpoints respond", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain("/classes/bharatanatyam");
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect(await (await request.get("/api/health")).json()).toEqual({ status: "ok" });
});

test("home exposes DanceSchool structured data", async ({ page }) => {
  await page.goto("/");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.some((b) => b.includes('"DanceSchool"'))).toBe(true);
});
