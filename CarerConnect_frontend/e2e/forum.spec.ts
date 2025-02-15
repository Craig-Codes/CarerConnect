import { test, expect } from "@playwright/test";

test("Standard user can create a forum post, edit it, and then delete it", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/login");
  // login using seed data
  await page.getByLabel("Email Address *").fill("user1@example.com");
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  // goto forums
  await page.getByRole("button", { name: "FORUM", exact: true }).click();
  // go to general discussion category
  await page
    .getByRole("rowheader", { name: "General Discussion Talk about" })
    .click();
  // go to specific thread in category
  await page
    .getByRole("rowheader", { name: "How Do You Manage Day-to-Day" })
    .click();
  // create a post
  await page.getByRole("button", { name: "Create New Post" }).nth(1).click();
  await page.getByLabel("Content *").fill("Test post - create");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Test post - create").last()).toBeVisible();
  // edit the post
  await page.getByTestId("ModeEditIcon").last().click();
  await page.getByLabel("content *").click();
  await page.getByLabel("content *").fill("Test post - edit");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Test post - edit").first()).toBeVisible();
  // delete the post
  await page.getByTestId("DeleteIcon").locator("path").last().click();
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(
    page.getByText("Successfully deleted post").first()
  ).toBeVisible();
});

test("Admin user can create thread, post, and delete thread", async ({
  page,
}) => {
  // random integer allows for multi threading tests without causing conflicts
  const randomInt = Math.floor(Math.random() * 100000);
  // login and go to forums
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").fill("user2@example.com");
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "FORUM", exact: true }).click();
  // go to specific forum category
  await page
    .getByRole("rowheader", { name: "Health and Well-being Support" })
    .click();
  // create a thread
  await page.getByRole("button", { name: "Create New Thread" }).click();
  await page.getByLabel("Title *").fill(`Test Thread ${randomInt}`);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText(`Test Thread ${randomInt}`)).toBeVisible();
  await page.getByRole("button", { name: "Create New Thread" }).click();
  // test user cannot create a thread of the same name
  await page.getByLabel("Title *").fill(`Test Thread ${randomInt}`);
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByText("Failed to create thread, please try again")
  ).toBeVisible();
  await page
    .getByRole("rowheader", { name: `Test Thread ${randomInt}` })
    .first()
    .click();
  // go into new thread and create a post
  await page.getByRole("button", { name: "Create New Post" }).click();
  await page.getByLabel("Content *").fill("Test post - delete");
  await page.getByRole("button", { name: "Submit" }).click();
  await page.getByRole("button", { name: "Back" }).click();
  // delete thread
  await page.getByRole("cell", { name: "1" }).first().click();
  await page
    .getByRole("row", { name: `Test Thread ${randomInt}` })
    .locator("path")
    .click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByText("Successfully deleted thread").click();
  await expect(page.getByText(`Test Thread ${randomInt}`)).not.toBeVisible();
  await page.getByLabel("close").first().click();
});

test("Users can see each others posts, and admin user can delete posts", async ({
  page,
}) => {
  await page.goto("http://localhost:8080/login");
  // login using seed data
  await page.getByLabel("Email Address *").fill("user1@example.com");
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "FORUM", exact: true }).click();
  // go to a specific category
  await page
    .getByRole("rowheader", { name: "General Discussion Talk about" })
    .click();
  // go to a specific thread
  await page
    .getByRole("rowheader", { name: "How Do You Manage Day-to-Day" })
    .click();
  // create a new post
  await page.getByRole("button", { name: "Create New Post" }).nth(1).click();
  await page.getByLabel("Content *").fill("Post from standard user");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByText("Post from standard user").last()).toBeVisible();
  // logout
  await page.getByRole("button", { name: "FC" }).waitFor({ state: "visible" });
  await page.getByRole("button", { name: "FC" }).click();
  await page.getByText("Logout").click();
  // login as an admin user
  await page.getByLabel("Email Address *").fill("user2@example.com");
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "FORUM" }).first().click();
  await page
    .getByRole("rowheader", { name: "General Discussion Talk about" })
    .click();
  await page
    .getByRole("rowheader", { name: "How Do You Manage Day-to-Day" })
    .click();
  await page
    .locator("div:nth-child(10) > div:nth-child(2) > .MuiSvgIcon-root > path")
    .click();
  // delete a users post
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(page.getByText("Successfully deleted post")).toBeVisible();
});
