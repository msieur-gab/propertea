/**
 * FlavorService.js
 *
 * Analyzes tea flavor profiles and flavor-related associations
 * Extracted from: js/calculators/FlavorCalculator.js
 *
 * Dependencies: Reference data manager (for flavor influences)
 * Input: TeaModel with flavor.primary array
 * Output: Flavor analysis with categories, intensity, and associations
 */

// --- Helper Functions ---

/**
 * Estimate overall flavor intensity based on number of flavor notes
 */
function estimateFlavorIntensity(flavorProfile) {
  const count = Array.isArray(flavorProfile) ? flavorProfile.length : 0;
  if (count === 0) return 'N/A';
  if (count <= 2) return 'Subtle';
  if (count <= 4) return 'Moderate';
  return 'Pronounced';
}

/**
 * Categorize flavors into flavor families
 */
function getDominantFlavorCategories(flavorProfile) {
  const categories = new Set();
  if (!Array.isArray(flavorProfile)) return [];

  flavorProfile.forEach(flavor => {
    const normalizedFlavor = flavor.toLowerCase().trim();

    if (
      ['jasmine', 'rose', 'orchid', 'lilac', 'osmanthus', 'honeysuckle', 'floral'].includes(
        normalizedFlavor
      )
    )
      categories.add('Floral');
    else if (
      [
        'apple',
        'pear',
        'peach',
        'apricot',
        'citrus',
        'berry',
        'tropical',
        'stone_fruit',
        'fruity'
      ].includes(normalizedFlavor)
    )
      categories.add('Fruity');
    else if (
      ['spinach', 'kale', 'grass', 'vegetal', 'leafy', 'broccoli', 'cabbage'].includes(
        normalizedFlavor
      )
    )
      categories.add('Vegetal');
    else if (
      ['almond', 'hazelnut', 'walnut', 'nutty', 'toasted', 'grainy'].includes(normalizedFlavor)
    )
      categories.add('Nutty/Toasty');
    else if (['pepper', 'ginger', 'cinnamon', 'spicy'].includes(normalizedFlavor))
      categories.add('Spicy');
    else if (['honey', 'caramel', 'sweet', 'vanilla', 'chocolate', 'malt'].includes(normalizedFlavor))
      categories.add('Sweet');
    else if (['earthy', 'mineral', 'wet stone', 'petrichor'].includes(normalizedFlavor))
      categories.add('Earthy/Mineral');
    else if (['wood', 'cedar', 'pine', 'woody'].includes(normalizedFlavor))
      categories.add('Woody');
    else if (['roasted', 'smoky', 'coffee'].includes(normalizedFlavor))
      categories.add('Roasted');
    else if (['umami', 'marine', 'seaweed', 'savory'].includes(normalizedFlavor))
      categories.add('Umami/Marine');
    else if (['aged', 'leather', 'compost'].includes(normalizedFlavor))
      categories.add('Aged/Earthy');
  });

  return Array.from(categories);
}

// --- FlavorService ---

export class FlavorService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea flavor
   *
   * @param {TeaModel} teaModel - Normalized tea model
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(teaModel) {
    return this.infer(teaModel);
  }

  /**
   * Perform flavor analysis
   *
   * @param {TeaModel} teaModel - Tea to analyze
   * @returns {Object} Analysis result
   */
  infer(teaModel) {
    // Extract flavor profile
    let flavorProfileInput = teaModel?.flavor?.primary || [];
    if (!Array.isArray(flavorProfileInput)) {
      flavorProfileInput = [];
    }

    const identifiedFlavors = flavorProfileInput.filter(f => typeof f === 'string');

    // Handle empty flavor profile
    if (identifiedFlavors.length === 0) {
      return {
        description: 'No flavor profile available.',
        profile: {
          identified: [],
          dominant: [],
          categories: [],
          intensity: 'N/A'
        },
        analysis: {
          foodPairingHints: [],
          seasonalAffinityHints: [],
          activityHints: []
        }
      };
    }

    // Determine dominant flavors (first 3-5)
    const dominantFlavors = this.getDominantFlavors(identifiedFlavors);

    // Determine flavor categories
    const dominantFlavorCategories = getDominantFlavorCategories(identifiedFlavors);

    // Estimate intensity
    const intensityEstimate = estimateFlavorIntensity(identifiedFlavors);

    // Aggregate analysis hints (to be populated by reference data in full implementation)
    const analysis = {
      foodPairingHints: [],
      seasonalAffinityHints: [],
      activityHints: []
    };

    // Generate description
    const description = this.generateFlavorDescription(
      identifiedFlavors,
      dominantFlavors,
      dominantFlavorCategories,
      intensityEstimate
    );

    return {
      description,
      profile: {
        identified: identifiedFlavors,
        dominant: dominantFlavors,
        categories: dominantFlavorCategories,
        intensity: intensityEstimate
      },
      analysis
    };
  }

  /**
   * Get dominant flavors (top 3-5)
   */
  getDominantFlavors(flavorProfile, limit = 3) {
    if (!flavorProfile || !Array.isArray(flavorProfile) || flavorProfile.length === 0) {
      return [];
    }
    return flavorProfile.slice(0, limit);
  }

  /**
   * Generate flavor description
   */
  generateFlavorDescription(flavors, dominant, categories, intensity) {
    let desc = `The flavor profile is perceived as '${intensity.toLowerCase()}'. `;
    if (dominant.length > 0) {
      desc += `Dominant notes include ${dominant.join(', ')}. `;
    }
    if (categories.length > 0) {
      desc += `Overall, it falls into the following flavor categories: ${categories.join(', ')}. `;
    }
    desc += `Contains ${flavors.length} distinct flavor notes provided.`;
    return desc;
  }

  /**
   * Serialize inference for JSON output
   */
  serialize(inference) {
    const description = inference?.description || 'No flavor profile available.';
    const profile = inference?.profile || {
      identified: [],
      dominant: [],
      categories: [],
      intensity: 'N/A'
    };
    const analysis = inference?.analysis || {
      foodPairingHints: [],
      seasonalAffinityHints: [],
      activityHints: []
    };

    return {
      description,
      profile,
      analysis
    };
  }

  /**
   * Format inference for markdown display
   */
  formatMarkdown(inference) {
    if (!inference || inference.profile?.identified?.length === 0) {
      return '## Flavor Analysis\n\nNo flavor profile available.';
    }

    let md = '## Flavor Analysis\n\n';
    md += `${inference.description}\n\n`;

    md += '### Flavor Details\n';
    md += `- **Identified Notes:** ${inference.profile.identified.join(', ')}\n`;
    md += `- **Dominant Notes:** ${inference.profile.dominant.join(', ')}\n`;
    md += `- **Dominant Categories:** ${inference.profile.categories.join(', ')}\n`;
    md += `- **Estimated Intensity:** ${inference.profile.intensity}\n`;

    md += '\n### Flavor Profile Associations (Hints)\n';
    const { analysis } = inference;
    if (
      analysis &&
      (analysis.foodPairingHints?.length > 0 ||
        analysis.seasonalAffinityHints?.length > 0 ||
        analysis.activityHints?.length > 0)
    ) {
      if (analysis.foodPairingHints?.length > 0)
        md += `- **Potential Food Pairings:** ${analysis.foodPairingHints.join(', ')}\n`;
      if (analysis.seasonalAffinityHints?.length > 0)
        md += `- **Seasonal Affinity:** ${analysis.seasonalAffinityHints.join(', ')}\n`;
      if (analysis.activityHints?.length > 0)
        md += `- **Potential Activity Associations:** ${analysis.activityHints.join(', ')}\n`;
    } else {
      md += 'No specific associations identified from reference data for the provided flavors.\n';
    }

    return md;
  }
}

// Export singleton instance for convenience
export const flavorService = new FlavorService();
