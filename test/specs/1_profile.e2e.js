const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const manualCasePage = require("../pageobjects/manualCase.page");
const profileFlow = require("../flows/profile.flow");

describe("Check the User Profile", () => {
  it("Verify MCD User profile should display correctly", async () => {
    await profileFlow.checkUserProfile();
  });
});
