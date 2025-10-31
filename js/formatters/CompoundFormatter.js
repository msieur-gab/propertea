// js/formatters/CompoundFormatter.js
import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the compound analysis results into Markdown.
 * @param {object} compoundAnalysis - The compound analysis object from TeaInsights/CompoundCalculator.
 * Expected properties: description, levels: { caffeineLevel, lTheanineLevel, lTheanineToCaffeineRatio }, analysis: { ratioCategory, stimulationLevel, relaxationLevel, compoundProfile }
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatCompoundAnalysis(compoundAnalysis, teaName) {
    let markdown = `# Compound Analysis for ${teaName}\n\n`;

    // Check if essential data is missing
    if (!compoundAnalysis || !compoundAnalysis.levels || (compoundAnalysis.levels.caffeineLevel === 0 && compoundAnalysis.levels.lTheanineLevel === 0)) {
        return markdown + '*No significant compound data available.*\n';
    }

    // Add description
    markdown += `${compoundAnalysis.description || 'No description provided.'}\n\n`;

    // Add compound level details
    markdown += '## Compound Levels\n\n'; // Changed from ### to ##
    const { levels } = compoundAnalysis;
    // Use formatScoreWithBar for levels (assuming they are 0-10)
    markdown += `- **Caffeine:** ${formatScoreWithBar(levels.caffeineLevel ?? 0, 10)}\n`;
    markdown += `- **L-Theanine:** ${formatScoreWithBar(levels.lTheanineLevel ?? 0, 10)}\n`;
    if (levels.lTheanineToCaffeineRatio !== undefined && levels.lTheanineToCaffeineRatio > 0 && levels.caffeineLevel > 0) {
       markdown += `- **L-Theanine:Caffeine Ratio:** ${levels.lTheanineToCaffeineRatio.toFixed(2)}\n`;
    }
    markdown += '\n';

    // Add Compound Impact Analysis section
    markdown += `## Compound Impact Analysis\n\n`; // Changed from ### to ##
    const { analysis } = compoundAnalysis;
    if (analysis && Object.keys(analysis).length > 0 && analysis.ratioCategory !== "N/A") {
         markdown += `- **Ratio Category:** ${analysis.ratioCategory || 'N/A'}\n`;
         markdown += `- **Stimulation Level:** ${analysis.stimulationLevel || 'N/A'}\n`;
         markdown += `- **Relaxation Level:** ${analysis.relaxationLevel || 'N/A'}\n`;
         markdown += `- **Resulting Compound Profile:** ${analysis.compoundProfile || 'N/A'}\n`;
    } else if (analysis && (analysis.stimulationLevel !== "None" || analysis.relaxationLevel !== "None")) {
         // Handle cases with only caffeine or only theanine significant
         if (analysis.stimulationLevel && analysis.stimulationLevel !== "None") markdown += `- **Stimulation Level:** ${analysis.stimulationLevel}\n`;
         if (analysis.relaxationLevel && analysis.relaxationLevel !== "None") markdown += `- **Relaxation Level:** ${analysis.relaxationLevel}\n`;
    } else {
         markdown += '*No specific impact analysis available.*\n';
    }

    return markdown;
}