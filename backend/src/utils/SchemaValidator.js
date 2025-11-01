/**
 * SchemaValidator.js - JSON Schema validation utility
 *
 * Provides comprehensive validation for tea models and API data
 * against defined JSON schemas with detailed error reporting
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaDir = path.join(__dirname, '../schemas');

// Initialize AJV validator with formats support
const ajv = new Ajv({
  allErrors: true,
  useDefaults: false,
  verbose: true,
  strict: false
});
addFormats(ajv);

// Cache for loaded schemas
const schemaCache = {};

/**
 * Load a schema from disk
 * @param {string} schemaName - Name of schema file (without .json)
 * @returns {Object} Loaded schema
 */
function loadSchema(schemaName) {
  if (schemaCache[schemaName]) {
    return schemaCache[schemaName];
  }

  try {
    const schemaPath = path.join(schemaDir, `${schemaName}.schema.json`);
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    const schema = JSON.parse(schemaContent);
    schemaCache[schemaName] = schema;
    return schema;
  } catch (error) {
    throw new Error(`Failed to load schema '${schemaName}': ${error.message}`);
  }
}

/**
 * Validate tea model against schema
 * @param {Object} teaModel - Tea model to validate
 * @returns {Object} Validation result with errors, warnings, and summary
 */
export function validateTeaModel(teaModel) {
  const schema = loadSchema('TeaModel');
  return _validate(teaModel, schema, 'TeaModel');
}

/**
 * Validate a recommendation result
 * @param {Object} result - Recommendation result to validate
 * @returns {Object} Validation result
 */
export function validateRecommendationResult(result) {
  const schema = loadSchema('RecommendationResult');
  return _validate(result, schema, 'RecommendationResult');
}

/**
 * Validate API response structure
 * @param {Object} response - API response to validate
 * @returns {Object} Validation result
 */
export function validateAPIResponse(response) {
  const schema = loadSchema('APIResponse');
  return _validate(response, schema, 'APIResponse');
}

/**
 * Core validation function
 * @private
 */
function _validate(data, schema, schemaName) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  const result = {
    isValid,
    errors: [],
    warnings: [],
    summary: {
      totalErrors: 0,
      totalWarnings: 0,
      dataCompleteness: calculateDataCompleteness(data),
      estimatedConfidence: 0
    }
  };

  // Process validation errors
  if (validate.errors && validate.errors.length > 0) {
    result.errors = validate.errors.map(error =>
      _normalizeValidationError(error, data)
    );
    result.summary.totalErrors = result.errors.length;
  }

  // Add data quality warnings
  const dataWarnings = _generateDataWarnings(data);
  if (dataWarnings.length > 0) {
    result.warnings.push(...dataWarnings);
    result.summary.totalWarnings = dataWarnings.length;
  }

  // Estimate confidence based on validation
  result.summary.estimatedConfidence = _estimateConfidence(
    result.summary.dataCompleteness,
    result.summary.totalErrors,
    result.summary.totalWarnings
  );

  return result;
}

/**
 * Normalize AJV error to human-readable format
 * @private
 */
function _normalizeValidationError(error, data) {
  const fieldPath = error.schemaPath
    .split('/')
    .filter(p => !['#', 'properties', 'items'].includes(p))
    .join('.');

  const actualPath = error.instancePath.slice(1).split('/').join('.');

  return {
    field: actualPath || fieldPath,
    value: _getValueAtPath(data, actualPath),
    message: _formatErrorMessage(error),
    code: _mapErrorCode(error),
    constraint: _extractConstraint(error.schema)
  };
}

/**
 * Format AJV error message to be user-friendly
 * @private
 */
function _formatErrorMessage(error) {
  const path = error.instancePath || 'root';

  switch (error.keyword) {
    case 'required':
      return `Field '${error.params.missingProperty}' is required`;
    case 'type':
      return `Field '${path}' must be of type ${error.params.type}`;
    case 'enum':
      return `Field '${path}' must be one of: ${error.params.allowedValues.join(', ')}`;
    case 'minimum':
      return `Field '${path}' must be >= ${error.params.limit}`;
    case 'maximum':
      return `Field '${path}' must be <= ${error.params.limit}`;
    case 'minLength':
      return `Field '${path}' must be at least ${error.params.limit} characters`;
    case 'maxLength':
      return `Field '${path}' must be at most ${error.params.limit} characters`;
    case 'pattern':
      return `Field '${path}' must match pattern: ${error.params.pattern}`;
    case 'format':
      return `Field '${path}' must be valid ${error.params.format}`;
    case 'additionalProperties':
      return `Unexpected field '${error.params.additionalProperty}' is not allowed`;
    default:
      return error.message || `Validation failed for '${path}'`;
  }
}

/**
 * Map AJV error keyword to validation error code
 * @private
 */
function _mapErrorCode(error) {
  const keywordMap = {
    'required': 'REQUIRED',
    'type': 'TYPE_MISMATCH',
    'minimum': 'RANGE_VIOLATION',
    'maximum': 'RANGE_VIOLATION',
    'minLength': 'RANGE_VIOLATION',
    'maxLength': 'RANGE_VIOLATION',
    'enum': 'ENUM_VIOLATION',
    'format': 'FORMAT_INVALID',
    'pattern': 'PATTERN_MISMATCH'
  };
  return keywordMap[error.keyword] || 'VALIDATION_ERROR';
}

/**
 * Extract constraint info from schema
 * @private
 */
function _extractConstraint(schema) {
  if (!schema) return {};

  return {
    min: schema.minimum,
    max: schema.maximum,
    minLength: schema.minLength,
    maxLength: schema.maxLength,
    pattern: schema.pattern,
    enum: schema.enum,
    type: schema.type
  };
}

/**
 * Get value at a given path in an object
 * @private
 */
function _getValueAtPath(obj, path) {
  if (!path) return obj;
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object') {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Generate data quality warnings
 * @private
 */
function _generateDataWarnings(data) {
  const warnings = [];

  // Check for missing optional fields
  const optionalFields = [
    'caffeineLevel', 'lTheanineLevel', 'flavor', 'geography',
    'processing', 'harvest', 'storage', 'source'
  ];

  optionalFields.forEach(field => {
    if (!data[field]) {
      warnings.push({
        field,
        message: `Optional field '${field}' is missing - this may reduce recommendation accuracy`,
        code: 'MISSING_OPTIONAL'
      });
    }
  });

  // Check data quality
  if (data.geography) {
    const geoFields = ['altitude', 'temperature', 'humidity'];
    const missing = geoFields.filter(f => data.geography[f] === null || data.geography[f] === undefined);
    if (missing.length > 0) {
      warnings.push({
        field: 'geography',
        message: `Missing geographic details: ${missing.join(', ')} - terroir assessment will be limited`,
        code: 'DATA_QUALITY_LOW'
      });
    }
  }

  if (data.processing && data.processing.oxidationLevel === null) {
    warnings.push({
      field: 'processing.oxidationLevel',
      message: 'Oxidation level not specified - processing profile will be incomplete',
      code: 'DATA_QUALITY_LOW'
    });
  }

  if (data.flavor && (!data.flavor.primary || data.flavor.primary.length === 0)) {
    warnings.push({
      field: 'flavor.primary',
      message: 'No primary flavor notes provided - flavor-based recommendations will be generic',
      code: 'DATA_QUALITY_LOW'
    });
  }

  return warnings;
}

/**
 * Calculate data completeness percentage
 * @private
 */
export function calculateDataCompleteness(data) {
  const criticalFields = ['name', 'type'];
  const importantFields = ['caffeineLevel', 'lTheanineLevel', 'flavor', 'geography', 'processing'];
  const optionalFields = ['harvest', 'storage', 'source'];

  let completed = 0;
  let total = 0;

  // Critical fields (must have)
  criticalFields.forEach(field => {
    total++;
    if (data[field]) completed++;
  });

  // Important fields (should have)
  importantFields.forEach(field => {
    total += 0.5;
    if (data[field]) completed += 0.5;
  });

  // Optional fields (nice to have)
  optionalFields.forEach(field => {
    total += 0.25;
    if (data[field]) completed += 0.25;
  });

  return Math.round((completed / total) * 100);
}

/**
 * Estimate recommendation confidence from data quality
 * @private
 */
function _estimateConfidence(completeness, errorCount, warningCount) {
  // Base confidence on completeness
  let confidence = completeness;

  // Reduce for errors
  confidence -= errorCount * 10;

  // Reduce for warnings
  confidence -= warningCount * 5;

  // Floor at 20% (some confidence even with minimal data)
  return Math.max(20, Math.min(100, confidence));
}

/**
 * Create a summary report for validation results
 * @public
 */
export function generateValidationReport(validationResult) {
  const { isValid, errors, warnings, summary } = validationResult;

  let report = '';
  report += '═'.repeat(70) + '\n';
  report += `VALIDATION REPORT - ${isValid ? '✅ PASSED' : '❌ FAILED'}\n`;
  report += '═'.repeat(70) + '\n\n';

  if (!isValid) {
    report += `❌ ERRORS (${errors.length}):\n`;
    report += '─'.repeat(70) + '\n';
    errors.forEach((error, idx) => {
      report += `${idx + 1}. [${error.code}] ${error.field}\n`;
      report += `   → ${error.message}\n`;
      if (error.value !== undefined) {
        report += `   → Value: ${JSON.stringify(error.value)}\n`;
      }
    });
    report += '\n';
  }

  if (warnings.length > 0) {
    report += `⚠️  WARNINGS (${warnings.length}):\n`;
    report += '─'.repeat(70) + '\n';
    warnings.forEach((warning, idx) => {
      report += `${idx + 1}. [${warning.code}] ${warning.field}\n`;
      report += `   → ${warning.message}\n`;
    });
    report += '\n';
  }

  report += 'DATA QUALITY SUMMARY:\n';
  report += '─'.repeat(70) + '\n';
  report += `Data Completeness: ${summary.dataCompleteness}%\n`;
  report += `Estimated Confidence: ${summary.estimatedConfidence}%\n`;
  report += `Total Issues: ${summary.totalErrors + summary.totalWarnings}\n`;

  return report;
}

// Export singleton
export default {
  validateTeaModel,
  validateRecommendationResult,
  validateAPIResponse,
  calculateDataCompleteness,
  generateValidationReport
};
