require("dotenv").config();
const allure = require("@wdio/allure-reporter").default;
const path = require("path");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const baseResultsDir = "allure-results";
const currentResultsDir = `allure-results/run-${timestamp}`;
const currentReportDir = `allure-report/run-${timestamp}`;

const fs = require("fs");
// Create root results and report directories (allure writes to root by default)
fs.mkdirSync(baseResultsDir, { recursive: true });
fs.mkdirSync("allure-report", { recursive: true });

// Report environment variables for Allure (replace deprecated addEnvironment usage)
process.env.PLATFORM = process.env.PLATFORM || "Android";
process.env.DEVICE = process.env.DEVICE || "Samsung SM-X115";
process.env.ENVIRONMENT = process.env.ENVIRONMENT || "UAT";


// 1. Detect if the command includes a path to the web specs
const isWebRun = process.argv.some(arg => arg.includes('test/specs/web') || arg.includes('test\\specs\\web'));

// 2. Dynamically set capabilities
const activeCapabilities = isWebRun ? [{
    browserName: "chrome",
    acceptInsecureCerts: true,
    maxInstances: 1
}] : [{
    platformName: "Android",
    "appium:automationName": "UiAutomator2",
    // Target a specific device via APPIUM_UDID (set by run-tests.ps1 when you
    // pick a phone/emulator). Falls back to emulator-5554 when not provided.
    "appium:deviceName": process.env.APPIUM_UDID || "emulator-5554",
    ...(process.env.APPIUM_UDID ? { "appium:udid": process.env.APPIUM_UDID } : {}),
    "appium:app": "C:\\Users\\BhartiPr\\Downloads\\app-uat-1.0.14-27-release-signed.apk",
    "appium:noReset": true,
    acceptInsecureCerts: true,
    "appium:newCommandTimeout": 150000,
    "appium:adbExecTimeout": 150000,
    "appium:uiautomator2ServerInstallTimeout": 150000,
    "appium:appWaitActivity": "*",
    "appium:appWaitDuration": 150000,
    "appium:autoGrantPermissions": true,
    maxInstances: 1
}];

// 3. Dynamically set the port (Web doesn't need 4723)
const activePort = isWebRun ? undefined : 4723;

// 4. Dynamically set services (Web shouldn't use Appium)
const activeServices = isWebRun ? ["visual"] : ["appium", "visual"];

exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO supports running e2e tests as well as unit and component tests.
  runner: "local",
port: activePort,  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // of the configuration file being run.
  //
  // The specs are defined as an array of spec files (optionally using wildcards
  // that will be expanded). The test for each spec file will be run in a separate
  // worker process. In order to have a group of spec files run in the same worker
  // process simply enclose them in an array within the specs array.
  //
  // The path of the spec files will be resolved relative from the directory of
  // of the config file unless it's absolute.
  //
  specs: [],
  // Patterns to exclude.
  exclude: ["./test/specs/runner.e2e.js"],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://saucelabs.com/platform/platform-configurator
  //
  capabilities: activeCapabilities,

  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "warn",
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/appium-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  // baseUrl: 'http://localhost:8080',
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 90000,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 150000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: activeServices,

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "mocha",

  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Delay in seconds between the spec file retry attempts
  // specFileRetriesDelay: 0,
  //
  // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
  // specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: baseResultsDir,
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,

        reportedEnvironmentVars: ["PLATFORM", "DEVICE", "ENVIRONMENT"],
      },
    ],
  ],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: "bdd",
    timeout: 300000,
  },

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  // onPrepare: function (config, capabilities) {
  // },
  /**
   * Gets executed before a worker process is spawned and can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  // beforeSession: function (config, capabilities, specs, cid) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  before: function (capabilities, specs) {
    console.log(
      `Test environment: ${process.env.ENVIRONMENT} / ${process.env.PLATFORM} / ${process.env.DEVICE}`,
    );
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Hook that gets executed before the suite starts
   * @param {object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: function (test, context) {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context, hookName) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine only)
   * @param {object}  test             test object
   * @param {object}  context          scope object the test was executed with
   * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
   * @param {*}       result.result    return object of test function
   * @param {number}  result.duration  duration of test
   * @param {boolean} result.passed    true if test has passed, otherwise false
   * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
   */
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries },
  ) {
    try {
      if (!browser.sessionId) {
        console.log("Session already closed. Screenshot skipped.");
        return;
      }

      const screenshotDir = path.join(process.cwd(), "ScreenShots");

      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      // Safe filename
      const fileName =
        test.title.replace(/[^a-zA-Z0-9]/g, "_") + "_" + Date.now() + ".png";

      const filePath = path.join(screenshotDir, fileName);

      // Take screenshot
      await browser.saveScreenshot(filePath);

      console.log(`Screenshot saved: ${filePath}`);
    } catch (err) {
      console.log(`Screenshot capture skipped/failed: ${err.message}`);
    }
  },

  /**
   * Hook that gets executed after the suite has ended
   * @param {object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */

  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: function () {
    try {
      fs.mkdirSync(currentResultsDir, { recursive: true });

      const allResultFiles = fs.readdirSync(baseResultsDir).filter((f) => {
        const fullPath = path.join(baseResultsDir, f);
        return (
          fs.statSync(fullPath).isFile() &&
          (f.endsWith("-result.json") ||
            f.endsWith(".png") || // screenshots
            f.endsWith(".jpg") ||
            f.endsWith("-container.json") ||
            f.endsWith(".jpeg") ||
            f.endsWith("-attachment.txt"))
        );
      });

      if (allResultFiles.length === 0) {
        console.warn(
          `\nWarning: No result files found in ${baseResultsDir}. Tests may have failed to execute.`,
        );
      } else {
        allResultFiles.forEach((file) => {
          const source = path.join(baseResultsDir, file);
          const dest = path.join(currentResultsDir, file);
          fs.copyFileSync(source, dest);
        });
        console.log(
          `\nCopied ${allResultFiles.length} result files to ${currentResultsDir}`,
        );
      }

      // Generate the report using the timestamped results
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Generating Allure report for run: ${timestamp}`);
      console.log(`Reading results from: ${currentResultsDir}`);
      console.log(`Writing report to: ${currentReportDir}`);
      console.log(`${"=".repeat(60)}\n`);

      require("child_process").execSync(
        `npx allure generate "${currentResultsDir}" -o "${currentReportDir}" --clean`,
        { stdio: "inherit" },
      );

      console.log(`\n${"=".repeat(60)}`);
      console.log(`Allure report successfully generated!`);
      console.log(`\nReport Location: ${currentReportDir}`);
      console.log(`\nTo view the report, run:`);
      console.log(`  npm run report:open`);
      console.log(`\nOr manually open:`);
      console.log(`  npx allure open ${currentReportDir}`);
      console.log(`\nOr open in browser:`);
      console.log(`  file:///${path.resolve(currentReportDir)}/index.html`);
      console.log(`${"=".repeat(60)}\n`);

      // Optional: Clean up root allure-results folder for next run
      // Uncomment the following lines if you want to auto-clean between runs:
      // allResultFiles.forEach(file => {
      //   fs.unlinkSync(path.join(baseResultsDir, file));
      // });
      // console.log(`Cleaned root ${baseResultsDir} folder for next run`);
    } catch (error) {
      console.error(`\n${"=".repeat(60)}`);
      console.error(`Failed to generate Allure report!`);
      console.error(`Error: ${error.message}`);
      console.error(`Results directory: ${currentResultsDir}`);
      console.error(`Report directory: ${currentReportDir}`);
      console.error(`\nMake sure @wdio/allure-reporter is installed:`);
      console.error(`  npm install --save-dev @wdio/allure-reporter`);
      console.error(`${"=".repeat(60)}\n`);
      throw error;
    }
  },
  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
  // onReload: function(oldSessionId, newSessionId) {
  // }
  /**
   * Hook that gets executed before a WebdriverIO assertion happens.
   * @param {object} params information about the assertion to be executed
   */
  // beforeAssertion: function(params) {
  // }
  /**
   * Hook that gets executed after a WebdriverIO assertion happened.
   * @param {object} params information about the assertion that was executed, including its results
   */
  // afterAssertion: function(params) {
  // }
};
