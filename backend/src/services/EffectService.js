/**
 * EffectService.js
 *
 * Calculates expected tea effects (dominant and supporting)
 * Based on: tea type, compounds (caffeine/L-theanine), flavor profile, processing, and geographic/climate factors
 *
 * Input: TeaModel + Core analysis (compounds, flavor, processing, teaType, geography)
 * Output: Expected effects with dominant/supporting effect names and reasoning
 *
 * Five-Factor Algorithm:
 * 1. Tea Type (2.5x weight) - Inherent effect profile of tea variety
 * 2. Compounds (2.0-2.8x weight) - Caffeine/L-theanine profile and their effects
 * 3. Flavor (2.0x weight) - Flavor notes and their associated effects
 * 4. Processing (1.5x weight) - Roast level and processing methods
 * 5. Geography (2.0x weight) - Altitude, temperature, humidity, solar radiation
 */

import { TeaTypeNormalizer } from '../utils/TeaTypeNormalizer.js';

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
  green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 },  // Priority 1: reduce focusing 7→6, increase calming 2→4
  white: { restorative: 8, calming: 6, comforting: 5, harmonizing: 5, focusing: 3, elevating: 4 },  // Priority 1: add comforting: 5
  yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 },
  oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 },
  red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 },  // hongcha (红茶) - Priority 1 rebalance: energizing 5→6, grounding 6→4, comforting 5→6, focusing 5→4, harmonizing 4→3
  dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 },  // heicha (黑茶) - fermented/post-fermented teas (Liu Bao, An Hua, Fu Zhuan)
  puerh: {
    sheng: { energizing: 5, focusing: 6, harmonizing: 5, grounding: 6 },      // 生普 - raw/young puerh
    shou: { grounding: 9, harmonizing: 5, comforting: 8, restorative: 4 }     // 熟普 - ripe/aged puerh
  }
};

// Effect modifiers based on compound profiles
const COMPOUND_EFFECT_MODIFIERS = {
  'Very High Caffeine': { energizing: 2, focusing: 2, grounding: -1, calming: -2 },
  'High Caffeine': { energizing: 1, focusing: 1, calming: -1 },
  'Moderate Caffeine': { energizing: 0.5, focusing: 0.5 },
  'Very High L-Theanine': { calming: 4, harmonizing: 2, restorative: 1.5, elevating: 1 },  // Priority 1: increase calming 3→4
  'High L-Theanine': { calming: 3, harmonizing: 1, restorative: 0.5, comforting: 0.5 },  // Priority 1: increase calming 2→3
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
  Charcoal: { grounding: 3, comforting: 2, warming: 1 },
  Heavy: { grounding: 2.5, comforting: 1.5, warming: 0.5 },
  Medium: { comforting: 0.5, harmonizing: 0.5 },
  Light: { energizing: 0.5, elevating: 0.5 },
  Minimal: { elevating: 0.5, focusing: 0.5 },
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
    high: { elevating: 0.6, calming: 0.4, restorative: 0.5 }    // 1200-1800m - delicate, sweet
  },
  temperature: {
    // Temperature in Celsius - affects amino acid vs catechin balance
    veryLow: { calming: 0.5, restorative: 0.4, focusing: 0.1 },  // < 10°C - high L-theanine
    low: { calming: 0.4, restorative: 0.3, elevating: 0.2 },     // 10-16°C - delicate, aromatic
    moderate: { harmonizing: 0.3, elevating: 0.3, focusing: 0.1 }, // 16-22°C - balanced
    high: { energizing: 0.3, focusing: 0.2, grounding: 0.1 },     // 22-28°C - stronger flavors
    veryHigh: { energizing: 0.4, grounding: 0.3, comforting: 0.1 } // > 28°C - rapid growth
  },
  humidity: {
    // Humidity as percentage - affects growth rate and amino acid development
    veryLow: { energizing: 0.2, focusing: 0.2 },                // < 40% - stressed growth
    low: { energizing: 0.15, focusing: 0.1 },                   // 40-55% - pronounced intensity
    moderate: { harmonizing: 0.2, elevating: 0.1 },             // 55-70% - balanced
    high: { elevating: 0.3, harmonizing: 0.2, calming: 0.15 },  // 70-85% - mist effect, amino acids
    veryHigh: { calming: 0.3, restorative: 0.2, harmonizing: 0.15 } // > 85% - very smooth
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
    // Build effect scores by combining all influences
    const effectScores = this._buildEffectScores(teaModel, coreAnalysis);

    // Select top 2 effects
    const { dominant, supporting } = this._selectTopEffects(effectScores);

    // Generate reasoning
    const reasoning = this._generateReasoning(dominant, supporting, effectScores, coreAnalysis);

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
   * Build effect scores by combining all influences
   *
   * @private
   */
  _buildEffectScores(teaModel, coreAnalysis) {
    const scores = {};

    // Initialize all effects to 0
    Object.keys(CORE_EFFECTS).forEach(effect => {
      scores[effect] = 0;
    });

    // Determine compound characteristics for dynamic weighting
    const stimulationLevel = coreAnalysis?.compounds?.analysis?.stimulationLevel || '';
    const relaxationLevel = coreAnalysis?.compounds?.analysis?.relaxationLevel || '';

    // Calculate weight adjustments based on compound extremeness
    // When compounds are extreme, they should override base tea type effects
    const isExtremeRelaxation = relaxationLevel === 'Very High' || relaxationLevel === 'High';
    const isExtremeStimulation = stimulationLevel === 'Very High' || stimulationLevel === 'High';
    const isExtreme = isExtremeRelaxation || isExtremeStimulation;

    // Dynamic weighting: when compounds are extreme, boost compound weight moderately
    const teaTypeWeight = 2.5;
    const compoundWeight = isExtreme ? 2.8 : 2;

    // 1. Apply tea type base effects
    // Normalize tea type from any input format (Western or Chinese)
    const rawTeaType = teaModel?.type || 'unknown';
    const normalized = TeaTypeNormalizer.normalize(rawTeaType);
    const canonicalTeaType = normalized.canonical || 'unknown';
    const normalizedSubtype = normalized.subtype || '';

    // Determine base effects based on tea type and subtype
    let baseEffects = {};

    if (canonicalTeaType === 'puerh') {
      // For puerh, get effects from nested structure: puerh.sheng or puerh.shou
      const pueringEffectsObj = TEA_TYPE_EFFECTS.puerh || {};

      // Get subtype: explicit subType has priority
      const explicitSubType = (teaModel?.subType || '').toLowerCase().trim();
      const pueringSubtype = explicitSubType || normalizedSubtype || 'sheng';

      // Get effects for this puerh subtype
      baseEffects = pueringEffectsObj[pueringSubtype] || pueringEffectsObj.sheng || {};
    } else {
      // For other tea types, simple lookup
      baseEffects = TEA_TYPE_EFFECTS[canonicalTeaType] || {};
    }

    Object.entries(baseEffects).forEach(([effect, score]) => {
      scores[effect] = (scores[effect] || 0) + score * teaTypeWeight;
    });

    // 2. Apply compound-based modifiers
    let compoundModifier = {};

    if (isExtremeRelaxation) {
      compoundModifier = relaxationLevel === 'Very High'
        ? COMPOUND_EFFECT_MODIFIERS['Very High L-Theanine']
        : COMPOUND_EFFECT_MODIFIERS['High L-Theanine'];
    } else if (relaxationLevel === 'Moderate') {
      compoundModifier = COMPOUND_EFFECT_MODIFIERS['High L-Theanine'];
      // Don't boost weight for moderate compounds
    } else if (isExtremeStimulation) {
      compoundModifier = COMPOUND_EFFECT_MODIFIERS['Very High Caffeine'];
    } else if (stimulationLevel === 'Moderate') {
      compoundModifier = COMPOUND_EFFECT_MODIFIERS['Moderate Caffeine'];
    } else if (relaxationLevel === 'Low' && stimulationLevel === 'Low') {
      compoundModifier = COMPOUND_EFFECT_MODIFIERS['Balanced'];
    }

    Object.entries(compoundModifier).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * compoundWeight;
    });

    // 3. Apply flavor-based effects (weight: 2)
    const flavorCategories = coreAnalysis?.flavor?.profile?.categories || [];
    flavorCategories.forEach(category => {
      const flavorEffects = FLAVOR_EFFECT_MAP[category] || {};
      Object.entries(flavorEffects).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * 2;
      });
    });

    // 4. Apply processing roast level modifiers (weight: 1.5)
    const roastLevel = coreAnalysis?.processing?.roastLevel || 'Unknown';
    const roastModifier = ROAST_LEVEL_MODIFIERS[roastLevel] || {};
    Object.entries(roastModifier).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * 1.5;
    });

    // 5. Apply geographic/climate factors (weight: 2.0)
    // Geographic factors create terroir - equally important as flavor profile
    // Altitude, temperature, humidity, and solar radiation fundamentally shape tea development
    const geographicWeight = 2.0;
    const climate = coreAnalysis?.geography?.climate || {};

    // Altitude effect (in meters) - use raw numeric value from GeographyService
    // Using correct thresholds from GeographicalDescriptors: 300, 600, 1200, 1800
    const altitude = climate.altitude_value !== undefined ? climate.altitude_value : 600;
    let altitudeModifier = {};
    if (altitude < 300) altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.veryLow;
    else if (altitude < 600) altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.low;
    else if (altitude < 1200) altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.medium;
    else altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.high;

    Object.entries(altitudeModifier).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
    });

    // Temperature effect (in Celsius) - use raw numeric value from GeographyService
    // Using correct thresholds from GeographicalDescriptors: 10, 16, 22, 28
    const temperature = climate.temperature_value !== undefined ? climate.temperature_value : 16;
    let temperatureModifier = {};
    if (temperature < 10) temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.veryLow;
    else if (temperature < 16) temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.low;
    else if (temperature < 22) temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.moderate;
    else if (temperature < 28) temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.high;
    else temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.veryHigh;

    Object.entries(temperatureModifier).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
    });

    // Humidity effect (as percentage) - use raw numeric value from GeographyService
    // Using correct thresholds from GeographicalDescriptors: 40, 55, 70, 85
    const humidity = climate.humidity_value !== undefined ? climate.humidity_value : 70;
    let humidityModifier = {};
    if (humidity < 40) humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.veryLow;
    else if (humidity < 55) humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.low;
    else if (humidity < 70) humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.moderate;
    else if (humidity <= 85) humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.high;
    else humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.veryHigh;

    Object.entries(humidityModifier).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
    });

    // Solar radiation effect (in W/m²) - use raw numeric value from GeographyService
    // Using correct thresholds from GeographicalDescriptors: 130, 170, 210, 250
    const solarRadiation = climate.solarRadiation_value !== undefined ? climate.solarRadiation_value : 175;
    let radiationModifier = {};
    if (solarRadiation < 130) radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.veryLow;
    else if (solarRadiation < 170) radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.low;
    else if (solarRadiation < 210) radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.moderate;
    else if (solarRadiation <= 250) radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.high;
    else radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.veryHigh;

    Object.entries(radiationModifier).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
    });

    // Ensure all scores are at least 0
    Object.keys(scores).forEach(effect => {
      scores[effect] = Math.max(0, scores[effect]);
    });

    return scores;
  }

  /**
   * Select top 2 effects (dominant and supporting)
   *
   * @private
   */
  _selectTopEffects(effectScores) {
    // Sort by score descending
    const sorted = Object.entries(effectScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    // Get dominant (highest)
    const dominant = sorted[0]?.[0] || 'harmonizing';
    const dominantScore = sorted[0]?.[1] || 0;

    // Get supporting: prefer highest-scoring complementary effect
    let supporting = 'calming';
    let supportingScore = 0;

    // Prefer complementary effects if they have meaningful scores (> 0)
    const complementary = COMPLEMENTARY_EFFECTS[dominant] || [];
    for (const effect of complementary) {
      const score = effectScores[effect] || 0;
      if (score > supportingScore && effect !== dominant) {
        supporting = effect;
        supportingScore = score;
      }
    }

    // If no good complementary found, use second highest overall
    if (supportingScore === 0) {
      const nonDominant = sorted.find(([eff]) => eff !== dominant);
      if (nonDominant) {
        supporting = nonDominant[0];
        supportingScore = nonDominant[1];
      }
    }

    return { dominant, supporting };
  }

  /**
   * Generate reasoning for the selected effects
   *
   * @private
   */
  _generateReasoning(dominant, supporting, effectScores, coreAnalysis) {
    const reasons = {
      dominant: [],
      supporting: []
    };

    const rawTeaType = coreAnalysis?._sourceTea?.type || 'unknown';
    const normalizedType = TeaTypeNormalizer.normalize(rawTeaType);
    const canonicalTeaType = normalizedType.canonical || 'unknown';

    const flavorCategories = coreAnalysis?.flavor?.profile?.categories || [];
    const stimulationLevel = coreAnalysis?.compounds?.analysis?.stimulationLevel || '';
    const relaxationLevel = coreAnalysis?.compounds?.analysis?.relaxationLevel || '';
    const roastLevel = coreAnalysis?.processing?.roastLevel || '';
    const climate = coreAnalysis?.geography?.climate || {};
    const altitude = climate.altitude || 0;
    const temperature = climate.temperature || 15;
    const humidity = climate.humidity || 70;

    // Dominant effect reasoning
    if (canonicalTeaType === 'oolong' && dominant === 'elevating') {
      reasons.dominant.push('Oolong base effect (elevating tendency)');
    }

    if (flavorCategories.includes('Floral') && ['elevating', 'harmonizing'].includes(dominant)) {
      reasons.dominant.push('Floral flavor profile');
    }

    if (relaxationLevel && ['calming', 'restorative'].includes(dominant)) {
      reasons.dominant.push(`High L-theanine (${relaxationLevel} relaxation)`);
    }

    if (stimulationLevel && ['energizing', 'focusing'].includes(dominant)) {
      reasons.dominant.push(`Caffeine presence (${stimulationLevel} stimulation)`);
    }

    // Geographic reasoning for dominant effect
    if (altitude >= 1000 && ['elevating', 'harmonizing'].includes(dominant)) {
      reasons.dominant.push(`High altitude cultivation (${altitude}m)`);
    }

    if (temperature < 15 && ['calming', 'harmonizing'].includes(dominant)) {
      reasons.dominant.push(`Cool mountain climate (${temperature}°C)`);
    }

    if (humidity > 75 && ['elevating', 'harmonizing'].includes(dominant)) {
      reasons.dominant.push(`High humidity environment (${humidity}%)`);
    }

    // Supporting effect reasoning
    if (relaxationLevel === 'High' && supporting === 'calming') {
      reasons.supporting.push(`L-theanine profile (${relaxationLevel} relaxation)`);
    }

    if (roastLevel && roastLevel !== 'None' && roastLevel !== 'Unknown') {
      if (['grounding', 'comforting'].includes(supporting)) {
        reasons.supporting.push(`${roastLevel} roast level`);
      }
    }

    if (flavorCategories.length > 1) {
      reasons.supporting.push('Multiple flavor dimensions');
    }

    // Geographic reasoning for supporting effect
    if (humidity > 75 && ['harmonizing', 'elevating'].includes(supporting)) {
      reasons.supporting.push('Mountain mist terrain enhances refinement');
    }

    return {
      dominant: reasons.dominant.length > 0 ? reasons.dominant[0] : `${dominant} tendency`,
      supporting: reasons.supporting.length > 0 ? reasons.supporting[0] : `Complementary to ${dominant}`
    };
  }

  /**
   * Generate human-readable description
   *
   * @private
   */
  _generateDescription(dominant, supporting, reasoning) {
    const dominantDesc = CORE_EFFECTS[dominant] || dominant;
    const supportingDesc = CORE_EFFECTS[supporting] || supporting;

    return `This tea's dominant effect is ${dominant} (${dominantDesc.toLowerCase()}), supported by ${supporting} characteristics (${supportingDesc.toLowerCase()}). The effect profile is shaped by ${reasoning.dominant} and enhanced by ${reasoning.supporting}.`;
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
