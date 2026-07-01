# MCD Test Automation — Demo Overview

A unified automation framework that lets us test the MCD product across **Android, iOS, and Web** from a single codebase, with rich reporting and screenshots built in.

---

## What We Built

We built a **WebdriverIO + Appium** automation framework that started as an Android (and iOS) mobile suite and now also covers the **web (desktop Chrome)** experience — all sharing the same structure, utilities, and reporting pipeline.

The key idea: **one project, three platforms, one set of patterns.** Whether we are testing the mobile app or the ServiceNow web portal, we write tests the same way and get the same Allure reports out the other end.

---

## Technology Stack

| Tool | Purpose |
|------|---------|
| **WebdriverIO 9.27** | Core test automation framework |
| **Appium (UIAutomator2)** | Android native automation driver |
| **Mocha** | Test framework (BDD style) |
| **Allure** | Rich HTML reporting with steps & screenshots |
| **Visual Service** | Automatic screenshot capture |
| **Node.js / JavaScript** | Runtime and language (CommonJS) |
| **dotenv** | Secure handling of credentials & environment config |

---

## How It Works — Smart Platform Switching

The heart of the demo is in our configuration. We made the framework **auto-detect** whether we're running a mobile test or a web test based on the command we run:

- When the spec path points to `test/specs/web`, the framework spins up **Chrome** with browser capabilities — no Appium needed.
- For everything else, it boots the **Android emulator** with the Appium UIAutomator2 driver and the UAT app build.

This means the **same command and the same config** handle both worlds — no manual swapping, no separate projects to maintain.

```
Run a web spec   → Chrome + visual service
Run a mobile spec → Android emulator + Appium + visual service
```

---

## Clean, Layered Architecture

We organized the project into clear layers so tests stay readable and selectors stay maintainable:

```
test/
├── constants/    → Raw selector strings (android / ios / web)
├── selectors/    → Element getters wrapping those strings
├── pageobjects/  → Page-level abstractions (login, chat, case, contact…)
├── flows/        → Reusable business flows (login flow, case flow…)
├── data/         → Test data and baselines
├── utils/        → Shared cross-platform actions & assertions
└── specs/        → The actual test cases
    └── web/      → New web automation specs
```

The big win: our **shared `actions.js`** (tap, type, swipe, press-enter) already knows the difference between mobile and web. The same helper works everywhere — we write `tap(element)` and it does the right thing on Android or in Chrome.

---

## The New Web Capability (Live Demo Focus)

We extended the framework to automate the **ServiceNow web portal** end-to-end. The flow we demo:

1. **Navigate** to the ServiceNow UAT environment.
2. **Single Sign-On** — drive the full MCD SSO → Microsoft account → Restaurant Manager login journey.
3. **Handle real-world friction** — dismiss intermediate confirmation popups automatically.
4. **Search a case** — type a case number into the global search and submit.

A nice technical highlight: ServiceNow hides its search box inside a **shadow DOM**, and we handle that cleanly with a shadow-piercing selector — so even deeply nested, modern web components are reachable.

Credentials never live in the code — they're pulled securely from environment configuration.

---

## Reporting & Evidence

Every run gives us professional, shareable output:

- **Allure reports** — pass/fail status, step-by-step breakdowns, and execution timeline, organized into timestamped folders per run.
- **Automatic screenshots** — captured after each test and attached to the report, so failures come with visual proof.
- **One command to view** — open the latest report instantly.

```bash
npm run wdio          # Run the tests
npm run report:open   # Open the latest Allure report
npm run wdio:clean    # Clean previous results
```

---

## Why This Matters

- **One framework, three platforms** — Android, iOS, and Web under one roof.
- **Reusable by design** — shared actions, page objects, and flows mean less duplication and faster test authoring.
- **Demo-ready evidence** — clear reports and screenshots make results easy to present and trust.
- **Built for real apps** — handles SSO, popups, shadow DOM, and other production-grade complexity.

---

*This document summarizes the MCD automation framework for demo purposes.*
