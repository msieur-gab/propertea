/**
 * netlify/functions/analyze-tea-type.js
 * POST /api/analyze/tea-type
 * Analyze tea type only (for testing/debugging)
 */

import { TeaTypeService } from '../../backend/src/services/TeaTypeService.js';
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

    const service = new TeaTypeService();
    const result = await service.analyze(validation.data);

    return successResponse(result);
  } catch (error) {
    console.error('Error in /api/analyze/tea-type:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
};
