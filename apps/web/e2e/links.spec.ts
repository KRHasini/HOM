import { expect, test } from "./fixtures";

test("call and WhatsApp links use the configured number and prefill", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('a[href="tel:+919742508862"]').first()).toBeVisible();
  const wa = page.locator('a[href^="https://wa.me/919742508862"]').first();
  await expect(wa).toHaveAttribute(
    "href",
    /text=Hi%20HOM%2C%20I%20would%20like%20to%20book%20a%20free%20trial%20class\./,
  );
  await expect(wa).toHaveAttribute("rel", "noopener noreferrer");
});

test("social links point to the studio's channels", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator('footer a[href="https://www.instagram.com/houseofmovements.in"]'),
  ).toHaveCount(1);
  await expect(page.locator('footer a[href="https://youtube.com/@houseofmovements"]')).toHaveCount(
    1,
  );
});

test("class pages preselect the class in the trial form", async ({ page }) => {
  await page.goto("/classes/yoga", { waitUntil: "networkidle" });
  await page
    .getByRole("link", { name: /book a free trial for yoga/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/trial\?class=yoga/);
});
