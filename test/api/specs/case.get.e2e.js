/**
 * API tests: GET Case Ticket  (Multi tenant MCD Alchemy)
 *
 * Scope is intentionally limited to the READ (GET) case endpoint.
 * No POST/PUT/PATCH endpoints are exercised.
 *
 * Verified API contract (dev + v1.1):
 *   200  { "result": [ { "caseNumber": "...", ... } ] }   when found
 *   200  { "result": [] }                                  when not found
 *
 * Run: npm run api
 */
const assert = require("assert");
const { getCaseByNumber } = require("../services/case.service");
const caseData = require("../data/case.data");

describe("GET Case Ticket - Multi tenant MCD Alchemy", function () {
  this.timeout(60_000); // token fetch + API round-trip

  it("fetches an existing case by number (200 + populated result)", async () => {
    const res = await getCaseByNumber(caseData.validCaseNumber);
    console.log(`GET case ${caseData.validCaseNumber} -> ${res.status}`);

    assert.strictEqual(
      res.status,
      200,
      `Expected 200 but got ${res.status}. Body: ${JSON.stringify(res.data)}`,
    );
    assert.ok(res.data && Array.isArray(res.data.result), "Body should have a 'result' array");
    assert.ok(res.data.result.length >= 1, "Expected at least one case in 'result'");

    const record = res.data.result[0];
    assert.strictEqual(
      record.caseNumber,
      caseData.validCaseNumber,
      `Returned caseNumber "${record.caseNumber}" should match "${caseData.validCaseNumber}"`,
    );
    console.log(`  caseNumber: ${record.caseNumber} | assignedTo: ${record.caseAssignedTo}`);
    console.log(record)
  });
  

  it("returns JSON content-type for the case response", async () => {
    const res = await getCaseByNumber(caseData.validCaseNumber);
    const contentType = res.headers["content-type"] || "";
    assert.ok(
      contentType.includes("application/json"),
      `Expected JSON content-type, got "${contentType}"`,
    );
  });

  it("returns 200 with an empty result for a non-existent case", async () => {
    // Still a GET (read-only). This API returns 200 + empty result for not-found.
    const res = await getCaseByNumber(caseData.nonExistentCaseNumber);
    console.log(`GET case ${caseData.nonExistentCaseNumber} -> ${res.status} (result length: ${res.data?.result?.length})`);

    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    assert.ok(res.data && Array.isArray(res.data.result), "Body should have a 'result' array");
    assert.strictEqual(
      res.data.result.length,
      0,
      "Expected an empty 'result' for a non-existent case",
    );
  });
});
