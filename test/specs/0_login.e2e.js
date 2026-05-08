const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const LoginPage = require("../pageobjects/login.page");

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.fillEmail();
    await LoginPage.clickLoginEmail();
    await Actions.handleIntermediatePage();

    if (await LoginPage.isLogin2EmailVisible()) {
      await LoginPage.clickLogin2Email();
    }
    //   await LoginPage.clickResManagerBtn();
    await LoginPage.fillResManagerUsername();
    await LoginPage.fillResManagerPassword();
    await LoginPage.clickResManagerSignInBtn();
    if (await LoginPage.isResManagerUsernameVisible()) {
      console.log("Res Manager Username is visible again then login again");
      await LoginPage.fillResManagerUsername();
      await LoginPage.fillResManagerPassword();
      await LoginPage.clickResManagerSignInBtn();
    }
    await Actions.wait(8000);
    await Actions.handleIntermediatePage();

    if (await LoginPage.isLogin2EmailVisible()) {
      await LoginPage.clickLogin2Email();
    }

    const el = await LoginPage.getCasesText();
    Actions.wait(50000);

    expect(el).toBe("Cases");
  });
});
