export const androidPaths = {
  backpackItem: 'android=new UiSelector().text("Sauce Labs Backpack")',
  login_email: 'android=new UiSelector().text("McDonald\'s Email Address")',
  login2_email: 'android=new UiSelector().resourceId("idSIButton9")',
  login_email_btn: 'android=new UiSelector().description("Sign In")',
  login_res_manager_btn:
    'android=new UiSelector().text("Restaurant Managers & Franchisees")',
  login_res_manager_username:
    'android=new UiSelector().resourceId("UsernameInputTxtManagers")',
  login_res_manager_password:
    'android=new UiSelector().resourceId("PasswordInputManagers")',
  login_res_manager_sign_in_btn:
    'android=new UiSelector().resourceId("btnLoginManagers")',
  home_cases_text: 'android=new UiSelector().text("Cases")',
  home_user_profile_btn:
    'android=new UiSelector().className("android.widget.ImageView").instance(0)',
  home_user_profil_name: 'android=new UiSelector().text("Pratham Bharti")',
  sign_out_btn: 'android=new UiSelector().text("Sign out")',
  confirm_sign_out_btn:
    'android=new UiSelector().resourceId("android:id/button1")',
  home_newcase_dropdown:
    // 'android=new UiSelector().className("android.view.ViewGroup").instance(55)',
    // '//android.widget.TextView[normalize-space(@text)="New Case"]/ancestor::android.view.ViewGroup[1]//*[@clickable="true"]',
    // 'android=new UiSelector().text("New Case").fromParent(new UiSelector().clickable(true))',
    'android=new UiSelector().className("android.widget.ImageView").instance(8)',
  create_case_manual_button:
    'android=new UiSelector().text("Create a case yourself by entering the details manually.")',
  create_case_manual_issue_area_dropdown:
    'android=new UiSelector().text("Select")',
  create_case_manual_issue_area_dropdown_front_counter:
    'android=new UiSelector().textContains("Front counter")',
  create_case_manual_impact_dropdown:
    'android=new UiSelector().description("4 - Minor / Localized, ›")',
  create_case_manual_short_description_imput:
    'android=new UiSelector().text("Enter short description")',
  create_case_manual_description_input:
    'android=new UiSelector().textContains("Please describe the issue")',
  create_case_manual_phone_number:
    'android=new UiSelector().text("+1(508) 248-0663")',
  manual_submit_button: 'android=new UiSelector().description("Submit case")',
  unexpected_error_button:
    'android=new UiSelector().resourceId("android:id/button1")',
  manual_submit_Ok_button: 'android=new UiSelector().resourceId("android:id/button1")',
  manual_case_success_message:'android=new UiSelector().resourceId("android:id/message")',
  dynacmic_description_selector:
    'android=new UiSelector().textContains("{DESCRIPTION_TEXT}")',

  start_new_chat_button:
    'android=new UiSelector().resourceId("com.mcd.gsd.archassist:id/startNewButton")',
  new_case_chat_button: 'android=new UiSelector().description(" New Case")',
  chat_support_clear_chat_button:
    'android=new UiSelector().resourceId("com.mcd.gsd.archassist:id/action_clear_conversation")',
  chat_support_send_button:
    'android=new UiSelector().resourceId("com.mcd.gsd.archassist:id/send_button")',
  chat_support_input_field:
    'android=new UiSelector().resourceId("com.mcd.gsd.archassist:id/input_view")',
  // chat_support_greeting_message:
  //   'android=new UiSelector().textContains("Hello Pratham. Thank you for contacting the McDonald")',
  // chat_support_store_number_message:
  //   'android=new UiSelector().text("It looks like you are contacting us for an issue with Store number…28493")',
  // chat_support_store_number_confirmation_message:
  //   'android=new UiSelector().text("If this is the correct store, please select Store Number. If you are calling for a different store, please select Different Store Number")',
  // chat_support_redirected_Live_support_message:
  //   'android=new UiSelector().text("Hello Pratham (Contractor). You have been redirected to the McDonald’s Restaurant Technology Live Support.")',

  chat_confirm_store_number_button:
    'android=new UiSelector().text("Store 28493")',
  chat_dynamic_message: 'android=new UiSelector().textContains("{MSG_TEXT}")',

  chat_billing_issue_selector: 'android=new UiSelector().text("Billing")',
};
