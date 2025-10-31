/**
 * TeaTypeService.js
 *
 * Identifies and analyzes tea types with fallback logic
 * Extracted from: js/calculators/TeaTypeCalculator.js
 *
 * Fallback hierarchy:
 * 1. Explicit subType field
 * 2. Hyphenated type (e.g., 'puerh-sheng')
 * 3. Keyword in tea name
 * 4. Primary type only
 *
 * Input: TeaModel with type, subType, name
 * Output: Type analysis with characteristics and confidence
 */

export class TeaTypeService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea type
   *
   * @param {TeaModel} teaModel - Normalized tea model
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(teaModel) {
    return this.infer(teaModel);
  }

  /**
   * Perform tea type analysis with intelligent fallback logic
   *
   * @param {TeaModel} teaModel - Tea to analyze
   * @returns {Object} Type analysis result
   */
  infer(teaModel) {
    // Extract type and subtype with fallback logic
    const identification = this.identifyTeaType(teaModel);

    // Return result with identification source
    return {
      identified: {
        type: identification.type,
        subType: identification.subType,
        source: identification.source,
        confidence: identification.confidence
      },
      description: this.generateTypeDescription(
        identification.type,
        identification.subType
      ),
      characteristics: this.getCharacteristics(
        identification.type,
        identification.subType
      )
    };
  }

  /**
   * Intelligently identify tea type using fallback logic
   *
   * Hierarchy:
   * 1. Use explicit subType if provided
   * 2. Parse hyphenated type (e.g., 'puerh-sheng')
   * 3. Search tea name for known subtypes
   * 4. Fall back to primary type
   *
   * @private
   */
  identifyTeaType(teaModel) {
    let identifiedType = (teaModel?.type || 'unknown').toLowerCase();
    let identifiedSubType = (teaModel?.subType || '').toLowerCase();
    let source = 'Explicit type';
    let confidence = 'High';

    // Step 1: Check for explicit subType
    if (identifiedSubType) {
      return { type: identifiedType, subType: identifiedSubType, source, confidence };
    }

    // Step 2: Parse hyphenated type (e.g., 'puerh-sheng')
    if (identifiedType.includes('-')) {
      const parts = identifiedType.split('-');
      identifiedType = parts[0];
      identifiedSubType = parts[1];
      source = 'Hyphenated type';
      confidence = 'Medium-High';
      return { type: identifiedType, subType: identifiedSubType, source, confidence };
    }

    // Step 3: Search tea name for known subtypes
    if (teaModel?.name) {
      const nameLower = teaModel.name.toLowerCase();

      // Known subtypes mapping (should ideally come from reference data)
      const knownSubtypes = [
        'matcha',
        'gyokuro',
        'sencha',
        'assam',
        'darjeeling',
        'ceylon',
        'keemun',
        'tie guan yin',
        'oolong',
        'white peony',
        'silver needle',
        'sheng',
        'shou',
        'pu-erh',
        'puerh'
      ];

      for (const subtype of knownSubtypes) {
        if (nameLower.includes(subtype.toLowerCase())) {
          identifiedSubType = subtype.toLowerCase();
          source = 'Keyword in tea name';
          confidence = 'Medium';
          break;
        }
      }

      if (identifiedSubType) {
        return { type: identifiedType, subType: identifiedSubType, source, confidence };
      }
    }

    // Step 4: Fall back to primary type only
    return { type: identifiedType, subType: '', source: 'Primary type only', confidence: 'Low' };
  }

  /**
   * Generate description for tea type
   *
   * @private
   */
  generateTypeDescription(type, subType) {
    // This could be expanded with reference data
    const typeMap = {
      green: 'Green teas are minimally processed, preserving fresh, vegetal, or marine flavors.',
      black: 'Black teas are fully oxidized, developing robust, malty, and fruity flavors.',
      oolong: 'Oolong teas have partial oxidation, offering a spectrum from light to roasted profiles.',
      white: 'White teas are minimally processed, known for delicate, subtle, and naturally sweet flavors.',
      puerh: 'Pu-erh teas are aged and fermented, developing earthy, complex, and digestive properties.',
      yellow: 'Yellow teas are rare, lightly oxidized Chinese teas with gentle, smooth profiles.',
      herbal: 'Herbal infusions are caffeine-free blends offering diverse flavors and properties.',
      tisane: 'Tisanes are botanical infusions without tea leaves, offering herbal properties.'
    };

    let desc = typeMap[type] || `A ${type} tea with unique characteristics.`;

    if (subType) {
      desc += ` This is a ${subType} variant.`;
    }

    return desc;
  }

  /**
   * Get general characteristics for a tea type
   *
   * @private
   */
  getCharacteristics(type, subType) {
    // Base characteristics by type
    const characteristics = {
      green: {
        oxidationLevel: 'Low (0-15%)',
        flavorProfile: ['Vegetal', 'Marine', 'Nutty', 'Grassy', 'Sweet'],
        caffeineLevel: 'Medium',
        seasonalTendency: 'Cooling',
        bestTimeOfDay: ['Morning', 'Afternoon'],
        commonProcessing: ['Steamed', 'Pan-fired', 'Rolled', 'Dried']
      },
      black: {
        oxidationLevel: 'Full (80-100%)',
        flavorProfile: ['Malty', 'Fruity', 'Spicy', 'Sweet', 'Woody', 'Roasted'],
        caffeineLevel: 'High',
        seasonalTendency: 'Warming',
        bestTimeOfDay: ['Morning', 'Afternoon'],
        commonProcessing: ['Withered', 'Rolled', 'Oxidized', 'Dried']
      },
      oolong: {
        oxidationLevel: 'Partial (20-80%)',
        flavorProfile: ['Floral', 'Fruity', 'Roasted', 'Woody', 'Mineral', 'Honey'],
        caffeineLevel: 'Medium-High',
        seasonalTendency: 'Variable',
        bestTimeOfDay: ['Afternoon', 'Evening'],
        commonProcessing: ['Withered', 'Bruised/Rolled', 'Partially Oxidized', 'Roasted']
      },
      white: {
        oxidationLevel: 'Minimal (0-10%)',
        flavorProfile: ['Sweet', 'Delicate', 'Fruity', 'Honey', 'Vegetal'],
        caffeineLevel: 'Low',
        seasonalTendency: 'Cooling',
        bestTimeOfDay: ['Anytime', 'Evening'],
        commonProcessing: ['Withered', 'Dried']
      },
      puerh: {
        oxidationLevel: 'Variable',
        flavorProfile: ['Earthy', 'Aged', 'Woody', 'Smooth', 'Mineral'],
        caffeineLevel: 'Medium-High',
        seasonalTendency: 'Warming',
        bestTimeOfDay: ['Afternoon', 'Evening'],
        commonProcessing: ['Fermented', 'Aged', 'Pressed']
      },
      yellow: {
        oxidationLevel: 'Low (8-15%)',
        flavorProfile: ['Sweet', 'Smooth', 'Vegetal', 'Subtle'],
        caffeineLevel: 'Medium',
        seasonalTendency: 'Cooling',
        bestTimeOfDay: ['Morning', 'Afternoon'],
        commonProcessing: ['Steamed', 'Yellow-brewed', 'Sealed']
      },
      herbal: {
        oxidationLevel: 'N/A',
        flavorProfile: ['Variable', 'Aromatic', 'Medicinal', 'Sweet'],
        caffeineLevel: 'None',
        seasonalTendency: 'Varies',
        bestTimeOfDay: ['Anytime'],
        commonProcessing: ['Dried', 'Blended']
      },
      tisane: {
        oxidationLevel: 'N/A',
        flavorProfile: ['Variable', 'Botanical', 'Aromatic'],
        caffeineLevel: 'None',
        seasonalTendency: 'Varies',
        bestTimeOfDay: ['Anytime'],
        commonProcessing: ['Dried', 'Infused']
      }
    };

    return characteristics[type] || characteristics.herbal;
  }

  /**
   * Serialize inference for JSON output
   */
  serialize(inference) {
    return {
      identified: inference?.identified || {},
      description: inference?.description || '',
      characteristics: inference?.characteristics || {}
    };
  }

  /**
   * Format inference for markdown display
   */
  formatMarkdown(inference) {
    if (!inference || !inference.identified) {
      return '## Tea Type Analysis\n\nNo tea type data available.';
    }

    const { identified, description, characteristics } = inference;

    let md = `## Tea Type Analysis: ${this.capitalize(identified.type)}`;
    if (identified.subType) {
      md += ` (${this.capitalize(identified.subType)})`;
    }
    md += '\n\n';

    md += `**Confidence**: ${identified.confidence} | **Source**: ${identified.source}\n\n`;
    md += `${description}\n\n`;

    if (characteristics) {
      md += '### Characteristics\n';
      md += `- **Oxidation Level**: ${characteristics.oxidationLevel || 'N/A'}\n`;
      md += `- **Flavor Profile**: ${characteristics.flavorProfile?.join(', ') || 'N/A'}\n`;
      md += `- **Typical Caffeine**: ${characteristics.caffeineLevel || 'N/A'}\n`;
      md += `- **Seasonal Tendency**: ${characteristics.seasonalTendency || 'N/A'}\n`;
      md += `- **Best Time of Day**: ${characteristics.bestTimeOfDay?.join(', ') || 'N/A'}\n`;
      md += `- **Common Processing**: ${characteristics.commonProcessing?.join(', ') || 'N/A'}\n`;
    }

    return md;
  }

  /**
   * Capitalize first letter of string
   *
   * @private
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export singleton instance for convenience
export const teaTypeService = new TeaTypeService();
