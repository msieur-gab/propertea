/**
 * ExampleRoutes.js - Example Express route configuration
 *
 * Shows how to set up API routes with validation middleware
 * This is an example - actual implementation depends on your framework/setup
 */

import express from 'express';
import {
  validateTeaModelRequest,
  enrichResponseWithWarnings,
  attachDataQualityMetadata,
  validationErrorHandler
} from '../middleware/ValidationMiddleware.js';
import {
  healthCheck,
  analyzeEffects,
  comprehensiveAnalysis,
  validateTeaData,
  getDocumentation
} from './ExampleHandlers.js';

/**
 * Create API router with validation middleware stack
 *
 * Usage in main app.js:
 *   const apiRouter = createAPIRouter();
 *   app.use('/api', apiRouter);
 */
export function createAPIRouter() {
  const router = express.Router();

  // ========================================================================
  // MIDDLEWARE STACK
  // ========================================================================

  // Parse JSON bodies
  router.use(express.json({ limit: '10mb' }));

  // Add request logging
  router.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // ========================================================================
  // PUBLIC ENDPOINTS (No validation required)
  // ========================================================================

  router.get('/health', healthCheck);
  router.get('/docs', getDocumentation);

  // ========================================================================
  // VALIDATION-PROTECTED ENDPOINTS
  // ========================================================================

  // Middleware stack for endpoints requiring tea model validation
  const teaValidationStack = [
    validateTeaModelRequest,
    enrichResponseWithWarnings,
    attachDataQualityMetadata
  ];

  // Effect analysis endpoint
  router.post(
    '/analysis/effects',
    ...teaValidationStack,
    analyzeEffects
  );

  // Timing analysis endpoint
  router.post(
    '/analysis/timing',
    ...teaValidationStack,
    async (req, res) => {
      // Would implement timing analysis
      res.status(501).json({
        success: false,
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Timing analysis endpoint not yet implemented'
        }
      });
    }
  );

  // Comprehensive analysis endpoint
  router.post(
    '/analysis/comprehensive',
    ...teaValidationStack,
    comprehensiveAnalysis
  );

  // Validation-only endpoint (validates without full analysis)
  router.post(
    '/analysis/validate',
    ...teaValidationStack,
    validateTeaData
  );

  // ========================================================================
  // ERROR HANDLING
  // ========================================================================

  // 404 handler
  router.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint not found: ${req.method} ${req.path}`
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  });

  // Global error handler
  router.use(validationErrorHandler);

  return router;
}

/**
 * Example usage in main application:
 *
 *   import express from 'express';
 *   import { createAPIRouter } from './src/api/ExampleRoutes.js';
 *
 *   const app = express();
 *   app.use('/api', createAPIRouter());
 *
 *   app.listen(3000, () => {
 *     console.log('API server running on port 3000');
 *   });
 */

export default {
  createAPIRouter
};
