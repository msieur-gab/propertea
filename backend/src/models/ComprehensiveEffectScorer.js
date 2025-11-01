/**
 * ComprehensiveEffectScorer.js - Multi-factor effect scoring system
 *
 * Instead of isolated tea-type rules, this scorer evaluates ALL contributors:
 * - Tea type base effects
 * - Processing methods and oxidation/roasting levels
 * - Flavor profiles and characteristics
 * - Geographic/terroir factors
 * - Compound balance (caffeine/L-theanine)
 *
 * Each contributor adds points to an effect pool. The top 2-3 effects
 * are selected based on total accumulated points.
 */

export class ComprehensiveEffectScorer {
  // All possible effects
  static EFFECTS = [
    'clarifying',
    'refreshing',
    'energizing',
    'calming',
    'harmonizing',
    'grounding',
    'elevating',
    'comforting',
    'warming',
    'aromatic',
    'relaxing',
    'mentally-stimulating'
  ];

  // TEA TYPE CONTRIBUTIONS
  static TEA_TYPE_EFFECTS = {
    'green': {
      clarifying: 5,
      refreshing: 4,
      energizing: 3,
      elevating: 2,
      calming: 1
    },
    'white': {
      calming: 4,
      refreshing: 3,
      harmonizing: 2,
      elevating: 1,
      clarifying: 1
    },
    'oolong': {
      harmonizing: 3,  // Reduced - oolongs vary widely by roasting
      aromatic: 4,     // Stable - most oolongs have aromatic notes
      warming: 2,      // Will increase with roasting
      energizing: 2,   // Lightlly roasted oolongs lean energizing
      elevating: 2
    },
    'black': {
      energizing: 5,
      clarifying: 3,
      warming: 2,
      comforting: 1,
      aromatic: 1
    },
    'puerh': {
      grounding: 5,
      comforting: 4,
      warming: 3,
      harmonizing: 2,
      digestive: 1
    },
    'dark': {
      warming: 4,
      grounding: 3,
      comforting: 3,
      aromatic: 2,
      energizing: 1
    },
    'herbal': {
      calming: 4,
      relaxing: 3,
      comforting: 2,
      harmonizing: 1
    }
  };

  // PROCESSING CONTRIBUTIONS
  static PROCESSING_EFFECTS = {
    // Oxidation levels
    oxidation: {
      0: { calming: 2, refreshing: 1 },           // 0-10%
      1: { calming: 1, refreshing: 2 },           // 10-30%
      2: { harmonizing: 2, elevating: 1 },        // 30-50%
      3: { warming: 2, energizing: 1 },           // 50-70%
      4: { energizing: 3, warming: 2 },           // 70-90%
      5: { energizing: 2, warming: 3 }            // 90-100%
    },
    // Roasting levels
    roast: {
      'none': { refreshing: 2, elevating: 1 },
      'light': { refreshing: 2, clarifying: 1 },
      'medium': { warming: 2, aromatic: 2 },
      'heavy': { warming: 3, aromatic: 3, comforting: 1 },
      'charcoal': { warming: 4, grounding: 2, aromatic: 2 }
    },
    // Processing methods
    methods: {
      'steaming': { refreshing: 2, clarifying: 1 },
      'pan-firing': { warming: 2, aromatic: 1 },
      'roasting': { warming: 3, aromatic: 3 },
      'rolling': { harmonizing: 2, elevating: 1 },
      'oxidation': { energizing: 2, warming: 1 },
      'fermentation': { grounding: 3, comforting: 2 },
      'piling': { grounding: 3, warming: 2 },
      'withering': { calming: 1, refreshing: 1 },
      'shade-grown': { calming: 2, elevating: 1 }
    }
  };

  // FLAVOR CONTRIBUTIONS
  static FLAVOR_EFFECTS = {
    'floral': { harmonizing: 3, elevating: 2, aromatic: 2 },
    'fruity': { refreshing: 3, elevating: 2, energizing: 1 },
    'earthy': { grounding: 4, comforting: 3, warming: 1 },
    'woody': { warming: 3, grounding: 2, aromatic: 2 },
    'sweet': { comforting: 3, calming: 1, harmonizing: 1 },
    'buttery': { comforting: 2, harmonizing: 2, warming: 1 },
    'creamy': { comforting: 3, harmonizing: 2, calming: 1 },
    'mineral': { clarifying: 3, grounding: 2, energizing: 1 },
    'vegetal': { refreshing: 2, clarifying: 1, calming: 1 },
    'grassy': { refreshing: 3, clarifying: 2, energizing: 1 },
    'fresh': { refreshing: 3, clarifying: 1, energizing: 1 },
    'honey': { comforting: 2, harmonizing: 2, elevating: 1 },
    'caramel': { comforting: 3, warming: 2, grounding: 1 },
    'chocolate': { comforting: 3, warming: 2, grounding: 1 },
    'roasty': { warming: 3, comforting: 2, aromatic: 1 },
    'orchid': { aromatic: 3, harmonizing: 2, elevating: 2 },
    'nutty': { comforting: 2, warming: 1, grounding: 1 },
    'spicy': { warming: 3, energizing: 2, aromatic: 1 },
    'citrus': { refreshing: 2, elevating: 2, energizing: 1 },
    'herbal': { calming: 2, harmonizing: 1, refreshing: 1 }
  };

  // GEOGRAPHY/TERROIR CONTRIBUTIONS
  static GEOGRAPHY_EFFECTS = {
    altitude: {
      // High altitude (>1200m) - cooler, more minerals
      high: { clarifying: 2, refreshing: 1, elevating: 1 },
      // Medium altitude (800-1200m)
      medium: { harmonizing: 1, elevating: 1 },
      // Low altitude (<800m) - warmer
      low: { warming: 2, comforting: 1 }
    },
    temperature: {
      // Cool (<12°C)
      cool: { clarifying: 2, refreshing: 2, calming: 1 },
      // Mild (12-16°C)
      mild: { harmonizing: 2, elevating: 1 },
      // Warm (16-20°C)
      warm: { warming: 2, comforting: 1, aromatic: 1 },
      // Hot (>20°C)
      hot: { warming: 3, energizing: 1 }
    },
    humidity: {
      // Low (<60%)
      low: { clarifying: 1, energizing: 1 },
      // Medium (60-75%)
      medium: { harmonizing: 1 },
      // High (75-85%)
      high: { aromatic: 2, comforting: 1 },
      // Very high (>85%)
      veryHigh: { aromatic: 3, warming: 1 }
    },
    solar: {
      // Low (<120 W/m²) - shade
      low: { calming: 2, elevating: 1 },
      // Medium (120-160 W/m²)
      medium: { harmonizing: 1, elevating: 1 },
      // High (>160 W/m²)
      high: { energizing: 2, clarifying: 1 }
    }
  };

  // COMPOUND CONTRIBUTIONS (caffeine to L-theanine ratio)
  static COMPOUND_EFFECTS = {
    // High caffeine, low L-theanine (ratio > 2:1)
    highCaffeine: { energizing: 4, clarifying: 3, mentally_stimulating: 2 },
    // Balanced high caffeine + high L-theanine (ratio 1:1 to 1.5:1)
    balancedHigh: { harmonizing: 4, elevating: 2, energizing: 2 },
    // Balanced moderate (ratio 0.8:1 to 1:1)
    balancedModerate: { harmonizing: 3, refreshing: 2, elevating: 1 },
    // High L-theanine, moderate caffeine (ratio 0.5:1 to 0.8:1)
    highTheanine: { calming: 3, harmonizing: 2, relaxing: 1 },
    // High L-theanine, low caffeine (ratio < 0.5:1)
    dominantTheanine: { calming: 4, relaxing: 3, comforting: 1 },
    // Low both (herbal-like)
    lowBoth: { calming: 3, relaxing: 2, comforting: 1 }
  };

  /**
   * Calculate comprehensive effect score for a tea
   * @param {Object} teaData - Tea data with type, flavor, processing, geography, caffeine, L-theanine
   * @returns {Object} - Comprehensive effect analysis with all scores and top 2-3 effects
   */
  static calculateEffects(teaData) {
    // Initialize effect scores
    const effectScores = {};
    this.EFFECTS.forEach(effect => {
      effectScores[effect] = 0;
    });

    // 1. TEA TYPE CONTRIBUTIONS
    const teaType = (teaData.type || 'green').toLowerCase();
    const typeEffects = this.TEA_TYPE_EFFECTS[teaType] || this.TEA_TYPE_EFFECTS['green'];
    this._addEffects(effectScores, typeEffects, 2.0); // weight: 2.0 - tea type is foundational

    // 2. PROCESSING CONTRIBUTIONS
    if (teaData.processing) {
      // Oxidation level
      if (teaData.processing.oxidationLevel !== undefined) {
        const oxCategory = this._categorizeOxidation(teaData.processing.oxidationLevel);
        const oxEffects = this.PROCESSING_EFFECTS.oxidation[oxCategory] || {};
        this._addEffects(effectScores, oxEffects, 0.9);
      }

      // Roast level
      if (teaData.processing.roastLevel) {
        const roastEffects = this.PROCESSING_EFFECTS.roast[teaData.processing.roastLevel] || {};
        this._addEffects(effectScores, roastEffects, 1.4);  // Higher weight - roasting heavily influences profile
      }

      // Processing methods
      if (teaData.processing.methods && Array.isArray(teaData.processing.methods)) {
        teaData.processing.methods.forEach(method => {
          const methodLower = (method || '').toLowerCase();
          const methodEffects = this.PROCESSING_EFFECTS.methods[methodLower] || {};
          this._addEffects(effectScores, methodEffects, 0.7);
        });
      }
    }

    // 3. FLAVOR CONTRIBUTIONS
    if (teaData.flavor) {
      const flavorNotes = [
        ...(teaData.flavor.primary || []),
        ...(teaData.flavor.secondary || [])
      ];

      flavorNotes.forEach(flavor => {
        const flavorLower = (flavor || '').toLowerCase();
        const flavorEffects = this.FLAVOR_EFFECTS[flavorLower] || {};
        this._addEffects(effectScores, flavorEffects, 0.8);
      });
    }

    // 4. GEOGRAPHY/TERROIR CONTRIBUTIONS
    if (teaData.geography) {
      const geo = teaData.geography;

      // Altitude - influences caffeine/L-theanine development
      if (geo.altitude !== undefined) {
        const altCategory = this._categorizeAltitude(geo.altitude);
        const altEffects = this.GEOGRAPHY_EFFECTS.altitude[altCategory] || {};
        this._addEffects(effectScores, altEffects, 1.6);
      }

      // Temperature - critical for tea leaf chemistry
      if (geo.temperature !== undefined) {
        const tempCategory = this._categorizeTemperature(geo.temperature);
        const tempEffects = this.GEOGRAPHY_EFFECTS.temperature[tempCategory] || {};
        this._addEffects(effectScores, tempEffects, 1.8);
      }

      // Humidity - affects oxidation and fermentation
      if (geo.humidity !== undefined) {
        const humidCategory = this._categorizeHumidity(geo.humidity);
        const humidEffects = this.GEOGRAPHY_EFFECTS.humidity[humidCategory] || {};
        this._addEffects(effectScores, humidEffects, 1.5);
      }

      // Solar radiation - influences polyphenol and amino acid development
      if (geo.solarRadiation !== undefined) {
        const solarCategory = this._categorizeSolar(geo.solarRadiation);
        const solarEffects = this.GEOGRAPHY_EFFECTS.solar[solarCategory] || {};
        this._addEffects(effectScores, solarEffects, 1.7);
      }
    }

    // 5. COMPOUND CONTRIBUTIONS
    if (teaData.caffeineLevel !== undefined && teaData.lTheanineLevel !== undefined) {
      const ratio = teaData.caffeineLevel / (teaData.lTheanineLevel || 1);
      const compoundCategory = this._categorizeCaffeine(teaData.caffeineLevel, teaData.lTheanineLevel, ratio);
      const compoundEffects = this.COMPOUND_EFFECTS[compoundCategory] || {};
      this._addEffects(effectScores, compoundEffects, 1.0); // weight: 1.0 - support tea type
    }

    // Select top 2-3 effects
    const sortedEffects = Object.entries(effectScores)
      .sort(([, a], [, b]) => b - a)
      .map(([effect, score]) => ({ effect, score: Math.round(score * 10) / 10 }));

    // Determine how many top effects to return (2-3)
    const topCount = this._selectTopEffectCount(sortedEffects);
    const topEffects = sortedEffects.slice(0, topCount);

    return {
      dominant: topEffects[0]?.effect || 'harmonizing',
      supporting: topEffects[1]?.effect || 'elevating',
      tertiary: topEffects[2]?.effect || null,
      allScores: Object.fromEntries(sortedEffects.map(e => [e.effect, e.score])),
      breakdown: {
        dominant: topEffects[0] || {},
        supporting: topEffects[1] || {},
        tertiary: topEffects[2] || null
      },
      details: {
        totalEffectPoints: Object.values(effectScores).reduce((a, b) => a + b, 0),
        topEffectsCount: topCount
      }
    };
  }

  /**
   * Helper: Add effects to scores with weighting
   */
  static _addEffects(scores, effects, weight) {
    Object.entries(effects).forEach(([effect, points]) => {
      scores[effect] = (scores[effect] || 0) + (points * weight);
    });
  }

  /**
   * Categorize oxidation level (0-100%)
   */
  static _categorizeOxidation(level) {
    if (level < 10) return 0;
    if (level < 30) return 1;
    if (level < 50) return 2;
    if (level < 70) return 3;
    if (level < 90) return 4;
    return 5;
  }

  /**
   * Categorize altitude in meters
   */
  static _categorizeAltitude(altitude) {
    if (altitude < 800) return 'low';
    if (altitude < 1200) return 'medium';
    return 'high';
  }

  /**
   * Categorize temperature in °C
   */
  static _categorizeTemperature(temp) {
    if (temp < 12) return 'cool';
    if (temp < 16) return 'mild';
    if (temp < 20) return 'warm';
    return 'hot';
  }

  /**
   * Categorize humidity as percentage
   */
  static _categorizeHumidity(humidity) {
    if (humidity < 60) return 'low';
    if (humidity < 75) return 'medium';
    if (humidity < 85) return 'high';
    return 'veryHigh';
  }

  /**
   * Categorize solar radiation in W/m²
   */
  static _categorizeSolar(solar) {
    if (solar < 120) return 'low';
    if (solar < 160) return 'medium';
    return 'high';
  }

  /**
   * Categorize caffeine/L-theanine profile
   */
  static _categorizeCaffeine(caffeine, theanine, ratio) {
    if (caffeine >= 7 && ratio > 2) return 'highCaffeine';
    if (caffeine >= 6 && theanine >= 4 && ratio >= 1) return 'balancedHigh';
    if (caffeine >= 4 && theanine >= 3 && ratio >= 0.8) return 'balancedModerate';
    if (theanine >= 4 && caffeine >= 3) return 'highTheanine';
    if (theanine > caffeine) return 'dominantTheanine';
    return 'lowBoth';
  }

  /**
   * Determine how many top effects to use (2-3)
   * Use 3 if effects are well-balanced, 2 if one dominates
   */
  static _selectTopEffectCount(sortedEffects) {
    if (sortedEffects.length < 3) return sortedEffects.length;

    const top1 = sortedEffects[0].score;
    const top2 = sortedEffects[1].score;
    const top3 = sortedEffects[2].score;

    // If top 3 is close to top 2, include it
    if (top3 > top2 * 0.6) return 3;
    return 2;
  }
}

export default ComprehensiveEffectScorer;
