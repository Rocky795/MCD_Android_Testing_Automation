/**
 * Custom Assertion Helpers for Chatbot Response Testing
 */

class ChatbotAssertions {
  /**
   * Assert that response contains all required keywords
   */
  static assertKeywordsPresent(response, requiredKeywords, options = {}) {
    const { caseSensitive = false } = options;
    const actualResponse = typeof response === "string" ? response : String(response || "");
    const text = caseSensitive ? actualResponse : actualResponse.toLowerCase();
    const keywords = caseSensitive
      ? requiredKeywords
      : requiredKeywords.map((k) => k.toLowerCase());

    const missing = keywords.filter((keyword) => !text.includes(keyword));

    if (missing.length > 0) {
      throw new Error(`Missing required keywords: ${missing.join(", ")}`);
    }

    return {
      passed: true,
      message: `All ${keywords.length} required keywords present`,
      keywords: keywords,
    };
  }

  /**
   * Assert response has required structure
   */
  static assertStructure(response, requiredSections) {
    const structure = {
      hasIntro: /^[a-z].+?[.!?]/i.test(response),
      hasSteps: /\d+\.\s+/g.test(response),
      hasReferences: /\[.+\]|KB\d+/g.test(response),
    };

    const missing = requiredSections.filter(
      (section) => !structure[`has${section}`],
    );

    if (missing.length > 0) {
      throw new Error(`Missing required sections: ${missing.join(", ")}`);
    }

    return {
      passed: true,
      message: `All required sections present`,
      structure,
    };
  }

  /**
   * Assert steps are properly numbered and sequential
   */
  static assertStepsSequential(response) {
    const stepRegex = /(\d+)\.\s+/g;
    const matches = [];
    let match;

    while ((match = stepRegex.exec(response)) !== null) {
      matches.push(parseInt(match[1]));
    }

    if (matches.length === 0) {
      throw new Error("No numbered steps found in response");
    }

    const isSequential = matches.every((num, idx) => num === idx + 1);

    if (!isSequential) {
      throw new Error(`Steps not sequential. Found: ${matches.join(", ")}`);
    }

    return {
      passed: true,
      message: `Steps are properly sequential (${matches.length} steps found)`,
      steps: matches,
      stepCount: matches.length,
    };
  }

  /**
   * Assert minimum number of steps
   */
  static assertMinimumSteps(response, minSteps) {
    const stepRegex = /\d+\.\s+/g;
    const stepCount = (response.match(stepRegex) || []).length;

    if (stepCount < minSteps) {
      throw new Error(
        `Expected at least ${minSteps} steps, but found ${stepCount}`,
      );
    }

    return {
      passed: true,
      message: `Step count (${stepCount}) meets minimum requirement (${minSteps})`,
      stepCount,
    };
  }

  /**
   * Assert references are present
   */
  static assertReferencesPresent(response, expectedReferences) {
    const kbRegex = /KB\d+/g;
    const linkRegex = /\[(.+?)\]\((.+?)\)/g;

    const foundKB = response.match(kbRegex) || [];
    const foundLinks = [];

    let match;
    while ((match = linkRegex.exec(response)) !== null) {
      foundLinks.push({ text: match[1], url: match[2] });
    }

    const missingKB = expectedReferences.filter(
      (ref) => !foundKB.includes(ref),
    );

    if (missingKB.length > 0) {
      throw new Error(
        `Missing expected KB references: ${missingKB.join(", ")}`,
      );
    }

    return {
      passed: true,
      message: `All expected references present`,
      foundKB: [...new Set(foundKB)],
      foundLinks: foundLinks.length,
      expectedKB: expectedReferences,
    };
  }

  /**
   * Assert semantic similarity with baseline
   */
  static assertSemanticSimilarity(
    actualResponse,
    baselineResponse,
    minSimilarity = 0.7,
  ) {
    const similarity = require("string-similarity");
    const score = similarity.compareTwoStrings(
      actualResponse,
      baselineResponse,
    );

    if (score < minSimilarity) {
      throw new Error(
        `Semantic similarity ${(score * 100).toFixed(2)}% is below minimum ${(minSimilarity * 100).toFixed(2)}%`,
      );
    }

    return {
      passed: true,
      message: `Semantic similarity ${(score * 100).toFixed(2)}% meets minimum`,
      score: `${(score * 100).toFixed(2)}%`,
      minRequired: `${(minSimilarity * 100).toFixed(2)}%`,
    };
  }

  /**
   * Assert response contains no critical errors
   */
  static assertNoErrors(response) {
    const errorPatterns = [
      /error/i,
      /failed/i,
      /unable to/i,
      /could not/i,
      /exception/i,
      /null/i,
      /undefined/i,
    ];

    const foundErrors = errorPatterns.filter((pattern) =>
      pattern.test(response),
    );

    if (foundErrors.length > 0) {
      throw new Error(`Response contains error indicators`);
    }

    return {
      passed: true,
      message: `No error indicators found in response`,
    };
  }

  /**
   * Assert response length is acceptable
   */
  static assertResponseLength(response, minLength = 100, maxLength = 5000) {
    const length = response.length;

    if (length < minLength) {
      throw new Error(
        `Response too short: ${length} characters (minimum: ${minLength})`,
      );
    }

    if (length > maxLength) {
      throw new Error(
        `Response too long: ${length} characters (maximum: ${maxLength})`,
      );
    }

    return {
      passed: true,
      message: `Response length (${length} chars) is acceptable`,
      length,
      minLength,
      maxLength,
    };
  }

  /**
   * Assert response contains at least one image or URL reference
   */
  static assertImagesPresent(response) {
    const imageRegex = /https?:\/\/[^\s)]+/g;
    const images = response.match(imageRegex) || [];

    if (images.length === 0) {
      throw new Error("No image or URL references found in response");
    }

    return {
      passed: true,
      message: `Found ${images.length} image/link references`,
      images,
    };
  }

  /**
   * Assert response does not contain negative fallback phrases
   */
  static assertNoNegativePhrases(
    response,
    negativePhrases = ["I don't know", "cannot help", "error"],
  ) {
    const found = negativePhrases.filter((phrase) => response.includes(phrase));

    if (found.length > 0) {
      throw new Error(`Negative phrases found: ${found.join(", ")}`);
    }

    return {
      passed: true,
      message: "No negative phrases found in response",
    };
  }

  /**
   * Assert response matches the Dynamic UDP AI validation requirements
   */
  static assertDynamicUDPResponse(response, config = {}) {
    const {
      requiredKeywords = [
        "LIFELENZ",
        "Kiosk Mode",
        "Manager",
        "MFA",
        "Authenticator",
      ],
      expectedReferences = ["KB0014741", "KB0015011", "KB0020448"],
      minLength = 300,
      requiredSections = ["Intro", "Steps", "References"],
      negativePhrases = ["I don't know", "cannot help", "error", "sorry"],
    } = config;

    this.assertKeywordsPresent(response, requiredKeywords);
    // this.assertStructure(response, requiredSections);
    // this.assertStepsSequential(response);
    this.assertResponseLength(response, minLength);
    this.assertImagesPresent(response);
    this.assertReferencesPresent(response, expectedReferences);
    this.assertNoNegativePhrases(response, negativePhrases);

    return {
      passed: true,
      message: "Dynamic UDP AI response validation passed",
    };
  }

  /**
   * Assert all sections have content
   */
  static assertSectionContent(response, sections) {
    const sectionRegex = new Map();
    sections.forEach((section) => {
      sectionRegex.set(section.name, section.pattern);
    });

    const results = {};
    let allValid = true;

    sectionRegex.forEach((pattern, sectionName) => {
      const found = pattern.test(response);
      results[sectionName] = found;
      if (!found) allValid = false;
    });

    if (!allValid) {
      const missing = Object.entries(results)
        .filter(([, found]) => !found)
        .map(([name]) => name);
      throw new Error(`Missing content sections: ${missing.join(", ")}`);
    }

    return {
      passed: true,
      message: `All section content present`,
      sections: results,
    };
  }
}

module.exports = ChatbotAssertions;
