import { test, expect } from "@playwright/test";

test("User can login and sees the navbar buttons", async ({ page }) => {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").fill("user1@example.com");
  await page.getByLabel("Email Address *").press("Tab");
  await page.getByLabel("Password *").fill("password");
  await page.getByLabel("Password *").press("Tab");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(
    page.getByRole("button", { name: "Events" }).first()
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Forum" }).first()
  ).toBeInViewport();
});

test("User enters incorrect inputs and fails to login", async ({ page }) => {
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").fill("test");
  await page.getByText("Your email is not valid");
  await page.getByLabel("Email Address *").fill("test@test.com");
  await expect(page.getByText("Your email is not valid")).not.toBeVisible();
  await page.getByLabel("Password *").fill("1");
  await page.getByText("You must have a password over").click();
  await page.getByLabel("Password *").fill("Password");
  await expect(
    page.getByText("You must have a password over")
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByText("Your login credentials are incorrect").click();
});

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

const randomInt = Math.floor(Math.random() * 100000);

test("User can register to system", async ({ page }) => {
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

test("User triggers incorrect input errors then corrects them", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/login");
  await page.getByRole("tab", { name: "Register" }).click();
  await page.getByLabel("Username *").fill("a");
  await page.getByLabel("Email Address *").fill("a");
  await page.getByText("Your email is not valid");
  await page.getByLabel("Email Address *").fill("abc@123.com");
  await expect(page.getByText("Your email is not valid")).not.toBeVisible();
  await page.getByLabel("Password *", { exact: true }).fill("passw");
  await page.getByText("You must have a password over");
  await page.getByLabel("Password *", { exact: true }).fill("password");
  await expect(
    page.getByText("You must have a password over")
  ).not.toBeVisible();
  await page.getByLabel("Confirm Password *").fill("a");
  await page.getByText("Passwords must match");
  await page.getByLabel("Confirm Password *").fill("password");
  await expect(page.getByText("Passwords must match")).not.toBeVisible();
});
