/**
 * KB Response Baseline Configuration
 * Defines expected content for various query responses
 */

const KB_BASELINES = {
  kb_unlock_account_response: {
    queryId: 'unlock_account',
    topic: 'Account Unlocking Methods',
    
    // Essential keywords that MUST be present
    requiredKeywords: [
      'LIFELENZ',
      'Kiosk Mode',
      'personal device',
      'MFA',
      'Microsoft Authenticator',
      'recovery email',
      'unlock',
      'account'
    ],

    // Required sections in response
    requiredSections: ['Introduction', 'Steps', 'AdditionalInfo', 'References'],

    // Baseline response for semantic comparison
    baselineResponse: `
      To unlock your account using a personal device, you can use the LIFELENZ 
      application in Kiosk Mode. Here is the basic procedure:
      
      1. Download and install the LIFELENZ Mobile Application
      2. Manager logs in to the app
      3. Go to Settings and tap on Kiosk Mode
      4. Toggle the Kiosk button to enable it
      
      For MFA authentication, you may need to switch to Smartphone MFA by:
      1. Logging into Global Account Manager
      2. Setting up Microsoft Authenticator App
      3. Storing your recovery code
      4. Confirming recovery email
    `,

    // Expected sub-topics
    expectedSubtopics: [
      'LIFELENZ Setup Process',
      'Kiosk Mode Enablement',
      'Multi-Factor Authentication',
      'Recovery Methods',
      'Security Features'
    ],

    // Expected references
    expectedReferences: {
      kbArticles: ['KB0014741', 'KB0015011', 'KB0020448'],
      minReferencesRequired: 2
    },

    // Variations in wording are acceptable
    acceptableVariations: [
      { original: 'download and install', acceptable: ['install', 'setup', 'obtain'] },
      { original: 'Kiosk Mode', acceptable: ['kiosk mode', 'kiosk', 'shared device mode'] },
      { original: 'Microsoft Authenticator', acceptable: ['authenticator app', 'MFA app', 'Authenticator'] },
      { original: 'recovery email', acceptable: ['recovery email address', 'backup email', 'personal email'] }
    ],

    // Maximum acceptable variations from baseline
    acceptableSemanticDifference: 0.3, // 30% difference allowed
    minSemanticSimilarity: 0.7 // 70% minimum match

  },

  kb_mfa_setup_response: {
    queryId: 'mfa_setup',
    topic: 'MFA Setup and Registration',
    
    requiredKeywords: [
      'MFA',
      'Multi-Factor Authentication',
      'Global Account Manager',
      'recovery code',
      'recovery email',
      'Microsoft Authenticator',
      'QR code',
      '6-digit code'
    ],

    requiredSections: ['Introduction', 'Steps', 'References'],

    baselineResponse: `
      To set up and register for MFA:
      
      1. Log into Global Account Manager
      2. Manage your MFA settings
      3. Store your recovery code safely
      4. Set up a recovery email (personal email)
      5. Confirm the recovery email
      6. Use Microsoft Authenticator to scan QR code
      7. Enter the 6-digit verification code
    `,

    expectedSubtopics: [
      'Account Manager Access',
      'Recovery Code Storage',
      'Recovery Email Setup',
      'Authenticator App Setup',
      'Verification Process'
    ],

    expectedReferences: {
      kbArticles: ['KB0020448', 'KB0015011'],
      minReferencesRequired: 1
    },

    acceptableSemanticDifference: 0.25,
    minSemanticSimilarity: 0.75
  }
};

module.exports = KB_BASELINES;