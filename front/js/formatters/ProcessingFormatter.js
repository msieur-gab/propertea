// js/formatters/ProcessingFormatter.js
import { formatString } from '../utils/markdownUtils.js';

/**
 * Formats the processing analysis results into Markdown.
 * @param {object} processingAnalysis - The processing analysis object from TeaInsights/ProcessingCalculator.
 * Expected properties: description, appliedMethods, oxidationLevel, roastLevel, analysis: { flavorImpact, bodyImpact, energeticTendency, alertnessImpactModifier, compoundImpactNotes }
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatProcessingAnalysis(processingAnalysis, teaName) {
    let markdown = `# Processing Analysis for ${teaName}\n\n`;

    // Check for minimal data
    if (!processingAnalysis || (!processingAnalysis.appliedMethods?.length && processingAnalysis.oxidationLevel < 0)) {
        return markdown + '*No significant processing data available.*\n';
    }

    // Add description
    markdown += `${processingAnalysis.description || 'No description provided.'}\n\n`;

    // Add Processing Details section
    markdown += '## Processing Details\n\n'; // Changed from ### to ##
    markdown += `- **Applied Methods:** ${processingAnalysis.appliedMethods?.length ? processingAnalysis.appliedMethods.map(formatString).join(', ') : 'None specified'}\n`;
    if (processingAnalysis.oxidationLevel !== undefined && processingAnalysis.oxidationLevel >= 0) {
        markdown += `- **Oxidation Level:** ${processingAnalysis.oxidationLevel}%\n`;
    }
     if (processingAnalysis.roastLevel && processingAnalysis.roastLevel !== "Unknown") {
         markdown += `- **Determined Roast Level:** ${formatString(processingAnalysis.roastLevel)}\n`;
     }
    markdown += '\n';

    // Add Processing Impact Analysis section
    markdown += `## Processing Impact Analysis\n\n`; // Changed from ### to ##
    const { analysis } = processingAnalysis;
    // Check if there's any meaningful analysis data beyond defaults
    const hasImpactData = analysis && Object.values(analysis).some(v =>
        v !== null && v !== "neutral" && v !== "Unchanged" && (!Array.isArray(v) || v.length > 0)
    );

    if (hasImpactData) {
         const formatImpactItem = (label, value) => {
             if (value && (!Array.isArray(value) || value.length > 0)) {
                 const displayValue = Array.isArray(value) ? value.map(formatString).join(', ') : formatString(value);
                 return `- **${label}:** ${displayValue}\n`;
             }
             return '';
         };

         markdown += formatImpactItem("Flavor Impact", analysis.flavorImpact);
         markdown += formatImpactItem("Body Impact", analysis.bodyImpact === "Unchanged" ? null : analysis.bodyImpact); // Don't show if default
         markdown += formatImpactItem("Energetic Tendency", analysis.energeticTendency === "neutral" ? null : analysis.energeticTendency); // Don't show if default
         markdown += formatImpactItem("Alertness Impact Modifier", analysis.alertnessImpactModifier === "neutral" ? null : analysis.alertnessImpactModifier); // Don't show if default
         markdown += formatImpactItem("Potential Compound Impact Notes", analysis.compoundImpactNotes);
    } else {
         markdown += '*No specific processing impacts identified from reference data.*\n';
    }

    return markdown;
}