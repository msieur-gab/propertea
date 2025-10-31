/**
 * netlify/functions/api-info.js
 * GET /.netlify/functions/api-info
 * API information and available endpoints
 */

import { successResponse, corsResponse } from './lib/orchestrator.js';

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') return corsResponse();

  return successResponse({
    name: 'Tea Analysis API',
    version: '2.0-orchestrated',
    description: 'Single-pass tea analysis with consolidated services',
    baseUrl: process.env.URL || 'https://example.netlify.app',
    endpoints: {
      health: 'GET /.netlify/functions/health',
      info: 'GET /.netlify/functions/api-info',
      analyze: 'POST /.netlify/functions/analyze',
      'analyze-compounds': 'POST /.netlify/functions/analyze-compounds',
      'analyze-flavor': 'POST /.netlify/functions/analyze-flavor',
      'analyze-tea-type': 'POST /.netlify/functions/analyze-tea-type',
      'analyze-processing': 'POST /.netlify/functions/analyze-processing',
      'analyze-geography': 'POST /.netlify/functions/analyze-geography'
    },
    features: [
      'Single-pass core calculations (5-6x performance improvement)',
      'Consolidated recommendation service (timing, seasonal, food, activity, brewing)',
      'Intelligent tea type identification with fallback logic',
      'Multi-format input normalization',
      'Comprehensive error handling',
      'CORS enabled for cross-origin requests'
    ],
    documentation: {
      mainEndpoint: {
        description: 'Complete tea analysis with all derived recommendations',
        method: 'POST',
        path: '/.netlify/functions/analyze',
        exampleRequest: {
          name: 'Dragon Well',
          type: 'green',
          flavor: {
            primary: ['grassy', 'sweet', 'chestnut']
          },
          compounds: {
            caffeineLevel: 4,
            lTheanineLevel: 6
          },
          processing: {
            methods: ['pan-fired'],
            oxidationLevel: 8
          },
          geography: {
            country: 'China',
            province: 'Zhejiang',
            altitude: 300,
            humidity: 75,
            temperature: 18,
            latitude: 30.2,
            longitude: 120.1
          }
        },
        exampleResponse: {
          success: true,
          data: {
            teaType: { identified: { type: 'green' } },
            compounds: { levels: { caffeineLevel: 4 } },
            flavor: { profile: { intensity: 'Moderate' } },
            processing: { roastLevel: 'Light' },
            geography: { location: { country: 'China' } },
            timing: { bestTimes: ['Morning', 'Afternoon'] },
            seasonal: { bestSeasons: ['Spring', 'Summer'] },
            food: { foods: ['Light Desserts'] },
            activities: { activities: ['Work', 'Study'] },
            brewing: { general: { waterTemperature: '70-80°C' } }
          }
        }
      }
    }
  });
};
