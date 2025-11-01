/**
 * ValidationMiddleware.js - Express middleware for request/response validation
 *
 * Provides middleware functions to validate incoming requests and outgoing responses
 * against defined JSON schemas
 */

import SchemaValidator, {
  calculateDataCompleteness
} from '../utils/SchemaValidator.js';

/**
 * Middleware to validate request body against TeaModel schema
 * Attaches validation result to req.validation
 *
 * Usage:
 *   app.post('/api/analysis', validateTeaModelRequest, handler)
 */
export function validateTeaModelRequest(req, res, next) {
  const startTime = Date.now();

  try {
    const validation = SchemaValidator.validateTeaModel(req.body);

    // Attach validation result to request
    req.validation = {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      dataCompleteness: validation.summary.dataCompleteness,
      estimatedConfidence: validation.summary.estimatedConfidence,
      processingTimeMs: Date.now() - startTime
    };

    // If invalid, reject request
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Request validation failed: ${validation.errors.length} error(s)`,
          details: {
            errors: validation.errors.slice(0, 5),  // First 5 errors
            totalErrors: validation.errors.length,
            warnings: validation.warnings.slice(0, 3),  // First 3 warnings
            totalWarnings: validation.warnings.length,
            dataCompleteness: validation.summary.dataCompleteness,
            estimatedConfidence: validation.summary.estimatedConfidence
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          processingTimeMs: Date.now() - startTime
        }
      });
    }

    // If valid but has warnings, attach warnings to response context
    if (validation.warnings.length > 0) {
      req.validationWarnings = validation.warnings;
    }

    next();
  } catch (error) {
    console.error('Validation middleware error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'An error occurred during request validation',
        details: { originalError: error.message }
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  }
}

/**
 * Middleware to validate response before sending
 * Can wrap response.json() to validate output
 *
 * Usage:
 *   app.use(validateResponseMiddleware)
 */
export function validateResponseMiddleware(req, res, next) {
  const originalJson = res.json;

  res.json = function(data) {
    const startTime = Date.now();

    // Skip validation for error responses
    if (!data.success && data.error) {
      return originalJson.call(this, data);
    }

    // For success responses, optionally validate against response schema
    // (Can be enabled if needed)
    data.metadata = data.metadata || {};
    data.metadata.timestamp = new Date().toISOString();
    if (req.validation) {
      data.metadata.validationTime = req.validation.processingTimeMs;
    }

    return originalJson.call(this, data);
  };

  next();
}

/**
 * Create a validation middleware for custom schemas
 *
 * Usage:
 *   const validateRecommendation = createValidationMiddleware('RecommendationResult');
 *   app.post('/api/recommendations', validateRecommendation, handler);
 */
export function createValidationMiddleware(schemaName) {
  return (req, res, next) => {
    try {
      let validation;

      if (schemaName === 'TeaModel') {
        validation = SchemaValidator.validateTeaModel(req.body);
      } else if (schemaName === 'RecommendationResult') {
        validation = SchemaValidator.validateRecommendationResult(req.body);
      } else if (schemaName === 'APIResponse') {
        validation = SchemaValidator.validateAPIResponse(req.body);
      } else {
        return res.status(500).json({
          success: false,
          error: {
            code: 'UNKNOWN_SCHEMA',
            message: `Unknown schema: ${schemaName}`
          }
        });
      }

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: `${schemaName} validation failed`,
            details: { errors: validation.errors }
          }
        });
      }

      req.validation = validation;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation error',
          details: { originalError: error.message }
        }
      });
    }
  };
}

/**
 * Middleware to enrich response with validation warnings
 * Attaches warnings from validation to response warnings
 */
export function enrichResponseWithWarnings(req, res, next) {
  const originalJson = res.json;

  res.json = function(data) {
    if (req.validationWarnings && Array.isArray(req.validationWarnings)) {
      data.warnings = data.warnings || [];
      data.warnings.push(...req.validationWarnings.map(w => ({
        code: w.code,
        message: w.message,
        field: w.field
      })));
    }
    return originalJson.call(this, data);
  };

  next();
}

/**
 * Middleware to attach data quality context to response
 * Adds data completeness and estimated confidence metadata
 */
export function attachDataQualityMetadata(req, res, next) {
  const originalJson = res.json;

  res.json = function(data) {
    if (req.validation) {
      data.metadata = data.metadata || {};
      data.metadata.dataQuality = {
        completeness: req.validation.dataCompleteness,
        estimatedConfidence: req.validation.estimatedConfidence,
        validationWarnings: (req.validationWarnings || []).length
      };
    }
    return originalJson.call(this, data);
  };

  next();
}

/**
 * Comprehensive validation middleware stack
 * Combines all validation features
 *
 * Usage:
 *   app.use(validationStack)
 */
export function validationStack() {
  return [
    validateResponseMiddleware,
    enrichResponseWithWarnings,
    attachDataQualityMetadata
  ];
}

/**
 * Error handler for validation errors
 *
 * Usage:
 *   app.use(validationErrorHandler)
 */
export function validationErrorHandler(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details
      },
      metadata: {
        timestamp: new Date().toISOString()
      }
    });
  }
  next(err);
}

/**
 * Helper to create standardized error response
 *
 * Usage:
 *   const errorResponse = createErrorResponse('VALIDATION_ERROR', 'Invalid input', errors);
 */
export function createErrorResponse(code, message, details = null) {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      details: details || {}
    },
    metadata: {
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Helper to create standardized success response
 *
 * Usage:
 *   const response = createSuccessResponse(data, req);
 */
export function createSuccessResponse(data, req = null, processingTimeMs = 0) {
  const response = {
    success: true,
    data,
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs
    }
  };

  if (req && req.validation) {
    response.metadata.dataQuality = {
      completeness: req.validation.dataCompleteness,
      estimatedConfidence: req.validation.estimatedConfidence
    };
  }

  return response;
}

export default {
  validateTeaModelRequest,
  validateResponseMiddleware,
  createValidationMiddleware,
  enrichResponseWithWarnings,
  attachDataQualityMetadata,
  validationStack,
  validationErrorHandler,
  createErrorResponse,
  createSuccessResponse
};
