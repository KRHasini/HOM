import { expect, test } from "./fixtures";

test("primary navigation reaches every section", async ({ page, isMobile }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  if (isMobile) {
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Classes" }).click();
  } else {
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Classes" })
      .click();
  }
  await expect(page).toHaveURL(/\/classes$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/classes/i);
});

test("mobile action bar offers call, WhatsApp and trial", async ({ page, isMobile }) => {
  test.skip(!isMobile, "phones only");
  await page.goto("/", { waitUntil: "networkidle" });
  const bar = page.getByRole("navigation", { name: "Quick actions" });
  await expect(bar.getByRole("link", { name: /call/i })).toHaveAttribute(
    "href",
    "tel:+919742508862",
  );
  await expect(bar.getByRole("link", { name: /whatsapp/i })).toHaveAttribute(
    "href",
    /wa\.me\/919742508862/,
  );
  await expect(bar.getByRole("link", { name: /book trial/i })).toHaveAttribute("href", "/trial");
});

test("class filters narrow the grid", async ({ page }) => {
  await page.goto("/classes", { waitUntil: "networkidle" });
  const cards = page.locator('main ul a[href^="/classes/"]');
  await expect(cards).toHaveCount(8);
  await page.getByRole("button", { name: "Traditional" }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toHaveAttribute("href", "/classes/bharatanatyam");
});
