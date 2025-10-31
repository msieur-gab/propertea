/**
 * EffectService.js (REFACTORED)
 *
 * Calculates expected tea effects using ADDITIVE adjustment pattern (like TimeMatcher)
 * NOT weighted multipliers
 *
 * Architecture:
 * 1. Initialize all 8 effects to baseline (50)
 * 2. Apply adjustments from 5 factors (compounds, stimulation, relaxation, processing, flavor, teaType)
 * 3. Normalize scores to 0-100
 * 4. Select dominant (highest) and supporting (complementary) effects
 *
 * Input: TeaModel + intermediateAnalysis (from orchestrator with 5 factor analyses)
 * Output: Effects with dominant/supporting and detailed trace
 */

import { TeaTypeNormalizer } from '../utils/TeaTypeNormalizer.js';

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
    this.config = {
      baselineScore: config.baselineScore || 50,
      ...config
    };
    this.effectsList = Object.keys(CORE_EFFECTS);
  }

  /**
   * Main entry point
   */
  async analyze(teaModel, intermediateAnalysis) {
    return this.infer(teaModel, intermediateAnalysis);
  }

  /**
   * Calculate effects using additive pattern
   */
  infer(teaModel, intermediateAnalysis = {}) {
    let trace = [];
    const effectScores = new Map(
      this.effectsList.map(effect => [effect, this.config.baselineScore])
    );

    trace.push({
      step: 'Initialization',
      reason: 'Baseline setup',
      adjustment: `All effects initialized to ${this.config.baselineScore}`
    });

    // Extract analysis data
    const compounds = intermediateAnalysis?.compounds || {};
    const flavor = intermediateAnalysis?.flavor || {};
    const processing = intermediateAnalysis?.processing || {};
    const geography = intermediateAnalysis?.geography || {};
    const teaType = intermediateAnalysis?.teaType || {};

    // Extract key parameters
    const compoundProfile = compounds.analysis?.compoundProfile || 'Balanced';
    const stimulationLevel = compounds.analysis?.stimulationLevel || 'Moderate';
    const relaxationLevel = compounds.analysis?.relaxationLevel || 'Moderate';
    const energeticTendency = processing.analysis?.energeticTendency || 'Neutral';
    const flavorCategories = flavor.analysis?.categories || [];
    const primaryTeaType = teaType?.primaryType || teaModel?.type || '';

    trace.push({
      step: 'Input Extraction',
      reason: 'Extracting from 5-factor analyses',
      adjustment: `Profile: ${compoundProfile}, Stim: ${stimulationLevel}, Relax: ${relaxationLevel}, Processing: ${energeticTendency}, Flavors: ${flavorCategories.join(', ')}, Type: ${primaryTeaType}`
    });

    // Apply adjustments for each factor
    this._applyCompoundProfileAdjustments(effectScores, compoundProfile, trace);
    this._applyStimulationAdjustments(effectScores, stimulationLevel, trace);
    this._applyRelaxationAdjustments(effectScores, relaxationLevel, trace);
    this._applyProcessingAdjustments(effectScores, energeticTendency, trace);
    this._applyFlavorAdjustments(effectScores, flavorCategories, trace);
    this._applyTeaTypeAdjustments(effectScores, primaryTeaType, trace);

    // Normalize scores
    const normalizedScores = this._normalizeScores(effectScores);
    trace.push({
      step: 'Score Normalization',
      reason: 'Converting to 0-100 percentile scale',
      adjustment: 'Normalized all effect scores'
    });

    // Select top 2 effects
    const { dominant, supporting } = this._selectTopEffects(normalizedScores);
    trace.push({
      step: 'Effect Selection',
      reason: 'Selecting dominant and supporting',
      adjustment: `Dominant: ${dominant}, Supporting: ${supporting}`
    });

    return {
      description: `This tea produces ${dominant} and ${supporting} effects`,
      expectedEffects: {
        dominant,
        supporting
      },
      allScores: Object.fromEntries(normalizedScores),
      trace
    };
  }

  /**
   * Apply compound profile adjustments
   */
  _applyCompoundProfileAdjustments(scores, profile, trace) {
    const adjustments = {
      'Smooth & Sustained': { elevating: +8, calming: +5, focusing: +3, harmonizing: +2 },
      'Calm & Clear': { calming: +10, focusing: +5, elevating: +2 },
      'Deeply Calm': { calming: +12, restorative: +6, grounding: +4, comforting: +2 },
      'Balanced & Focused': { focusing: +6, energizing: +4, calming: +2 },
      'Smooth & Alert': { elevating: +7, focusing: +6, energizing: +3 },
      'Focused & Energized': { energizing: +8, focusing: +6, elevating: +2 },
      'Sharp & Driven': { energizing: +10, focusing: +4, elevating: +1, calming: -3 },
      'Intense & Sharp': { energizing: +12, focusing: +3, calming: -5 },
      'Primarily Stimulating': { energizing: +10, focusing: +4, comforting: -2 },
      'Primarily Relaxing': { calming: +10, restorative: +6, grounding: +4 }
    };

    const profileAdjust = adjustments[profile] || adjustments['Balanced & Focused'];
    for (const [effect, adjustment] of Object.entries(profileAdjust)) {
      const current = scores.get(effect) || 50;
      scores.set(effect, Math.max(0, current + adjustment));
    }

    trace.push({
      step: 'Compound Profile Adjustment',
      reason: `Based on profile: '${profile}'`,
      adjustment: `Applied profile adjustments`
    });
  }

  /**
   * Apply stimulation level adjustments
   */
  _applyStimulationAdjustments(scores, level, trace) {
    const levelMap = {
      'None': { energizing: -8, focusing: -5 },
      'Very Low': { energizing: -6, focusing: -3 },
      'Low': { energizing: -3, focusing: +2 },
      'Moderate': { energizing: 0, focusing: +2 },
      'Medium': { energizing: +2, focusing: +4 },
      'High': { energizing: +8, focusing: +6, elevating: +4 },
      'Very High': { energizing: +10, focusing: +6, elevating: +6 },
      'High (Smooth)': { energizing: +6, focusing: +5, calming: +3 },
      'Very High (Smooth)': { energizing: +8, focusing: +5, calming: +4 }
    };

    const adjustments = levelMap[level] || levelMap['Moderate'];
    for (const [effect, adjustment] of Object.entries(adjustments)) {
      const current = scores.get(effect) || 50;
      scores.set(effect, Math.max(0, current + adjustment));
    }

    trace.push({
      step: 'Stimulation Level Adjustment',
      reason: `Based on level: ${level}`,
      adjustment: `Applied stimulation adjustments`
    });
  }

  /**
   * Apply relaxation level adjustments
   */
  _applyRelaxationAdjustments(scores, level, trace) {
    const levelMap = {
      'None': { calming: -5, restorative: -3 },
      'Very Low': { calming: -3, restorative: -2 },
      'Low': { calming: +2, restorative: +1 },
      'Moderate': { calming: +3, restorative: +2 },
      'Medium': { calming: +4, restorative: +3, harmonizing: +2 },
      'High': { calming: +7, restorative: +5, grounding: +4, harmonizing: +3 },
      'Very High': { calming: +10, restorative: +7, grounding: +6, comforting: +4 }
    };

    const adjustments = levelMap[level] || levelMap['Moderate'];
    for (const [effect, adjustment] of Object.entries(adjustments)) {
      const current = scores.get(effect) || 50;
      scores.set(effect, Math.max(0, current + adjustment));
    }

    trace.push({
      step: 'Relaxation Level Adjustment',
      reason: `Based on level: ${level}`,
      adjustment: `Applied relaxation adjustments`
    });
  }

  /**
   * Apply processing tendency adjustments
   */
  _applyProcessingAdjustments(scores, tendency, trace) {
    const adjustments = {
      'warming': { comforting: +5, grounding: +3, energizing: +2 },
      'neutral-warming': { harmonizing: +4, comforting: +3, focusing: +1 },
      'neutral': { harmonizing: +2 },
      'cooling': { calming: +5, restorative: +3 },
      'grounding': { grounding: +6, comforting: +4, calming: +2 },
      'energizing': { energizing: +6, elevating: +4 }
    };

    const key = Object.keys(adjustments).find(k => tendency.toLowerCase().includes(k));
    const profileAdjust = adjustments[key] || {};

    for (const [effect, adjustment] of Object.entries(profileAdjust)) {
      const current = scores.get(effect) || 50;
      scores.set(effect, Math.max(0, current + adjustment));
    }

    trace.push({
      step: 'Processing Tendency Adjustment',
      reason: `Based on tendency: ${tendency}`,
      adjustment: `Applied processing adjustments`
    });
  }

  /**
   * Apply flavor category adjustments
   */
  _applyFlavorAdjustments(scores, categories, trace) {
    const categoryEffects = {
      'Floral': { elevating: +5, harmonizing: +4, calming: +2 },
      'Sweet': { comforting: +4, harmonizing: +3, elevating: +2 },
      'Fruity': { elevating: +6, energizing: +2 },
      'Herbal': { calming: +6, restorative: +4 },
      'Minty': { refreshing: +5, focusing: +3, calming: +2 },
      'Honey': { comforting: +5, harmonizing: +3 },
      'Roasted': { comforting: +5, grounding: +4 },
      'Smoky': { grounding: +6, comforting: +4 },
      'Woody': { grounding: +5, comforting: +3 },
      'Mineral': { focusing: +5, grounding: +3 },
      'Bitter': { focusing: +4, energizing: +2 },
      'Vegetal': { calming: +3, focusing: +2 }
    };

    for (const category of categories) {
      const adjustments = categoryEffects[category] || {};
      for (const [effect, adjustment] of Object.entries(adjustments)) {
        const current = scores.get(effect) || 50;
        scores.set(effect, Math.max(0, current + adjustment));
      }
    }

    trace.push({
      step: 'Flavor Category Adjustment',
      reason: `Based on flavors: ${categories.join(', ')}`,
      adjustment: `Applied flavor adjustments`
    });
  }

  /**
   * Apply tea type adjustments (20% weight - validator, not dictator)
   */
  _applyTeaTypeAdjustments(scores, typeStr, trace) {
    const type = (typeStr || '').toLowerCase();

    const typeAdjustments = {
      'green': { focusing: +3, energizing: +2, calming: +1 },
      'white': { calming: +4, restorative: +3, elevating: +2 },
      'yellow': { energizing: +3, focusing: +2, harmonizing: +1 },
      'oolong': { harmonizing: +5, calming: +3, elevating: +2 },
      'red': { energizing: +6, comforting: +3 },
      'dark': { grounding: +5, comforting: +4 },
      'puerh-sheng': { energizing: +8, elevating: +4 },
      'puerh-shou': { grounding: +6, comforting: +4 },
      'puerh': { energizing: +4, grounding: +3 }
    };

    let adjustments = {};
    for (const [pattern, adj] of Object.entries(typeAdjustments)) {
      if (type.includes(pattern)) {
        adjustments = adj;
        break;
      }
    }

    for (const [effect, adjustment] of Object.entries(adjustments)) {
      const current = scores.get(effect) || 50;
      scores.set(effect, Math.max(0, current + adjustment * 0.2)); // 20% weight
    }

    trace.push({
      step: 'Tea Type Adjustment',
      reason: `Based on type: ${typeStr}`,
      adjustment: `Applied tea type adjustments (20% weight)`
    });
  }

  /**
   * Normalize scores to 0-100 percentile scale
   */
  _normalizeScores(scores) {
    const values = Array.from(scores.values());
    if (values.length === 0) return scores;

    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const range = max - min;

    const normalized = new Map();
    for (const [effect, score] of scores) {
      if (range === 0) {
        normalized.set(effect, 50);
      } else {
        const normalized_val = Math.round(((score - min) / range) * 100);
        normalized.set(effect, normalized_val);
      }
    }

    return normalized;
  }

  /**
   * Select dominant (highest) and supporting (complementary) effects
   */
  _selectTopEffects(scores) {
    const sorted = Array.from(scores.entries())
      .sort(([, a], [, b]) => b - a);

    const dominant = sorted[0]?.[0] || 'harmonizing';
    let supporting = null;

    // Find best complementary effect
    const complementary = COMPLEMENTARY_EFFECTS[dominant] || [];
    let bestComplementary = null;
    let bestScore = 0;

    for (const [effect, score] of sorted) {
      if (effect !== dominant && complementary.includes(effect) && score > bestScore) {
        bestComplementary = effect;
        bestScore = score;
      }
    }

    supporting = bestComplementary || sorted[1]?.[0] || 'calming';

    return { dominant, supporting };
  }
}
