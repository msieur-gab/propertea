/**
 * ExampleHandlers.js - Example API handlers using validation middleware
 *
 * Shows how to implement endpoints with proper validation and error handling
 */

import { EffectService } from '../services/EffectService.js';
import TimeMatcher from '../services/matchers/TimeMatcher.js';
import SeasonMatcher from '../services/matchers/SeasonMatcher.js';
import FoodMatcher from '../services/matchers/FoodMatcher.js';
import ActivityMatcher from '../services/matchers/ActivityMatcher.js';
import {
  createSuccessResponse,
  createErrorResponse
} from '../middleware/ValidationMiddleware.js';

// Initialize services
const effectService = new EffectService({ useNewModel: true });
const timeMatcher = new TimeMatcher();
const seasonMatcher = new SeasonMatcher();
const foodMatcher = new FoodMatcher();
const activityMatcher = new ActivityMatcher();

/**
 * GET /api/health
 * Health check endpoint
 */
export async function healthCheck(req, res) {
  res.json(createSuccessResponse({
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  }));
}

/**
 * POST /api/analysis/effects
 * Analyze tea effects
 *
 * Request body (validated against TeaModel schema):
 * {
 *   "name": "Green Tea",
 *   "type": "green",
 *   "caffeineLevel": 7,
 *   ...
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "description": {...},
 *     "expectedEffects": {...},
 *     "confidence": {...}
 *   },
 *   "metadata": {
 *     "dataQuality": {...}
 *   }
 * }
 */
export async function analyzeEffects(req, res) {
  const startTime = Date.now();

  try {
    const teaModel = req.body;

    // Validation already done by middleware (req.validation contains result)
    console.log(`[Effect Analysis] Processing: ${teaModel.name} (${req.validation.dataCompleteness}% complete)`);

    // Run effect analysis
    const analysis = effectService.infer(teaModel);

    // Add validation data to response
    const response = {
      ...analysis,
      _metadata: {
        analysisType: 'effects',
        dataCompleteness: req.validation.dataCompleteness,
        estimatedConfidence: req.validation.estimatedConfidence,
        validationWarnings: req.validationWarnings || []
      }
    };

    res.json(createSuccessResponse(response, req, Date.now() - startTime));
  } catch (error) {
    console.error('Effect analysis error:', error);
    res.status(500).json(
      createErrorResponse(
        'ANALYSIS_ERROR',
        'Failed to analyze tea effects',
        { originalError: error.message }
      )
    );
  }
}

/**
 * POST /api/analysis/comprehensive
 * Complete analysis: effects + time + season + food + activity
 *
 * Returns all four recommendation types with confidence metrics
 */
export async function comprehensiveAnalysis(req, res) {
  const startTime = Date.now();

  try {
    const teaModel = req.body;

    console.log(`[Comprehensive Analysis] Processing: ${teaModel.name}`);

    // Run all analyses in parallel for efficiency
    const [effectResult, timeResult, seasonResult, foodResult, activityResult] = await Promise.all([
      Promise.resolve(effectService.infer(teaModel)),
      Promise.resolve(timeMatcher.matchTime(
        teaModel,
        { analysis: { compoundProfile: 'Balanced', stimulationLevel: 'moderate', relaxationLevel: 'moderate' } },
        { analysis: { baseActivityHints: [] }, primaryType: teaModel.type },
        { analysis: { activityHints: [] } }
      )),
      Promise.resolve(seasonMatcher.matchSeason(teaModel)),
      Promise.resolve(foodMatcher.matchFood(teaModel)),
      Promise.resolve(activityMatcher.matchActivity(teaModel))
    ]);

    const response = {
      effects: effectResult,
      timing: timeResult,
      seasons: seasonResult,
      food: foodResult,
      activities: activityResult,
      summary: {
        teaName: teaModel.name,
        teaType: teaModel.type,
        analysisQuality: {
          dataCompleteness: req.validation.dataCompleteness,
          estimatedConfidence: req.validation.estimatedConfidence,
          warningsCount: (req.validationWarnings || []).length
        },
        recommendationSummary: {
          dominantEffect: effectResult.expectedEffects.dominant,
          optimalTime: timeResult.recommendedTimes?.[0]?.hour || 'N/A',
          optimalSeason: seasonResult.recommendedSeasons?.[0]?.season || 'N/A',
          topFood: foodResult.recommendedFoods?.[0]?.name || 'N/A',
          topActivity: activityResult.recommendedActivities?.[0]?.name || 'N/A'
        }
      }
    };

    res.json(createSuccessResponse(response, req, Date.now() - startTime));
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    res.status(500).json(
      createErrorResponse(
        'ANALYSIS_ERROR',
        'Failed to run comprehensive analysis',
        { originalError: error.message }
      )
    );
  }
}

/**
 * POST /api/analysis/validate
 * Validate tea model without running full analysis
 * Returns validation results and data quality metrics
 */
export async function validateTeaData(req, res) {
  const startTime = Date.now();

  try {
    // Validation already done by middleware
    const validationResult = {
      isValid: req.validation.isValid,
      errors: req.validation.errors,
      warnings: req.validationWarnings || [],
      dataQuality: {
        completeness: req.validation.dataCompleteness,
        estimatedConfidence: req.validation.estimatedConfidence,
        interpretation: _interpretDataQuality(req.validation.dataCompleteness)
      }
    };

    res.json(createSuccessResponse(validationResult, req, Date.now() - startTime));
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json(
      createErrorResponse(
        'VALIDATION_ERROR',
        'Failed to validate tea data',
        { originalError: error.message }
      )
    );
  }
}

/**
 * GET /api/analysis/documentation
 * Return documentation about API schemas and validation
 */
export async function getDocumentation(req, res) {
  const documentation = {
    version: '2.0.0',
    endpoints: [
      {
        method: 'POST',
        path: '/api/analysis/effects',
        description: 'Analyze dominant and supporting effects',
        requiresValidation: true
      },
      {
        method: 'POST',
        path: '/api/analysis/timing',
        description: 'Get optimal times of day',
        requiresValidation: true
      },
      {
        method: 'POST',
        path: '/api/analysis/comprehensive',
        description: 'Complete analysis (effects + timing + seasons + food + activities)',
        requiresValidation: true
      },
      {
        method: 'POST',
        path: '/api/analysis/validate',
        description: 'Validate tea data and get quality metrics',
        requiresValidation: true
      }
    ],
    inputSchema: {
      title: 'Tea Model',
      required: ['name', 'type'],
      optional: [
        'caffeineLevel',
        'lTheanineLevel',
        'flavor',
        'geography',
        'processing',
        'harvest',
        'storage'
      ],
      dataCompletenessImpact: {
        minimal: '38%',
        complete: '90%'
      }
    },
    responseStructure: {
      success: 'boolean',
      data: 'object',
      metadata: {
        timestamp: 'ISO 8601',
        processingTimeMs: 'number',
        dataQuality: {
          completeness: 'percentage',
          estimatedConfidence: 'percentage'
        }
      }
    },
    confidenceMetrics: {
      VeryHigh: '85-100%',
      High: '70-84%',
      Moderate: '55-69%',
      Low: '40-54%',
      VeryLow: '<40%'
    }
  };

  res.json(createSuccessResponse(documentation));
}

/**
 * Helper: Interpret data quality
 * @private
 */
function _interpretDataQuality(completeness) {
  if (completeness >= 80) return 'Excellent - Full analysis with high confidence';
  if (completeness >= 60) return 'Good - Solid analysis with moderate confidence';
  if (completeness >= 40) return 'Fair - Basic analysis with some uncertainty';
  return 'Limited - Minimal data, results may be generic';
}

export default {
  healthCheck,
  analyzeEffects,
  comprehensiveAnalysis,
  validateTeaData,
  getDocumentation
};
