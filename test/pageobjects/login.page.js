const { androidPaths } = require("../selectors/android.selector");
require("dotenv").config();

class LoginPage {
  get loginEmail() {
    return $(androidPaths.login_email);
  }

  get loginSignInBtn() {
    return $(androidPaths.login_email_btn);
  }

  get loginResManagerBtn() {
    return $(androidPaths.login_res_manager_btn);
  }

  get loginResManagerUsername() {
    return $(androidPaths.login_res_manager_username);
  }

  get loginResManagerPassword() {
    return $(androidPaths.login_res_manager_password);
  }

  get loginResManagerSignInBtn() {
    return $(androidPaths.login_res_manager_sign_in_btn);
  }

  async clickResManagerBtn() {
    await this.loginResManagerBtn.click();
  }

  async clickLoginEmail() {
    await this.loginSignInBtn.click();
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
    await this.loginResManagerSignInBtn.click();
  }
}

module.exports = new LoginPage();
