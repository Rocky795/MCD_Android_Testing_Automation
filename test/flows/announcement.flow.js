const { expect } = require("@wdio/globals");
const Actions = require("../utils/actions");
const ContactPage = require("../pageobjects/contact.page");
const ChatData = require("../data/chat.data");
const chatPage = require("../pageobjects/chat.page");

async function openAnnouncementFlow() {
  let textDynamic = await chatPage.getDynamicText(
    "Test Announcement (MIM) (Title)",
  );
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await textDynamic.click();
  await expect(textDynamic).toBeDisplayed();

  textDynamic = await chatPage.getDynamicText("Close");
  await textDynamic.waitForDisplayed({ timeout: 100000 });
  await expect(textDynamic).toBeDisplayed();
  console.log("Announcement has been Opened");
}

module.exports = { openAnnouncementFlow };
