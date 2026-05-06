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
  home_user_profile_btn: 'android=new UiSelector().className("android.widget.ImageView").instance(0)',
  home_user_profil_name: `android=new UiSelector().text("${process.env.PROFILE_NAME}")`,

};
