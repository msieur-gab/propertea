/**
 * TeaModel - Standardized input for all calculators
 *
 * Purpose: Single source of truth for tea data
 * Used by: All calculators
 * No dependencies on: EffectService, other calculators
 */
export class TeaModel {
  constructor(rawData) {
    // Identity
    this.name = rawData.name || 'Unknown Tea';
    this.type = rawData.type || 'green';

    // Compound profile (calculated once, used by many)
    this.compounds = {
      caffeine: rawData.caffeine || 5,
      lTheanine: rawData.lTheanine || 5,
      ratio: (rawData.caffeine || 5) / (rawData.lTheanine || 5),
      catechins: rawData.catechins || 0,
      polyphenols: rawData.polyphenols || 0
    };

    // Flavor (primary driver for FoodMatcher)
    this.flavor = {
      primary: Array.isArray(rawData.flavor?.primary) ?
        rawData.flavor.primary : [],
      secondary: Array.isArray(rawData.flavor?.secondary) ?
        rawData.flavor.secondary : [],
      intensity: rawData.flavor?.intensity || 'moderate',
      aroma: Array.isArray(rawData.flavor?.aroma) ?
        rawData.flavor.aroma : []
    };

    // Geography (primary driver for TimeCalculator, SeasonCalculator)
    this.geography = {
      origin: rawData.origin || 'Unknown',
      altitude: rawData.altitude || 1000,
      latitude: rawData.latitude || 0,
      temperature: rawData.temperature || 15,
      humidity: rawData.humidity || 70,
      solarRadiation: rawData.solarRadiation || 150,
      harvestSeason: rawData.harvestSeason || 'Spring'
    };

    // Processing (primary driver for BrewingCalculator)
    this.processing = {
      oxidationLevel: rawData.oxidationLevel || 30,
      roastLevel: rawData.roastLevel || 'light',
      methods: Array.isArray(rawData.methods) ? rawData.methods : [],
      harvestTime: rawData.harvestTime || 'morning'
    };

    // Leaf characteristics (used by BrewingCalculator)
    this.leaf = {
      size: rawData.leafSize || 'medium',
      wholeness: rawData.wholeness || 80,
      fragmentation: rawData.fragmentation || 20
    };
  }

  // Validation
  isValid() {
    return this.name && this.type && this.compounds.caffeine >= 0;
  }

  // Helper: get compound profile label
  getCompoundProfile() {
    const ratio = this.compounds.ratio;
    const caffeine = this.compounds.caffeine;

    if (ratio > 2 && caffeine > 7) return 'Intense & Sharp';
    if (ratio > 1.5 && caffeine > 6) return 'Focused & Energized';
    if (ratio >= 0.7 && ratio <= 1.5) return 'Balanced';
    if (ratio < 0.7 && caffeine < 4) return 'Deeply Calm';
    return 'Balanced';
  }
}
