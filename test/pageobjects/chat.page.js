const Action = require("../utils/actions");
const ChatSelectors = require("../selectors/chat.selector");
const { androidPaths } = require('../constants/android.selector');
const chatSelector = require("../selectors/chat.selector");
require("dotenv").config();

class ChatPage {
  
 

  async getDynamicText(text) {
    
    let selectorString = androidPaths.chat_dynamic_message;
    selectorString = selectorString.replace("{MSG_TEXT}", text);
    console.log(`This message is getting validated: ${selectorString}`);
    return await $(selectorString);
  }

  async clickDynamicText(text){
    const messageEl = await this.getDynamicText(text);
    await messageEl.waitForDisplayed({ timeout: 50000 });
    await messageEl.click();
  }

  async getDynamicTextIsDisplayed(text) {
    const messageEl = await this.getDynamicText(text);
    await messageEl.waitForDisplayed({ timeout: 50000 });
    return await messageEl.isDisplayed();
  }

  async clickNewCaseChatButton() {
    const btn = ChatSelectors.newCaseChatButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "New Case Chat button not displayed",
    });
    await btn.click();
  }

  async clickChatSupportClearChatButton() {
    const btn = ChatSelectors.chatSupportClearChatButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Chat Support Clear Chat button not displayed",
    });
    await btn.click();
  }

  async clickStartNewChatButton() {
    const btn = ChatSelectors.startNewChatButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Start New Chat button not displayed",
    });
    await btn.click();
  }

  async clickChatSupportSendButton() {
    const btn = ChatSelectors.chatSupportSendButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Chat Support Send button not displayed",
    });
    await btn.click();
  }

  async enterChatSupportMessage(message) {
    const input = ChatSelectors.chatSupportInputField;
    await input.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Chat Support Input Field not displayed",
    });
    await input.setValue(message);
  }

  async clearChatSupportInput() {
    const input = ChatSelectors.chatSupportInputField;
    await input.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Chat Support Input Field not displayed",
    });
    await input.clearValue();
  }

  async clickChatBillingIssue() {
    const btn = ChatSelectors.chatBillingIssueSelector;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Chat Billing Issue selector not displayed",
    });
    await btn.click();
  }

  async clickChatConfirmStoreNumber() {
    const btn = ChatSelectors.chatConfirmStoreNumberButton;
    await btn.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: "Chat Confirm Store Number button not displayed",
    });
    await btn.click();
  }
}

module.exports = new ChatPage();
