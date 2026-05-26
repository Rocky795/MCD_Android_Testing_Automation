const Actions = require("../utils/actions");
const chatPage = require("../pageobjects/chat.page");
const ChatData = require("../data/chat.data");
const { expect } = require("@wdio/globals");

async function checkChatFlow() {
  console.log("Chat flow is being executed.");
}

async function openChatSupport() {
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
}

async function BillingIssueChatFlow() {
  const greetingEl = await chatPage.getDynamicText(ChatData.messages.greeting);
  await greetingEl.waitForDisplayed({ timeout: 100000 });
  await expect(greetingEl).toBeDisplayed();
  console.log("Validation for message is done");
  const storeNumberIssueEl = await chatPage.getDynamicText(
    ChatData.messages.storeNumberIssue,
  );
  await storeNumberIssueEl.waitForDisplayed({ timeout: 50000 });
  await expect(storeNumberIssueEl).toBeDisplayed();
  console.log("Validation for message is done");

  const storeConfirmationEl = await chatPage.getDynamicText(
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
  const supportDeskClosedEl = await chatPage.getDynamicText(
    ChatData.messages.supportDeskClosed,
  );
  if (await supportDeskClosedEl.isDisplayed()) {
    console.log("The Chat support is closed");
  } else {
    console.log("Continue with Chat");
  }
}

async function checkKBChatFlow(
  query = "What are the requirements for creating a new password?",
  config = {},
) {
  const effectiveConfig = Object.keys(config).length
    ? config
    : ChatData.kb_querys.accountUnlockQuery.config;

  await chatPage.clickChatSupportClearChatButton();
  await Actions.wait(2000);

  await chatPage.clickChatSupportClearChatButton();
  await Actions.wait(2000);
  await chatPage.clickStartNewChatButton();
  await chatPage.enterChatSupportMessage("This is a test message.");
  await chatPage.clickChatSupportSendButton();
  const greetingEl = await chatPage.getDynamicText(ChatData.messages.greeting);
  await greetingEl.waitForDisplayed({ timeout: 100000 });
  await expect(greetingEl).toBeDisplayed();
  console.log("Validation for message is done");
  const storeNumberIssueEl = await chatPage.getDynamicText(
    ChatData.messages.storeNumberIssue,
  );
  await storeNumberIssueEl.waitForDisplayed({ timeout: 50000 });
  await expect(storeNumberIssueEl).toBeDisplayed();
  console.log("Validation for message is done");

  await chatPage.clickChatConfirmStoreNumber();

  await chatPage.clickDynamicText(ChatData.general_option.somethingElse);
  await Actions.wait(2000);

  await chatPage.clickDynamicText(ChatData.general_option.not_impacted);

  let message = await chatPage.getDynamicText(
    ChatData.general_option.udp_start_message,
  );
  await message.waitForDisplayed({ timeout: 100000 });
  await expect(message).toBeDisplayed();
  console.log("Validation for message is done");

  await chatPage.enterChatSupportMessage(query);
  await chatPage.clickChatSupportSendButton();

  const responseKeyword =
    effectiveConfig.requiredKeywords?.[0] ||
    ChatData.kb_querys.accountUnlockQuery.config.requiredKeywords[0];

  let messageResponse = await chatPage.getDynamicText(responseKeyword);
  await messageResponse.waitForDisplayed({ timeout: 100000 });
  await expect(messageResponse).toBeDisplayed();

  const responseText = await messageResponse.getText();
  await Actions.validateKBResponse(responseText, effectiveConfig);

  console.log("Validation for message is done");
}

module.exports = {
  checkChatFlow,
  openChatSupport,
  BillingIssueChatFlow,
  checkKBChatFlow,
};
