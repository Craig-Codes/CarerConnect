import { test, expect } from "@playwright/test";

test("User can login and sees the navbar buttons", async ({ page }) => {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").fill("user1@example.com");
  await page.getByLabel("Email Address *").press("Tab");
  await page.getByLabel("Password *").fill("password");
  await page.getByLabel("Password *").press("Tab");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("button", { name: "Home" })).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Events" }).first()
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Forum" }).first()
  ).toBeInViewport();
});
