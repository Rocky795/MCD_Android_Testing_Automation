const Actions = require("../utils/actions");
const { expect } = require("@wdio/globals");
const ChatPage = require("../pageobjects/chat.page");
const ChatData = require("../data/chat.data");
const chatPage = require("../pageobjects/chat.page");

describe("Chat Support Automation", () => {
  it("Open New Case Chat", async () => {
    await chatPage.clickNewCaseChatButton();
    await Actions.wait(2000);
    await chatPage.clickChatSupportClearChatButton();
    await Actions.wait(2000);
    await chatPage.clickChatSupportClearChatButton();
    await Actions.wait(2000);
    await chatPage.clickStartNewChatButton();
    await chatPage.enterChatSupportMessage("This is a test message.");
    await chatPage.clickChatSupportSendButton();
    await Actions.wait(2000);
  });

  it("Validate Chat Support Messages", async () => {
    const greetingEl = await ChatPage.getDynamicText(
      ChatData.messages.greeting,
    );
    await greetingEl.waitForDisplayed({ timeout: 100000 });
    await expect(greetingEl).toBeDisplayed();
    console.log("Validation for message is done");
    const storeNumberIssueEl = await ChatPage.getDynamicText(
      ChatData.messages.storeNumberIssue,
    );
    await storeNumberIssueEl.waitForDisplayed({ timeout: 50000 });
    await expect(storeNumberIssueEl).toBeDisplayed();
    console.log("Validation for message is done");

    const storeConfirmationEl = await ChatPage.getDynamicText(
      ChatData.messages.storeConfirmation,
    );
    await storeConfirmationEl.waitForDisplayed({ timeout: 50000 });
    await expect(storeConfirmationEl).toBeDisplayed();
    console.log("Validation for message is done");

    await Actions.wait(2000);
    await chatPage.clickChatConfirmStoreNumber();
    await Actions.wait(2000);
    await chatPage.clickChatBillingIssue();
    await Actions.wait(2000);
    const supportDeskClosedEl = await ChatPage.getDynamicText(
      ChatData.messages.supportDeskClosed,
    );
    if (await supportDeskClosedEl.isDisplayed()) {
      console.log("The Chat support is closed");
    } else {
      console.log("Continue with Chat");
    }
  });
});
