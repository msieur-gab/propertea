/**
 * BrewingRenderer.js
 *
 * Purpose: Render brewing recommendations based on tea type and all relevant factors
 * Input:
 *   - formData: Tea information { name, type, subType }
 *   - processingInference: Output from ProcessingInferrer
 *   - geographyInference: Output from GeographyInferrer
 *   - compoundInference: Output from CompoundInferrer
 * Output: Data-driven brewing parameters with transparent reasoning and confidence scoring
 *
 * Architecture:
 * Collects adjustment rules from multiple inferences and applies them cumulatively
 * to base parameters from BrewingTaxonomy. Generates narrative explanations for all adjustments.
 */

import { BrewingTaxonomy, TeaTypeTaxonomy } from '../../taxonomies/index.js';

export class BrewingRenderer {
  constructor(config = {}) {
    this.config = config;
    this.brewingTaxonomy = BrewingTaxonomy;
    this.teaTypeTaxonomy = TeaTypeTaxonomy;
  }

  /**
   * Render brewing recommendations from tea data and inference results
   * @param {Object} formData - Tea data { name, type, subType }
   * @param {Object} processingInference - Output from ProcessingInferrer
   * @param {Object} geographyInference - Output from GeographyInferrer
   * @param {Object} compoundInference - Output from CompoundInferrer
   * @param {string} brewingStyle - Preferred style (gongfu or western, default: gongfu)
   * @returns {Object} - Brewing recommendations with parameters and reasoning
   */
  render(formData = {}, processingInference = {}, geographyInference = {}, compoundInference = {}, brewingStyle = 'gongfu') {
    const trace = [];

    // ========== VALIDATION ==========
    if (!formData || !formData.type) {
      return this._failedRender("Tea type is required", trace);
    }

    const style = String(brewingStyle).toLowerCase();
    const teaTypeId = this._normalizeTeaTypeToId(formData.type, formData.subType);
    const teaName = formData.name || `${formData.type}${formData.subType ? ` (${formData.subType})` : ''}`;

    trace.push({
      step: "Input Validation",
      reason: "Validate tea type and inferences",
      adjustment: `Tea: ${teaName}, Type: ${teaTypeId}, Style: ${style}`,
      value: "Inputs validated"
    });

    // ========== BASE PARAMETERS ==========
    const baseParams = this.brewingTaxonomy.getBaseParameters(teaTypeId, style);
    if (!baseParams) {
      return this._failedRender(`Unsupported tea type: ${teaTypeId}`, trace);
    }

    trace.push({
      step: "Base Parameters",
      reason: `Tea type: ${teaTypeId}`,
      adjustment: `${baseParams.temperature}°C, ${baseParams.steepTime}s`,
      value: baseParams.reasoning
    });

    // ========== COLLECT ADJUSTMENTS ==========
    const adjustments = [];
    const adjustmentSources = [];

    // Processing adjustments
    if (processingInference?.analysis?.identifiedMethods) {
      processingInference.analysis.identifiedMethods.forEach(method => {
        // Check for leaf style
        const leafAdj = this.brewingTaxonomy.getLeafStyleAdjustment(method.id);
        if (leafAdj.tempDelta !== 0 || leafAdj.steepDelta !== 0) {
          adjustments.push(leafAdj);
          adjustmentSources.push({ source: `Leaf style (${method.displayName})`, description: leafAdj.description });
        }

        // Check for roast level
        const roastAdj = this.brewingTaxonomy.getRoastAdjustment(method.id);
        if (roastAdj.tempDelta !== 0 || roastAdj.steepDelta !== 0) {
          adjustments.push(roastAdj);
          adjustmentSources.push({ source: `Roast (${method.displayName})`, description: roastAdj.description });
        }

        // Check for oxidation
        const oxidAdj = this.brewingTaxonomy.getOxidationAdjustment(method.id);
        if (oxidAdj.tempDelta !== 0 || oxidAdj.steepDelta !== 0) {
          adjustments.push(oxidAdj);
          adjustmentSources.push({ source: `Oxidation (${method.displayName})`, description: oxidAdj.description });
        }
      });
    }

    trace.push({
      step: "Processing Analysis",
      reason: "Extract brewing adjustments from processing inference",
      adjustment: `Found ${adjustmentSources.length} processing adjustments`,
      value: adjustmentSources.map(s => s.source).join(', ') || 'None'
    });

    // Geography adjustments
    if (geographyInference?.inputs?.altitude) {
      const altAdj = this.brewingTaxonomy.getAltitudeAdjustment(geographyInference.inputs.altitude);
      adjustments.push(altAdj);
      adjustmentSources.push({ source: `Altitude (${altAdj.key})`, description: altAdj.description });

      trace.push({
        step: "Geography Analysis",
        reason: "Altitude affects brewing temperature",
        adjustment: `${geographyInference.inputs.altitude}m → ${altAdj.key}`,
        value: altAdj.description
      });
    }

    // Compound adjustments (astringency)
    if (compoundInference?.analysis?.caffeine !== undefined && compoundInference?.analysis?.theanine !== undefined) {
      const caffeine = compoundInference.analysis.caffeine;
      const theanine = compoundInference.analysis.theanine;
      const catechins = compoundInference.analysis?.catechins || 0;

      const astringency = this.brewingTaxonomy.calculateAstringencyFromCompounds(caffeine, theanine, catechins);
      const astringencyAdj = this.brewingTaxonomy.getAstringencyAdjustment(astringency);

      if (astringencyAdj.tempDelta !== 0 || astringencyAdj.steepDelta !== 0) {
        adjustments.push(astringencyAdj);
        adjustmentSources.push({ source: `Astringency (${astringency})`, description: astringencyAdj.description });
      }

      trace.push({
        step: "Compound Analysis",
        reason: "Astringency from caffeine/theanine ratio",
        adjustment: `Caffeine: ${caffeine}, Theanine: ${theanine} → ${astringency}`,
        value: astringencyAdj.description
      });
    }

    // ========== CALCULATE FINAL PARAMETERS FOR BOTH STYLES ==========
    // Each style needs its own base parameters and calculated result
    const gongfuBase = this.brewingTaxonomy.getBaseParameters(teaTypeId, 'gongfu');
    const westernBase = this.brewingTaxonomy.getBaseParameters(teaTypeId, 'western');

    const gongfuParams = this.brewingTaxonomy.calculateAdjustedParameters(gongfuBase, adjustments);
    const westernParams = this.brewingTaxonomy.calculateAdjustedParameters(westernBase, adjustments);

    trace.push({
      step: "Parameter Calculation",
      reason: "Apply all adjustments to base parameters for each style",
      adjustment: `Gongfu: ${gongfuBase.temperature}°C/${gongfuBase.steepTime}s → ${gongfuParams.temperature}°C/${gongfuParams.steepTime}s | Western: ${westernBase.temperature}°C/${westernBase.steepTime}s → ${westernParams.temperature}°C/${westernParams.steepTime}s`,
      value: `Total adjustments applied: ${adjustments.length}`
    });

    // ========== CONFIDENCE SCORING ==========
    const confidence = this.brewingTaxonomy.calculateAdvancedConfidence({
      hasProcessing: !!processingInference?.analysis,
      hasRoastLevel: adjustmentSources.some(s => s.source.includes('Roast')),
      hasLeafStyle: adjustmentSources.some(s => s.source.includes('Leaf style')),
      hasGeography: !!geographyInference?.inputs?.altitude,
      hasAltitude: !!geographyInference?.inputs?.altitude,
      hasCompound: !!compoundInference?.analysis?.caffeine,
      hasAstringency: adjustmentSources.some(s => s.source.includes('Astringency'))
    });

    // ========== BUILD STYLE NARRATIVES ==========
    const narrativeGongfu = this._buildStyleNarrative('gongfu', gongfuParams, adjustmentSources);
    const narrativeWestern = this._buildStyleNarrative('western', westernParams, adjustmentSources);

    trace.push({
      step: "Style Narratives",
      reason: "Generate brewing philosophy and guidance",
      adjustment: "Created narratives for both gongfu and western styles",
      value: "Narratives include adjustment reasoning and technique"
    });

    // ========== RETURN RESULT ==========
    return {
      // Tea identification
      tea: {
        name: teaName,
        type: formData.type,
        subType: formData.subType || null,
        typeId: teaTypeId
      },

      // Brewing recommendations for both styles
      brewingStyles: [
        {
          style: 'gongfu',
          philosophy: this.brewingTaxonomy.getStyleNarrative('gongfu').philosophy,
          parameters: gongfuParams,
          narrative: narrativeGongfu,
          adjustmentsApplied: adjustmentSources,
          confidence
        },
        {
          style: 'western',
          philosophy: this.brewingTaxonomy.getStyleNarrative('western').philosophy,
          parameters: westernParams,
          narrative: narrativeWestern,
          adjustmentsApplied: adjustmentSources,
          confidence
        }
      ],

      // Standardized recommendations array (for API compatibility)
      recommendations: [
        {
          style: 'gongfu',
          parameters: gongfuParams,
          narrative: narrativeGongfu,
          score: Math.round(confidence * 100)
        },
        {
          style: 'western',
          parameters: westernParams,
          narrative: narrativeWestern,
          score: Math.round(confidence * 95)
        }
      ],

      // Analysis and metadata
      analysis: {
        baseParameters: {
          gongfu: gongfuBase,
          western: westernBase
        },
        adjustmentsApplied: adjustmentSources,
        teaType: teaTypeId
      },

      trace,
      confidence,
      rendererVersion: '3.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Normalize tea type to BrewingTaxonomy ID format
   * Converts user input to TEA_TYPE_* format
   */
  _normalizeTeaTypeToId(type, subType) {
    const typeStr = String(type).toLowerCase().trim();

    // Map common names to BrewingTaxonomy IDs
    const typeMap = {
      'white': 'TEA_TYPE_WHITE',
      'green': 'TEA_TYPE_GREEN',
      'yellow': 'TEA_TYPE_YELLOW',
      'oolong': 'TEA_TYPE_OOLONG',
      'black': 'TEA_TYPE_BLACK',
      'puerh': 'TEA_TYPE_PUERH',
      'pu-er': 'TEA_TYPE_PUERH',
      'pu erh': 'TEA_TYPE_PUERH',
      'puer': 'TEA_TYPE_PUERH'
    };

    return typeMap[typeStr] || `TEA_TYPE_${typeStr.toUpperCase()}`;
  }

  /**
   * Build narrative for brewing style
   * Combines style philosophy with parameters and adjustments
   */
  _buildStyleNarrative(style, parameters, adjustmentSources) {
    const styleInfo = this.brewingTaxonomy.getStyleNarrative(style);

    let narrative = `${styleInfo.philosophy}\n\n`;
    narrative += `**Approach:** ${styleInfo.approach}\n\n`;
    narrative += `**Technique:** ${styleInfo.technique}\n\n`;
    narrative += `**Parameters:**\n`;
    narrative += `- Water Temperature: ${parameters.temperature}°C (${Math.round(parameters.temperature * 9/5 + 32)}°F)\n`;
    narrative += `- Steep Time: ${parameters.steepTime} seconds\n`;
    narrative += `- Leaf Amount: ${parameters.gramsPer100ml}g per 100ml of water\n`;
    narrative += `- Infusions: ${parameters.infusions}\n`;

    if (adjustmentSources && adjustmentSources.length > 0) {
      narrative += `\n**Brewing Adjustments Applied:**\n`;
      adjustmentSources.forEach(adj => {
        narrative += `- ${adj.source}: ${adj.description}\n`;
      });
    }

    return narrative;
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
      recommendations: [],
      trace: [...trace, {
        step: "Error",
        reason,
        adjustment: "Unable to generate brewing recommendations",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '3.0'
    };
  }
}
