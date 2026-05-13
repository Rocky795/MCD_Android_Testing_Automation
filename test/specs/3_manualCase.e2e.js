const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const loginPage = require("../pageobjects/login.page");
const manualCasePage = require("../pageobjects/manualCase.page");
const manualCaseDataData = require("../data/manualCaseData.data");
const chatPage = require("../pageobjects/chat.page");

describe("Create Manual Case", () => {
  it("User should be able to click on home case dropdown", async () => {
    await loginPage.clickNewCaseDropdown();
  });

  it("User should be able to open a manual case", async () => {
    await manualCasePage.clickCreateCaseManualButton();
  });

  it("Verify the selection of 'Impact' during case creation", async () => {
    await manualCasePage.clickCreateCaseManualImpactDropdown();
    Actions.wait(2000);

    let dropdownOptions = await manualCasePage.getDynamicTextSelector(
      manualCaseDataData.impactDropdowns.extensive,
    );
    await dropdownOptions.waitForDisplayed({ timeout: 10000 });
    await expect(dropdownOptions).toBeDisplayed();
    console.log("The 'Impact' dropdown options are displayed successfully.");
    dropdownOptions = await manualCasePage.getDynamicTextSelector(
      manualCaseDataData.impactDropdowns.significant,
    );
    await dropdownOptions.waitForDisplayed({ timeout: 10000 });
    await expect(dropdownOptions).toBeDisplayed();
    console.log("The 'Impact' dropdown options are displayed successfully.");
    dropdownOptions = await manualCasePage.getDynamicTextSelector(
      manualCaseDataData.impactDropdowns.moderate,
    );
    await dropdownOptions.waitForDisplayed({ timeout: 10000 });
    await expect(dropdownOptions).toBeDisplayed();
    console.log("The 'Impact' dropdown options are displayed successfully.");
    dropdownOptions = await manualCasePage.getDynamicTextSelector(
      manualCaseDataData.impactDropdowns.minor,
    );
    await dropdownOptions.waitForDisplayed({ timeout: 10000 });
    await expect(dropdownOptions).toBeDisplayed();
    console.log("The 'Impact' dropdown options are displayed successfully.");
  });

  it("User should be able to fill the manual case form", async () => {
    await manualCasePage.clickCreateCaseManualIssueDropdown();
    await manualCasePage.clickCreateCaseManualIssueDropdown();
    Actions.wait(2000);
    await manualCasePage.clickCreateCaseManualIssueFrontCounter();
    await manualCasePage.fillCreateCaseManualShortDescription();
    await manualCasePage.fillCreateCaseManualDescription();
    // await manualCasePage.fillCreateCaseManualPhoneNumber();
    await manualCasePage.clickManualSubmitButton();
    await Actions.wait(5000);

    await manualCasePage.isManualCaseSuccessMessageDisplayed();
    await manualCasePage.clickManualSubmitOkButton();
    while (!(await loginPage.isCasesTextDisplayed())) {
      await driver.back();
      await driver.pause(1000);
    }
  });
});
