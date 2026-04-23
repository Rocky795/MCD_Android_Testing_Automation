const { androidPaths } = require("../constants/android.selector");
const { iosPaths } = require("../constants/ios.selector");

class LoginSelectors {
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
}
module.exports = new LoginSelectors();
