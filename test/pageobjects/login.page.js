const Action = require("../utils/actions");
const LoginSelectors = require("../selectors/login.selector");
require("dotenv").config();

class LoginPage {
  async clickLoginEmail() {
    await Action.tap(LoginSelectors.loginSignInBtn);
  }

  async isLoginEmailDisplayed() {
    try {
      return await LoginSelectors.loginEmail.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async fillEmail() {
    await LoginSelectors.loginEmail.setValue(process.env.EMAIL);
  }

  async clickLogin2Email() {
    await Action.tap(LoginSelectors.login2Email);
  }

  async isLogin2EmailVisible() {
    try {
      return await LoginSelectors.login2Email.isDisplayed();
    } catch (error) {
      return false;
    }
  }

  async clickResManagerBtn() {
    await LoginSelectors.loginResManagerBtn.click();
  }

  async isResManagerUsernameVisible(timeout = 8000) {
    try {
      await LoginSelectors.loginResManagerUsername.waitForDisplayed({
        timeout,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async fillResManagerUsername() {
    await LoginSelectors.loginResManagerUsername.setValue(
      process.env.RM_USERNAME,
    );
  }

  async fillResManagerPassword() {
    await LoginSelectors.loginResManagerPassword.setValue(
      process.env.RM_PASSWORD,
    );
  }

  async clickResManagerSignInBtn() {
    await Action.tap(LoginSelectors.loginResManagerSignInBtn);
  }

  async getCasesText() {
    const casesText = await LoginSelectors.homeCasesText.getText();
    console.log("Cases Text: ", casesText);
    return casesText;
  }
  async isCasesTextDisplayed() {
    try {
      return await LoginSelectors.homeCasesText.isDisplayed();
    } catch (error) {
      return false;
    }
  }
  async clickNewCaseDropdown() {
    const dropdown = await LoginSelectors.homeNewCaseDropdown;
    await dropdown.waitForDisplayed({ timeout: 5000 });
    await dropdown.click();
  }
}

module.exports = new LoginPage();
