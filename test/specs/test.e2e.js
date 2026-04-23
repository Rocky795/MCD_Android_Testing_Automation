const { expect } = require("@wdio/globals");
const productPage = require("../pageobjects/product.page");

describe("My Login application", () => {
  //   it("should login with valid credentials", async () => {
  // await LoginPage.open()
  // await LoginPage.login('tomsmith', 'SuperSecretPassword!')
  // await expect(SecurePage.flashAlert).toBeExisting()
  // await expect(SecurePage.flashAlert).toHaveText(
  //     expect.stringContaining('You logged into a secure area!'))
  // await expect(SecurePage.flashAlert).toMatchElementSnapshot('flashAlert')

  //   });

  it("it should work, riht?", async () => {
    await productPage.clickBackpack();
  });
});
