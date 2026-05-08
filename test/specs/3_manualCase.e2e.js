const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const loginPage = require("../pageobjects/login.page");
const manualCasePage = require("../pageobjects/manualCase.page");

describe("Create Manual Case", () => {
  it("User should be able to click on home case dropdown", async () => {
    await loginPage.clickNewCaseDropdown();
  });
  it("User should be able to open a manual case", async () => {
    await manualCasePage.clickCreateCaseManualButton();
  });
  it("User should be able to fill the manual case form", async () => {
    await manualCasePage.clickCreateCaseManualIssueDropdown();
    Actions.wait(2000);
    await manualCasePage.clickCreateCaseManualIssueFrontCounter();
    await manualCasePage.fillCreateCaseManualShortDescription();
    await manualCasePage.fillCreateCaseManualDescription();
    // await manualCasePage.fillCreateCaseManualPhoneNumber();
    await manualCasePage.clickManualSubmitButton();
  });
});
