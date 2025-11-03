/**
 * CompoundInferrer.js
 *
 * Purpose: Infer compound characteristics from raw caffeine/L-theanine levels
 * Input: { caffeineLevel: 0-10, lTheanineLevel: 0-10 }
 * Output: Structured analysis for consumption by Renderers
 *
 * This is the FIRST INFERRER - proof of concept for the Inferrer/Renderer pattern
 */

export class CompoundInferrer {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Infer compound characteristics from raw form data
   * @param {Object} formData - { caffeineLevel, lTheanineLevel }
   * @returns {Object} - Structured inference output
   */
  infer(formData) {
    const caffeineLevel = typeof formData?.caffeineLevel === 'number' ? formData.caffeineLevel : 0;
    const lTheanineLevel = typeof formData?.lTheanineLevel === 'number' ? formData.lTheanineLevel : 0;

    // Handle missing data
    if (caffeineLevel === 0 && lTheanineLevel === 0) {
      return this._emptyInference();
    }

    const trace = [];

    trace.push({
      step: "Input Reception",
      reason: "Raw form data received",
      adjustment: `caffeineLevel: ${caffeineLevel}, lTheanineLevel: ${lTheanineLevel}`,
      value: "Data validated"
    });

    // Calculate ratio
    const ratio = caffeineLevel > 0 ? lTheanineLevel / caffeineLevel : 0;

    trace.push({
      step: "Ratio Calculation",
      reason: "Determine L-theanine/Caffeine balance",
      adjustment: `Ratio = ${lTheanineLevel} / ${caffeineLevel}`,
      value: ratio.toFixed(2)
    });

    // Determine ratio category
    const ratioCategory = this._determineRatioCategory(ratio);
    trace.push({
      step: "Ratio Categorization",
      reason: `Ratio: ${ratio.toFixed(2)}`,
      adjustment: `Categorized as '${ratioCategory}'`,
      value: ratioCategory
    });

    // Determine stimulation level
    const stimulationLevel = this._determineStimulatingEffect(caffeineLevel, lTheanineLevel);
    trace.push({
      step: "Stimulation Analysis",
      reason: `Caffeine: ${caffeineLevel}, L-Theanine: ${lTheanineLevel}`,
      adjustment: `Determined as '${stimulationLevel}'`,
      value: stimulationLevel
    });

    // Determine relaxation level
    const relaxationLevel = this._determineRelaxingEffect(lTheanineLevel);
    trace.push({
      step: "Relaxation Analysis",
      reason: `L-Theanine: ${lTheanineLevel}`,
      adjustment: `Determined as '${relaxationLevel}'`,
      value: relaxationLevel
    });

    // Determine compound profile
    const compoundProfile = this._determineCompoundProfile(stimulationLevel, relaxationLevel, ratioCategory);
    trace.push({
      step: "Profile Synthesis",
      reason: `Stim: ${stimulationLevel}, Relax: ${relaxationLevel}, Ratio: ${ratioCategory}`,
      adjustment: `Determined as '${compoundProfile}'`,
      value: compoundProfile
    });

    return {
      // Inferred analysis (for Renderers to consume)
      // ALL analyzed metrics go here - renderers should ONLY access .analysis
      analysis: {
        // Raw compound values
        caffeineLevel,
        lTheanineLevel,

        // Derived metrics
        ratio: ratio.toFixed(2),
        ratioCategory,
        stimulationLevel,
        relaxationLevel,
        compoundProfile
      },

      // Metadata
      trace,
      confidence: this._calculateConfidence(caffeineLevel, lTheanineLevel),
      inferrerVersion: '2.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Categorize the L-theanine/Caffeine ratio
   */
  _determineRatioCategory(ratio) {
    if (ratio <= 0) return "N/A";
    if (ratio >= 2.0) return "Theanine Dominant (>=2.0)";
    if (ratio >= 1.5 && ratio < 2.0) return "Theanine Leaning (1.5 to <2.0)";
    if (ratio >= 0.8) return "Balanced (0.8-1.5)";
    if (ratio >= 0.5) return "Caffeine Leaning (0.5-0.8)";
    return "Caffeine Dominant (<0.5)";
  }

  /**
   * Determine stimulation level (6-level scale)
   */
  _determineStimulatingEffect(caffeineLevel, lTheanineLevel) {
    if (caffeineLevel <= 0) return "None";
    if (caffeineLevel <= 1.5) return "Very Low";
    if (caffeineLevel <= 3.5) return "Low";
    if (caffeineLevel <= 5.5) return "Moderate";
    if (caffeineLevel <= 7.5) {
      // Moderated by high L-theanine?
      if (lTheanineLevel >= 5.5) {
        return "High (Smooth)";
      } else {
        return "High";
      }
    }
    // Very high caffeine (>7.5)
    if (lTheanineLevel >= 7.5) {
      return "Very High (Smooth)";
    } else {
      return "Very High";
    }
  }

  /**
   * Determine relaxation level (6-level scale)
   */
  _determineRelaxingEffect(lTheanineLevel) {
    if (lTheanineLevel <= 0) return "None";
    if (lTheanineLevel <= 1.5) return "Very Low";
    if (lTheanineLevel <= 3.5) return "Low";
    if (lTheanineLevel <= 5.5) return "Moderate";
    if (lTheanineLevel <= 7.5) return "High";
    return "Very High";
  }

  /**
   * Determine overall compound profile
   */
  _determineCompoundProfile(stimulationLevel, relaxationLevel, ratioCategory) {
    switch (ratioCategory) {
      case "Theanine Dominant (>=2.0)":
        return (stimulationLevel === "None" || stimulationLevel === "Very Low")
          ? "Deeply Calm"
          : "Calm & Clear";

      case "Theanine Leaning (1.5 to <2.0)":
        return (stimulationLevel === "High (Smooth)" || stimulationLevel === "Very High (Smooth)")
          ? "Smooth & Alert"
          : "Smooth & Sustained";

      case "Balanced (0.8-1.5)":
        return "Balanced & Focused";

      case "Caffeine Leaning (0.5-0.8)":
        return (relaxationLevel === "None" || relaxationLevel === "Very Low")
          ? "Sharp & Driven"
          : "Focused & Energized";

      case "Caffeine Dominant (<0.5)":
        return "Intense & Sharp";

      default:
        return "Variable";
    }
  }

  /**
   * Calculate confidence in the inference
   */
  _calculateConfidence(caffeineLevel, lTheanineLevel) {
    // High confidence if both values are provided
    if (caffeineLevel > 0 && lTheanineLevel > 0) return 0.95;
    // Medium confidence if only one is provided
    if (caffeineLevel > 0 || lTheanineLevel > 0) return 0.75;
    // Low confidence if neither provided
    return 0.1;
  }

  /**
   * Return empty inference when no data provided
   */
  _emptyInference() {
    return {
      analysis: {
        caffeineLevel: 0,
        lTheanineLevel: 0,
        ratio: "0.00",
        ratioCategory: "N/A",
        stimulationLevel: "None",
        relaxationLevel: "None",
        compoundProfile: "N/A"
      },
      trace: [{
        step: "Input Validation",
        reason: "No compound data provided",
        adjustment: "Returning empty inference",
        value: "No data"
      }],
      confidence: 0.0,
      inferrerVersion: '2.0'
    };
  }
}
