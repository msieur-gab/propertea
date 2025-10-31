/**
 * EffectService.js
 *
 * Calculates expected tea effects (dominant and supporting)
 * Based on: tea type, compounds (caffeine/L-theanine), flavor profile, processing, and geographic/climate factors
 *
 * Input: TeaModel + Core analysis (compounds, flavor, processing, teaType, geography)
 * Output: Expected effects with dominant/supporting effect names and detailed reasoning with sources
 *
 * Five-Factor Algorithm:
 * 1. Tea Type (2.5x weight) - Inherent effect profile of tea variety
 * 2. Compounds (2.0-2.8x weight) - Caffeine/L-theanine profile and their effects
 * 3. Flavor (2.0x weight) - Flavor notes and their associated effects (from reference descriptors)
 * 4. Processing (1.5x weight) - Processing methods (from reference descriptors)
 * 5. Geography (2.0x weight) - Altitude, temperature, humidity, solar radiation (from reference descriptors)
 *
 * Uses ReferenceDescriptorService and NormalizationDescriptorService to:
 * - Map dataset inputs to authoritative reference descriptors
 * - Track contributors for detailed reasoning
 * - Return descriptions from reference files
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
   * Build effect scores by combining all influences, tracking contributors
   *
   * This method uses ReferenceDescriptorService and NormalizationDescriptorService
   * to ensure all effects come from authoritative reference descriptors.
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
      processing: [],
      geography: {}
    };

    // Initialize all effects to 0
    Object.keys(CORE_EFFECTS).forEach(effect => {
      scores[effect] = 0;
    });

    // STEP 1: Normalize and apply tea type base effects (weight: 2.5x)
    const teaTypeWeight = 2.5;
    const rawTeaType = teaModel?.type || 'unknown';
    const normalized = TeaTypeNormalizer.normalize(rawTeaType);
    const canonicalTeaType = normalized.canonical || 'unknown';

    let baseEffects = {};
    if (canonicalTeaType === 'puerh') {
      const pueringEffectsObj = TEA_TYPE_EFFECTS.puerh || {};
      const explicitSubType = (teaModel?.subType || '').toLowerCase().trim();
      const pueringSubtype = explicitSubType || normalized.subtype || 'sheng';
      baseEffects = pueringEffectsObj[pueringSubtype] || pueringEffectsObj.sheng || {};
    } else {
      baseEffects = TEA_TYPE_EFFECTS[canonicalTeaType] || {};
    }

    contributors.teaType = {
      name: canonicalTeaType,
      subType: canonicalTeaType === 'puerh' ? (teaModel?.subType || 'sheng') : null,
      effects: baseEffects,
      description: ReferenceDescriptorService.getTeaTypeDescription(canonicalTeaType)
    };

    Object.entries(baseEffects).forEach(([effect, score]) => {
      scores[effect] = (scores[effect] || 0) + score * teaTypeWeight;
    });

    // GREEN TEA DIFFERENTIATION: Apply caffeine-level-based branching
    // Matcha/high caffeine greens (≥4.5) → focusing should dominate
    // Sencha/medium caffeine (3.5-4.5) → energizing base effect wins
    // Low caffeine greens (<3.5) → calming/focusing balance
    if (canonicalTeaType === 'green') {
      const caffeineLevel = teaModel?.caffeineLevel || 0;
      if (caffeineLevel >= 4.5) {
        // High caffeine green (Matcha, strong greens) → strongly boost focusing
        scores.focusing = (scores.focusing || 0) + 8;
        scores.energizing = (scores.energizing || 0) - 5;
        scores.elevating = (scores.elevating || 0) - 3;
      } else if (caffeineLevel >= 3.8) {
        // Medium caffeine (Sencha-like) → moderate boost to energizing
        scores.energizing = (scores.energizing || 0) + 4;
        scores.focusing = (scores.focusing || 0) - 1;
      } else if (caffeineLevel > 0) {
        // Low caffeine (<3.8) → reduce energizing, let calming/harmonizing win
        scores.energizing = (scores.energizing || 0) - 3;
        scores.calming = (scores.calming || 0) + 2;
        scores.harmonizing = (scores.harmonizing || 0) + 1;
      }
    }

    // RED TEA DIFFERENTIATION: Handle smoked reds (Lapsang Souchong)
    // Most other reds stay energizing by default
    if (canonicalTeaType === 'red') {
      const processingData = (Array.isArray(teaModel?.processingMethods) ? teaModel.processingMethods : null)
        || teaModel?.processingMethods?.methods || [];
      const processingStr = processingData.join(' ').toLowerCase();

      // Smoked reds (Lapsang Souchong) → comforting/grounding instead of energizing
      if (processingStr.includes('smoked')) {
        scores.comforting = (scores.comforting || 0) + 6;
        scores.grounding = (scores.grounding || 0) + 4;
        scores.energizing = (scores.energizing || 0) - 5;
        scores.focusing = (scores.focusing || 0) - 2;
      }
    }

    // PUERH DIFFERENTIATION: Sheng (young/raw) vs Shou (aged/ripe)
    if (canonicalTeaType === 'puerh') {
      const pueringSubtype = (teaModel?.subType || '').toLowerCase().trim();

      // Sheng (young) expects energizing/focusing
      if (pueringSubtype === 'sheng' || !pueringSubtype) {
        scores.energizing = (scores.energizing || 0) + 10;
        scores.focusing = (scores.focusing || 0) - 5;
        scores.comforting = (scores.comforting || 0) - 5;
        scores.grounding = (scores.grounding || 0) - 2;
      }
      // Shou (aged/ripe) expects grounding/comforting (already in base effects)
      else if (pueringSubtype === 'shou') {
        scores.grounding = (scores.grounding || 0) + 3;
        scores.comforting = (scores.comforting || 0) + 2;
        scores.energizing = (scores.energizing || 0) - 2;
      }
    }

    // STEP 2: Normalize and apply compound-based modifiers (weight: 2.0-2.8x)
    const normalizedCompounds = NormalizationDescriptorService.normalizeCompounds(
      teaModel?.caffeineLevel,
      teaModel?.lTheanineLevel
    );

    const compoundWeight = (normalizedCompounds.relaxationLevel === 'Very High' || normalizedCompounds.relaxationLevel === 'High' ||
      normalizedCompounds.stimulationLevel === 'Very High' || normalizedCompounds.stimulationLevel === 'High') ? 2.8 : 2.0;

    contributors.compounds = {
      profile: normalizedCompounds.profile,
      stimulationLevel: normalizedCompounds.stimulationLevel,
      relaxationLevel: normalizedCompounds.relaxationLevel,
      caffeineLevel: normalizedCompounds.caffeineLevel,
      lTheanineLevel: normalizedCompounds.lTheanineLevel,
      effects: normalizedCompounds.effects,
      description: normalizedCompounds.description
    };

    Object.entries(normalizedCompounds.effects).forEach(([effect, modifier]) => {
      scores[effect] = (scores[effect] || 0) + modifier * compoundWeight;
    });

    // STEP 3: Normalize and apply flavor-based effects (weight: 2.0x)
    // Use actual flavor profile from teaModel instead of pre-categorized coreAnalysis
    // Handle multiple possible field names for flavor data
    const flavorWeight = 2.0;
    const flavorData = teaModel?.flavorProfile || teaModel?.flavor?.primary || teaModel?.flavor || [];
    const normalizedFlavors = NormalizationDescriptorService.normalizeFlavorProfile(flavorData);

    contributors.flavors = normalizedFlavors.map(f => ({
      originalName: f.originalName,
      referenceKey: f.referenceKey,
      category: f.category,
      effects: f.effects,
      description: f.description
    }));

    normalizedFlavors.forEach(flavor => {
      Object.entries(flavor.effects || {}).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * flavorWeight;
      });
    });

    // STEP 4: Normalize and apply processing method effects (weight: 1.5x)
    // Use actual processing methods from teaModel
    // Handle multiple possible field names for processing data
    const processingWeight = 1.5;
    const processingData = (Array.isArray(teaModel?.processingMethods) ? teaModel.processingMethods : null)
      || teaModel?.processingMethods?.methods
      || teaModel?.processing?.methods
      || [];
    const normalizedProcessing = NormalizationDescriptorService.normalizeProcessingMethods(processingData);

    contributors.processing = normalizedProcessing.map(p => ({
      originalName: p.originalName,
      referenceKey: p.referenceKey,
      category: p.category,
      effects: p.effects,
      description: p.description
    }));

    normalizedProcessing.forEach(method => {
      Object.entries(method.effects || {}).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * processingWeight;
      });
    });

    // STEP 5: Normalize and apply geographic/climate factors (weight: 2.0x)
    const geographicWeight = 2.0;
    const normalizedGeo = NormalizationDescriptorService.normalizeGeography(
      teaModel?.geography || {}
    );

    // Apply altitude effects
    if (normalizedGeo.altitude) {
      contributors.geography.altitude = {
        value: normalizedGeo.altitude.value,
        level: normalizedGeo.altitude.level,
        description: normalizedGeo.altitude.description,
        effects: normalizedGeo.altitude.effects
      };

      Object.entries(normalizedGeo.altitude.effects || {}).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
      });
    }

    // Apply temperature effects
    if (normalizedGeo.temperature) {
      contributors.geography.temperature = {
        value: normalizedGeo.temperature.value,
        level: normalizedGeo.temperature.level,
        description: normalizedGeo.temperature.description,
        effects: normalizedGeo.temperature.effects
      };

      Object.entries(normalizedGeo.temperature.effects || {}).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
      });
    }

    // Apply humidity effects
    if (normalizedGeo.humidity) {
      contributors.geography.humidity = {
        value: normalizedGeo.humidity.value,
        level: normalizedGeo.humidity.level,
        description: normalizedGeo.humidity.description,
        effects: normalizedGeo.humidity.effects
      };

      Object.entries(normalizedGeo.humidity.effects || {}).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
      });
    }

    // Apply solar radiation effects
    if (normalizedGeo.solarRadiation) {
      contributors.geography.solarRadiation = {
        value: normalizedGeo.solarRadiation.value,
        level: normalizedGeo.solarRadiation.level,
        description: normalizedGeo.solarRadiation.description,
        effects: normalizedGeo.solarRadiation.effects
      };

      Object.entries(normalizedGeo.solarRadiation.effects || {}).forEach(([effect, modifier]) => {
        scores[effect] = (scores[effect] || 0) + modifier * geographicWeight;
      });
    }

    // Ensure all scores are at least 0
    Object.keys(scores).forEach(effect => {
      scores[effect] = Math.max(0, scores[effect]);
    });

    return {
      scores,
      contributors
    };
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
   * Generate detailed reasoning from contributors
   * Uses authoritative descriptions from reference descriptor files
   *
   * @private
   */
  _generateDetailedReasoning(dominant, supporting, effectScores, contributors, teaModel) {
    const detailedReasons = [];

    // Tea type contribution
    if (contributors.teaType) {
      const typeReason = `Tea Type: ${contributors.teaType.name}${contributors.teaType.subType ? ` (${contributors.teaType.subType})` : ''} contributes ${Object.keys(contributors.teaType.effects).join(', ')} effects.`;
      detailedReasons.push(typeReason);
      if (contributors.teaType.description) {
        detailedReasons.push(`  • ${contributors.teaType.description}`);
      }
    }

    // Compound contribution
    if (contributors.compounds) {
      const compoundReason = `Compounds: ${contributors.compounds.profile} (Caffeine: ${contributors.compounds.caffeineLevel}/10, L-Theanine: ${contributors.compounds.lTheanineLevel}/10)`;
      detailedReasons.push(compoundReason);
      if (contributors.compounds.description) {
        detailedReasons.push(`  • ${contributors.compounds.description}`);
      }
    }

    // Flavor contribution
    if (contributors.flavors.length > 0) {
      const flavorNames = contributors.flavors.map(f => f.originalName).join(', ');
      detailedReasons.push(`Flavors: ${flavorNames}`);
      contributors.flavors.forEach(flavor => {
        const effectsList = Object.keys(flavor.effects).join(', ');
        detailedReasons.push(`  • ${flavor.originalName} (mapped to ${flavor.referenceKey}): contributes ${effectsList}`);
        if (flavor.description) {
          detailedReasons.push(`    ${flavor.description}`);
        }
      });
    }

    // Processing contribution
    if (contributors.processing.length > 0) {
      const processingNames = contributors.processing.map(p => p.originalName).join(', ');
      detailedReasons.push(`Processing Methods: ${processingNames}`);
      contributors.processing.forEach(method => {
        const effectsList = Object.keys(method.effects).join(', ');
        detailedReasons.push(`  • ${method.originalName} (${method.referenceKey}): contributes ${effectsList}`);
        if (method.description) {
          detailedReasons.push(`    ${method.description}`);
        }
      });
    }

    // Geography contribution
    if (Object.keys(contributors.geography).length > 0) {
      detailedReasons.push('Geography & Climate:');
      if (contributors.geography.altitude) {
        const altData = contributors.geography.altitude;
        detailedReasons.push(`  • Altitude (${altData.value}m, ${altData.level} elevation): ${Object.keys(altData.effects).join(', ')}`);
        if (altData.description) {
          detailedReasons.push(`    ${altData.description}`);
        }
      }
      if (contributors.geography.temperature) {
        const tempData = contributors.geography.temperature;
        detailedReasons.push(`  • Temperature (${tempData.value}°C, ${tempData.level}): ${Object.keys(tempData.effects).join(', ')}`);
        if (tempData.description) {
          detailedReasons.push(`    ${tempData.description}`);
        }
      }
      if (contributors.geography.humidity) {
        const humData = contributors.geography.humidity;
        detailedReasons.push(`  • Humidity (${humData.value}%, ${humData.level}): ${Object.keys(humData.effects).join(', ')}`);
        if (humData.description) {
          detailedReasons.push(`    ${humData.description}`);
        }
      }
      if (contributors.geography.solarRadiation) {
        const solData = contributors.geography.solarRadiation;
        detailedReasons.push(`  • Solar Radiation (${solData.value} W/m², ${solData.level}): ${Object.keys(solData.effects).join(', ')}`);
        if (solData.description) {
          detailedReasons.push(`    ${solData.description}`);
        }
      }
    }

    // Create summary sentences for dominant and supporting
    const dominantScore = effectScores[dominant] || 0;
    const supportingScore = effectScores[supporting] || 0;

    let dominantSummary = `${dominant} is the dominant effect (score: ${dominantScore.toFixed(1)})`;
    let supportingSummary = `${supporting} is the supporting effect (score: ${supportingScore.toFixed(1)})`;

    // Add contribution source to summary
    if (contributors.teaType?.effects[dominant]) {
      dominantSummary += ` driven primarily by the ${contributors.teaType.name} tea type`;
    }
    if (contributors.compounds?.effects[dominant]) {
      dominantSummary += ` reinforced by ${contributors.compounds.profile} compound profile`;
    }

    return {
      dominant: dominantSummary,
      supporting: supportingSummary,
      contributors: contributors,
      detailed: detailedReasons.join('\n')
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
