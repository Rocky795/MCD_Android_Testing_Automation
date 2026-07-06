<#
====================================================================
 Emulator Manager  -  MCD project
 --------------------------------------------------------------------
 One-stop control panel for the Android emulator.

 Usage:
   Interactive menu:
     powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1
   Direct action:
     powershell -ExecutionPolicy Bypass -File .\emulator-manager.ps1 -Action coldstart
   Pick a different AVD:
     ... -File .\emulator-manager.ps1 -Avd Pixel_6a

 Actions: start | coldstart | restart | stop | status | center |
          keyboard | wipe | applink | cert | screenshot | logcat |
          list | menu
====================================================================
#>

param(
    [string]$Action = "menu",
    [string]$Avd    = "MCD_API36",
    [int]$Memory    = 3072
)

# NOTE: adb writes normal progress (e.g. "1 file pushed") to stderr, which
# PowerShell 5.1 turns into a NativeCommandError. Under "Stop" that would
# abort the script mid-run, so we use "Continue" and guard real errors explicitly.
$ErrorActionPreference = "Continue"

# --- Config -----------------------------------------------------------------
$Serial        = "emulator-5554"
$AppPackage    = "com.mcd.gsd.archassist"
$AppLinkDomain = "mcdtestmobileapplinks.z6.web.core.windows.net"
# CA cert now lives in the repo (certs/) so the install is self-contained.
# Falls back to the old Downloads location if the repo copy is missing.
$CertSource    = Join-Path $PSScriptRoot "certs\Cisco Secure Access Primary SubCA.crt"
if (-not (Test-Path $CertSource)) { $CertSource = "$env:USERPROFILE\Downloads\Cisco Secure Access Primary SubCA.crt" }
$CertOnDevice  = "/sdcard/Download/CiscoSecureAccess.crt"
$LockPin       = "1234"

$Sdk = $env:ANDROID_HOME
if ([string]::IsNullOrWhiteSpace($Sdk)) { $Sdk = "$env:LOCALAPPDATA\Android\Sdk" }
$Adb        = Join-Path $Sdk "platform-tools\adb.exe"
$Emulator   = Join-Path $Sdk "emulator\emulator.exe"
$AvdConfig  = "$env:USERPROFILE\.android\avd\$Avd.avd\config.ini"

# Launch flags: lean + software GPU (stable on shared/low GPU hosts)
$LaunchFlags = @(
    "-no-boot-anim", "-netfast", "-no-audio",
    "-gpu", "swiftshader_indirect", "-memory", "$Memory"
)

# --- Helpers ----------------------------------------------------------------
function Say($m)  { Write-Host "`n>>> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "    $m" -ForegroundColor Green }
function Warn($m) { Write-Host "    $m" -ForegroundColor Yellow }

function Test-Running {
    $d = & $Adb devices 2>$null
    return $null -ne ($d | Select-String -Pattern "$Serial\s+device")
}

function Wait-Boot {
    Say "Waiting for boot..."
    & $Adb -s $Serial wait-for-device 2>$null
    $booted = ""; $n = 0
    while ($booted.Trim() -ne "1" -and $n -lt 150) {
        Start-Sleep -Seconds 3
        try { $booted = (& $Adb -s $Serial shell getprop sys.boot_completed 2>$null) } catch { $booted = "" }
        $n++
    }
    if ($booted.Trim() -eq "1") { Ok "Booted and ready." } else { Warn "Boot not confirmed in time." }
}

function Start-Emu([switch]$Cold, [switch]$Wipe) {
    if (Test-Running) { Ok "Emulator already running."; return }
    if (-not (Test-Path $Emulator)) { throw "Emulator not found at $Emulator" }
    $args = @("-avd", $Avd) + $LaunchFlags
    if ($Cold) { $args += "-no-snapshot" }        # cold boot, no snapshot save/load
    if ($Wipe) { $args += "-wipe-data" }          # factory reset userdata
    Say ("Launching '$Avd' ({0}{1} {2} MB)..." -f ($(if($Cold){"cold"}else{"quick"}), $(if($Wipe){", WIPE"}else{""}), $Memory))
    Start-Process -FilePath $Emulator -ArgumentList $args
    Wait-Boot
}

function Stop-Emu {
    if (-not (Test-Running)) { Ok "Emulator not running."; return }
    Say "Stopping emulator..."
    & $Adb -s $Serial emu kill 2>$null | Out-Null
    # Wait until the device actually disappears (avoids a restart race where the
    # next launch sees a lingering adb entry and bails as 'already running').
    $n = 0
    while ((Test-Running) -and $n -lt 25) { Start-Sleep -Seconds 1; $n++ }
    Start-Sleep -Seconds 1
    if (Test-Running) { Warn "Emulator still detected after kill; continuing." } else { Ok "Stopped." }
}

function Restart-Emu { Stop-Emu; Start-Emu -Cold }

function Show-Status {
    Say "Status"
    $running = Test-Running
    Write-Host ("    Running        : " + $(if($running){"YES ($Serial)"}else{"no"}))
    if ($running) {
        $boot = (& $Adb -s $Serial shell getprop sys.boot_completed 2>$null).Trim()
        $chrome = (& $Adb -s $Serial shell dumpsys package com.android.chrome 2>$null | Select-String "versionName" | Select-Object -First 1)
        $app = (& $Adb -s $Serial shell pm list packages $AppPackage 2>$null)
        Write-Host ("    Boot completed : " + $(if($boot -eq '1'){"yes"}else{"no"}))
        Write-Host ("    Chrome         : " + ($chrome -replace '.*versionName=',''))
        Write-Host ("    MCD app        : " + $(if($app){"installed"}else{"NOT installed"}))
    }
    $o = Get-CimInstance Win32_OperatingSystem
    Write-Host ("    Host free RAM  : " + [math]::Round($o.FreePhysicalMemory/1024) + " MB / " + [math]::Round($o.TotalVisibleMemorySize/1024) + " MB")
}

function Center-Window {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type @"
using System;
using System.Runtime.InteropServices;
public class EWin {
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L,T,R,B; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool MoveWindow(IntPtr h, int x, int y, int w, int ht, bool repaint);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
}
"@ -ErrorAction SilentlyContinue
    # The emulator window is owned by the qemu-system process - match that FIRST
    # (matching on title text like "Android Emulator" wrongly grabs browser tabs
    # whose title happens to contain those words).
    $p = Get-Process | Where-Object { $_.MainWindowHandle -ne 0 -and $_.ProcessName -match "qemu-system" } | Select-Object -First 1
    if (-not $p) {
        $p = Get-Process | Where-Object {
            $_.MainWindowHandle -ne 0 -and
            $_.ProcessName -notmatch "chrome|msedge|firefox|brave|opera|Code|iexplore" -and
            ($_.MainWindowTitle -match "Android Emulator - " -or $_.MainWindowTitle -match ":5554")
        } | Select-Object -First 1
    }
    if (-not $p) { Warn "Emulator window not found (is it running?)."; return }
    $h = $p.MainWindowHandle
    $r = New-Object EWin+RECT
    [void][EWin]::GetWindowRect($h, [ref]$r)
    $w = $r.R - $r.L; $ht = $r.B - $r.T
    if ($w -le 0 -or $w -gt 3000) { $w = 400 }
    if ($ht -le 0 -or $ht -gt 3000) { $ht = 800 }
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
    $x = [math]::Max(0, [int](($screen.Width  - $w) / 2) + $screen.X)
    $y = [math]::Max(0, [int](($screen.Height - $ht) / 2) + $screen.Y)
    [void][EWin]::ShowWindow($h, 9)      # SW_RESTORE
    [void][EWin]::MoveWindow($h, $x, $y, $w, $ht, $true)
    [void][EWin]::SetForegroundWindow($h)
    Ok "Centered '$($p.MainWindowTitle)' at $x,$y (${w}x${ht})."
}

function Enable-Keyboard {
    # hw.keyboard=yes lets you type into the emulator with your PC keyboard.
    if (-not (Test-Path $AvdConfig)) { Warn "config.ini not found: $AvdConfig"; return }
    $lines = Get-Content $AvdConfig
    $set = @{ "hw.keyboard" = "yes"; "hw.mainKeys" = "no" }   # mainKeys=no => on-screen nav bar
    foreach ($k in $set.Keys) {
        if ($lines -match "^$([regex]::Escape($k))=") {
            $lines = $lines -replace "^$([regex]::Escape($k))=.*", "$k=$($set[$k])"
        } else {
            $lines += "$k=$($set[$k])"
        }
    }
    $lines | Set-Content $AvdConfig -Encoding ASCII
    Ok "Enabled hardware keyboard (hw.keyboard=yes) in config.ini."
    Warn "Restart the emulator (cold start) for this to take effect."
}

function Repair-AppLinks {
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    $installed = & $Adb -s $Serial shell pm list packages $AppPackage 2>$null
    if ([string]::IsNullOrWhiteSpace($installed)) { Warn "App not installed yet."; return }
    Say "Repairing App Links for $AppLinkDomain..."
    & $Adb -s $Serial shell pm verify-app-links --re-verify $AppPackage 2>$null | Out-Null
    & $Adb -s $Serial shell pm set-app-links-user-selection --user 0 --package $AppPackage true $AppLinkDomain 2>$null | Out-Null
    Ok "App Link re-verified and enabled."
}

function Install-Cert {
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    if (-not (Test-Path $CertSource)) { Warn "Cert not found: $CertSource"; return }
    Say "Pushing Cisco CA cert + setting lock PIN..."
    & $Adb -s $Serial push "$CertSource" "$CertOnDevice" 2>$null | Out-Null
    & $Adb -s $Serial shell locksettings set-pin $LockPin 2>$null | Out-Null
    Say "Opening the CA-install dialog on the emulator..."
    & $Adb -s $Serial shell am start -n com.android.certinstaller/.CertInstallerMain -a android.intent.action.VIEW -t application/x-x509-ca-cert -d "file://$CertOnDevice" 2>$null | Out-Null
    Ok "On the emulator: name it -> OK -> PIN $LockPin. (If the dialog didn't open: Settings > Encryption & credentials > Install a certificate > CA certificate > pick CiscoSecureAccess.crt)"
}

function Take-Screenshot {
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    $dir = Join-Path (Get-Location) "ScreenShots"
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }
    $f = Join-Path $dir ("emu_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".png")
    & $Adb -s $Serial exec-out screencap -p > $f
    Ok "Saved: $f"
}

function Tail-Logcat {
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    Say "Live logcat (Ctrl+C to stop)..."
    & $Adb -s $Serial logcat -v time
}

function List-Avds {
    Say "Available AVDs"
    & $Emulator -list-avds 2>$null | ForEach-Object { Write-Host "    $_" }
}

function Screen-On {
    # Wake, unlock (PIN), and keep the screen awake so it never goes black.
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    Say "Waking + unlocking, and setting stay-awake..."
    & $Adb -s $Serial shell input keyevent 224 2>$null            # KEYCODE_WAKEUP
    Start-Sleep -Milliseconds 800
    & $Adb -s $Serial shell input swipe 540 2000 540 700 2>$null  # swipe up to reveal lock
    Start-Sleep -Milliseconds 500
    & $Adb -s $Serial shell input text $LockPin 2>$null           # enter PIN
    & $Adb -s $Serial shell input keyevent 66 2>$null             # ENTER
    & $Adb -s $Serial shell settings put global stay_on_while_plugged_in 3 2>$null  # never sleep while plugged
    & $Adb -s $Serial shell settings put system screen_off_timeout 1800000 2>$null  # 30 min backup
    $w = (& $Adb -s $Serial shell dumpsys power 2>$null | Select-String "mWakefulness=" | Select-Object -First 1)
    Ok ("Screen on + stay-awake enabled. " + ($w -replace '\s',''))
}

function Screen-Off {
    # Allow sleep again and turn the screen off now.
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    Say "Turning screen off (and allowing sleep)..."
    & $Adb -s $Serial shell settings put global stay_on_while_plugged_in 0 2>$null
    & $Adb -s $Serial shell input keyevent 223 2>$null            # KEYCODE_SLEEP
    Ok "Screen off. (Use 'Screen ON' to wake it back up.)"
}

function Fix-Network {
    # Fixes the false "No internet access" warning that appears when a firewall
    # blocks Google (Android probes google endpoints to validate connectivity).
    if (-not (Test-Running)) { Warn "Emulator not running."; return }
    Say "Disabling Google-based connectivity check + private DNS..."
    & $Adb -s $Serial shell settings put global captive_portal_detection_enabled 0 2>$null
    & $Adb -s $Serial shell settings put global captive_portal_mode 0 2>$null
    & $Adb -s $Serial shell settings put global captive_portal_server localhost 2>$null
    & $Adb -s $Serial shell settings put global private_dns_mode off 2>$null
    Say "Re-evaluating network (airplane cycle)..."
    & $Adb -s $Serial shell cmd connectivity airplane-mode enable 2>$null
    Start-Sleep -Seconds 2
    & $Adb -s $Serial shell cmd connectivity airplane-mode disable 2>$null
    Start-Sleep -Seconds 4
    $caps = & $Adb -s $Serial shell dumpsys connectivity 2>$null | Select-String "VALIDATED" | Select-Object -First 1
    if ($caps) { Ok "Network re-validated - 'No internet access' should be gone." }
    else { Warn "Could not confirm VALIDATED; check the emulator wifi icon." }
}

# --- Dispatch ---------------------------------------------------------------
function Do-Action($a) {
    switch ($a.ToLower()) {
        "start"      { Start-Emu }
        "coldstart"  { Start-Emu -Cold }
        "restart"    { Restart-Emu }
        "stop"       { Stop-Emu }
        "status"     { Show-Status }
        "center"     { Center-Window }
        "keyboard"   { Enable-Keyboard }
        "wipe"       { Stop-Emu; Start-Emu -Cold -Wipe }
        "applink"    { Repair-AppLinks }
        "cert"       { Install-Cert }
        "screenshot" { Take-Screenshot }
        "logcat"     { Tail-Logcat }
        "list"       { List-Avds }
        "screenon"   { Screen-On }
        "screenoff"  { Screen-Off }
        "network"    { Fix-Network }
        default      { Warn "Unknown action: $a" }
    }
}

if ($Action -ne "menu") { Do-Action $Action; return }

# --- Interactive menu -------------------------------------------------------
while ($true) {
    Write-Host "`n==================================================" -ForegroundColor Magenta
    Write-Host "     EMULATOR MANAGER   (AVD: $Avd, ${Memory}MB)"     -ForegroundColor Magenta
    Write-Host "==================================================" -ForegroundColor Magenta
    Write-Host "  1) Start (quick / snapshot)"
    Write-Host "  2) Cold start (clean boot)"
    Write-Host "  3) Restart (kill + cold boot)"
    Write-Host "  4) Stop"
    Write-Host "  5) Status"
    Write-Host "  6) Center window on screen"
    Write-Host "  7) Enable PC keyboard input (config)"
    Write-Host "  8) Wipe data + cold start (factory reset)"
    Write-Host "  9) Repair App Links (MFA SSO fix)"
    Write-Host " 10) Install Cisco CA certificate"
    Write-Host " 11) Screenshot"
    Write-Host " 12) Live logcat"
    Write-Host " 13) List AVDs"
    Write-Host " 14) Screen ON  (wake, unlock, stay awake)"
    Write-Host " 15) Screen OFF (sleep, allow sleep)"
    Write-Host " 16) Fix 'No internet access' (disable Google check)"
    Write-Host "  Q) Quit"
    $c = Read-Host "`nChoose"
    switch ($c.ToUpper()) {
        "1"  { Start-Emu }
        "2"  { Start-Emu -Cold }
        "3"  { Restart-Emu }
        "4"  { Stop-Emu }
        "5"  { Show-Status }
        "6"  { Center-Window }
        "7"  { Enable-Keyboard }
        "8"  { Stop-Emu; Start-Emu -Cold -Wipe }
        "9"  { Repair-AppLinks }
        "10" { Install-Cert }
        "11" { Take-Screenshot }
        "12" { Tail-Logcat }
        "13" { List-Avds }
        "14" { Screen-On }
        "15" { Screen-Off }
        "16" { Fix-Network }
        "Q"  { break }
        default { Warn "Unknown option '$c'." }
    }
}
