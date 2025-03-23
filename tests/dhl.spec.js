// @ts-check
import path from 'path';  // path module
import fs from 'fs';  // file system module
import { test, expect } from '@playwright/test';


const DHL_BASIC_URL = "https://support-developer.dhl.com/support/home"
const FOTO_PATH = path.join(__dirname, '../screenshots/foto.png');


test("Taking screenshot in playwright", async ({ page }) => {
  await page.goto(DHL_BASIC_URL);

  // Checking if the 'Knowledge base' link is visible.
  let locator = page.getByRole("link", { name: "Knowledge base" });
  console.log(await locator.textContent());  // (with auto-wait mechanism)
  await expect(locator).toHaveText("Knowledge base");

  // Clicking the 'Knowledge base' link.
  await locator.click();

  // Checking if the 'General' link is visible.
  let full_text = await page.locator(".line-clamp-2").first().textContent();
  console.log(full_text);
  expect(full_text).toContain("General");

  // Clicking the 'General' link.
  await page.locator(".line-clamp-2").first().click();

  // Taking a screenshot of the page.
  await page.locator(".line-clamp-2").last().waitFor();  // waiting for the page to load
  await page.screenshot({ path: FOTO_PATH, fullPage: true });
  await page.waitForTimeout(5000);
  expect(fs.existsSync(FOTO_PATH)).toBeTruthy();

});

test("Navigating to the second page (bonus)", async ({ page }) => {
  await page.goto(DHL_BASIC_URL);

  // Checking if the 'Knowledge base' link is visible.
  let locator = page.getByRole("link", { name: "Knowledge base" });
  console.log(await locator.textContent());  // (with auto-wait mechanism)
  await expect(locator).toHaveText("Knowledge base");

  // Clicking the 'Knowledge base' link.
  await locator.click();

  // Checking if the 'General' link is visible.
  let full_text = await page.locator(".line-clamp-2").first().textContent();
  console.log(full_text);
  expect(full_text).toContain("General");

  // Clicking the 'General' link.
  await page.locator(".line-clamp-2").first().click();
  await expect(page.locator(".fw-page-title")).toContainText("General");

  // Clicking the '2' link.
  await page.getByRole("link", { name: "2", exact: true }).click();
  expect(page.url()).toContain("page/2");

  // Clicking in the first article.
  await page.locator(".line-clamp-2").first().click();
  await page.locator(".fw-page-title").waitFor();
  await expect(page.locator(".fw-page-title")).toHaveText("What is DHL Freight?");
  await expect(page.locator(".mb-8.mb-md-0.semi-bold.fs-20.fw-feedback-question")).toContainText("Was this article helpful?");
});
