class Actions {
  async tap(el, customTimeout = 30000) {
    await el.waitForDisplayed({ timeout: customTimeout });
    await el.waitForEnabled({ timeout: customTimeout }); 
    
    await driver.pause(1500); 
    
    await el.click();
  }

  async type(el, text, customTimeout = 30000) {
    await el.waitForDisplayed({ timeout: customTimeout });
    
    await el.waitForEnabled({ timeout: customTimeout }); 
    
  
    await el.clearValue(); 
    await el.addValue(text); 

    if (await driver.isKeyboardShown()) {
      await driver.hideKeyboard();
    }
  }

  async swipeUp() {
    await driver.execute("mobile: swipeGesture", {
      direction: "up",
      percent: 0.7,
    });
  }

  async swipeDown() {
    await driver.execute("mobile: swipeGesture", {
      direction: "down",
      percent: 0.7,
    });
  }

  async handleIntermediatePage(timeout = 15000) {
    console.log("Waiting for intermediate page to appear...");
    try {
      await this.intermediatePageElement.waitForDisplayed({ timeout: timeout });
      console.log("SUCCESS: Intermediate page detected! Clicking to dismiss...");
      await Action.tap(this.intermediatePageButton); 
    } catch (error) {
      console.log("SKIPPED: No intermediate page detected after " + (timeout/1000) + " seconds.");
    }
  }

  async wait(ms) {
    await driver.pause(ms);
  }
}

module.exports = new Actions();
