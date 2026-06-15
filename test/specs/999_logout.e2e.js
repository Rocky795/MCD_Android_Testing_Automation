const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const signOutPage = require("../pageobjects/signout.page");
const LoginPage = require("../pageobjects/login.page");

describe("Logout", () => {
  it("Verify User can Logout from MCD APP", async () => {
   

    while (!(await LoginPage.isCasesTextDisplayed())) {
      await driver.back();
      await driver.pause(2000);
    }
    
    await profilePage.clickUserProfile();

    el = await profilePage.getUserProfileName();
    await Actions.wait(2000);
    expect(el).toBe(process.env.PROFILE_NAME);
    await signOutPage.clickLogoutButton();
    await Actions.wait(5000);
    await signOutPage.clickConfirmSignOutButton();
    await Actions.wait(5000);
    el = await LoginPage.isLoginEmailDisplayed();
    expect(el).toBe(true);
  });
});
