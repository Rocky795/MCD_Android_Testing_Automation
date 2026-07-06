/**
 * Central API config. All values come from environment variables (.env),
 * so no secrets or environment-specific URLs live in code.
 *
 * Mirrors the "Multi tenant MCD Alchemy" folder of the Postman collection:
 *   - Azure AD client-credentials token (login.microsoftonline.com)
 *   - SEA middleware base URL (*.cloudapp.azure.com)
 *   - X-Tenant-ID header + callerClient query param
 */
require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var "${name}". Add it to your .env file (see .env.example).`,
    );
  }
  return value;
}

module.exports = {
  // --- Azure AD (client credentials) ---
  aad: {
    tenantId: required("AAD_TENANT_ID"),
    clientId: required("AAD_CLIENT_ID"),
    clientSecret: required("AAD_CLIENT_SECRET"),
    scope: required("AAD_SCOPE"),
    get tokenUrl() {
      return `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
    },
  },

  // --- SEA middleware API ---
  api: {
    baseUrl: required("API_BASE_URL"), // e.g. https://unisys-sea-shared-test.westus2.cloudapp.azure.com
    tenantId: required("API_TENANT_ID"), // X-Tenant-ID header
    callerClient: process.env.API_CALLER_CLIENT || "epa",
    timeout: Number(process.env.API_TIMEOUT || 30000),
  },
};
