/**
 * ConfidenceCalculator.js - CONFIDENCE METRICS & UNCERTAINTY QUANTIFICATION
 *
 * Calculates confidence scores and uncertainty ranges for tea recommendations.
 * This allows the API to indicate which results are highly certain vs. require
 * more data for validation.
 *
 * CONFIDENCE FACTORS:
 * 1. Data Presence (60%): More complete tea data = higher confidence
 *    - Tea type (critical)
 *    - Compounds (caffeine/L-theanine)
 *    - Geography (origin data)
 *    - Processing method
 *    - Flavor profile
 *
 * 2. Data Quality (25%): Some data is more reliable than others
 *    - Known tea type with subtype = higher quality
 *    - Geographic precision (specific location vs. country only)
 *    - Compound certainty (measured vs. estimated)
 *
 * 3. Model Certainty (15%): How much agreement between factors?
 *    - If all factors agree strongly, confidence is high
 *    - If factors conflict (e.g., compounds say energizing, but type says calming),
 *      confidence is lower
 *
 * USAGE:
 * Instead of returning:
 *   { score: 75 }
 * Return:
 *   { score: 75, confidence: 0.82, range: [68, 82] }
 *
 * Where:
 * - score: Best estimate (0-100)
 * - confidence: How confident are we? (0-1)
 * - range: Uncertainty interval [low, high]
 */

// ============================================================================
// CONFIDENCE CALCULATION
// ============================================================================

/**
 * Calculate confidence in a tea analysis based on data completeness
 * Confidence represents our uncertainty in the estimates (0 = very uncertain, 1 = certain)
 *
 * @param {Object} tea - Tea model
 * @returns {number} Confidence score (0-1)
 */
export function calculateDataConfidence(tea) {
  let confidence = 0.5;  // Start with baseline

  // FACTOR 1: Data Presence (60% weight)
  const presenceScore = calculateDataPresence(tea);
  confidence += presenceScore * 0.6;

  // FACTOR 2: Data Quality (25% weight)
  const qualityScore = calculateDataQuality(tea);
  confidence += qualityScore * 0.25;

  // FACTOR 3: Model Certainty (15% weight)
  // Note: This requires calculated effect scores, so we'll set it separately
  // Default to neutral if not provided
  confidence += 0.5 * 0.15;

  // Clamp between 0.2 and 1.0 (minimum 20% confidence even with no data)
  return Math.min(Math.max(confidence, 0.2), 1.0);
}

/**
 * Calculate confidence boost from agreement between different scoring factors
 * If all factors agree that a score should be high, confidence increases
 *
 * @param {Object} factors - Factor scores { teaType, compounds, geography, processing, flavor }
 * @param {number} mainScore - The aggregated effect score (0-1)
 * @returns {number} Confidence adjustment (0-1)
 */
export function calculateAgreementConfidence(factors, mainScore) {
  if (!factors) return 0.5;

  // Convert scores from 0-100 to 0-1 for comparison
  const normalized = Object.entries(factors).reduce((acc, [key, val]) => {
    acc[key] = (val || 50) / 100;
    return acc;
  }, {});

  // Calculate how close all factors are to the main score
  const deviations = Object.values(normalized).map(factorScore => {
    return Math.abs(factorScore - mainScore);
  });

  // Average deviation (0 = perfect agreement, 1 = complete disagreement)
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;

  // Convert deviation to confidence (inverse relationship)
  // 0 deviation = 1.0 confidence, 0.5 deviation = 0.5 confidence, etc.
  return Math.max(0, 1 - avgDeviation);
}

/**
 * Calculate confidence from data presence completeness
 * @private
 * @param {Object} tea - Tea model
 * @returns {number} Presence score (0-1)
 */
function calculateDataPresence(tea) {
  let points = 0;
  let maxPoints = 0;

  // Tea type (most critical) - 3 points max
  maxPoints += 3;
  if (tea.type) points += 2;
  if (tea.subType) points += 1;

  // Compounds - 2 points max
  maxPoints += 2;
  if (typeof tea.caffeineLevel === 'number') points += 1;
  if (typeof tea.lTheanineLevel === 'number') points += 1;

  // Geography - 2 points max
  maxPoints += 2;
  if (tea.geography?.country || tea.geography?.province) points += 1;
  if (tea.geography?.altitude || tea.geography?.temperature) points += 1;

  // Processing - 2 points max
  maxPoints += 2;
  if (tea.processing?.methods?.length > 0) points += 1;
  if (typeof tea.processing?.oxidationLevel === 'number') points += 1;

  // Flavor - 1 point max
  maxPoints += 1;
  if (Array.isArray(tea.flavor?.primary) && tea.flavor.primary.length > 0) points += 1;

  // Total max is 10 points
  return points / maxPoints;
}

/**
 * Calculate confidence from data quality
 * @private
 * @param {Object} tea - Tea model
 * @returns {number} Quality score (0-1)
 */
function calculateDataQuality(tea) {
  let quality = 0.5;  // Baseline

  // Known tea type with subtype = higher quality
  if (tea.type && tea.subType) {
    quality += 0.15;
  }

  // Geographic precision
  if (tea.geography?.latitude && tea.geography?.longitude) {
    // Specific coordinates = high quality
    quality += 0.15;
  } else if (tea.geography?.location) {
    // Named location = medium quality
    quality += 0.08;
  }

  // Compound precision (assuming measured values are more precise)
  if (typeof tea.caffeineLevel === 'number' && typeof tea.lTheanineLevel === 'number') {
    if (tea.caffeineLevel > 0 && tea.lTheanineLevel > 0) {
      // Both compounds present and measured
      quality += 0.1;
    }
  }

  // Processing detail
  if (Array.isArray(tea.processing?.methods) && tea.processing.methods.length > 2) {
    // Multiple processing methods documented = detailed
    quality += 0.05;
  }

  // Clamp to 0-1
  return Math.min(Math.max(quality, 0), 1.0);
}

// ============================================================================
// UNCERTAINTY RANGE CALCULATION
// ============================================================================

/**
 * Calculate uncertainty range (confidence interval) for a score
 *
 * @param {number} score - Point estimate (0-100)
 * @param {number} confidence - Confidence level (0-1)
 * @returns {Object} { low: number, high: number, spread: number }
 */
export function calculateUncertaintyRange(score, confidence) {
  // Spread is inversely proportional to confidence
  // High confidence (0.9) = small spread (±5 points)
  // Low confidence (0.3) = large spread (±20 points)
  const maxSpread = 25;  // Maximum ±25 points at zero confidence
  const spread = maxSpread * (1 - confidence);

  return {
    low: Math.max(0, Math.round(score - spread)),
    high: Math.min(100, Math.round(score + spread)),
    spread: Math.round(spread)
  };
}

// ============================================================================
// EFFECT SCORE WITH CONFIDENCE
// ============================================================================

/**
 * Wrap an effect score with confidence metrics
 * This is the main output function for effect scoring
 *
 * @param {Object} scoreResult - Result from calculateEffectScore()
 *        { score, rawScore, factors }
 * @param {Object} tea - Tea model (for data confidence)
 * @returns {Object} Comprehensive score with confidence
 */
export function scoreWithConfidence(scoreResult, tea) {
  if (!scoreResult) return null;

  // Get data confidence (based on what data was provided)
  const dataConfidence = calculateDataConfidence(tea);

  // Get agreement confidence (based on factor agreement)
  const agreementConfidence = calculateAgreementConfidence(
    scoreResult.factors,
    scoreResult.rawScore
  );

  // Combined confidence is the geometric mean (emphasizes low scores)
  const combinedConfidence = Math.sqrt(dataConfidence * agreementConfidence);

  // Calculate uncertainty range
  const range = calculateUncertaintyRange(scoreResult.score, combinedConfidence);

  return {
    score: scoreResult.score,
    confidence: {
      overall: Math.round(combinedConfidence * 100),  // 0-100
      data: Math.round(dataConfidence * 100),         // 0-100
      agreement: Math.round(agreementConfidence * 100), // 0-100
      factors: scoreResult.factors
    },
    range: {
      low: range.low,
      high: range.high,
      spread: range.spread
    },
    // Human-readable confidence label
    confidenceLabel: getConfidenceLabel(combinedConfidence)
  };
}

/**
 * Get human-readable confidence label
 * @private
 */
function getConfidenceLabel(confidence) {
  if (confidence >= 0.85) return 'Very High';
  if (confidence >= 0.70) return 'High';
  if (confidence >= 0.55) return 'Moderate';
  if (confidence >= 0.40) return 'Low';
  return 'Very Low';
}

// ============================================================================
// COMPOSITE ANALYSIS CONFIDENCE
// ============================================================================

/**
 * Calculate confidence for all effects combined
 * (Used for overall analysis quality assessment)
 *
 * @param {Object} allEffectScores - Map of effect scores with confidence
 *        { energizing: {...}, calming: {...}, ... }
 * @returns {number} Average confidence (0-1)
 */
export function calculateOverallConfidence(allEffectScores) {
  if (!allEffectScores || Object.keys(allEffectScores).length === 0) {
    return 0.5;
  }

  const confidences = Object.values(allEffectScores)
    .map(score => score.confidence?.overall / 100 || 0.5);

  return confidences.reduce((a, b) => a + b, 0) / confidences.length;
}

// ============================================================================
// CONFIDENCE-AWARE RECOMMENDATIONS
// ============================================================================

/**
 * Select top effects with confidence awareness
 * Dominants and supporting effects should have sufficient confidence
 *
 * @param {Object} allEffectScores - All effect scores with confidence
 * @returns {Object} { dominant, supporting }
 */
export function selectTopEffectsWithConfidence(allEffectScores) {
  // Filter effects with >40% confidence
  const validEffects = Object.entries(allEffectScores)
    .filter(([, scoreData]) => (scoreData.confidence?.overall || 0) >= 40)
    .sort(([, a], [, b]) => b.score - a.score);

  if (validEffects.length === 0) {
    // Fallback: use highest score regardless
    const sorted = Object.entries(allEffectScores)
      .sort(([, a], [, b]) => b.score - a.score);
    return {
      dominant: sorted[0]?.[0] || 'harmonizing',
      supporting: sorted[1]?.[0] || 'elevating',
      note: 'Low confidence - results may be unreliable'
    };
  }

  if (validEffects.length === 1) {
    return {
      dominant: validEffects[0][0],
      supporting: null,
      note: 'Only one effect has sufficient confidence'
    };
  }

  return {
    dominant: validEffects[0][0],
    supporting: validEffects[1][0],
    note: null
  };
}

// ============================================================================
// DATA QUALITY DIAGNOSTICS
// ============================================================================

/**
 * Identify missing or low-quality data in a tea model
 * Useful for API responses to explain confidence scores
 *
 * @param {Object} tea - Tea model
 * @returns {Object} { missing: [...], lowQuality: [...] }
 */
export function identifyDataGaps(tea) {
  const gaps = {
    missing: [],
    lowQuality: [],
    suggestions: []
  };

  // Missing critical data
  if (!tea.type) gaps.missing.push('Tea type');
  if (!tea.caffeineLevel && tea.caffeineLevel !== 0) gaps.missing.push('Caffeine level');
  if (!tea.lTheanineLevel && tea.lTheanineLevel !== 0) gaps.missing.push('L-theanine level');

  // Missing important data
  if (!tea.geography?.altitude) gaps.missing.push('Geographic altitude');
  if (!tea.geography?.temperature) gaps.missing.push('Geographic temperature');
  if (!tea.flavor?.primary || tea.flavor.primary.length === 0) gaps.missing.push('Flavor profile');

  // Low quality data
  if (tea.type && !tea.subType) gaps.lowQuality.push('Tea subtype (e.g., sheng vs shou for puerh)');
  if (tea.geography && (!tea.geography.latitude || !tea.geography.longitude)) {
    gaps.lowQuality.push('Geographic coordinates');
  }

  // Generate suggestions
  if (gaps.missing.includes('Caffeine level')) {
    gaps.suggestions.push('Provide caffeine level to improve effect predictions');
  }
  if (gaps.missing.includes('Geographic altitude')) {
    gaps.suggestions.push('Specify altitude to improve terroir assessment');
  }
  if (gaps.missing.includes('Flavor profile')) {
    gaps.suggestions.push('List flavor notes to refine recommendations');
  }

  return gaps;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calculateDataConfidence,
  calculateAgreementConfidence,
  calculateUncertaintyRange,
  scoreWithConfidence,
  calculateOverallConfidence,
  selectTopEffectsWithConfidence,
  identifyDataGaps
};
