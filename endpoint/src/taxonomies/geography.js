/**
 * geography.js
 *
 * Unified taxonomy for geographic factors affecting tea characteristics
 * Elevation, latitude, humidity, temperature, and solar radiation classifications
 *
 * ID Convention: UPPERCASE_WITH_UNDERSCORES
 */

export class GeographyTaxonomy {
  /**
   * Elevation Levels
   * Impact on flavor complexity, sweetness, and amino acids
   */
  static ELEVATIONS = {
    ELEVATION_VERY_LOW: {
      id: 'ELEVATION_VERY_LOW',
      displayName: 'Very Low',
      aliases: ['very-low', 'very low', '<300m'],
      range: { min: 0, max: 300 },
      description: 'Very low elevation gardens (<300m) tend towards robust teas with bold flavors and higher astringency',
      flavorInfluence: ['bold flavors', 'higher astringency'],
      mouthFeelInfluence: ['fuller body', 'more robust'],
      compoundTendency: ['potentially higher caffeine', 'faster growth cycle']
    },
    ELEVATION_LOW: {
      id: 'ELEVATION_LOW',
      displayName: 'Low',
      aliases: ['low', '300-600m'],
      range: { min: 300, max: 600 },
      description: 'Low elevation teas (300-600m) often have stronger flavors with moderate complexity',
      flavorInfluence: ['strong flavors', 'moderate complexity'],
      mouthFeelInfluence: ['good body'],
      compoundTendency: []
    },
    ELEVATION_MEDIUM: {
      id: 'ELEVATION_MEDIUM',
      displayName: 'Medium',
      aliases: ['medium', '600-1200m'],
      range: { min: 600, max: 1200 },
      description: 'Medium elevation teas (600-1200m) typically balance complexity and strength',
      flavorInfluence: ['balanced complexity', 'developed flavors'],
      mouthFeelInfluence: ['medium body', 'smoother texture'],
      compoundTendency: []
    },
    ELEVATION_HIGH: {
      id: 'ELEVATION_HIGH',
      displayName: 'High',
      aliases: ['high', '1200-1800m'],
      range: { min: 1200, max: 1800 },
      description: 'High elevation teas (1200-1800m) are known for complex, bright flavors and refined characteristics due to slower growth',
      flavorInfluence: ['complex aromatics', 'brighter notes', 'enhanced sweetness'],
      mouthFeelInfluence: ['smoother texture', 'more delicate body'],
      compoundTendency: ['increases amino acids (L-theanine)', 'potentially lower caffeine']
    },
    ELEVATION_VERY_HIGH: {
      id: 'ELEVATION_VERY_HIGH',
      displayName: 'Very High',
      aliases: ['very-high', 'very high', '>1800m'],
      range: { min: 1800, max: Infinity },
      description: 'Very high elevation teas (>1800m) grow slowly, developing exceptional complexity, delicate aromas, and often higher sweetness',
      flavorInfluence: ['exceptional complexity', 'delicate aromas', 'subtle sweetness', 'lingering finish'],
      mouthFeelInfluence: ['very smooth texture', 'silky body'],
      compoundTendency: ['higher amino acids (L-theanine)', 'concentrated flavor compounds']
    }
  };

  /**
   * Latitude Zones
   * Climate zones affecting seasonal variation and growth patterns
   */
  static LATITUDES = {
    LATITUDE_TROPICAL: {
      id: 'LATITUDE_TROPICAL',
      displayName: 'Tropical',
      aliases: ['tropical', '0-15°'],
      range: { min: 0, max: 15 },
      description: 'Deep tropical zone (0-15°) teas grow year-round in warm, humid conditions, producing vibrant, rich flavors',
      flavorInfluence: ['vibrant flavors', 'rich character', 'potentially fruity notes'],
      mouthFeelInfluence: ['full body'],
      compoundTendency: ['faster growth', 'potentially higher yield']
    },
    LATITUDE_SUBTROPICAL_LOW: {
      id: 'LATITUDE_SUBTROPICAL_LOW',
      displayName: 'Subtropical (Lower)',
      aliases: ['subtropical-low', 'subtropical low', '15-23.5°'],
      range: { min: 15, max: 23.5 },
      description: 'Lower subtropical zone (15-23.5°) teas benefit from warm seasons and distinct (though mild) winters, creating balanced profiles',
      flavorInfluence: ['balanced profiles', 'good aromatic development'],
      mouthFeelInfluence: ['medium to full body'],
      compoundTendency: []
    },
    LATITUDE_SUBTROPICAL_HIGH: {
      id: 'LATITUDE_SUBTROPICAL_HIGH',
      displayName: 'Subtropical (Upper)',
      aliases: ['subtropical-high', 'subtropical high', '23.5-30°'],
      range: { min: 23.5, max: 30 },
      description: 'Upper subtropical zone (23.5-30°) teas experience more noticeable seasonal variations, contributing to complexity',
      flavorInfluence: ['good complexity', 'distinct seasonal notes'],
      mouthFeelInfluence: ['medium body'],
      compoundTendency: []
    },
    LATITUDE_TEMPERATE: {
      id: 'LATITUDE_TEMPERATE',
      displayName: 'Temperate',
      aliases: ['temperate', '30-45°'],
      range: { min: 30, max: 45 },
      description: 'Temperate zone (30-45°) teas have distinct seasons, leading to slower growth and often more delicate, nuanced flavors',
      flavorInfluence: ['delicate flavors', 'nuanced profiles', 'strong seasonal variation'],
      mouthFeelInfluence: ['lighter to medium body'],
      compoundTendency: ['slower growth concentrates compounds']
    },
    LATITUDE_SUBPOLAR: {
      id: 'LATITUDE_SUBPOLAR',
      displayName: 'Subpolar',
      aliases: ['subpolar', '45°+'],
      range: { min: 45, max: 90 },
      description: 'Subpolar zone (45°+) teas are very rare, growing in challenging conditions with short seasons, likely producing unique, hardy characteristics',
      flavorInfluence: ['unique characteristics'],
      mouthFeelInfluence: ['variable'],
      compoundTendency: ['slowest growth']
    }
  };

  /**
   * Humidity Levels
   * Impact on flavor concentration and plant stress
   */
  static HUMIDITIES = {
    HUMIDITY_VERY_LOW: {
      id: 'HUMIDITY_VERY_LOW',
      displayName: 'Very Low',
      aliases: ['very-low', 'very low', '<40%'],
      range: { min: 0, max: 40 },
      description: 'Very low humidity (<40%) can stress plants, potentially concentrating flavors but hindering optimal growth',
      flavorInfluence: ['concentrated flavors', 'potentially sharp notes'],
      mouthFeelInfluence: ['can increase dryness/astringency'],
      compoundTendency: []
    },
    HUMIDITY_LOW: {
      id: 'HUMIDITY_LOW',
      displayName: 'Low',
      aliases: ['low', '40-55%'],
      range: { min: 40, max: 55 },
      description: 'Low humidity (40-55%) can lead to more pronounced flavor intensity',
      flavorInfluence: ['pronounced intensity', 'clear profiles'],
      mouthFeelInfluence: [],
      compoundTendency: []
    },
    HUMIDITY_MODERATE: {
      id: 'HUMIDITY_MODERATE',
      displayName: 'Moderate',
      aliases: ['moderate', '55-70%'],
      range: { min: 55, max: 70 },
      description: 'Moderate humidity (55-70%) is often considered ideal for tea growth, balancing evaporation and nutrient uptake',
      flavorInfluence: ['balanced flavor development', 'optimal aromatic complexity'],
      mouthFeelInfluence: ['well-rounded body'],
      compoundTendency: ['optimal enzyme activity']
    },
    HUMIDITY_HIGH: {
      id: 'HUMIDITY_HIGH',
      displayName: 'High',
      aliases: ['high', '70-85%'],
      range: { min: 70, max: 85 },
      description: 'High humidity (70-85%) encourages lush growth and can enhance floral notes but may reduce astringency',
      flavorInfluence: ['enhanced floral notes', 'softer profiles', 'potentially vegetal'],
      mouthFeelInfluence: ['smoother mouthfeel'],
      compoundTendency: ['higher amino acids']
    },
    HUMIDITY_VERY_HIGH: {
      id: 'HUMIDITY_VERY_HIGH',
      displayName: 'Very High',
      aliases: ['very-high', 'very high', '>85%'],
      range: { min: 85, max: 100 },
      description: 'Very high humidity (>85%) can promote fungal growth and disease but create soft, sweet teas in healthy conditions',
      flavorInfluence: ['soft, sweet flavors', 'less astringency'],
      mouthFeelInfluence: ['very smooth, creamy'],
      compoundTendency: ['reduced caffeine, higher L-theanine']
    }
  };

  /**
   * Average Temperature Ranges
   * Annual average temperature classification affecting growth rate and flavor development
   */
  static TEMPERATURES = {
    TEMPERATURE_COLD: {
      id: 'TEMPERATURE_COLD',
      displayName: 'Cold',
      aliases: ['cold', '<10°C'],
      range: { min: -50, max: 10 },
      unit: 'celsius',
      description: 'Cold regions (<10°C avg) produce slow-growing, delicate teas with concentrated sweetness and amino acids',
      flavorInfluence: ['delicate flavors', 'exceptional sweetness', 'subtle notes'],
      mouthFeelInfluence: ['smooth, refined texture'],
      compoundTendency: ['very high L-theanine', 'lower caffeine', 'concentrated compounds']
    },
    TEMPERATURE_COOL: {
      id: 'TEMPERATURE_COOL',
      displayName: 'Cool',
      aliases: ['cool', '10-15°C'],
      range: { min: 10, max: 15 },
      unit: 'celsius',
      description: 'Cool regions (10-15°C avg) encourage gradual growth with balanced complexity and sweetness',
      flavorInfluence: ['complex flavors', 'good sweetness', 'nuanced profiles'],
      mouthFeelInfluence: ['well-balanced body'],
      compoundTendency: ['high L-theanine', 'moderate caffeine']
    },
    TEMPERATURE_MILD: {
      id: 'TEMPERATURE_MILD',
      displayName: 'Mild',
      aliases: ['mild', '15-20°C'],
      range: { min: 15, max: 20 },
      unit: 'celsius',
      description: 'Mild regions (15-20°C avg) provide ideal conditions for most tea growth with good flavor development',
      flavorInfluence: ['balanced complex flavors', 'good aromatic development'],
      mouthFeelInfluence: ['medium body, smooth'],
      compoundTendency: ['balanced L-theanine and caffeine', 'good overall compound profile']
    },
    TEMPERATURE_WARM: {
      id: 'TEMPERATURE_WARM',
      displayName: 'Warm',
      aliases: ['warm', '20-25°C'],
      range: { min: 20, max: 25 },
      unit: 'celsius',
      description: 'Warm regions (20-25°C avg) support faster growth with vibrant, fruity flavors but potentially less complexity',
      flavorInfluence: ['vibrant flavors', 'fruity notes', 'bold character'],
      mouthFeelInfluence: ['fuller body'],
      compoundTendency: ['higher caffeine', 'potentially lower amino acids']
    },
    TEMPERATURE_HOT: {
      id: 'TEMPERATURE_HOT',
      displayName: 'Hot',
      aliases: ['hot', '>25°C'],
      range: { min: 25, max: 60 },
      unit: 'celsius',
      description: 'Hot regions (>25°C avg) produce rapid growth with strong, robust flavors but may lack delicate aromatics',
      flavorInfluence: ['robust flavors', 'potentially astringent', 'bold character'],
      mouthFeelInfluence: ['fuller, potentially more astringent'],
      compoundTendency: ['very high caffeine', 'lower amino acids', 'faster growth']
    }
  };

  /**
   * Solar Radiation/Sun Exposure Levels
   * Average daily sun exposure affecting photosynthesis and flavor development
   * Measured in MJ/m²/day (megajoules per square meter per day)
   */
  static SOLAR_RADIATIONS = {
    SOLAR_RADIATION_LOW: {
      id: 'SOLAR_RADIATION_LOW',
      displayName: 'Low',
      aliases: ['low', 'shaded', '<10 MJ/m²/day'],
      range: { min: 0, max: 10 },
      unit: 'MJ/m²/day',
      description: 'Low sun exposure (<10 MJ/m²/day) in shaded or cloudy regions creates delicate, umami-rich teas with higher L-theanine',
      flavorInfluence: ['delicate flavors', 'enhanced umami', 'subtle sweetness'],
      mouthFeelInfluence: ['smooth, creamy mouthfeel'],
      compoundTendency: ['very high L-theanine', 'lower caffeine', 'enhanced amino acids']
    },
    SOLAR_RADIATION_MODERATE_LOW: {
      id: 'SOLAR_RADIATION_MODERATE_LOW',
      displayName: 'Moderate-Low',
      aliases: ['moderate-low', 'partially shaded', '10-15 MJ/m²/day'],
      range: { min: 10, max: 15 },
      unit: 'MJ/m²/day',
      description: 'Moderate-low sun exposure (10-15 MJ/m²/day) typical of high-altitude or frequently cloudy regions, supporting refined growth',
      flavorInfluence: ['complex flavors', 'good sweetness', 'balanced aromatics'],
      mouthFeelInfluence: ['smooth, balanced body'],
      compoundTendency: ['high L-theanine', 'moderate caffeine', 'good amino acid content']
    },
    SOLAR_RADIATION_MODERATE: {
      id: 'SOLAR_RADIATION_MODERATE',
      displayName: 'Moderate',
      aliases: ['moderate', 'dappled sun', '15-20 MJ/m²/day'],
      range: { min: 15, max: 20 },
      unit: 'MJ/m²/day',
      description: 'Moderate sun exposure (15-20 MJ/m²/day) provides ideal conditions for balanced flavor and health in most tea gardens',
      flavorInfluence: ['well-developed flavors', 'balanced complexity', 'good aromatics'],
      mouthFeelInfluence: ['medium-full body, smooth'],
      compoundTendency: ['balanced L-theanine and caffeine', 'optimal compound profile']
    },
    SOLAR_RADIATION_MODERATE_HIGH: {
      id: 'SOLAR_RADIATION_MODERATE_HIGH',
      displayName: 'Moderate-High',
      aliases: ['moderate-high', 'sunny', '20-25 MJ/m²/day'],
      range: { min: 20, max: 25 },
      unit: 'MJ/m²/day',
      description: 'Moderate-high sun exposure (20-25 MJ/m²/day) typical of sunny gardens, supporting vibrant flavor development',
      flavorInfluence: ['vibrant flavors', 'enhanced aromatics', 'fruity notes'],
      mouthFeelInfluence: ['fuller body'],
      compoundTendency: ['higher caffeine', 'increased catechins', 'potentially lower amino acids']
    },
    SOLAR_RADIATION_HIGH: {
      id: 'SOLAR_RADIATION_HIGH',
      displayName: 'High',
      aliases: ['high', 'very sunny', '>25 MJ/m²/day'],
      range: { min: 25, max: 100 },
      unit: 'MJ/m²/day',
      description: 'High sun exposure (>25 MJ/m²/day) in very sunny regions creates robust, potentially astringent teas with high caffeine',
      flavorInfluence: ['bold, robust flavors', 'potentially astringent', 'strong character'],
      mouthFeelInfluence: ['fuller, more astringent mouthfeel'],
      compoundTendency: ['very high caffeine', 'high catechins', 'lower L-theanine']
    }
  };

  /**
   * Get elevation level by ID or range
   * @param {string|number} query - Elevation ID, alias, or altitude in meters
   * @returns {Object|null} - Elevation object or null if not found
   */
  static getElevation(query) {
    if (query === null || query === undefined) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, elev] of Object.entries(this.ELEVATIONS)) {
      if (id.toLowerCase() === normalizedQuery) {
        return elev;
      }
    }

    // Try alias match
    for (const elev of Object.values(this.ELEVATIONS)) {
      if (elev.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return elev;
      }
    }

    // Try numeric match (meters)
    const meters = Number(query);
    if (!isNaN(meters)) {
      for (const elev of Object.values(this.ELEVATIONS)) {
        if (meters >= elev.range.min && meters < elev.range.max) {
          return elev;
        }
      }
    }

    return null;
  }

  /**
   * Get latitude zone by ID or range
   * @param {string|number} query - Latitude ID, alias, or degrees
   * @returns {Object|null} - Latitude object or null if not found
   */
  static getLatitude(query) {
    if (query === null || query === undefined) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, lat] of Object.entries(this.LATITUDES)) {
      if (id.toLowerCase() === normalizedQuery) {
        return lat;
      }
    }

    // Try alias match
    for (const lat of Object.values(this.LATITUDES)) {
      if (lat.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return lat;
      }
    }

    // Try numeric match (degrees)
    const degrees = Number(query);
    if (!isNaN(degrees)) {
      for (const lat of Object.values(this.LATITUDES)) {
        if (Math.abs(degrees) >= lat.range.min && Math.abs(degrees) < lat.range.max) {
          return lat;
        }
      }
    }

    return null;
  }

  /**
   * Get humidity level by ID or range
   * @param {string|number} query - Humidity ID, alias, or percentage
   * @returns {Object|null} - Humidity object or null if not found
   */
  static getHumidity(query) {
    if (query === null || query === undefined) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, hum] of Object.entries(this.HUMIDITIES)) {
      if (id.toLowerCase() === normalizedQuery) {
        return hum;
      }
    }

    // Try alias match
    for (const hum of Object.values(this.HUMIDITIES)) {
      if (hum.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return hum;
      }
    }

    // Try numeric match (percentage, 0-100)
    const percent = Number(query);
    if (!isNaN(percent) && percent >= 0 && percent <= 100) {
      for (const hum of Object.values(this.HUMIDITIES)) {
        if (percent >= hum.range.min && percent < hum.range.max) {
          return hum;
        }
      }
    }

    return null;
  }

  /**
   * Get temperature range by ID or value
   * @param {string|number} query - Temperature ID, alias, or celsius
   * @returns {Object|null} - Temperature object or null if not found
   */
  static getTemperature(query) {
    if (query === null || query === undefined) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, temp] of Object.entries(this.TEMPERATURES)) {
      if (id.toLowerCase() === normalizedQuery) {
        return temp;
      }
    }

    // Try alias match
    for (const temp of Object.values(this.TEMPERATURES)) {
      if (temp.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return temp;
      }
    }

    // Try numeric match (celsius)
    const celsius = Number(query);
    if (!isNaN(celsius)) {
      for (const temp of Object.values(this.TEMPERATURES)) {
        if (celsius >= temp.range.min && celsius < temp.range.max) {
          return temp;
        }
      }
    }

    return null;
  }

  /**
   * Get solar radiation level by ID or value
   * @param {string|number} query - Solar radiation ID, alias, or MJ/m²/day
   * @returns {Object|null} - Solar radiation object or null if not found
   */
  static getSolarRadiation(query) {
    if (query === null || query === undefined) return null;

    const normalizedQuery = String(query).toLowerCase().trim();

    // Try direct ID match
    for (const [id, solar] of Object.entries(this.SOLAR_RADIATIONS)) {
      if (id.toLowerCase() === normalizedQuery) {
        return solar;
      }
    }

    // Try alias match
    for (const solar of Object.values(this.SOLAR_RADIATIONS)) {
      if (solar.aliases?.some(alias => alias.toLowerCase() === normalizedQuery)) {
        return solar;
      }
    }

    // Try numeric match (MJ/m²/day)
    const mjPerDay = Number(query);
    if (!isNaN(mjPerDay)) {
      for (const solar of Object.values(this.SOLAR_RADIATIONS)) {
        if (mjPerDay >= solar.range.min && mjPerDay < solar.range.max) {
          return solar;
        }
      }
    }

    return null;
  }

  /**
   * Get all elevation levels
   * @returns {Array} - Array of all elevation objects
   */
  static getAllElevations() {
    return Object.values(this.ELEVATIONS);
  }

  /**
   * Get all latitude zones
   * @returns {Array} - Array of all latitude objects
   */
  static getAllLatitudes() {
    return Object.values(this.LATITUDES);
  }

  /**
   * Get all humidity levels
   * @returns {Array} - Array of all humidity objects
   */
  static getAllHumidities() {
    return Object.values(this.HUMIDITIES);
  }

  /**
   * Get all temperature ranges
   * @returns {Array} - Array of all temperature objects
   */
  static getAllTemperatures() {
    return Object.values(this.TEMPERATURES);
  }

  /**
   * Get all solar radiation levels
   * @returns {Array} - Array of all solar radiation objects
   */
  static getAllSolarRadiations() {
    return Object.values(this.SOLAR_RADIATIONS);
  }
}

export default GeographyTaxonomy;
