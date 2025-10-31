/**
 * orchestrator.js - Shared Orchestrator Initialization
 *
 * Initializes the TeaCalculationOrchestrator with all services
 * This is imported by each Netlify Function to avoid duplication
 */

// Import all services
import { CompoundService } from '../../../backend/src/services/CompoundService.js';
import { FlavorService } from '../../../backend/src/services/FlavorService.js';
import { TeaTypeService } from '../../../backend/src/services/TeaTypeService.js';
import { ProcessingService } from '../../../backend/src/services/ProcessingService.js';
import { GeographyService } from '../../../backend/src/services/GeographyService.js';
import { EffectService } from '../../../backend/src/services/EffectService.js';
import { RecommendationService } from '../../../backend/src/services/RecommendationService.js';
import { TeaCalculationOrchestrator } from '../../../backend/src/models/TeaCalculationOrchestrator.js';

let cachedOrchestrator = null;

/**
 * Get or create the orchestrator instance
 * Caches the instance to avoid recreating services on each function invocation
 *
 * @returns {TeaCalculationOrchestrator}
 */
export function getOrchestrator() {
  if (cachedOrchestrator) {
    return cachedOrchestrator;
  }

  const services = {
    teaTypeService: new TeaTypeService(),
    compoundService: new CompoundService(),
    flavorService: new FlavorService(),
    processingService: new ProcessingService(),
    geographyService: new GeographyService(),
    effectService: new EffectService(),
    recommendationService: new RecommendationService()
  };

  cachedOrchestrator = new TeaCalculationOrchestrator(services);
  return cachedOrchestrator;
}

/**
 * Format a successful response
 *
 * @param {any} data - Response data
 * @returns {Object} Formatted response
 */
export function successResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      data
    })
  };
}

/**
 * Format an error response
 *
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
export function errorResponse(error, statusCode = 400) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: false,
      error: error || 'An error occurred'
    })
  };
}

/**
 * Handle CORS preflight requests
 *
 * @returns {Object} CORS response
 */
export function corsResponse() {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: ''
  };
}
