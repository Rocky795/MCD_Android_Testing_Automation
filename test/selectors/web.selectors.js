const {webPaths} = require("../constants/web.selector");

class WebSelectors {
    get mcd_SSO() {
        return $(webPaths.mcd_SSO);
    }

    get mcd_email() {
        return $(webPaths.mcd_email);
    }

    get mcd_email_next_btn() {
        return $(webPaths.mcd_email_next_btn);
    }
    get mcd_saved_user() {
        return $(webPaths.mcd_saved_user);
    }

    get mcd_another_account() {
        return $(webPaths.mcd_another_account);
    }

    get mcd_date_popup() {
        return $(webPaths.mcd_date_popup);
    }

    get mcd_login_restaurent_manager_btn() {
        return $(webPaths.mcd_login_restaurent_manager_btn);
    }

    get mcd_res_manager_username() {
        return $(webPaths.mcd_res_manager_username);
    }

    get mcd_res_manager_password() {
        return $(webPaths.mcd_res_manager_password);
    }

    get mcd_res_manager_sign_in_btn() {
        return $(webPaths.mcd_res_manager_sign_in_btn);
    }

    get mcd_final_confirmation_popup() {
        return $(webPaths.mcd_final_confirmation_popup);
    }

    get mcd_global_search_input() {
        return $(webPaths.mcd_global_search_input);
    }

}

module.exports = new WebSelectors();