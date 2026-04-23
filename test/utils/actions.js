class Actions {
  async tap(el) {
    await el.waitForDisplayed();
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

export default new Actions();
