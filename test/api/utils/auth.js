/**
 * Azure AD authentication (client-credentials grant).
 *
 * Equivalent to the collection's "Token generator Core Services" request.
 * NOTE: this POST is auth infrastructure (needed to call any GET); it is NOT
 * one of the business POST endpoints, which are intentionally out of scope.
 *
 * The token is cached in-memory and reused until shortly before it expires.
 */
const axios = require("axios");
const config = require("../config/api.config");

let cachedToken = null;
let expiresAtMs = 0;

async function getToken() {
  const now = Date.now();
  // Reuse the cached token until 60s before expiry.
  if (cachedToken && now < expiresAtMs - 60_000) {
    return cachedToken;
  }

  const body = new URLSearchParams({
    client_id: config.aad.clientId,
    client_secret: config.aad.clientSecret,
    grant_type: "client_credentials",
    scope: config.aad.scope,
  });

  const res = await axios.post(config.aad.tokenUrl, body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: config.api.timeout,
  });

  if (!res.data || !res.data.access_token) {
    throw new Error(`Token endpoint did not return an access_token: ${JSON.stringify(res.data)}`);
  }

  cachedToken = res.data.access_token;
  expiresAtMs = now + (Number(res.data.expires_in) || 3600) * 1000;
  return cachedToken;
}

module.exports = { getToken };
