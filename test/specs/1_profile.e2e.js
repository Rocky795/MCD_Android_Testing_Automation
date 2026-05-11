const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const manualCasePage = require("../pageobjects/manualCase.page");

describe("Check the User Profile", () => {
  it("Verify MCD User profile should display correctly", async () => {
    await profilePage.clickUserProfile();

    let el = await profilePage.getUserProfileName();
    Actions.wait(2000);
    expect(el).toBe(process.env.PROFILE_NAME);
    el=await manualCasePage.getDynamicTextSelector(process.env.STORE);
    expect(el).toBeDisplayed();
    await driver.back();
  });
});
