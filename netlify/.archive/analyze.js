/**
 * netlify/functions/analyze.js
 *
 * Main API endpoint: POST /api/analyze
 * Performs complete tea analysis with single-pass orchestration
 *
 * Input: Raw tea data (admin panel format or TeaModel format)
 * Output: Complete analysis with core analyses + recommendations
 */

import { getOrchestrator, successResponse, errorResponse, corsResponse } from './lib/orchestrator.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return corsResponse();
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed. Use POST.', 405);
  }

  try {
    // Parse request body
    let body;
    try {
      body = event.body ? JSON.parse(event.body) : {};
    } catch (parseError) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    if (!body || typeof body !== 'object') {
      return errorResponse('Request body must be a JSON object', 400);
    }

    // Get orchestrator and run analysis
    const orchestrator = getOrchestrator();
    const result = await orchestrator.calculateTea(body);

    if (!result.success) {
      return errorResponse(result.error || 'Analysis failed', 400);
    }

    return successResponse(result.data);
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return errorResponse(error.message || 'Internal server error', 500);
  }
};
