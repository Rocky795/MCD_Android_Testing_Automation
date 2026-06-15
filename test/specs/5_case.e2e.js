const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const signOutPage = require("../pageobjects/signout.page");
const LoginPage = require("../pageobjects/login.page");
const { openCases } = require("../flows/cases.flow");

describe("Open Cases and Verify", () => {
  it("Verify User can Logout from MCD APP", async () => {
   

    while (!(await LoginPage.isCasesTextDisplayed())) {
      await driver.back();
      await driver.pause(2000);
    }


    await openCases();
    
    
    
  });
});
