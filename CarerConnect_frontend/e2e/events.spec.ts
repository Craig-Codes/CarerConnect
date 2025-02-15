import { test, expect } from "@playwright/test";

test("Standard user can create an event, subscribe, then unsubscribe. Event can also be seen in the correct filter tabs", async ({
  page,
}) => {
  // login
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").fill("user1@example.com");
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  // goto events page
  await page.getByRole("button", { name: "EVENTS", exact: true }).click();
  // create new event
  await page.getByRole("button", { name: "Create New Event" }).click();
  // random integer allows for multi threading tests without causing conflicts
  const randomInt = Math.floor(Math.random() * 100000);
  await page.getByLabel("Title *").fill(`Test Event-${randomInt}`);
  await page.getByLabel("Choose date, selected date is").click();

  // Different browser handle MUi DateTime picker differently
  // Different logic required to test correctly

  // Check if it's WebKit AND a mobile device
  const isMobile = await page.evaluate(() =>
    /Android/i.test(navigator.userAgent)
  );

  const isMobileSafari = await page.evaluate(() =>
    /iPhone|iPad|iPod/i.test(navigator.userAgent)
  );

  // Normal computer web browser
  if (!isMobile && !isMobileSafari) {
    // Chromium requires selecting a date first before the month is changed
    await page.getByRole("gridcell", { name: "12" }).click();
    await page
      .getByRole("button", { name: "Next month" })
      .click({ force: true });
    await page.getByRole("gridcell", { name: "12" }).first().click();
  } else if (isMobile) {
    // Mobile requires changing the month before anything else
    await page
      .getByRole("button", { name: "Next month" })
      .click({ force: true });
    await page
      .getByRole("button", { name: "Next month" })
      .click({ force: true });
    await page.getByRole("gridcell", { name: "12" }).first().click();
  } else if (isMobileSafari) {
    // Mobile safari gets selectors slightly differently
    await page
      .getByRole("button", { name: "Next month" })
      .click({ force: true });
    await page.getByRole("gridcell").nth(-2).click({ force: true });
  }

  await page.getByLabel("7 hours").click();
  await page.getByLabel("5 minutes", { exact: true }).click();
  await page.getByRole("button", { name: "OK" }).click();
  await page.getByLabel("Location or Link *").click();
  await page
    .getByLabel("Location or Link *")
    .fill("google.com", { force: true });
  await page
    .getByLabel("Description *")
    .fill("Test online event", { force: true });
  await page.getByLabel("Number of participants *").fill("5");
  await page.getByRole("button", { name: "Submit" }).click({ force: true });

  await page.getByRole("tab", { name: "Online Events" }).click();
  // test new event can be seen
  await expect(page.getByText("Successfully created event")).toBeVisible();
  // change tab - test new event is seen in the correct tab
  await page.getByRole("tab", { name: "All Events" }).click();
  await expect(page.getByText(`Test Event-${randomInt}`)).toBeVisible();
  // edit event
  await page;
  await page
    .locator(`div`)
    .filter({ hasText: new RegExp(`^Test Event-${randomInt}$`) })
    .getByTestId("edit-icon")
    .click();
  await page.getByLabel("Title *").fill("Test Event - editted");
  await page.getByLabel("Description *").fill("Test online event -editted");
  await page.getByRole("button", { name: "Submit" }).click({ force: true });

  // test event displays updated
  await expect(page.getByText("Test Event - editted").first()).toBeVisible();
  await expect(
    page.getByText("Test online event -editted").first()
  ).toBeVisible();
  // unsubscribe
  await page.getByRole("button", { name: "Unsubscribe" }).first().click();
  await page.getByRole("button", { name: "Yes" }).click();
  // test evnt displays in correct tabs
  await page.getByRole("tab", { name: "Available Events" }).click();
  await page.getByRole("tab", { name: "All Events" }).click();
  // subscribe
  await page
    .getByRole("button", { name: "Subscribe", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.getByLabel("close").first().click();
  // test tab switching
  await page.getByRole("tab", { name: "Online Events" }).click();
  await page.getByRole("tab", { name: "All Events" }).click();
  // Check the unsubscribe cancel button works
  await page.getByRole("button", { name: "Unsubscribe" }).first().click();
  await page.getByRole("button", { name: "Cancel" }).click();
});

test("Admin user can edit another users event, unsubscribe, then delete the event", async ({
  page,
}) => {
  // login
  await page.goto("http://localhost:8080/login");
  await page.getByLabel("Email Address *").fill("user2@example.com");
  await page.getByLabel("Password *").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.getByRole("button", { name: "EVENTS", exact: true }).click();
  // edit the event
  await page.locator(".MuiBox-root > svg > path").first().click();
  await page.getByLabel("Title *").fill("Test Event - editted admin");
  await page
    .getByLabel("Description *")
    .fill("Test online event -editted admin");
  await page.getByRole("button", { name: "Submit" }).click();
  // updated event shows on screen
  await expect(
    page.getByText("Test Event - editted admin").first()
  ).toBeVisible();
  await expect(
    page.getByText("Test online event -editted admin").first()
  ).toBeVisible();
  // unsubscribe
  await page.locator(".MuiPaper-root > .MuiButtonBase-root").first().click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page
    .getByRole("button", { name: "Unsubscribe" })
    .first()
    .click({ force: true });
  await page.getByRole("button", { name: "Yes" }).click();
  // delete
  await page
    .locator("div")
    .filter({ hasText: /^Test Event - editted admin$/ })
    .getByTestId("delete-icon")
    .locator("path")
    .first()
    .click();
  await page.getByRole("button", { name: "Yes" }).click();
  // successful delete
  await page.getByText("Successfully deleted meetup").click();
});
