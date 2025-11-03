/**
 * FlavorInferrer.js
 *
 * Purpose: Infer flavor characteristics and hints from raw flavor profile data
 * Input: { flavorProfiles: ["jasmine", "honey", "sweet", ...] }
 * Output: Structured flavor analysis with food, seasonal, and activity hints
 *
 * This Inferrer uses the Unified Taxonomy System to lookup and aggregate flavor hints
 * that will be used by FoodRenderer, TimeRenderer, and other renderers
 */

import TaxonomyRegistry, {
  FlavorTaxonomy
} from '../../taxonomies/index.js';

export class FlavorInferrer {
  constructor(config = {}) {
    this.config = config;
    this.registry = TaxonomyRegistry;
    this.flavorTaxonomy = FlavorTaxonomy;
  }

  /**
   * Infer flavor characteristics from raw form data
   * @param {Object} formData - { flavorProfiles: ["jasmine", "honey", ...] }
   * @returns {Object} - Structured flavor inference output
   */
  infer(formData) {
    const flavorProfiles = Array.isArray(formData?.flavorProfiles)
      ? formData.flavorProfiles
      : [];

    const trace = [];

    // Step 1: Input validation
    trace.push({
      step: "Input Reception",
      reason: "Raw flavor profile data received",
      adjustment: `Received ${flavorProfiles.length} flavor notes`,
      value: flavorProfiles.length > 0 ? flavorProfiles.join(', ') : 'None'
    });

    // Handle empty flavor data
    if (flavorProfiles.length === 0) {
      return this._emptyInference(trace);
    }

    // Step 2: Normalize and validate flavors
    const normalizedFlavors = this._normalizeFlavors(flavorProfiles);
    trace.push({
      step: "Flavor Normalization",
      reason: "Standardize flavor names for lookup",
      adjustment: `Normalized ${normalizedFlavors.length} flavors`,
      value: normalizedFlavors.join(', ')
    });

    // Step 3: Look up flavor data and aggregate hints
    const { identifiedFlavors, notFound, allHints } = this._lookupAndAggregateHints(normalizedFlavors, trace);

    trace.push({
      step: "Flavor Lookup Summary",
      reason: "Search FlavorInfluences database",
      adjustment: `Found data for ${identifiedFlavors.length}/${normalizedFlavors.length} flavors`,
      value: `Identified: ${identifiedFlavors.join(', ')}${notFound.length > 0 ? ` | Not Found: ${notFound.join(', ')}` : ''}`
    });

    // Step 4: Determine dominant flavors
    const dominantFlavors = this._getDominantFlavors(identifiedFlavors);
    trace.push({
      step: "Dominant Flavors Selection",
      reason: "Identify top 3-5 flavors",
      adjustment: `Selected ${dominantFlavors.length} dominant flavors`,
      value: dominantFlavors.join(', ')
    });

    // Step 5: Determine flavor categories
    const dominantCategories = this._getDominantCategories(identifiedFlavors);
    trace.push({
      step: "Category Determination",
      reason: "Identify flavor category groupings",
      adjustment: `Found ${dominantCategories.length} categories`,
      value: dominantCategories.join(', ')
    });

    // Step 6: Estimate intensity
    const intensityEstimate = this._estimateIntensity(flavorProfiles.length);
    trace.push({
      step: "Intensity Estimation",
      reason: `Based on ${flavorProfiles.length} flavor notes`,
      adjustment: `Categorized as '${intensityEstimate}'`,
      value: intensityEstimate
    });

    // Step 7: Finalize aggregated hints
    const finalHints = {
      foodPairingHints: Array.from(allHints.foodPairingHints),
      seasonalAffinityHints: Array.from(allHints.seasonalAffinityHints),
      activityHints: Array.from(allHints.activityHints)
    };

    trace.push({
      step: "Hints Aggregation",
      reason: "Combine all hints from identified flavors",
      adjustment: `Food: ${finalHints.foodPairingHints.length}, Seasonal: ${finalHints.seasonalAffinityHints.length}, Activity: ${finalHints.activityHints.length}`,
      value: `Sample food hints: ${finalHints.foodPairingHints.slice(0, 3).join(', ')}`
    });

    // Step 8: Generate description
    const description = this._generateDescription(identifiedFlavors, dominantFlavors, dominantCategories, intensityEstimate);
    trace.push({
      step: "Description Generation",
      reason: "Summarize flavor analysis",
      adjustment: "Generated human-readable description",
      value: description.substring(0, 50) + "..."
    });

    return {
      // Raw inputs
      inputs: {
        flavorProfiles
      },

      // Inferred analysis (for Renderers to consume)
      analysis: {
        identifiedFlavors,
        dominantFlavors,
        dominantCategories,
        intensityEstimate,
        ...finalHints
      },

      // Metadata
      trace,
      confidence: this._calculateConfidence(identifiedFlavors.length, flavorProfiles.length),
      description,
      inferrerVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Normalize flavor names for consistent lookup
   */
  _normalizeFlavors(flavorProfiles) {
    return flavorProfiles
      .map(f => String(f).toLowerCase().trim())
      .filter(f => f.length > 0);
  }

  /**
   * Look up flavor data in FlavorInfluences and aggregate hints
   */
  _lookupAndAggregateHints(normalizedFlavors, trace) {
    const identifiedFlavors = [];
    const notFound = [];
    const allHints = {
      foodPairingHints: new Set(),
      seasonalAffinityHints: new Set(),
      activityHints: new Set()
    };

    normalizedFlavors.forEach(flavor => {
      const flavorData = this._getFlavorData(flavor);

      if (flavorData) {
        identifiedFlavors.push(flavor);

        // Aggregate food pairing hints
        if (Array.isArray(flavorData.foodPairingHints)) {
          flavorData.foodPairingHints.forEach(hint => allHints.foodPairingHints.add(hint));
          trace.push({
            step: "Food Hint Aggregation",
            reason: `Flavor: '${flavor}'`,
            adjustment: `Added ${flavorData.foodPairingHints.length} food hints`,
            value: flavorData.foodPairingHints.join(', ')
          });
        }

        // Aggregate seasonal affinity hints
        if (Array.isArray(flavorData.seasonalAffinityHints)) {
          flavorData.seasonalAffinityHints.forEach(hint => allHints.seasonalAffinityHints.add(hint));
          trace.push({
            step: "Seasonal Hint Aggregation",
            reason: `Flavor: '${flavor}'`,
            adjustment: `Added ${flavorData.seasonalAffinityHints.length} seasonal hints`,
            value: flavorData.seasonalAffinityHints.join(', ')
          });
        }

        // Aggregate activity hints
        if (Array.isArray(flavorData.activityHints)) {
          flavorData.activityHints.forEach(hint => allHints.activityHints.add(hint));
          trace.push({
            step: "Activity Hint Aggregation",
            reason: `Flavor: '${flavor}'`,
            adjustment: `Added ${flavorData.activityHints.length} activity hints`,
            value: flavorData.activityHints.join(', ')
          });
        }
      } else {
        notFound.push(flavor);
        trace.push({
          step: "Flavor Lookup",
          reason: `Flavor: '${flavor}'`,
          adjustment: "No data found in FlavorInfluences",
          value: "Unknown flavor"
        });
      }
    });

    return { identifiedFlavors, notFound, allHints };
  }

  /**
   * Look up a single flavor in FlavorTaxonomy
   * Uses TaxonomyRegistry for unified access with alias matching
   */
  _getFlavorData(normalizedFlavor) {
    try {
      // TaxonomyRegistry handles case-insensitive lookup and alias matching
      const flavor = this.flavorTaxonomy.getFlavor(normalizedFlavor);
      return flavor;
    } catch (error) {
      // Flavor not found in taxonomy
      return null;
    }
  }

  /**
   * Determine dominant flavors (top 3-5)
   */
  _getDominantFlavors(identifiedFlavors) {
    const limit = Math.min(5, Math.max(3, Math.ceil(identifiedFlavors.length / 2)));
    return identifiedFlavors.slice(0, limit);
  }

  /**
   * Determine dominant flavor categories from identified flavors
   * Uses FlavorTaxonomy to get category assignments
   */
  _getDominantCategories(identifiedFlavors) {
    const categories = new Set();

    identifiedFlavors.forEach(flavorName => {
      try {
        const flavor = this.flavorTaxonomy.getFlavor(flavorName);
        if (flavor && flavor.category) {
          // Get the display name from FlavorTaxonomy
          const categoryObj = this.flavorTaxonomy.getCategory(flavor.category);
          if (categoryObj) {
            categories.add(categoryObj.displayName);
          }
        }
      } catch (error) {
        // Flavor not found, skip
      }
    });

    return Array.from(categories);
  }

  /**
   * Estimate flavor intensity (0-10 scale)
   */
  _estimateIntensity(flavorCount) {
    if (flavorCount === 0) return "N/A";
    if (flavorCount <= 2) return "Subtle";
    if (flavorCount <= 4) return "Moderate";
    if (flavorCount <= 6) return "Pronounced";
    return "Complex";
  }

  /**
   * Calculate confidence in the inference
   */
  _calculateConfidence(identifiedCount, totalCount) {
    if (totalCount === 0) return 0.0;
    const matchRatio = identifiedCount / totalCount;

    if (matchRatio >= 0.8) return 0.95;
    if (matchRatio >= 0.6) return 0.85;
    if (matchRatio >= 0.4) return 0.70;
    return 0.50;
  }

  /**
   * Generate human-readable description
   */
  _generateDescription(identifiedFlavors, dominantFlavors, categories, intensity) {
    let desc = `This tea has a '${intensity.toLowerCase()}' flavor profile. `;

    if (dominantFlavors.length > 0) {
      desc += `Dominant notes include ${dominantFlavors.join(', ')}. `;
    }

    if (categories.length > 0) {
      desc += `Overall, the flavor falls into the ${categories.join(', ')} categories. `;
    }

    desc += `The complete profile encompasses ${identifiedFlavors.length} distinct flavor notes.`;

    return desc;
  }

  /**
   * Return empty inference when no flavor data provided
   */
  _emptyInference(trace) {
    trace.push({
      step: "Input Validation",
      reason: "No flavor profile provided",
      adjustment: "Returning empty inference",
      value: "No data"
    });

    return {
      inputs: {
        flavorProfiles: []
      },
      analysis: {
        identifiedFlavors: [],
        dominantFlavors: [],
        dominantCategories: [],
        intensityEstimate: "N/A",
        foodPairingHints: [],
        seasonalAffinityHints: [],
        activityHints: []
      },
      trace,
      confidence: 0.0,
      description: "No flavor profile available.",
      inferrerVersion: '1.0'
    };
  }
}
