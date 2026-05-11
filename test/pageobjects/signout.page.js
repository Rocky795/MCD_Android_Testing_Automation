const Action = require("../utils/actions");
const SignOutSelectors = require("../selectors/signout.selector");
require("dotenv").config();

class SignOutPage {
  
    async clickLogoutButton() {
        const dropdown = await SignOutSelectors.signOutBtn;
            await dropdown.waitForDisplayed({ timeout: 5000 });
            await dropdown.click();
    }

    

}

module.exports = new SignOutPage();
