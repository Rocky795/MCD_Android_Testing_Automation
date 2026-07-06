/**
 * Builds a preconfigured axios instance for the SEA middleware:
 *   - Bearer token (fetched/cached via auth.js)
 *   - X-Tenant-ID header
 *   - base URL + timeout from config
 *
 * validateStatus is disabled so tests can assert on any status code
 * (200/4xx/5xx) instead of axios throwing.
 */
const axios = require("axios");
const { getToken } = require("./auth");
const config = require("../config/api.config");

async function apiClient() {
  const token = await getToken();
  return axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Tenant-ID": config.api.tenantId,
      Accept: "application/json",
    },
    validateStatus: () => true,
  });
}

module.exports = { apiClient };
