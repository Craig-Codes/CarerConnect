import { test, expect } from "@playwright/test";

test("User can login, enters the home page, then logs out and returns to the login page", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").click();
  await page.getByLabel("Email Address *").fill("user1@example.com");
  await page.getByLabel("Password *").click();
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByText("Frank Castle")).toBeInViewport();
  await page.getByRole("button", { name: "FC" }).click();
  await page.getByText("Logout").click();
  await expect(page.getByRole("button", { name: "Sign In" })).toBeInViewport();
});
