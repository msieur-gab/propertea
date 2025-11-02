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

import { rendererRegistry, getRequiredInferrers, getTraceInferrerNames, validateRenderers } from '../../endpoint/src/rendererRegistry.js';

/**
 * Main handler function
 */
export default async function handler(event, context) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const formData = requestBody;

    // Validate required fields
    if (!formData.name || !formData.type) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields',
          required: ['name', 'type']
        })
      };
    }

    // Extract optional parameters
    const renderers = formData.renderers || ['activity', 'food', 'time', 'season', 'brewing'];
    const format = formData.format || 'production';

    // Validate format parameter
    if (!['production', 'trace'].includes(format)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid format parameter',
          validValues: ['production', 'trace']
        })
      };
    }

    // Validate requested renderers
    try {
      validateRenderers(renderers);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message })
      };
    }

    // Run pipeline
    const result = await runRecommendationPipeline(formData, renderers, format);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error in tea-recommendation:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate recommendations',
        details: error.message
      })
    };
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
    // Preserve full SeasonRenderer result including circularYear for 12-month visualization
    recommendations.season = {
      recommendations: result.recommendations || [],
      circularYear: result.circularYear || [],
      seasonalScores: result.seasonalScores || {},
      seasonalRange: result.seasonalRange || null,
      analysis: result.analysis || {},
      confidence: result.confidence || 0,
      rendererVersion: result.rendererVersion || '1.0'
    };
  }
  if (renderers.includes('brewing')) {
    const result = new BrewingRenderer().render(formData);
    recommendations.brewing = result.recommendations || [];
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
