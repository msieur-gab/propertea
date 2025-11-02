// js/formatters/TeaTypeFormatter.js
import { formatString } from '../utils/markdownUtils.js'; // Assuming formatString handles capitalization

/**
 * Formats the tea type analysis results into Markdown.
 * @param {object} teaTypeAnalysis - The tea type analysis object from TeaInsights/TeaTypeCalculator.
 * Expected properties: primaryType, subType, description, analysis: { typicalCaffeine, typicalTheanine, dominantFlavorCategories, seasonalTendency, baseTimeOfDay, baseActivityHints, commonProcessing }
 * @param {string} teaName - The name of the tea (used for context in case analysis is minimal).
 * @returns {string} Formatted Markdown string.
 */
export function formatTeaTypeAnalysis(teaTypeAnalysis, teaName) {
    // Handle cases where analysis might be missing or minimal
    if (!teaTypeAnalysis || !teaTypeAnalysis.primaryType || teaTypeAnalysis.primaryType === 'unknown') {
        return `# Tea Type Analysis for ${teaName}\n\n*No specific tea type data available.*\n`;
    }

    let markdown = `# Tea Type Analysis: ${formatString(teaTypeAnalysis.primaryType)}`;
    if (teaTypeAnalysis.subType) {
         markdown += ` (${formatString(teaTypeAnalysis.subType)})`;
    }
    markdown += '\n\n';

    // Add description
    markdown += `${teaTypeAnalysis.description || 'No description provided.'}\n\n`;

    // Add Type Characteristics & Tendencies section
    markdown += '## Baseline Characteristics & Tendencies\n\n'; // Changed from ### to ## for consistency
    const analysis = teaTypeAnalysis.analysis;
    if (analysis && Object.keys(analysis).length > 0) {
        // Helper to format list items, handling undefined/empty arrays
        const formatListItem = (label, value) => {
            let displayValue = 'N/A';
            if (value) {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        displayValue = value.map(formatString).join(', ');
                    }
                } else {
                    displayValue = formatString(value);
                }
            }
            return `- **${label}:** ${displayValue}\n`;
        };

        markdown += formatListItem("Typical Caffeine", analysis.typicalCaffeine);
        markdown += formatListItem("Typical L-Theanine", analysis.typicalTheanine);
        markdown += formatListItem("Dominant Flavor Families", analysis.dominantFlavorCategories);
        markdown += formatListItem("Common Processing", analysis.commonProcessing);
        markdown += formatListItem("Seasonal Tendency", analysis.seasonalTendency);
        markdown += formatListItem("Typical Time of Day", analysis.baseTimeOfDay);
        markdown += formatListItem("Common Activity Associations", analysis.baseActivityHints);
    } else {
        markdown += '*No specific characteristics analysis available.*\n';
    }

    return markdown;
}