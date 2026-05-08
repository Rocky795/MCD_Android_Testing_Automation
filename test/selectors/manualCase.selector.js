const { androidPaths } = require("../constants/android.selector");
const { iosPaths } = require("../constants/ios.selector");

class ManualCaseSelectors {
  get createCaseManualButton() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_button)
      : $(iosPaths.create_case_manual_button);
  }
  get createCaseManualIssueAreaDropdown() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_issue_area_dropdown)
      : $(iosPaths.create_case_manual_issue_area_dropdown);
  }
  get createCaseManualImpactDropdown() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_impact_dropdown)
      : $(iosPaths.create_case_manual_impact_dropdown);
  }
  get createCaseManualIssueAreaDropdownFrontCounter() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_issue_area_dropdown_front_counter)
      : $(iosPaths.create_case_manual_issue_area_dropdown_front_counter);
  }
  get createCaseManualShortDescriptionInput() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_short_description_imput)
      : $(iosPaths.create_case_manual_short_description_imput);
  }
  get createCaseManualDescriptionInput() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_description_input)
      : $(iosPaths.create_case_manual_description_input);
  }
  get createCaseManualPhoneNumber() {
    return driver.isAndroid
      ? $(androidPaths.create_case_manual_phone_number)
      : $(iosPaths.create_case_manual_phone_number);
  }
  get manualSubmitButton() {
    return driver.isAndroid
      ? $(androidPaths.manual_submit_button)
      : $(iosPaths.manual_submit_button);
  }

  get unexpectedErrorButton() {
    return driver.isAndroid
      ? $(androidPaths.unexpected_error_button)
      : $(iosPaths.unexpected_error_button);
  }
  
}
module.exports = new ManualCaseSelectors();
