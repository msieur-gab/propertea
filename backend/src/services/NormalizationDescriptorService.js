/**
 * NormalizationDescriptorService.js
 *
 * Bridges the gap between dataset input formats and reference descriptor formats.
 * Ensures that all data from various sources (admin panel, API, database) is properly
 * mapped to the authoritative reference descriptors before effect calculations.
 *
 * Three-step normalization:
 * 1. Input normalization (various formats → consistent format)
 * 2. Reference mapping (consistent format → reference descriptor keys)
 * 3. Effect extraction (reference descriptor keys → actual effects + descriptions)
 *
 * This service is essential because:
 * - Dataset uses "orchid", "creamy", "light roast"
 * - References define effects for specific subcategories
 * - Backend needs to map dataset terms to reference keys
 * - Then extract the authoritative effects and descriptions from references
 */

import ReferenceDescriptorService from './ReferenceDescriptorService.js';
import { elevationLevels, temperatureLevels, humidityLevels, solarRadiationLevels, latitudeZones } from '../descriptors/GeographicalDescriptors.js';

// Scale factor for geography effects to prevent them from overpowering other factors
// Descriptors have values like { calming: 2.0, focusing: 1.5 } which are too strong
// when applied at 2.0x weight alongside tea type (2.5x) and compounds (2.0-2.8x)
// Using 0.25 scale brings descriptors back to conservative 0.5-0.375 range
const GEOGRAPHY_EFFECT_SCALE = 0.25;

export class NormalizationDescriptorService {
  /**
   * Normalize and map flavor profile from dataset to reference flavors with effects
   *
   * @param {Array<string>} flavorArray - Flavors from dataset (e.g., ["floral", "creamy", "orchid"])
   * @returns {Array<Object>} Mapped flavors with their reference data and effects
   *
   * @example
   * // Dataset has: ["floral", "creamy", "orchid"]
   * // Returns:
   * [
   *   { originalName: "floral", referenceKey: "floral", category: "floral", effects: {...} },
   *   { originalName: "creamy", referenceKey: "vanilla", category: "sweet", effects: {...} },
   *   { originalName: "orchid", referenceKey: "orchid", category: "floral", effects: {...} }
   * ]
   */
  static normalizeFlavorProfile(flavorArray) {
    if (!Array.isArray(flavorArray)) {
      return [];
    }

    const normalized = [];

    for (const flavor of flavorArray) {
      if (!flavor || typeof flavor !== 'string') continue;

      const trimmed = flavor.toLowerCase().trim();

      // Try direct match first
      let flavorData = ReferenceDescriptorService.getFlavorEffect(trimmed);

      if (flavorData) {
        // Direct match found
        normalized.push({
          originalName: flavor,
          referenceKey: trimmed,
          category: flavorData.category,
          effects: flavorData.effects || {},
          intensity: flavorData.intensity || 0,
          description: this._generateFlavorDescription(flavorData),
          source: 'direct_match'
        });
      } else {
        // Try to map to reference flavor(s)
        const mappedFlavors = ReferenceDescriptorService.mapFlavorToReference(trimmed);

        for (const refFlavor of mappedFlavors) {
          const refData = ReferenceDescriptorService.getFlavorEffect(refFlavor);
          if (refData) {
            normalized.push({
              originalName: flavor,
              referenceKey: refFlavor,
              mappedFrom: trimmed,
              category: refData.category,
              effects: refData.effects || {},
              intensity: refData.intensity || 0,
              description: this._generateFlavorDescription(refData),
              source: 'alias_mapping'
            });
          }
        }
      }
    }

    return normalized;
  }

  /**
   * Normalize and map processing methods from dataset to reference methods with effects
   *
   * @param {Array<string>} processingArray - Processing methods from dataset
   * @returns {Array<Object>} Mapped methods with their reference data and effects
   *
   * @example
   * // Dataset has: ["medium oxidation", "light roast", "rolled"]
   * // Returns:
   * [
   *   { originalName: "medium oxidation", referenceKey: "partial-oxidation", effects: {...} },
   *   { originalName: "light roast", referenceKey: "light-roast", effects: {...} },
   *   { originalName: "rolled", referenceKey: "minimal-processing", effects: {...} }
   * ]
   */
  static normalizeProcessingMethods(processingArray) {
    if (!Array.isArray(processingArray)) {
      return [];
    }

    const normalized = [];

    for (const method of processingArray) {
      if (!method || typeof method !== 'string') continue;

      const trimmed = method.toLowerCase().trim();
      const hyphenated = trimmed.replace(/\s+/g, '-');

      // Try direct match first
      let processData = ReferenceDescriptorService.getProcessingEffect(hyphenated);

      if (processData) {
        // Direct match found
        normalized.push({
          originalName: method,
          referenceKey: hyphenated,
          effects: processData.effects || {},
          intensity: processData.intensity || 0,
          category: processData.category || 'unknown',
          description: processData.description || null,
          source: 'direct_match'
        });
      } else {
        // Try to map to reference method(s)
        const mappedMethods = ReferenceDescriptorService.mapProcessingToReference(trimmed);

        for (const refMethod of mappedMethods) {
          const refData = ReferenceDescriptorService.getProcessingEffect(refMethod);
          if (refData) {
            normalized.push({
              originalName: method,
              referenceKey: refMethod,
              mappedFrom: trimmed,
              effects: refData.effects || {},
              intensity: refData.intensity || 0,
              category: refData.category || 'unknown',
              description: refData.description || null,
              source: 'alias_mapping'
            });
          }
        }
      }
    }

    return normalized;
  }

  /**
   * Normalize geographic data from numeric values to reference categories with effects
   *
   * @param {Object} geography - Geographic data with numeric values
   * @returns {Object} Normalized geographic data with reference categories and effects
   *
   * @example
   * // Input: { altitude: 800, humidity: 78, temperature: 19.5, solarRadiation: 185 }
   * // Returns:
   * {
   *   altitude: {
   *     value: 800,
   *     level: "medium",
   *     description: "Medium elevation teas...",
   *     effects: { harmonizing: 2.0, focusing: 1.5, ... }
   *   },
   *   humidity: { ... },
   *   // etc
   * }
   */
  static normalizeGeography(geography) {
    if (!geography || typeof geography !== 'object') {
      return {
        altitude: this._getDefaultAltitudeData(),
        temperature: this._getDefaultTemperatureData(),
        humidity: this._getDefaultHumidityData(),
        solarRadiation: this._getDefaultSolarData()
      };
    }

    const normalized = {};

    // Normalize altitude (in meters)
    if (geography.altitude !== undefined && geography.altitude !== null) {
      const elevLevel = ReferenceDescriptorService.getElevationLevel(geography.altitude);
      normalized.altitude = {
        value: geography.altitude,
        level: this._getElevationLevelName(geography.altitude),
        description: elevLevel.description,
        effects: this._scaleEffects(elevLevel.effects || {}),
        range: { min: elevLevel.min, max: elevLevel.max }
      };
    } else {
      normalized.altitude = this._getDefaultAltitudeData();
    }

    // Normalize temperature (in Celsius)
    if (geography.temperature !== undefined && geography.temperature !== null) {
      const tempLevel = this._getTemperatureLevel(geography.temperature);
      normalized.temperature = {
        value: geography.temperature,
        level: tempLevel.name,
        description: tempLevel.description,
        effects: tempLevel.effects || {}
      };
    } else {
      normalized.temperature = this._getDefaultTemperatureData();
    }

    // Normalize humidity (as percentage)
    if (geography.humidity !== undefined && geography.humidity !== null) {
      const humLevel = this._getHumidityLevel(geography.humidity);
      normalized.humidity = {
        value: geography.humidity,
        level: humLevel.name,
        description: humLevel.description,
        effects: humLevel.effects || {}
      };
    } else {
      normalized.humidity = this._getDefaultHumidityData();
    }

    // Normalize solar radiation (in W/m²)
    if (geography.solarRadiation !== undefined && geography.solarRadiation !== null) {
      const solLevel = this._getSolarLevel(geography.solarRadiation);
      normalized.solarRadiation = {
        value: geography.solarRadiation,
        level: solLevel.name,
        description: solLevel.description,
        effects: solLevel.effects || {}
      };
    } else {
      normalized.solarRadiation = this._getDefaultSolarData();
    }

    // Normalize latitude for zone classification
    if (geography.latitude !== undefined && geography.latitude !== null) {
      const latZone = ReferenceDescriptorService.getLatitudeZone(geography.latitude);
      normalized.latitude = {
        value: geography.latitude,
        zone: this._getLatitudeZoneName(Math.abs(geography.latitude)),
        description: latZone.description,
        effects: latZone.effects || {}
      };
    }

    return normalized;
  }

  /**
   * Normalize compound levels from numeric values to reference compound profiles
   *
   * @param {number} caffeineLevel - Caffeine level (0-10 scale)
   * @param {number} lTheanineLevel - L-Theanine level (0-10 scale)
   * @returns {Object} Normalized compound profile with category and effects
   *
   * @example
   * // Input: caffeineLevel: 3.5, lTheanineLevel: 4.0
   * // Returns:
   * {
   *   caffeineLevel: 3.5,
   *   lTheanineLevel: 4.0,
   *   profile: "Balanced L-Theanine",
   *   stimulationLevel: "Moderate",
   *   relaxationLevel: "High",
   *   description: "Balanced caffeine with higher L-theanine...",
   *   effects: { calming: 3, harmonizing: 1.5, ... }
   * }
   */
  static normalizeCompounds(caffeineLevel, lTheanineLevel) {
    if (caffeineLevel === undefined || lTheanineLevel === undefined) {
      return this._getDefaultCompoundProfile();
    }

    const caf = parseFloat(caffeineLevel) || 0;
    const lThea = parseFloat(lTheanineLevel) || 0;

    // Categorize caffeine level
    let stimulationLevel = 'Low';
    if (caf >= 8) stimulationLevel = 'Very High';
    else if (caf >= 5) stimulationLevel = 'High';
    else if (caf >= 2.5) stimulationLevel = 'Moderate';

    // Categorize L-Theanine level
    let relaxationLevel = 'Low';
    if (lThea >= 8) relaxationLevel = 'Very High';
    else if (lThea >= 5) relaxationLevel = 'High';
    else if (lThea >= 2.5) relaxationLevel = 'Moderate';

    // Determine compound profile
    let profile = 'Balanced';
    let effects = { harmonizing: 1, focusing: 0.5 }; // Default balanced effects

    if (relaxationLevel === 'Very High') {
      profile = 'Very High L-Theanine';
      effects = { calming: 1.5, harmonizing: 1, restorative: 0.75, elevating: 0.5 };
    } else if (relaxationLevel === 'High') {
      profile = 'High L-Theanine';
      effects = { calming: 1, harmonizing: 0.75, restorative: 0.5, comforting: 0.5 };
    } else if (stimulationLevel === 'Very High') {
      profile = 'Very High Caffeine';
      effects = { energizing: 2, focusing: 2, grounding: -1, calming: -2 };
    } else if (stimulationLevel === 'High') {
      profile = 'High Caffeine';
      effects = { energizing: 1, focusing: 1, calming: -1 };
    } else if (stimulationLevel === 'Moderate') {
      profile = 'Moderate Caffeine';
      effects = { energizing: 0.5, focusing: 0.5 };
    }

    return {
      caffeineLevel: caf,
      lTheanineLevel: lThea,
      profile,
      stimulationLevel,
      relaxationLevel,
      ratio: lThea > 0 ? (caf / lThea).toFixed(2) : 'N/A',
      description: this._generateCompoundDescription(caf, lThea, profile),
      effects
    };
  }

  /**
   * Generate a human-readable description for a flavor
   * @private
   */
  static _generateFlavorDescription(flavorData) {
    if (!flavorData) return null;

    const effects = Object.entries(flavorData.effects || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([effect]) => effect)
      .join(' and ');

    if (!effects) return null;

    return `${flavorData.flavor || 'This flavor'} promotes ${effects} experiences.`;
  }

  /**
   * Generate a human-readable description for compound profile
   * @private
   */
  static _generateCompoundDescription(caffeine, lTheanine, profile) {
    const descriptions = {
      'Very High L-Theanine':
        `Very high L-Theanine (${lTheanine.toFixed(1)}/10) with moderate caffeine (${caffeine.toFixed(1)}/10). Creates a smooth, calming experience with mental clarity.`,
      'High L-Theanine':
        `High L-Theanine (${lTheanine.toFixed(1)}/10) with moderate caffeine (${caffeine.toFixed(1)}/10). Provides relaxation and focus balance.`,
      'Very High Caffeine':
        `Very high caffeine (${caffeine.toFixed(1)}/10) with low L-Theanine (${lTheanine.toFixed(1)}/10). Delivers intense stimulation with alertness.`,
      'High Caffeine':
        `High caffeine (${caffeine.toFixed(1)}/10) with low L-Theanine (${lTheanine.toFixed(1)}/10). Provides stimulating, energizing effects.`,
      'Moderate Caffeine':
        `Moderate caffeine (${caffeine.toFixed(1)}/10) with low L-Theanine (${lTheanine.toFixed(1)}/10). Offers gentle stimulation and focus.`,
      'Balanced': `Balanced caffeine (${caffeine.toFixed(1)}/10) and L-Theanine (${lTheanine.toFixed(1)}/10). Creates harmonious, well-rounded effects.`
    };

    return descriptions[profile] || `${profile} compound profile.`;
  }

  /**
   * Get elevation level name from actual GeographicalDescriptors
   * @private
   */
  static _getElevationLevelName(altitude) {
    // Find matching elevation level from descriptors
    for (const [levelName, levelData] of Object.entries(elevationLevels)) {
      if (altitude >= levelData.min && altitude < levelData.max) {
        return levelName;
      }
    }
    return 'veryHigh';
  }

  /**
   * Get temperature level from actual GeographicalDescriptors (scaled to prevent dominance)
   * @private
   */
  static _getTemperatureLevel(celsius) {
    // Find matching temperature level from descriptors
    for (const [levelName, levelData] of Object.entries(temperatureLevels)) {
      if (celsius >= levelData.min && celsius < levelData.max) {
        return {
          name: levelName,
          description: levelData.description,
          effects: this._scaleEffects(levelData.effects)
        };
      }
    }

    // Fallback to veryHigh if no match
    const veryHighLevel = temperatureLevels.veryHigh;
    return {
      name: 'veryHigh',
      description: veryHighLevel.description,
      effects: this._scaleEffects(veryHighLevel.effects)
    };
  }

  /**
   * Get humidity level from actual GeographicalDescriptors (scaled to prevent dominance)
   * @private
   */
  static _getHumidityLevel(percent) {
    // Find matching humidity level from descriptors
    for (const [levelName, levelData] of Object.entries(humidityLevels)) {
      if (percent >= levelData.min && percent < levelData.max) {
        return {
          name: levelName,
          description: levelData.description,
          effects: this._scaleEffects(levelData.effects)
        };
      }
    }

    // Fallback to veryHigh if no match
    const veryHighLevel = humidityLevels.veryHigh;
    return {
      name: 'veryHigh',
      description: veryHighLevel.description,
      effects: this._scaleEffects(veryHighLevel.effects)
    };
  }

  /**
   * Get solar radiation level from actual GeographicalDescriptors (scaled to prevent dominance)
   * @private
   */
  static _getSolarLevel(wattPerM2) {
    // Find matching solar radiation level from descriptors
    for (const [levelName, levelData] of Object.entries(solarRadiationLevels)) {
      if (wattPerM2 >= levelData.min && wattPerM2 < levelData.max) {
        return {
          name: levelName,
          description: levelData.description,
          effects: this._scaleEffects(levelData.effects)
        };
      }
    }

    // Fallback to veryHigh if no match
    const veryHighLevel = solarRadiationLevels.veryHigh;
    return {
      name: 'veryHigh',
      description: veryHighLevel.description,
      effects: this._scaleEffects(veryHighLevel.effects)
    };
  }

  /**
   * Get latitude zone name
   * @private
   */
  static _getLatitudeZoneName(absLatitude) {
    if (absLatitude < 15) return 'tropical';
    if (absLatitude < 23.5) return 'subtropicalLow';
    if (absLatitude < 30) return 'subtropicalHigh';
    if (absLatitude < 45) return 'temperate';
    return 'boreal';
  }

  /**
   * Scale geography effects to prevent them from dominating
   * Descriptors have values like { calming: 2.0 } which are too strong when
   * applied at 2.0x weight alongside tea type (2.5x) and compounds (2.0-2.8x)
   * @private
   */
  static _scaleEffects(effects) {
    if (!effects || typeof effects !== 'object') {
      return effects;
    }
    const scaled = {};
    for (const [effect, value] of Object.entries(effects)) {
      scaled[effect] = value * GEOGRAPHY_EFFECT_SCALE;
    }
    return scaled;
  }

  /**
   * Default values for missing data - using actual descriptors (scaled)
   * @private
   */
  static _getDefaultAltitudeData() {
    const mediumData = elevationLevels.medium;
    return {
      level: 'medium',
      description: `${mediumData.description} (assumed)`,
      effects: this._scaleEffects(mediumData.effects)
    };
  }

  static _getDefaultTemperatureData() {
    const moderateData = temperatureLevels.moderate;
    return {
      level: 'moderate',
      description: `${moderateData.description} (assumed)`,
      effects: this._scaleEffects(moderateData.effects)
    };
  }

  static _getDefaultHumidityData() {
    const moderateData = humidityLevels.moderate;
    return {
      level: 'moderate',
      description: `${moderateData.description} (assumed)`,
      effects: this._scaleEffects(moderateData.effects)
    };
  }

  static _getDefaultSolarData() {
    const moderateData = solarRadiationLevels.moderate;
    return {
      level: 'moderate',
      description: `${moderateData.description} (assumed)`,
      effects: this._scaleEffects(moderateData.effects)
    };
  }

  static _getDefaultCompoundProfile() {
    return {
      profile: 'Balanced',
      stimulationLevel: 'Moderate',
      relaxationLevel: 'Moderate',
      description: 'Balanced compound profile (assumed)',
      effects: { harmonizing: 1, focusing: 0.5 }
    };
  }
}

export default NormalizationDescriptorService;
