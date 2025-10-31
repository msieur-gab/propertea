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
        effects: elevLevel.effects || {},
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
   * Get elevation level name
   * @private
   */
  static _getElevationLevelName(altitude) {
    if (altitude < 300) return 'veryLow';
    if (altitude < 600) return 'low';
    if (altitude < 1200) return 'medium';
    if (altitude < 1800) return 'high';
    return 'veryHigh';
  }

  /**
   * Get temperature level
   * @private
   */
  static _getTemperatureLevel(celsius) {
    if (celsius < 10)
      return {
        name: 'veryLow',
        description: 'Very cool climate promoting high L-Theanine content',
        effects: { calming: 0.3, restorative: 0.2, focusing: 0.1 }
      };
    if (celsius < 16)
      return {
        name: 'low',
        description: 'Cool climate creating delicate, aromatic characteristics',
        effects: { calming: 0.2, restorative: 0.2, elevating: 0.15 }
      };
    if (celsius < 22)
      return {
        name: 'moderate',
        description: 'Moderate temperature creating balanced tea characteristics',
        effects: { harmonizing: 0.3, elevating: 0.3, focusing: 0.1 }
      };
    if (celsius < 28)
      return {
        name: 'high',
        description: 'Warm climate producing stronger flavors and tannins',
        effects: { energizing: 0.3, focusing: 0.2, grounding: 0.1 }
      };
    return {
      name: 'veryHigh',
      description: 'Very warm climate promoting rapid growth and bold characteristics',
      effects: { energizing: 0.4, grounding: 0.3, comforting: 0.1 }
    };
  }

  /**
   * Get humidity level
   * @private
   */
  static _getHumidityLevel(percent) {
    if (percent < 40)
      return {
        name: 'veryLow',
        description: 'Dry climate causing stressed plant growth',
        effects: { energizing: 0.2, focusing: 0.2 }
      };
    if (percent < 55)
      return {
        name: 'low',
        description: 'Low humidity creating pronounced flavors',
        effects: { energizing: 0.15, focusing: 0.1 }
      };
    if (percent < 70)
      return {
        name: 'moderate',
        description: 'Moderate humidity supporting balanced development',
        effects: { harmonizing: 0.2, elevating: 0.1 }
      };
    if (percent <= 85)
      return {
        name: 'high',
        description: 'High humidity with mist effect supporting amino acid development',
        effects: { elevating: 0.3, harmonizing: 0.2, focusing: 0.15 }
      };
    return {
      name: 'veryHigh',
      description: 'Very high humidity creating smooth, balanced tea characteristics',
      effects: { calming: 0.2, restorative: 0.2, harmonizing: 0.15 }
    };
  }

  /**
   * Get solar radiation level
   * @private
   */
  static _getSolarLevel(wattPerM2) {
    if (wattPerM2 < 130)
      return {
        name: 'veryLow',
        description: 'Low sun exposure preserving delicate compounds',
        effects: { calming: 0.2, restorative: 0.15, focusing: 0.1 }
      };
    if (wattPerM2 < 170)
      return {
        name: 'low',
        description: 'Reduced sun exposure developing subtle complexity',
        effects: { elevating: 0.2, harmonizing: 0.15, calming: 0.1 }
      };
    if (wattPerM2 < 210)
      return {
        name: 'moderate',
        description: 'Balanced sun exposure creating well-developed flavors',
        effects: { harmonizing: 0.2, elevating: 0.2, focusing: 0.1 }
      };
    if (wattPerM2 <= 250)
      return {
        name: 'high',
        description: 'High sun exposure increasing catechin development',
        effects: { energizing: 0.2, focusing: 0.15, grounding: 0.1 }
      };
    return {
      name: 'veryHigh',
      description: 'Very high sun exposure producing bold, robust characteristics',
      effects: { energizing: 0.3, grounding: 0.2, elevating: 0.1 }
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
   * Default values for missing data
   * @private
   */
  static _getDefaultAltitudeData() {
    return {
      level: 'medium',
      description: 'Medium elevation (assumed)',
      effects: { harmonizing: 2.0, focusing: 1.5, elevating: 1.0 }
    };
  }

  static _getDefaultTemperatureData() {
    return {
      level: 'moderate',
      description: 'Moderate temperature (assumed)',
      effects: { harmonizing: 0.3, elevating: 0.3, focusing: 0.1 }
    };
  }

  static _getDefaultHumidityData() {
    return {
      level: 'moderate',
      description: 'Moderate humidity (assumed)',
      effects: { harmonizing: 0.2, elevating: 0.1 }
    };
  }

  static _getDefaultSolarData() {
    return {
      level: 'moderate',
      description: 'Moderate solar radiation (assumed)',
      effects: { harmonizing: 0.2, elevating: 0.2, focusing: 0.1 }
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
