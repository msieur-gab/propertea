/**
 * netlify/functions/health.js
 * GET /.netlify/functions/health
 * Health check endpoint
 */

import { successResponse, corsResponse } from './lib/orchestrator.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return corsResponse();

  return successResponse({
    status: 'ok',
    version: '2.0-orchestrated',
    timestamp: new Date().toISOString(),
    environment: process.env.ENVIRONMENT || 'production'
  });
};
