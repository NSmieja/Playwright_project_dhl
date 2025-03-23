// @ts-check
import { test, expect } from '@playwright/test';


const DHL_SHIPMENT_URL = "https://developer.dhl.com/api-reference/shipment-tracking#reference-docs-section/"
const DHL_API = "https://api-test.dhl.com/track/"


test("SCENARIO: Verifying shipment status directly from the web page", async ({ page }) => {

  await test.step("GIVEN: The user goes to the shipment web page", async () => {
    await page.goto(DHL_SHIPMENT_URL);
    await page.waitForLoadState("load", { timeout: 60000 });  // waiting for the page to load
    await page.locator(".opblock-summary-control").click();  // clicking on GET/shipments endpoint
    await page.locator(".btn.try-out__btn").click();  // clicking on Try it out button
    await expect(page.locator('.btn.try-out__btn.cancel')).toBeVisible();  // checking if the Cancel button is visible    
  });

  await test.step("WHEN: The user fills all required fields on the page with API example usage", async () => {
    await page.getByPlaceholder("trackingNumber").fill("123");
    await page.locator(".btn.execute").click();
  });

  await test.step("THEN: The user should see the 200 response", async () => {
    let correct_row = page.locator('tr[class="response"]');
    let status_cell = correct_row.locator("td.response-col_status");
    await expect(status_cell).toBeVisible();
    await expect(status_cell).toHaveText("200");
  });

  await test.step("AND: The user should see 'US' in the country code field in the response body", async () => {
    expect(await page.getByText('{ "shipments": [ { "id": "').textContent()).toContain("US");
  });
});


test("SCENARIO: Verifying shipment status from the api request", async ({ request }) => {
  // Given the user knows all the required data for the shipment
  let tracking_number = "123";
  let service = "express";
  let language = "en";

  // When the user provides all required data in the API GET request 
  var response = await request.get(
    `${DHL_API}/shipments?trackingNumber=${tracking_number}&service=${service}&${language}=en`,
    {
      headers: {
        "DHL-API-Key": "demo-key",
        "Content-Type": "application/json"
      }
    },
  );

  // Then the user should see the 200 response status code
  expect(response.status()).toBe(200);

  // And the user should see "US" in the country code field in the response body
  let response_body = await response.json();
  // console.log(response_body);
  // console.log(response_body["shipments"][0]["origin"]["address"]["countryCode"]);
  expect(response_body["shipments"][0]["origin"]["address"]["countryCode"]).toBe("US");
});

