/**
 * TeaTypeInferrer.js
 *
 * Purpose: Infer tea type characteristics and analysis
 * Input: { type, subType } tea data
 * Output: Structured tea type analysis with chemical composition, flavor profile, seasonal tendency
 *
 * This Inferrer uses TeaTypeTaxonomy to analyze tea characteristics
 */

import { TeaTypeTaxonomy } from '../../taxonomies/index.js';

export class TeaTypeInferrer {
  constructor(config = {}) {
    this.config = config;
    this.teaTypeTaxonomy = TeaTypeTaxonomy;
  }

  /**
   * Infer tea type characteristics from raw tea data
   * @param {Object} formData - { type, subType }
   * @returns {Object} - Structured tea type analysis
   */
  infer(formData) {
    const teaType = String(formData?.type || '').toLowerCase().trim();
    const teaSubType = formData?.subType ? String(formData.subType).toLowerCase().trim() : null;

    const trace = [];

    // Step 1: Input validation
    trace.push({
      step: "Input Reception",
      reason: "Raw tea type data received",
      adjustment: `Type: ${teaType}, SubType: ${teaSubType || 'None'}`,
      value: "Data validated"
    });

    // Handle empty tea type
    if (!teaType) {
      return this._emptyInference(trace);
    }

    // Step 2: Look up tea type in taxonomy
    let teaTypeObj = this.teaTypeTaxonomy.getType(teaType);

    if (!teaTypeObj) {
      return this._emptyInference(trace, `Tea type '${teaType}' not found in taxonomy`);
    }

    trace.push({
      step: "Tea Type Lookup",
      reason: `Search for tea type: ${teaType}`,
      adjustment: `Found: ${teaTypeObj.displayName}`,
      value: teaTypeObj.id
    });

    // Step 3: Look up subtype if provided
    let teaSubTypeObj = null;
    if (teaSubType) {
      teaSubTypeObj = this.teaTypeTaxonomy.getSubtype(teaSubType);

      if (teaSubTypeObj) {
        trace.push({
          step: "Tea SubType Lookup",
          reason: `Search for subtype: ${teaSubType}`,
          adjustment: `Found: ${teaSubTypeObj.displayName}`,
          value: teaSubTypeObj.id
        });
      } else {
        trace.push({
          step: "Tea SubType Lookup",
          reason: `Search for subtype: ${teaSubType}`,
          adjustment: "SubType not found, using type defaults",
          value: "Using type-level analysis"
        });
      }
    }

    // Step 4: Extract chemical composition
    const caffeine = teaSubTypeObj?.caffeineRange || teaTypeObj?.caffeineRange || [0, 0];
    const theanine = teaSubTypeObj?.theanineRange || teaTypeObj?.theanineRange || [0, 0];
    const caffeineLevel = (caffeine[0] + caffeine[1]) / 2;
    const theanineLevel = (theanine[0] + theanine[1]) / 2;

    trace.push({
      step: "Chemical Composition Analysis",
      reason: "Extract caffeine and L-theanine ranges",
      adjustment: `Caffeine: ${caffeine[0]}-${caffeine[1]}, L-Theanine: ${theanine[0]}-${theanine[1]}`,
      value: `Avg Caffeine: ${caffeineLevel.toFixed(1)}, Avg L-Theanine: ${theanineLevel.toFixed(1)}`
    });

    // Step 5: Determine dominant flavor categories
    const dominantFlavors = teaSubTypeObj?.dominantFlavorCategories ||
                           teaTypeObj?.dominantFlavorCategories ||
                           [];

    trace.push({
      step: "Dominant Flavor Extraction",
      reason: "Identify tea's natural flavor profiles",
      adjustment: `Found ${dominantFlavors.length} dominant flavor categories`,
      value: dominantFlavors.join(', ')
    });

    // Step 6: Extract base activity hints
    const activityHints = teaSubTypeObj?.baseActivityHints ||
                         teaTypeObj?.baseActivityHints ||
                         [];

    trace.push({
      step: "Activity Hints Extraction",
      reason: "Identify suitable activities for this tea type",
      adjustment: `Found ${activityHints.length} activity hints`,
      value: activityHints.join(', ')
    });

    // Step 7: Extract processing methods
    const processingMethods = teaSubTypeObj?.commonProcessing ||
                             teaTypeObj?.commonProcessing ||
                             [];

    trace.push({
      step: "Processing Methods Extraction",
      reason: "Identify common processing for this tea type",
      adjustment: `Found ${processingMethods.length} processing methods`,
      value: processingMethods.join(', ')
    });

    // Step 8: Determine seasonal tendency
    const seasonalTendency = teaSubTypeObj?.seasonalTendency ||
                            teaTypeObj?.seasonalTendency ||
                            "Anytime";

    trace.push({
      step: "Seasonal Tendency Analysis",
      reason: "Identify optimal consumption seasons",
      adjustment: `Seasonal tendency: ${seasonalTendency}`,
      value: seasonalTendency
    });

    // Step 9: Determine time of day suitability
    const timeOfDaySuitability = teaSubTypeObj?.timeOfDaySuitability ||
                                teaTypeObj?.timeOfDaySuitability ||
                                "Flexible";

    trace.push({
      step: "Time of Day Analysis",
      reason: "Identify best times to drink this tea",
      adjustment: `Time of day: ${timeOfDaySuitability}`,
      value: timeOfDaySuitability
    });

    // Step 10: Calculate oxidation level (rough estimate from type)
    const oxidationLevel = this._estimateOxidationLevel(teaType);

    trace.push({
      step: "Oxidation Level Estimation",
      reason: `Based on tea type: ${teaType}`,
      adjustment: `Estimated oxidation: ${oxidationLevel}%`,
      value: oxidationLevel
    });

    // Step 11: Generate description
    const description = this._generateDescription(
      teaTypeObj.displayName,
      teaSubTypeObj?.displayName || null,
      caffeineLevel,
      theanineLevel,
      dominantFlavors,
      seasonalTendency
    );

    trace.push({
      step: "Description Generation",
      reason: "Summarize tea type analysis",
      adjustment: "Generated human-readable description",
      value: description.substring(0, 50) + "..."
    });

    return {
      // Raw inputs
      inputs: {
        type: teaType,
        subType: teaSubType
      },

      // Inferred analysis
      analysis: {
        teaType: teaTypeObj.id,
        teaSubType: teaSubTypeObj?.id || null,
        displayName: teaSubTypeObj?.displayName || teaTypeObj.displayName,

        // Chemical composition
        chemicalComposition: {
          caffeineRange: caffeine,
          caffeineAverage: parseFloat(caffeineLevel.toFixed(2)),
          theanineRange: theanine,
          theanineAverage: parseFloat(theanineLevel.toFixed(2)),
          ratio: parseFloat((theanineLevel / caffeineLevel).toFixed(2))
        },

        // Flavor profile
        dominantFlavorCategories: dominantFlavors,

        // Activity compatibility
        activityHints: activityHints,

        // Processing
        commonProcessing: processingMethods,

        // Seasonal & temporal
        seasonalTendency,
        timeOfDaySuitability,

        // Oxidation
        oxidationLevel,

        // Quality tier (if available)
        qualityTier: teaSubTypeObj?.qualityTier || teaTypeObj?.qualityTier || "Standard"
      },

      // Metadata
      trace,
      confidence: this._calculateConfidence(teaTypeObj, teaSubTypeObj),
      description,
      inferrerVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Estimate oxidation level based on tea type
   */
  _estimateOxidationLevel(teaType) {
    const oxidationMap = {
      'white': 5,
      'green': 10,
      'yellow': 15,
      'oolong': 50,
      'black': 90,
      'puerh': 100
    };
    return oxidationMap[teaType] || 50;
  }

  /**
   * Calculate confidence in the inference
   */
  _calculateConfidence(teaTypeObj, teaSubTypeObj) {
    // If subtype was found and matches, higher confidence
    if (teaSubTypeObj) return 0.95;
    // If only type was found
    if (teaTypeObj) return 0.85;
    // Default
    return 0.70;
  }

  /**
   * Generate human-readable description
   */
  _generateDescription(typeName, subTypeName, caffeine, theanine, flavors, seasonal) {
    let desc = `${subTypeName || typeName} is a ${seasonal.toLowerCase()} tea. `;

    if (caffeine > 5) {
      desc += "It has high caffeine content, suitable for morning or focused work. ";
    } else if (caffeine > 3) {
      desc += "It has moderate caffeine content. ";
    } else {
      desc += "It has low caffeine content, suitable for evening enjoyment. ";
    }

    if (theanine > 5) {
      desc += "High L-theanine promotes calm alertness. ";
    } else if (theanine > 2) {
      desc += "Moderate L-theanine provides mild relaxation. ";
    }

    if (flavors.length > 0) {
      desc += `The flavor profile features ${flavors.slice(0, 2).join(', ')} notes. `;
    }

    desc += `Best enjoyed ${seasonal.toLowerCase()}.`;

    return desc;
  }

  /**
   * Return empty inference when no tea type provided
   */
  _emptyInference(trace, errorMsg = null) {
    if (errorMsg) {
      trace.push({
        step: "Error",
        reason: errorMsg,
        adjustment: "Returning empty inference",
        value: "No data"
      });
    } else {
      trace.push({
        step: "Input Validation",
        reason: "No tea type provided",
        adjustment: "Returning empty inference",
        value: "No data"
      });
    }

    return {
      inputs: {
        type: null,
        subType: null
      },
      analysis: {
        teaType: null,
        teaSubType: null,
        displayName: "Unknown",
        chemicalComposition: {
          caffeineRange: [0, 0],
          caffeineAverage: 0,
          theanineRange: [0, 0],
          theanineAverage: 0,
          ratio: 0
        },
        dominantFlavorCategories: [],
        activityHints: [],
        commonProcessing: [],
        seasonalTendency: "Unknown",
        timeOfDaySuitability: "Unknown",
        oxidationLevel: 0,
        qualityTier: "Unknown"
      },
      trace,
      confidence: 0.0,
      description: "No tea type available.",
      inferrerVersion: '1.0'
    };
  }
}
