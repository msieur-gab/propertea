/**
 * ReferenceDescriptorService.js
 *
 * Centralizes access to all reference descriptor files (_ref/ folder).
 * Provides authoritative mappings for:
 * - Flavor influences and effects
 * - Processing method influences and effects
 * - Geographic/climate characteristics and effects
 * - Tea type descriptors and seasonal alignments
 * - Seasonal factors and mood alignments
 * - Effect combinations and complementary effects
 *
 * This is the single source of truth for how tea characteristics map to effects.
 * All calculation services (EffectService, etc.) should use this service.
 */

// Import all reference descriptors from backend/src/descriptors/
import flavorInfluencesModule from '../descriptors/FlavorInfluences.js';
import processingInfluencesModule from '../descriptors/ProcessingInfluences.js';
import teaTypeDescriptorsModule from '../descriptors/TeaTypeDescriptors.js';
import geographicalDescriptorsModule from '../descriptors/GeographicalDescriptors.js';

const { flavorInfluences, flavorCategoryToPrimaryEffects, flavorToPrimaryEffects } = flavorInfluencesModule;
const { processingInfluences, processingToPrimaryEffectMap } = processingInfluencesModule;
const { teaTypeDescriptors } = teaTypeDescriptorsModule;
const { elevationLevels, latitudeZones } = geographicalDescriptorsModule;

export class ReferenceDescriptorService {
  /**
   * Get all flavor influences
   * @returns {Object} Complete flavorInfluences object from FlavorInfluences.js
   */
  static getFlavorInfluences() {
    return flavorInfluences;
  }

  /**
   * Get effects for a specific flavor
   * @param {string} flavorName - Flavor name (e.g., "orchid", "jasmine")
   * @returns {Object|null} Flavor data with effects, intensity, and descriptions
   */
  static getFlavorEffect(flavorName) {
    if (!flavorName) return null;

    const normalized = flavorName.toLowerCase().trim();

    // Search across all flavor categories
    for (const [category, flavors] of Object.entries(flavorInfluences)) {
      if (flavors[normalized]) {
        return {
          flavor: normalized,
          category,
          ...flavors[normalized]
        };
      }
    }

    return null;
  }

  /**
   * Get all processing method influences
   * @returns {Object} Complete processingInfluences object from ProcessingInfluences.js
   */
  static getProcessingInfluences() {
    return processingInfluences;
  }

  /**
   * Get effects for a specific processing method
   * @param {string} methodName - Processing method name (e.g., "heavy-roast", "fermented")
   * @returns {Object|null} Processing data with effects, intensity, and descriptions
   */
  static getProcessingEffect(methodName) {
    if (!methodName) return null;

    // Normalize: convert spaces to hyphens, lowercase
    const normalized = methodName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    return processingInfluences[normalized] || null;
  }

  /**
   * Get all geographic/climate level definitions
   * @returns {Object} Elevation and latitude zone definitions
   */
  static getGeographicLevels() {
    return {
      elevation: elevationLevels,
      latitude: latitudeZones
    };
  }

  /**
   * Get elevation effects for a specific altitude
   * @param {number} altitudeMeters - Altitude in meters
   * @returns {Object} Elevation level data with effects and descriptions
   */
  static getElevationLevel(altitudeMeters) {
    if (altitudeMeters === undefined || altitudeMeters === null) {
      return elevationLevels.medium; // Default to medium
    }

    if (altitudeMeters < 300) return elevationLevels.veryLow;
    if (altitudeMeters < 600) return elevationLevels.low;
    if (altitudeMeters < 1200) return elevationLevels.medium;
    if (altitudeMeters < 1800) return elevationLevels.high;
    return elevationLevels.veryHigh;
  }

  /**
   * Get latitude zone effects for a specific latitude
   * @param {number} latitudeDegrees - Latitude in degrees
   * @returns {Object} Latitude zone data with effects and descriptions
   */
  static getLatitudeZone(latitudeDegrees) {
    if (latitudeDegrees === undefined || latitudeDegrees === null) {
      return latitudeZones.subtropicalHigh; // Default to subtropical
    }

    const absLat = Math.abs(latitudeDegrees);

    if (absLat < 15) return latitudeZones.tropical;
    if (absLat < 23.5) return latitudeZones.subtropicalLow;
    if (absLat < 30) return latitudeZones.subtropicalHigh;
    if (absLat < 45) return latitudeZones.temperate;
    return latitudeZones.boreal;
  }

  /**
   * Get all tea type descriptors and seasonal information
   * @returns {Object} Tea type descriptors from TeaTypeDescriptors.js
   */
  static getTeaTypeDescriptors() {
    return teaTypeDescriptors;
  }

  /**
   * Get seasonal description for a specific tea type and season
   * @param {string} teaType - Tea type (e.g., "green", "oolong")
   * @param {string} season - Season (e.g., "spring", "summer")
   * @returns {string|null} Seasonal description for the tea type
   */
  static getSeasonalDescription(teaType, season) {
    const normalized = teaType.toLowerCase();
    const seasonNorm = season.toLowerCase();

    const characteristics = teaTypeDescriptors?.seasonalCharacteristics?.[normalized];
    if (!characteristics) return null;

    return characteristics[seasonNorm] || null;
  }

  /**
   * Get general description for a tea type
   * @param {string} teaType - Tea type (e.g., "green", "oolong")
   * @returns {string|null} General description of the tea type
   */
  static getTeaTypeDescription(teaType) {
    const normalized = teaType.toLowerCase();
    return teaTypeDescriptors?.generalDescriptions?.[normalized] || null;
  }

  /**
   * Map a dataset flavor string to reference flavor key(s)
   * Handles common variations in flavor naming
   *
   * @param {string} flavorString - Flavor from dataset (e.g., "creamy", "buttery", "orchid")
   * @returns {Array<string>} Array of matching reference flavor keys
   */
  static mapFlavorToReference(flavorString) {
    if (!flavorString) return [];

    const normalized = flavorString.toLowerCase().trim();

    // Direct match
    if (this.getFlavorEffect(normalized)) {
      return [normalized];
    }

    // Handle common aliases and variations
    const aliases = {
      'creamy': ['vanilla'], // Creamy aligns with vanilla effects
      'buttery': ['vanilla', 'chocolate'], // Buttery is comforting like chocolate
      'sweet': ['caramelized', 'vanilla'], // Sweet can be caramelized or vanilla
      'lightly sweet': ['vanilla'], // Light sweetness
      'honey': ['caramelized'], // Honey-like sweetness
      'mineral': ['minerals'], // Mineral water notes
      'citrus': ['citrus'], // Fruity-citrus
      'bright': ['citrus'], // Bright citrus
      'grassy': ['leafy'], // Vegetal-grass
      'green': ['leafy'], // Vegetal-green
      'roasty': ['smoky'], // Roasted-smoky
      'nutty': ['nuts'], // Nutty-nuts
      'toasty': ['toasted'], // Toasty-toasted
      'woody': ['resinous', 'fresh'], // Woody notes
      'earthy': ['soil', 'aged'], // Earthy soil/aged
      'leather': ['aged'], // Aged-leather
      'dark chocolate': ['chocolate'], // Sweet-chocolate
    };

    if (aliases[normalized]) {
      return aliases[normalized];
    }

    return [];
  }

  /**
   * Map a dataset processing method to reference processing key(s)
   * Handles common variations in processing method naming
   *
   * @param {string} processingString - Processing method from dataset
   * @returns {Array<string>} Array of matching reference processing keys
   */
  static mapProcessingToReference(processingString) {
    if (!processingString) return [];

    const normalized = processingString.toLowerCase().trim();

    // Direct match (with normalization: spaces to hyphens)
    const hyphenated = normalized.replace(/\s+/g, '-');
    if (this.getProcessingEffect(hyphenated)) {
      return [hyphenated];
    }

    // Handle common aliases and variations
    const aliases = {
      'light roast': ['light-roast'],
      'medium roast': ['medium-roast'],
      'heavy roast': ['heavy-roast'],
      'charcoal roast': ['charcoal-roasted'],
      'charcoal roasted': ['charcoal-roasted'],
      'light oxidation': ['withered'],
      'medium oxidation': ['partial-oxidation'],
      'high oxidation': ['full-oxidation'],
      'full oxidation': ['full-oxidation'],
      'fermented': ['fermented'],
      'aged': ['aged'],
      'rolled': ['minimal-processing'], // Rolled green teas have minimal oxidation
      'strip-style': ['minimal-processing'], // Oolong rolling style - minimal additional effect
      'pan-fired': ['pan-fired'],
      'steamed': ['steamed'],
      'sun-dried': ['sun-dried'],
      'killed green': ['kill-green'],
      'kill-green': ['kill-green'],
      'gaba processing': ['gaba-processed'],
    };

    if (aliases[normalized]) {
      return aliases[normalized];
    }

    return [];
  }

  /**
   * Get comprehensive flavor data with effects
   * Useful for building detailed reasoning
   *
   * @param {string} flavorName - Flavor name
   * @returns {Object|null} Flavor with effects, description, and intensity
   */
  static getFlavorDetails(flavorName) {
    const flavorData = this.getFlavorEffect(flavorName);
    if (!flavorData) return null;

    return {
      flavor: flavorName,
      category: flavorData.category,
      effects: flavorData.effects || {},
      intensity: flavorData.intensity || 0,
      associatedFlavors: flavorData.associatedFlavors || flavorData.flavors || []
    };
  }

  /**
   * Get comprehensive processing data with effects
   * Useful for building detailed reasoning
   *
   * @param {string} processingMethod - Processing method name
   * @returns {Object|null} Processing method with effects, description, intensity, and category
   */
  static getProcessingDetails(processingMethod) {
    const processData = this.getProcessingEffect(processingMethod);
    if (!processData) return null;

    return {
      method: processingMethod,
      effects: processData.effects || {},
      intensity: processData.intensity || 0,
      category: processData.category || 'unknown',
      description: processData.description || null
    };
  }

  /**
   * Get comprehensive geographic data with effects
   * @param {number} altitude - Altitude in meters
   * @returns {Object} Elevation level with effects and description
   */
  static getGeographicDetails(altitude) {
    const elevLevel = this.getElevationLevel(altitude);
    return {
      altitude,
      level: this._getElevationLevelName(altitude),
      description: elevLevel.description,
      effects: elevLevel.effects || {},
      range: { min: elevLevel.min, max: elevLevel.max }
    };
  }

  /**
   * Helper: Get elevation level name (veryLow, low, medium, high, veryHigh)
   * @private
   */
  static _getElevationLevelName(altitude) {
    if (altitude < 300) return 'veryLow';
    if (altitude < 600) return 'low';
    if (altitude < 1200) return 'medium';
    if (altitude < 1800) return 'high';
    return 'veryHigh';
  }
}

export default ReferenceDescriptorService;
