const Action = require("../utils/actions");
const LoginSelectors = require("../selectors/login.selector");
const ManualCaseSelectors = require("../selectors/manualCase.selector");
require("dotenv").config();

class manualCasePage {
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
      timeout: 10000,
      timeoutMsg: "Manual case issue button not displayed",
    });
    await btn.click();
  }
  async clickCreateCaseManualIssueFrontCounter() {
    const btn = ManualCaseSelectors.createCaseManualIssueAreaDropdownFrontCounter;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Manual case issue area dropdown front counter not displayed",
    });
    await btn.click();
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
}

module.exports = new manualCasePage();
