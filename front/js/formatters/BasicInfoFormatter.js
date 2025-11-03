// js/formatters/BasicInfoFormatter.js

// Import necessary utilities from markdownUtils
// Adjust the path ('../utils/') if your formatters directory is nested differently
import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the basic raw information of a tea object into Markdown.
 * @param {object} tea - The raw tea object (likely from TeaDatabase).
 * @returns {string} Formatted Markdown string.
 */
export function formatBasicTeaInfo(tea) {
    if (!tea) return '*No tea data provided.*\n';

    let markdown = `# ${tea.name || 'Unnamed Tea'}\n`;
    if (tea.originalName) markdown += `*${tea.originalName}*\n`;
    markdown += '\n'; // Add a line break

    markdown += `## Basic Information\n\n`;
    markdown += `**Type:** ${formatString(tea.type || 'N/A')}\n`;
    if (tea.subType) markdown += `**Sub-Type:** ${formatString(tea.subType)}\n`;
    markdown += `**Origin:** ${formatString(tea.origin || 'N/A')}\n\n`;

    // Chemical Composition
    markdown += `## Chemical Composition (raw estimates)\n\n`;
    // Assuming formatScoreWithBar exists and works on a 0-10 scale
    if (tea.caffeineLevel !== undefined) {
        markdown += `**Caffeine Level:** ${formatScoreWithBar(tea.caffeineLevel, 10)}\n`;
    }
    if (tea.lTheanineLevel !== undefined) {
        markdown += `**L-Theanine Level:** ${formatScoreWithBar(tea.lTheanineLevel, 10)}\n`;
    }
    if (tea.catechinLevel !== undefined) { // Add other compounds if they exist
         markdown += `**Catechin Level:** ${formatScoreWithBar(tea.catechinLevel, 10)}\n`;
     }
    // Add ratio if possible
    if (tea.lTheanineLevel !== undefined && tea.caffeineLevel !== undefined && tea.caffeineLevel > 0) {
        const ratio = tea.lTheanineLevel / tea.caffeineLevel;
        markdown += `**L-Theanine:Caffeine Ratio:** ~${ratio.toFixed(2)}\n`;
    }
    markdown += '\n';

    // Flavor Profile
    markdown += `## Flavor Profile (raw)\n\n`;
    // Adjusting for potential structures: tea.flavorProfile or tea.flavor.primary
    let primaryFlavors = tea.flavorProfile || tea.flavor?.primary;
    if (primaryFlavors && Array.isArray(primaryFlavors) && primaryFlavors.length > 0) {
         markdown += `**Primary Notes:** ${primaryFlavors.map(formatString).join(', ')}\n`;
    } else {
         markdown += `*No primary flavor notes listed.*\n`;
    }
    if (tea.flavor?.secondary && Array.isArray(tea.flavor.secondary) && tea.flavor.secondary.length > 0) {
         markdown += `**Secondary Notes:** ${tea.flavor.secondary.map(formatString).join(', ')}\n`;
     }
    if (tea.flavor?.notes) {
        markdown += `**Tasting Notes:** ${tea.flavor.notes}\n`;
    }
    markdown += '\n';

    // Processing Methods
    markdown += `## Processing Methods (raw)\n\n`;
     // Adjusting for potential structures: tea.processingMethods or tea.processing.methods
     let processingMethods = tea.processingMethods || tea.processing?.methods;
    if (processingMethods && Array.isArray(processingMethods) && processingMethods.length > 0) {
         markdown += processingMethods.map(method => `- ${formatString(method)}`).join('\n') + '\n';
    } else {
         markdown += `*No processing methods listed.*\n`;
    }
     if (tea.processing?.oxidationLevel !== undefined) {
         markdown += `**Oxidation Level:** ${tea.processing.oxidationLevel}%\n`;
     }
    markdown += '\n';

    // Geography
    if (tea.geography) {
        markdown += `## Geography (raw)\n\n`;
        if (tea.geography.altitude !== undefined) markdown += `**Altitude:** ${tea.geography.altitude}m\n`;
        if (tea.geography.humidity !== undefined) markdown += `**Humidity:** ${tea.geography.humidity}%\n`;
        if (tea.geography.latitude !== undefined && tea.geography.longitude !== undefined) markdown += `**Coords:** ${tea.geography.latitude?.toFixed(2)}°, ${tea.geography.longitude?.toFixed(2)}°\n`;
        if (tea.geography.harvestMonth !== undefined) {
            // You might want to re-implement or import getMonthName if needed
            // markdown += `**Harvest Month:** ${getMonthName(tea.geography.harvestMonth)}\n`;
            markdown += `**Harvest Month:** ${tea.geography.harvestMonth}\n`; // Simpler alternative
        }
         if (tea.geography.temperature !== undefined) markdown += `**Avg Temp:** ${tea.geography.temperature}°C\n`;
         if (tea.geography.solarRadiation !== undefined) markdown += `**Solar Rad.:** ${tea.geography.solarRadiation} W/m²\n`;
        markdown += '\n';
    }

    return markdown;
 }