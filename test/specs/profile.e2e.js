const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");

describe("Check the User Profile", () => {
  it("User profile should display correctly", async () => {
    await profilePage.clickUserProfile();

    const el = await $(profilePage.homeUserProfileName);
    await el.waitForDisplayed({ timeout: 10000 });
    expect(profileName).toBe(process.env.PROFILE_NAME);
  });
});
