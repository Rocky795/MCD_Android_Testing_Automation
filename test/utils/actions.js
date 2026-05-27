const ChatbotAssertions = require("./chatbot_assertion");

class Actions {
  /**
   * Scrolls down the screen until the specific element is visible.
   * @param {WebdriverIO.Element} element - The element to find
   * @param {number} maxSwipes - Prevents infinite loops if the element doesn't exist
   */
  async scrollToElement(element, maxSwipes = 20) {
    for (let i = 0; i < maxSwipes; i++) {
      // 1. Check if the element is on the screen right now
      if (await element.isDisplayed()) {
        console.log("Element found on screen!");
        return true;
      }

      // 2. If not, swipe up (which scrolls the screen down)
      console.log(
        `Element not found, swiping down... (Attempt ${i + 1}/${maxSwipes})`,
      );
      await this.swipeUp();

      // 3. Wait a brief moment for the scroll animation to settle
      await this.wait(1000);
    }

    // 4. If the loop finishes and we still haven't found it, throw an error
    throw new Error(
      `Element was not found after scrolling ${maxSwipes} times.`,
    );
  }

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
    // Swipe up to scroll down (reveal elements below)
    await driver.execute("mobile: swipeGesture", {
      left: 100,
      top: 400,
      width: 824,
      height: 400,
      direction: "up",
      percent: 0.2,
    });
  }

  async swipeDown() {
    // Swipe down to scroll up (reveal elements above)
    await driver.execute("mobile: swipeGesture", {
      left: 100,
      top: 400,
      width: 824,
      height: 400,
      direction: "down",
      percent: 0.2,
    });
  }

  async handleIntermediatePage(timeout = 15000) {
    console.log("Waiting for intermediate page to appear...");
    try {
      await this.intermediatePageElement.waitForDisplayed({ timeout: timeout });
      console.log(
        "SUCCESS: Intermediate page detected! Clicking to dismiss...",
      );
      await Action.tap(this.intermediatePageButton);
    } catch (error) {
      console.log(
        "SKIPPED: No intermediate page detected after " +
          timeout / 1000 +
          " seconds.",
      );
    }
  }

  async wait(ms) {
    await driver.pause(ms);
  }

  async validateDynamicAIResponse(text, config = {}) {
    ChatbotAssertions.assertDynamicUDPResponse(text, config);
  }

  async validateKBResponse(text, config = {}) {
    return this.validateDynamicAIResponse(text, config);
  }
}

module.exports = new Actions();
