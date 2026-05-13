const Action = require("../utils/actions");
const LoginSelectors = require("../selectors/login.selector");
const ManualCaseSelectors = require("../selectors/manualCase.selector");
const { androidPaths } = require("../constants/android.selector");

require("dotenv").config();

class manualCasePage {
  async getDynamicTextSelector(text) {
    let selectorString = androidPaths.dynacmic_description_selector;
    selectorString = selectorString.replace("{DESCRIPTION_TEXT}", text);
    const el = await $(selectorString);
    console.log(`This description is getting validated: ${selectorString}`);
    await el.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: `Dynamic text selector not displayed: ${text}`,
    });
    return el;
  }

  async clickCreateCaseManualButton() {
    const btn = ManualCaseSelectors.createCaseManualButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case button not displayed",
    });

    await btn.click();
  }

  async clickCreateCaseManualIssueDropdown() {
    const btn = ManualCaseSelectors.createCaseManualIssueAreaDropdown;
    await btn.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: "Manual case issue button not displayed",
    });
    await btn.click();
  }
  async clickCreateCaseManualIssueFrontCounter() {
    const btn =
      ManualCaseSelectors.createCaseManualIssueAreaDropdownFrontCounter;
    await btn.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: "Manual case issue area dropdown front counter not displayed",
    });
    await btn.click();
  }

  async clickCreateCaseManualImpactDropdown() {
    const btn = ManualCaseSelectors.createCaseManualImpactDropdown;
    await btn.waitForDisplayed({
      timeout: 20000,
      timeoutMsg: "Manual case impact dropdown not displayed",
    });
    await btn.click();
  }

  async CreateCaseManualIssueAreaDropdownFrontCounterIsDisplayed() {
    const btn =
      ManualCaseSelectors.createCaseManualIssueAreaDropdownFrontCounter;
    return await btn.isDisplayed();
  }

  async fillCreateCaseManualShortDescription() {
    const input = ManualCaseSelectors.createCaseManualShortDescriptionInput;
    await input.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case short description input not displayed",
    });
    await input.setValue("Test Short Description");
  }
  async fillCreateCaseManualDescription() {
    const input = ManualCaseSelectors.createCaseManualDescriptionInput;
    await input.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case description input not displayed",
    });
    await input.setValue("Test Description");
  }
  async fillCreateCaseManualPhoneNumber() {
    const input = ManualCaseSelectors.createCaseManualPhoneNumber;
    await input.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case phone number input not displayed",
    });
    await input.clearValue();
    await input.setValue("123-456-7890");
  }

  async clickManualSubmitButton() {
    const btn = ManualCaseSelectors.manualSubmitButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case submit button not displayed",
    });
    await btn.click();
  }

  async clickUnexpectedErrorButton() {
    const btn = ManualCaseSelectors.unexpectedErrorButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Unexpected error button not displayed",
    });
    await btn.click();
  }

  async isUnexpectedErrorButtonDisplayed() {
    const btn = ManualCaseSelectors.unexpectedErrorButton;
    return await btn.isDisplayed();
  }

  async clickManualSubmitOkButton() {
    const btn = ManualCaseSelectors.manualSubmitOkButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case submit OK button not displayed",
    });
    await btn.click();
  }

  async isManualCaseSuccessMessageDisplayed() {
    const messageEl = ManualCaseSelectors.manualCaseSuccessMessage;
    return await messageEl.isDisplayed();
  }
}

module.exports = new manualCasePage();
