const { androidPaths } = require("../selectors/android.selector");
const { iosPaths } = require("../selectors/ios.selector");
const Action = require("../utils/action");
require("dotenv").config();

class LoginPage {
  get loginEmail() {
    return driver.isAndroid
      ? $(androidPaths.login_email)
      : $(iosPaths.login_email);
  }

  get loginSignInBtn() {
    return driver.isAndroid
      ? $(androidPaths.login_email_btn)
      : $(iosPaths.login_email_btn);
  }

  get loginResManagerBtn() {
    return driver.isAndroid
      ? $(androidPaths.login_res_manager_btn)
      : $(iosPaths.login_res_manager_btn);
  }

  get loginResManagerUsername() {
    return driver.isAndroid
      ? $(androidPaths.login_res_manager_username)
      : $(iosPaths.login_res_manager_username);
  }

  get loginResManagerPassword() {
    return driver.isAndroid
      ? $(androidPaths.login_res_manager_password)
      : $(iosPaths.login_res_manager_password);
  }

  get loginResManagerSignInBtn() {
    return driver.isAndroid
      ? $(androidPaths.login_res_manager_sign_in_btn)
      : $(iosPaths.login_res_manager_sign_in_btn);
  }

  async clickResManagerBtn() {
    await Action.tap(this.loginResManagerBtn);
  }

  async clickLoginEmail() {
    await Action.tap(this.loginSignInBtn);
  }

  async fillEmail() {
    await this.loginEmail.setValue(process.env.EMAIL);
  }

  async fillResManagerUsername() {
    await this.loginResManagerUsername.setValue(process.env.RM_USERNAME);
  }

  async fillResManagerPassword() {
    await this.loginResManagerPassword.setValue(process.env.RM_PASSWORD);
  }

  async clickResManagerSignInBtn() {
    await Action.tap(this.loginResManagerSignInBtn);
  }
}

module.exports = new LoginPage();
