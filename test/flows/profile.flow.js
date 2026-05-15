const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const manualCasePage = require("../pageobjects/manualCase.page");

async function checkUserProfile() {
    await profilePage.clickUserProfile();

    let el = await profilePage.getUserProfileName();
    Actions.wait(2000);
    expect(el).toBe(process.env.PROFILE_NAME);
    el=await manualCasePage.getDynamicTextSelector(process.env.STORE);
    expect(el).toBeDisplayed();
    await driver.back();
}

module.exports = { checkUserProfile };