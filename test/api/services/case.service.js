/**
 * Case endpoint wrapper (like a page object, but for the API).
 *
 * Scope: GET only (read). Mirrors the Alchemy folder's
 * "Query Single Case Ticket":
 *   GET {base}/v1.1/servicenow/case/{caseNumber}?callerClient={caller}
 */
const { apiClient } = require("../utils/client");
const config = require("../config/api.config");

/**
 * Fetch a single case ticket by its number (e.g. "RC0004977").
 * @param {string} caseNumber
 * @param {string} [callerClient] genesys | mobapp | epa
 * @returns {Promise<import('axios').AxiosResponse>}
 */
async function getCaseByNumber(caseNumber, callerClient = config.api.callerClient) {
  const client = await apiClient();
  return client.get(`/v1.1/servicenow/case/${encodeURIComponent(caseNumber)}`, {
    params: { callerClient },
  });
}

module.exports = { getCaseByNumber };
