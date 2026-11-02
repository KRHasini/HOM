import { expect, test } from "./fixtures";

const MIN_FORM_SECONDS = 2_100; // the API rejects submissions faster than 2s (anti-spam)

test("visitor books a trial from home through the 3-step flow", async ({ page, consoleErrors }) => {
  await page.goto("/?utm_source=e2e&utm_medium=test&utm_campaign=playwright");
  await page.getByRole("link", { name: "Book a Free Trial" }).first().click();
  await expect(page).toHaveURL(/\/trial/);

  await page.getByRole("radio", { name: /my child/i }).click();
  await page.getByLabel("Age").fill("10");
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("radio", { name: /zumba/i }).click();
  await page.getByRole("button", { name: "Sat", exact: true }).click();
  await page.getByRole("radio", { name: "Evening" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel("Full name").fill("E2E Visitor");
  await page.getByLabel("Phone number").fill("98450 12345");
  await page.getByLabel(/I agree/).check();
  await page.waitForTimeout(MIN_FORM_SECONDS);
  await page.getByRole("button", { name: /book free trial/i }).click();

  await expect(page.getByRole("heading", { name: /see you on the floor/i })).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("Zumba")).toBeVisible();
  await expect(page.getByRole("link", { name: /message us on whatsapp/i })).toHaveAttribute(
    "href",
    /wa\.me\/919742508862/,
  );
  expect(consoleErrors).toEqual([]);
});

test("inline validation blocks an incomplete step", async ({ page }) => {
  await page.goto("/trial", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Choose who the class is for.")).toBeVisible();
  await expect(page.getByText("Enter an age between 2 and 99.")).toBeVisible();
});

test("keyboard-only pass through the trial form", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow is a desktop concern");
  await page.goto("/trial?class=yoga", { waitUntil: "networkidle" });

  const radio = page.getByRole("radio", { name: /^me/i });
  await radio.focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("Age").focus();
  await page.keyboard.type("29");
  await page.getByRole("button", { name: "Continue" }).focus();
  await page.keyboard.press("Enter");

  // Yoga was preselected from the query string.
  await expect(page.getByRole("radio", { name: /yoga/i })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Mon", exact: true }).focus();
  await page.keyboard.press("Space");
  await page.getByRole("radio", { name: "Morning" }).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Continue" }).focus();
  await page.keyboard.press("Enter");

  await page.getByLabel("Full name").focus();
  await page.keyboard.type("Keyboard User");
  await page.keyboard.press("Tab");
  await page.keyboard.type("9845012345");
  await page.getByLabel(/I agree/).focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(MIN_FORM_SECONDS);
  await page.getByRole("button", { name: /book free trial/i }).focus();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("heading", { name: /see you on the floor/i })).toBeVisible({
    timeout: 15_000,
  });
});

test("contact form submits an enquiry", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  await page.getByLabel("Full name").fill("Contact Tester");
  await page.getByLabel("Phone number").fill("+91 98450 12345");
  await page.getByLabel(/Anything we should know/).fill("Do you have weekend batches?");
  await page.getByLabel(/I agree/).check();
  await page.waitForTimeout(MIN_FORM_SECONDS);
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await expect(page.getByText(/message received/i)).toBeVisible({ timeout: 15_000 });
});
