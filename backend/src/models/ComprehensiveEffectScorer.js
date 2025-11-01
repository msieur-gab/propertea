/**
 * ComprehensiveEffectScorer.js - Multi-factor effect scoring with 8 core effects
 *
 * The 8 Core Effects (from expert Chinese tea perspective):
 * 1. Clarifying - Mental focus, sharpness
 * 2. Invigorating - Awakening, vibrant energy (提神 - tí shén)
 * 3. Calming - Tranquility, peace
 * 4. Centering - Balance, presence, grounding (中心 - zhōng xīn)
 * 5. Harmonizing - Internal balance, integration (和 - hé)
 * 6. Uplifting - Emotional-spiritual lightness (輕揚 - qīng yáng)
 * 7. Releasing - Expansive energy, stagnation expulsion (發散 - fā sàn)
 * 8. Nourishing - Deep replenishing sustenance (滋養 - zī yǎng)
 *
 * Scoring Model:
 * - All factors (tea type, processing, flavor, geography, compounds) contribute to ALL effects
 * - Weighted accumulation determines which effects dominate
 * - Geography weights (1.5-1.8x) reflect impact on caffeine/L-theanine development
 */

export class ComprehensiveEffectScorer {
  // The 8 Core Effects
  static EFFECTS = [
    'clarifying',
    'invigorating',
    'calming',
    'centering',
    'harmonizing',
    'uplifting',
    'releasing',
    'nourishing'
  ];

  // TEA TYPE CONTRIBUTIONS
  // Each tea type has intrinsic effect profile
  static TEA_TYPE_EFFECTS = {
    'green': {
      clarifying: 5,      // Fresh, bright mind
      invigorating: 3,    // Clean awakening
      uplifting: 2,       // Elevates mood
      refreshing: 2,      // Cooling, revitalizing (expressed as clarifying)
      calming: 1          // Some L-theanine
    },
    'white': {
      calming: 4,         // Higher L-theanine, delicate
      uplifting: 2,       // Subtle emotional lift
      clarifying: 1,      // Gentle focus
      centering: 1,       // Grounding nature
      nourishing: 1       // Gentle sustenance
    },
    'yellow': {
      calming: 3,         // Gentle tranquility
      uplifting: 2,       // Refined joy
      clarifying: 2,      // Light mental clarity
      nourishing: 2,      // Subtle sustenance
      centering: 1        // Balanced presence
    },
    'oolong': {
      harmonizing: 3,     // Oolongs naturally balance
      invigorating: 3,    // Clean energy from partial oxidation
      uplifting: 3,       // Floral varieties lift spirit
      clarifying: 2,      // Mental clarity
      centering: 2        // Brings to center
    },
    'puerh': {
      nourishing: 5,      // Deep replenishment (especially aged)
      centering: 3,       // Grounding, present-moment focus
      releasing: 2,       // Moves stagnant energy
      harmonizing: 2,     // Brings balance
      calming: 2          // Settles mind
    },
    'dark': {
      releasing: 4,       // Moving, warming energy
      nourishing: 3,      // Sustained warmth and nourishment
      centering: 3,       // Grounding effect
      invigorating: 2,    // Gentle awakening
      harmonizing: 1      // Smooth, integrated feel
    },
    'black': {
      invigorating: 5,    // Strong awakening energy
      clarifying: 3,      // Mental sharpness
      uplifting: 2,       // Mood enhancement
      releasing: 1,       // Some energy movement
      centering: 1        // Base stability
    }
  };

  // PROCESSING CONTRIBUTIONS
  static PROCESSING_EFFECTS = {
    // Oxidation levels (0-5 scale, where 5 = 90-100% oxidized)
    oxidation: {
      0: { calming: 2, clarifying: 1 },           // 0-10% - very fresh
      1: { calming: 1, clarifying: 2 },           // 10-30% - slightly oxidized
      2: { harmonizing: 2, uplifting: 1 },        // 30-50% - moderate oxidation
      3: { releasing: 2, invigorating: 1 },       // 50-70% - increasing oxidation
      4: { invigorating: 3, releasing: 2 },       // 70-90% - highly oxidized
      5: { invigorating: 2, releasing: 3 }        // 90-100% - fully oxidized
    },
    // Roasting levels - affects energetic properties
    roast: {
      'none': { clarifying: 2, uplifting: 1 },
      'light': { clarifying: 2, invigorating: 1 },
      'medium': { releasing: 2, nourishing: 2 },
      'heavy': { releasing: 3, nourishing: 2, centering: 1 },
      'charcoal': { releasing: 4, centering: 2, nourishing: 1 }
    },
    // Processing methods - specific techniques
    methods: {
      'steaming': { clarifying: 2, calming: 1 },
      'pan-firing': { releasing: 2, uplifting: 1 },
      'roasting': { releasing: 3, nourishing: 2 },
      'rolling': { harmonizing: 2, uplifting: 1 },
      'oxidation': { invigorating: 2, releasing: 1 },
      'fermentation': { centering: 3, nourishing: 2 },
      'piling': { centering: 3, releasing: 2 },
      'withering': { calming: 1, clarifying: 1 },
      'shade-grown': { calming: 2, uplifting: 1 }
    }
  };

  // FLAVOR CONTRIBUTIONS
  // Flavors carry energetic properties (from expert assessment)
  static FLAVOR_EFFECTS = {
    'floral': { harmonizing: 3, uplifting: 2, centering: 1 },
    'fruity': { uplifting: 3, clarifying: 1, invigorating: 1 },
    'earthy': { centering: 4, nourishing: 3, calming: 1 },
    'woody': { releasing: 3, centering: 2, nourishing: 1 },
    'sweet': { nourishing: 3, calming: 1, harmonizing: 1 },
    'buttery': { nourishing: 2, harmonizing: 2, calming: 1 },
    'creamy': { nourishing: 3, harmonizing: 2, calming: 1 },
    'mineral': { clarifying: 3, centering: 2, invigorating: 1 },
    'vegetal': { clarifying: 2, calming: 1, uplifting: 1 },
    'grassy': { clarifying: 3, invigorating: 1, uplifting: 1 },
    'fresh': { clarifying: 2, invigorating: 1, uplifting: 1 },
    'honey': { nourishing: 2, harmonizing: 2, uplifting: 1 },
    'caramel': { nourishing: 3, releasing: 1, centering: 1 },
    'chocolate': { nourishing: 3, releasing: 1, centering: 1 },
    'roasty': { releasing: 3, nourishing: 2, invigorating: 1 },
    'orchid': { uplifting: 3, harmonizing: 2, clarifying: 1 },
    'nutty': { nourishing: 2, centering: 1, releasing: 1 },
    'spicy': { releasing: 3, invigorating: 2, clarifying: 1 },
    'citrus': { uplifting: 2, clarifying: 2, invigorating: 1 },
    'herbal': { calming: 2, harmonizing: 1, clarifying: 1 }
  };

  // GEOGRAPHY/TERROIR CONTRIBUTIONS
  // Climate and altitude directly influence caffeine/L-theanine development
  static GEOGRAPHY_EFFECTS = {
    altitude: {
      high: { clarifying: 2, uplifting: 1, invigorating: 1 },   // >1200m - cooler, higher L-theanine
      medium: { harmonizing: 1, uplifting: 1, centering: 1 },   // 800-1200m
      low: { releasing: 2, nourishing: 1, centering: 1 }        // <800m - warmer, higher caffeine
    },
    temperature: {
      cool: { clarifying: 2, calming: 2, invigorating: 1 },     // <12°C - favors L-theanine
      mild: { harmonizing: 2, uplifting: 1, centering: 1 },     // 12-16°C
      warm: { releasing: 2, nourishing: 1, invigorating: 1 },   // 16-20°C
      hot: { releasing: 3, invigorating: 1, centering: 1 }      // >20°C - higher caffeine
    },
    humidity: {
      low: { clarifying: 1, invigorating: 1, uplifting: 1 },    // <60%
      medium: { harmonizing: 1, centering: 1, calming: 1 },     // 60-75%
      high: { releasing: 2, harmonizing: 1, nourishing: 1 },    // 75-85%
      veryHigh: { releasing: 3, centering: 1, nourishing: 1 }   // >85%
    },
    solar: {
      low: { calming: 2, uplifting: 1, clarifying: 1 },         // <120 W/m² - shade-grown
      medium: { harmonizing: 1, uplifting: 1, centering: 1 },   // 120-160 W/m²
      high: { invigorating: 2, clarifying: 1, uplifting: 1 }    // >160 W/m² - full sun
    }
  };

  // COMPOUND CONTRIBUTIONS
  // Caffeine/L-theanine ratio is fundamental to effect expression
  static COMPOUND_EFFECTS = {
    highCaffeine: { invigorating: 4, clarifying: 3, uplifting: 2 },
    balancedHigh: { harmonizing: 4, uplifting: 2, invigorating: 2 },
    balancedModerate: { harmonizing: 3, clarifying: 2, uplifting: 1 },
    highTheanine: { calming: 3, harmonizing: 2, centering: 1 },
    dominantTheanine: { calming: 4, centering: 2, nourishing: 1 },
    lowBoth: { calming: 3, centering: 2, nourishing: 1 }
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

    // 1. TEA TYPE CONTRIBUTIONS (weight: 2.0 - foundational)
    const teaType = (teaData.type || 'green').toLowerCase();
    const typeEffects = this.TEA_TYPE_EFFECTS[teaType] || this.TEA_TYPE_EFFECTS['green'];
    this._addEffects(effectScores, typeEffects, 2.0);

    // 2. PROCESSING CONTRIBUTIONS
    if (teaData.processing) {
      // Oxidation level (weight: 0.9)
      if (teaData.processing.oxidationLevel !== undefined) {
        const oxCategory = this._categorizeOxidation(teaData.processing.oxidationLevel);
        const oxEffects = this.PROCESSING_EFFECTS.oxidation[oxCategory] || {};
        this._addEffects(effectScores, oxEffects, 0.9);
      }

      // Roast level (weight: 1.4 - heavily influences profile)
      if (teaData.processing.roastLevel) {
        const roastEffects = this.PROCESSING_EFFECTS.roast[teaData.processing.roastLevel] || {};
        this._addEffects(effectScores, roastEffects, 1.4);
      }

      // Processing methods (weight: 0.7)
      if (teaData.processing.methods && Array.isArray(teaData.processing.methods)) {
        teaData.processing.methods.forEach(method => {
          const methodLower = (method || '').toLowerCase();
          const methodEffects = this.PROCESSING_EFFECTS.methods[methodLower] || {};
          this._addEffects(effectScores, methodEffects, 0.7);
        });
      }
    }

    // 3. FLAVOR CONTRIBUTIONS (weight: 0.8)
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
    // Geography heavily influences caffeine/L-theanine development
    if (teaData.geography) {
      const geo = teaData.geography;

      if (geo.altitude !== undefined) {
        const altCategory = this._categorizeAltitude(geo.altitude);
        const altEffects = this.GEOGRAPHY_EFFECTS.altitude[altCategory] || {};
        this._addEffects(effectScores, altEffects, 1.6);
      }

      if (geo.temperature !== undefined) {
        const tempCategory = this._categorizeTemperature(geo.temperature);
        const tempEffects = this.GEOGRAPHY_EFFECTS.temperature[tempCategory] || {};
        this._addEffects(effectScores, tempEffects, 1.8);
      }

      if (geo.humidity !== undefined) {
        const humidCategory = this._categorizeHumidity(geo.humidity);
        const humidEffects = this.GEOGRAPHY_EFFECTS.humidity[humidCategory] || {};
        this._addEffects(effectScores, humidEffects, 1.5);
      }

      if (geo.solarRadiation !== undefined) {
        const solarCategory = this._categorizeSolar(geo.solarRadiation);
        const solarEffects = this.GEOGRAPHY_EFFECTS.solar[solarCategory] || {};
        this._addEffects(effectScores, solarEffects, 1.7);
      }
    }

    // 5. COMPOUND CONTRIBUTIONS (weight: 1.0 - supports tea type)
    if (teaData.caffeineLevel !== undefined && teaData.lTheanineLevel !== undefined) {
      const ratio = teaData.caffeineLevel / (teaData.lTheanineLevel || 1);
      const compoundCategory = this._categorizeCaffeine(teaData.caffeineLevel, teaData.lTheanineLevel, ratio);
      const compoundEffects = this.COMPOUND_EFFECTS[compoundCategory] || {};
      this._addEffects(effectScores, compoundEffects, 1.0);
    }

    // Select top 2-3 effects based on balance
    const sortedEffects = Object.entries(effectScores)
      .sort(([, a], [, b]) => b - a)
      .map(([effect, score]) => ({ effect, score: Math.round(score * 10) / 10 }));

    const topCount = this._selectTopEffectCount(sortedEffects);
    const topEffects = sortedEffects.slice(0, topCount);

    return {
      dominant: topEffects[0]?.effect || 'harmonizing',
      supporting: topEffects[1]?.effect || 'uplifting',
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
      // Only add if effect is in the 8 core effects
      if (this.EFFECTS.includes(effect)) {
        scores[effect] = (scores[effect] || 0) + (points * weight);
      }
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

    // If top 3 is close to top 2 (within 60%), include it
    if (top3 > top2 * 0.6) return 3;
    return 2;
  }
}

export default ComprehensiveEffectScorer;
