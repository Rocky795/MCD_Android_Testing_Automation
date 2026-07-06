/**
 * Test data for the case GET tests.
 * The known-good case number comes from .env so it can vary per environment.
 */
require("dotenv").config();

module.exports = {
  // A case that should exist in the target environment.
  validCaseNumber: process.env.TEST_CASE_NUMBER || "RC0004977",

  // A well-formed but almost-certainly-nonexistent case, for the negative check.
  nonExistentCaseNumber: process.env.TEST_CASE_NUMBER_NOT_FOUND || "RC9999999",
};
