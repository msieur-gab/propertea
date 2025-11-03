/**
 * ProcessingInferrer.js
 *
 * Purpose: Infer processing characteristics and analysis
 * Input: { processingMethods: [...] } processing method data
 * Output: Structured processing analysis with thermal effects, flavor impacts, mouthfeel
 *
 * This Inferrer uses ProcessingTaxonomy to analyze processing methods
 */

import { ProcessingTaxonomy } from '../../taxonomies/index.js';

export class ProcessingInferrer {
  constructor(config = {}) {
    this.config = config;
    this.processingTaxonomy = ProcessingTaxonomy;
  }

  /**
   * Infer processing characteristics from raw processing method data
   * @param {Object} formData - { processingMethods: [...] }
   * @returns {Object} - Structured processing analysis
   */
  infer(formData) {
    const processingMethods = Array.isArray(formData?.processingMethods)
      ? formData.processingMethods
      : [];

    const trace = [];

    // Step 1: Input validation
    trace.push({
      step: "Input Reception",
      reason: "Raw processing method data received",
      adjustment: `Received ${processingMethods.length} processing methods`,
      value: processingMethods.length > 0 ? processingMethods.join(', ') : 'None'
    });

    // Handle empty processing data
    if (processingMethods.length === 0) {
      return this._emptyInference(trace);
    }

    // Step 2: Normalize and lookup processing methods
    const identifiedMethods = [];
    const notFound = [];

    processingMethods.forEach(method => {
      const normalized = String(method).toLowerCase().trim();
      const methodObj = this.processingTaxonomy.getMethod(normalized);

      if (methodObj) {
        identifiedMethods.push(methodObj);
        trace.push({
          step: "Processing Method Lookup",
          reason: `Method: '${method}'`,
          adjustment: `Found: ${methodObj.displayName}`,
          value: methodObj.id
        });
      } else {
        notFound.push(method);
        trace.push({
          step: "Processing Method Lookup",
          reason: `Method: '${method}'`,
          adjustment: "Not found in taxonomy",
          value: "Skipped"
        });
      }
    });

    trace.push({
      step: "Method Lookup Summary",
      reason: "Search ProcessingTaxonomy database",
      adjustment: `Found ${identifiedMethods.length}/${processingMethods.length} methods`,
      value: `Identified: ${identifiedMethods.map(m => m.displayName).join(', ')}${notFound.length > 0 ? ` | Not Found: ${notFound.join(', ')}` : ''}`
    });

    // Step 3: Determine dominant processing categories
    const dominantCategories = this._getDominantCategories(identifiedMethods);

    trace.push({
      step: "Category Determination",
      reason: "Identify processing category groupings",
      adjustment: `Found ${dominantCategories.length} categories`,
      value: dominantCategories.join(', ')
    });

    // Step 4: Aggregate thermal effects
    const thermalEffect = this._aggregateThermalEffect(identifiedMethods);

    trace.push({
      step: "Thermal Effect Analysis",
      reason: "Combine thermal characteristics from all methods",
      adjustment: `Determined overall effect: ${thermalEffect}`,
      value: "Based on oxidation stop, roasting, and fermentation methods"
    });

    // Step 5: Aggregate flavor impacts
    const flavorImpacts = this._aggregateFlavorImpacts(identifiedMethods);

    trace.push({
      step: "Flavor Impact Aggregation",
      reason: "Combine flavor changes from processing",
      adjustment: `Identified ${flavorImpacts.length} major flavor impacts`,
      value: flavorImpacts.join(', ')
    });

    // Step 6: Determine mouthfeel characteristic
    const mouthfeelCharacteristic = this._determineMouthfeel(identifiedMethods);

    trace.push({
      step: "Mouthfeel Determination",
      reason: "Identify texture and body characteristics",
      adjustment: `Mouthfeel: ${mouthfeelCharacteristic}`,
      value: "Based on oxidation, roasting, and bruising methods"
    });

    // Step 7: Determine energetic tendency
    const energeticTendency = this._determineEnergeticTendency(identifiedMethods);

    trace.push({
      step: "Energetic Tendency Analysis",
      reason: "Determine energizing or calming effect",
      adjustment: `Tendency: ${energeticTendency}`,
      value: "Based on oxidation and fermentation levels"
    });

    // Step 8: Determine compound effect
    const compoundEffect = this._determineCompoundEffect(thermalEffect, energeticTendency);

    trace.push({
      step: "Compound Effect Determination",
      reason: "Estimate caffeine/theanine modulation",
      adjustment: `Compound effect: ${compoundEffect}`,
      value: "Based on processing methods"
    });

    // Step 9: Identify roast level
    const roastLevel = this._determineRoastLevel(identifiedMethods);

    trace.push({
      step: "Roast Level Analysis",
      reason: "Identify roasting intensity if applied",
      adjustment: `Roast level: ${roastLevel}`,
      value: "Based on roasting methods present"
    });

    // Step 10: Assess oxidation impact
    const oxidationLevel = this._assessOxidationLevel(identifiedMethods);

    trace.push({
      step: "Oxidation Assessment",
      reason: "Determine oxidation completeness",
      adjustment: `Oxidation impact: ${oxidationLevel}`,
      value: "Based on oxidation and drying methods"
    });

    // Step 11: Generate description
    const description = this._generateDescription(
      identifiedMethods,
      thermalEffect,
      flavorImpacts,
      mouthfeelCharacteristic,
      energeticTendency
    );

    trace.push({
      step: "Description Generation",
      reason: "Summarize processing analysis",
      adjustment: "Generated human-readable description",
      value: description.substring(0, 50) + "..."
    });

    return {
      // Raw inputs
      inputs: {
        processingMethods
      },

      // Inferred analysis
      analysis: {
        identifiedMethods: identifiedMethods.map(m => ({
          id: m.id,
          displayName: m.displayName,
          category: m.category
        })),
        notFound,

        // Characteristics
        dominantCategories,
        thermalEffect,
        flavorImpacts,
        mouthfeel: mouthfeelCharacteristic,
        energeticTendency,
        compoundEffect,

        // Levels
        roastLevel,
        oxidationLevel,

        // Compound effects
        compoundModulation: {
          caffeineEffect: this._getCaffeineEffect(thermalEffect),
          theanineEffect: this._getTheanineEffect(energeticTendency),
          overallProfile: compoundEffect
        }
      },

      // Metadata
      trace,
      confidence: this._calculateConfidence(identifiedMethods.length, processingMethods.length),
      description,
      inferrerVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Get dominant processing categories
   */
  _getDominantCategories(methods) {
    const categories = new Set();

    methods.forEach(method => {
      const categoryName = method.category
        .replace(/^CATEGORY_/, '')
        .replace(/_/g, ' ')
        .toLowerCase();
      const friendlyName = this._getCategoryFriendlyName(method.category);
      categories.add(friendlyName);
    });

    return Array.from(categories);
  }

  /**
   * Convert category ID to friendly name
   */
  _getCategoryFriendlyName(categoryId) {
    const nameMap = {
      'CATEGORY_HEAT_OXIDATION_STOP': 'Heat & Oxidation Control',
      'CATEGORY_SHAPING_BRUISING': 'Shaping & Bruising',
      'CATEGORY_ROASTING': 'Roasting',
      'CATEGORY_OXIDATION': 'Oxidation',
      'CATEGORY_GROWING_SPECIAL': 'Growing & Special',
      'CATEGORY_AGING_FERMENTATION': 'Aging & Fermentation',
      'CATEGORY_SCENTING': 'Scenting'
    };
    return nameMap[categoryId] || categoryId.replace(/CATEGORY_/, '').replace(/_/g, ' ');
  }

  /**
   * Aggregate thermal effect from all methods
   */
  _aggregateThermalEffect(methods) {
    let warmingCount = 0;
    let coolingCount = 0;

    methods.forEach(method => {
      const tendency = (method.energeticTendency || '').toLowerCase();
      if (tendency.includes('warming') || tendency.includes('warm')) {
        warmingCount++;
      } else if (tendency.includes('cooling') || tendency.includes('cool')) {
        coolingCount++;
      }
    });

    if (warmingCount > coolingCount) {
      return warmingCount > 2 ? "Strongly Warming" : "Warming";
    } else if (coolingCount > warmingCount) {
      return coolingCount > 2 ? "Strongly Cooling" : "Cooling";
    } else {
      return "Neutral/Balanced";
    }
  }

  /**
   * Aggregate flavor impacts
   */
  _aggregateFlavorImpacts(methods) {
    const impacts = new Set();

    methods.forEach(method => {
      if (Array.isArray(method.flavorImpact)) {
        method.flavorImpact.forEach(impact => {
          impacts.add(impact);
        });
      }
    });

    return Array.from(impacts).slice(0, 5); // Top 5 impacts
  }

  /**
   * Determine overall mouthfeel
   */
  _determineMouthfeel(methods) {
    let hasBruising = false;
    let hasRoasting = false;
    let hasOxidation = false;
    let hasAging = false;

    methods.forEach(method => {
      const category = method.category;
      if (category.includes('BRUISING')) hasBruising = true;
      if (category.includes('ROASTING')) hasRoasting = true;
      if (category.includes('OXIDATION')) hasOxidation = true;
      if (category.includes('AGING')) hasAging = true;
    });

    if (hasRoasting) return "Thick & Warming";
    if (hasAging) return "Smooth & Complex";
    if (hasOxidation) return "Full-Bodied";
    if (hasBruising) return "Creamy & Rich";
    return "Light & Delicate";
  }

  /**
   * Determine energetic tendency
   */
  _determineEnergeticTendency(methods) {
    let stimulatingMethods = 0;
    let relaxingMethods = 0;

    methods.forEach(method => {
      const tendency = (method.energeticTendency || '').toLowerCase();
      if (tendency.includes('stimulating') || tendency.includes('energizing')) {
        stimulatingMethods++;
      } else if (tendency.includes('relaxing') || tendency.includes('calming')) {
        relaxingMethods++;
      }
    });

    if (stimulatingMethods > relaxingMethods) {
      return "Energizing";
    } else if (relaxingMethods > stimulatingMethods) {
      return "Calming";
    } else {
      return "Balanced";
    }
  }

  /**
   * Determine compound effect
   */
  _determineCompoundEffect(thermal, energetic) {
    if (energetic === "Energizing") return "Stimulating";
    if (energetic === "Calming") return "Relaxing";
    if (thermal.includes("Warming")) return "Warming & Comforting";
    if (thermal.includes("Cooling")) return "Cooling & Refreshing";
    return "Balanced";
  }

  /**
   * Determine roast level
   */
  _determineRoastLevel(methods) {
    let roastMethods = 0;
    let isHeavyRoast = false;

    methods.forEach(method => {
      if (method.category.includes('ROASTING')) {
        roastMethods++;
        const name = method.displayName.toLowerCase();
        if (name.includes('heavy') || name.includes('dark') || name.includes('charcoal')) {
          isHeavyRoast = true;
        }
      }
    });

    if (roastMethods === 0) return "No Roast";
    if (isHeavyRoast) return "Heavy Roast";
    if (roastMethods > 1) return "Medium Roast";
    return "Light Roast";
  }

  /**
   * Assess oxidation level
   */
  _assessOxidationLevel(methods) {
    let oxidationMethods = 0;
    let fermentationMethods = 0;

    methods.forEach(method => {
      if (method.category.includes('OXIDATION')) oxidationMethods++;
      if (method.category.includes('FERMENTATION')) fermentationMethods++;
    });

    if (fermentationMethods > 0) return "Highly Oxidized/Fermented";
    if (oxidationMethods > 1) return "Partially Oxidized";
    if (oxidationMethods === 1) return "Lightly Oxidized";
    return "Minimal Oxidation";
  }

  /**
   * Get caffeine effect
   */
  _getCaffeineEffect(thermalEffect) {
    if (thermalEffect.includes("Warming")) return "Moderately Enhanced";
    return "Standard";
  }

  /**
   * Get theanine effect
   */
  _getTheanineEffect(energetic) {
    if (energetic === "Calming") return "Enhanced";
    if (energetic === "Energizing") return "Reduced";
    return "Standard";
  }

  /**
   * Calculate confidence
   */
  _calculateConfidence(identified, total) {
    if (total === 0) return 0.0;
    const matchRatio = identified / total;

    if (matchRatio >= 0.8) return 0.95;
    if (matchRatio >= 0.6) return 0.85;
    if (matchRatio >= 0.4) return 0.70;
    return 0.50;
  }

  /**
   * Generate description
   */
  _generateDescription(methods, thermal, flavors, mouthfeel, energetic) {
    let desc = `This tea undergoes ${methods.length} processing step(s). `;

    if (thermal.includes("Warming")) {
      desc += "The processing creates a warming tea, ideal for cool weather. ";
    } else if (thermal.includes("Cooling")) {
      desc += "The processing creates a cooling tea, refreshing for warm seasons. ";
    }

    if (flavors.length > 0) {
      desc += `Processing enhances flavors including ${flavors.slice(0, 2).join(' and ')}. `;
    }

    desc += `The result is ${mouthfeel.toLowerCase()}.`;

    return desc;
  }

  /**
   * Return empty inference
   */
  _emptyInference(trace) {
    trace.push({
      step: "Input Validation",
      reason: "No processing methods provided",
      adjustment: "Returning empty inference",
      value: "No data"
    });

    return {
      inputs: {
        processingMethods: []
      },
      analysis: {
        identifiedMethods: [],
        notFound: [],
        dominantCategories: [],
        thermalEffect: "Unknown",
        flavorImpacts: [],
        mouthfeel: "Unknown",
        energeticTendency: "Unknown",
        compoundEffect: "Unknown",
        roastLevel: "None",
        oxidationLevel: "Unknown",
        compoundModulation: {
          caffeineEffect: "Unknown",
          theanineEffect: "Unknown",
          overallProfile: "Unknown"
        }
      },
      trace,
      confidence: 0.0,
      description: "No processing methods available.",
      inferrerVersion: '1.0'
    };
  }
}
