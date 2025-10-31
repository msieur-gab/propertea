/**
 * EffectService - SIMPLIFIED RULE-BASED EFFECT CALCULATION
 *
 * Based on analysis of 71 Chinese teas dataset showing effects are determined by:
 * 1. Tea Type (base effect)
 * 2. Caffeine/L-Theanine Ratio (which effect variant)
 * 3. Processing/Flavor (secondary modifiers)
 *
 * Much simpler than the original five-factor algorithm.
 */

// Tea type base effects - the default/primary effect for each type
const TEA_TYPE_BASE_EFFECTS = {
  green: 'focusing',      // 43% of green teas expect focusing
  white: 'restorative',   // 42% of white teas expect restorative
  yellow: 'harmonizing',  // 57% of yellow teas expect harmonizing
  oolong: 'harmonizing',  // 35% of oolong teas expect harmonizing
  red: 'energizing',      // 67% of red teas expect energizing (hongcha)
  dark: 'grounding',      // 100% of dark teas expect grounding (heicha)
  puerh: 'grounding'      // Fermented, similar to dark
};

// Secondary effects that can appear as supporting - based on tea type patterns
const TEA_TYPE_SUPPORTING_EFFECTS = {
  green: ['calming', 'focusing'],           // 43% calming, 36% focusing
  white: ['calming', 'restorative'],        // 42% calming, 25% restorative
  yellow: ['calming', 'harmonizing'],       // 57% calming, 43% harmonizing
  oolong: ['harmonizing', 'elevating'],     // 35% harmonizing, 24% elevating
  red: ['comforting', 'elevating'],         // 67% comforting, 17% elevating
  dark: ['grounding', 'comforting'],        // 71% grounding, 29% comforting
  puerh: ['comforting', 'focusing']         // Mix of sheng/shou
};

// Caffeine/L-Theanine ratio thresholds for effect determination
// Ratio = lTheanine / caffeine
const RATIO_EFFECT_MAP = {
  // Ratio < 0.9: Caffeine dominant → energizing
  energizing: { min: 0, max: 0.9 },

  // Ratio 0.9-1.1: Balanced → grounding, comforting
  grounding: { min: 0.9, max: 1.1 },
  comforting: { min: 0.9, max: 1.15 },

  // Ratio 1.1-1.3: Slightly theanine leaning → focusing, elevating
  focusing: { min: 1.0, max: 1.3 },
  elevating: { min: 1.05, max: 1.35 },

  // Ratio 1.3-1.5: Theanine leaning → harmonizing, restorative
  harmonizing: { min: 1.2, max: 1.45 },
  restorative: { min: 1.25, max: 1.5 },

  // Ratio > 1.45: High theanine → calming
  calming: { min: 1.35, max: 2.0 }
};

export class EffectServiceSimplified {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea effects
   * @param {TeaModel} teaModel - Normalized tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis (optional, for reference)
   * @returns {Object} Analysis result with dominant and supporting effects
   */
  async analyze(teaModel, coreAnalysis = {}) {
    return this.infer(teaModel, coreAnalysis);
  }

  /**
   * Simplified effect inference based on tea type and compound ratio
   * @param {TeaModel} teaModel - Tea to analyze
   * @param {Object} coreAnalysis - Core analysis (for reference/logging)
   * @returns {Object} Effect analysis with dominant and supporting effects
   */
  infer(teaModel, coreAnalysis = {}) {
    // Extract normalized tea type
    const teaType = (teaModel.type || 'oolong').toLowerCase();

    // Extract compound levels
    const caffeine = teaModel.caffeineLevel || 0;
    const lTheanine = teaModel.lTheanineLevel || 0;

    // Calculate ratio (handle edge cases)
    const ratio = caffeine > 0 ? lTheanine / caffeine : 0;

    // Determine dominant effect based on tea type and ratio
    const dominant = this._determineDominantEffect(teaType, ratio, caffeine, lTheanine);

    // Determine supporting effect based on tea type and ratio
    const supporting = this._determineSupportingEffect(teaType, ratio, dominant);

    // Generate reasoning
    const reasoning = this._generateReasoning(teaType, dominant, supporting, caffeine, lTheanine, ratio);

    return {
      description: `${teaModel.name} has ${dominant} as its dominant effect with ${supporting} as supporting effect.`,
      expectedEffects: {
        dominant,
        supporting
      },
      reasoning,
      allScores: {
        [dominant]: 8,
        [supporting]: 6
      },
      // Internal data for debugging
      _debug: {
        teaType,
        caffeine,
        lTheanine,
        ratio: ratio.toFixed(2)
      }
    };
  }

  /**
   * Determine dominant effect based on tea type and compound ratio
   * @private
   */
  _determineDominantEffect(teaType, ratio, caffeine, lTheanine) {
    const baseEffect = TEA_TYPE_BASE_EFFECTS[teaType] || 'harmonizing';

    // For red tea: stay with energizing unless ratio is very high
    if (teaType === 'red' && ratio < 1.2) {
      return 'energizing';
    }

    // For white tea: prefer restorative if caffeine is low
    if (teaType === 'white' && caffeine < 3) {
      return 'restorative';
    }

    // For green tea: stick with focusing for balanced ratios
    if (teaType === 'green' && ratio < 1.4) {
      return 'focusing';
    }

    // For dark/puerh: always grounding
    if (teaType === 'dark' || teaType === 'puerh') {
      return 'grounding';
    }

    // For yellow: prefer harmonizing
    if (teaType === 'yellow') {
      return 'harmonizing';
    }

    // For oolong: use base harmonizing unless ratio suggests otherwise
    if (teaType === 'oolong') {
      if (ratio < 1.0) {
        return 'elevating'; // Some oolongs are less oxidized
      }
      return 'harmonizing';
    }

    return baseEffect;
  }

  /**
   * Determine supporting effect based on tea type, ratio, and dominant effect
   * @private
   */
  _determineSupportingEffect(teaType, ratio, dominantEffect) {
    const supportingPool = TEA_TYPE_SUPPORTING_EFFECTS[teaType] || ['harmonizing', 'calming'];

    // Remove dominant effect from supporting pool if it's there
    let available = supportingPool.filter(e => e !== dominantEffect);
    if (available.length === 0) {
      available = supportingPool;
    }

    // Choose based on ratio and type
    // High ratio (high theanine) → calming is likely supporting
    if (ratio > 1.35 && available.includes('calming')) {
      return 'calming';
    }

    // Very high ratio → restorative
    if (ratio > 1.4 && available.includes('restorative')) {
      return 'restorative';
    }

    // Red tea → comforting as supporting
    if (teaType === 'red' && available.includes('comforting')) {
      return 'comforting';
    }

    // Dark tea → grounding or comforting
    if (teaType === 'dark') {
      return ratio > 1.05 ? 'comforting' : 'grounding';
    }

    // Default to first available
    return available[0] || 'harmonizing';
  }

  /**
   * Generate reasoning for the effect determination
   * @private
   */
  _generateReasoning(teaType, dominant, supporting, caffeine, lTheanine, ratio) {
    let summary = `${teaType.charAt(0).toUpperCase() + teaType.slice(1)} tea`;

    if (caffeine && lTheanine) {
      summary += ` with caffeine ${caffeine.toFixed(1)}/10 and L-theanine ${lTheanine.toFixed(1)}/10 (ratio ${ratio.toFixed(2)})`;
    }

    summary += ` typically produces ${dominant} as the dominant effect`;

    if (ratio < 0.9) {
      summary += ` because caffeine is relatively high compared to L-theanine`;
    } else if (ratio > 1.4) {
      summary += ` because L-theanine significantly exceeds caffeine`;
    } else {
      summary += ` from a balanced compound profile`;
    }

    summary += `, with ${supporting} as supporting effect.`;

    return {
      summary,
      contributors: {
        teaType,
        compoundRatio: {
          caffeine: caffeine.toFixed(1),
          lTheanine: lTheanine.toFixed(1),
          ratio: ratio.toFixed(2)
        }
      },
      detailed: [
        `Tea type (${teaType}) provides the foundational effect framework`,
        `Compound profile (ratio ${ratio.toFixed(2)}) determines which effect is dominant`,
        `Supporting effect (${supporting}) complements the primary (${dominant})`
      ]
    };
  }
}

export default EffectServiceSimplified;
