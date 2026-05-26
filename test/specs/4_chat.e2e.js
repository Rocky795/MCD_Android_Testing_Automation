const Actions = require("../utils/actions");
const { expect } = require("@wdio/globals");
const chatPage = require("../pageobjects/chat.page");
const ChatData = require("../data/chat.data");
const { openChatSupport, BillingIssueChatFlow, checkKBChatFlow } = require("../flows/chat.flow");
const chatData = require("../data/chat.data");

describe("Chat Support Automation", () => {
  it("Open New Case Chat", async () => {
    await openChatSupport();
  });

  it("Validate Chat Support Messages", async () => {
    await BillingIssueChatFlow();
  });



  // it("Verify that when an end user submits a query about a known Knowledge Base (KB) topic, the chatbot responds with an accurate answer, includes the correct KB article link, displays relevant images, and provides a working hyperlink.", async () => {
  //  let query=chatData.kb_querys.accountUnlockQuery.question;
  //  let config=chatData.kb_querys.accountUnlockQuery.config;
  //   await checkKBChatFlow(query,config);
  // });
});
