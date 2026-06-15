const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const LoginPage = require("../pageobjects/login.page");

async function login() {
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
    await Actions.wait(5000);
    if (await LoginPage.isResManagerUsernameVisible()) {
      console.log("Res Manager Username is visible again then login again");
      await Actions.wait(5000);
      await LoginPage.fillResManagerUsername();
      await LoginPage.fillResManagerPassword();
      await LoginPage.clickResManagerSignInBtn();
    }
    await Actions.wait(10000);
    await Actions.handleIntermediatePage();

    // if (await LoginPage.isLogin2EmailVisible()) {
    //   await LoginPage.clickLogin2Email();
    // }

    let el = await LoginPage.getCasesText();
    await Actions.wait(50000);

    expect(el).toBe("Cases");
}

module.exports = { login };
