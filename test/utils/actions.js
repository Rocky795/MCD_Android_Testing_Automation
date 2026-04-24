class Actions {
  async tap(el, customTimeout = 10000) {
    await el.waitForDisplayed({ timeout: customTimeout });
    await el.click();
  }

  async type(el, text) {
    await el.waitForDisplayed();
    await el.setValue(text);
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

  async wait(ms) {
    await driver.pause(ms);
  }
}

module.exports = new Actions();
