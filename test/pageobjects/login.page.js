const Action = require("../utils/actions");
const LoginSelectors = require("../selectors/login.selector");
require("dotenv").config();

class LoginPage {
  

  async clickResManagerBtn() {
    await Action.tap(LoginSelectors.loginResManagerBtn);
  }

  async clickLoginEmail() {
    await Action.tap(LoginSelectors.loginSignInBtn);
  }

  async fillEmail() {
    await LoginSelectors.loginEmail.setValue(process.env.EMAIL);
  }

  async fillResManagerUsername() {
    await LoginSelectors.loginResManagerUsername.setValue(process.env.RM_USERNAME);
  }

  async fillResManagerPassword() {
    await LoginSelectors.loginResManagerPassword.setValue(process.env.RM_PASSWORD);
  }

  async clickResManagerSignInBtn() {
    await Action.tap(LoginSelectors.loginResManagerSignInBtn);
  }
}

module.exports = new LoginPage();
