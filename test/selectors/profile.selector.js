const { androidPaths } = require("../constants/android.selector");
const { iosPaths } = require("../constants/ios.selector");

class ProfileSelectors {
  get homeUserProfileBtn() {
    return driver.isAndroid
      ? $(androidPaths.home_user_profile_btn)
      : $(iosPaths.home_user_profile_btn);
  }
  get homeUserProfileName() {
    return driver.isAndroid
      ? $(androidPaths.home_user_profil_name)
      : $(iosPaths.home_user_profil_name);
  }
} 
module.exports = new ProfileSelectors();
