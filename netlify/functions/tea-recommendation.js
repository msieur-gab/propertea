/**
 * Netlify Function: Tea Recommendation API
 *
 * Purpose: HTTP transport layer for the tea recommendation engine
 * Accepts: Tea data from admin form interface
 * Returns: Complete recommendations via Inferrer/Renderer pipeline
 *
 * Architecture:
 * Form Data → Inferrers (analysis) → Renderers (recommendations) → JSON Response
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
    const formData = JSON.parse(event.body);

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

    // Run pipeline
    const result = await runRecommendationPipeline(formData);

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
 * @returns {Object} - Complete recommendations
 */
async function runRecommendationPipeline(formData) {
  const startTime = Date.now();

  // ========== PHASE 1: INFERRERS ==========
  // Run all inferrers in parallel to analyze the tea

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
  const inference = {
    flavor: flavorAnalysis,
    compound: compoundAnalysis,
    teaType: teaTypeAnalysis,
    geography: geographyAnalysis,
    processing: processingAnalysis
  };

  // ========== PHASE 2: RENDERERS ==========
  // Run all renderers to generate recommendations

  const [
    activityRecommendations,
    foodRecommendations,
    timeRecommendations,
    seasonRecommendations,
    brewingRecommendations
  ] = await Promise.all([
    new ActivityRenderer().render(compoundAnalysis),
    new FoodRenderer().render(flavorAnalysis),
    new TimeRenderer().render(compoundAnalysis),
    new SeasonRenderer().render(geographyAnalysis),
    new BrewingRenderer().render(formData)
  ]);

  // Aggregate recommendations
  const recommendations = {
    activity: activityRecommendations,
    food: foodRecommendations,
    time: timeRecommendations,
    season: seasonRecommendations,
    brewing: brewingRecommendations
  };

  // ========== RESPONSE ==========

  const elapsedTime = Date.now() - startTime;

  return {
    // Tea identity
    tea: {
      name: formData.name,
      originalName: formData.originalName || '',
      type: formData.type,
      subType: formData.subType || ''
    },

    // Analysis phase results (inference data)
    analysis: {
      flavor: flavorAnalysis.analysis || {},
      compound: compoundAnalysis.analysis || {},
      teaType: teaTypeAnalysis.analysis || {},
      geography: geographyAnalysis.analysis || {},
      processing: processingAnalysis.analysis || {}
    },

    // Recommendation phase results
    recommendations: {
      activity: activityRecommendations.recommendations || [],
      food: foodRecommendations.recommendations || [],
      time: timeRecommendations.recommendations || [],
      season: seasonRecommendations.recommendations || [],
      brewing: brewingRecommendations.recommendations || []
    },

    // Metadata
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs: elapsedTime,
      version: '1.0',
      pipeline: 'inferrer-renderer'
    }
  };
}
