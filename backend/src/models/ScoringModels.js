/**
 * ScoringModels.js - WEIGHTED NORMALIZED SCORING SYSTEM
 *
 * This module provides normalized 0-1 scoring functions for each factor that influences
 * tea effects. Each factor independently scores an effect, then scores are combined
 * using explicit weights for transparency and calibration.
 *
 * ADVANTAGES over additive:
 * - Transparent weighting: explicit factor weights make assumptions clear
 * - Normalized scoring: each factor produces 0-1 scale, no inflation
 * - Confidence-ready: enables uncertainty quantification
 * - Calibration-friendly: can adjust weights based on validation
 * - Easier testing: each factor can be tested independently
 *
 * ALGORITHM:
 * 1. For each effect and tea, calculate normalized score (0-1) from each factor
 * 2. Combine with weights: weighted_sum = Σ(score_i × weight_i)
 * 3. Return score as 0-100 with confidence bounds
 *
 * WEIGHTS (currently equal for type+compounds+geography, lower for processing+flavor):
 * - Tea Type: 0.25 (primary driver, most reliable)
 * - Compounds: 0.25 (direct physiological effect, reliable)
 * - Geography: 0.25 (terroir/origin, elevated from 1-3% to 25%)
 * - Processing: 0.15 (secondary modifier)
 * - Flavor Profile: 0.10 (correlate, not direct cause)
 *
 * VALIDATION NOTES:
 * - These scoring functions are scaffolding and MUST be validated against known teas
 * - Geographic adjustments are estimates and need tea science literature validation
 * - Test this against 20+ known teas to ensure results match expert opinion
 */

import { TeaTypeNormalizer } from '../utils/TeaTypeNormalizer.js';

// ============================================================================
// FACTOR WEIGHTS - Tune these based on validation results
// ============================================================================

export const EFFECT_SCORING_WEIGHTS = {
  teaType: 0.25,       // Primary driver
  compounds: 0.25,     // Direct physiological effect
  geography: 0.25,     // Terroir elevation (was 1-3%, now 25%)
  processing: 0.15,    // Secondary modifier
  flavor: 0.10         // Correlative
};

// Ensure weights sum to 1.0
const totalWeight = Object.values(EFFECT_SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(totalWeight - 1.0) > 0.001) {
  console.warn(`⚠️ EFFECT_SCORING_WEIGHTS sum to ${totalWeight}, not 1.0. Normalize!`);
}

// ============================================================================
// CORE EFFECTS DEFINITIONS
// ============================================================================

export const CORE_EFFECTS = {
  energizing: 'Mental and physical energy, alertness, vitality',
  calming: 'Relaxation and stress reduction',
  focusing: 'Mental clarity and concentration',
  harmonizing: 'Equilibrium between opposing forces',
  grounding: 'Stability and connection to the present',
  elevating: 'Mood lift and transcendent experiences',
  comforting: 'Warmth, security, and emotional support',
  restorative: 'Recovery and renewal'
};

// ============================================================================
// FACTOR 1: TEA TYPE SCORING (Weight: 0.25)
//
// Each tea type has inherent effect characteristics based on:
// - Caffeine/L-theanine ratio typical for the type
// - Traditional use and user experience
// - Chemical composition patterns
//
// VALIDATION NEEDED:
// - Get expert tea sommeliers to rate these
// - Compare against user feedback data
// - Test against reference teas
// ============================================================================

export const TEA_TYPE_EFFECT_SCORES = {
  // GREEN TEA: Energizing, Focusing (due to high caffeine, moderate L-theanine)
  green: {
    energizing: 0.80,
    focusing: 0.75,
    calming: 0.30,
    harmonizing: 0.50,
    grounding: 0.20,
    elevating: 0.60,
    comforting: 0.40,
    restorative: 0.30
  },

  // WHITE TEA: Calming, Restorative (high L-theanine, lower caffeine)
  white: {
    energizing: 0.40,
    focusing: 0.45,
    calming: 0.65,
    harmonizing: 0.60,
    grounding: 0.35,
    elevating: 0.55,
    comforting: 0.60,
    restorative: 0.75
  },

  // YELLOW TEA: Harmonizing, Calming (balanced, delicate)
  yellow: {
    energizing: 0.50,
    focusing: 0.55,
    calming: 0.60,
    harmonizing: 0.75,
    grounding: 0.40,
    elevating: 0.50,
    comforting: 0.55,
    restorative: 0.60
  },

  // OOLONG: Harmonizing, Elevating (complex, balanced)
  oolong: {
    energizing: 0.60,
    focusing: 0.65,
    calming: 0.50,
    harmonizing: 0.80,
    grounding: 0.50,
    elevating: 0.75,
    comforting: 0.60,
    restorative: 0.50
  },

  // RED/HONGCHA (Black): Energizing, Focusing (high caffeine)
  red: {
    energizing: 0.85,
    focusing: 0.80,
    calming: 0.25,
    harmonizing: 0.40,
    grounding: 0.30,
    elevating: 0.45,
    comforting: 0.45,
    restorative: 0.30
  },

  // BLACK TEA: Energizing, Focusing (highest caffeine)
  black: {
    energizing: 0.90,
    focusing: 0.80,
    calming: 0.20,
    harmonizing: 0.35,
    grounding: 0.25,
    elevating: 0.40,
    comforting: 0.40,
    restorative: 0.25
  },

  // DARK/HEICHA: Grounding, Comforting (aged, mellow)
  dark: {
    energizing: 0.35,
    focusing: 0.30,
    calming: 0.60,
    harmonizing: 0.70,
    grounding: 0.85,
    elevating: 0.30,
    comforting: 0.80,
    restorative: 0.80
  },

  // PUERH-SHENG (Raw): Energizing, Focusing (young, high potential)
  'puerh-sheng': {
    energizing: 0.75,
    focusing: 0.70,
    calming: 0.35,
    harmonizing: 0.60,
    grounding: 0.50,
    elevating: 0.65,
    comforting: 0.45,
    restorative: 0.50
  },

  // PUERH-SHOU (Ripe): Grounding, Comforting (aged, mellowed)
  'puerh-shou': {
    energizing: 0.35,
    focusing: 0.30,
    calming: 0.70,
    harmonizing: 0.75,
    grounding: 0.90,
    elevating: 0.25,
    comforting: 0.85,
    restorative: 0.85
  },

  // HERBAL/TISANE: Varies widely (use as neutral default)
  herbal: {
    energizing: 0.50,
    focusing: 0.50,
    calming: 0.50,
    harmonizing: 0.50,
    grounding: 0.50,
    elevating: 0.50,
    comforting: 0.50,
    restorative: 0.50
  }
};

/**
 * Score an effect based on tea type
 * @param {string} teaType - Canonical tea type (green, oolong, puerh, etc.)
 * @param {string} subType - For puerh: sheng or shou
 * @param {string} effectType - Effect to score (energizing, calming, etc.)
 * @returns {number} Normalized score 0-1
 */
export function scoreByTeaType(teaType, subType, effectType) {
  let key = teaType;

  // Handle puerh subtypes
  if (teaType === 'puerh' && subType) {
    key = `puerh-${subType}`;
  }

  const scores = TEA_TYPE_EFFECT_SCORES[key] || TEA_TYPE_EFFECT_SCORES.herbal;
  return scores[effectType] || 0.5;
}

// ============================================================================
// FACTOR 2: COMPOUND SCORING (Weight: 0.25)
//
// Caffeine and L-theanine interact to produce physiological effects
// - Caffeine (0-10): Stimulant, increases alertness and energy
// - L-Theanine (0-10): Amino acid, promotes relaxation and focus
// - Ratio (L-theanine/Caffeine): Determines smoothness and balance
//
// VALIDATION NEEDED:
// - Cross-reference with published caffeine/L-theanine research
// - Validate ratio thresholds against known tea data
// - Test with high-caffeine vs high-theanine reference teas
// ============================================================================

/**
 * Score an effect based on caffeine and L-theanine levels
 * @param {number} caffeineLevel - 0-10 scale
 * @param {number} lTheanineLevel - 0-10 scale
 * @param {string} effectType - Effect to score
 * @returns {number} Normalized score 0-1
 */
export function scoreByCompounds(caffeineLevel, lTheanineLevel, effectType) {
  // Normalize levels to 0-1
  const caffeine = (caffeineLevel || 0) / 10;
  const theanine = (lTheanineLevel || 0) / 10;

  // Avoid division by zero
  const ratio = caffeine > 0 ? theanine / caffeine : 0;

  // Effect scoring based on compounds
  const scores = {
    // Caffeine drives energizing and focusing
    energizing: caffeine * 0.95,
    focusing: caffeine * 0.90 + (theanine * 0.15),

    // L-Theanine drives calming, but also enhances focus
    calming: Math.min(theanine * 1.2, 1.0),

    // Balanced ratio supports harmonizing
    harmonizing: ratio >= 0.8 && ratio <= 1.5 ? 0.85 : 0.45,

    // Compounds don't directly cause grounding (geography/processing does)
    grounding: 0.5,

    // Caffeine can elevate mood
    elevating: caffeine * 0.60 + (theanine * 0.20),

    // L-Theanine supports comfort
    comforting: theanine * 0.80,

    // Restorative aided by L-Theanine and lower caffeine
    restorative: theanine * 0.75 + ((1 - caffeine) * 0.25)
  };

  return Math.min(scores[effectType] || 0.5, 1.0);
}

// ============================================================================
// FACTOR 3: GEOGRAPHY SCORING (Weight: 0.25) - ELEVATED
//
// Geographic factors determine tea chemistry through:
// - ALTITUDE (m): Higher altitude → more amino acids (L-theanine)
//   - < 300m (lowland): Bold, energizing
//   - 300-600m (mid): Balanced
//   - 600-1200m (high): Elevated quality, calming
//   - > 1200m (very high): Delicate, restorative
//
// - TEMPERATURE (°C): Affects growth rate and chemistry
//   - < 10°C: Slow growth, high quality, calming
//   - 10-16°C: Good balance for amino acids
//   - 16-22°C: Neutral, balanced growth
//   - 22-28°C: Warm, stronger compounds
//   - > 28°C: Rapid growth, more catechins
//
// - HUMIDITY (%): Affects fermentation and leaf development
//   - < 40%: Dry, stressed growth, energizing
//   - 40-55%: Lower humidity, pronounced intensity
//   - 55-70%: Balanced
//   - 70-85%: High humidity, mist effect, clarity
//   - > 85%: Very humid, smooth, calming
//
// - SOLAR RADIATION (W/m²): UV effects on polyphenols
//   - < 130: Shade-grown, calming
//   - 130-170: Moderate sun, slower growth
//   - 170-210: Balanced
//   - 210-250: Strong sun, energizing
//   - > 250: Maximum catechins
//
// VALIDATION NEEDED:
// - Cross-reference with tea origin climate data
// - Compare altitude/temp/humidity against known origins (Yunnan, Fujian, etc.)
// - Validate against geographic terroir literature
// ============================================================================

/**
 * Score an effect based on geographic origin and climate
 * @param {number} altitude - Meters above sea level
 * @param {number} temperature - Average temperature in Celsius
 * @param {number} humidity - Relative humidity percentage (0-100)
 * @param {number} solarRadiation - Solar radiation W/m²
 * @param {string} effectType - Effect to score
 * @returns {number} Normalized score 0-1
 */
export function scoreByGeography(altitude, temperature, humidity, solarRadiation, effectType) {
  altitude = altitude || 600;      // Default mid-altitude
  temperature = temperature || 16; // Default cool
  humidity = humidity || 70;       // Default moderate-high
  solarRadiation = solarRadiation || 170; // Default moderate

  // Altitude component (0-1)
  const altitudeScore = (() => {
    if (altitude < 300) return 0.2;      // Lowland - bold, energizing base
    if (altitude < 600) return 0.4;      // Mid-low - transitional
    if (altitude < 1200) return 0.7;     // High - elevated quality
    return 1.0;                           // Very high - premium quality
  })();

  // Temperature component (0-1)
  const tempScore = (() => {
    if (temperature < 10) return 0.9;     // Very cool - high amino acids
    if (temperature < 16) return 0.8;     // Cool - good balance
    if (temperature < 22) return 0.5;     // Moderate - neutral
    if (temperature < 28) return 0.3;     // Warm - stronger compounds
    return 0.1;                            // Very warm - rapid growth
  })();

  // Humidity component (0-1)
  const humidityScore = (() => {
    if (humidity < 40) return 0.3;        // Dry - energizing
    if (humidity < 55) return 0.4;        // Low - pronounced intensity
    if (humidity < 70) return 0.6;        // Moderate - balanced
    if (humidity < 85) return 0.8;        // High - mist effect, clarity
    return 0.9;                            // Very high - smooth, calming
  })();

  // Solar radiation component (0-1)
  const solarScore = (() => {
    if (solarRadiation < 130) return 0.9; // Shade-grown - calming
    if (solarRadiation < 170) return 0.6; // Low-moderate - slower growth
    if (solarRadiation < 210) return 0.4; // Moderate - balanced
    if (solarRadiation < 250) return 0.2; // High - energizing
    return 0.05;                           // Very high - intense, catechins
  })();

  // Effect-specific geographic scoring
  const scores = {
    // High altitude + cool + moderate sun = more amino acids = calming
    calming: (altitudeScore * 0.4) + (tempScore * 0.35) + ((1 - solarScore) * 0.25),

    // Low humidity + high solar = energizing
    energizing: ((1 - humidityScore) * 0.4) + ((1 - solarScore) * 0.35) + ((1 - altitudeScore) * 0.25),

    // Altitude and moderate conditions = focusing
    focusing: (altitudeScore * 0.35) + (Math.abs(0.5 - tempScore) * 0.3) + (Math.abs(0.5 - humidityScore) * 0.35),

    // Balanced conditions = harmonizing
    harmonizing: (Math.abs(0.5 - altitudeScore) < 0.2 ? 0.8 : 0.5) +
                  (Math.abs(0.5 - tempScore) < 0.15 ? 0.2 : 0.1),

    // High altitude + cool = grounding
    grounding: (altitudeScore * 0.5) + (tempScore * 0.35) + ((1 - humidityScore) * 0.15),

    // Good balance = elevating
    elevating: ((1 - Math.abs(0.5 - altitudeScore)) * 0.35) +
               ((1 - Math.abs(0.5 - tempScore)) * 0.35) +
               ((1 - Math.abs(0.5 - humidityScore)) * 0.3),

    // High humidity + cool = comforting
    comforting: (humidityScore * 0.4) + (tempScore * 0.35) + ((1 - solarScore) * 0.25),

    // High altitude + good conditions = restorative
    restorative: (altitudeScore * 0.45) + (Math.abs(0.5 - tempScore) * 0.3) +
                 (Math.abs(0.5 - humidityScore) * 0.25)
  };

  return Math.min(Math.max(scores[effectType] || 0.5, 0), 1.0);
}

// ============================================================================
// FACTOR 4: PROCESSING SCORING (Weight: 0.15)
//
// Processing method and oxidation level affect:
// - Oxidation level (0-100%): More oxidized = more catechins = more energizing
// - Roasting (none, light, medium, heavy, charcoal): Roasting adds warmth/grounding
// - Fermentation: Aged teas become calming and grounding
// ============================================================================

/**
 * Detect roast level from processing methods array
 * @param {string[]} methods - Array of processing method strings
 * @returns {string} Roast level (none, light, medium, heavy, charcoal)
 */
export function detectRoastLevel(methods) {
  if (!Array.isArray(methods) || methods.length === 0) return 'none';

  const methodStr = methods.join(' ').toLowerCase();

  if (methodStr.includes('charcoal')) return 'charcoal';
  if (methodStr.includes('heavy')) return 'heavy';
  if (methodStr.includes('medium')) return 'medium';
  if (methodStr.includes('light')) return 'light';
  if (methodStr.includes('roast')) return 'medium';

  return 'none';
}

/**
 * Score an effect based on processing characteristics
 * @param {number} oxidationLevel - 0-100%
 * @param {string} roastLevel - none, light, medium, heavy, charcoal
 * @param {string} effectType - Effect to score
 * @returns {number} Normalized score 0-1
 */
export function scoreByProcessing(oxidationLevel, roastLevel, effectType) {
  oxidationLevel = (oxidationLevel || 0) / 100; // Normalize to 0-1
  roastLevel = roastLevel?.toLowerCase() || 'none';

  // Oxidation effect (0-1)
  // Higher oxidation = more catechins = more energizing, less calming
  const oxidationFactor = {
    energizing: oxidationLevel * 0.8,
    focusing: oxidationLevel * 0.6,
    calming: (1 - oxidationLevel) * 0.7,  // Less oxidized = calmer
    grounding: oxidationLevel * 0.4,
    elevating: oxidationLevel * 0.3,
    harmonizing: (Math.abs(0.5 - oxidationLevel) < 0.2) ? 0.8 : 0.4,
    comforting: (1 - oxidationLevel) * 0.5,
    restorative: (1 - oxidationLevel) * 0.6
  };

  // Roast effect (0-1) - roasting adds warmth and grounding
  const roastFactors = {
    none: {
      energizing: 0.3, focusing: 0.3, calming: 0.3, harmonizing: 0.3,
      grounding: 0.2, elevating: 0.4, comforting: 0.4, restorative: 0.3
    },
    light: {
      energizing: 0.5, focusing: 0.4, calming: 0.2, harmonizing: 0.4,
      grounding: 0.3, elevating: 0.6, comforting: 0.5, restorative: 0.3
    },
    medium: {
      energizing: 0.4, focusing: 0.3, calming: 0.3, harmonizing: 0.5,
      grounding: 0.5, elevating: 0.4, comforting: 0.6, restorative: 0.5
    },
    heavy: {
      energizing: 0.3, focusing: 0.2, calming: 0.4, harmonizing: 0.6,
      grounding: 0.7, elevating: 0.2, comforting: 0.7, restorative: 0.6
    },
    charcoal: {
      energizing: 0.2, focusing: 0.1, calming: 0.5, harmonizing: 0.7,
      grounding: 0.85, elevating: 0.1, comforting: 0.8, restorative: 0.75
    }
  };

  const roastFactor = roastFactors[roastLevel] || roastFactors.none;

  // Combine oxidation (60%) and roast (40%)
  const combinedScore = (oxidationFactor[effectType] || 0.5) * 0.6 +
                        (roastFactor[effectType] || 0.5) * 0.4;

  return Math.min(Math.max(combinedScore, 0), 1.0);
}

// ============================================================================
// FACTOR 5: FLAVOR PROFILE SCORING (Weight: 0.10)
//
// Flavor notes correlate with chemical compounds and effects.
// While flavor doesn't directly cause effects, it indicates the presence
// of certain compounds that do.
//
// Flavor categories:
// - Floral: Aromatic compounds, often elevating
// - Fruity: Esters, bright, energizing
// - Vegetal: Chlorophyll, grassy, fresh
// - Earthy/Mineral: Minerality, grounding
// - Woody: Age and oxidation, grounding
// - Roasted: Processing effect, grounding and comforting
// - Sweet: Sugars and amino acids, comforting
// - Umami: Amino acids, focusing
// - Nutty/Toasty: Roasting, comforting
// - Spicy: Volatile compounds, energizing
// - Aged/Earthy: Age, grounding and restorative
// ============================================================================

export const FLAVOR_EFFECT_MAPPINGS = {
  floral: {
    energizing: 0.3,
    calming: 0.4,
    focusing: 0.3,
    harmonizing: 0.7,
    grounding: 0.2,
    elevating: 0.9,      // Floral is uplifting
    comforting: 0.6,
    restorative: 0.4
  },
  fruity: {
    energizing: 0.6,
    calming: 0.3,
    focusing: 0.4,
    harmonizing: 0.6,
    grounding: 0.2,
    elevating: 0.8,      // Bright, uplifting
    comforting: 0.4,
    restorative: 0.3
  },
  vegetal: {
    energizing: 0.7,
    calming: 0.4,
    focusing: 0.7,       // Vegetal = fresh and alert
    harmonizing: 0.5,
    grounding: 0.3,
    elevating: 0.5,
    comforting: 0.3,
    restorative: 0.3
  },
  'earthy/mineral': {
    energizing: 0.2,
    calming: 0.5,
    focusing: 0.4,
    harmonizing: 0.6,
    grounding: 0.9,      // Earthy = grounding
    elevating: 0.3,
    comforting: 0.6,
    restorative: 0.7
  },
  woody: {
    energizing: 0.2,
    calming: 0.5,
    focusing: 0.3,
    harmonizing: 0.6,
    grounding: 0.8,      // Woody = grounding
    elevating: 0.2,
    comforting: 0.7,
    restorative: 0.6
  },
  roasted: {
    energizing: 0.3,
    calming: 0.4,
    focusing: 0.3,
    harmonizing: 0.6,
    grounding: 0.8,      // Roasted = grounding
    elevating: 0.2,
    comforting: 0.8,     // Roasted = warming and comforting
    restorative: 0.6
  },
  sweet: {
    energizing: 0.3,
    calming: 0.6,
    focusing: 0.2,
    harmonizing: 0.6,
    grounding: 0.4,
    elevating: 0.5,
    comforting: 0.9,     // Sweet = comforting
    restorative: 0.6
  },
  umami: {
    energizing: 0.5,
    calming: 0.3,
    focusing: 0.8,       // Umami = savory, focusing
    harmonizing: 0.5,
    grounding: 0.5,
    elevating: 0.3,
    comforting: 0.6,
    restorative: 0.4
  },
  'nutty/toasty': {
    energizing: 0.2,
    calming: 0.5,
    focusing: 0.3,
    harmonizing: 0.6,
    grounding: 0.6,
    elevating: 0.2,
    comforting: 0.85,    // Nutty/toasty = very comforting
    restorative: 0.7
  },
  spicy: {
    energizing: 0.8,     // Spicy = stimulating
    calming: 0.1,
    focusing: 0.6,
    harmonizing: 0.3,
    grounding: 0.2,
    elevating: 0.4,
    comforting: 0.2,
    restorative: 0.2
  },
  'aged/earthy': {
    energizing: 0.2,
    calming: 0.6,
    focusing: 0.3,
    harmonizing: 0.7,
    grounding: 0.85,     // Aged = deeply grounding
    elevating: 0.2,
    comforting: 0.8,
    restorative: 0.85    // Aged = restorative
  }
};

/**
 * Normalize a flavor name to a canonical category
 * @param {string} flavorName - Raw flavor name
 * @returns {string} Canonical flavor category
 */
export function normalizeFlavorName(flavorName) {
  if (!flavorName) return null;

  const normalized = flavorName.toLowerCase().trim();

  // Direct matches
  if (FLAVOR_EFFECT_MAPPINGS[normalized]) return normalized;

  // Common aliases
  const aliases = {
    'citrus': 'fruity',
    'citrusy': 'fruity',
    'citric': 'fruity',
    'flower': 'floral',
    'flowery': 'floral',
    'grass': 'vegetal',
    'grassy': 'vegetal',
    'green': 'vegetal',
    'mineral': 'earthy/mineral',
    'minerals': 'earthy/mineral',
    'mineraly': 'earthy/mineral',
    'earth': 'earthy/mineral',
    'earthy': 'earthy/mineral',
    'herb': 'vegetal',
    'herbal': 'vegetal',
    'toasted': 'roasted',
    'toast': 'roasted',
    'nut': 'nutty/toasty',
    'nutty': 'nutty/toasty',
    'toast': 'nutty/toasty',
    'wood': 'woody',
    'savory': 'umami',
    'umami': 'umami',
    'aged': 'aged/earthy',
    'aging': 'aged/earthy',
    'smooth': 'aged/earthy'
  };

  return aliases[normalized] || null;
}

/**
 * Score an effect based on flavor profile
 * @param {string[]} flavorNotes - Array of flavor note strings
 * @param {string} effectType - Effect to score
 * @returns {number} Normalized score 0-1
 */
export function scoreByFlavorProfile(flavorNotes, effectType) {
  if (!Array.isArray(flavorNotes) || flavorNotes.length === 0) {
    return 0.5;  // Neutral if no flavor data
  }

  const scores = flavorNotes
    .map(flavor => {
      const normalized = normalizeFlavorName(flavor);
      if (!normalized) return null;

      const mappings = FLAVOR_EFFECT_MAPPINGS[normalized] || {};
      return mappings[effectType] || 0.5;
    })
    .filter(score => score !== null);

  if (scores.length === 0) return 0.5;

  // Average flavor contributions
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// ============================================================================
// INTEGRATED SCORING FUNCTION
//
// Combines all factors with explicit weights
// ============================================================================

/**
 * Calculate comprehensive effect score from all factors
 * @param {Object} tea - Tea model with all characteristics
 * @param {string} effectType - Effect to score (energizing, calming, etc.)
 * @returns {Object} { score: 0-100, factors: {...}, rawScore: 0-1 }
 */
export function calculateEffectScore(tea, effectType) {
  // Validate inputs
  if (!effectType || !CORE_EFFECTS[effectType]) {
    throw new Error(`Invalid effect type: ${effectType}`);
  }

  // Normalize tea type
  const normalized = TeaTypeNormalizer.normalize(tea.type || '');
  const teaType = normalized.canonical || 'herbal';
  const subType = tea.subType || normalized.subtype;

  // Calculate factor scores (each 0-1)
  const typeScore = scoreByTeaType(teaType, subType, effectType);

  const compoundScore = scoreByCompounds(
    tea.caffeineLevel,
    tea.lTheanineLevel,
    effectType
  );

  const geoScore = scoreByGeography(
    tea.geography?.altitude,
    tea.geography?.temperature,
    tea.geography?.humidity,
    tea.geography?.solarRadiation,
    effectType
  );

  const processingScore = scoreByProcessing(
    tea.processing?.oxidationLevel,
    detectRoastLevel(tea.processing?.methods),
    effectType
  );

  const flavorScore = scoreByFlavorProfile(
    tea.flavor?.primary || [],
    effectType
  );

  // Weighted combination
  const rawScore = (typeScore * EFFECT_SCORING_WEIGHTS.teaType) +
                   (compoundScore * EFFECT_SCORING_WEIGHTS.compounds) +
                   (geoScore * EFFECT_SCORING_WEIGHTS.geography) +
                   (processingScore * EFFECT_SCORING_WEIGHTS.processing) +
                   (flavorScore * EFFECT_SCORING_WEIGHTS.flavor);

  return {
    score: Math.round(rawScore * 100),  // Convert to 0-100
    rawScore: rawScore,                  // Store raw 0-1 for confidence calc
    factors: {
      teaType: Math.round(typeScore * 100),
      compounds: Math.round(compoundScore * 100),
      geography: Math.round(geoScore * 100),
      processing: Math.round(processingScore * 100),
      flavor: Math.round(flavorScore * 100)
    }
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calculateEffectScore,
  scoreByTeaType,
  scoreByCompounds,
  scoreByGeography,
  scoreByProcessing,
  scoreByFlavorProfile,
  normalizeFlavorName,
  detectRoastLevel,
  EFFECT_SCORING_WEIGHTS,
  CORE_EFFECTS,
  TEA_TYPE_EFFECT_SCORES,
  FLAVOR_EFFECT_MAPPINGS
};
