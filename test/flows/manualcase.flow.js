const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const loginPage = require("../pageobjects/login.page");
const manualCasePage = require("../pageobjects/manualCase.page");
const manualCaseDataData = require("../data/manualCaseData.data");
const chatPage = require("../pageobjects/chat.page");


async function verifyImpactDropdown() {
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
}

async function fillManualCaseForm() {
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
}

module.exports = { verifyImpactDropdown, fillManualCaseForm };