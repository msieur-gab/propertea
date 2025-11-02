// js/formatters/BrewingFormatter.js
import { formatString } from '../utils/markdownUtils.js'; // Only need formatString now

/**
 * Formats the brewing analysis results (Gongfu and Western) into Markdown.
 * @param {object} brewingAnalysis - The brewing analysis object containing { gongfu: {...}, western: {...} }.
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatBrewingAnalysis(brewingAnalysis, teaName) {
    let markdown = `# Brewing Recommendations for ${teaName}\n\n`;

    if (!brewingAnalysis || (!brewingAnalysis.gongfu && !brewingAnalysis.western)) {
        return markdown + `*No brewing analysis available or calculation failed.*\n\n`;
    }

    // --- Helper to format a single style ---
    const formatStyle = (styleName, info) => {
        // Check if the info object exists and doesn't contain an error property
        if (!info || info.error) {
            return `## ${formatString(styleName)} Style\n\n*Error: ${info?.error || 'Could not retrieve recommendations.'}*\n\n`;
        }

        let markdown = `## ${formatString(styleName)} Style\n\n`;
        let detailsFound = false;

        if (info.leafAmount) {
            markdown += `- **Leaf Amount:** ${info.leafAmount}\n`;
            detailsFound = true;
        }
        if (info.waterTemp) {
            markdown += `- **Water Temp:** ${info.waterTemp}\n`;
            detailsFound = true;
        }
        if (info.steepingTime !== undefined) { // Check for existence, even if 0
            if (Array.isArray(info.steepingTime)) {
                markdown += `- **Steeping Time (s):** ${info.steepingTime.join(' → ')} (for infusions 1, 2, 3, 4+)\n`;
            } else {
                // Assuming Western style might just have a single number in minutes
                markdown += `- **Steeping Time (min):** ${info.steepingTime}\n`;
            }
            detailsFound = true;
        }
        if (info.rinseTimes !== undefined && info.rinseTimes > 0) {
            markdown += `- **Rinses:** ${info.rinseTimes}\n`;
            detailsFound = true;
        }
        if (info.vesselRecommendation && info.vesselRecommendation.preferred) {
            markdown += `- **Vessel:** ${info.vesselRecommendation.preferred.join(' / ')}\n`;
            if (info.vesselRecommendation.notes) {
                markdown += `  - *Note:* ${info.vesselRecommendation.notes}\n`;
            }
            detailsFound = true;
        }
        if (info.notes) {
            markdown += `- **Brewing Notes:** ${info.notes}\n`;
            detailsFound = true;
        }
         if (info.teas) { // If the matched rule included example teas
             markdown += `- **Example Teas for this Rule:** ${info.teas.join(' / ')}\n`;
             detailsFound = true;
         }

        if (!detailsFound) {
            markdown += `*No specific parameters found for this style.*\n`;
        }

        markdown += '\n'; // Add spacing after the section
        return markdown;
    };
    // --- End Helper ---

    // Format Gongfu Style
    if (brewingAnalysis.gongfu) {
        markdown += formatStyle("Gongfu", brewingAnalysis.gongfu);
    } else {
        markdown += `## Gongfu Style\n\n*No specific Gongfu recommendations found.*\n\n`;
    }

    // Format Western Style
    if (brewingAnalysis.western) {
        markdown += formatStyle("Western", brewingAnalysis.western);
    } else {
        markdown += `## Western Style\n\n*No specific Western recommendations found.*\n\n`;
    }

    // Add general explanation about the logic
    markdown += `## Brewing Logic\n\n`;
    markdown += `Recommendations are based on tea type, processing, leaf characteristics, and traditional practices for each style.\n`;

    return markdown;
}