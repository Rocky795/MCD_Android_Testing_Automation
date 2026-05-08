# Allure Reporting Setup - Complete Guide

## 🚀 Quick Start

### 1. **Run All Tests**
```bash
npm run wdio
```

### 2. **Run Specific Test(s)**
```bash
# Run single spec
npm run wdio -- --spec ./test/specs/0_login.e2e.js

# Run multiple specs
npm run wdio -- --spec "./test/specs/0_login.e2e.js,./test/specs/1_profile.e2e.js"
```

### 3. **View Latest Report**
```bash
npm run report:open
```
This will automatically open the most recent report in your browser.

### 4. **View Specific Report**
```bash
# Replace with your timestamp
npx allure open allure-report/run-2026-05-08T10-16-37-997Z
```

### 5. **Clean Old Reports** (Optional)
```bash
npm run wdio:clean
```

---

## 📁 Report Structure

Each test run creates the following:

```
allure-results/
├── run-2026-05-08T10-16-37-997Z/    ← Results with full details
│   ├── *-result.json               (test results)
│   ├── *-attachment.json           (screenshots)
│   └── *-container.json            (test containers)
└── [other result files in root]    (temporary, copied to timestamped folder)

allure-report/
├── run-2026-05-08T10-16-37-997Z/    ← Generated HTML report
│   ├── index.html                  (open this in browser)
│   ├── data/
│   │   ├── suites.json            (test structure & results)
│   │   ├── behaviors.json         (grouped tests)
│   │   └── categories.json        (pass/fail summary)
│   └── [css, js, fonts, etc.]     (report assets)
└── [other report folders]         (previous runs)
```

---

## 📊 Report Access Methods

### **Method 1: Automatic (Recommended)**
```bash
npm run report:open
```
Automatically opens the latest report in your default browser.

### **Method 2: Using Allure CLI**
```bash
npx allure open allure-report/run-2026-05-08T10-16-37-997Z
```

### **Method 3: Manual Browser Access**
1. Open file explorer
2. Navigate to `allure-report/run-TIMESTAMP/index.html`
3. Open with your browser (Chrome/Firefox recommended)

### **Method 4: Direct File URL**
In your browser address bar, paste:
```
file:///C:/Users/YourUsername/OneDrive%20-%20Unisys/Desktop/Testing/Appium/MCD/allure-report/run-2026-05-08T10-16-37-997Z/index.html
```

---

## ⚙️ Configuration

### Key Settings in `wdio.conf.js`:

**Output directories:**
```javascript
const baseResultsDir = 'allure-results';              // Raw test results
const currentResultsDir = `allure-results/run-${timestamp}`;  // Per-run results
const currentReportDir = `allure-report/run-${timestamp}`;    // Per-run report
```

**Reporter settings:**
```javascript
reporters: [
  "spec",
  [
    "allure",
    {
      outputDir: baseResultsDir,  // Where raw results are written during test
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
    },
  ],
],
```

**Post-test processing (onComplete hook):**
- Copies results from root to timestamped folder
- Generates Allure report from timestamped results
- Displays report access instructions

---

## 📝 Available NPM Scripts

| Command | Purpose |
|---------|---------|
| `npm run wdio` | Run all tests |
| `npm run wdio -- --spec <path>` | Run specific test(s) |
| `npm run report:open` | Open latest report in browser |
| `npm run wdio:clean` | Clean all old reports and results |

---

## 🔍 Report Features

Once you open a report, you can:

- **View Test Results**: See pass/fail status for each test
- **View Test Steps**: Expand tests to see detailed execution steps
- **View Screenshots**: See screenshots attached to each step
- **Filter Tests**: Filter by status (passed, failed, skipped)
- **View Timeline**: See test execution timeline
- **View Behaviors**: See tests grouped by functionality
- **Compare Runs**: Access any timestamped report folder

---

## ✨ What's Included in Each Report

✅ **Test Execution Details**
- Test names and descriptions
- Pass/fail status
- Execution duration
- Device/platform info

✅ **Test Steps**
- WebDriver command execution
- Request/response data
- Element interactions

✅ **Screenshots**
- Screenshots attached to test steps
- Screenshot on test failure (automatically captured)

✅ **Environment Info**
- Platform: Android
- Device: Samsung SM-X115 (or emulator)
- Environment: UAT

---

## 🛠️ Troubleshooting

### **Problem: Report opens but shows "No data"**
- ✅ Fixed in this setup!
- Results are now properly copied to timestamped folders
- Report generation reads from the correct location

### **Problem: `npm run report:open` doesn't work**
- Make sure you have PowerShell 5.1+ on Windows
- Alternatively, manually run: `npx allure open allure-report/run-TIMESTAMP`

### **Problem: Can't find latest report**
- Check `allure-report/` folder for timestamped directories
- Each run creates a folder like `run-2026-05-08T10-16-37-997Z`
- Timestamps follow ISO format with dashes instead of colons

### **Problem: Tests fail but report still generates**
- This is normal! Reports are generated for all test runs
- Even failed tests are documented with screenshots

---

## 📌 Next Steps (Optional)

1. **Add more comprehensive tests** - The framework is ready!
2. **Integrate with CI/CD** - Use these same commands in GitHub Actions/Jenkins/etc.
3. **Setup report archiving** - Keep historical reports organized
4. **Add more assertions** - Enhance test coverage
5. **Customize report theme** - Allure supports custom branding

---

## 📞 Quick Reference Commands

```bash
# Run tests
npm run wdio

# View report immediately after tests complete
npm run report:open

# Clean and start fresh
npm run wdio:clean
npm run wdio

# List all available reports
Get-ChildItem -Path './allure-report' -Directory | Select-Object Name

# Open specific report
npx allure open allure-report/run-2026-05-08T10-16-37-997Z
```

---

**Setup completed successfully! Your Allure reports are now properly isolated per run. 🎉**
