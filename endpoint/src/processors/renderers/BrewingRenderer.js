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
   * @param {string} preferredStyle - 'gongfu' or 'western' (now provides both)
   * @param {Object} processingAnalysis - Optional processing analysis data
   * @returns {Object} - Brewing recommendations with multiple styles and vessel options
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
    const adjustedGongfuParams = this._adjustParamsForProcessing(baseParams, normalizedMethods);
    const adjustedWesternParams = this._adjustParamsForProcessing(
      this.defaultBrewingParams[teaType]?.western || baseParams,
      normalizedMethods
    );

    trace.push({
      step: "Parameter Adjustment",
      reason: "Apply processing adjustments to both styles",
      adjustment: `Gongfu: ${adjustedGongfuParams.temperature}°C/${adjustedGongfuParams.steepTime}s | Western: ${adjustedWesternParams.temperature}°C/${adjustedWesternParams.steepTime}s`,
      value: "Both brewing styles calibrated"
    });

    // Get tea description from already-fetched tea type object
    const teaDescription = teaTypeObj?.description || `A tea from the ${teaType} family`;

    // Determine vessel recommendations
    const vesselRecommendations = this._getVesselRecommendations(teaType, brewingStyle, normalizedMethods);

    // Generate brewing guidance
    const gongfuGuidance = this._generateGuidance(teaType, 'gongfu', adjustedGongfuParams, normalizedMethods);
    const westernGuidance = this._generateGuidance(teaType, 'western', adjustedWesternParams, normalizedMethods);

    trace.push({
      step: "Vessel & Style Selection",
      reason: "Determine optimal brewing vessels and philosophy",
      adjustment: `${vesselRecommendations.recommended.name} recommended for ${brewingStyle} style`,
      value: `Available vessels: ${vesselRecommendations.allOptions.map(v => v.name).join(', ')}`
    });

    return {
      // Tea identification with description
      tea: {
        name: teaName,
        type: teaType,
        subType: teaData.subType || null,
        description: teaDescription,
        characteristics: {
          caffeine,
          theanine,
          processingMethods: Array.from(normalizedMethods)
        }
      },

      // Multiple brewing styles with full parameters
      brewingStyles: [
        {
          style: 'gongfu',
          philosophy: this._getStylePhilosophy('gongfu'),
          description: this._getStyleDescription('gongfu'),
          parameters: adjustedGongfuParams,
          guidance: gongfuGuidance,
          vessels: this._getStyleVessels('gongfu', vesselRecommendations)
        },
        {
          style: 'western',
          philosophy: this._getStylePhilosophy('western'),
          description: this._getStyleDescription('western'),
          parameters: adjustedWesternParams,
          guidance: westernGuidance,
          vessels: this._getStyleVessels('western', vesselRecommendations)
        }
      ],

      // Recommended style
      recommendedStyle: {
        name: brewingStyle,
        reason: this._getStyleRecommendationReason(teaType, brewingStyle, normalizedMethods)
      },

      // Vessel recommendations (detailed)
      vessels: vesselRecommendations,

      // Supporting data
      trace,
      confidence: 0.9,
      rendererVersion: '2.0'
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
   * Get brewing style philosophy (why this approach works)
   */
  _getStylePhilosophy(style) {
    const philosophies = {
      'gongfu': 'Meditation through Tea - Multiple short infusions reveal evolving flavor dimensions, creating a contemplative experience where each steep tells a new story of the leaf\'s character',
      'western': 'Simplicity & Accessibility - Single longer infusion captures the essential character of the tea in a straightforward, approachable manner suitable for everyday enjoyment'
    };
    return philosophies[style] || 'Traditional brewing approach';
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
   * Get vessel recommendations for tea type and style
   */
  _getVesselRecommendations(teaType, style, processingMethods) {
    const vesselDatabase = {
      'white': {
        gongfu: {
          recommended: { id: 'VESSEL_GAIWAN', name: 'Gaiwan', description: 'Porcelain covered cup reveals delicate white tea characteristics' },
          alternatives: [
            { id: 'VESSEL_GLASS_TEAPOT', name: 'Glass Teapot', description: 'Allows observation of fine white leaves unfurling' },
            { id: 'VESSEL_SMALL_CERAMIC_POT', name: 'Small Ceramic Pot', description: 'Gentle heat retention for delicate infusions' }
          ]
        },
        western: {
          recommended: { id: 'VESSEL_TEA_INFUSER', name: 'Tea Infuser/Strainer', description: 'Simple steeping in larger cup for white tea' },
          alternatives: [
            { id: 'VESSEL_GLASS_CUP', name: 'Glass Cup', description: 'Allows admiration of white tea\'s pale liquor and leaf movement' },
            { id: 'VESSEL_CERAMIC_TEAPOT', name: 'Ceramic Teapot', description: 'Distributes heat evenly for consistent steeping' }
          ]
        }
      },
      'green': {
        gongfu: {
          recommended: { id: 'VESSEL_GAIWAN', name: 'Gaiwan', description: 'Traditional vessel that preserves fresh, vibrant green tea characteristics' },
          alternatives: [
            { id: 'VESSEL_GLASS_TEAPOT', name: 'Glass Teapot', description: 'Showcases the jade-green color and leaf movement' },
            { id: 'VESSEL_SMALL_CERAMIC_POT', name: 'Small Ceramic Pot', description: 'Provides gentle, even heat distribution' }
          ]
        },
        western: {
          recommended: { id: 'VESSEL_TEA_INFUSER', name: 'Tea Infuser', description: 'Quick steeping captures fresh, vegetal character' },
          alternatives: [
            { id: 'VESSEL_GLASS_CUP', name: 'Glass Cup', description: 'Displays vibrant jade-green color beautifully' },
            { id: 'VESSEL_MESH_STRAINER', name: 'Mesh Strainer', description: 'Fine mesh captures even the smallest green tea leaves' }
          ]
        }
      },
      'oolong': {
        gongfu: {
          recommended: { id: 'VESSEL_GAIWAN', name: 'Gaiwan', description: 'Gold standard for oolong - perfectly suited for multiple infusions and leaf observation' },
          alternatives: [
            { id: 'VESSEL_CLAY_TEAPOT', name: 'Yixing Clay Teapot', description: 'Seasoned clay enhances oolong\'s complex flavors and retains heat beautifully' },
            { id: 'VESSEL_GLASS_TEAPOT', name: 'Glass Teapot', description: 'Elegant way to watch oolong leaves dance through infusions' }
          ]
        },
        western: {
          recommended: { id: 'VESSEL_CERAMIC_TEAPOT', name: 'Ceramic Teapot', description: 'Holds enough volume for longer steep while maintaining heat' },
          alternatives: [
            { id: 'VESSEL_TEA_INFUSER', name: 'Large Tea Infuser', description: 'Gives oolong leaves room to unfurl in larger cup' },
            { id: 'VESSEL_GLASS_CUP', name: 'Large Glass Cup', description: 'Displays oolong\'s rich colors and allows easy leaf observation' }
          ]
        }
      },
      'black': {
        gongfu: {
          recommended: { id: 'VESSEL_CLAY_TEAPOT', name: 'Yixing Clay Teapot', description: 'Retains heat well for robust black tea\'s full expression across infusions' },
          alternatives: [
            { id: 'VESSEL_CERAMIC_TEAPOT', name: 'Ceramic Teapot', description: 'Good heat retention for bold, complex flavors' },
            { id: 'VESSEL_GAIWAN', name: 'Gaiwan', description: 'Modern gongfu approach to black tea appreciation' }
          ]
        },
        western: {
          recommended: { id: 'VESSEL_CERAMIC_TEAPOT', name: 'Ceramic Teapot', description: 'Classic choice for full-bodied black tea brewing' },
          alternatives: [
            { id: 'VESSEL_TEA_INFUSER', name: 'Tea Infuser', description: 'Works well for simple, straightforward black tea' },
            { id: 'VESSEL_MESH_STRAINER', name: 'Mesh Strainer', description: 'Allows leaf expansion for full flavor extraction' }
          ]
        }
      },
      'puerh': {
        gongfu: {
          recommended: { id: 'VESSEL_CLAY_TEAPOT', name: 'Yixing Clay Teapot', description: 'Ideal for puerh - seasoned pots develop character that complements aged tea perfectly' },
          alternatives: [
            { id: 'VESSEL_GAIWAN', name: 'Gaiwan', description: 'Modern approach for observing puerh\'s deep colors and transformations' },
            { id: 'VESSEL_GLASS_TEAPOT', name: 'Glass Teapot', description: 'Showcases puerh\'s rich, dark liquor through infusions' }
          ]
        },
        western: {
          recommended: { id: 'VESSEL_CERAMIC_TEAPOT', name: 'Ceramic Teapot', description: 'Heavy-walled pot maintains heat for puerh\'s extractive steeping' },
          alternatives: [
            { id: 'VESSEL_MESH_STRAINER', name: 'Mesh Strainer', description: 'Generous opening accommodates puerh leaf pieces' },
            { id: 'VESSEL_INFUSER_BASKET', name: 'Infuser Basket', description: 'Allows puerh to fully expand in larger cup' }
          ]
        }
      },
      'yellow': {
        gongfu: {
          recommended: { id: 'VESSEL_GAIWAN', name: 'Gaiwan', description: 'Perfect for rare yellow tea - allows gentle brewing of delicate leaves' },
          alternatives: [
            { id: 'VESSEL_GLASS_TEAPOT', name: 'Glass Teapot', description: 'Showcases yellow tea\'s unique golden hue' },
            { id: 'VESSEL_SMALL_CERAMIC_POT', name: 'Small Ceramic Pot', description: 'Gentle heat retention preserves subtle flavors' }
          ]
        },
        western: {
          recommended: { id: 'VESSEL_TEA_INFUSER', name: 'Tea Infuser', description: 'Simple approach for this rare tea variety' },
          alternatives: [
            { id: 'VESSEL_GLASS_CUP', name: 'Glass Cup', description: 'Displays yellow tea\'s signature golden color' },
            { id: 'VESSEL_CERAMIC_TEAPOT', name: 'Ceramic Teapot', description: 'Gentle brewing for delicate characteristics' }
          ]
        }
      }
    };

    const teaVessels = vesselDatabase[teaType] || vesselDatabase['oolong'];
    const styleVessels = teaVessels[style] || teaVessels['gongfu'];

    return {
      recommended: styleVessels.recommended,
      alternatives: styleVessels.alternatives,
      allOptions: [styleVessels.recommended, ...styleVessels.alternatives]
    };
  }

  /**
   * Get vessels suited for specific brewing style
   */
  _getStyleVessels(style, vesselRecommendations) {
    return {
      recommended: vesselRecommendations.recommended,
      alternatives: vesselRecommendations.alternatives
    };
  }

  /**
   * Get reason for recommending specific brewing style
   */
  _getStyleRecommendationReason(teaType, style, processingMethods) {
    const reasons = {
      'gongfu': 'This style is ideal for appreciating the full complexity and evolution of this tea across multiple infusions. Each steep reveals new flavor dimensions and allows observation of leaf unfurling.',
      'western': 'This straightforward approach captures the essential character of this tea in a single steeping, perfect for everyday enjoyment and accessibility.'
    };

    // Add processing-specific recommendations
    if (processingMethods.has('PROCESSING_ROASTED')) {
      if (style === 'gongfu') {
        return 'Gongfu brewing extracts the nuanced roasted character beautifully through multiple short infusions, allowing the roasting notes to evolve across steeps.';
      }
    }

    if (processingMethods.has('PROCESSING_FERMENTED')) {
      if (style === 'gongfu') {
        return 'Gongfu style works particularly well with fermented teas, as each infusion reveals the complex fermentation notes through progressive extraction.';
      }
    }

    return reasons[style] || reasons['gongfu'];
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
