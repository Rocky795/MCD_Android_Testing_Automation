const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");

async function checkUserProfile() {
    await profilePage.clickUserProfile();

    const el = await profilePage.getUserProfileName();
    Actions.wait(2000);
    expect(el).toBe(process.env.PROFILE_NAME);
}

module.exports = { checkUserProfile };