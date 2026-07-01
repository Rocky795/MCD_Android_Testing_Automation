<#
====================================================================
 MCD Test Runner
 --------------------------------------------------------------------
 One-stop launcher for the MCD automation suite.

 Usage:
   Right-click > Run with PowerShell,  OR from a terminal:
     powershell -ExecutionPolicy Bypass -File .\run-tests.ps1

 It will:
   1. Show a menu:  [1] Android (all)  [2] Web  [3] Both
   2. For Android/Both -> start the Pixel_6a emulator if it isn't
      already running, wait for it to finish booting, then run tests.
   3. For Web -> run the Chrome specs (no emulator needed).
====================================================================
#>

$ErrorActionPreference = "Stop"

# --- Config -----------------------------------------------------------------
$AvdName   = "Pixel_6a"
$EmuMemory = 3072                 # 3 GB: needed for the Chrome-based SSO flow (app + Chrome + UiAutomator2)
$Sdk       = $env:ANDROID_HOME
if ([string]::IsNullOrWhiteSpace($Sdk)) { $Sdk = "$env:LOCALAPPDATA\Android\Sdk" }
$EmulatorExe = Join-Path $Sdk "emulator\emulator.exe"
$AdbExe      = Join-Path $Sdk "platform-tools\adb.exe"

# App Links repair (fixes "Sign-in was interrupted" after MFA on the emulator).
# The MSAL auth redirect returns to the app via this verified https App Link;
# on emulators the domain often lands in "legacy_failure" so Chrome keeps the
# page instead of handing back to the app. We re-verify + enable it below.
$AppPackage    = "com.mcd.gsd.archassist"
$AppLinkDomain = "mcdtestmobileapplinks.z6.web.core.windows.net"

# All mobile (Android) specs, in run order
$MobileSpecs = @(
    "./test/specs/0_login.e2e.js",
    "./test/specs/1_profile.e2e.js",
    "./test/specs/3_manualCase.e2e.js",
    "./test/specs/4_chat.e2e.js",
    "./test/specs/5_case.e2e.js",
    "./test/specs/6_contact.e2e.js",
    "./test/specs/7_announcement.e2e.js",
    "./test/specs/999_logout.e2e.js"
)

# Web spec(s)
$WebSpecs = @(
    "./test/specs/web/SN_case.e2e.js"
)

# --- Helpers ----------------------------------------------------------------
function Write-Step($msg) { Write-Host "`n>>> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "    $msg" -ForegroundColor Green }
function Write-Warn($msg)  { Write-Host "    $msg" -ForegroundColor Yellow }

function Test-EmulatorRunning {
    $devices = & $AdbExe devices 2>$null
    return $null -ne ($devices | Select-String -Pattern "emulator-\d+\s+device")
}

function Start-Emulator {
    if (Test-EmulatorRunning) {
        Write-Ok "Emulator already running - skipping launch."
        return
    }

    if (-not (Test-Path $EmulatorExe)) {
        throw "Emulator not found at $EmulatorExe. Check ANDROID_HOME."
    }

    Write-Step "Starting emulator '$AvdName' (lightweight mode)..."
    # Launch detached so this script can keep going.
    Start-Process -FilePath $EmulatorExe -ArgumentList @(
        "-avd", $AvdName,
        "-no-snapshot-save",
        "-no-boot-anim",
        "-netfast",
        "-no-audio",
        "-gpu", "swiftshader_indirect",
        "-memory", "$EmuMemory"
    )

    Write-Step "Waiting for device to connect..."
    & $AdbExe wait-for-device

    Write-Step "Waiting for Android to finish booting (this can take a couple of minutes)..."
    $booted = ""
    $tries  = 0
    while ($booted.Trim() -ne "1" -and $tries -lt 120) {
        Start-Sleep -Seconds 3
        try { $booted = (& $AdbExe shell getprop sys.boot_completed) 2>$null } catch { $booted = "" }
        $tries++
    }

    if ($booted.Trim() -eq "1") {
        Write-Ok "Emulator booted and ready."
    } else {
        throw "Emulator did not finish booting in time. Try launching it manually."
    }
}

function Repair-AppLinks {
    # Ensures the MSAL redirect App Link hands back to the app after MFA,
    # instead of getting stuck on the browser with "Sign-in was interrupted".
    # Skips quietly if the app isn't installed yet.
    $installed = & $AdbExe shell pm list packages $AppPackage 2>$null
    if ([string]::IsNullOrWhiteSpace($installed)) {
        Write-Warn "App '$AppPackage' not installed yet - skipping App Links repair."
        return
    }

    Write-Step "Repairing App Links for '$AppLinkDomain'..."
    & $AdbExe shell pm verify-app-links --re-verify $AppPackage 2>$null | Out-Null
    & $AdbExe shell pm set-app-links-user-selection --user 0 --package $AppPackage true $AppLinkDomain 2>$null | Out-Null

    $state = & $AdbExe shell pm get-app-links --user 0 $AppPackage 2>$null
    if ($state -match "verified" -and $state -match "Enabled") {
        Write-Ok "App Link verified and enabled - MFA redirect should return to the app."
    } else {
        Write-Warn "App Link may not be fully enabled. If MFA still interrupts, re-run or check 'adb shell pm get-app-links $AppPackage'."
    }
}

function Invoke-Suite($label, $specs) {
    Write-Step "Running $label tests..."
    Write-Host "    Specs: $($specs -join ', ')" -ForegroundColor DarkGray

    # Build args with a separate --spec flag per file.
    # (wdio does NOT split a single comma-joined --spec value.)
    $wdioArgs = @("wdio", "run", "wdio.conf.js")
    foreach ($s in $specs) { $wdioArgs += @("--spec", $s) }

    & npx @wdioArgs
}

# --- Menu -------------------------------------------------------------------
Write-Host "==================================================" -ForegroundColor Magenta
Write-Host "            MCD  TEST  RUNNER" -ForegroundColor Magenta
Write-Host "==================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  [1] Android  - run ALL mobile specs (starts emulator)"
Write-Host "  [2] Web      - run the web/Chrome specs"
Write-Host "  [3] Both     - Android first, then Web"
Write-Host "  [Q] Quit"
Write-Host ""

$choice = Read-Host "Choose an option"

switch ($choice.ToUpper()) {
    "1" {
        Start-Emulator
        Repair-AppLinks
        Invoke-Suite "Android (all)" $MobileSpecs
    }
    "2" {
        Invoke-Suite "Web" $WebSpecs
    }
    "3" {
        Start-Emulator
        Repair-AppLinks
        Invoke-Suite "Android (all)" $MobileSpecs
        Invoke-Suite "Web" $WebSpecs
    }
    "Q" {
        Write-Host "Bye!" -ForegroundColor Yellow
        return
    }
    default {
        Write-Warn "Unknown option '$choice'. Nothing to run."
        return
    }
}

Write-Host "`n==================================================" -ForegroundColor Magenta
Write-Host " Done. Open the latest report with:  npm run report:open" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Magenta
