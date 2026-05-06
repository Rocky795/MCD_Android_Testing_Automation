const Action = require("../utils/actions");
const LoginSelectors = require("../selectors/login.selector");
const ProfileSelectors = require("../selectors/profile.selector");
require("dotenv").config();

class ProfilePage {
  
    async clickUserProfile() {
        await ProfileSelectors.homeUserProfileBtn.click();
    }

    async getUserProfileName() {
        const profileName = await ProfileSelectors.homeUserProfileName.getText();
        console.log("User Profile Name: ", profileName);
        return profileName;
    }

}

module.exports = new ProfilePage();
