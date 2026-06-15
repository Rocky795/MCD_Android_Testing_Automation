const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const LoginPage = require("../pageobjects/login.page");
const { openContacts } = require("../flows/contact.flow");
const { openCases } = require("../flows/cases.flow");

describe("Contact Support", () => {
  it("Verify User can view the contact page", async () => {
    while (!(await LoginPage.isCasesTextDisplayed())) {
      await driver.back();
      await driver.pause(2000);
    }

    await openContacts();
  });
});
