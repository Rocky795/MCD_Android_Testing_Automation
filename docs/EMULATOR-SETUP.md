# Android Emulator Setup & Troubleshooting (MCD)

How we got the MCD app's **MFA / SSO login working on an Android emulator**, and how to
reproduce it on a fresh emulator. Everything here is automated by
[`emulator-manager.ps1`](../emulator-manager.ps1) and [`run-tests.ps1`](../run-tests.ps1);
this doc explains *why* each piece exists.

> TL;DR — a clean emulator that can complete the SSO login needs **all** of:
> 1. a **modern Chrome** (SSO runs in a Chrome Custom Tab),
> 2. the **Cisco SSL‑inspection CA** trusted (corporate network re‑signs HTTPS),
> 3. the **App Link** for the MSAL redirect verified + enabled,
> 4. the Google **connectivity check disabled** (so it isn't flagged "No internet"),
> 5. **enough RAM** (≈3 GB guest) and the screen kept awake.

---

## The problems we hit (and the fix for each)

### 1. "Sign‑in was interrupted. Please try again." after MFA
The app opens auth in a **Chrome Custom Tab**; after MFA, Azure redirects to an
**App Link** `https://mcdtestmobileapplinks.z6.web.core.windows.net/` (intent‑filter
matches the literal path `/`, `autoVerify=true`). On emulators that domain often sits in
`legacy_failure`, so Chrome keeps the page instead of handing back to the app.

**Fix** (adb, no app change) — re‑verify + enable the App Link:
```
adb shell pm verify-app-links --re-verify com.mcd.gsd.archassist
adb shell pm set-app-links-user-selection --user 0 --package com.mcd.gsd.archassist true mcdtestmobileapplinks.z6.web.core.windows.net
adb shell pm get-app-links --user 0 com.mcd.gsd.archassist   # want: verified + Enabled
```
Automated as `emulator-manager.ps1 -Action applink`.
Note: `pm resolve-activity` always shows the chooser here even when fixed — trust the
`get-app-links` state, not the resolver.

### 2. Chrome too old (the real blocker)
The default **API‑34** emulator image bundles **Chrome 113 (May 2023)**. That old Chrome
fails the modern SSO redirect handoff. Real phones have current Chrome, so they work.

**Fix** — use a newer system image. We created AVD **`MCD_API36`** on
`system-images;android-36;google_apis_playstore;x86_64`, which ships **Chrome 133**.
(Emulators can't update Chrome via Play Store on this corporate network — Google is blocked —
so a newer *image* is the way.)

### 3. Corporate SSL inspection → HTTPS "interrupted" / broken page  ← this doc's cert
The network runs **Cisco Secure Access** (SSE/SASE) which **intercepts HTTPS** and re‑signs it
with `CN=Cisco Secure Access Primary SubCA`. Any device must **trust that CA** or TLS fails.
Real phones (and the old Pixel_6a set up in April) have it installed; a fresh emulator doesn't.

**Fix** — install the CA (saved in the repo at
[`certs/Cisco Secure Access Primary SubCA.crt`](../certs)) as a **trusted CA certificate**.
Automated as `emulator-manager.ps1 -Action cert` (pushes the cert, sets a lock PIN `1234`,
opens the install dialog). Then on the emulator: **CA certificate → name → OK → PIN 1234**.

> The cert install dialog is a **secure window** — `adb exec-out screencap` captures it as
> black even though it's visible on the emulator. That's expected; look at the emulator screen.
> If the pop‑up doesn't render (software‑GPU glitch), use the full‑screen route:
> **Settings → Security & privacy → (More) → Encryption & credentials → Install a certificate
> → CA certificate →** pick `CiscoSecureAccess.crt` → PIN `1234`.

### 4. "Connected, no internet access" on the emulator
Android validates internet by probing a **Google** endpoint. The corporate firewall **blocks
Google**, so the probe fails and the whole network is flagged `PARTIAL_CONNECTIVITY` — even
though Microsoft/other traffic works. (This is separate from the Cisco cert; it's about the
*validation probe*, not TLS trust.)

**Fix** — stop Android using Google for the check:
```
adb shell settings put global captive_portal_detection_enabled 0
adb shell settings put global captive_portal_mode 0
adb shell settings put global private_dns_mode off
```
Automated as `emulator-manager.ps1 -Action network`.
(An emulator on a network where Google *is* reachable, e.g. Pixel_6a earlier, validates on its
own and doesn't need this.)

### 5. Out of memory → app / UiAutomator2 killed, or emulator crash
At 2 GB the guest OOM‑kills the app + UiAutomator2 during the Chrome‑heavy SSO; the host
(≈16 GB, much already used) also can't back a large guest.

**Fix** — run the guest at **3 GB** (`$EmuMemory = 3072` in `emulator-manager.ps1`) and free
host RAM (close spare Chrome/Teams/Word) before launching.

### 6. Black screen / screen sleep
The display sleeps (and the cert PIN locks it), showing a black screen.

**Fix** — `emulator-manager.ps1 -Action screenon` wakes, unlocks (PIN `1234`), and sets
**stay‑awake while plugged in** so it won't sleep again. `-Action screenoff` reverts.

---

## Set up a fresh emulator from scratch
```powershell
# 1) (once) install a modern image + create the AVD
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" "system-images;android-36;google_apis_playstore;x86_64"
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\avdmanager.bat" create avd -n MCD_API36 -k "system-images;android-36;google_apis_playstore;x86_64" -d pixel_6

# 2) boot it clean
powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action coldstart

# 3) apply the fixes
powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action network    # disable Google check
powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action screenon   # wake + stay awake
#    install the MCD app (wdio will also install it on first run):
& "$env:ANDROID_HOME\platform-tools\adb.exe" -s emulator-5554 install -r -g "<path-to>\app-uat-*.apk"
powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action applink    # after app is installed
powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action cert       # then tap through on the emulator

# 4) status
powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action status
```

## Scripts reference
- **`emulator-manager.ps1`** — actions: `start | coldstart | restart | stop | status | center |`
  `keyboard | wipe | applink | cert | screenshot | logcat | list | screenon | screenoff | network`.
- **`run-tests.ps1`** — pick device (wireless phone / emulator) then suite (Android / iOS / Web / API / All).

## Certificates (`certs/`)
- **`Cisco Secure Access Primary SubCA.crt`** — the corporate SSL‑inspection **CA**. This is the
  one to install (trust anchor). It's a *public* certificate (no private key), safe to keep in the repo.
- The other file seen on the old emulator (`Cisco Certificate.crt`) was a **leaf** cert for
  `chatgpt.com` — **not a CA**, don't install it.
