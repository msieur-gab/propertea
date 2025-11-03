/**
 * brewing.js
 *
 * Unified taxonomy for tea brewing parameters and adjustment rules
 * Single source of truth for brewing recommendations
 *
 * Structure:
 * 1. Base parameters by tea type and style (gongfu, western) - using taxonomy IDs
 * 2. Adjustment rules responsive to:
 *    - Processing methods (roast level, oxidation, leaf style)
 *    - Geography (altitude)
 *    - Compound profile (astringency derived from caffeine/theanine/catechins)
 *    - Vessel material (clay, porcelain, glass)
 *    - Age/condition
 *
 * Design Philosophy:
 * - No hardcoded magic numbers, all rules are documented
 * - Uses taxonomy IDs from TeaTypeTaxonomy, ProcessingTaxonomy, etc.
 * - All adjustments are additive (base + adjustments)
 * - Astringency calculated from compound data, not hardcoded
 * - Temperature bounds: 70-100°C for tea, adjustable by rules
 * - Confidence increases with more complete/specific data
 */

export class BrewingTaxonomy {
  /**
   * Base brewing parameters by tea type and style
   * Keys use TeaTypeTaxonomy ID format for consistency
   */
  static BASE_PARAMETERS = {
    'TEA_TYPE_WHITE': {
      gongfu: {
        temperature: 75,
        steepTime: 35,
        gramsPer100ml: 5,
        infusions: 4,
        reasoning: 'Delicate white tea requires gentle heat (35 seconds) to preserve aromatic compounds without over-extraction'
      },
      western: {
        temperature: 80,
        steepTime: 180,
        gramsPer100ml: 3,
        infusions: 2,
        reasoning: 'Longer western steep (3 minutes) compensates for larger leaf volume and single infusion'
      }
    },

    'TEA_TYPE_GREEN': {
      gongfu: {
        temperature: 75,
        steepTime: 25,
        gramsPer100ml: 6,
        infusions: 5,
        reasoning: 'Fresh green tea extracts within 25 seconds; multiple infusions reveal evolving complexity'
      },
      western: {
        temperature: 80,
        steepTime: 150,
        gramsPer100ml: 4,
        infusions: 1,
        reasoning: 'Western steep (2.5 minutes) allows gentle extraction of delicate green tea character'
      }
    },

    'TEA_TYPE_YELLOW': {
      gongfu: {
        temperature: 75,
        steepTime: 30,
        gramsPer100ml: 5,
        infusions: 4,
        reasoning: 'Yellow tea combines green-tea processing with gentle oxidation; 30 seconds captures delicate balance'
      },
      western: {
        temperature: 80,
        steepTime: 120,
        gramsPer100ml: 3,
        infusions: 2,
        reasoning: 'Gentle handling at 2 minutes preserves yellow tea\'s subtle, complex character'
      }
    },

    'TEA_TYPE_OOLONG': {
      gongfu: {
        temperature: 95,
        steepTime: 15,
        gramsPer100ml: 8,
        infusions: 7,
        reasoning: 'Hot water rapidly extracts complex oolong flavors; 15 seconds per infusion reveals evolving taste profile'
      },
      western: {
        temperature: 90,
        steepTime: 240,
        gramsPer100ml: 5,
        infusions: 2,
        reasoning: 'Oolong\'s oxidized leaves need 4 minutes steep time to fully develop in western single-infusion style'
      }
    },

    'TEA_TYPE_BLACK': {
      gongfu: {
        temperature: 95,
        steepTime: 12,
        gramsPer100ml: 6,
        infusions: 4,
        reasoning: 'Robust black tea extracts fully within 12 seconds at high temperature across multiple brief infusions'
      },
      western: {
        temperature: 95,
        steepTime: 210,
        gramsPer100ml: 4,
        infusions: 1,
        reasoning: 'Full hot water with 3.5-minute steep standard for complete western black tea extraction'
      }
    },

    'TEA_TYPE_PUERH': {
      gongfu: {
        temperature: 95,
        steepTime: 10,
        gramsPer100ml: 10,
        infusions: 10,
        reasoning: 'Dense aged leaves extract quickly (10 seconds) with hot water; extended infusions gradually deepen'
      },
      western: {
        temperature: 95,
        steepTime: 240,
        gramsPer100ml: 6,
        infusions: 2,
        reasoning: 'Puerh\'s robustness allows full 4-minute steep; hot water ensures thorough extraction in western style'
      }
    }
  };

  /**
   * Leaf style/rolling adjustments
   * Different rolling methods affect how leaves unfurl and extract
   * These use ProcessingTaxonomy IDs
   */
  static LEAF_STYLE_ADJUSTMENTS = {
    'PROCESSING_BALL_ROLLED': {
      tempDelta: 2,
      steepDelta: 0.5,
      description: 'Tightly rolled leaves need hotter water and slightly longer first steep to unfurl'
    },
    'PROCESSING_STRIP_ROLLED': {
      tempDelta: 0,
      steepDelta: 0,
      description: 'Strip-rolled leaves provide standard extraction rate'
    },
    'PROCESSING_ROLLED': {
      tempDelta: 0.5,
      steepDelta: 0.2,
      description: 'General rolling causes moderate leaf compaction'
    },
    'PROCESSING_TUMBLED': {
      tempDelta: -1,
      steepDelta: -0.2,
      description: 'Tumbled leaves are more open; extract slightly faster'
    }
  };

  /**
   * Roast level adjustments
   * More roasted tea can tolerate higher temperatures and may need shorter steeps
   * Uses ProcessingTaxonomy roast method IDs
   */
  static ROAST_LEVEL_ADJUSTMENTS = {
    'PROCESSING_MINIMAL_ROAST': { tempDelta: 2, steepDelta: -0.3, description: 'Light roasting enhances aroma slightly' },
    'PROCESSING_LIGHT_ROAST': { tempDelta: 3, steepDelta: -0.5, description: 'Light roasting adds nutty warmth' },
    'PROCESSING_MEDIUM_ROAST': { tempDelta: 5, steepDelta: -0.8, description: 'Medium roasting develops caramel notes' },
    'PROCESSING_HEAVY_ROAST': { tempDelta: 7, steepDelta: -1.0, description: 'Heavy roasting smooths tannins and allows aggressive brewing' },
    'PROCESSING_CHARCOAL_ROASTED': { tempDelta: 7, steepDelta: -1.0, description: 'Charcoal roasting creates complexity and heat tolerance' },
    'PROCESSING_ROCK_FIRED': { tempDelta: 5, steepDelta: -0.8, description: 'Rock firing adds mineral character' }
  };

  /**
   * Oxidation level adjustments
   * More oxidized teas can tolerate higher temperatures
   * Uses ProcessingTaxonomy oxidation method IDs
   */
  static OXIDATION_ADJUSTMENTS = {
    'PROCESSING_STEAMED': { tempDelta: -2, steepDelta: 0.5, description: 'Steamed (minimal oxidation) requires gentle heat' },
    'PROCESSING_KILL_GREEN': { tempDelta: -1, steepDelta: 0.3, description: 'Kill-green stops oxidation early' },
    'PROCESSING_PARTIAL_OXIDATION': { tempDelta: 0, steepDelta: 0, description: 'Partial oxidation (10-80%) is balanced baseline' },
    'PROCESSING_FULL_OXIDATION': { tempDelta: 5, steepDelta: -0.5, description: 'Full oxidation requires and tolerates hot water' },
    'PROCESSING_OXIDISED': { tempDelta: 5, steepDelta: -0.5, description: 'Oxidized teas are robust and extract well at high temps' }
  };

  /**
   * Altitude premium adjustments
   * High altitude tea has more delicate flavors and may need adjusted parameters
   */
  static ALTITUDE_ADJUSTMENTS = {
    'lowland': { tempDelta: 0, steepDelta: 0, altitudeRange: '0-600m', description: 'Sea level to 600m - standard brewing' },
    'mid-altitude': { tempDelta: -2, steepDelta: 0.5, altitudeRange: '600-1200m', description: '600-1200m - slightly cooler to preserve delicate notes' },
    'high-altitude': { tempDelta: -3, steepDelta: 0.8, altitudeRange: '1200-1800m', description: '1200-1800m - cooler water preserves high-altitude aromatics' },
    'very-high-altitude': { tempDelta: -4, steepDelta: 1.0, altitudeRange: '1800m+', description: '1800m+ - significantly cooler brewing for premium aromatics' }
  };

  /**
   * Vessel material heat characteristics
   * Different materials affect thermal properties and brewing outcome
   */
  static VESSEL_MATERIALS = {
    'clay': {
      displayName: 'Clay (Yixing)',
      heatRetention: 'high',
      tempDelta: 0,
      steepDelta: 0,
      description: 'Excellent heat retention; absorbs tea oils over time and seasons the pot. Ideal for gongfu brewing.',
      seasonable: true,
      recommendation: 'Preferred for serious gongfu brewing, especially oolongs and aged puerh'
    },
    'porcelain': {
      displayName: 'Porcelain',
      heatRetention: 'medium',
      tempDelta: -1,
      steepDelta: 0.2,
      description: 'Moderate heat retention; neutral (no seasoning). Good for all tea types.',
      seasonable: false,
      recommendation: 'Versatile choice; good for exploring multiple tea types'
    },
    'glass': {
      displayName: 'Glass',
      heatRetention: 'low',
      tempDelta: -2,
      steepDelta: 0.3,
      description: 'Poor heat retention; allows leaf observation. Best for delicate teas.',
      seasonable: false,
      recommendation: 'Ideal for white, green, and light oolongs to observe leaf unfurling'
    },
    'ceramic': {
      displayName: 'Ceramic',
      heatRetention: 'medium',
      tempDelta: -1,
      steepDelta: 0.2,
      description: 'Moderate heat retention; neutral. General purpose tea brewing.',
      seasonable: false,
      recommendation: 'Good all-purpose choice similar to porcelain'
    }
  };

  /**
   * Age/condition adjustments
   * Aged tea (like aged puerh) may need different parameters
   */
  static AGE_ADJUSTMENTS = {
    'fresh': { tempDelta: 0, steepDelta: 0, description: 'Fresh tea, standard brewing' },
    'aged-1-5': { tempDelta: 2, steepDelta: -0.3, description: '1-5 years aged - slight increase in heat tolerance' },
    'aged-5-10': { tempDelta: 3, steepDelta: -0.5, description: '5-10 years aged - improved extraction with hotter water' },
    'aged-10plus': { tempDelta: 5, steepDelta: -1.0, description: '10+ years aged - aged leaves release quickly with hot water' }
  };

  /**
   * Brewing style descriptions for narrative output
   */
  static STYLE_NARRATIVES = {
    gongfu: {
      philosophy: 'Meditation through Tea - Multiple short infusions reveal evolving flavor dimensions',
      approach: 'Use a small brewing vessel (gaiwan or small teapot) with high leaf-to-water ratio',
      technique: 'Brew multiple brief infusions (often 7-10), allowing leaves to fully rehydrate between steeps',
      benefits: 'Each infusion showcases different flavor notes; leaf observation reveals tea character'
    },
    western: {
      philosophy: 'Simplicity & Accessibility - Single longer infusion captures essential tea character',
      approach: 'Use a larger brewing vessel (teapot or cup with infuser) with standard leaf amount',
      technique: 'Brew one or two infusions with longer steeping time, aiming for full flavor extraction',
      benefits: 'Straightforward, approachable method suitable for everyday enjoyment'
    }
  };

  /**
   * Get base brewing parameters for a tea type and style
   * @param {string} teaType - Tea type ID (TEA_TYPE_WHITE, TEA_TYPE_OOLONG, etc.)
   * @param {string} brewingStyle - Style (gongfu, western)
   * @returns {Object|null} - Base parameters or null if not found
   */
  static getBaseParameters(teaType, brewingStyle = 'gongfu') {
    const type = String(teaType).toUpperCase();
    const style = String(brewingStyle).toLowerCase();
    return this.BASE_PARAMETERS[type]?.[style] || null;
  }

  /**
   * Get adjustment for a leaf style/rolling method
   * @param {string} processingMethod - Processing method ID from ProcessingTaxonomy
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description }
   */
  static getLeafStyleAdjustment(processingMethod) {
    if (!processingMethod) return { tempDelta: 0, steepDelta: 0, description: 'No leaf style data' };
    return this.LEAF_STYLE_ADJUSTMENTS[processingMethod] || { tempDelta: 0, steepDelta: 0, description: 'Unknown leaf style' };
  }

  /**
   * Get adjustment for a specific roast level
   * @param {string} roastMethod - Processing method ID from ProcessingTaxonomy
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description }
   */
  static getRoastAdjustment(roastMethod) {
    if (!roastMethod) return { tempDelta: 0, steepDelta: 0, description: 'No roasting applied' };
    return this.ROAST_LEVEL_ADJUSTMENTS[roastMethod] || { tempDelta: 0, steepDelta: 0, description: 'Unknown roast level' };
  }

  /**
   * Get adjustment for oxidation level
   * @param {string} oxidationMethod - Processing method ID from ProcessingTaxonomy
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description }
   */
  static getOxidationAdjustment(oxidationMethod) {
    if (!oxidationMethod) return { tempDelta: 0, steepDelta: 0, description: 'No oxidation data' };
    return this.OXIDATION_ADJUSTMENTS[oxidationMethod] || { tempDelta: 0, steepDelta: 0, description: 'Unknown oxidation level' };
  }

  /**
   * Get adjustment for altitude
   * @param {number} altitude - Altitude in meters from GeographyInferrer
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description, key, altitudeRange }
   */
  static getAltitudeAdjustment(altitude) {
    if (!altitude || altitude <= 0) return { key: 'lowland', ...this.ALTITUDE_ADJUSTMENTS['lowland'] };

    if (altitude < 600) return { key: 'lowland', ...this.ALTITUDE_ADJUSTMENTS['lowland'] };
    if (altitude < 1200) return { key: 'mid-altitude', ...this.ALTITUDE_ADJUSTMENTS['mid-altitude'] };
    if (altitude < 1800) return { key: 'high-altitude', ...this.ALTITUDE_ADJUSTMENTS['high-altitude'] };
    return { key: 'very-high-altitude', ...this.ALTITUDE_ADJUSTMENTS['very-high-altitude'] };
  }

  /**
   * Calculate astringency level from compound profile
   * Derives astringency from actual compound data rather than guessing
   * @param {number} caffeine - Caffeine level (0-100 scale from CompoundInferrer)
   * @param {number} theanine - L-theanine level (0-100 scale)
   * @param {number} catechins - Catechin level (0-100 scale, optional)
   * @returns {string} - Astringency level (low, medium, high, very-high)
   */
  static calculateAstringencyFromCompounds(caffeine, theanine, catechins = 0) {
    // Astringency comes from tannic compounds (catechins, theaflavins)
    // High caffeine + low theanine + high catechins = very astringent
    const caffeineTheanineRatio = theanine > 0 ? caffeine / theanine : caffeine;

    if (catechins > 0) {
      // With catechin data, use it
      if (caffeineTheanineRatio > 2.0 && catechins > 80) return 'very-high';
      if (caffeineTheanineRatio > 1.5 && catechins > 60) return 'high';
      if (caffeineTheanineRatio > 1.0 && catechins > 40) return 'medium';
      return 'low';
    } else {
      // Without catechin data, estimate from caffeine/theanine ratio
      if (caffeineTheanineRatio > 2.0) return 'very-high';
      if (caffeineTheanineRatio > 1.5) return 'high';
      if (caffeineTheanineRatio > 1.0) return 'medium';
      return 'low';
    }
  }

  /**
   * Get adjustment for astringency level
   * @param {string} astringencyLevel - Level (low, medium, high, very-high)
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description }
   */
  static getAstringencyAdjustment(astringencyLevel) {
    if (!astringencyLevel) return { tempDelta: 0, steepDelta: 0, description: 'No astringency data' };

    const levelMap = {
      'low': { tempDelta: -2, steepDelta: -0.3, description: 'Low astringency allows cooler, quicker brewing' },
      'medium': { tempDelta: 0, steepDelta: 0, description: 'Medium astringency (baseline)' },
      'high': { tempDelta: 3, steepDelta: 0, description: 'High astringency benefits from hotter water to balance tannins' },
      'very-high': { tempDelta: 5, steepDelta: 0.3, description: 'Very high astringency requires hot water and moderate steeping' }
    };

    return levelMap[astringencyLevel.toLowerCase()] || { tempDelta: 0, steepDelta: 0, description: 'Unknown astringency' };
  }

  /**
   * Get adjustment for tea age/condition
   * @param {number} ageYears - Age in years (optional)
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description, key }
   */
  static getAgeAdjustment(ageYears) {
    if (!ageYears || ageYears <= 0) return { key: 'fresh', ...this.AGE_ADJUSTMENTS['fresh'] };

    if (ageYears < 5) return { key: 'aged-1-5', ...this.AGE_ADJUSTMENTS['aged-1-5'] };
    if (ageYears < 10) return { key: 'aged-5-10', ...this.AGE_ADJUSTMENTS['aged-5-10'] };
    return { key: 'aged-10plus', ...this.AGE_ADJUSTMENTS['aged-10plus'] };
  }

  /**
   * Get adjustment for vessel material
   * @param {string} vesselMaterial - Material type (clay, porcelain, glass, ceramic)
   * @returns {Object} - Adjustment { tempDelta, steepDelta, description, heatRetention }
   */
  static getVesselMaterialAdjustment(vesselMaterial) {
    if (!vesselMaterial) return { tempDelta: 0, steepDelta: 0, description: 'No vessel specified' };

    const material = String(vesselMaterial).toLowerCase().trim();
    const info = this.VESSEL_MATERIALS[material];

    if (!info) return { tempDelta: 0, steepDelta: 0, description: 'Unknown vessel material' };

    return {
      tempDelta: info.tempDelta,
      steepDelta: info.steepDelta,
      description: info.description,
      heatRetention: info.heatRetention
    };
  }

  /**
   * Calculate final brewing parameters from base + all adjustments
   * This is the core calculation that combines all inputs
   *
   * @param {Object} baseParams - Base parameters { temperature, steepTime, amountPerGram, infusions }
   * @param {Array} adjustments - Array of { tempDelta, steepDelta } objects to apply
   * @returns {Object} - Final parameters with bounds applied
   */
  static calculateAdjustedParameters(baseParams, adjustments = []) {
    if (!baseParams) return null;

    // Start with base
    let finalTemp = baseParams.temperature;
    let finalSteep = baseParams.steepTime;

    // Apply each adjustment (they're cumulative)
    adjustments.forEach(adj => {
      if (adj.tempDelta) finalTemp += adj.tempDelta;
      if (adj.steepDelta) finalSteep += adj.steepDelta;
    });

    // Apply bounds: temperature 70-100°C, steepTime at least 1 second
    finalTemp = Math.max(70, Math.min(100, finalTemp));
    finalSteep = Math.max(1, finalSteep);

    return {
      temperature: Math.round(finalTemp * 10) / 10, // Round to nearest 0.1°C
      steepTime: Math.round(finalSteep * 10) / 10,  // Round to nearest 0.1s
      gramsPer100ml: baseParams.gramsPer100ml,       // Not adjusted by these factors
      infusions: baseParams.infusions                // Not adjusted by these factors
    };
  }

  /**
   * Get brewing style narrative information
   * @param {string} brewingStyle - gongfu or western
   * @returns {Object} - Philosophy, approach, technique, benefits
   */
  static getStyleNarrative(brewingStyle) {
    const style = String(brewingStyle).toLowerCase();
    return this.STYLE_NARRATIVES[style] || this.STYLE_NARRATIVES['gongfu'];
  }

  /**
   * Generate explanation text for the adjustments made
   * @param {Array} adjustmentsApplied - Array of { source, description } applied adjustments
   * @returns {string} - Human-readable explanation
   */
  static generateAdjustmentNarrative(adjustmentsApplied = []) {
    if (!adjustmentsApplied || adjustmentsApplied.length === 0) {
      return 'Standard brewing parameters based on tea type.';
    }

    const explanations = adjustmentsApplied.map(adj => {
      return `${adj.source}: ${adj.description}`;
    }).filter(e => e);

    if (explanations.length === 0) return 'Standard brewing parameters based on tea type.';

    return 'Brewing parameters adjusted for: ' + explanations.join('; ') + '.';
  }

  /**
   * Calculate confidence score based on data completeness
   * More specific data = higher confidence
   *
   * @param {Object} dataAvailable - Flags for available data sources
   * @returns {number} - Confidence score 0.5-0.95
   */
  static calculateAdvancedConfidence(dataAvailable = {}) {
    let confidence = 0.70; // Base confidence for tea type + style alone

    // Processing data increases confidence
    if (dataAvailable.hasProcessing) confidence += 0.08;
    if (dataAvailable.hasRoastLevel) confidence += 0.05;
    if (dataAvailable.hasLeafStyle) confidence += 0.05;

    // Geographic specificity boosts confidence
    if (dataAvailable.hasGeography) confidence += 0.08;
    if (dataAvailable.hasAltitude) confidence += 0.05;

    // Compound data is very valuable
    if (dataAvailable.hasCompound) confidence += 0.10;
    if (dataAvailable.hasAstringency) confidence += 0.05;

    // Vessel and age data add detail
    if (dataAvailable.hasVesselType) confidence += 0.03;
    if (dataAvailable.hasAge) confidence += 0.03;

    return Math.min(0.95, Math.max(0.5, confidence));
  }
}

export default BrewingTaxonomy;
