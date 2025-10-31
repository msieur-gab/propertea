/**
 * TeaTypeNormalizer.js - Minimal Version
 *
 * Normalizes tea type names to canonical Chinese tea classification system
 * Canonical types: green, white, yellow, oolong, red, puerh (with sheng/shou subtypes)
 *
 * This is a simple mapping utility with no external dependencies.
 */

const CANONICAL_TYPES = {
  // Green Tea (绿茶)
  'green': 'green',
  'green tea': 'green',

  // White Tea (白茶)
  'white': 'white',
  'white tea': 'white',

  // Yellow Tea (黄茶)
  'yellow': 'yellow',
  'yellow tea': 'yellow',

  // Oolong Tea (乌龙茶)
  'oolong': 'oolong',
  'oolong tea': 'oolong',
  'wulong': 'oolong',

  // Red Tea / Hongcha (红茶) - Western: Black Tea
  'red': 'red',
  'red tea': 'red',
  'black': 'red',                    // CRITICAL: Western "black" → Chinese "red"
  'black tea': 'red',
  'hongcha': 'red',

  // Puerh Tea (普洱茶) and subtypes
  'puerh': 'puerh',
  'pu-erh': 'puerh',
  'pu erh': 'puerh',
  'puer': 'puerh',
  'pu\'er': 'puerh',

  // Puerh Sheng - Raw/Aged (生普)
  'puerh-sheng': 'puerh',
  'puerh sheng': 'puerh',
  'raw puerh': 'puerh',
  'aged puerh': 'puerh',

  // Puerh Shou - Ripe/Cooked (熟普)
  'puerh-shou': 'puerh',
  'puerh shou': 'puerh',
  'ripe puerh': 'puerh',
  'cooked puerh': 'puerh'
};

export class TeaTypeNormalizer {
  /**
   * Normalize tea type to canonical form
   * @param {string} input - Tea type (any format)
   * @returns {Object} { canonical, subtype, valid }
   */
  static normalize(input) {
    if (!input || typeof input !== 'string') {
      return { canonical: 'unknown', subtype: null, valid: false };
    }

    const normalized = input.toLowerCase().trim();
    const canonical = CANONICAL_TYPES[normalized];

    if (!canonical) {
      return { canonical: 'unknown', subtype: null, valid: false };
    }

    // Extract subtype if present (for puerh)
    let subtype = null;
    if (canonical === 'puerh') {
      if (normalized.includes('sheng') || normalized.includes('raw') || normalized.includes('aged')) {
        subtype = 'sheng';
      } else if (normalized.includes('shou') || normalized.includes('ripe') || normalized.includes('cooked')) {
        subtype = 'shou';
      }
    }

    return {
      canonical,
      subtype,
      valid: true
    };
  }

  /**
   * Check if input is a valid tea type
   * @param {string} input - Tea type to validate
   * @returns {boolean}
   */
  static isValid(input) {
    const result = this.normalize(input);
    return result.valid;
  }

  /**
   * Get all canonical tea types
   * @returns {Array} ['green', 'white', 'yellow', 'oolong', 'red', 'puerh']
   */
  static getCanonicalTypes() {
    return ['green', 'white', 'yellow', 'oolong', 'red', 'puerh'];
  }

  /**
   * Get puerh subtypes
   * @returns {Array} ['sheng', 'shou']
   */
  static getPueringSubtypes() {
    return ['sheng', 'shou'];
  }
}
