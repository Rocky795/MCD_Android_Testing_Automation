const { androidPaths } = require("../constants/android.selector");
const { iosPaths } = require("../constants/ios.selector");

class SignOutSelectors {
  get signOutBtn() {
    return driver.isAndroid
      ? $(androidPaths.sign_out_btn)
      : $(iosPaths.sign_out_btn);
  }

  
} 
module.exports = new SignOutSelectors();
