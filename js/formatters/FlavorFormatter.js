// js/formatters/FlavorFormatter.js
import { formatString } from '../utils/markdownUtils.js';

/**
 * Formats the flavor analysis results into Markdown.
 * @param {object} flavorAnalysis - The flavor analysis object from TeaInsights/FlavorCalculator.
 * Expected properties: description, profile: { identified, dominant, categories, intensity }, analysis: { foodPairingHints, seasonalAffinityHints, activityHints }
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatFlavorAnalysis(flavorAnalysis, teaName) {
    let markdown = `# Flavor Analysis for ${teaName}\n\n`;

    // Check for minimal data
    if (!flavorAnalysis || !flavorAnalysis.profile || !flavorAnalysis.profile.identified?.length) {
        return markdown + '*No flavor profile available.*\n';
    }

    markdown += `${flavorAnalysis.description || 'No description provided.'}\n\n`;

    markdown += `## Flavor Details\n\n`; // Changed from ### to ##
    const profile = flavorAnalysis.profile;
    if (profile) { // Check if profile object exists
        const formatFlavorList = (label, flavors) => {
            if (flavors?.length > 0) {
                return `- **${label}:** ${flavors.map(formatString).join(', ')}\n`;
            }
            return `- **${label}:** N/A\n`;
        };
        markdown += formatFlavorList("Identified Notes", profile.identified);
        markdown += formatFlavorList("Dominant Notes", profile.dominant);
        markdown += formatFlavorList("Dominant Categories", profile.categories);
        markdown += `- **Estimated Intensity:** ${formatString(profile.intensity) || 'N/A'}\n`;
    } else {
        markdown += '*No flavor details available.*\n';
    }
    markdown += '\n';


    markdown += `## Flavor Profile Associations (Hints)\n\n`; // Changed from ### to ##
    const { analysis } = flavorAnalysis;
    const hasHints = analysis && (analysis.foodPairingHints?.length > 0 || analysis.seasonalAffinityHints?.length > 0 || analysis.activityHints?.length > 0);

    if (hasHints) {
        const formatHintList = (label, hints) => {
             if (hints?.length > 0) {
                 return `- **${label}:** ${hints.map(formatString).join(', ')}\n`;
             }
             return '';
         };
        markdown += formatHintList("Potential Food Pairings", analysis.foodPairingHints);
        markdown += formatHintList("Seasonal Affinity", analysis.seasonalAffinityHints);
        markdown += formatHintList("Potential Activity Associations", analysis.activityHints);
    } else {
        markdown += '*No specific associations identified from reference data for the provided flavors.*\n';
    }

    return markdown;
}