/**
 * GeographyService.js
 *
 * Analyzes tea geographical origin and climate characteristics
 * Extracted from: js/calculators/GeographyCalculator.js
 *
 * Input: TeaModel with geography (country, province, location, altitude, humidity, temperature, etc.)
 * Output: Geography analysis with location, climate, and characteristics
 */

// --- Helper Functions ---

function categorizeMeasurement(value, min, max, label) {
  if (typeof value !== 'number' || isNaN(value)) return 'Unknown';
  if (value < min) return `Below ${label} (< ${min})`;
  if (value > max) return `Above ${label} (> ${max})`;
  return `Optimal ${label} (${min}-${max})`;
}

function getSeasonName(month, latitude) {
  if (typeof month !== 'number' || month < 1 || month > 12 || typeof latitude !== 'number') {
    return 'Unknown';
  }

  const isSouthernHemisphere = latitude < 0;
  let adjustedMonth = isSouthernHemisphere ? (month + 6) : month;
  adjustedMonth = ((adjustedMonth - 1) % 12) + 1;

  if (adjustedMonth >= 3 && adjustedMonth <= 4) return 'Early Spring';
  if (adjustedMonth === 5) return 'Late Spring';
  if (adjustedMonth >= 6 && adjustedMonth <= 8) return 'Summer';
  if (adjustedMonth >= 9 && adjustedMonth <= 10) return 'Autumn';
  if (adjustedMonth === 11) return 'Late Autumn';
  return 'Winter';
}

// --- GeographyService ---

export class GeographyService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Main entry point: Analyze tea geography
   *
   * @param {TeaModel} teaModel - Normalized tea model
   * @returns {Promise<Object>} Analysis result
   */
  async analyze(teaModel) {
    return this.infer(teaModel);
  }

  /**
   * Perform geography analysis
   *
   * @param {TeaModel} teaModel - Tea to analyze
   * @returns {Object} Analysis result
   */
  infer(teaModel) {
    // Extract geography data
    const geoInput = teaModel?.geography;

    if (
      !geoInput ||
      typeof geoInput !== 'object' ||
      (Object.keys(geoInput).length === 0 &&
        !geoInput.country &&
        !geoInput.province &&
        !geoInput.location)
    ) {
      return {
        description: 'No geographical data available.',
        location: {},
        climate: {},
        characteristics: {}
      };
    }

    const {
      country = '',
      province = '',
      location = '',
      altitude = null,
      humidity = null,
      temperature = null,
      latitude = null,
      longitude = null,
      solarRadiation = null,
      harvestMonth = null
    } = geoInput;

    // Location analysis
    const locationData = {
      country,
      province,
      location,
      latitude,
      longitude,
      coordinates:
        latitude !== null && longitude !== null
          ? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
          : 'Unknown'
    };

    // Climate analysis - BOTH formatted (display) and raw numeric (for EffectService calculations)
    const climateData = {
      // Raw numeric values for EffectService to use in comparisons
      // Defaults align with typical tea-growing regions: mid-altitude, cool, humid, moderate sun
      altitude_value: altitude !== null ? altitude : 600,     // Default to mid-altitude (600m)
      temperature_value: temperature !== null ? temperature : 16,  // Default to cool-moderate (16°C)
      humidity_value: humidity !== null ? humidity : 70,       // Default to high humidity (70%)
      solarRadiation_value: solarRadiation !== null ? solarRadiation : 175, // Default to moderate radiation (175 W/m²)
      // Formatted display values for UI
      altitude: altitude !== null ? `${altitude}m` : 'Unknown',
      altitudeCategory: this.categorizeAltitude(altitude),
      humidity: humidity !== null ? `${humidity}%` : 'Unknown',
      humidityCategory: this.categorizeHumidity(humidity),
      temperature: temperature !== null ? `${temperature}°C` : 'Unknown',
      temperatureCategory: this.categorizeTemperature(temperature),
      solarRadiation: solarRadiation !== null ? `${solarRadiation} W/m²` : 'Unknown',
      solarRadiationCategory: this.categorizeSolarRadiation(solarRadiation)
    };

    // Seasonal information
    const seasonData = harvestMonth !== null ? getSeasonName(harvestMonth, latitude || 0) : 'Unknown';

    // Generate characteristics
    const characteristics = this.generateCharacteristics(
      altitude,
      humidity,
      temperature,
      solarRadiation,
      country,
      seasonData
    );

    // Generate description
    const description = this.generateGeographyDescription(
      locationData,
      climateData,
      seasonData
    );

    return {
      description,
      location: locationData,
      climate: climateData,
      season: seasonData,
      characteristics
    };
  }

  /**
   * Categorize altitude for tea growing
   *
   * @private
   */
  categorizeAltitude(altitude) {
    if (altitude === null || typeof altitude !== 'number') return 'Unknown';
    if (altitude < 300) return 'Lowland (< 300m)';
    if (altitude < 600) return 'Mid-altitude (300-600m)';
    if (altitude < 1200) return 'High altitude (600-1200m)';
    return 'Very High altitude (> 1200m)';
  }

  /**
   * Categorize humidity for tea growing
   *
   * @private
   */
  categorizeHumidity(humidity) {
    if (humidity === null || typeof humidity !== 'number') return 'Unknown';
    if (humidity < 50) return 'Dry (< 50%)';
    if (humidity < 70) return 'Moderate (50-70%)';
    if (humidity < 85) return 'High (70-85%)';
    return 'Very High (> 85%)';
  }

  /**
   * Categorize temperature for tea growing
   *
   * @private
   */
  categorizeTemperature(temperature) {
    if (temperature === null || typeof temperature !== 'number') return 'Unknown';
    if (temperature < 10) return 'Cold (< 10°C)';
    if (temperature < 15) return 'Cool (10-15°C)';
    if (temperature < 20) return 'Moderate (15-20°C)';
    if (temperature < 25) return 'Warm (20-25°C)';
    return 'Hot (> 25°C)';
  }

  /**
   * Categorize solar radiation
   *
   * @private
   */
  categorizeSolarRadiation(radiation) {
    if (radiation === null || typeof radiation !== 'number') return 'Unknown';
    if (radiation < 100) return 'Low (< 100 W/m²)';
    if (radiation < 150) return 'Moderate (100-150 W/m²)';
    if (radiation < 200) return 'High (150-200 W/m²)';
    return 'Very High (> 200 W/m²)';
  }

  /**
   * Generate characteristics based on geography
   *
   * @private
   */
  generateCharacteristics(altitude, humidity, temperature, solarRadiation, country, season) {
    const characteristics = {
      terroir: [],
      climbateProfile: [],
      typicalFlavors: []
    };

    // Altitude characteristics
    if (altitude !== null) {
      if (altitude > 800) {
        characteristics.terroir.push('High-altitude terroir');
        characteristics.typicalFlavors.push('Sweet', 'Smooth', 'Complex');
      } else if (altitude > 500) {
        characteristics.terroir.push('Mid-altitude terroir');
        characteristics.typicalFlavors.push('Balanced');
      } else {
        characteristics.terroir.push('Lowland terroir');
        characteristics.typicalFlavors.push('Bold', 'Full-bodied');
      }
    }

    // Humidity characteristics
    if (humidity !== null) {
      if (humidity > 80) {
        characteristics.climbateProfile.push('High humidity');
        characteristics.terroir.push('Misty mountain region');
      } else if (humidity > 70) {
        characteristics.climbateProfile.push('Moderate-high humidity');
      }
    }

    // Temperature characteristics
    if (temperature !== null) {
      if (temperature > 20) {
        characteristics.climbateProfile.push('Warm climate');
      } else if (temperature < 15) {
        characteristics.climbateProfile.push('Cool climate');
        characteristics.typicalFlavors.push('Fresh', 'Delicate');
      }
    }

    // Solar radiation
    if (solarRadiation !== null) {
      if (solarRadiation < 150) {
        characteristics.terroir.push('Shade-influenced');
        characteristics.typicalFlavors.push('Umami', 'Sweet');
      } else {
        characteristics.typicalFlavors.push('Vibrant', 'Bright');
      }
    }

    // Season characteristics
    if (season && season !== 'Unknown') {
      characteristics.climbateProfile.push(`${season} harvest`);
      if (season.includes('Spring')) {
        characteristics.typicalFlavors.push('Fresh', 'Floral');
      } else if (season.includes('Autumn')) {
        characteristics.typicalFlavors.push('Fruity', 'Complex');
      }
    }

    // Remove duplicates
    characteristics.terroir = [...new Set(characteristics.terroir)];
    characteristics.climbateProfile = [...new Set(characteristics.climbateProfile)];
    characteristics.typicalFlavors = [...new Set(characteristics.typicalFlavors)];

    return characteristics;
  }

  /**
   * Generate geography description
   *
   * @private
   */
  generateGeographyDescription(location, climate, season) {
    let desc = 'Origin: ';

    if (location.country) {
      desc += location.country;
      if (location.province) desc += `, ${location.province}`;
      if (location.location) desc += `, ${location.location}`;
    } else {
      desc += 'Unknown location';
    }

    if (location.coordinates !== 'Unknown') {
      desc += ` (${location.coordinates})`;
    }

    desc += '. ';

    if (season !== 'Unknown') {
      desc += `Harvest: ${season}. `;
    }

    desc += `Climate: ${climate.temperatureCategory}, ${climate.humidityCategory}, ${climate.altitudeCategory}.`;

    return desc;
  }

  /**
   * Serialize inference for JSON output
   */
  serialize(inference) {
    return {
      description: inference?.description || '',
      location: inference?.location || {},
      climate: inference?.climate || {},
      season: inference?.season || 'Unknown',
      characteristics: inference?.characteristics || {}
    };
  }

  /**
   * Format inference for markdown display
   */
  formatMarkdown(inference) {
    if (!inference) {
      return '## Geography Analysis\n\nNo geographical data available.';
    }

    let md = '## Geography Analysis\n\n';
    md += `${inference.description}\n\n`;

    const { location, climate, season, characteristics } = inference;

    if (Object.keys(location).length > 0) {
      md += '### Location\n';
      if (location.country) md += `- **Country**: ${location.country}\n`;
      if (location.province) md += `- **Province/Region**: ${location.province}\n`;
      if (location.location) md += `- **Specific Location**: ${location.location}\n`;
      if (location.coordinates !== 'Unknown') md += `- **Coordinates**: ${location.coordinates}\n`;
    }

    if (Object.keys(climate).length > 0) {
      md += '\n### Climate\n';
      md += `- **Altitude**: ${climate.altitude} (${climate.altitudeCategory})\n`;
      md += `- **Humidity**: ${climate.humidity} (${climate.humidityCategory})\n`;
      md += `- **Temperature**: ${climate.temperature} (${climate.temperatureCategory})\n`;
      if (climate.solarRadiation !== 'Unknown') {
        md += `- **Solar Radiation**: ${climate.solarRadiation} (${climate.solarRadiationCategory})\n`;
      }
    }

    if (season !== 'Unknown') {
      md += `\n**Harvest Season**: ${season}\n`;
    }

    if (characteristics) {
      md += '\n### Terroir & Characteristics\n';
      if (characteristics.terroir?.length > 0) {
        md += `- **Terroir**: ${characteristics.terroir.join(', ')}\n`;
      }
      if (characteristics.climbateProfile?.length > 0) {
        md += `- **Climate Profile**: ${characteristics.climbateProfile.join(', ')}\n`;
      }
      if (characteristics.typicalFlavors?.length > 0) {
        md += `- **Typical Flavors**: ${characteristics.typicalFlavors.join(', ')}\n`;
      }
    }

    return md;
  }
}

// Export singleton instance for convenience
export const geographyService = new GeographyService();
