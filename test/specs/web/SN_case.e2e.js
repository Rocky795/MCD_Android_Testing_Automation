const { expect } = require("@wdio/globals");
const Actions = require("../../utils/actions");
const WebSelectors = require("../../selectors/web.selectors");

describe("Desktop Browser Automation", () => {
  it("should open a webpage successfully", async () => {
    // await browser.url("https://webdriver.io");
    // const title = await browser.getTitle();
    // console.log(`The title of the page is: ${title}`);

    // Assert that the page loaded
    // expect(title).toContain("WebdriverIO");
    await browser.url(
      "https://mcdonaldsuat.service-now.com/now/nav/ui/classic/params/target/sys_user_list.do%3Fsysparm_choice_query_raw%3D%26sysparm_first_row%3D1%26sysparm_list_header_search%3Dtrue%26sysparm_query%3DnameSTARTSWITHPratham%255Eemail%253E%253Dpratham%26sysparm_view%3D",
    );
    // MCD Login clic
    let path = await WebSelectors.mcd_SSO;
    await Actions.tap(path);

    path = await WebSelectors.mcd_another_account;
    await Actions.tap(path);


    
    
    
    path= await WebSelectors.mcd_email;
    await Actions.type(path, process.env.MCD_USERNAME);
    path= await WebSelectors.mcd_email_next_btn;
    await Actions.tap(path);
    
    path= await WebSelectors.mcd_date_popup;
    await Actions.tap(path);
    path= await WebSelectors.mcd_login_restaurent_manager_btn;
    await Actions.tap(path);
    path= await WebSelectors.mcd_res_manager_username;
    await Actions.type(path, process.env.MCD_USERNAME);
    path= await WebSelectors.mcd_res_manager_password;
    await Actions.type(path, process.env.MCD_PASSWORD);
    path= await WebSelectors.mcd_res_manager_sign_in_btn;
    await Actions.tap(path);

    await browser.pause(20000);
    

    path= await WebSelectors.mcd_final_confirmation_popup;
    await path.waitForDisplayed({ timeout: 45000 }); 
    if (await path.isDisplayed()) {
      await Actions.tap(path);
    }
    
   
 

    path=await WebSelectors.mcd_global_search_input;
    await Actions.type(path,"RC0010889");
    await browser.pause(2000);
    await Actions.pressEnter();


    await browser.pause(9999999);

    // put emil in username field
    // await browser.pause(9999999);
    // Click Next
    // put password in password field
    // Click Sign in
    // Normal Login flow
    // MFA flow
  });
});
