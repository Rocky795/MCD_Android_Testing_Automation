const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const profilePage = require("../pageobjects/profile.page");
const signOutPage = require("../pageobjects/signout.page");
const LoginPage = require("../pageobjects/login.page");

describe("Logout", () => {
  it("Verify User can Logout from MCD APP", async () => {
    let el = await LoginPage.getCasesText();
    await Actions.wait(50000);
    while (!(await LoginPage.isCasesTextDisplayed())) {
      await driver.back();
      await driver.pause(1000);
    }
    expect(el).toBe("Cases");
    await profilePage.clickUserProfile();

    el = await profilePage.getUserProfileName();
    await Actions.wait(2000);
    expect(el).toBe(process.env.PROFILE_NAME);
    signOutPage.clickLogoutButton();
    await Actions.wait(5000);
    el = await LoginPage.isLoginEmailDisplayed();
    expect(el).toBe(true);
  });
});
