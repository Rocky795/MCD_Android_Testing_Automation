const Actions = require("../utils/actions");
const chatPage = require("../pageobjects/chat.page");
const ChatData = require("../data/chat.data");
const { expect } = require("@wdio/globals");


async function openCases() {
  const greetingEl = await chatPage.getDynamicText("RC0010045");
    await greetingEl.waitForDisplayed({ timeout: 100000 });
    await expect(greetingEl).toBeDisplayed();
    console.log("Validation for message is done");
}