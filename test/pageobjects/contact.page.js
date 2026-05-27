const Action=require("../utils/actions");
const ContactSelectors = require("../selectors/contact.selector");

class ContactPage {
  

  async clickContactSupport() {
    const contactSupportButton = await ContactSelectors.contactSupportButton;
    await contactSupportButton.waitForDisplayed({ timeout: 100000 });
    await contactSupportButton.click();
  }
}

module.exports = new ContactPage();