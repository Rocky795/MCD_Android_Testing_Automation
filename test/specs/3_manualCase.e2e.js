const { expect } = require("@wdio/globals");
const loginPage = require("../pageobjects/login.page");
const manualCasePage = require("../pageobjects/manualCase.page");
const { verifyImpactDropdown, fillManualCaseForm } = require("../flows/manualcase.flow");
const manualCaseDataData = require("../data/manualCaseData.data");

describe("Create Manual Case", () => {
  it("User should be able to click on home case dropdown", async () => {
    await loginPage.clickNewCaseDropdown();
  });

  it("User should be able to open a manual case", async () => {
    await manualCasePage.clickCreateCaseManualButton();
  });

  it("Verify the selection of 'Impact' during case creation", async () => {
   await verifyImpactDropdown();
  });

  it("User should be able to fill the manual case form", async () => {
    await fillManualCaseForm();
  });
});
