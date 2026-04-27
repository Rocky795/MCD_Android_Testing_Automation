const Action = require("../utils/actions");
const LoginSelectors = require("../selectors/login.selector");
require("dotenv").config();

class LoginPage {
  
  async clickLoginEmail() {
    await Action.tap(LoginSelectors.loginSignInBtn);
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


  async fillResManagerUsername() {
    await LoginSelectors.loginResManagerUsername.setValue(process.env.RM_USERNAME);
  }

  async fillResManagerPassword() {
    await LoginSelectors.loginResManagerPassword.setValue(process.env.RM_PASSWORD);
  }

  async clickResManagerSignInBtn() {
    await Action.tap(LoginSelectors.loginResManagerSignInBtn);
  }
}

module.exports = new LoginPage();
