const Actions = require("../utils/actions");
const chatPage = require("../pageobjects/chat.page");
const ChatData = require("../data/chat.data");
const { expect } = require("@wdio/globals");

async function openCases() {
  let textDynamic = await chatPage.getDynamicText("RC0009845");
  // const targetElement = await $(androidPaths.some_element_at_the_bottom);

  // This will swipe up to 20 times looking for the element
  await Actions.scrollToElement(textDynamic, 20);

  // Element is now visible, proceed with further actions
  await textDynamic.click();

  textDynamic = await chatPage.getDynamicText("RC0009845");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();

  textDynamic = await chatPage.getDynamicText("28493");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();

  textDynamic = await chatPage.getDynamicText("Test Short Description");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();
  textDynamic = await chatPage.getDynamicText("Front counter-Test Description");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();
  textDynamic = await chatPage.getDynamicText("Low");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();
  textDynamic = await chatPage.getDynamicText("Minor");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();
}

module.exports = { openCases };
