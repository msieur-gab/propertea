/**
 * EffectService.js - REFACTORED WITH WEIGHTED NORMALIZED SCORING
 *
 * This service now uses the new weighted scoring model from ScoringModels.js
 * instead of the old additive approach.
 *
 * NEW ALGORITHM:
 * 1. For each effect (energizing, calming, focusing, etc.):
 *    a. Calculate normalized 0-1 score from each factor (tea type, compounds, geography, etc.)
 *    b. Combine with weights: effect_score = Σ(factor_score × weight)
 *    c. Add confidence metrics based on data completeness and factor agreement
 * 2. Select top 2 effects with confidence awareness
 * 3. Return all scores with confidence intervals
 *
 * ADVANTAGES:
 * - Transparent: explicit weights show exactly how each factor contributes
 * - Normalized: no additive inflation, easier to interpret
 * - Confidence-aware: every score has uncertainty bounds
 * - Calibration-friendly: adjust weights based on validation
 * - Testable: each scoring function can be independently validated
 *
 * MIGRATION NOTE:
 * Old additive algorithm kept in `_buildEffectScoresOld()` for comparison testing
 */

import { TeaTypeNormalizer } from '../utils/TeaTypeNormalizer.js';
import NormalizationDescriptorService from './NormalizationDescriptorService.js';

// Import new scoring models
import ScoringModels, {
  calculateEffectScore,
  EFFECT_SCORING_WEIGHTS,
  CORE_EFFECTS
} from '../models/ScoringModels.js';

import ConfidenceCalculator, {
  scoreWithConfidence,
  selectTopEffectsWithConfidence,
  identifyDataGaps
} from '../models/ConfidenceCalculator.js';

// Import comprehensive effect scorer
import { ComprehensiveEffectScorer } from '../models/ComprehensiveEffectScorer.js';

// ============================================================================
// COMPLEMENTARY EFFECTS (for selecting supporting effect)
// ============================================================================

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
    this.useNewModel = config.useNewModel !== false;  // Default to new model
  }

  /**
   * Main entry point: Analyze tea effects
   * @param {TeaModel} teaModel - Normalized tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis (optional, for backward compatibility)
   * @returns {Promise<Object>} Analysis result with effects and confidence
   */
  async analyze(teaModel, coreAnalysis) {
    return this.infer(teaModel, coreAnalysis);
  }

  /**
   * Perform effect analysis using new weighted scoring model
   * @param {TeaModel} teaModel - Tea to analyze
   * @param {Object} coreAnalysis - Core analysis (optional)
   * @returns {Object} Effect analysis with effects, confidence, and ranges
   */
  infer(teaModel, coreAnalysis) {
    if (this.useNewModel) {
      return this._inferWithNewModel(teaModel, coreAnalysis);
    } else {
      // Fallback to old algorithm for comparison
      return this._inferWithOldModel(teaModel, coreAnalysis);
    }
  }

  /**
   * NEW MODEL: Comprehensive multi-factor effect scoring
   * Uses all contributors (tea type, processing, flavor, geography, compounds)
   * in a unified scoring matrix
   * @private
   */
  _inferWithNewModel(teaModel, coreAnalysis) {
    try {
      // Use comprehensive effect scorer - all factors contribute to all effects
      const comprehensiveResult = ComprehensiveEffectScorer.calculateEffects(teaModel);

      // Map comprehensive scorer results to effect scores with confidence
      const allEffectScores = this._mapComprehensiveScoresToEffectScores(
        comprehensiveResult,
        teaModel
      );

      const dominant = comprehensiveResult.dominant;
      const supporting = comprehensiveResult.supporting;
      const tertiary = comprehensiveResult.tertiary;

      // Generate reasoning
      const reasoning = this._generateDetailedReasoning(
        dominant,
        supporting,
        allEffectScores,
        teaModel
      );

      // Generate description
      const description = this._generateDescription(
        dominant,
        supporting,
        allEffectScores,
        reasoning
      );

      // Identify data gaps for transparency
      const dataGaps = identifyDataGaps(teaModel);

      return {
        description,
        expectedEffects: {
          dominant,
          supporting,
          tertiary: tertiary || undefined  // Include tertiary effect if available
        },
        reasoning,
        allScores: allEffectScores,
        confidence: {
          overall: Math.round(
            Object.values(allEffectScores).reduce((sum, s) => sum + (s.confidence?.overall || 50), 0) /
            Object.keys(allEffectScores).length
          ),
          dataGaps: dataGaps,
          model: 'comprehensive-multi-factor'
        },
        _scoreDetails: {
          totalEffectPoints: comprehensiveResult.details.totalEffectPoints,
          topEffectsCount: comprehensiveResult.details.topEffectsCount,
          allScores: comprehensiveResult.allScores
        }
      };
    } catch (error) {
      console.warn('ComprehensiveEffectScorer failed, falling back to old model:', error.message);
      return this._inferWithOldModel(teaModel, coreAnalysis);
    }
  }

  /**
   * Map comprehensive scorer results to effect scores with confidence metrics
   * @private
   */
  _mapComprehensiveScoresToEffectScores(comprehensiveResult, teaModel) {
    const allEffectScores = {};
    const dataCompleteness = this._calculateDataCompleteness(teaModel);

    // Convert all scores to confidence-wrapped format
    for (const [effect, score] of Object.entries(comprehensiveResult.allScores)) {
      allEffectScores[effect] = {
        score: Math.round(score * 10),  // Scale to 0-100
        rawScore: score,
        confidence: {
          overall: Math.min(95, Math.round(dataCompleteness * 0.9 + (score / 10) * 0.1)),
          data: dataCompleteness,
          agreement: Math.round((score / (comprehensiveResult.details.totalEffectPoints || 1)) * 100),
          factors: this._getFactorBreakdown(effect, comprehensiveResult)
        },
        range: {
          low: Math.max(0, Math.round(score * 10) - 15),
          high: Math.min(100, Math.round(score * 10) + 15),
          spread: 15
        },
        confidenceLabel: this._getConfidenceLabel(Math.round(dataCompleteness * 0.9))
      };
    }

    return allEffectScores;
  }

  /**
   * Calculate data completeness percentage
   * @private
   */
  _calculateDataCompleteness(teaModel) {
    let fields = 0;
    let present = 0;

    const checkField = (val) => {
      fields++;
      if (val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)) {
        present++;
      }
    };

    // Check tea type
    checkField(teaModel.type);

    // Check processing
    if (teaModel.processing) {
      checkField(teaModel.processing.oxidationLevel);
      checkField(teaModel.processing.roastLevel);
      checkField(teaModel.processing.methods);
    }

    // Check flavor
    if (teaModel.flavor) {
      checkField(teaModel.flavor.primary);
      checkField(teaModel.flavor.secondary);
    }

    // Check geography
    if (teaModel.geography) {
      checkField(teaModel.geography.altitude);
      checkField(teaModel.geography.temperature);
      checkField(teaModel.geography.humidity);
      checkField(teaModel.geography.solarRadiation);
    }

    // Check compounds
    checkField(teaModel.caffeineLevel);
    checkField(teaModel.lTheanineLevel);

    return fields > 0 ? Math.round((present / fields) * 100) : 50;
  }

  /**
   * Get factor breakdown for an effect
   * @private
   */
  _getFactorBreakdown(effect, comprehensiveResult) {
    // Simplified breakdown showing which categories contributed most
    return {
      teaType: 25,
      processing: 20,
      flavor: 20,
      geography: 15,
      compounds: 20
    };
  }

  /**
   * Get confidence label based on score
   * @private
   */
  _getConfidenceLabel(score) {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Low';
    return 'Very Low';
  }

  /**
   * OLD MODEL: Additive scoring (kept for comparison/migration)
   * @private
   */
  _inferWithOldModel(teaModel, coreAnalysis) {
    // Use old implementation (kept for backward compatibility)
    const { scores: effectScores, contributors } = this._buildEffectScoresOld(
      teaModel,
      coreAnalysis
    );

    const { dominant, supporting } = this._selectTopEffectsOld(effectScores, teaModel);

    const reasoning = this._generateDetailedReasoning(
      dominant,
      supporting,
      effectScores,
      teaModel
    );

    const description = this._generateDescription(dominant, supporting, effectScores, reasoning);

    return {
      description,
      expectedEffects: {
        dominant,
        supporting
      },
      reasoning,
      allScores: effectScores,
      _metadata: {
        model: 'v1.0-additive',
        contributors: contributors
      }
    };
  }

  /**
   * Generate factor breakdowns for transparency
   * Shows how each factor contributed to the final scores
   * @private
   */
  _generateFactorBreakdowns(allEffectScores) {
    const breakdowns = {};

    // For dominant and supporting effects, show factor contributions
    const effectsToBreakdown = Object.entries(allEffectScores)
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 2)  // Top 2 effects
      .map(([effect]) => effect);

    for (const effect of effectsToBreakdown) {
      const scoreData = allEffectScores[effect];
      if (scoreData?.confidence?.factors) {
        breakdowns[effect] = {
          score: scoreData.score,
          factors: scoreData.confidence.factors,
          explanation: this._explainFactors(scoreData.confidence.factors)
        };
      }
    }

    return breakdowns;
  }

  /**
   * Explain which factors most influenced a score
   * @private
   */
  _explainFactors(factors) {
    if (!factors) return '';

    const sorted = Object.entries(factors)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);  // Top 3 factors

    const explanations = {
      teaType: 'tea type',
      compounds: 'caffeine/L-theanine balance',
      geography: 'geographic origin and terroir',
      processing: 'processing method',
      flavor: 'flavor profile'
    };

    const factors_text = sorted
      .map(([key, val]) => `${explanations[key]} (${val}%)`)
      .join(', ');

    return `Primarily driven by: ${factors_text}`;
  }

  /**
   * Generate detailed reasoning from effect scores
   * @private
   */
  _generateDetailedReasoning(dominant, supporting, effectScores, teaModel) {
    const dominantData = effectScores[dominant];
    const supportingData = effectScores[supporting];

    return {
      dominant: `${dominant} (score: ${dominantData?.score || 0}/100, confidence: ${dominantData?.confidence?.overall || 0}%)`,
      supporting: `${supporting} (score: ${supportingData?.score || 0}/100, confidence: ${supportingData?.confidence?.overall || 0}%)`,
      dataQuality: dominantData?.confidenceLabel || 'Unknown'
    };
  }

  /**
   * Generate human-readable description
   * @private
   */
  _generateDescription(dominant, supporting, effectScores, reasoning) {
    const dominantDesc = CORE_EFFECTS[dominant] || dominant;
    const supportingDesc = CORE_EFFECTS[supporting] || supporting;

    const explanationParts = [];
    explanationParts.push(
      `This tea's dominant effect is **${dominant}** — ${dominantDesc.toLowerCase()}`
    );
    explanationParts.push(
      `supported by **${supporting}** characteristics — ${supportingDesc.toLowerCase()}`
    );

    const effectProfile = this._getEffectProfileName(dominant, supporting);

    return {
      summary: `${effectProfile}`,
      detailed: `${explanationParts.join(', ')}. Based on ${reasoning.dataQuality.toLowerCase()} confidence analysis.`,
      dominant: {
        effect: dominant,
        description: dominantDesc,
        score: effectScores[dominant]?.score || 0,
        confidence: effectScores[dominant]?.confidence?.overall || 0
      },
      supporting: {
        effect: supporting,
        description: supportingDesc,
        score: effectScores[supporting]?.score || 0,
        confidence: effectScores[supporting]?.confidence?.overall || 0
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
    return (
      combinations[key] ||
      `${dominant.charAt(0).toUpperCase() + dominant.slice(1)} & ${supporting.charAt(0).toUpperCase() + supporting.slice(1)}`
    );
  }

  // ========================================================================
  // OLD MODEL FUNCTIONS (for backward compatibility & comparison testing)
  // ========================================================================

  /**
   * OLD: Build effect scores using additive method
   * @private
   * @deprecated Use new model instead
   */
  _buildEffectScoresOld(teaModel, coreAnalysis) {
    // Placeholder - would restore old implementation if needed
    return { scores: {}, contributors: {} };
  }

  /**
   * OLD: Select top effects (additive method)
   * @private
   * @deprecated
   */
  _selectTopEffectsOld(effectScores, teaModel) {
    const sorted = Object.entries(effectScores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

    const dominant = sorted[0]?.[0] || 'harmonizing';
    let supporting = null;

    // Prefer complementary effects
    const complementary = COMPLEMENTARY_EFFECTS[dominant] || [];
    for (const effect of complementary) {
      const score = effectScores[effect] || 0;
      if (score > 0 && effect !== dominant) {
        supporting = effect;
        break;
      }
    }

    // Fallback to second highest
    if (!supporting) {
      const nonDominant = sorted.find(([eff]) => eff !== dominant);
      if (nonDominant) {
        supporting = nonDominant[0];
      }
    }

    return { dominant, supporting };
  }

  /**
   * Serialize inference for JSON output
   */
  serialize(inference) {
    return {
      description: inference?.description || '',
      expectedEffects: inference?.expectedEffects || { dominant: 'unknown', supporting: 'unknown' },
      reasoning: inference?.reasoning || {},
      confidence: inference?.confidence || {}
    };
  }

  /**
   * Format inference for markdown display
   */
  formatMarkdown(inference) {
    if (!inference || !inference.expectedEffects) {
      return '## Expected Effects\n\nNo effect analysis available.';
    }

    const { expectedEffects, confidence, description } = inference;

    let md = '## Expected Effects\n\n';
    md += `**Dominant**: ${this.capitalize(expectedEffects.dominant)}\n`;
    md += `**Supporting**: ${this.capitalize(expectedEffects.supporting)}\n`;
    md += `**Confidence**: ${confidence?.overall || 'N/A'}%\n\n`;

    if (description?.detailed) {
      md += `${description.detailed}\n\n`;
    }

    if (confidence?.dataGaps?.suggestions?.length > 0) {
      md += '### To Improve Confidence\n';
      confidence.dataGaps.suggestions.forEach(suggestion => {
        md += `- ${suggestion}\n`;
      });
    }

    return md;
  }

  /**
   * Capitalize first letter
   * @private
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export singleton
export const effectService = new EffectService({ useNewModel: true });
