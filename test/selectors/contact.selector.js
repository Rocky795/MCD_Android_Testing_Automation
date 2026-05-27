const {androidPaths} = require("../constants/android.selector");
const {iosPaths} = require("../constants/ios.selector");

class ContactSelectors {
  get contactSupportButton() {
    return driver.isAndroid ? $(androidPaths.contact_support_button) : $(iosPaths.contact_support_button);
  }
}

module.exports = new ContactSelectors();