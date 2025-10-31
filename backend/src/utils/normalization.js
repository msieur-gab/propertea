/**
 * normalization.js
 *
 * Normalizes tea data from various input formats into consistent TeaModel format
 *
 * Handles:
 * - Admin panel format: { flavorProfile: [], processingMethods: [] }
 * - TeaModel format: { flavor: { primary: [] }, processing: { methods: [] } }
 * - Database format: Various stored formats
 * - API format: Clean input format
 */

import { TeaModel } from '../models/TeaModel.js';
import { validateNumber, validateStringArray, sanitizeString } from '../models/validators.js';

/**
 * Normalize any tea data format into a TeaModel
 *
 * @param {Object} rawData - Raw tea data in any format
 * @returns {TeaModel} Normalized tea model
 *
 * @example
 * // Admin panel format
 * normalizeTeaData({
 *   teaName: 'Gyokuro',
 *   teaType: 'green',
 *   flavorProfile: ['umami', 'marine'],
 *   processingMethods: ['steamed', 'rolled'],
 *   caffeineLevel: 4.5
 * })
 *
 * @example
 * // TeaModel format
 * normalizeTeaData({
 *   name: 'Gyokuro',
 *   type: 'green',
 *   flavor: { primary: ['umami', 'marine'] },
 *   processing: { methods: ['steamed', 'rolled'] }
 * })
 */
export function normalizeTeaData(rawData) {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Tea data must be a non-empty object');
  }

  // Extract basic tea information (handle both naming conventions)
  const name = sanitizeString(
    rawData.name || rawData.teaName || '',
    { maxLength: 100 }
  );

  const originalName = sanitizeString(
    rawData.originalName || rawData.original_name || '',
    { maxLength: 100, allowEmpty: true }
  );

  const type = sanitizeString(
    rawData.type || rawData.teaType || '',
    { maxLength: 50 }
  );

  const subType = sanitizeString(
    rawData.subType || rawData.sub_type || '',
    { maxLength: 50, allowEmpty: true }
  );

  // Extract compound levels
  const caffeineLevel = validateNumber(rawData.caffeineLevel, {
    min: 0,
    max: 10,
    allowNull: false
  });

  const lTheanineLevel = validateNumber(rawData.lTheanineLevel || rawData.l_theanine_level, {
    min: 0,
    max: 10,
    allowNull: false
  });

  // Extract processing information
  const processingMethods = normalizeProcessing(rawData);

  // Extract flavor profile
  const flavorProfile = normalizeFlavor(rawData);

  // Extract geographical information
  const geography = normalizeGeography(rawData);

  // Create and return TeaModel
  return new TeaModel({
    id: rawData.id || null,
    name,
    originalName,
    type,
    subType,
    caffeineLevel,
    lTheanineLevel,
    processingMethods,
    flavorProfile,
    geography,
    dateAdded: rawData.dateAdded || rawData.date_added || new Date().toISOString()
  });
}

/**
 * Normalize processing information from various formats
 * @private
 */
function normalizeProcessing(rawData) {
  if (!rawData) return {};

  // Handle direct methods array
  let methods = rawData.processingMethods || rawData.processing?.methods || [];
  if (!Array.isArray(methods)) {
    methods = [];
  }

  methods = validateStringArray(methods, { maxLength: 50, maxItems: 20 });

  // Extract other processing details
  const oxidationLevel = validateNumber(
    rawData.processing?.oxidationLevel || rawData.oxidation_level,
    { min: 0, max: 100, allowNull: true }
  );

  const rollingStyle = sanitizeString(
    rawData.processing?.rollingStyle || rawData.rolling_style || '',
    { maxLength: 50, allowEmpty: true }
  );

  const withering = sanitizeString(
    rawData.processing?.withering || '',
    { maxLength: 50, allowEmpty: true }
  );

  const firing = sanitizeString(
    rawData.processing?.firing || '',
    { maxLength: 50, allowEmpty: true }
  );

  return {
    methods,
    oxidationLevel: oxidationLevel !== null ? oxidationLevel : 0,
    rollingStyle,
    withering,
    firing
  };
}

/**
 * Normalize flavor profile from various formats
 * @private
 */
function normalizeFlavor(rawData) {
  if (!rawData) return [];

  // Handle multiple possible field names
  let flavorArray =
    rawData.flavorProfile ||
    rawData.flavor?.primary ||
    rawData.flavor_profile ||
    rawData.flavors ||
    [];

  if (!Array.isArray(flavorArray)) {
    flavorArray = [];
  }

  // Validate and sanitize
  return validateStringArray(flavorArray, { maxLength: 50, maxItems: 30 });
}

/**
 * Normalize geographical information from various formats
 * @private
 */
function normalizeGeography(rawData) {
  if (!rawData || !rawData.geography) {
    return {};
  }

  const geo = rawData.geography;

  return {
    country: sanitizeString(geo.country || geo.origin_country || '', { maxLength: 50, allowEmpty: true }),
    province: sanitizeString(geo.province || geo.region || geo.state || '', { maxLength: 100, allowEmpty: true }),
    location: sanitizeString(geo.location || geo.area || '', { maxLength: 100, allowEmpty: true }),

    latitude: validateNumber(geo.latitude || geo.lat, {
      min: -90,
      max: 90,
      allowNull: true
    }),

    longitude: validateNumber(geo.longitude || geo.lon, {
      min: -180,
      max: 180,
      allowNull: true
    }),

    altitude: validateNumber(geo.altitude || geo.elevation, {
      min: -500,
      max: 9000,
      allowNull: true
    }),

    humidity: validateNumber(geo.humidity || geo.humidity_percent, {
      min: 0,
      max: 100,
      allowNull: true
    }),

    temperature: validateNumber(geo.temperature || geo.temp, {
      min: -50,
      max: 60,
      allowNull: true
    }),

    solarRadiation: validateNumber(geo.solarRadiation || geo.solar_radiation, {
      min: 0,
      max: 2000,
      allowNull: true
    }),

    harvestMonth: validateNumber(geo.harvestMonth || geo.harvest_month, {
      min: 1,
      max: 12,
      allowNull: true
    })
  };
}

/**
 * Batch normalize multiple tea records
 * @param {Array} rawDataArray - Array of raw tea data
 * @returns {TeaModel[]} Array of normalized TeaModels
 */
export function normalizeTeaDataBatch(rawDataArray) {
  if (!Array.isArray(rawDataArray)) {
    throw new Error('Input must be an array');
  }

  return rawDataArray
    .filter(item => item && typeof item === 'object')
    .map(item => {
      try {
        return normalizeTeaData(item);
      } catch (error) {
        console.warn(`Failed to normalize tea data: ${error.message}`, item);
        return null;
      }
    })
    .filter(item => item !== null);
}

/**
 * Merge normalization: take normalized model and additional data
 * Useful for partial updates
 *
 * @param {TeaModel} baseModel - Existing normalized model
 * @param {Object} updates - Additional/updated fields
 * @returns {TeaModel} Merged model
 */
export function mergeTeaData(baseModel, updates) {
  if (!(baseModel instanceof TeaModel)) {
    throw new Error('Base model must be a TeaModel instance');
  }

  if (!updates || typeof updates !== 'object') {
    return baseModel;
  }

  // Create new model with merged data
  const merged = new TeaModel({
    ...baseModel.toJSON(),
    ...updates
  });

  return merged;
}
