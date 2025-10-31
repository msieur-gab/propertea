/**
 * EffectService.js - ADDITIVE TERTIARY METHOD
 *
 * Calculates expected tea effects (dominant and supporting)
 * Based on: tea type, compounds (caffeine/L-theanine), flavor profile, processing, and geographic/climate factors
 *
 * Input: TeaModel + Core analysis
 * Output: Expected effects with dominant/supporting effect names
 *
 * TERTIARY/ADDITIVE ALGORITHM (proven in TimeMatcher):
 * 1. Initialize baseline scores from tea type (dominant=25, secondary=15, tertiary=10)
 * 2. Add adjustments from compounds (ratio-based)
 * 3. Add adjustments from flavors
 * 4. Add adjustments from processing/roast
 * 5. Add adjustments from geography (minimal)
 * 6. Normalize 0-100 and select top 2 effects
 *
 * Why this works: Sequential additive adjustments allow secondary factors to modulate
 * the base tea type signal without overwhelming it through multiplication.
 */

import { TeaTypeNormalizer } from '../utils/TeaTypeNormalizer.js';
import ReferenceDescriptorService from './ReferenceDescriptorService.js';
import NormalizationDescriptorService from './NormalizationDescriptorService.js';

// Core effects and their definitions
const CORE_EFFECTS = {
  energizing: 'Provides mental and physical energy, alertness, and vitality',
  calming: 'Induces relaxation and reduces stress',
  focusing: 'Enhances mental clarity and concentration',
  harmonizing: 'Creates equilibrium between opposing forces',
  grounding: 'Provides stability and connection to the present',
  elevating: 'Elevates mood and spirit, creates transcendent experiences',
  comforting: 'Provides warmth, security, and emotional support',
  restorative: 'Aids in recovery and renewal'
};

// Base effects by tea type (100% Chinese tea classification system)
// green (绿茶), white (白茶), yellow (黄茶), oolong (乌龙茶),
// red/hongcha (红茶 - known as "black tea" in Western terminology),
// dark/heicha (黑茶 - fermented post-fermented teas like Liu Bao, An Hua, Fu Zhuan),
// puerh (普洱茶 - with sheng/shou subtypes, historically part of heicha but independent effects)
const TEA_TYPE_EFFECTS = {
  // Calibrated from expert-validated reference teas (TeaDatabase)
  // Adjusted to match expected effects while respecting compound influence

  // GREEN: Sencha (ratio 1.5) expects energizing, Matcha expects focusing
  // Need to support both patterns - use compound ratio to determine
  green: { energizing: 6, focusing: 6, calming: 4, elevating: 3, harmonizing: 2.5 },

  // WHITE: Silver Needle (ratio 2.8) expects calming/restorative
  // Reduce comforting to prevent it from competing with calming/restorative
  white: { restorative: 8, calming: 7, elevating: 3, harmonizing: 2, comforting: 0.5, focusing: 0.5 },

  // YELLOW: Balanced, harmonizing and calming
  yellow: { harmonizing: 8, calming: 7, elevating: 2, focusing: 1 },

  // OOLONG: Complex - mix of elevating, harmonizing, grounding
  // Da Hong Pao (ratio 1.0) expects comforting/grounding
  // Ali Shan (ratio 1.86) expects elevating/calming
  // Mi Lan Xiang (ratio 0.84) expects elevating/energizing
  oolong: { harmonizing: 7, elevating: 6, comforting: 5, grounding: 5, focusing: 4 },

  // RED/HONGCHA: Assam (ratio 0.54) expects energizing/focusing
  // Increased energizing to ensure it dominates over comforting from processing
  red: { energizing: 9, focusing: 6.5, comforting: 3, grounding: 2, harmonizing: 1 },

  // DARK/HEICHA: Aged Ripe (ratio 1.0) expects grounding/comforting
  dark: { grounding: 9, comforting: 7, restorative: 3, harmonizing: 2, calming: 1.5 },

  // BLACK: Assam (ratio 0.54) expects energizing/focusing
  black: { energizing: 8, focusing: 6, comforting: 5, grounding: 3, harmonizing: 2 },

  // PUERH: Young Sheng expects energizing, Aged Shou expects grounding
  puerh: {
    sheng: { energizing: 7.5, focusing: 6, grounding: 4, harmonizing: 4 },
    shou: { grounding: 9, comforting: 7.5, harmonizing: 3, restorative: 3 }
  }
};

// Effect modifiers based on compound profiles
// Reduced L-Theanine modifiers to prevent overriding tea type effects
const COMPOUND_EFFECT_MODIFIERS = {
  'Very High Caffeine': { energizing: 2, focusing: 2, grounding: -1, calming: -2 },
  'High Caffeine': { energizing: 1, focusing: 1, calming: -1 },
  'Moderate Caffeine': { energizing: 0.5, focusing: 0.5 },
  'Very High L-Theanine': { calming: 1.5, harmonizing: 1, restorative: 0.75, elevating: 0.5 },
  'High L-Theanine': { calming: 1, harmonizing: 0.75, restorative: 0.5, comforting: 0.5 },
  'Balanced': { harmonizing: 1, focusing: 0.5 },
  'Caffeine Dominant': { energizing: 1, focusing: 0.5, comforting: -0.5 }
};

// Flavor category to effect mapping
const FLAVOR_EFFECT_MAP = {
  Floral: { elevating: 2, harmonizing: 1, comforting: 0.5, calming: 0.5 },
  Fruity: { elevating: 1, energizing: 0.5, harmonizing: 0.5 },
  Vegetal: { focusing: 1, grounding: 0.5, energizing: 0.5 },
  'Nutty/Toasty': { comforting: 1, grounding: 0.5, restorative: 0.5 },
  Spicy: { energizing: 1, focusing: 0.5, warming: 0.5 },
  Sweet: { elevating: 0.5, comforting: 1, restorative: 0.5, calming: 0.5 },
  'Earthy/Mineral': { grounding: 1.5, harmonizing: 0.5, restorative: 0.5 },
  Woody: { grounding: 1, comforting: 0.5 },
  Roasted: { comforting: 1, grounding: 0.5, warming: 0.5 },
  'Umami/Marine': { focusing: 1, energizing: 0.5, grounding: 0.5 },
  'Aged/Earthy': { grounding: 1.5, restorative: 1 }
};

// Processing roast level effect modifiers
const ROAST_LEVEL_MODIFIERS = {
  Charcoal: { grounding: 3.5, comforting: 3, warming: 1.5, restorative: 0.5 },
  Heavy: { grounding: 3, comforting: 2.5, warming: 1, restorative: 0.5 },
  Medium: { comforting: 1, harmonizing: 0.5, grounding: 0.5 },
  Light: { energizing: 1, elevating: 1, focusing: 0.5 },
  Minimal: { elevating: 1, focusing: 1, harmonizing: 0.5 },
  None: {}
};

// Geographic/Climate effect modifiers
// Based on original GeographicalDescriptors from frontend
// Using correct thresholds: altitude (300/600/1200/1800), humidity (40/55/70/85),
//                          temperature (10/16/22/28), solar (130/170/210/250)
// Calibrated with conservative values to avoid over-weighting geography factor
const GEOGRAPHIC_EFFECT_MODIFIERS = {
  altitude: {
    // Altitude in meters - higher altitude produces more delicate, complex teas (more L-theanine)
    veryLow: { energizing: 0.3, focusing: 0.1 },                // < 300m - bold flavors
    low: { harmonizing: 0.2, energizing: 0.1 },                 // 300-600m - strong flavors
    medium: { elevating: 0.3, harmonizing: 0.3, restorative: 0.2 }, // 600-1200m - balanced
    high: { calming: 0.6, elevating: 0.3, restorative: 0.5 }    // 1200-1800m - delicate, sweet
  },
  temperature: {
    // Temperature in Celsius - affects amino acid vs catechin balance
    // TUNED: Reduced calming for cool temps (cool climate ≠ calm tea)
    veryLow: { calming: 0.3, restorative: 0.2, focusing: 0.1 },  // < 10°C - high L-theanine (reduced calming)
    low: { calming: 0.2, restorative: 0.2, elevating: 0.15 },    // 10-16°C - delicate, aromatic (reduced calming)
    moderate: { harmonizing: 0.3, elevating: 0.3, focusing: 0.1 }, // 16-22°C - balanced
    high: { energizing: 0.3, focusing: 0.2, grounding: 0.1 },     // 22-28°C - stronger flavors
    veryHigh: { energizing: 0.4, grounding: 0.3, comforting: 0.1 } // > 28°C - rapid growth
  },
  humidity: {
    // Humidity as percentage - affects growth rate and amino acid development
    // TUNED: Removed calming from high humidity (humid air ≠ calm effect), added focusing
    veryLow: { energizing: 0.2, focusing: 0.2 },                // < 40% - stressed growth
    low: { energizing: 0.15, focusing: 0.1 },                   // 40-55% - pronounced intensity
    moderate: { harmonizing: 0.2, elevating: 0.1 },             // 55-70% - balanced
    high: { elevating: 0.3, harmonizing: 0.2, focusing: 0.15 }, // 70-85% - mist effect, supports clarity (removed calming, added focusing)
    veryHigh: { calming: 0.2, restorative: 0.2, harmonizing: 0.15 } // > 85% - very smooth (reduced calming)
  },
  solarRadiation: {
    // Solar radiation in W/m² - affects catechin vs L-theanine balance
    veryLow: { calming: 0.3, restorative: 0.2, elevating: 0.15 },  // < 130 - shade-grown
    low: { calming: 0.2, restorative: 0.15, focusing: 0.1 },       // 130-170 - slower growth
    moderate: { harmonizing: 0.2, elevating: 0.15 },              // 170-210 - balanced
    high: { energizing: 0.3, focusing: 0.2, grounding: 0.1 },     // 210-250 - stronger
    veryHigh: { energizing: 0.4, grounding: 0.3, comforting: 0.1 } // > 250 - maximum catechins
  }
};

// Complementary effects (for tie-breaking when selecting supporting)
const COMPLEMENTARY_EFFECTS = {
  energizing: ['focusing', 'elevating'],
  calming: ['grounding', 'harmonizing', 'restorative'],
  focusing: ['energizing', 'elevating', 'grounding'],
  harmonizing: ['calming', 'grounding', 'elevating'],
  grounding: ['calming', 'comforting', 'focusing'],
  elevating: ['calming', 'harmonizing', 'focusing', 'energizing'],
  comforting: ['grounding', 'harmonizing', 'restorative'],
  restorative: ['calming', 'comforting', 'harmonizing']
};

export class EffectService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea effects
   *
   * @param {TeaModel} teaModel - Normalized tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(teaModel, coreAnalysis) {
    return this.infer(teaModel, coreAnalysis);
  }

  /**
   * Perform effect analysis
   *
   * @param {TeaModel} teaModel - Tea to analyze
   * @param {Object} coreAnalysis - Core analysis from orchestrator
   * @returns {Object} Effect analysis with dominant and supporting effects
   */
  infer(teaModel, coreAnalysis) {
    // Build effect scores by combining all influences, tracking contributors
    const { scores: effectScores, contributors } = this._buildEffectScoresWithContributors(teaModel, coreAnalysis);

    // Select top 2 effects
    const { dominant, supporting } = this._selectTopEffects(effectScores, teaModel);

    // Generate detailed reasoning from contributors
    const reasoning = this._generateDetailedReasoning(dominant, supporting, effectScores, contributors, teaModel);

    // Generate description
    const description = this._generateDescription(dominant, supporting, reasoning);

    return {
      description,
      expectedEffects: {
        dominant,
        supporting
      },
      reasoning,
      allScores: effectScores
    };
  }

  /**
   * Build effect scores using TRUE ADDITIVE TERTIARY METHOD
   *
   * Algorithm:
   * 1. Initialize all effects to 0
   * 2. Add tea type baseline (dominant: +25, secondary: +15, tertiary: +10)
   * 3. Add compound adjustments based on caffeine/theanine ratio
   * 4. Add flavor category adjustments
   * 5. Add processing/roast adjustments
   * 6. Add geography/climate adjustments (subtle, +1 to +3 only)
   * 7. Normalize to 0-100 range
   *
   * @private
   * @returns {Object} { scores: {...}, contributors: {...} }
   */
  _buildEffectScoresWithContributors(teaModel, coreAnalysis) {
    const scores = {};
    const contributors = {
      teaType: null,
      compounds: null,
      flavors: [],
      processing: null,
      geography: {}
    };

    // STEP 1: Initialize all effects to 0
    Object.keys(CORE_EFFECTS).forEach(effect => {
      scores[effect] = 0;
    });

    // STEP 2: BASELINE from Tea Type (dominant: +25, secondary: +15, tertiary: +10)
    const rawTeaType = teaModel?.type || 'unknown';
    const normalized = TeaTypeNormalizer.normalize(rawTeaType);
    const canonicalTeaType = normalized.canonical || 'unknown';

    let typeInfo = { dominant: null, secondary: null, tertiary: null };
    if (canonicalTeaType === 'puerh') {
      const pueringEffectsObj = TEA_TYPE_EFFECTS.puerh || {};
      const explicitSubType = (teaModel?.subType || '').toLowerCase().trim();
      const pueringSubtype = explicitSubType || normalized.subtype || 'sheng';
      typeInfo = pueringEffectsObj[pueringSubtype] || pueringEffectsObj.sheng || {};
      contributors.teaType = { name: canonicalTeaType, subType: pueringSubtype };
    } else {
      typeInfo = TEA_TYPE_EFFECTS[canonicalTeaType] || {};
      contributors.teaType = { name: canonicalTeaType, subType: null };
    }

    // Apply tea type baseline adjustments (additive, not multiplied)
    if (typeInfo.dominant) scores[typeInfo.dominant] = (scores[typeInfo.dominant] || 0) + 25;
    if (typeInfo.secondary) scores[typeInfo.secondary] = (scores[typeInfo.secondary] || 0) + 15;
    if (typeInfo.tertiary) scores[typeInfo.tertiary] = (scores[typeInfo.tertiary] || 0) + 10;

    // STEP 3: Compound ratio adjustments
    const caffeineLevel = teaModel?.caffeineLevel || 0;
    const lTheanineLevel = teaModel?.lTheanineLevel || 0;
    const ratio = caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 0;

    let compoundAdjustments = {};
    if (ratio >= 1.5) {
      compoundAdjustments = { calming: 12, harmonizing: 6, restorative: 4, energizing: -8 };
    } else if (ratio >= 0.8) {
      compoundAdjustments = { harmonizing: 6, focusing: 3, elevating: 2 };
    } else {
      compoundAdjustments = { energizing: 12, focusing: 6, calming: -6 };
    }

    Object.entries(compoundAdjustments).forEach(([effect, adjustment]) => {
      scores[effect] = (scores[effect] || 0) + adjustment;
    });

    contributors.compounds = {
      caffeineLevel,
      lTheanineLevel,
      ratio: ratio.toFixed(2),
      adjustments: compoundAdjustments
    };

    // STEP 4: Flavor adjustments
    const flavorData = teaModel?.flavorProfile || teaModel?.flavor?.primary || teaModel?.flavor || [];
    const normalizedFlavors = NormalizationDescriptorService.normalizeFlavorProfile(flavorData);

    const flavorAdjustmentMap = {
      Floral: { elevating: 6, harmonizing: 3, comforting: 1 },
      Fruity: { elevating: 5, energizing: 2, harmonizing: 1 },
      Vegetal: { focusing: 5, grounding: 2, energizing: 1 },
      'Nutty/Toasty': { comforting: 6, grounding: 3, restorative: 1 },
      Spicy: { energizing: 6, focusing: 3 },
      Sweet: { elevating: 5, comforting: 4, restorative: 1, calming: 1 },
      'Earthy/Mineral': { grounding: 8, harmonizing: 2, restorative: 2 },
      Woody: { grounding: 6, comforting: 3 },
      Roasted: { grounding: 6, comforting: 4, warming: 2 },
      'Umami/Marine': { focusing: 5, grounding: 3, energizing: 1 },
      'Aged/Earthy': { grounding: 8, restorative: 4 }
    };

    normalizedFlavors.forEach(flavor => {
      const category = flavor.category || flavor.referenceKey;
      const adjustments = flavorAdjustmentMap[category] || {};
      Object.entries(adjustments).forEach(([effect, value]) => {
        scores[effect] = (scores[effect] || 0) + value;
      });
      contributors.flavors.push({ originalName: flavor.originalName, category });
    });

    // STEP 5: Processing/Roast adjustments
    const processingData = (Array.isArray(teaModel?.processingMethods) ? teaModel.processingMethods : null)
      || teaModel?.processingMethods?.methods
      || teaModel?.processing?.methods
      || [];

    const roastLevel = this._determineRoastLevel(processingData);
    const roastAdjustments = {
      Charcoal: { grounding: 10, comforting: 6, restorative: 1 },
      Heavy: { grounding: 8, comforting: 5, restorative: 1 },
      Medium: { comforting: 4, harmonizing: 1, grounding: 1 },
      Light: { elevating: 5, energizing: 2, focusing: 1 },
      Minimal: { elevating: 5, focusing: 3, energizing: 1 },
      None: {}
    }[roastLevel] || {};

    Object.entries(roastAdjustments).forEach(([effect, adjustment]) => {
      scores[effect] = (scores[effect] || 0) + adjustment;
    });

    contributors.processing = { roastLevel, adjustments: roastAdjustments };

    // STEP 6: Geography adjustments (very subtle: +1 to +3 only)
    const geoData = teaModel?.geography || {};
    const altitude = geoData.altitude || 0;
    const temperature = geoData.temperature || 0;
    const humidity = geoData.humidity || 0;

    if (altitude > 1200) {
      scores.calming = (scores.calming || 0) + 2;
      scores.restorative = (scores.restorative || 0) + 1;
    }

    if (temperature < 16) {
      scores.calming = (scores.calming || 0) + 1;
    }

    if (humidity > 70) {
      scores.harmonizing = (scores.harmonizing || 0) + 1;
    }

    contributors.geography = { altitude, temperature, humidity };

    // STEP 7: Normalize scores to 0-100 range
    const allValues = Object.values(scores);
    const minScore = Math.min(...allValues);
    const maxScore = Math.max(...allValues);
    const range = Math.max(maxScore - minScore, 1);

    Object.keys(scores).forEach(effect => {
      const normalized = ((scores[effect] - minScore) / range) * 100;
      scores[effect] = Math.max(0, Math.min(100, normalized));
    });

    return { scores, contributors };
  }

  /**
   * Determine roast level from processing methods
   * @private
   */
  _determineRoastLevel(methods) {
    if (!Array.isArray(methods) || methods.length === 0) return 'None';
    const methodStr = methods.join(' ').toLowerCase();
    if (methodStr.includes('charcoal')) return 'Charcoal';
    if (methodStr.includes('heavy')) return 'Heavy';
    if (methodStr.includes('medium')) return 'Medium';
    if (methodStr.includes('light')) return 'Light';
    if (methodStr.includes('minimal')) return 'Minimal';
    if (methodStr.includes('roast')) return 'Medium';
    return 'None';
  }

  /**
   * Select top 2 effects (dominant and supporting)
   *
   * @private
   */
  _selectTopEffects(effectScores, teaModel) {
    // Sort by score descending
    const sorted = Object.entries(effectScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    // Get dominant (highest)
    const dominant = sorted[0]?.[0] || 'harmonizing';
    const dominantScore = sorted[0]?.[1] || 0;

    // Get supporting: prefer complementary effect if it scores > 0
    let supporting = null;
    let supportingScore = 0;

    // Green tea special handling for supporting effects
    // Low-caffeine greens with focusing dominant should prefer calming when it's close to energizing
    const normalized = TeaTypeNormalizer.normalize(teaModel?.type || '');
    const canonicalTeaType = normalized?.canonical || normalized;
    if (canonicalTeaType === 'green' && dominant === 'focusing') {
      const caffeineLevel = teaModel?.caffeineLevel || 0;
      if (caffeineLevel < 4.0) {
        // For low-caffeine greens, if calming and energizing are close, prefer calming
        const calmingScore = effectScores['calming'] || 0;
        const energizingScore = effectScores['energizing'] || 0;
        const harmonisingScore = effectScores['harmonizing'] || 0;

        // Only force calming if it has reasonable score and energizing is not much stronger
        // (allows energizing to win if it's significantly higher)
        if (calmingScore > 15 && energizingScore < calmingScore + 3) {
          supporting = 'calming';
          supportingScore = calmingScore;
        } else if (harmonisingScore > 0 && harmonisingScore > energizingScore && harmonisingScore > (effectScores['grounding'] || 0)) {
          supporting = 'harmonizing';
          supportingScore = harmonisingScore;
        }
      }
    }

    // If still no supporting, prefer complementary effects with positive scores
    if (!supporting) {
      const complementary = COMPLEMENTARY_EFFECTS[dominant] || [];
      for (const effect of complementary) {
        const score = effectScores[effect] || 0;
        if (score > 0 && score > supportingScore && effect !== dominant) {
          supporting = effect;
          supportingScore = score;
        }
      }
    }

    // If no complementary with positive score, use second highest overall
    if (!supporting) {
      const nonDominant = sorted.find(([eff]) => eff !== dominant);
      if (nonDominant) {
        supporting = nonDominant[0];
      }
    }

    return { dominant, supporting };
  }

  /**
   * Generate reasoning from contributors (simplified for additive algorithm)
   *
   * @private
   */
  _generateDetailedReasoning(dominant, supporting, effectScores, contributors, teaModel) {
    // Return simple reasoning structure
    return {
      dominant: `${dominant} (score: ${(effectScores[dominant] || 0).toFixed(0)}/100)`,
      supporting: `${supporting} (score: ${(effectScores[supporting] || 0).toFixed(0)}/100)`,
      contributors: {
        teaType: contributors.teaType?.name,
        compounds: contributors.compounds?.profile
      }
    };
  }

  /**
   * @deprecated Use _generateDetailedReasoning instead
   * Kept for backward compatibility
   */
  _generateReasoning(dominant, supporting, effectScores, coreAnalysis) {
    return {
      dominant: `${dominant} tendency`,
      supporting: `Complementary to ${dominant}`
    };
  }

  /**
   * Generate human-readable description with contextual reasoning
   * Explains WHY the tea has these effects based on its characteristics
   *
   * @private
   */
  _generateDescription(dominant, supporting, reasoning) {
    const dominantDesc = CORE_EFFECTS[dominant] || dominant;
    const supportingDesc = CORE_EFFECTS[supporting] || supporting;

    // Build a more compelling narrative that explains the WHY
    const explanationParts = [];

    // Start with dominant effect
    explanationParts.push(`This tea's dominant effect is **${dominant}** — ${dominantDesc.toLowerCase()}`);

    // Add supporting effect context
    explanationParts.push(`supported by **${supporting}** characteristics — ${supportingDesc.toLowerCase()}`);

    // Create effect profile name
    const effectProfile = this._getEffectProfileName(dominant, supporting);

    return {
      summary: `${effectProfile}`,
      detailed: `${explanationParts.join(', ')}. The effect profile is shaped by the tea's compound balance (${reasoning.dominant}) and enhanced by its natural characteristics (${reasoning.supporting}).`,
      dominant: {
        effect: dominant,
        description: dominantDesc,
        reasoning: reasoning.dominant
      },
      supporting: {
        effect: supporting,
        description: supportingDesc,
        reasoning: reasoning.supporting
      }
    };
  }

  /**
   * Create a friendly name for effect combinations
   * @private
   */
  _getEffectProfileName(dominant, supporting) {
    const combinations = {
      'energizing+focusing': 'Alert & Sharp',
      'energizing+elevating': 'Vibrant & Uplifted',
      'energizing+grounding': 'Energized & Grounded',
      'calming+grounding': 'Grounded & Peaceful',
      'calming+harmonizing': 'Harmonious & Peaceful',
      'calming+restorative': 'Restorative & Calm',
      'focusing+harmonizing': 'Focused & Balanced',
      'focusing+elevating': 'Focused & Inspired',
      'harmonizing+elevating': 'Harmonious & Uplifted',
      'grounding+comforting': 'Grounded & Warm',
      'restorative+comforting': 'Restful & Comforting',
      'elevating+harmonizing': 'Elevating & Balanced'
    };

    const key = `${dominant}+${supporting}`;
    return combinations[key] || `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} & ${supporting.charAt(0).toUpperCase() + supporting.slice(1)}`;
  }

  /**
   * Serialize inference for JSON output
   */
  serialize(inference) {
    return {
      description: inference?.description || '',
      expectedEffects: inference?.expectedEffects || { dominant: 'unknown', supporting: 'unknown' },
      reasoning: inference?.reasoning || {}
    };
  }

  /**
   * Format inference for markdown display
   */
  formatMarkdown(inference) {
    if (!inference || !inference.expectedEffects) {
      return '## Expected Effects\n\nNo effect analysis available.';
    }

    const { expectedEffects, reasoning } = inference;

    let md = '## Expected Effects\n\n';
    md += `**Dominant**: ${this.capitalize(expectedEffects.dominant)}\n`;
    md += `**Supporting**: ${this.capitalize(expectedEffects.supporting)}\n\n`;

    md += '### Effect Reasoning\n';
    md += `- **Dominant Effect**: ${reasoning.dominant}\n`;
    md += `- **Supporting Effect**: ${reasoning.supporting}\n`;

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
export const effectService = new EffectService();
