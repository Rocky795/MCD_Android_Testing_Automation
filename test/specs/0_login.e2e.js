const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const LoginPage = require("../pageobjects/login.page");
const manualCasePage = require("../pageobjects/manualCase.page");
const loginFlow = require("../flows/login.flow");

describe("My Login application", () => {
  it("Verify user with valid ID is able to successfully sign in to the app", async () => {
    await loginFlow.login();
  });
});