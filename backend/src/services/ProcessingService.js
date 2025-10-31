/**
 * ProcessingService.js
 *
 * Analyzes tea processing methods and their impacts
 * Extracted from: js/calculators/ProcessingCalculator.js
 *
 * Input: TeaModel with processing.methods and processing.oxidationLevel
 * Output: Processing analysis with methods, roast level, and characteristics
 */

// --- Helper Functions ---

function determineRoastLevel(methods) {
  if (!Array.isArray(methods)) return 'Unknown';
  const methodStr = methods.join(' ').toLowerCase();
  if (methodStr.includes('charcoal')) return 'Charcoal';
  if (methodStr.includes('heavy-roast')) return 'Heavy';
  if (methodStr.includes('medium-roast')) return 'Medium';
  if (methodStr.includes('light-roast')) return 'Light';
  if (methodStr.includes('minimal-roast')) return 'Minimal';
  if (methodStr.includes('roast')) return 'Unknown Roast';
  return 'None';
}

// --- ProcessingService ---

export class ProcessingService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea processing
   *
   * @param {TeaModel} teaModel - Normalized tea model
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(teaModel) {
    return this.infer(teaModel);
  }

  /**
   * Perform processing analysis
   *
   * @param {TeaModel} teaModel - Tea to analyze
   * @returns {Object} Analysis result
   */
  infer(teaModel) {
    // Extract processing information
    const processingMethods = teaModel?.processing?.methods || [];
    const oxidationLevel = teaModel?.processing?.oxidationLevel || 0;

    // Handle no processing data
    if (processingMethods.length === 0 && oxidationLevel === 0) {
      return {
        description: 'No processing data available.',
        methods: [],
        oxidationLevel: 0,
        roastLevel: 'Unknown',
        characteristics: {
          flavorImpact: [],
          bodyImpact: 'Unchanged',
          energeticTendency: 'Neutral',
          temperatureTendency: 'Neutral'
        }
      };
    }

    // Determine roast level
    const roastLevel = determineRoastLevel(processingMethods);

    // Categorize oxidation level
    const oxidationCategory = this.categorizeOxidationLevel(oxidationLevel);

    // Analyze impacts
    const characteristics = this.analyzeProcessingImpacts(processingMethods, oxidationLevel);

    // Generate description
    const description = this.generateProcessingDescription(
      processingMethods,
      oxidationLevel,
      roastLevel
    );

    return {
      description,
      methods: processingMethods,
      oxidationLevel,
      oxidationCategory,
      roastLevel,
      characteristics
    };
  }

  /**
   * Categorize oxidation level
   *
   * @private
   */
  categorizeOxidationLevel(level) {
    if (level < 0) return 'Unknown';
    if (level === 0) return 'None (0%)';
    if (level <= 15) return 'Minimal (0-15%)';
    if (level <= 30) return 'Light (15-30%)';
    if (level <= 50) return 'Moderate (30-50%)';
    if (level <= 80) return 'High (50-80%)';
    return 'Full (80-100%)';
  }

  /**
   * Analyze impacts of processing methods
   *
   * @private
   */
  analyzeProcessingImpacts(methods, oxidationLevel) {
    const characteristics = {
      flavorImpact: [],
      bodyImpact: 'Balanced',
      energeticTendency: 'Neutral',
      temperatureTendency: 'Neutral'
    };

    // Process method impacts
    methods.forEach(method => {
      const methodLower = method.toLowerCase();

      // Flavor impacts
      if (methodLower.includes('roast')) {
        characteristics.flavorImpact.push('Roasted', 'Toasted');
      } else if (methodLower.includes('ferment')) {
        characteristics.flavorImpact.push('Earthy', 'Complex');
      } else if (methodLower.includes('steam')) {
        characteristics.flavorImpact.push('Vegetal', 'Fresh');
      } else if (methodLower.includes('pan-fir')) {
        characteristics.flavorImpact.push('Nutty', 'Toasted');
      } else if (methodLower.includes('wither')) {
        characteristics.flavorImpact.push('Oxidized', 'Complex');
      }

      // Body impacts
      if (methodLower.includes('heavy') || methodLower.includes('charcoal')) {
        characteristics.bodyImpact = 'Full-bodied';
      } else if (methodLower.includes('light')) {
        characteristics.bodyImpact = 'Light';
      }

      // Temperature tendency
      if (methodLower.includes('roast')) {
        characteristics.temperatureTendency = 'Warming';
      } else if (methodLower.includes('steam') || methodLower.includes('shade')) {
        characteristics.temperatureTendency = 'Cooling';
      }
    });

    // Oxidation level impacts
    if (oxidationLevel > 0) {
      characteristics.energeticTendency = oxidationLevel > 50 ? 'Energizing' : 'Moderate';
    }

    // Remove duplicates from flavor impact
    characteristics.flavorImpact = [...new Set(characteristics.flavorImpact)];

    return characteristics;
  }

  /**
   * Generate processing description
   *
   * @private
   */
  generateProcessingDescription(methods, oxidationLevel, roastLevel) {
    let desc = 'Processing: ';

    if (methods.length > 0) {
      desc += methods.join(', ');
    } else {
      desc += 'Minimal processing';
    }

    if (oxidationLevel > 0) {
      desc += `. Oxidation level: ${oxidationLevel}%`;
    }

    if (roastLevel !== 'None' && roastLevel !== 'Unknown') {
      desc += `. Roast level: ${roastLevel}`;
    }

    desc += '.';

    return desc;
  }

  /**
   * Serialize inference for JSON output
   */
  serialize(inference) {
    return {
      description: inference?.description || '',
      methods: inference?.methods || [],
      oxidationLevel: inference?.oxidationLevel || 0,
      oxidationCategory: inference?.oxidationCategory || 'Unknown',
      roastLevel: inference?.roastLevel || 'Unknown',
      characteristics: inference?.characteristics || {}
    };
  }

  /**
   * Format inference for markdown display
   */
  formatMarkdown(inference) {
    if (!inference || inference.methods?.length === 0) {
      return '## Processing Analysis\n\nNo processing data available.';
    }

    let md = '## Processing Analysis\n\n';
    md += `${inference.description}\n\n`;

    md += '### Processing Details\n';
    md += `- **Methods**: ${inference.methods?.join(', ') || 'None'}\n`;
    if (inference.oxidationLevel > 0) {
      md += `- **Oxidation Level**: ${inference.oxidationLevel}% (${inference.oxidationCategory})\n`;
    }
    md += `- **Roast Level**: ${inference.roastLevel}\n`;

    const { characteristics } = inference;
    if (characteristics) {
      md += '\n### Processing Impacts\n';
      if (characteristics.flavorImpact?.length > 0) {
        md += `- **Flavor Impact**: ${characteristics.flavorImpact.join(', ')}\n`;
      }
      md += `- **Body**: ${characteristics.bodyImpact}\n`;
      md += `- **Energetic Tendency**: ${characteristics.energeticTendency}\n`;
      md += `- **Temperature Tendency**: ${characteristics.temperatureTendency}\n`;
    }

    return md;
  }
}

// Export singleton instance for convenience
export const processingService = new ProcessingService();
