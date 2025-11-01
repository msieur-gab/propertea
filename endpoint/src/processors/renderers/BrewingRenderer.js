/**
 * BrewingRenderer.js
 *
 * Purpose: Render brewing recommendations based on tea type and processing
 * Input: Tea data { type, subType, processingMethods }, brewing style preference
 * Output: Brewing parameters and method guidance
 *
 * This Renderer adapts logic from brewingMatcher using ProcessingTaxonomy and TeaTypeTaxonomy
 */

import { ProcessingTaxonomy, TeaTypeTaxonomy } from '../../taxonomies/index.js';

export class BrewingRenderer {
  constructor(config = {}) {
    this.config = {
      defaultBrewingStyle: config.defaultBrewingStyle || 'gongfu',
      ...config
    };

    this.processingTaxonomy = ProcessingTaxonomy;
    this.teaTypeTaxonomy = TeaTypeTaxonomy;

    // Brewing style recommendations
    this.brewingStyles = ['gongfu', 'western'];

    // Default brewing parameters by tea type
    this.defaultBrewingParams = {
      white: {
        gongfu: { temperature: 70, steepTime: 3, amountPerGram: 0.05, infusions: 4 },
        western: { temperature: 75, steepTime: 4, amountPerGram: 0.03, infusions: 1 }
      },
      green: {
        gongfu: { temperature: 75, steepTime: 2, amountPerGram: 0.06, infusions: 5 },
        western: { temperature: 80, steepTime: 3, amountPerGram: 0.04, infusions: 1 }
      },
      yellow: {
        gongfu: { temperature: 75, steepTime: 3, amountPerGram: 0.05, infusions: 4 },
        western: { temperature: 80, steepTime: 4, amountPerGram: 0.03, infusions: 1 }
      },
      oolong: {
        gongfu: { temperature: 95, steepTime: 3, amountPerGram: 0.08, infusions: 7 },
        western: { temperature: 90, steepTime: 5, amountPerGram: 0.05, infusions: 2 }
      },
      black: {
        gongfu: { temperature: 95, steepTime: 3, amountPerGram: 0.06, infusions: 4 },
        western: { temperature: 95, steepTime: 4, amountPerGram: 0.04, infusions: 1 }
      },
      puerh: {
        gongfu: { temperature: 95, steepTime: 3, amountPerGram: 0.10, infusions: 10 },
        western: { temperature: 95, steepTime: 4, amountPerGram: 0.06, infusions: 2 }
      }
    };
  }

  /**
   * Render brewing recommendations from tea data
   * @param {Object} teaData - Tea object { type, subType, processingMethods, name, ... }
   * @param {string} preferredStyle - 'gongfu' or 'western'
   * @param {Object} processingAnalysis - Optional processing analysis data
   * @returns {Object} - Brewing recommendations
   */
  render(teaData = {}, preferredStyle = 'gongfu', processingAnalysis = {}) {
    const trace = [];

    // Validate inputs
    if (!teaData || !teaData.type) {
      return this._failedRender("Tea data and tea type are required", trace);
    }

    const teaName = teaData.name || `${teaData.type}${teaData.subType ? ` (${teaData.subType})` : ''}`;
    const teaType = this._normalizeTeaType(teaData.type, teaData.subType);
    const brewingStyle = (preferredStyle || 'gongfu').toLowerCase();

    trace.push({
      step: "Input Reception",
      reason: "Received tea and brewing preference",
      adjustment: `Tea: ${teaName}, Type: ${teaType}, Style: ${brewingStyle}`,
      value: "Data validated"
    });

    // Get base parameters for tea type
    const baseParams = this._getBaseBrewingParams(teaType, brewingStyle);
    if (!baseParams) {
      return this._failedRender(
        `No default brewing parameters for tea type '${teaType}' in '${brewingStyle}' style`,
        trace
      );
    }

    trace.push({
      step: "Base Parameters Loaded",
      reason: `Tea type: ${teaType}`,
      adjustment: `Temperature: ${baseParams.temperature}°C, Steep: ${baseParams.steepTime}s`,
      value: `Amount: ${baseParams.amountPerGram}g/ml, Infusions: ${baseParams.infusions}`
    });

    // Get tea type info from taxonomy
    const teaTypeObj = this.teaTypeTaxonomy.getType(teaType);
    const caffeine = teaTypeObj?.caffeineRange?.[1] || 'N/A';
    const theanine = teaTypeObj?.theanineRange?.[1] || 'N/A';

    // Normalize processing methods
    const normalizedMethods = this._normalizeProcessingMethods(
      teaData.processingMethods || [],
      processingAnalysis
    );

    trace.push({
      step: "Processing Analysis",
      reason: "Normalize processing methods",
      adjustment: `Found ${normalizedMethods.size} processing methods`,
      value: Array.from(normalizedMethods).join(', ')
    });

    // Adjust brewing parameters based on processing
    const adjustedParams = this._adjustParamsForProcessing(baseParams, normalizedMethods);

    trace.push({
      step: "Parameter Adjustment",
      reason: "Apply processing adjustments",
      adjustment: `Adjusted temperature and steep time`,
      value: `Temperature: ${adjustedParams.temperature}°C, Steep: ${adjustedParams.steepTime}s`
    });

    // Generate brewing guidance
    const guidance = this._generateGuidance(teaType, brewingStyle, adjustedParams, normalizedMethods);

    return {
      // Tea identification
      tea: {
        name: teaName,
        type: teaType,
        subType: teaData.subType || null
      },

      // Brewing parameters
      brewingParameters: adjustedParams,

      // Brewing style info
      style: {
        name: brewingStyle,
        description: this._getStyleDescription(brewingStyle)
      },

      // Tea characteristics
      characteristics: {
        caffeine,
        theanine,
        processingMethods: Array.from(normalizedMethods)
      },

      // Brewing guidance
      guidance,

      // Supporting data
      trace,
      confidence: 0.9,
      rendererVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Normalize tea type to standard taxonomy ID
   */
  _normalizeTeaType(type, subType) {
    const typeStr = String(type).toLowerCase().trim();

    // Map common names
    const typeMap = {
      'white': 'white',
      'green': 'green',
      'yellow': 'yellow',
      'oolong': 'oolong',
      'black': 'black',
      'puerh': 'puerh',
      'pu-er': 'puerh',
      'pu erh': 'puerh',
      'puer': 'puerh'
    };

    const normalized = typeMap[typeStr] || typeStr;

    // Try direct lookup with taxonomy
    try {
      const teaType = this.teaTypeTaxonomy.getType(normalized);
      if (teaType) {
        return normalized.toLowerCase();
      }
    } catch (e) {
      // Not found, continue with normalized name
    }

    return normalized.toLowerCase();
  }

  /**
   * Get base brewing parameters for tea type and style
   */
  _getBaseBrewingParams(teaType, brewingStyle) {
    const params = this.defaultBrewingParams[teaType]?.[brewingStyle];
    return params ? { ...params } : null;
  }

  /**
   * Normalize processing methods
   */
  _normalizeProcessingMethods(methods = [], processingAnalysis = {}) {
    const normalized = new Set();

    // Process array of methods
    if (Array.isArray(methods)) {
      methods.forEach(method => {
        const normalized_method = this._normalizeMethod(method);
        if (normalized_method) {
          normalized.add(normalized_method);
        }
      });
    }

    // Add roast level if from analysis
    if (processingAnalysis.roastLevel) {
      const roastMap = {
        'none': null,
        'light': 'light-roast',
        'medium': 'medium-roast',
        'heavy': 'heavy-roast',
        'very heavy': 'heavy-roast'
      };
      const roastMethod = roastMap[processingAnalysis.roastLevel.toLowerCase()];
      if (roastMethod) {
        normalized.add(roastMethod);
      }
    }

    return normalized;
  }

  /**
   * Normalize a single processing method
   */
  _normalizeMethod(method) {
    if (!method) return null;

    const str = String(method).toLowerCase().trim();

    // Direct taxonomy lookup
    try {
      const processingObj = this.processingTaxonomy.getMethod(str);
      if (processingObj) {
        return processingObj.id;
      }
    } catch (e) {
      // Not found in taxonomy
    }

    // Common mappings
    const methodMap = {
      'steamed': 'PROCESSING_STEAMED',
      'pan-fired': 'PROCESSING_PAN_FIRED',
      'roasted': 'PROCESSING_ROASTED',
      'oxidized': 'PROCESSING_OXIDIZED',
      'partially-oxidized': 'PROCESSING_OXIDIZED',
      'withered': 'PROCESSING_WITHERED',
      'rolled': 'PROCESSING_ROLLED',
      'fermented': 'PROCESSING_FERMENTED',
      'aged': 'PROCESSING_AGED'
    };

    return methodMap[str] || null;
  }

  /**
   * Adjust parameters based on processing methods
   */
  _adjustParamsForProcessing(baseParams, methods) {
    const params = { ...baseParams };

    if (methods.has('PROCESSING_ROASTED') || methods.has('PROCESSING_CHARCOAL_ROAST')) {
      params.temperature = Math.min(100, params.temperature + 5);
      params.steepTime = Math.max(params.steepTime - 0.5, 2);
    }

    if (methods.has('PROCESSING_FERMENTED') || methods.has('PROCESSING_AGED')) {
      params.temperature = Math.max(95, params.temperature);
      params.steepTime = Math.min(params.steepTime + 1, 5);
    }

    if (methods.has('PROCESSING_WITHERED')) {
      params.temperature = Math.max(params.temperature - 5, 70);
      params.steepTime = Math.max(params.steepTime + 0.5, 3);
    }

    return params;
  }

  /**
   * Generate brewing guidance text
   */
  _generateGuidance(teaType, brewingStyle, params, methods) {
    const guidance = [];

    // Temperature guidance
    guidance.push(`Water Temperature: ${params.temperature}°C (${Math.round(params.temperature * 9/5 + 32)}°F)`);

    // Steep time guidance
    guidance.push(`Initial Steep Time: ${params.steepTime} seconds`);

    // Amount guidance
    guidance.push(`Tea Amount: ${params.amountPerGram} grams per ml of water`);

    // Infusion guidance
    if (brewingStyle === 'gongfu') {
      guidance.push(`Multiple Infusions: ${params.infusions} infusions recommended`);
      guidance.push(`Infusion Method: Short steeps with full leaf rehydration between infusions`);
    } else {
      guidance.push(`Single Infusion: ${params.infusions} typical for western style`);
      guidance.push(`Infusion Method: Longer steep time with strainer or infuser`);
    }

    // Processing-specific notes
    if (methods.has('PROCESSING_ROASTED')) {
      guidance.push(`Note: Roasted tea - use hotter water for fuller extraction`);
    }

    if (methods.has('PROCESSING_FERMENTED')) {
      guidance.push(`Note: Aged or fermented tea - rinse leaves briefly before brewing`);
    }

    return guidance;
  }

  /**
   * Get brewing style description
   */
  _getStyleDescription(style) {
    const descriptions = {
      'gongfu': 'Traditional Chinese brewing with small vessel and multiple short infusions',
      'western': 'European/American style with larger amount of water and longer steep time'
    };
    return descriptions[style] || 'Unknown brewing style';
  }

  /**
   * Return error render when inference fails
   */
  _failedRender(reason, trace) {
    return {
      tea: {
        name: "Unknown",
        type: "Unknown",
        subType: null
      },
      brewingParameters: null,
      style: null,
      characteristics: null,
      guidance: [],
      trace: [{
        step: "Error",
        reason,
        adjustment: "Unable to generate brewing recommendations",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }
}
