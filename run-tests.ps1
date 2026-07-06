<#
====================================================================
 MCD Test Runner
 --------------------------------------------------------------------
 FIRST SCREEN:
   [1] FULL framework run  - Android + Web + API, then build & open the
                             Allure report (covers all three).
   [2] Custom run          - pick a device + one suite; optionally build
                             & open the Allure report at the end.

 Usage:
   powershell -ExecutionPolicy Bypass -File .\run-tests.ps1

 Notes:
   - Emulator control is delegated to .\emulator-manager.ps1 (-Action ...).
   - Android needs a device (wireless phone or emulator); Web/API don't.
   - iOS requires macOS + Xcode/Simulator (not runnable on Windows).
====================================================================
#>

# adb/npx write progress to stderr; "Continue" avoids PS 5.1 aborting on that.
$ErrorActionPreference = "Continue"

# --- Config -----------------------------------------------------------------
$Sdk = $env:ANDROID_HOME
if ([string]::IsNullOrWhiteSpace($Sdk)) { $Sdk = "$env:LOCALAPPDATA\Android\Sdk" }
$Adb       = Join-Path $Sdk "platform-tools\adb.exe"
$EmuSerial = "emulator-5554"
$Manager   = Join-Path $PSScriptRoot "emulator-manager.ps1"

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
$WebSpecs = @("./test/specs/web/SN_case.e2e.js")

# --- Helpers ----------------------------------------------------------------
function Say($m)  { Write-Host "`n>>> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    $m" -ForegroundColor Green }
function Warn($m) { Write-Host "    $m" -ForegroundColor Yellow }

function Get-ConnectedSerials {
    $out = & $Adb devices 2>$null
    $serials = @()
    foreach ($line in $out) { if ($line -match '^(\S+)\s+device$') { $serials += $matches[1] } }
    return $serials
}
function Get-PhysicalSerial {
    foreach ($s in (Get-ConnectedSerials)) { if ($s -notmatch '^emulator-') { return $s } }
    return $null
}

function Select-Phone {
    Say "Looking for a connected wireless/USB phone..."
    $serial = Get-PhysicalSerial
    if (-not $serial) {
        Warn "No physical device detected."
        $addr = Read-Host "    Enter phone IP:PORT from Wireless debugging (e.g. 10.96.2.255:5555), or blank to cancel"
        if (![string]::IsNullOrWhiteSpace($addr)) {
            & $Adb connect $addr | Out-Host; Start-Sleep -Seconds 2; $serial = Get-PhysicalSerial
        }
    }
    if ($serial) { Ok "Using phone: $serial" } else { Warn "Could not connect to a phone." }
    return $serial
}

function Select-Emulator {
    Write-Host ""
    Write-Host "  Emulator options:" -ForegroundColor Magenta
    Write-Host "   [1] Use current (already running)"
    Write-Host "   [2] Start (quick / snapshot)"
    Write-Host "   [3] Cold start (clean boot)"
    Write-Host "   [4] Restart (kill + cold boot)"
    Write-Host "   [5] Wipe data + start (factory reset)"
    $e = Read-Host "  Choose emulator option"
    switch ($e) {
        "1" { Ok "Using currently running emulator." }
        "2" { & $Manager -Action start }
        "3" { & $Manager -Action coldstart }
        "4" { & $Manager -Action restart }
        "5" { & $Manager -Action wipe }
        default { Warn "Unknown option - assuming current emulator." }
    }
    # SSO-prep fixes (network / screen / app-link) - persist until a wipe, so
    # default to skipping. Run manually: emulator-manager.ps1 -Action network|screenon|applink
    # $doFix = Read-Host "  Apply SSO-prep fixes now (network/screen/app-link)? [y/N]"
    # if ($doFix -match '^(y|yes)$') {
    #     & $Manager -Action network   | Out-Host
    #     & $Manager -Action screenon  | Out-Host
    #     & $Manager -Action applink   | Out-Host
    # } else {
    #     Ok "Skipped SSO-prep fixes."
    # }
    return $EmuSerial
}

function Choose-Device {
    Write-Host ""
    Write-Host "Choose Android target device:" -ForegroundColor Magenta
    Write-Host "  [1] Wireless real phone"
    Write-Host "  [2] Emulator (all emulator options)"
    Write-Host "  [S] Skip (no Android device / Web+API only)"
    $c = Read-Host "Choose"
    switch ($c.ToUpper()) {
        "1"     { return (Select-Phone) }
        "2"     { return (Select-Emulator) }
        "S"     { Ok "No Android device selected."; return $null }
        default { Warn "Unknown option - no device selected."; return $null }
    }
}

function Invoke-Wdio($label, $specs) {
    Say "Running $label suite..."
    $wdioArgs = @("wdio", "run", "wdio.conf.js")
    foreach ($s in $specs) { $wdioArgs += @("--spec", $s) }
    & npx @wdioArgs
}

function Run-Android($serial) {
    if (-not $serial) { Warn "No Android device - skipping Android suite."; return }
    $env:APPIUM_UDID = $serial      # wdio.conf targets this exact device
    Say "Android target device: $serial"
    Invoke-Wdio "Android" $MobileSpecs
}
function Run-Web { Invoke-Wdio "Web" $WebSpecs }
function Run-Api {
    Say "Running API suite (results -> Allure)..."
    & npm run api:allure
}
function Run-iOS {
    Say "iOS suite"
    Warn "iOS needs macOS + Xcode/Simulator + iOS caps in wdio.conf - not runnable on Windows. Skipped."
}

function Clear-AllureData {
    Say "Disabled: Clearing old Allure results/reports for a clean report..."
    # Remove-Item -Recurse -Force allure-results, allure-report -ErrorAction SilentlyContinue
}

function Open-AllureReport {
    $results = Get-ChildItem "allure-results" -Filter *-result.json -ErrorAction SilentlyContinue
    if (-not $results) { Warn "No Allure results found - nothing to report."; return }
    $ts  = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
    $out = "allure-report/run-$ts"
    Say "Generating Allure report ($($results.Count) results) -> $out"
    & npx allure generate allure-results --clean -o $out
    Say "Opening Allure report... (close the browser / Ctrl+C in this window to stop the server)"
    & npx allure open $out
}

# ============================ FIRST SCREEN ==================================
Write-Host "==================================================" -ForegroundColor Magenta
Write-Host "            MCD  TEST  RUNNER" -ForegroundColor Magenta
Write-Host "==================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  [1] FULL run       - Android + Web + API, then open Allure report"
Write-Host "  [2] Android + API  - (no Web), then open Allure report"
Write-Host "  [3] Custom run     - pick device + one suite (Allure optional at end)"
Write-Host "  [Q] Quit"
$main = Read-Host "Choose"

switch ($main.ToUpper()) {

    "1" {
        # ---------- FULL framework run + Allure ----------
        Say "FULL framework run: Android + Web + API + Allure report"
        Clear-AllureData
        $target = Choose-Device
        Run-Android $target
        Run-Web
        Run-Api
        Open-AllureReport
    }

    "2" {
        # ---------- Android + API (no Web) + Allure ----------
        Say "Android + API run (no Web) + Allure report"
        Clear-AllureData
        $target = Choose-Device
        Run-Android $target
        Run-Api
        Open-AllureReport
    }

    "3" {
        # ---------- Custom run ----------
        $target = Choose-Device
        Write-Host ""
        Write-Host "Choose suite to run:" -ForegroundColor Magenta
        Write-Host "  [1] Android suite (on the device above)"
        Write-Host "  [2] iOS suite"
        Write-Host "  [3] Web suite"
        Write-Host "  [4] API suite"
        Write-Host "  [5] ALL (Android + Web + API)"
        Write-Host "  [Q] Quit"
        $suite = Read-Host "Choose"
        switch ($suite.ToUpper()) {
            "1" { Run-Android $target }
            "2" { Run-iOS }
            "3" { Run-Web }
            "4" { Run-Api }
            "5" { Run-Android $target; Run-Web; Run-Api; Run-iOS }
            "Q" { Write-Host "Bye!" -ForegroundColor Yellow; return }
            default { Warn "Unknown option '$suite'. Nothing to run."; return }
        }
        # Allure at the end (optional)
        $rep = Read-Host "`nGenerate & open the Allure report now? [y/N]"
        if ($rep -match '^(y|yes)$') { Open-AllureReport }
        else { Ok "Skipped Allure report. (Open the latest anytime: npm run report:open)" }
    }

    "Q" { Write-Host "Bye!" -ForegroundColor Yellow; return }
    default { Warn "Unknown option '$main'. Nothing to run." }
}

Write-Host "`n==================================================" -ForegroundColor Magenta
Write-Host " Done." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Magenta
