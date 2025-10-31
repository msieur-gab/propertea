// js/formatters/GeographyFormatter.js
import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js'; // Assuming formatScoreWithBar might be useful later

/**
 * Formats the geographical and seasonal analysis results into Markdown.
 * @param {object} geoAnalysis - The geography analysis object from TeaInsights/GeographyCalculator.
 * Expected properties: description, location, climate, season, analysis
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatGeographyAnalysis(geoAnalysis, teaName) {
    let markdown = `# Geographical & Seasonal Analysis for ${teaName}\n\n`;

    // Check for minimal data
    if (!geoAnalysis || !geoAnalysis.location || Object.keys(geoAnalysis.location).length === 0) {
        return markdown + '*No geographical data available.*\n';
    }

    markdown += `${geoAnalysis.description || 'No description provided.'}\n\n`;

    // Location Details
    markdown += '## Location Details\n\n'; // Changed from ### to ##
    const loc = geoAnalysis.location;
    markdown += `- **Region:** ${formatString(loc.regionName) || 'N/A'}\n`;
    if (loc.countryName && loc.countryName !== "Unknown") markdown += `- **Country:** ${formatString(loc.countryName)}\n`;
    if (loc.subRegionName) markdown += `- **Sub-Region:** ${formatString(loc.subRegionName)}\n`;
    if (loc.latitude !== null && loc.longitude !== null) {
        markdown += `- **Coordinates:** ${loc.latitude?.toFixed(2)}°, ${loc.longitude?.toFixed(2)}°\n`;
    }
    markdown += '\n';

    // Climate Details
    markdown += '## Climate & Growing Conditions\n\n'; // Changed from ### to ##
    const clim = geoAnalysis.climate;
    if (clim) { // Check if climate object exists
        if (clim.altitude !== null) markdown += `- **Altitude:** ${clim.altitude}m (${formatString(clim.altitudeCategory)})\n`;
        if (clim.humidity !== null) markdown += `- **Humidity:** ${clim.humidity}% (${formatString(clim.humidityCategory)})\n`;
        if (clim.temperature !== null) markdown += `- **Avg. Temp:** ${clim.temperature}°C (${formatString(clim.temperatureCategory)})\n`;
        if (clim.solarRadiation !== null) markdown += `- **Solar Rad.:** ${clim.solarRadiation} W/m² (${formatString(clim.solarRadiationCategory)})\n`;
        if (clim.latitudeZone && clim.latitudeZone !== "Unknown") markdown += `- **Latitude Zone:** ${formatString(clim.latitudeZone)}\n`;
    } else {
        markdown += '*No climate details available.*\n';
    }
    markdown += '\n';

    // Season Details
    markdown += '## Harvest Season Details\n\n'; // Changed from ### to ##
    const seas = geoAnalysis.season;
    if (seas) { // Check if season object exists
        if (seas.harvestMonth !== null) markdown += `- **Harvest Month:** ${seas.harvestMonth} (${formatString(seas.hemisphere)} Hemisphere)\n`;
        if (seas.harvestSeason && seas.harvestSeason !== "Unknown") markdown += `- **Determined Season:** ${formatString(seas.harvestSeason)}\n`;
        if (seas.qualityIndicator) markdown += `- **Typical Quality:** ${formatString(seas.qualityIndicator)}\n`;
        if (seas.seasonalFlavorProfile) markdown += `- **Typical Seasonal Profile:** ${formatString(seas.seasonalFlavorProfile)}\n`;
        // Optionally add seas.seasonalDescription here if desired
    } else {
        markdown += '*No harvest season details available.*\n';
    }
    markdown += '\n';

    // Impact Analysis
    markdown += '## Geographic & Seasonal Impact Analysis\n\n'; // Changed from ### to ##
    const analysis = geoAnalysis.analysis;
    const hasImpactData = analysis && (analysis.flavorInfluenceNotes?.length > 0 || analysis.mouthFeelInfluenceNotes?.length > 0 || analysis.compoundTendencyNotes?.length > 0);

    if (hasImpactData) {
        const formatImpactList = (label, notes) => {
            if (notes?.length > 0) {
                return `- **${label}:** ${notes.map(formatString).join(', ')}\n`;
            }
            return '';
        };
        markdown += formatImpactList("Potential Flavor Influences", analysis.flavorInfluenceNotes);
        markdown += formatImpactList("Potential Mouthfeel Influences", analysis.mouthFeelInfluenceNotes);
        markdown += formatImpactList("Potential Compound Tendencies", analysis.compoundTendencyNotes);
    } else {
        markdown += '*No specific impacts identified from reference data based on available categories.*\n';
    }

    return markdown;
}