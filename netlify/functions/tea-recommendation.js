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
  // Run all inferrers in parallel to analyze the tea
  // (Always run all inferrers since renderers may depend on each other)

  const [
    flavorAnalysis,
    compoundAnalysis,
    teaTypeAnalysis,
    geographyAnalysis,
    processingAnalysis
  ] = await Promise.all([
    new FlavorInferrer().infer({ flavorProfiles: formData.flavorProfile || [] }),
    new CompoundInferrer().infer({
      caffeineLevel: formData.caffeineLevel,
      lTheanineLevel: formData.lTheanineLevel
    }),
    new TeaTypeInferrer().infer({
      type: formData.type,
      subType: formData.subType
    }),
    new GeographyInferrer().infer({ geography: formData.geography || {} }),
    new ProcessingInferrer().infer({
      processingMethods: formData.processingMethods || []
    })
  ]);

  // Aggregate inference results
  const allInferences = {
    flavor: flavorAnalysis,
    compound: compoundAnalysis,
    teaType: teaTypeAnalysis,
    geography: geographyAnalysis,
    processing: processingAnalysis
  };

  // ========== PHASE 2: RENDERERS ==========
  // Only run requested renderers (note: renderers are synchronous)

  const recommendations = {};

  if (renderers.includes('activity')) {
    const result = new ActivityRenderer().render(compoundAnalysis);
    recommendations.activity = result.recommendations || [];
  }
  if (renderers.includes('food')) {
    const result = new FoodRenderer().render(flavorAnalysis);
    recommendations.food = result.recommendations || [];
  }
  if (renderers.includes('time')) {
    const result = new TimeRenderer().render(compoundAnalysis);
    recommendations.time = result.recommendations || [];
  }
  if (renderers.includes('season')) {
    const result = new SeasonRenderer().render(
      geographyAnalysis,
      processingAnalysis,
      teaTypeAnalysis,
      flavorAnalysis
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
    return {
      ...baseResponse,
      analysis: {
        flavor: {
          analysis: allInferences.flavor.analysis,
          trace: allInferences.flavor.trace,
          confidence: allInferences.flavor.confidence
        },
        compound: {
          analysis: allInferences.compound.analysis,
          trace: allInferences.compound.trace,
          confidence: allInferences.compound.confidence
        },
        teaType: {
          analysis: allInferences.teaType.analysis,
          trace: allInferences.teaType.trace,
          confidence: allInferences.teaType.confidence
        },
        geography: {
          analysis: allInferences.geography.analysis,
          trace: allInferences.geography.trace,
          confidence: allInferences.geography.confidence
        },
        processing: {
          analysis: allInferences.processing.analysis,
          trace: allInferences.processing.trace,
          confidence: allInferences.processing.confidence
        }
      }
    };
  }

  // Production format (lean, no traces)
  return baseResponse;
}
