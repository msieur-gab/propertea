/**
 * ChaQiMatcher.js - Evaluate Cha Qi (Tea Drunk) Potential
 *
 * Analyzes the likelihood and intensity of achieving Cha Qi (茶氣) - the altered
 * state of consciousness through proper tea drinking.
 *
 * Cha Qi characteristics:
 * - Builds over multiple infusions
 * - Combines multiple effects in harmony
 * - Creates tangible physical sensations
 * - Requires tea with depth and complexity
 * - Strong in aged, fermented, or high-quality teas
 */

export default class ChaQiMatcher {
  /**
   * Evaluate Cha Qi potential of a tea
   * @param {Object} teaData - Tea model
   * @param {Object} effectAnalysis - Effect analysis from EffectService
   * @returns {Object} Cha Qi assessment with potential score and characteristics
   */
  static assessChaQi(teaData, effectAnalysis) {
    const assessment = {
      chaQiPotential: 0,  // 0-100 score
      factors: {
        effectHarmony: 0,
        effectIntensity: 0,
        physicalSensations: 0,
        emotionalResonance: 0,
        accumulationPotential: 0
      },
      characteristics: [],
      recommendedBrewingStyle: null,
      estimatedPeakTime: null,
      infusionProgression: []
    };

    // Factor 1: Effect Harmony (do opposing forces balance?)
    assessment.factors.effectHarmony = this._calculateEffectHarmony(effectAnalysis);

    // Factor 2: Effect Intensity (how strong are the effects?)
    assessment.factors.effectIntensity = this._calculateEffectIntensity(effectAnalysis);

    // Factor 3: Physical Sensations (does the tea create tangible sensations?)
    assessment.factors.physicalSensations = this._calculatePhysicalSensations(
      teaData,
      effectAnalysis
    );

    // Factor 4: Emotional Resonance (does the tea reach the spirit/emotion?)
    assessment.factors.emotionalResonance = this._calculateEmotionalResonance(effectAnalysis);

    // Factor 5: Accumulation Potential (does Cha Qi build over infusions?)
    assessment.factors.accumulationPotential = this._calculateAccumulationPotential(teaData);

    // Calculate overall Cha Qi potential
    assessment.chaQiPotential = Math.round(
      (assessment.factors.effectHarmony * 0.25 +
        assessment.factors.effectIntensity * 0.20 +
        assessment.factors.physicalSensations * 0.20 +
        assessment.factors.emotionalResonance * 0.20 +
        assessment.factors.accumulationPotential * 0.15) * 100
    ) / 100;

    // Identify Cha Qi characteristics
    assessment.characteristics = this._identifyCharacteristics(assessment.factors);

    // Recommend brewing style for optimal Cha Qi
    assessment.recommendedBrewingStyle = this._recommendBrewingStyle(teaData, effectAnalysis);

    // Estimate peak Cha Qi time
    assessment.estimatedPeakTime = this._estimatePeakTime(teaData);

    // Project infusion progression
    assessment.infusionProgression = this._projectInfusionProgression(teaData, effectAnalysis);

    return assessment;
  }

  /**
   * Calculate effect harmony (do effects balance like Yin/Yang?)
   * @private
   */
  static _calculateEffectHarmony(effectAnalysis) {
    const dominant = effectAnalysis.expectedEffects.dominant || '';
    const supporting = effectAnalysis.expectedEffects.supporting || '';

    // Pairs that create harmony (opposing Yin/Yang forces)
    const harmonicPairs = [
      { a: 'invigorating', b: 'calming' },
      { a: 'centering', b: 'releasing' },
      { a: 'clarifying', b: 'uplifting' },
      { a: 'nourishing', b: 'harmonizing' }
    ];

    // Check if dominant/supporting are harmonically paired
    const isHarmonicPair = harmonicPairs.some(
      pair =>
        (dominant === pair.a && supporting === pair.b) ||
        (dominant === pair.b && supporting === pair.a)
    );

    if (isHarmonicPair) return 0.9;

    // Same effect twice (harmonizing + harmonizing) is less dynamic
    if (dominant === supporting) return 0.4;

    // Compatible effects that aren't explicitly paired
    const compatible = [
      ['clarifying', 'invigorating'],
      ['clarifying', 'uplifting'],
      ['harmonizing', 'nourishing'],
      ['centering', 'calming'],
      ['releasing', 'invigorating']
    ];

    const isCompatible = compatible.some(
      pair =>
        (dominant === pair[0] && supporting === pair[1]) ||
        (dominant === pair[1] && supporting === pair[0])
    );

    if (isCompatible) return 0.7;

    // Conflicting or less harmonious
    return 0.5;
  }

  /**
   * Calculate intensity of effects (strong effects = stronger Cha Qi)
   * @private
   */
  static _calculateEffectIntensity(effectAnalysis) {
    if (!effectAnalysis.allScores) return 0.5;

    const scores = Object.values(effectAnalysis.allScores);
    if (scores.length === 0) return 0.5;

    // Average score of all effects
    const avgScore = scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length;

    // Normalize to 0-1
    return Math.min(1, avgScore / 100);
  }

  /**
   * Calculate likelihood of physical sensations
   * Physical sensations are key to Cha Qi experience
   * @private
   */
  static _calculatePhysicalSensations(teaData, effectAnalysis) {
    let score = 0.3; // Base score

    const dominant = effectAnalysis.expectedEffects.dominant || '';
    const supporting = effectAnalysis.expectedEffects.supporting || '';
    const allEffects = Object.keys(effectAnalysis.allScores || {});

    // Effects that create strong physical sensations
    const strongPhysicalEffects = ['releasing', 'invigorating', 'centering', 'nourishing'];
    const moderatePhysicalEffects = ['harmonizing', 'uplifting', 'clarifying'];

    if (strongPhysicalEffects.includes(dominant)) score += 0.3;
    if (strongPhysicalEffects.includes(supporting)) score += 0.2;

    if (moderatePhysicalEffects.includes(dominant)) score += 0.15;
    if (moderatePhysicalEffects.includes(supporting)) score += 0.1;

    // High caffeine content enhances physical sensations
    if (teaData.caffeineLevel && teaData.caffeineLevel >= 7) score += 0.15;

    // Roasted/fermented teas have stronger physical effects
    if (teaData.processing) {
      const roastLevel = teaData.processing.roastLevel || '';
      if (['medium', 'heavy', 'charcoal'].includes(roastLevel)) score += 0.1;
    }

    return Math.min(1, score);
  }

  /**
   * Calculate emotional/spiritual resonance
   * Cha Qi includes spiritual dimension
   * @private
   */
  static _calculateEmotionalResonance(effectAnalysis) {
    let score = 0.4; // Base score

    const allEffects = effectAnalysis.allScores || {};

    // Effects with strong emotional/spiritual resonance
    const spiritualEffects = {
      uplifting: 0.3,
      harmonizing: 0.25,
      nourishing: 0.2,
      centering: 0.2,
      releasing: 0.15
    };

    for (const [effect, resonanceBoost] of Object.entries(spiritualEffects)) {
      if (allEffects[effect] && allEffects[effect].score > 40) {
        score += resonanceBoost;
      }
    }

    return Math.min(1, score);
  }

  /**
   * Calculate how Cha Qi accumulates over infusions
   * Aged teas and fermented teas build stronger Cha Qi over time
   * @private
   */
  static _calculateAccumulationPotential(teaData) {
    let score = 0.5; // Base score

    // Aged teas (Puerh) have high accumulation
    if (teaData.type === 'puerh') score += 0.3;

    // Oolongs, especially aged, accumulate well
    if (teaData.type === 'oolong') score += 0.15;

    // Dark/fermented teas accumulate
    if (teaData.type === 'dark') score += 0.2;

    // Heavy roasting increases accumulation
    if (teaData.processing && teaData.processing.roastLevel === 'heavy') score += 0.1;

    // High oxidation increases accumulation
    if (teaData.processing && teaData.processing.oxidationLevel > 70) score += 0.1;

    // Greens and whites have lower accumulation
    if (['green', 'white', 'yellow'].includes(teaData.type)) score -= 0.15;

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Identify specific Cha Qi characteristics based on factors
   * @private
   */
  static _identifyCharacteristics(factors) {
    const characteristics = [];

    if (factors.effectHarmony > 0.8) {
      characteristics.push('Perfectly balanced effects');
    } else if (factors.effectHarmony > 0.6) {
      characteristics.push('Well-integrated effects');
    }

    if (factors.effectIntensity > 0.8) {
      characteristics.push('Intensely powerful experience');
    } else if (factors.effectIntensity > 0.6) {
      characteristics.push('Strong energetic presence');
    }

    if (factors.physicalSensations > 0.7) {
      characteristics.push('Pronounced physical sensations (warmth, tingling, movement)');
    }

    if (factors.emotionalResonance > 0.7) {
      characteristics.push('Strong emotional/spiritual resonance');
    }

    if (factors.accumulationPotential > 0.7) {
      characteristics.push('Cha Qi builds significantly over infusions');
    }

    return characteristics.length > 0
      ? characteristics
      : ['Subtle, contemplative experience'];
  }

  /**
   * Recommend brewing style for optimal Cha Qi
   * @private
   */
  static _recommendBrewingStyle(teaData, effectAnalysis) {
    const type = teaData.type || '';

    if (['puerh', 'oolong', 'dark'].includes(type)) {
      return {
        style: 'Gongfu',
        reason: 'Allows building Cha Qi through multiple short infusions',
        infusions: '8-12+',
        vesselType: 'Gaiwan or Yixing teapot',
        waterTemp: '90-100°C'
      };
    }

    if (['green', 'white', 'yellow'].includes(type)) {
      return {
        style: 'Western or Gongfu',
        reason: 'Best appreciated mindfully, even if Cha Qi builds more gently',
        infusions: '3-5',
        vesselType: 'Gaiwan or glass pot',
        waterTemp: '70-90°C'
      };
    }

    return {
      style: 'Gongfu',
      reason: 'Allows optimal extraction and Cha Qi building',
      infusions: '6-10',
      vesselType: 'Gaiwan or small teapot',
      waterTemp: '85-100°C'
    };
  }

  /**
   * Estimate when peak Cha Qi occurs
   * @private
   */
  static _estimatePeakTime(teaData) {
    const type = teaData.type || '';

    // Aged Puerh peaks later, sustained
    if (type === 'puerh') {
      return {
        estimate: '25-40 minutes',
        description: 'Builds gradually; can sustain for 60+ minutes with proper brewing',
        adviceInfusions: 'Peak often around 6th-8th infusion'
      };
    }

    // Oolongs peak mid-session
    if (type === 'oolong') {
      return {
        estimate: '15-25 minutes',
        description: 'Strong buildup through mid-infusions',
        adviceInfusions: 'Peak around 4th-6th infusion'
      };
    }

    // Greens/whites peak quickly but fade faster
    if (['green', 'white', 'yellow'].includes(type)) {
      return {
        estimate: '10-15 minutes',
        description: 'Quicker peak; more contemplative than intense',
        adviceInfusions: 'Peak around 2nd-3rd infusion'
      };
    }

    // Default
    return {
      estimate: '15-20 minutes',
      description: 'Generally mid-session',
      adviceInfusions: 'Peak around 4th-5th infusion'
    };
  }

  /**
   * Project how effects progress through infusions
   * @private
   */
  static _projectInfusionProgression(teaData, effectAnalysis) {
    const type = teaData.type || '';

    if (type === 'puerh' || type === 'oolong' || type === 'dark') {
      return [
        {
          infusion: '1-2',
          description: 'Awakening - initial effects emerge, clarity builds',
          expectedIntensity: 'Building'
        },
        {
          infusion: '3-5',
          description: 'Deepening - effects become more integrated, physical sensations manifest',
          expectedIntensity: 'Strong'
        },
        {
          infusion: '6-8',
          description: 'Peak - Cha Qi at maximum, all effects harmonized',
          expectedIntensity: 'Peak'
        },
        {
          infusion: '9+',
          description: 'Sustained - Cha Qi plateaus or subtly evolves',
          expectedIntensity: 'Sustained'
        }
      ];
    }

    if (['green', 'white', 'yellow'].includes(type)) {
      return [
        {
          infusion: '1',
          description: 'Opening - delicate emergence',
          expectedIntensity: 'Gentle'
        },
        {
          infusion: '2-3',
          description: 'Unfolding - effects clarify and develop',
          expectedIntensity: 'Clear'
        },
        {
          infusion: '4+',
          description: 'Integration - becomes more subtle or fades',
          expectedIntensity: 'Integrating'
        }
      ];
    }

    return [
      {
        infusion: '1-2',
        description: 'Initial infusions - effects begin to manifest',
        expectedIntensity: 'Building'
      },
      {
        infusion: '3-4',
        description: 'Mid-session - effects strengthen',
        expectedIntensity: 'Strong'
      },
      {
        infusion: '5+',
        description: 'Late infusions - may sustain or fade',
        expectedIntensity: 'Variable'
      }
    ];
  }
}
