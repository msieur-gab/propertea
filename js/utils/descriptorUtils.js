/**
 * Descriptor Utilities
 * 
 * Utility functions to leverage the descriptor registry without modifying existing code.
 * These functions maintain the same signatures as the original helper functions but
 * use the registry for more consistent results.
 */

import registry from './descriptorRegistry.js';

/**
 * Normalize an energy term to ensure consistent values across components
 * @param {string} term - Energy term like 'cooling', 'warming', etc.
 * @returns {string} Normalized term from the registry
 */
export function normalizeEnergyTerm(term) {
  const match = registry.findBestMatch('energyTerms', term);
  return match ? match.term : 'neutral';
}

/**
 * Get the numerical value of an energy term for calculations
 * @param {string} term - Energy term to convert
 * @returns {number} Numerical value (-1 to 2)
 */
export function getEnergyValue(term) {
  const match = registry.findBestMatch('energyTerms', term);
  return match ? match.value : 0; // Default to neutral
}

/**
 * Normalize an intensity level term to ensure consistency
 * @param {string} level - Intensity term like 'very low', 'moderate', etc.
 * @returns {string} Normalized level from the registry
 */
export function normalizeIntensityLevel(level) {
  const match = registry.findBestMatch('intensityLevels', level);
  return match ? match.level : 'moderate';
}

/**
 * Get the numerical value of an intensity level for calculations
 * @param {string} level - Intensity level to convert
 * @returns {number} Numerical value (0-5)
 */
export function getIntensityValue(level) {
  const match = registry.findBestMatch('intensityLevels', level);
  return match ? match.value : 3; // Default to moderate
}

/**
 * Lookup a processing method from the registry for consistent matching
 * Same signature as getMethodData() in ProcessingCalculator
 * @param {string} methodName - Processing method name
 * @returns {object|null} Processing method data or null if not found
 */
export function getProcessingMethod(methodName) {
  return registry.findBestMatch('processingMethods', methodName);
}

/**
 * Check if a processing method exists in the registry
 * @param {string} methodName - Processing method to check
 * @returns {boolean} True if method exists
 */
export function isValidProcessingMethod(methodName) {
  return !!registry.findBestMatch('processingMethods', methodName);
}

/**
 * Get flavor data from the registry for consistent matching
 * Same signature as getFlavorData() in FlavorCalculator
 * @param {string} flavorName - Flavor name to look up
 * @returns {object|null} Flavor data or null if not found
 */
export function getFlavorData(flavorName) {
  return registry.findBestMatch('flavorCategories', flavorName);
}

/**
 * Check if a flavor belongs to a specific category
 * @param {string} flavor - Flavor to check
 * @param {string} category - Category name
 * @returns {boolean} True if flavor belongs to category
 */
export function isFlavorInCategory(flavor, category) {
  const categoryData = registry.findBestMatch('flavorCategories', category);
  if (!categoryData || !categoryData.examples) return false;
  
  const normalizedFlavor = flavor.toLowerCase().trim();
  
  // Direct match on category
  if (normalizedFlavor === category.toLowerCase().trim()) return true;
  
  // Check examples list
  return categoryData.examples.some(example => 
    example.toLowerCase().includes(normalizedFlavor) || 
    normalizedFlavor.includes(example.toLowerCase())
  );
}

/**
 * Get a list of related flavors for a given flavor
 * @param {string} flavor - Flavor to find related flavors for
 * @returns {string[]} Array of related flavors
 */
export function getRelatedFlavors(flavor) {
  // Try to find the category this flavor belongs to
  for (const [category, data] of registry.flavorCategories.entries()) {
    if (isFlavorInCategory(flavor, category)) {
      return (data.examples || []).filter(example => example !== flavor);
    }
  }
  return [];
}

/**
 * Normalize a season name for consistent usage
 * @param {string} season - Season name to normalize
 * @returns {string} Normalized season name from registry
 */
export function normalizeSeasonName(season) {
  const match = registry.findBestMatch('seasonalTerms', season);
  return match ? match.season : season;
}

/**
 * Get the numerical value of a season for ordering/comparison
 * @param {string} season - Season name to get value for
 * @returns {number} Numerical value (0-11)
 */
export function getSeasonValue(season) {
  const match = registry.findBestMatch('seasonalTerms', season);
  return match ? match.value : -1; // -1 indicates unknown
}

/**
 * Get the detailed information about a compound profile
 * @param {string} profile - Compound profile name 
 * @returns {object|null} Profile data or null if not found
 */
export function getCompoundProfile(profile) {
  return registry.findBestMatch('compoundProfiles', profile);
}

/**
 * Normalize a compound profile name for consistent usage
 * @param {string} profile - Profile name to normalize
 * @returns {string} Normalized profile name
 */
export function normalizeCompoundProfile(profile) {
  const match = registry.findBestMatch('compoundProfiles', profile);
  return match ? match.profile : 'balanced & focused'; // Default to balanced
}

/**
 * Check if a tea type exists in the registry
 * @param {string} type - Tea type to check
 * @returns {boolean} True if tea type exists
 */
export function isValidTeaType(type) {
  return !!registry.findBestMatch('teaTypes', type);
}

/**
 * Get information about a tea type
 * @param {string} type - Tea type name
 * @returns {object|null} Tea type data or null if not found
 */
export function getTeaTypeInfo(type) {
  return registry.findBestMatch('teaTypes', type);
}

/**
 * Enhanced version of original categorization function
 * Uses registry data when available but falls back to original behavior
 * 
 * @param {number} value - Value to categorize 
 * @param {string} categoryType - Type of category ('altitude', 'humidity', etc)
 * @param {object} originalCategories - Original categories object (fallback)
 * @returns {string} Category name
 */
export function categorizeMeasurement(value, categoryType, originalCategories) {
  if (typeof value !== 'number' || isNaN(value)) return "Unknown";
  
  // Try to use registry data if available
  const categoryMap = {
    'altitude': 'elevationLevels',
    'humidity': 'humidityLevels',
    'temperature': 'temperatureLevels',
    'solarRadiation': 'solarRadiationLevels',
    'latitude': 'latitudeZones'
  };
  
  const registryCategory = categoryMap[categoryType];
  
  if (registryCategory && registry[registryCategory]) {
    // Registry categories would be implemented here
    // For now, fall back to original logic
  }
  
  // Fall back to original logic
  for (const [category, range] of Object.entries(originalCategories)) {
    if (range && typeof range.min === 'number' && typeof range.max === 'number') {
      if (value >= range.min && value < range.max) {
        return category;
      }
      if (range.max === Infinity && value >= range.min) {
        return category;
      }
    }
  }
  
  return "Outside Defined Ranges";
}

/**
 * Generate documentation from the registry
 * @returns {object} Documentation object
 */
export function getDescriptorDocumentation() {
  return registry.generateDocumentation();
}

/**
 * Detect terminology mismatches in the system
 * @returns {Promise<object>} Mismatch report
 */
export async function detectTerminologyMismatches() {
  return await registry.detectTerminologyMismatches();
}

/**
 * Generate a diagram of flavor taxonomy
 * @returns {string} Mermaid diagram code
 */
export function generateFlavorTaxonomyDiagram() {
  return registry.generateFlavorTaxonomyDiagram();
}

// Export registry for direct access if needed
export { registry };