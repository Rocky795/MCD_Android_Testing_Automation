# certs/

Certificates needed for the Android emulator to work on the corporate network.

## `Cisco Secure Access Primary SubCA.crt`
The corporate **Cisco Secure Access** SSL‑inspection **CA** (intermediate).
The network re‑signs HTTPS with this CA, so the emulator must **trust it** or TLS fails
("Sign‑in was interrupted" / broken pages).

- It's a **public certificate** (no private key) → safe to keep in the repo.
- Install it with: `powershell -ExecutionPolicy Bypass -File ..\emulator-manager.ps1 -Action cert`
  (pushes it, sets PIN `1234`, opens the install dialog → tap **CA certificate → OK → PIN**).

Full context and the other emulator fixes: see [`../docs/EMULATOR-SETUP.md`](../docs/EMULATOR-SETUP.md).
