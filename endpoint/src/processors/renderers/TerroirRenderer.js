/**
 * TerroirRenderer.js
 *
 * Purpose: Create detailed terroir narratives showing how geography shapes tea
 * Input:
 *   - geographyInference: Complete analysis with values, classifications, descriptions, and influence arrays
 *   - teaTypeInference: Tea type context
 *   - formData: Location info (location, province, country)
 *   - compoundInference: (optional) Biochemical result of terroir
 *   - flavorInference: (optional) Sensory result of terroir
 *
 * Output: Rich narrative sections showing:
 * - Specific location and elevation data
 * - How each geographic factor influences THIS tea type
 * - Flavor influences and compound development impacts
 * - Quality assessment and terroir character
 */

import { TeaTypeTaxonomy } from '../../taxonomies/index.js';

export class TerroirRenderer {
  constructor(config = {}) {
    this.config = {
      maxSections: config.maxSections || 8,
      ...config
    };
  }

  /**
   * Render detailed terroir narrative
   * @param {Object} inferences - Object containing inference results
   *   - inferences.geography: Complete geography analysis with arrays and descriptions (required)
   *   - inferences.teaType: Tea type for context (required)
   *   - inferences.formData: Original request data with location info (required)
   *   - inferences.compound: (optional) Compound profile
   *   - inferences.flavor: (optional) Identified flavors
   * @returns {Object} - Rich terroir presentation
   */
  render(inferences = {}) {
    const {
      geography: geographyInference = {},
      teaType: teaTypeInference = {},
      formData = {},
      compound: compoundInference = null,
      flavor: flavorInference = null
    } = inferences;

    const trace = [];

    // Validate inputs
    if (!geographyInference?.analysis) {
      return this._failedRender("No geography analysis provided", trace);
    }
    if (!teaTypeInference?.analysis) {
      return this._failedRender("No tea type information provided", trace);
    }

    const geoAnalysis = geographyInference.analysis;
    const geoInputs = geographyInference.inputs;
    const teaAnalysis = teaTypeInference.analysis;
    const teaType = teaTypeInference?.analysis?.teaType
      ? TeaTypeTaxonomy.getType(teaTypeInference.analysis.teaType)
      : null;
    const teaName = teaType?.displayName || "this tea";

    // Extract location data
    const location = formData?.geography?.location || "tea origin";
    const province = formData?.geography?.province || "";
    const country = formData?.geography?.country || "";
    const locationString = [location, province, country].filter(Boolean).join(", ");

    trace.push({
      step: "Input Reception",
      reason: "Received geography, tea type, and location data",
      adjustment: `Building narrative for ${teaName} from ${locationString}`,
      value: "Inputs validated"
    });

    const sections = [];

    // Section 1: Location & Origin
    sections.push(
      this._buildOriginSection(locationString, teaName, geoInputs, geoAnalysis)
    );

    // Section 2: Elevation Impact
    if (geoAnalysis.elevation) {
      sections.push(
        this._buildElevationSection(geoAnalysis.elevation, geoInputs.altitude, teaName)
      );
    }

    // Section 3: Humidity Impact
    if (geoAnalysis.climate?.humidity) {
      sections.push(
        this._buildHumiditySection(geoAnalysis.climate.humidity, geoInputs.humidity, teaName)
      );
    }

    // Section 4: Temperature Impact
    if (geoAnalysis.climate?.temperature) {
      sections.push(
        this._buildTemperatureSection(geoAnalysis.climate.temperature, geoInputs.temperature, teaName)
      );
    }

    // Section 5: Solar Radiation Impact
    if (geoAnalysis.climate?.solarRadiation) {
      sections.push(
        this._buildSolarRadiationSection(geoAnalysis.climate.solarRadiation, geoInputs.solarRadiation, teaName)
      );
    }

    // Section 6: Latitude/Climate Zone Impact
    if (geoAnalysis.climate?.latitude) {
      sections.push(
        this._buildLatitudeSection(geoAnalysis.climate.latitude, geoInputs.latitude, teaName)
      );
    }

    // Section 7: Compound Development (if available)
    if (compoundInference?.analysis?.compoundProfile) {
      sections.push(
        this._buildCompoundImpactSection(geoAnalysis, compoundInference.analysis.compoundProfile, teaName)
      );
    }

    // Section 8: Flavor Expression (if available)
    if (flavorInference?.analysis?.identifiedFlavors && flavorInference.analysis.identifiedFlavors.length > 0) {
      sections.push(
        this._buildFlavorSection(geoAnalysis, flavorInference.analysis.identifiedFlavors, teaName)
      );
    }

    // Section 9: Quality & Terroir Character
    if (geoAnalysis.qualityIndicator) {
      sections.push(
        this._buildQualitySection(geoAnalysis.qualityIndicator, geoAnalysis.terroir, teaName)
      );
    }

    trace.push({
      step: "Narrative Construction",
      reason: "Built detailed terroir story with specific values and influences",
      adjustment: `Generated ${sections.length} narrative sections`,
      value: "Terroir presentation complete"
    });

    // Extract geographic influences with values
    const geographicInfluences = this._extractGeographicInfluences(geoAnalysis, geoInputs);

    return {
      narrative: sections.join("\n\n"),
      sections,
      geographicInfluences,
      teaType: teaName,
      teaTypeId: teaAnalysis.teaType,
      location: locationString,
      qualityIndicator: geoAnalysis.qualityIndicator || "Unknown",
      characteristics: geoAnalysis.terroir || [],
      harvestSeason: geoAnalysis.season?.harvestSeason || "Year-round",
      analysis: {
        elevation: geoAnalysis.elevation?.classification || "Unknown",
        humidity: geoAnalysis.climate?.humidity?.classification || "Unknown",
        latitude: geoAnalysis.climate?.latitude?.zone || "Unknown",
        temperature: geoAnalysis.climate?.temperature?.classification || "Unknown",
        solarRadiation: geoAnalysis.climate?.solarRadiation?.classification || "Unknown"
      },
      trace,
      confidence: geographyInference.confidence || 0.85,
      rendererVersion: '1.0'
    };
  }

  // ========== Section Building Methods ==========

  _buildOriginSection(locationString, teaName, inputs, analysis) {
    const { altitude, humidity, temperature, solarRadiation, latitude } = inputs;
    const elevClass = analysis.elevation?.classification || "moderate";

    const altText = altitude > 0 ? ` at ${altitude}m elevation` : "";
    const tempText = temperature > 0 ? `, with average temperatures of ${temperature}°C` : "";
    const humidText = humidity > 0 ? ` and humidity levels around ${humidity}%` : "";

    return `**Geographic Origin**\n\n${teaName} grows in ${locationString}${altText}${tempText}${humidText}. This specific terroir—the combination of location, elevation, climate, and environmental conditions—fundamentally shapes the tea's character from leaf to cup.`;
  }

  _buildElevationSection(elevation, altitudeValue, teaName) {
    const { classification, description, flavorInfluence, compoundTendency } = elevation;

    let flavorText = "";
    if (flavorInfluence && flavorInfluence.length > 0) {
      flavorText = `\n\nFlavor influences from this elevation: **${flavorInfluence.join(", ")}**`;
    }

    let compoundText = "";
    if (compoundTendency && compoundTendency.length > 0) {
      compoundText = `\n\nCompound development at this elevation: ${compoundTendency.join(", ")}`;
    }

    const altText = altitudeValue > 0 ? ` (${altitudeValue}m)` : "";

    return `**Elevation Impact** ${altText}\n\n${description}. For ${teaName}, this elevation means the tea plants grow more slowly, allowing the leaves to develop complex flavors and higher concentrations of amino acids.${flavorText}${compoundText}`;
  }

  _buildHumiditySection(humidity, humidityValue, teaName) {
    const { classification, description, flavorInfluence, compoundTendency } = humidity;

    let flavorText = "";
    if (flavorInfluence && flavorInfluence.length > 0) {
      flavorText = `\n\nFlavor characteristics from this humidity: **${flavorInfluence.join(", ")}**`;
    }

    let compoundText = "";
    if (compoundTendency && compoundTendency.length > 0) {
      compoundText = `\n\nCompound effects of humidity: ${compoundTendency.join(", ")}`;
    }

    const humidText = humidityValue > 0 ? ` (${humidityValue}%)` : "";

    return `**Humidity & Moisture**${humidText}\n\n${description}. In this humid microclimate, ${teaName} develops with optimal enzyme activity, resulting in nuanced flavor development and balanced biochemistry.${flavorText}${compoundText}`;
  }

  _buildTemperatureSection(temperature, tempValue, teaName) {
    const { classification, description, flavorInfluence, compoundTendency } = temperature;

    let flavorText = "";
    if (flavorInfluence && flavorInfluence.length > 0) {
      flavorText = `\n\nFlavor influences from temperature: **${flavorInfluence.join(", ")}**`;
    }

    let compoundText = "";
    if (compoundTendency && compoundTendency.length > 0) {
      compoundText = `\n\nTemperature effects on tea compounds: ${compoundTendency.join(", ")}`;
    }

    const tempText = tempValue > 0 ? ` (${tempValue}°C average)` : "";

    return `**Temperature Range**${tempText}\n\n${description}. Temperature is critical for ${teaName}'s development—it determines growth rate, compound synthesis, and the balance between caffeine and amino acids.${flavorText}${compoundText}`;
  }

  _buildSolarRadiationSection(solarRadiation, solarValue, teaName) {
    const { classification, description, flavorInfluence, compoundTendency } = solarRadiation;

    let flavorText = "";
    if (flavorInfluence && flavorInfluence.length > 0) {
      flavorText = `\n\nFlavor influences from sun exposure: **${flavorInfluence.join(", ")}**`;
    }

    let compoundText = "";
    if (compoundTendency && compoundTendency.length > 0) {
      compoundText = `\n\nSolar radiation effects on compounds: ${compoundTendency.join(", ")}`;
    }

    const solarText = solarValue > 0 ? ` (${solarValue} MJ/m²/day)` : "";

    return `**Sun Exposure**${solarText}\n\n${description}. For ${teaName}, sunlight directly affects photosynthesis—more sun boosts caffeine production, while partially shaded conditions favor delicate aromatic development.${flavorText}${compoundText}`;
  }

  _buildLatitudeSection(latitude, latValue, teaName) {
    const { zone, description, flavorInfluence, compoundTendency } = latitude;

    let flavorText = "";
    if (flavorInfluence && flavorInfluence.length > 0) {
      flavorText = `\n\nFlavor influences from this climate zone: **${flavorInfluence.join(", ")}**`;
    }

    let compoundText = "";
    if (compoundTendency && compoundTendency.length > 0) {
      compoundText = `\n\nClimate zone effects: ${compoundTendency.join(", ")}`;
    }

    const latText = latValue !== 0 ? ` (${latValue}°)` : "";

    return `**Climate Zone**${latText}\n\n${description}. The ${zone.toLowerCase()} zone where ${teaName} grows determines seasonal variation, day length, and overall growth patterns throughout the year.${flavorText}${compoundText}`;
  }

  _buildCompoundImpactSection(geoAnalysis, compoundProfile, teaName) {
    const elevation = geoAnalysis.elevation?.classification || "moderate";
    const humidity = geoAnalysis.climate?.humidity?.classification || "moderate";
    const temperature = geoAnalysis.climate?.temperature?.classification || "mild";
    const solar = geoAnalysis.climate?.solarRadiation?.classification || "moderate";

    let mechanismText = "";
    const mechanisms = [];

    if (elevation.includes("High") || elevation.includes("Very High")) {
      mechanisms.push("High elevation slows growth and boosts amino acid production");
    }
    if (humidity.includes("High")) {
      mechanisms.push("High humidity encourages L-theanine development");
    }
    if (temperature.includes("Cool") || temperature.includes("Cold")) {
      mechanisms.push("Cool temperatures moderate caffeine synthesis");
    }
    if (solar.includes("Low") || solar.includes("Moderate-Low")) {
      mechanisms.push("Lower sun exposure favors delicate compounds");
    }

    if (mechanisms.length > 0) {
      mechanismText = `\n\nMechanisms: ${mechanisms.join("; ")}`;
    }

    return `**Compound Development**\n\nThe terroir's geographic factors converge to create ${teaName}'s distinctive biochemical profile: **${compoundProfile}**. This is not random—each environmental factor measurably influences which compounds develop in the leaf.${mechanismText} This is terroir working at the molecular level.`;
  }

  _buildFlavorSection(geoAnalysis, identifiedFlavors, teaName) {
    const flavorList = identifiedFlavors.slice(0, 6).join(", ");
    const terroir = geoAnalysis.terroir && geoAnalysis.terroir.length > 0
      ? geoAnalysis.terroir.slice(0, 3).join(", ")
      : "this unique geographic origin";

    return `**Flavor Expression**\n\n${teaName}'s terroir manifests directly in the cup through distinctive flavors: **${flavorList}**. Each of these flavor notes—the aromatics, the body, the finish—is a sensory expression of ${terroir}. What you taste is geography made tangible.`;
  }

  _buildQualitySection(qualityIndicator, terroir, teaName) {
    const qualityMap = {
      "Premium/Exceptional": `${teaName} originates from a **premium terroir** where multiple environmental factors align perfectly. Exceptional elevation, optimal humidity, favorable temperature, and strong sun exposure combine to create outstanding tea quality.`,
      "High Quality": `${teaName} grows in a **high-quality terroir** with two or more favorable environmental conditions contributing to its refined character and complexity.`,
      "Good Quality": `${teaName} benefits from a **good terroir** where at least one significant environmental advantage—perhaps high elevation or optimal humidity—supports quality cultivation.`,
      "Standard Quality": `${teaName} develops in a **standard terroir** where environmental conditions support solid, consistent tea production.`
    };

    const qualityText = qualityMap[qualityIndicator] || `${teaName} is shaped by its unique terroir.`;
    const terroirContext = terroir && terroir.length > 0
      ? ` Key characteristics: ${terroir.join(", ")}.`
      : "";

    return `**Terroir Quality & Character**\n\n${qualityText}${terroirContext}`;
  }

  // ========== Influence Extraction ==========

  _extractGeographicInfluences(geoAnalysis, geoInputs) {
    const influences = [];

    if (geoAnalysis.elevation) {
      influences.push({
        factor: "Elevation",
        value: `${geoInputs.altitude}m`,
        classification: geoAnalysis.elevation.classification,
        description: geoAnalysis.elevation.description,
        flavorInfluence: geoAnalysis.elevation.flavorInfluence || [],
        compoundEffect: geoAnalysis.elevation.compoundTendency || []
      });
    }

    if (geoAnalysis.climate?.humidity) {
      influences.push({
        factor: "Humidity",
        value: `${geoInputs.humidity}%`,
        classification: geoAnalysis.climate.humidity.classification,
        description: geoAnalysis.climate.humidity.description,
        flavorInfluence: geoAnalysis.climate.humidity.flavorInfluence || [],
        compoundEffect: geoAnalysis.climate.humidity.compoundTendency || []
      });
    }

    if (geoAnalysis.climate?.temperature) {
      influences.push({
        factor: "Temperature",
        value: `${geoInputs.temperature}°C`,
        classification: geoAnalysis.climate.temperature.classification,
        description: geoAnalysis.climate.temperature.description,
        flavorInfluence: geoAnalysis.climate.temperature.flavorInfluence || [],
        compoundEffect: geoAnalysis.climate.temperature.compoundTendency || []
      });
    }

    if (geoAnalysis.climate?.solarRadiation) {
      influences.push({
        factor: "Solar Radiation",
        value: `${geoInputs.solarRadiation} MJ/m²/day`,
        classification: geoAnalysis.climate.solarRadiation.classification,
        description: geoAnalysis.climate.solarRadiation.description,
        flavorInfluence: geoAnalysis.climate.solarRadiation.flavorInfluence || [],
        compoundEffect: geoAnalysis.climate.solarRadiation.compoundTendency || []
      });
    }

    if (geoAnalysis.climate?.latitude) {
      influences.push({
        factor: "Latitude/Climate Zone",
        value: `${geoInputs.latitude}°`,
        classification: geoAnalysis.climate.latitude.zone,
        description: geoAnalysis.climate.latitude.description,
        flavorInfluence: geoAnalysis.climate.latitude.flavorInfluence || [],
        compoundEffect: geoAnalysis.climate.latitude.compoundTendency || []
      });
    }

    return influences;
  }

  // ========== Error Handling ==========

  _failedRender(reason, trace) {
    return {
      narrative: `Unable to generate terroir presentation: ${reason}`,
      sections: [],
      geographicInfluences: [],
      teaType: "Unknown",
      teaTypeId: null,
      location: "Unknown",
      qualityIndicator: "Unknown",
      characteristics: [],
      harvestSeason: "Unknown",
      analysis: {
        elevation: "Unknown",
        humidity: "Unknown",
        latitude: "Unknown",
        temperature: "Unknown",
        solarRadiation: "Unknown"
      },
      trace: [{
        step: "Error",
        reason,
        adjustment: "Unable to render terroir",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }
}
