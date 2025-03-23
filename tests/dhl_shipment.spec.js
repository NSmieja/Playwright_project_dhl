// @ts-check
import { test, expect, request } from '@playwright/test';


const DHL_SHIPMENT_URL = "https://developer.dhl.com/api-reference/shipment-tracking#reference-docs-section/"
const DHL_API = "https://api-test.dhl.com/track/"

let tracking_number = "123";
let service = "express";
let language = "en";
let shipment_payload = {
  "trackingNumber": tracking_number,
  "service": service,
  "language": language
};


test("Shipment status - from web page", async ({ page }) => {
  // Navigating to the GET request for shipments
  await page.goto(DHL_SHIPMENT_URL);
  await page.locator(".opblock-summary-control").click();  // clicking on GET/shipments endpoint
  await page.locator(".btn.try-out__btn").click();  // clicking on Try it out button
  await expect(page.locator('.btn.try-out__btn.cancel')).toBeVisible();  // checking if the Cancel button is visible

  // Filling in the required fields
  await page.getByPlaceholder("trackingNumber").fill("123");
  await page.locator(".btn.execute").click();

  // Checking the response status code
  const correctRow = page.locator('tr[class="response"]');
  const statusCell = correctRow.locator("td.response-col_status");
  await expect(statusCell).toBeVisible();
  await expect(statusCell).toHaveText("200");

  // Checking the country code
  expect(await page.getByText('{ "shipments": [ { "id": "').textContent()).toContain("US");

});

test("Shipment status - from api request", async ({ request }) => {
  // Navigating to the GET request for shipments
  var response = await request.get(
    `${DHL_API}/shipments?trackingNumber=${tracking_number}&service=${service}&${language}=en`,
    {
      headers: {
        "DHL-API-Key": "demo-key",
        "Content-Type": "application/json"
      }
    },
  );

  // Validating status code of the response
  expect(response.status()).toBe(200);

  // Getting the response body
  let response_body = await response.json();
  // console.log(response_body);
  // console.log(response_body["shipments"][0]["origin"]);
  // console.log(response_body["shipments"][0]["origin"]["address"]["countryCode"]);

  // Validating coountry code
  expect(response_body["shipments"][0]["origin"]["address"]["countryCode"]).toBe("US");

});

