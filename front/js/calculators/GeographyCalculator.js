// GeographyCalculator.js
// Handles analysis of geographical and seasonal influences on tea characteristics.

import { BaseCalculator } from './BaseCalculator.js';
// Assuming revised reference data files are in '../descriptors/'
import {
    elevationLevels,
    humidityLevels,
    temperatureLevels,
    solarRadiationLevels,
    latitudeZones,
    identifyRegionFromCoordinates, // Assuming this function now returns info including country, subregion, description, and relevant influence notes
    regionCharacteristics // Assuming this contains flavor/mouthfeel notes per region
} from '../descriptors/GeographicalDescriptors.js';

// Assuming seasonal data might be separate or merged into GeographicalDescriptors
import { seasonalProfiles, seasonalDescriptions } from '../descriptors/SeasonalFactors.js'; // Adjust path if merged

// Helper function to categorize measurements (from original)
function categorizeMeasurement(value, categories) {
    if (typeof value !== 'number' || isNaN(value)) return "Unknown";
    for (const [category, range] of Object.entries(categories)) {
        // Ensure range exists and has min/max before comparing
        if (range && typeof range.min === 'number' && typeof range.max === 'number') {
             if (value >= range.min && value < range.max) { // Use < max for non-infinity ranges
                 return category;
             }
             // Handle Infinity case for max range
             if (range.max === Infinity && value >= range.min) {
                 return category;
             }
        }
    }
     // Fallback if value is outside all defined ranges but is a number
    return "Outside Defined Ranges";
}


// Helper function to get season name (modified from original SeasonCalculator logic)
function getSeasonName(month, latitude) {
    if (typeof month !== 'number' || month < 1 || month > 12 || typeof latitude !== 'number') {
        return 'Unknown';
    }
    const isSouthernHemisphere = latitude < 0;
    let adjustedMonth = isSouthernHemisphere ? (month + 6) : month;
    // Wrap around using modulo, handle edge case of 0 becoming 12
    adjustedMonth = ((adjustedMonth - 1) % 12) + 1;

    // Simple seasonal mapping (adjust thresholds as needed)
    if (adjustedMonth >= 3 && adjustedMonth <= 4) return 'Early Spring'; // Mar-Apr (N) / Sep-Oct (S)
    if (adjustedMonth >= 5 && adjustedMonth <= 5) return 'Late Spring';  // May (N) / Nov (S)
    if (adjustedMonth >= 6 && adjustedMonth <= 8) return 'Summer';       // Jun-Aug (N) / Dec-Feb (S)
    if (adjustedMonth >= 9 && adjustedMonth <= 10) return 'Autumn';      // Sep-Oct (N) / Mar-Apr (S)
    if (adjustedMonth >= 11 && adjustedMonth <= 11) return 'Late Autumn'; // Nov (N) / May (S)
    // Months 12, 1, 2 (N) / Jun, Jul, Aug (S)
    return 'Winter';
}

// Helper function to get seasonal quality/flavor (needs reference data)
function getSeasonalProfileData(seasonName) {
    // Use the directly imported seasonalProfiles and seasonalDescriptions
    const profile = seasonalProfiles[seasonName] || seasonalProfiles["Unknown"];
    const description = seasonalDescriptions[seasonName] || seasonalDescriptions["Unknown"];
    
    return {
        qualityIndicator: profile.qualityIndicator || "Standard",
        flavorProfileDescription: Array.isArray(profile.typicalFlavorNotes) ? profile.typicalFlavorNotes.join(', ') : "Typical seasonal notes",
        fullDescription: description
    };
}

// Helper to aggregate influence notes from reference data
function getInfluenceNotes(category, reference) {
    if (!category || category === "Unknown" || !reference || !reference[category]) {
        return [];
    }
    const data = reference[category];
    let notes = [];
    if(Array.isArray(data.flavorInfluenceNotes)) notes = notes.concat(data.flavorInfluenceNotes);
    if(Array.isArray(data.mouthFeelInfluenceNotes)) notes = notes.concat(data.mouthFeelInfluenceNotes);
    if(Array.isArray(data.compoundTendencyNotes)) notes = notes.concat(data.compoundTendencyNotes);
    return notes;
}


export class GeographyCalculator extends BaseCalculator {
    constructor(config) {
        super(config);
    }

    // Override infer method from BaseCalculator
    infer(tea) {
        // Initialize the trace array
        let trace = [];
        
        const geoInput = tea?.geography;
        if (!geoInput || typeof geoInput !== 'object' || Object.keys(geoInput).length === 0) {
            trace.push({ 
                step: "Input Validation", 
                reason: "Missing geography data", 
                adjustment: "Using default values", 
                value: "No geographical data available" 
            });
            
            return {
                description: 'No geographical data available.',
                location: {},
                climate: {},
                season: {},
                analysis: {},
                trace
            };
        }

        const { altitude, humidity, latitude, longitude, temperature, solarRadiation, harvestMonth } = geoInput;
        
        trace.push({ 
            step: "Input Processing", 
            reason: "Raw tea geography data", 
            adjustment: "Extracting geographical parameters", 
            value: `Lat: ${latitude}, Lon: ${longitude}, Alt: ${altitude}, Humidity: ${humidity}, Temp: ${temperature}, Radiation: ${solarRadiation}, Month: ${harvestMonth}` 
        });

        // --- Location Analysis ---
        const regionInfo = (typeof latitude === 'number' && typeof longitude === 'number')
            ? identifyRegionFromCoordinates(latitude, longitude) // Assumes this returns { region, country, subregion, description, influenceNotes: [] }
            : { region: tea.origin || "Unknown", country: "Unknown", subregion: null, description: "Region determined by origin string.", influenceNotes: [] };

        trace.push({ 
            step: "Region Identification", 
            reason: `Lat: ${latitude}, Lon: ${longitude}`, 
            adjustment: `Identified Region: ${regionInfo.region}, Country: ${regionInfo.country}${regionInfo.subregion ? ', Subregion: ' + regionInfo.subregion : ''}`, 
            value: regionInfo.description 
        });

        const location = {
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            regionName: regionInfo.region,
            countryName: regionInfo.country,
            subRegionName: regionInfo.subregion,
            regionDescription: regionInfo.description
        };

        // --- Climate Analysis ---
        const altitudeCategory = categorizeMeasurement(altitude, elevationLevels);
        trace.push({ 
            step: "Altitude Categorization", 
            reason: `Altitude: ${altitude}`, 
            adjustment: `Categorized as: ${altitudeCategory}`, 
            value: altitudeCategory 
        });
        
        const latitudeZone = categorizeMeasurement(Math.abs(latitude), latitudeZones);
        trace.push({ 
            step: "Latitude Zone Determination", 
            reason: `Latitude: ${latitude}`, 
            adjustment: `Categorized as: ${latitudeZone}`, 
            value: latitudeZone 
        });
        
        const humidityCategory = categorizeMeasurement(humidity, humidityLevels);
        trace.push({ 
            step: "Humidity Categorization", 
            reason: `Humidity: ${humidity}`, 
            adjustment: `Categorized as: ${humidityCategory}`, 
            value: humidityCategory 
        });
        
        const temperatureCategory = categorizeMeasurement(temperature, temperatureLevels);
        trace.push({ 
            step: "Temperature Categorization", 
            reason: `Temperature: ${temperature}`, 
            adjustment: `Categorized as: ${temperatureCategory}`, 
            value: temperatureCategory 
        });
        
        const solarRadiationCategory = categorizeMeasurement(solarRadiation, solarRadiationLevels);
        trace.push({ 
            step: "Solar Radiation Categorization", 
            reason: `Solar Radiation: ${solarRadiation}`, 
            adjustment: `Categorized as: ${solarRadiationCategory}`, 
            value: solarRadiationCategory 
        });

        const climate = {
            altitude: altitude ?? null,
            altitudeCategory,
            humidity: humidity ?? null,
            humidityCategory,
            temperature: temperature ?? null,
            temperatureCategory,
            solarRadiation: solarRadiation ?? null,
            solarRadiationCategory,
            latitudeZone
        };

        // --- Season Analysis ---
        const harvestSeason = getSeasonName(harvestMonth, latitude);
        trace.push({ 
            step: "Season Determination", 
            reason: `Month: ${harvestMonth}, Lat: ${latitude}`, 
            adjustment: `Determined Season: ${harvestSeason}`, 
            value: harvestSeason 
        });
        
        const hemisphere = (typeof latitude === 'number') ? (latitude >= 0 ? 'Northern' : 'Southern') : 'Unknown';
        const seasonalProfileData = getSeasonalProfileData(harvestSeason);
        
        trace.push({ 
            step: "Seasonal Profile Lookup", 
            reason: `Season: ${harvestSeason}`, 
            adjustment: `Quality: ${seasonalProfileData.qualityIndicator}`, 
            value: seasonalProfileData.flavorProfileDescription 
        });

        const season = {
            harvestMonth: harvestMonth ?? null,
            harvestSeason,
            hemisphere,
            qualityIndicator: seasonalProfileData.qualityIndicator,
            seasonalFlavorProfile: seasonalProfileData.flavorProfileDescription,
            seasonalDescription: seasonalProfileData.fullDescription // Full description for context
        };

        // --- Aggregate Impact Analysis ---
        let flavorInfluenceNotes = [];
        let mouthFeelInfluenceNotes = [];
        let compoundTendencyNotes = [];

        // Helper to add notes without duplicates
        const addNotes = (targetArray, notesToAdd, category, sourceDesc) => {
            if (Array.isArray(notesToAdd) && notesToAdd.length > 0) {
                trace.push({ 
                    step: "Influence Note Aggregation", 
                    reason: `Category: ${category}`, 
                    adjustment: `Added ${targetArray === flavorInfluenceNotes ? 'flavor' : targetArray === mouthFeelInfluenceNotes ? 'mouthfeel' : 'compound'} notes from ${sourceDesc}`, 
                    value: notesToAdd.join(', ') 
                });
                
                notesToAdd.forEach(note => {
                    if (!targetArray.includes(note)) targetArray.push(note);
                });
            }
        };

        // Add notes from reference data based on categories
        addNotes(flavorInfluenceNotes, elevationLevels[altitudeCategory]?.flavorInfluence, altitudeCategory, 'elevationLevels');
        addNotes(mouthFeelInfluenceNotes, elevationLevels[altitudeCategory]?.mouthFeelInfluence, altitudeCategory, 'elevationLevels'); // Assuming reference data is updated
        addNotes(compoundTendencyNotes, elevationLevels[altitudeCategory]?.compoundTendency, altitudeCategory, 'elevationLevels');

        addNotes(flavorInfluenceNotes, latitudeZones[latitudeZone]?.flavorInfluence, latitudeZone, 'latitudeZones');
        // ... add mouthfeel/compound notes for latitude if defined ...

        addNotes(flavorInfluenceNotes, humidityLevels[humidityCategory]?.flavorInfluence, humidityCategory, 'humidityLevels');
        addNotes(mouthFeelInfluenceNotes, humidityLevels[humidityCategory]?.mouthFeelInfluence, humidityCategory, 'humidityLevels');
        // ... compound notes ...

        addNotes(flavorInfluenceNotes, temperatureLevels[temperatureCategory]?.flavorInfluence, temperatureCategory, 'temperatureLevels');
        // ... mouthfeel/compound notes ...

        addNotes(flavorInfluenceNotes, solarRadiationLevels[solarRadiationCategory]?.flavorInfluence, solarRadiationCategory, 'solarRadiationLevels');
        addNotes(compoundTendencyNotes, solarRadiationLevels[solarRadiationCategory]?.compoundTendency, solarRadiationCategory, 'solarRadiationLevels');
        // ... mouthfeel notes ...

        // Add notes from specific region data if available
        addNotes(flavorInfluenceNotes, regionInfo.influenceNotes, regionInfo.region, 'regionInfo'); // Assuming identifyRegion returns influenceNotes array
        addNotes(flavorInfluenceNotes, regionCharacteristics[regionInfo.region.toLowerCase()]?.flavorNotes, regionInfo.region, 'regionCharacteristics'); // Add more specific notes if available


        const analysis = {
            flavorInfluenceNotes,
            mouthFeelInfluenceNotes,
            compoundTendencyNotes
            // Seasonal impacts are part of the 'season' object now
        };
        
        trace.push({ 
            step: "Analysis Aggregation", 
            reason: "Combining all influences", 
            adjustment: `Total flavor notes: ${flavorInfluenceNotes.length}, mouthfeel notes: ${mouthFeelInfluenceNotes.length}, compound notes: ${compoundTendencyNotes.length}`, 
            value: `Sample flavor notes: ${flavorInfluenceNotes.slice(0, 3).join(', ')}${flavorInfluenceNotes.length > 3 ? '...' : ''}` 
        });

        // --- Generate Description ---
        const description = this.generateGeoDescription(location, climate, season, analysis, tea?.type);
        
        trace.push({ 
            step: "Description Generation", 
            reason: "Summarizing geography analysis", 
            adjustment: "Generated human-readable description", 
            value: description.substring(0, 50) + "..." // Truncate for trace
        });

        return {
            description,
            location,
            climate,
            season,
            analysis,
            trace
        };
    }

    // Generate a description based on geo/season data and analysis
    generateGeoDescription(loc, clim, seas, analysis, teaType) {
        let desc = `This ${teaType || 'tea'} originates from ${loc.regionName || 'an unknown region'}`;
        if (loc.countryName !== "Unknown" && loc.countryName !== loc.regionName) desc += `, ${loc.countryName}`;
        desc += ". ";
        if (loc.regionDescription) desc += `${loc.regionDescription} `;

        desc += `Grown in a ${clim.altitudeCategory !== "Unknown" ? clim.altitudeCategory.toLowerCase() + ' altitude (' + clim.altitude + 'm), ' : ''}`;
        desc += `${clim.latitudeZone !== "Unknown" ? clim.latitudeZone.toLowerCase() + ' latitude zone, ' : ''}`;
        desc += `experiencing ${clim.humidityCategory !== "Unknown" ? clim.humidityCategory.toLowerCase() + ' humidity' : 'unspecified humidity'}`;
        if (clim.temperatureCategory !== "Unknown") desc += ` and ${clim.temperatureCategory.toLowerCase()} temperatures. `;
        else desc += ". ";

        if (seas.harvestSeason !== "Unknown") {
            desc += `Harvested in ${seas.harvestSeason} (${seas.hemisphere} hemisphere), suggesting a quality indicator of '${seas.qualityIndicator}' and typically featuring ${seas.seasonalFlavorProfile} notes. `;
        }

        // Summarize influences
        if (analysis.flavorInfluenceNotes?.length > 0 || analysis.mouthFeelInfluenceNotes?.length > 0) {
            desc += "These geographical and seasonal factors likely contribute to ";
            let influences = [];
            if (analysis.flavorInfluenceNotes?.length > 0) influences.push(`flavor aspects like [${analysis.flavorInfluenceNotes.join('; ')}]`);
            if (analysis.mouthFeelInfluenceNotes?.length > 0) influences.push(`mouthfeel characteristics such as [${analysis.mouthFeelInfluenceNotes.join('; ')}]`);
            desc += influences.join(' and ') + ".";
        }

        return desc.trim();
    }

    // Override formatInference from BaseCalculator
    formatInference(inference) {
         if (!inference || !inference.location || Object.keys(inference.location).length === 0) {
             return '## Geographical & Seasonal Analysis\n\nNo geographical data available.';
         }

        let md = '## Geographical & Seasonal Analysis\n\n';
        md += `${inference.description}\n\n`;

        // Location Details
        md += '### Location Details\n';
        md += `- **Region:** ${inference.location.regionName || 'N/A'}\n`;
        if (inference.location.countryName !== "Unknown") md += `- **Country:** ${inference.location.countryName}\n`;
        if (inference.location.subRegionName) md += `- **Sub-Region:** ${inference.location.subRegionName}\n`;
        if (inference.location.latitude !== null) md += `- **Coordinates:** ${inference.location.latitude?.toFixed(2)}°, ${inference.location.longitude?.toFixed(2)}°\n`;

        // Climate Details
        md += '\n### Climate & Growing Conditions\n';
        const clim = inference.climate;
        if (clim.altitude !== null) md += `- **Altitude:** ${clim.altitude}m (${clim.altitudeCategory})\n`;
        if (clim.humidity !== null) md += `- **Humidity:** ${clim.humidity}% (${clim.humidityCategory})\n`;
        if (clim.temperature !== null) md += `- **Avg. Temp:** ${clim.temperature}°C (${clim.temperatureCategory})\n`;
        if (clim.solarRadiation !== null) md += `- **Solar Rad.:** ${clim.solarRadiation} W/m² (${clim.solarRadiationCategory})\n`;
        if (clim.latitudeZone !== "Unknown") md += `- **Latitude Zone:** ${clim.latitudeZone}\n`;

        // Season Details
        md += '\n### Harvest Season Details\n';
        const seas = inference.season;
        if (seas.harvestMonth !== null) md += `- **Harvest Month:** ${seas.harvestMonth} (${seas.hemisphere} Hemisphere)\n`;
        md += `- **Determined Season:** ${seas.harvestSeason}\n`;
        md += `- **Typical Quality:** ${seas.qualityIndicator}\n`;
        md += `- **Typical Seasonal Profile:** ${seas.seasonalFlavorProfile}\n`;
        // Optionally add seas.seasonalDescription here

        // Impact Analysis
        md += '\n### Geographic & Seasonal Impact Analysis\n';
        const analysis = inference.analysis;
        if (analysis && (analysis.flavorInfluenceNotes?.length > 0 || analysis.mouthFeelInfluenceNotes?.length > 0 || analysis.compoundTendencyNotes?.length > 0)) {
            if(analysis.flavorInfluenceNotes?.length > 0) md += `- **Potential Flavor Influences:** ${analysis.flavorInfluenceNotes.join(', ')}\n`;
            if(analysis.mouthFeelInfluenceNotes?.length > 0) md += `- **Potential Mouthfeel Influences:** ${analysis.mouthFeelInfluenceNotes.join(', ')}\n`;
            if(analysis.compoundTendencyNotes?.length > 0) md += `- **Potential Compound Tendencies:** ${analysis.compoundTendencyNotes.join(', ')}\n`;
        } else {
            md += 'No specific impacts identified from reference data based on available categories.\n';
        }

        return md;
    }

    // Override serialize from BaseCalculator
    serialize(inference) {
        // Handle case where inference might be minimal
        const description = inference?.description || 'No geographical data available.';
        const location = inference?.location || {};
        const climate = inference?.climate || {};
        const season = inference?.season || {};
        const analysis = inference?.analysis || {};

        if (Object.keys(location).length === 0 && Object.keys(climate).length === 0 && Object.keys(season).length === 0) {
            return {
                geography: { // Keep consistent top-level key
                    description: description,
                    location: {}, climate: {}, season: {}, analysis: {},
                    _sectionRef: "geography"
                }
            };
        }

        return {
             geography: { // Keep consistent top-level key
                description: description,
                location: location,
                climate: climate,
                season: season,
                analysis: analysis, // Serialize the new analysis object
                _sectionRef: "geography" // Keep if you use references
            }
        };
    }
}