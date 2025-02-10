import { test, expect } from "@playwright/test";

// generate a random number used to create a unique user account
// Between 0 and 100000
const randomInt = Math.floor(Math.random() * 100000);

test("test", async ({ page }) => {
  await page.goto("http://localhost:8080/login");
  await page.getByRole("tab", { name: "Register" }).click();
  await page.getByLabel("Username *").click();
  await page.getByLabel("Username *").fill(`user${randomInt}`);
  await page.getByLabel("Username *").press("Tab");
  await page.getByLabel("Email Address *").fill(`user${randomInt}@example.com`);
  await page.getByLabel("Email Address *").press("Tab");
  await page.getByLabel("Password *", { exact: true }).fill("password123");
  await page.getByLabel("Password *", { exact: true }).press("Tab");
  await page.getByLabel("Confirm Password *").fill("password123");
  await page.getByRole("button", { name: "Sign Up" }).click();
  await expect(page.getByText(`user${randomInt}`)).toBeInViewport();
});
