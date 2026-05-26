const natural = require('natural');
const similarity = require('string-similarity');

class ChatbotResponseValidator {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  /**
   * Extract and normalize keywords from text
   */
  extractKeywords(text, keywords) {
    const normalized = text.toLowerCase();
    const found = [];
    const missing = [];

    keywords.forEach(keyword => {
      if (normalized.includes(keyword.toLowerCase())) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    return { found, missing };
  }

  /**
   * Semantic similarity comparison (0-1 scale)
   */
  compareResponses(actualResponse, expectedResponse) {
    // Remove extra whitespace and normalize
    const actual = actualResponse.replace(/\s+/g, ' ').trim();
    const expected = expectedResponse.replace(/\s+/g, ' ').trim();

    // Calculate similarity score
    const score = similarity.compareTwoStrings(actual, expected);
    return {
      score,
      isMatch: score >= 0.7, // 70% threshold
      similarity: `${(score * 100).toFixed(2)}%`
    };
  }

  /**
   * Validate response structure has required sections
   */
  validateStructure(response, requiredSections) {
    const structure = {
      hasIntroduction: false,
      hasSteps: false,
      hasAdditionalInfo: false,
      hasReferences: false,
      hasImages: false,
      missingSections: []
    };

    const lowerResponse = response.toLowerCase();

    // Check for introduction (first meaningful paragraph)
    structure.hasIntroduction = /^[a-z].*?[.!?]/i.test(response);

    // Check for numbered steps
    structure.hasSteps = /\d+\.\s+/g.test(response);

    // Check for additional information markers
    structure.hasAdditionalInfo = 
      lowerResponse.includes('if you') || 
      lowerResponse.includes('additionally') ||
      lowerResponse.includes('note:');

    // Check for references (KB articles or footnotes)
    structure.hasReferences = /\[.+\]/g.test(response) || /KB\d+/g.test(response);

    // Check for image indicators
    structure.hasImages = /\[image\]/i.test(response) || /image/i.test(response);

    // Identify missing sections
    requiredSections.forEach(section => {
      const hasSection = structure[`has${section}`];
      if (!hasSection) {
        structure.missingSections.push(section);
      }
    });

    return structure;
  }

  /**
   * Extract and validate step sequence
   */
  extractAndValidateSteps(response) {
    const stepRegex = /(\d+)\.\s+([^\n]+(?:\n(?!\d+\.)[^\n]*)*)/g;
    const steps = [];
    let match;

    while ((match = stepRegex.exec(response)) !== null) {
      steps.push({
        number: parseInt(match[1]),
        text: match[2].trim()
      });
    }

    // Validate step numbering is sequential
    const isSequential = steps.every((step, index) => step.number === index + 1);

    return {
      steps,
      count: steps.length,
      isSequential,
      stepTexts: steps.map(s => s.text)
    };
  }

  /**
   * Extract KB references
   */
  extractReferences(response) {
    const kbRegex = /KB\d+/g;
    const footnotesRegex = /\[\d+\]:\s+(.+)/g;
    const linkRegex = /\[(.+?)\]\((.+?)\)/g;

    const kbArticles = response.match(kbRegex) || [];
    const footnotes = [];
    const links = [];

    let match;
    while ((match = linkRegex.exec(response)) !== null) {
      links.push({ text: match[1], url: match[2] });
    }

    return {
      kbArticles: [...new Set(kbArticles)],
      footnotes,
      links,
      hasReferences: kbArticles.length > 0 || links.length > 0
    };
  }

  /**
   * Comprehensive validation report
   */
  validate(actualResponse, expectedConfig) {
    return {
      keywordValidation: this.extractKeywords(
        actualResponse, 
        expectedConfig.requiredKeywords
      ),
      structureValidation: this.validateStructure(
        actualResponse,
        expectedConfig.requiredSections || ['Introduction', 'Steps', 'References']
      ),
      stepValidation: this.extractAndValidateSteps(actualResponse),
      referenceValidation: this.extractReferences(actualResponse),
      semanticScore: this.compareResponses(
        actualResponse,
        expectedConfig.baselineResponse
      ),
      timestamp: new Date().toISOString(),
      isValid: this.isResponseValid(actualResponse, expectedConfig)
    };
  }

  /**
   * Determine if response is valid
   */
  isResponseValid(response, config) {
    const validation = this.validate(response, config);
    
    return {
      keywordsPresent: validation.keywordValidation.missing.length === 0,
      structureValid: validation.structureValidation.missingSections.length === 0,
      stepsValid: validation.stepValidation.isSequential,
      referencesPresent: validation.referenceValidation.hasReferences,
      semanticMatch: validation.semanticScore.isMatch,
      overallValid: 
        validation.keywordValidation.missing.length === 0 &&
        validation.stepValidation.isSequential &&
        validation.referenceValidation.hasReferences,
      details: validation
    };
  }
}

module.exports = ChatbotResponseValidator;