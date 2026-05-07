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
  await Actions.wait(8000);
  await Actions.handleIntermediatePage();

  if (await LoginPage.isLogin2EmailVisible()) {
    await LoginPage.clickLogin2Email();
  }
  await LoginPage.clickNewCaseDropdown();
  const el = await LoginPage.getCasesText();
  Actions.wait(2000);
  expect(el).toBe("Cases");
}

module.exports = { login };
