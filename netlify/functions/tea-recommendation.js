/**
 * Netlify Function: Tea Recommendation API v2
 *
 * Purpose: HTTP transport layer for the tea recommendation engine
 * Accepts: Tea data + optional parameters
 * Returns: Recommendations via Inferrer/Renderer pipeline
 *
 * Architecture:
 * Form Data → Inferrers (analysis) → Renderers (recommendations) → JSON Response
 *
 * Parameters:
 * - renderers: array of renderer names to execute (default: all)
 *   values: "activity", "food", "time", "season", "brewing"
 * - format: output format (default: "production")
 *   "production": lean response with recommendations only
 *   "trace": includes analysis traces and reasoning for debugging
 */

import { FlavorInferrer } from '../../endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from '../../endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from '../../endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from '../../endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from '../../endpoint/src/processors/inferrers/ProcessingInferrer.js';

import { ActivityRenderer } from '../../endpoint/src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from '../../endpoint/src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from '../../endpoint/src/processors/renderers/TimeRenderer.js';
import { SeasonRenderer } from '../../endpoint/src/processors/renderers/SeasonRenderer.js';
import { BrewingRenderer } from '../../endpoint/src/processors/renderers/BrewingRenderer.js';
import { TerroirRenderer } from '../../endpoint/src/processors/renderers/TerroirRenderer.js';

import { rendererRegistry, getRequiredInferrers, getTraceInferrerNames, validateRenderers } from '../../endpoint/src/rendererRegistry.js';

/**
 * Shared CORS headers for all responses (success and error)
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/**
 * Main handler function (Netlify v2 runtime - receives Request object)
 */
export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed. Use POST or OPTIONS.' }), {
      status: 405,
      headers: corsHeaders
    });
  }

  // Parse request body with proper error handling
  let requestBody;
  try {
    const bodyText = await request.text();
    requestBody = JSON.parse(bodyText);
  } catch (parseError) {
    return new Response(JSON.stringify({
      error: 'Invalid JSON in request body',
      hint: 'Ensure payload is valid JSON and contains required fields: name, type'
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  const formData = requestBody;

  // Validate required fields
  if (!formData.name || !formData.type) {
    return new Response(JSON.stringify({
      error: 'Missing required fields',
      required: ['name', 'type']
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Extract optional parameters
  let renderers = formData.renderers || ['activity', 'food', 'time', 'season', 'brewing'];
  const format = formData.format || 'production';

  // Normalize renderers to array: handle string input, deduplicate, lowercase
  if (typeof renderers === 'string') {
    renderers = [renderers];
  }
  if (!Array.isArray(renderers)) {
    return new Response(JSON.stringify({
      error: 'renderers must be a string or array of strings',
      example: 'renderers: "activity" or renderers: ["activity", "food", "time"]',
      available: ['activity', 'food', 'time', 'season', 'brewing']
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Deduplicate and normalize to lowercase
  renderers = [...new Set(renderers.map(r => String(r).toLowerCase()))];

  // Validate format parameter
  if (!['production', 'trace'].includes(format)) {
    return new Response(JSON.stringify({
      error: 'Invalid format parameter',
      validValues: ['production', 'trace']
    }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Validate requested renderers
  try {
    validateRenderers(renderers);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: corsHeaders
    });
  }

  // Run pipeline
  try {
    const result = await runRecommendationPipeline(formData, renderers, format);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error in tea-recommendation:', error);

    return new Response(JSON.stringify({
      error: 'Failed to generate recommendations',
      details: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

/**
 * Run the complete Inferrer/Renderer pipeline
 * @param {Object} formData - Form data from admin interface
 * @param {Array} renderers - Which renderers to execute
 * @param {string} format - Output format: "production" or "trace"
 * @returns {Object} - Recommendations in requested format
 */
async function runRecommendationPipeline(formData, renderers, format) {
  const startTime = Date.now();

  // ========== PHASE 1: INFERRERS ==========
  // Run only inferrers needed by requested renderers
  // Uses rendererRegistry to determine dependencies

  const requiredInferrers = getRequiredInferrers(renderers);
  const allInferences = {};

  // Build array of inference tasks based on what's actually needed
  const inferenceTasks = [];
  const inferenceNames = [];

  if (requiredInferrers.has('flavor')) {
    inferenceTasks.push(new FlavorInferrer().infer({ flavorProfiles: formData.flavorProfile || [] }));
    inferenceNames.push('flavor');
  }
  if (requiredInferrers.has('compound')) {
    inferenceTasks.push(new CompoundInferrer().infer({
      caffeineLevel: formData.caffeineLevel,
      lTheanineLevel: formData.lTheanineLevel
    }));
    inferenceNames.push('compound');
  }
  if (requiredInferrers.has('teaType')) {
    inferenceTasks.push(new TeaTypeInferrer().infer({
      type: formData.type,
      subType: formData.subType
    }));
    inferenceNames.push('teaType');
  }
  if (requiredInferrers.has('geography')) {
    inferenceTasks.push(new GeographyInferrer().infer({ geography: formData.geography || {} }));
    inferenceNames.push('geography');
  }
  if (requiredInferrers.has('processing')) {
    inferenceTasks.push(new ProcessingInferrer().infer({
      processingMethods: formData.processingMethods || []
    }));
    inferenceNames.push('processing');
  }

  // Run only needed inferrers in parallel
  const inferenceResults = await Promise.all(inferenceTasks);
  inferenceResults.forEach((result, index) => {
    allInferences[inferenceNames[index]] = result;
  });

  // ========== PHASE 2: RENDERERS ==========
  // Only run requested renderers (note: renderers are synchronous)
  // Each renderer uses only the analyses it needs (from allInferences)

  const recommendations = {};

  if (renderers.includes('activity')) {
    const result = new ActivityRenderer().render(allInferences.compound);
    recommendations.activity = result.recommendations || [];
  }
  if (renderers.includes('food')) {
    const result = new FoodRenderer().render(allInferences.flavor);
    recommendations.food = result.recommendations || [];
  }
  if (renderers.includes('time')) {
    // Time recommendations: 85% compound profile + 15% tea type tradition
    const result = new TimeRenderer().render(
      allInferences.compound,
      allInferences.teaType
    );
    // Return full result with analysis and weighting information
    recommendations.time = {
      recommendations: result.recommendations || [],
      circadianCurve: result.circadianCurve || [],  // 24-hour array for chart plotting
      hourlyScores: result.hourlyScores || {},
      periodGrouping: result.periodGrouping || {},
      analysis: result.analysis || {},
      trace: result.trace || [],
      confidence: result.confidence || 0,
      rendererVersion: result.rendererVersion || '1.0'
    };
  }
  if (renderers.includes('season')) {
    // Simplified seasonal rendering: uses only tea type and processing method
    // Seasonal affinity comes from the tea's intrinsic nature, not geography or flavor
    const result = new SeasonRenderer().render(
      allInferences.teaType,
      allInferences.processing
    );
    // Preserve full SeasonRenderer result including circularYear and monthlyScores for 12-month visualization
    recommendations.season = {
      recommendations: result.recommendations || [],
      circularYear: result.circularYear || [],
      monthlyScores: result.monthlyScores || {},
      seasonalScores: result.seasonalScores || {},
      seasonalRange: result.seasonalRange || null,
      analysis: result.analysis || {},
      confidence: result.confidence || 0,
      rendererVersion: result.rendererVersion || '1.0'
    };
  }
  if (renderers.includes('brewing')) {
    // Brewing recommendations: Tea Type + Processing + Geography + Compound
    const result = new BrewingRenderer().render(
      formData,
      allInferences.processing,
      allInferences.geography,
      allInferences.compound
    );
    // Preserve full BrewingRenderer result with brewing styles, parameters, and reasoning
    recommendations.brewing = {
      brewingStyles: result.brewingStyles || [],
      recommendations: result.recommendations || [],
      analysis: result.analysis || {},
      trace: result.trace || [],
      confidence: result.confidence || 0,
      rendererVersion: result.rendererVersion || '3.0'
    };
  }
  if (renderers.includes('terroir')) {
    // Terroir narrative: Geography + Tea Type + FormData (location) + optional Compound and Flavor context
    const result = new TerroirRenderer().render(
      allInferences.geography,
      allInferences.teaType,
      formData,
      allInferences.compound,
      allInferences.flavor
    );
    // Preserve full TerroirRenderer result with narrative sections and influences
    recommendations.terroir = {
      narrative: result.narrative || '',
      sections: result.sections || [],
      geographicInfluences: result.geographicInfluences || [],
      teaType: result.teaType || '',
      teaTypeId: result.teaTypeId || null,
      location: result.location || '',
      qualityIndicator: result.qualityIndicator || 'Unknown',
      characteristics: result.characteristics || [],
      harvestSeason: result.harvestSeason || '',
      analysis: result.analysis || {},
      confidence: result.confidence || 0,
      rendererVersion: result.rendererVersion || '1.0'
    };
  }

  // ========== FORMAT RESPONSE ==========

  const elapsedTime = Date.now() - startTime;

  // Base response (always included)
  const baseResponse = {
    tea: {
      name: formData.name,
      originalName: formData.originalName || '',
      type: formData.type,
      subType: formData.subType || ''
    },
    recommendations,
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs: elapsedTime,
      version: '2.0',
      pipeline: 'inferrer-renderer',
      format,
      renderersRequested: renderers
    }
  };

  // Return production or trace format
  if (format === 'trace') {
    // Build analysis object with only the inferrers that were actually run
    const analysisOutput = {};
    const traceInferrers = getTraceInferrerNames(renderers);

    traceInferrers.forEach(inferrerName => {
      if (allInferences[inferrerName]) {
        const inference = allInferences[inferrerName];
        analysisOutput[inferrerName] = {
          analysis: inference.analysis,
          trace: inference.trace,
          confidence: inference.confidence
        };
      }
    });

    return {
      ...baseResponse,
      analysis: analysisOutput
    };
  }

  // Production format (lean, no traces)
  return baseResponse;
}
