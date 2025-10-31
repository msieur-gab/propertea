/**
 * Descriptors Index
 *
 * Central export for all reference descriptors.
 * These files define the authoritative mappings for how tea characteristics map to effects.
 *
 * Files:
 * - FlavorInfluences.js: Maps flavor notes to effects with intensity
 * - ProcessingInfluences.js: Maps processing methods to effects
 * - TeaTypeDescriptors.js: Tea type descriptions and seasonal alignments
 * - GeographicalDescriptors.js: Geographic/climate effects and descriptions
 * - EffectCombinations.js: Effect interaction rules
 * - EffectMapping.js: Effect name standardization and aliases
 * - SeasonalFactors.js: Seasonal mood and effect alignments
 */

export { flavorInfluences, flavorCategoryToPrimaryEffects, flavorToPrimaryEffects } from './FlavorInfluences.js';
export { processingInfluences, processingToPrimaryEffectMap } from './ProcessingInfluences.js';
export { teaTypeDescriptors } from './TeaTypeDescriptors.js';
export { elevationLevels, latitudeZones } from './GeographicalDescriptors.js';
export { effectCombinations } from './EffectCombinations.js';
export { effectNameSubstitution } from './EffectMapping.js';
export { seasonalFactors } from './SeasonalFactors.js';

export default {
  flavorInfluences: (await import('./FlavorInfluences.js')).flavorInfluences,
  processingInfluences: (await import('./ProcessingInfluences.js')).processingInfluences,
  teaTypeDescriptors: (await import('./TeaTypeDescriptors.js')).teaTypeDescriptors,
  elevationLevels: (await import('./GeographicalDescriptors.js')).elevationLevels,
  seasonalFactors: (await import('./SeasonalFactors.js')).seasonalFactors,
};
