/**
 * GeographyInferrer.js
 *
 * Purpose: Infer geographic and climate characteristics
 * Input: { altitude, humidity, latitude, temperature, solarRadiation } geography data
 * Output: Structured geographic analysis with climate classification
 *
 * This Inferrer uses GeographyTaxonomy to analyze geographic factors
 */

import { GeographyTaxonomy } from '../../taxonomies/index.js';

export class GeographyInferrer {
  constructor(config = {}) {
    this.config = config;
    this.geographyTaxonomy = GeographyTaxonomy;
  }

  /**
   * Infer geographic characteristics from raw geography data
   * @param {Object} formData - { altitude, humidity, latitude, temperature, solarRadiation }
   * @returns {Object} - Structured geography analysis
   */
  infer(formData = {}) {
    const trace = [];
    const geoData = formData.geography || formData;

    // Step 1: Input validation
    const altitude = geoData?.altitude || 0;
    const humidity = geoData?.humidity || 50;
    const latitude = geoData?.latitude || 0;
    const temperature = geoData?.temperature || 15;
    const solarRadiation = geoData?.solarRadiation || 15;

    trace.push({
      step: "Input Reception",
      reason: "Raw geographic data received",
      adjustment: `Altitude: ${altitude}m, Humidity: ${humidity}%, Temperature: ${temperature}°C`,
      value: `Latitude: ${latitude}°, Solar Radiation: ${solarRadiation} MJ/m²/day`
    });

    // Handle missing data
    if (altitude === 0 && humidity === 50 && latitude === 0 && temperature === 15 && solarRadiation === 15) {
      return this._emptyInference(trace);
    }

    // Step 2: Classify elevation
    const elevationObj = this.geographyTaxonomy.getElevation(altitude);
    const elevationLevel = elevationObj?.displayName || "Unknown";
    const elevationEffect = elevationObj?.flavorEffect || "Neutral";

    trace.push({
      step: "Elevation Classification",
      reason: `Based on altitude: ${altitude}m`,
      adjustment: `Classified as: ${elevationLevel}`,
      value: `Effect: ${elevationEffect}`
    });

    // Step 3: Classify humidity
    const humidityObj = this.geographyTaxonomy.getHumidity(humidity);
    const humidityLevel = humidityObj?.displayName || "Unknown";
    const humidityEffect = humidityObj?.description || "Neutral";

    trace.push({
      step: "Humidity Classification",
      reason: `Based on humidity: ${humidity}%`,
      adjustment: `Classified as: ${humidityLevel}`,
      value: `Effect: ${humidityEffect}`
    });

    // Step 4: Classify latitude/climate zone
    const latitudeObj = this.geographyTaxonomy.getLatitude(latitude);
    const latitudeZone = latitudeObj?.displayName || "Unknown";
    const climateType = latitudeObj?.climateType || "Unknown";

    trace.push({
      step: "Latitude/Climate Zone Classification",
      reason: `Based on latitude: ${latitude}°`,
      adjustment: `Classified as: ${latitudeZone}`,
      value: `Climate Type: ${climateType}`
    });

    // Step 5: Classify temperature
    const temperatureObj = this.geographyTaxonomy.getTemperature(temperature);
    const temperatureRange = temperatureObj?.displayName || "Unknown";
    const temperatureCharacteristic = temperatureObj?.characteristic || "Neutral";

    trace.push({
      step: "Temperature Classification",
      reason: `Based on average temperature: ${temperature}°C`,
      adjustment: `Classified as: ${temperatureRange}`,
      value: `Characteristic: ${temperatureCharacteristic}`
    });

    // Step 6: Classify solar radiation
    const solarObj = this.geographyTaxonomy.getSolarRadiation(solarRadiation);
    const solarLevel = solarObj?.displayName || "Unknown";
    const solarEffect = solarObj?.flavorEffect || "Neutral";

    trace.push({
      step: "Solar Radiation Classification",
      reason: `Based on solar radiation: ${solarRadiation} MJ/m²/day`,
      adjustment: `Classified as: ${solarLevel}`,
      value: `Effect: ${solarEffect}`
    });

    // Step 7: Determine quality indicator based on combined factors
    const qualityIndicator = this._determineQualityIndicator({
      elevation: elevationLevel,
      humidity: humidityLevel,
      temperature: temperatureRange,
      solarRadiation: solarLevel
    });

    trace.push({
      step: "Quality Assessment",
      reason: "Combine geographic factors to assess tea quality potential",
      adjustment: `Assessed as: ${qualityIndicator}`,
      value: "Based on elevation, humidity, temperature, and solar exposure"
    });

    // Step 8: Determine harvest season potential
    const harvestSeasonPotential = this._determineHarvestSeason(temperature, latitude);

    trace.push({
      step: "Harvest Season Analysis",
      reason: "Determine optimal harvest timing",
      adjustment: `Potential season: ${harvestSeasonPotential}`,
      value: "Based on temperature and latitude"
    });

    // Step 9: Assess terroir characteristics
    const terroir = this._assessTerroir(
      elevationLevel,
      humidityLevel,
      solarLevel,
      temperatureRange
    );

    trace.push({
      step: "Terroir Assessment",
      reason: "Combine environmental factors for terroir profile",
      adjustment: `Terroir characteristics: ${terroir.join(', ')}`,
      value: "Environmental distinctiveness indicators"
    });

    // Step 10: Generate description
    const description = this._generateDescription(
      elevationLevel,
      latitudeZone,
      temperatureRange,
      qualityIndicator,
      harvestSeasonPotential
    );

    trace.push({
      step: "Description Generation",
      reason: "Summarize geographic analysis",
      adjustment: "Generated human-readable description",
      value: description.substring(0, 50) + "..."
    });

    return {
      // Raw inputs
      inputs: {
        altitude,
        humidity,
        latitude,
        temperature,
        solarRadiation
      },

      // Inferred analysis
      analysis: {
        // Elevation
        elevation: {
          value: altitude,
          classification: elevationLevel,
          effect: elevationEffect
        },

        // Climate
        climate: {
          humidity: {
            value: humidity,
            classification: humidityLevel,
            effect: humidityEffect
          },
          latitude: {
            value: latitude,
            zone: latitudeZone,
            climateType
          },
          temperature: {
            value: temperature,
            classification: temperatureRange,
            characteristic: temperatureCharacteristic
          },
          solarRadiation: {
            value: solarRadiation,
            classification: solarLevel,
            effect: solarEffect
          }
        },

        // Quality and harvest
        qualityIndicator,
        harvestSeasonPotential,
        terroir,

        // Season for harvest (based on climate)
        season: {
          harvestSeason: harvestSeasonPotential,
          seasonalFlavorProfile: this._getSeasonalFlavorProfile(harvestSeasonPotential)
        }
      },

      // Metadata
      trace,
      confidence: this._calculateConfidence(altitude, humidity, latitude, temperature, solarRadiation),
      description,
      inferrerVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Determine quality indicator from combined factors
   */
  _determineQualityIndicator(factors) {
    const { elevation, humidity, temperature, solarRadiation } = factors;

    // Premium indicators
    const premiumFactors = [];

    if (elevation.includes('High') || elevation.includes('Very High')) {
      premiumFactors.push('high elevation');
    }
    if (humidity.includes('High') || humidity.includes('Very High')) {
      premiumFactors.push('optimal humidity');
    }
    if (solarRadiation.includes('High')) {
      premiumFactors.push('strong solar exposure');
    }
    if (temperature.includes('Cool') || temperature.includes('Moderate')) {
      premiumFactors.push('ideal temperature');
    }

    if (premiumFactors.length >= 3) {
      return "Premium/Exceptional";
    } else if (premiumFactors.length === 2) {
      return "High Quality";
    } else if (premiumFactors.length === 1) {
      return "Good Quality";
    } else {
      return "Standard Quality";
    }
  }

  /**
   * Determine harvest season from temperature and latitude
   */
  _determineHarvestSeason(temperature, latitude) {
    const latAbs = Math.abs(latitude);

    // Tropical regions (near equator)
    if (latAbs < 15) {
      if (temperature > 25) return "Spring/Summer";
      return "Multiple seasons possible";
    }

    // Subtropical regions
    if (latAbs < 30) {
      if (temperature > 20) return "Spring/Early Summer";
      if (temperature > 15) return "Spring/Autumn";
      return "Autumn";
    }

    // Temperate regions
    if (temperature > 18) return "Spring";
    if (temperature > 12) return "Spring/Early Summer";
    if (temperature > 5) return "Autumn";
    return "Late Summer/Early Autumn";
  }

  /**
   * Get seasonal flavor profile
   */
  _getSeasonalFlavorProfile(season) {
    const profiles = {
      'Spring': 'Fresh, floral, light-bodied',
      'Summer': 'Vegetal, grassy, refreshing',
      'Autumn': 'Complex, fruity, full-bodied',
      'Winter': 'Robust, warming, mellow',
      'Spring/Summer': 'Fresh with some complexity',
      'Spring/Early Summer': 'Light floral notes',
      'Spring/Autumn': 'Balanced and nuanced',
      'Late Summer/Early Autumn': 'Transitional complexity',
      'Autumn': 'Deep, fruity character',
      'Multiple seasons possible': 'Varied seasonally'
    };
    return profiles[season] || 'Variable character';
  }

  /**
   * Assess terroir characteristics
   */
  _assessTerroir(elevation, humidity, solarRadiation, temperature) {
    const characteristics = [];

    if (elevation.includes('High') || elevation.includes('Mountain')) {
      characteristics.push('Mountain terroir');
    }
    if (humidity.includes('High')) {
      characteristics.push('Misty/misty-mountain character');
    }
    if (solarRadiation.includes('High')) {
      characteristics.push('Sun-exposed development');
    }
    if (solarRadiation.includes('Low')) {
      characteristics.push('Shade-influenced growth');
    }
    if (temperature.includes('Cool')) {
      characteristics.push('Cool-climate character');
    }

    if (characteristics.length === 0) {
      characteristics.push('Standard terroir expression');
    }

    return characteristics;
  }

  /**
   * Calculate confidence in the inference
   */
  _calculateConfidence(altitude, humidity, latitude, temperature, solarRadiation) {
    // Higher confidence if more parameters provided
    let providedParams = 0;
    if (altitude && altitude !== 0) providedParams++;
    if (humidity && humidity !== 50) providedParams++;
    if (latitude && latitude !== 0) providedParams++;
    if (temperature && temperature !== 15) providedParams++;
    if (solarRadiation && solarRadiation !== 15) providedParams++;

    return Math.min(0.95, 0.5 + (providedParams * 0.09));
  }

  /**
   * Generate human-readable description
   */
  _generateDescription(elevation, latitude, temperature, quality, season) {
    let desc = `This tea originates from a ${elevation.toLowerCase()} in the ${latitude.toLowerCase()} region. `;

    desc += `The ${temperature.toLowerCase()} climate contributes to ${quality.toLowerCase()} tea production. `;

    desc += `Harvest timing in ${season.toLowerCase()} brings out characteristic flavor development. `;

    desc += "The geographic location significantly influences the tea's distinctive terroir expression.";

    return desc;
  }

  /**
   * Return empty inference when no geography data provided
   */
  _emptyInference(trace) {
    trace.push({
      step: "Input Validation",
      reason: "No geographic data provided",
      adjustment: "Returning empty inference",
      value: "No data"
    });

    return {
      inputs: {
        altitude: 0,
        humidity: 0,
        latitude: 0,
        temperature: 0,
        solarRadiation: 0
      },
      analysis: {
        elevation: { value: 0, classification: "Unknown", effect: "Unknown" },
        climate: {
          humidity: { value: 0, classification: "Unknown", effect: "Unknown" },
          latitude: { value: 0, zone: "Unknown", climateType: "Unknown" },
          temperature: { value: 0, classification: "Unknown", characteristic: "Unknown" },
          solarRadiation: { value: 0, classification: "Unknown", effect: "Unknown" }
        },
        qualityIndicator: "Unknown",
        harvestSeasonPotential: "Unknown",
        terroir: ["Unknown"],
        season: {
          harvestSeason: "Unknown",
          seasonalFlavorProfile: "Unknown"
        }
      },
      trace,
      confidence: 0.0,
      description: "No geographic data available.",
      inferrerVersion: '1.0'
    };
  }
}
