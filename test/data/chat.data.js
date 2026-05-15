// file: test/data/chat.data.js
module.exports = {
    general_option:{
        storeNumber: `Store ${process.env.STORE}`,
        somethingElse: "Something else",
        udp_start_message:`How can I help you, ${process.env.PROFILE_FIRST_NAME}?`,
        not_impacted: "Not impacted",
    },
  messages: {
    greeting: "Hello Pratham. Thank you for contacting the McDonald",
    storeNumberIssue:
      "It looks like you are contacting us for an issue with Store number…28493",
    storeConfirmation:
      "If this is the correct store, please select Store Number. If you are calling for a different store, please select Different Store Number",
    liveSupportRedirect:
      "Hello Pratham (Contractor). You have been redirected to the McDonald’s Restaurant Technology Live Support.",
    supportDeskClosed:
      "The Contract’s Support Desk is currently closed. Please contact us back during the next working day, between 7am and 7pm Central time, Monday through Friday. Thank you.",
  },
  kb_querys: {
    accountUnlockQuery: "How can I unlock my account using a personal device?",
    passowrdRequirement:
      "What are the requirements for creating a new password?",
  },
  kb_querys_response: {
    accountUnloackResponse: `
        To lock your account using a personal device,
        one common method is to use biometric or PIN
        authentication through an app like LifeLenz.

        Here is a general procedure:

        1. A manager logs into the system
        and accesses the settings.

        2. In settings, select the crew listing
        and choose the employee to add
        biometric or PIN login.

        3. The employee sets up their login
        by entering their birth date and
        either scanning their fingerprint
        multiple times or creating a unique
        6-digit PIN.

        4. Once set, the employee uses this
        biometric or PIN method to log in
        going forward.

        For shared devices like tablets,
        a manager can enable "Kiosk Mode"
        on the LifeLenz app, which ensures
        no personal information is stored
        and users must log in each time.

        This mode also disables features
        like calendar sync and notifications
        to protect privacy.

        If you are using an iPhone and an
        authenticator app, you can cycle the
        App Lock setting and iPhone PIN setting
        to ensure your account is locked properly.

        This involves toggling the PIN and
        app lock settings off and on again
        in both the iPhone settings and the
        authenticator app.

        Here are some relevant images illustrating these steps:

        Manager accessing settings and logout options:

        Image

        Crew listing with PIN
        and biometric status:

        Image
       Fingerprint scan setup:

        Image
        

        PIN entry screen:

        Image
       

        Enabling Kiosk Mode
        on LifeLenz tablet app:

        Image
        

        (Note: This image is reused
        for illustration purposes)

        Cycling App Lock and
        iPhone PIN settings for MFA:
`.trim(),
    accountUnloackResponseImageNote:
      `Image (Note: This image is reused for illustration purposes)
      If you want to lock your account specifically
        using biometric or PIN on a personal device,
        setting up biometric or PIN login through
        your manager and using the LifeLenz app
        or authenticator app with proper settings
        is the recommended approach.

        [^1] [^2] [^3]

        [1]: US - LifeLenz - Add Biometric / PIN
        for Employees (KB0014727)

        [2]: US - LifeLenz - Advise the Manager
        to download LIFELENZ to a tablet for all
        employees to access their personal
        LIFELENZ account (KB0014741)

        [3]: US - MFA - Cycle the App Lock setting
        on the Authenticator App and iPhone
        Pin setting (KB0016753)`.trim(),
  },
};
