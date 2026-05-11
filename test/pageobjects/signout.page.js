const Action = require("../utils/actions");
const SignOutSelectors = require("../selectors/signout.selector");
require("dotenv").config();

class SignOutPage {
  
    async clickLogoutButton() {
        const dropdown = await SignOutSelectors.signOutBtn;
            await dropdown.waitForDisplayed({ timeout: 5000 });
            await dropdown.click();
    }

    async clickConfirmSignOutButton() {
        const confirmBtn = await SignOutSelectors.confirmSignOutBtn;
            await confirmBtn.waitForDisplayed({ timeout: 5000 });
            await confirmBtn.click();
    }

}

module.exports = new SignOutPage();
