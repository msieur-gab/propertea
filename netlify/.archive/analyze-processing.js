/**
 * netlify/functions/analyze-processing.js
 * POST /api/analyze/processing
 * Analyze processing only (for testing/debugging)
 */

import { ProcessingService } from '../../backend/src/services/ProcessingService.js';
import { validateAnalysisRequest } from '../../backend/src/models/validators.js';
import { successResponse, errorResponse, corsResponse } from './lib/orchestrator.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return corsResponse();
  if (event.httpMethod !== 'POST') return errorResponse('Method not allowed. Use POST.', 405);

  try {
    let body = event.body ? JSON.parse(event.body) : {};
    const validation = validateAnalysisRequest(body);

    if (!validation.valid) {
      return errorResponse(validation.error, 400);
    }

    const service = new ProcessingService();
    const result = await service.analyze(validation.data);

    return successResponse(result);
  } catch (error) {
    console.error('Error in /api/analyze/processing:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
};
