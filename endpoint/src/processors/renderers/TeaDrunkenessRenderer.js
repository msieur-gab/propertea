/**
 * TeaDrunkenessRenderer.js (v2.0 - Expert Calibrated)
 *
 * Purpose: Predict tea drunkenness potential (茶醉, chá zuì) from compound and terroir factors
 * Input:
 *   - compoundInference: { analysis: { caffeineLevel, lTheanineLevel, ratio } }
 *   - geographyInference: { inputs: { geography: { altitude } } }
 *   - teaTypeInference: { analysis: { teaType, teaSubType }, inputs: { type, subType } }
 *   - processingInference: { inputs: { processingMethods } } (for catechin estimation)
 * Output: Tea drunkenness potential, character, timing, and recommendations
 *
 * Tea Drunkenness (茶醉):
 * A unique altered state induced by tea's biochemical profile, characterized by:
 * - Mental clarity with mild euphoria
 * - Calm alertness (L-theanine + caffeine synergy)
 * - Body sensations (warmth, lightness, buzzing) - from catechins
 * - Enhanced sensory perception
 *
 * NOT the same as caffeine jitters - it's the synergy of compounds that creates the experience.
 *
 * Scoring Model v2.0 (Expert Calibrated):
 * - L-Theanine (30%): Mental calm, euphoria driver
 * - Caffeine (15%): Stimulation component
 * - Catechins/EGCG (25%): Body sensations, "buzz" (ESTIMATED from type + processing)
 * - Elevation (10%): High mountain = more amino acids
 * - Tea Type Multiplier (20% effective): Cultural/empirical modifiers
 *
 * Tea Type Multipliers (Corrected from Expert Feedback):
 * - Young Raw Puerh: 1.4x (HIGHEST - famous for tea drunk)
 * - High-mountain Oolong: 1.25x
 * - White tea (buds): 1.2x
 * - Yellow tea: 1.15x
 * - Green tea: 1.1x
 * - Shou Puerh: 1.0x
 * - Black tea: 0.8x (LOWEST - oxidation reduces effects)
 */

export class TeaDrunkenessRenderer {
  constructor(config = {}) {
    this.config = {
      baselineScore: 20,  // Base starting point
      ...config
    };

    // Tea type multipliers (CORRECTED from expert feedback)
    // Map both normalized IDs and raw type strings
    this.teaTypeMultipliers = {
      // Normalized IDs (from taxonomy)
      'TEA_TYPE_PUERH_SHENG': 1.4,   // Young raw puerh - HIGHEST
      'TEA_TYPE_PUERH_SHOU': 1.0,    // Ripe puerh - standard
      'TEA_TYPE_OOLONG': 1.25,       // High-mountain oolong
      'TEA_TYPE_YELLOW': 1.15,       // Yellow tea
      'TEA_TYPE_GREEN': 1.1,         // Green tea
      'TEA_TYPE_WHITE': 1.2,         // White tea buds
      'TEA_TYPE_BLACK': 0.8,         // Black tea - LOWEST

      // Raw type strings (from form data)
      'puerh_sheng': 1.4,
      'puerh_shou': 1.0,
      'puerh': 1.0,      // Generic puerh (shou)
      'oolong': 1.25,
      'yellow': 1.15,
      'green': 1.1,
      'white': 1.2,
      'black': 0.8
    };

    // Intensity thresholds (expert-calibrated)
    this.intensityThresholds = {
      veryLow: 45,   // Below 45
      low: 55,       // 45-54
      medium: 65,    // 55-64
      high: 75,      // 65-74
      veryHigh: 75   // 75+
    };

    // Base catechin levels by tea type (for estimation)
    this.baseCatechins = {
      'puerh_sheng': 9,    // Young raw puerh - very high
      'puerh_shou': 2,     // Ripe puerh - fermentation destroys catechins
      'puerh': 2,          // Generic (assume shou)
      'white': 8.5,        // Minimal processing
      'green': 8,          // Pan-fired preserves catechins
      'yellow': 7,         // Slight oxidation
      'oolong': 6,         // Partial oxidation (will adjust by processing)
      'black': 3           // Full oxidation
    };
  }

  /**
   * Estimate catechin levels based on tea type and processing
   * Catechins are inversely related to oxidation - fresh leaves have high catechins
   * @param {string} type - Tea type (puerh_sheng, oolong, etc.)
   * @param {string} subType - Tea subType (for specific adjustments)
   * @param {Array} processingMethods - Processing methods array
   * @param {string} name - Tea name (for specific heuristics)
   * @returns {number} - Estimated catechin level (0-10 scale)
   */
  _estimateCatechins(type, subType, processingMethods = [], name = '') {
    // Handle generic "puerh" type by checking subType
    let actualType = type;
    if (type === 'puerh') {
      // Check subType to determine sheng vs shou
      if (subType && subType.includes('sheng')) {
        actualType = 'puerh_sheng';
      } else if (subType && subType.includes('shou')) {
        actualType = 'puerh_shou';
      }
      // Default to shou if unclear
    }

    // Start with base catechin level for tea type
    let catechins = this.baseCatechins[actualType] || 5;

    // Adjust for processing methods
    if (processingMethods.includes('heavy-roast')) {
      catechins -= 1.5;
    } else if (processingMethods.includes('medium-roast')) {
      catechins -= 0.8;
    } else if (processingMethods.includes('light-roast')) {
      catechins -= 0.3;
    }

    // Oxidation adjustments (for oolongs primarily)
    if (processingMethods.includes('full-oxidation')) {
      catechins -= 2;
    } else if (processingMethods.includes('heavy-oxidation')) {
      catechins -= 1.5;
    }

    // Specific tea type adjustments
    if (actualType === 'puerh_sheng') {
      // Check if aged (aging reduces catechins)
      if (subType && (subType.includes('aged') || name.includes('Aged'))) {
        catechins -= 2;
      }
      // Famous high-catechin regions
      if (name.includes('Banzhang') || name.includes('Yiwu')) {
        catechins += 0.5;
      }
    }

    // Heavily roasted oolongs (Da Hong Pao, Wuyi oolongs)
    if (type === 'oolong' && (subType === 'wuyi-oolong' || name.includes('Da Hong Pao'))) {
      catechins -= 1.5;  // Heavy roasting
    }

    // Cap between 0-10
    return Math.max(0, Math.min(10, catechins));
  }

  /**
   * Render tea drunkenness prediction from inferences
   * @param {Object} inferences - Object containing inference results
   * @returns {Object} - Tea drunkenness analysis
   */
  render(inferences = {}) {
    const {
      compound: compoundInference = {},
      geography: geographyInference = {},
      teaType: teaTypeInference = {},
      processing: processingInference = {}
    } = inferences;

    const trace = [];

    // ========== VALIDATION ==========
    if (!compoundInference?.analysis) {
      return this._failedRender("No compound inference data provided", trace);
    }

    const compoundAnalysis = compoundInference.analysis;
    const {
      caffeineLevel = 0,
      lTheanineLevel = 0,
      ratio = 0
    } = compoundAnalysis;

    if (caffeineLevel === 0 && lTheanineLevel === 0) {
      return this._failedRender("No compound data available", trace);
    }

    // Extract tea info for catechin estimation
    // TeaTypeInferrer stores the ORIGINAL inputs in the trace, not in inputs
    const teaTypeTrace = teaTypeInference?.trace?.find(t => t.step === "Input Reception");
    const traceAdjustment = teaTypeTrace?.adjustment || '';

    // Parse type from trace (format: "Type: puerh_sheng, SubType: puerh-sheng")
    const typeMatch = traceAdjustment.match(/Type: ([^,]+)/);
    const subTypeMatch = traceAdjustment.match(/SubType: ([^,]+)/);

    const rawType = typeMatch ? typeMatch[1].trim() : 'green';
    const rawSubType = subTypeMatch ? subTypeMatch[1].trim() : '';
    const teaName = '';  // We don't have access to tea name in renderer, only in export script
    const processingMethods = processingInference?.inputs?.processingMethods || [];

    // Estimate catechins
    const catechinLevel = this._estimateCatechins(rawType, rawSubType, processingMethods, teaName);

    trace.push({
      step: "Data Reception",
      reason: "Extract compound and terroir data",
      adjustment: `Caffeine: ${caffeineLevel}, L-Theanine: ${lTheanineLevel}, Catechins: ${catechinLevel.toFixed(1)} (estimated), Ratio: ${ratio}`,
      value: "Data validated"
    });

    // ========== SCORING CALCULATION (v2.0 - Expert Calibrated) ==========
    let totalScore = this.config.baselineScore;

    // Factor 1: L-Theanine (30% weight) - Mental calm, euphoria driver
    // Scale 0-10 to 0-30 points
    const lTheanineScore = (lTheanineLevel / 10) * 30;
    totalScore += lTheanineScore;

    trace.push({
      step: "L-Theanine Contribution (30%)",
      reason: "L-theanine creates mental calm and euphoric sensation",
      adjustment: `${lTheanineLevel}/10 → +${lTheanineScore.toFixed(1)} points`,
      value: "Mental clarity with mild euphoria"
    });

    // Factor 2: Caffeine (15% weight) - Stimulation component
    // Scale 0-10 to 0-15 points
    const caffeineScore = (caffeineLevel / 10) * 15;
    totalScore += caffeineScore;

    trace.push({
      step: "Caffeine Contribution (15%)",
      reason: "Caffeine provides stimulation that synergizes with L-theanine",
      adjustment: `${caffeineLevel}/10 → +${caffeineScore.toFixed(1)} points`,
      value: "Calm alertness and mental sharpness"
    });

    // Factor 3: Catechins (25% weight) - Body sensations, "buzz"
    // Scale 0-10 to 0-25 points (ESTIMATED from type + processing)
    const catechinScore = (catechinLevel / 10) * 25;
    totalScore += catechinScore;

    trace.push({
      step: "Catechin Contribution (25%)",
      reason: "Catechins/EGCG create body sensations and 'buzz' (estimated from tea type and processing)",
      adjustment: `${catechinLevel.toFixed(1)}/10 → +${catechinScore.toFixed(1)} points`,
      value: "Body warmth, lightness, buzzing sensations"
    });

    // Factor 4: Elevation (10% weight) - HIGH MOUNTAIN BOOST
    let elevationScore = 0;
    // FIXED: Use geographyInference.analysis.elevation.value
    const altitude = geographyInference?.analysis?.elevation?.value;

    if (altitude) {
      if (altitude >= 1500) {
        elevationScore = 10; // Very high mountain
      } else if (altitude >= 1000) {
        elevationScore = 8;  // High mountain
      } else if (altitude >= 600) {
        elevationScore = 5;  // Medium mountain
      } else {
        elevationScore = 2;  // Low elevation
      }

      totalScore += elevationScore;

      trace.push({
        step: "Elevation Factor (10%)",
        reason: "High elevation → slower growth → more amino acids (L-theanine + catechins)",
        adjustment: `${altitude}m → +${elevationScore} points`,
        value: altitude >= 1000 ? "High-mountain amplifies tea drunk" : "Lower elevation reduces intensity"
      });
    } else {
      trace.push({
        step: "Elevation Factor (10%)",
        reason: "No elevation data provided",
        adjustment: "Skipping elevation adjustment",
        value: "No bonus applied"
      });
    }

    // ========== TEA TYPE MULTIPLIER (20% effective weight) ==========
    // Try both taxonomy ID and raw type string
    const teaTypeId = teaTypeInference?.analysis?.teaType;

    // Handle generic "puerh" type by checking subType
    let lookupType = rawType;
    if (rawType === 'puerh') {
      if (rawSubType && rawSubType.includes('sheng')) {
        lookupType = 'puerh_sheng';
      } else if (rawSubType && rawSubType.includes('shou')) {
        lookupType = 'puerh_shou';
      }
    }

    // Look up multiplier (try taxonomy ID first, then lookup type)
    let multiplier = this.teaTypeMultipliers[teaTypeId] ||
                     this.teaTypeMultipliers[lookupType] ||
                     1.0;

    const beforeMultiplier = totalScore;
    totalScore = totalScore * multiplier;

    trace.push({
      step: "Tea Type Multiplier (20%)",
      reason: "Empirical cultural knowledge - certain tea types have stronger tea drunk effects",
      adjustment: `Type: ${teaTypeId || lookupType} (${multiplier}x): ${beforeMultiplier.toFixed(1)} → ${totalScore.toFixed(1)}`,
      value: multiplier > 1.0 ? "This tea type amplifies tea drunk" : multiplier < 1.0 ? "This tea type reduces tea drunk" : "Standard tea drunk potential"
    });

    // Cap at 100
    totalScore = Math.min(100, Math.max(0, totalScore));

    // ========== INTENSITY CLASSIFICATION ==========
    const intensity = this._classifyIntensity(totalScore);

    trace.push({
      step: "Final Classification",
      reason: "Determine intensity level from total score",
      adjustment: `Score ${totalScore.toFixed(1)} → ${intensity}`,
      value: "Intensity level determined"
    });

    // ========== CHARACTER PROFILE ==========
    const numericRatio = parseFloat(ratio);
    const character = this._determineCharacter(numericRatio, caffeineLevel, lTheanineLevel);

    // ========== TIMING & RECOMMENDATIONS ==========
    const timing = this._calculateTiming(caffeineLevel, lTheanineLevel);
    const recommendations = this._buildRecommendations(intensity, character, caffeineLevel);
    const warnings = this._buildWarnings(intensity, caffeineLevel);

    // ========== BUILD RESPONSE ==========
    return {
      drunkennessPotential: Math.round(totalScore),
      intensity,
      character,
      timing,

      // Recommendations for maximizing experience
      recommendations,

      // Safety warnings
      warnings,

      // Supporting analysis
      analysis: {
        factors: {
          lTheanine: lTheanineScore.toFixed(1),
          caffeine: caffeineScore.toFixed(1),
          catechins: catechinScore.toFixed(1),
          elevation: elevationScore
        },
        teaTypeMultiplier: multiplier,
        idealRatioRange: "1.5-3.0",
        currentRatio: numericRatio.toFixed(2)
      },

      // Metadata
      trace,
      confidence: this._calculateConfidence(compoundAnalysis, geographyInference, catechinLevel),
      rendererVersion: '2.0'
    };
  }

  // ========== HELPER METHODS ==========

  /**
   * Classify intensity based on score
   */
  _classifyIntensity(score) {
    if (score >= this.intensityThresholds.veryHigh) return "Very High";
    if (score >= this.intensityThresholds.high) return "High";
    if (score >= this.intensityThresholds.medium) return "Medium";
    if (score >= this.intensityThresholds.low) return "Low";
    return "Very Low";
  }

  /**
   * Determine character profile based on compound balance
   * Updated to reflect correct ideal ratio range (1.5-3.0)
   */
  _determineCharacter(ratio, caffeine, lTheanine) {
    if (ratio >= 3.0) {
      return "Deep Calm with Gentle Euphoria";
    } else if (ratio >= 2.0) {
      return "Balanced Clarity with Body Buzz";
    } else if (ratio >= 1.5) {
      return "Alert Euphoria with Mental Sharpness";
    } else {
      return "Stimulated Awareness (Less 'Drunk', More Alert)";
    }
  }

  /**
   * Calculate onset and duration
   */
  _calculateTiming(caffeine, lTheanine) {
    // Higher compounds = faster onset, longer duration
    const onsetMin = Math.max(10, 25 - (caffeine + lTheanine) / 2);
    const onsetMax = onsetMin + 10;
    const durationMin = Math.min(180, 45 + (lTheanine * 5));
    const durationMax = durationMin + 30;

    return {
      onset: `${Math.round(onsetMin)}-${Math.round(onsetMax)} minutes`,
      peak: `${Math.round(durationMin)}-${Math.round(durationMax)} minutes`,
      description: "Effects build gradually and can last several hours with multiple infusions"
    };
  }

  /**
   * Build recommendations for maximizing experience
   */
  _buildRecommendations(intensity, character, caffeine) {
    const recs = [];

    // Brewing
    recs.push("Use gongfu brewing (multiple short infusions) for sustained, evolving experience");

    // Timing
    if (caffeine > 5) {
      recs.push("Best consumed in morning or early afternoon to avoid sleep disruption");
    } else {
      recs.push("Can be enjoyed throughout the day");
    }

    // Context
    if (intensity === "High" || intensity === "Very High") {
      recs.push("Empty stomach amplifies effects - consider light food if sensitive");
      recs.push("Create a calm environment for mindful appreciation");
    }

    // Progression
    recs.push("Start with 2-3 infusions, pause to assess effects before continuing");

    return recs;
  }

  /**
   * Build safety warnings
   */
  _buildWarnings(intensity, caffeine) {
    const warnings = [];

    if (intensity === "Very High" || intensity === "High") {
      warnings.push("Strong tea drunk potential - start with shorter steeps if sensitive");
      warnings.push("May cause dizziness, nausea, or cold sweats if over-consumed on empty stomach");
    }

    if (caffeine > 6) {
      warnings.push("High caffeine content - avoid if sensitive to stimulants");
    }

    warnings.push("Individual sensitivity varies - reduce amount or steep time if effects are too strong");

    return warnings;
  }

  /**
   * Calculate confidence score
   */
  _calculateConfidence(compoundAnalysis, geographyInference, catechinLevel) {
    let confidence = 0.7; // Base

    // Boost for complete compound data
    if (compoundAnalysis.caffeineLevel > 0 && compoundAnalysis.lTheanineLevel > 0) {
      confidence += 0.15;
    }

    // Boost for catechin estimation (estimated data, but based on solid logic)
    if (catechinLevel > 0) {
      confidence += 0.05;
    }

    // Boost for elevation data (fixed to use correct path)
    if (geographyInference?.analysis?.elevation?.value) {
      confidence += 0.1;
    }

    return Math.min(0.95, confidence);
  }

  /**
   * Return error render when inference fails
   */
  _failedRender(reason, trace) {
    return {
      drunkennessPotential: 0,
      intensity: "Unknown",
      character: "Unknown",
      recommendations: [],
      warnings: [],
      trace: [...trace, {
        step: "Error",
        reason,
        adjustment: "Unable to calculate tea drunkenness",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }
}
