/**
 * validators.js
 * Input/output validation schemas and utilities
 */

import { TeaModel } from './TeaModel.js';

/**
 * Validate API request body for /api/analysis
 * @param {Object} body - Request body
 * @returns {Object} { valid: boolean, error?: string, data?: TeaModel }
 */
export function validateAnalysisRequest(body) {
  // Check body exists
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body must be a valid JSON object' };
  }

  // Check required fields
  if (!body.name || typeof body.name !== 'string') {
    return { valid: false, error: 'Missing or invalid required field: name (string)' };
  }

  if (!body.type || typeof body.type !== 'string') {
    return { valid: false, error: 'Missing or invalid required field: type (string)' };
  }

  // Create TeaModel and validate
  try {
    const teaModel = new TeaModel(body);
    const validation = teaModel.validate();

    if (!validation.isValid) {
      return { valid: false, error: `Validation failed: ${validation.errors.join('; ')}` };
    }

    return { valid: true, data: teaModel };
  } catch (error) {
    return { valid: false, error: `Invalid tea data: ${error.message}` };
  }
}

/**
 * Validate core analysis result
 * @param {Object} analysis - Core analysis result
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateCoreAnalysis(analysis) {
  if (!analysis || typeof analysis !== 'object') {
    return { valid: false, error: 'Analysis result must be an object' };
  }

  const requiredFields = ['teaType', 'compounds', 'flavor', 'processing', 'geography'];

  for (const field of requiredFields) {
    if (!analysis[field] || typeof analysis[field] !== 'object') {
      return { valid: false, error: `Missing required analysis field: ${field}` };
    }
  }

  // Effects are optional but validated if present
  if (analysis.effects && typeof analysis.effects !== 'object') {
    return { valid: false, error: 'Effects field must be an object if provided' };
  }

  return { valid: true };
}

/**
 * Validate recommendation service output
 * @param {Object} result - Result from recommendation service
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateRecommendationResult(result) {
  if (!result || typeof result !== 'object') {
    return { valid: false, error: 'Recommendation result must be an object' };
  }

  // Should have either recommendations or error
  if (!result.recommendations && !result.error) {
    return { valid: false, error: 'Recommendation result must have recommendations or error field' };
  }

  return { valid: true };
}

/**
 * Validate and sanitize string input
 * @param {string} str - String to validate
 * @param {Object} options - Validation options
 * @returns {string} Sanitized string or empty string
 */
export function sanitizeString(str, options = {}) {
  const { maxLength = 500, allowEmpty = false } = options;

  if (typeof str !== 'string') {
    return allowEmpty ? '' : null;
  }

  let sanitized = str.trim().substring(0, maxLength);

  // Remove potentially harmful characters (basic XSS prevention)
  sanitized = sanitized
    .replace(/[<>]/g, '')
    .replace(/script/gi, '');

  return sanitized || (allowEmpty ? '' : null);
}

/**
 * Validate array of strings
 * @param {any} arr - Array to validate
 * @param {Object} options - Validation options
 * @returns {string[]} Validated array or empty array
 */
export function validateStringArray(arr, options = {}) {
  const { maxLength = 100, maxItems = 50 } = options;

  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .filter(item => typeof item === 'string')
    .map(item => sanitizeString(item, { maxLength, allowEmpty: true }))
    .filter(item => item !== null)
    .slice(0, maxItems);
}

/**
 * Validate numeric value within range
 * @param {any} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {number|null} Validated number or null
 */
export function validateNumber(value, options = {}) {
  const { min = -Infinity, max = Infinity, allowNull = true } = options;

  if (value === null || value === undefined) {
    return allowNull ? null : 0;
  }

  const num = Number(value);

  if (isNaN(num)) {
    return allowNull ? null : 0;
  }

  if (num < min || num > max) {
    return allowNull ? null : Math.max(min, Math.min(max, num));
  }

  return num;
}
