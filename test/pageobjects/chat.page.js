const Action = require("../utils/actions");
const ChatSelectors = require("../selectors/chat.selector");
const { androidPaths } = require('../constants/android.selector');
const chatSelector = require("../selectors/chat.selector");
require("dotenv").config();

class ChatPage {
  /**
   * Dynamically locates a chat bubble based on its exact or partial text.
   * @param {string} messageText - The text of the chat message to find
   */
  // async getChatMessage(messageText) {
  //   // Using textContains is usually safer for long strings,
  //   // but you can change it to .text() if you need an exact match.
  //   const selectorString = androidPaths.chatMessageDynamicSelector(messageText);
  //   return await $(selectorString);
  // }

  async getChatMessage(text) {
    // 1. Get the static string from your constants
    let selectorString = androidPaths.chat_dynamic_message;
    console.log(selectorString)
    // 2. Replace the placeholder with the actual data text
    selectorString = selectorString.replace("{MSG_TEXT}", text);

    // 3. Return the WebdriverIO element
    return await $(selectorString);
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
}

module.exports = new ChatPage();
