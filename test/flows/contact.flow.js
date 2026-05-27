const Actions = require("../utils/actions");
const ContactPage = require("../pageobjects/contact.page");
const chatPage = require("../pageobjects/chat.page");
const { expect } = require("@wdio/globals");
const ContactData = require("../data/contact.data");

async function openContacts() {
  await ContactPage.clickContactSupport();

  let textDynamic = await chatPage.getDynamicText(ContactData.chat_message);
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();

  textDynamic = await chatPage.getDynamicText(ContactData.help_message);
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();

  textDynamic = await chatPage.getDynamicText(ContactData.Phone);
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();

  textDynamic = await chatPage.getDynamicText(ContactData.Hours);
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();
}

module.exports = { openContacts };
