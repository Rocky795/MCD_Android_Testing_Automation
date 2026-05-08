const { androidPaths } = require("../constants/android.selector");
const { iosPaths } = require("../constants/ios.selector");

class ChatSelectors {
  get newCaseChatButton() {
    return driver.isAndroid
      ? $(androidPaths.new_case_chat_button)
      : $(iosPaths.new_case_chat_button);
  }

  get chatSupportClearChatButton() {
    return driver.isAndroid
      ? $(androidPaths.chat_support_clear_chat_button)
      : $(iosPaths.chat_support_clear_chat_button);
  }
  
  get startNewChatButton() {
    return driver.isAndroid
      ? $(androidPaths.start_new_chat_button)
      : $(iosPaths.start_new_chat_button);
  }

  get chatSupportSendButton() {
    return driver.isAndroid
      ? $(androidPaths.chat_support_send_button)
      : $(iosPaths.chat_support_send_button);
  }



  get chatSupportSendButton() {
    return driver.isAndroid
      ? $(androidPaths.chat_support_send_button)
      : $(iosPaths.chat_support_send_button);
  }

  get chatSupportInputField() {
    return driver.isAndroid
      ? $(androidPaths.chat_support_input_field)
      : $(iosPaths.chat_support_input_field);
  }

  get chatMessageDynamicSelector() {
    return driver.isAndroid
      ? $(androidPaths.chatMessageDynamicSelector)
      : $(iosPaths.chatMessageDynamicSelector);
  }

} 
module.exports = new ChatSelectors(); 
