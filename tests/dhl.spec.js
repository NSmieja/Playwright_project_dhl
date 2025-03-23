// @ts-check
import path from 'path';  // path module
import fs from 'fs';  // file system module
import { test, expect } from '@playwright/test';


const DHL_BASIC_URL = "https://support-developer.dhl.com/support/home"
const FOTO_PATH = path.join(__dirname, '../screenshots/foto.png');


test("SCENARIO: Taking screenshot in playwright", async ({ page }) => {
  let locator = page.getByRole("link", { name: "Knowledge base" });

  await test.step("GIVEN: The user goes to the DHL page", async () => {
    await page.goto(DHL_BASIC_URL);
    // Checking if the 'Knowledge base' link is visible
    console.log(await locator.textContent());  // (with auto-wait mechanism)
    await expect(locator).toHaveText("Knowledge base");
  });

  await test.step("WHEN: User clicks on the 'Knowledge base' link", async () => {
    await locator.click();
    // Checking if the 'General' link is visible
    let full_text = await page.locator(".line-clamp-2").first().textContent();
    // console.log(full_text);
    expect(full_text).toContain("General");
  });

  await test.step("AND: User clicks on the 'General' link", async () => {
    await page.locator(".line-clamp-2").first().click();
    // Verifying if the page title is 'General'
    await expect(page.locator(".fw-page-title")).toContainText("General");
  });

  await test.step("THEN: User can take a screenshot of the page and save in the 'screenshots' folder", async () => {
    await page.locator(".line-clamp-2").last().waitFor();  // waiting for the page to load
    await page.screenshot({ path: FOTO_PATH, fullPage: true });
    await page.waitForTimeout(5000);
    expect(fs.existsSync(FOTO_PATH)).toBeTruthy();
  });
});


test("SCENARIO: Navigating to the second page (bonus)", async ({ page }) => {
  let locator = page.getByRole("link", { name: "Knowledge base" });

  await test.step("GIVEN: The user goes to the DHL page", async () => {
    await page.goto(DHL_BASIC_URL);
    console.log(await locator.textContent());
    await expect(locator).toHaveText("Knowledge base");
  });

  await test.step("WHEN: User clicks on the 'Knowledge base' link", async () => {
    await locator.click();
    let full_text = await page.locator(".line-clamp-2").first().textContent();
    console.log(full_text);
    expect(full_text).toContain("General");
  });

  await test.step("AND: User clicks on the 'General' link", async () => {
    await page.locator(".line-clamp-2").first().click();
    await expect(page.locator(".fw-page-title")).toContainText("General");
  });

  await test.step("AND: User goes to the second page", async () => {
    await page.getByRole("link", { name: "2", exact: true }).click();
    expect(page.url()).toContain("page/2");
  });

  await test.step("THEN: User can go and read first article on that second page", async () => {
    await page.locator(".line-clamp-2").first().click();
    await page.locator(".fw-page-title").waitFor();
    await expect(page.locator(".fw-page-title")).toHaveText("What is DHL Freight?");
    await expect(page.locator(".mb-8.mb-md-0.semi-bold.fs-20.fw-feedback-question")).toContainText("Was this article helpful?");
  });

});
