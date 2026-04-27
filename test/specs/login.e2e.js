const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const LoginPage = require("../pageobjects/login.page");

describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    // await LoginPage.open();
    // await LoginPage.login("tomsmith", "SuperSecretPassword!");
    // await expect(LoginPage.flashAlert).toBeExisting();
    // await expect(LoginPage.flashAlert).toHaveText(
    //   expect.stringContaining("You logged into a secure area!"),
    // );
    // await expect(LoginPage.flashAlert).toMatchElementSnapshot("flashAlert");

    await LoginPage.fillEmail();
    await LoginPage.clickLoginEmail();
    await Actions.handleIntermediatePage();
    
    if(await LoginPage.isLogin2EmailVisible()) {
      await LoginPage.clickLogin2Email();
    }
    // await LoginPage.clickResManagerBtn();
    await LoginPage.fillResManagerUsername();
    await LoginPage.fillResManagerPassword();
    await LoginPage.clickResManagerSignInBtn();
    await Actions.handleIntermediatePage();
    
    if(await LoginPage.isLogin2EmailVisible()) {
      await LoginPage.clickLogin2Email();
    }
  });
});
