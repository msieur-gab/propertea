// js/formatters/ActivityFormatter.js
import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the activity analysis results into Markdown.
 * @param {object} activityAnalysis - The activity analysis object from TeaInsights/ActivityMatcher.
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatActivityAnalysis(activityAnalysis, teaName) {
    let markdown = `# Activity Analysis for ${teaName}\n\n`;

    if (!activityAnalysis || activityAnalysis.error) {
        console.log('[DEBUG Formatter] Exiting early: No data or error.'); // Log exit condition

        return markdown + `*No activity analysis available or calculation failed: ${activityAnalysis?.error || 'Unknown error'}*\n\n`;
    }

    // Display top activities if available - Use recommendedActivities
    // Corrected: Use 'recommendedActivities' instead of 'topActivities'
    if (activityAnalysis.recommendedActivities && activityAnalysis.recommendedActivities.length > 0) {
        console.log('[DEBUG Formatter] Formatting recommendedActivities...'); // Log section entry

        markdown += `## Top Recommended Activities\n\n`;
        activityAnalysis.recommendedActivities.forEach(activity => {
            const activityDisplay = formatString(activity.name);
            // Corrected: Use score directly with maxScore=100
            markdown += `- **${activityDisplay}:** ${formatScoreWithBar(activity.score, 100)}\n`;
        });
        markdown += `\n`;
    } else {
        console.log('[DEBUG Formatter] No recommendedActivities found or array is empty.'); // Log skip condition

         markdown += `No specific activities strongly recommended.\n\n`;
    }

    // Display activity clusters if available
    if (activityAnalysis.activityClusters && activityAnalysis.activityClusters.length > 0) {
        console.log('[DEBUG Formatter] Formatting activityClusters...'); // Log section entry

        markdown += `## Recommended Activity Themes\n\n`;
        activityAnalysis.activityClusters.forEach(cluster => {
            markdown += `### ${cluster.theme} (Avg Score: ${cluster.score}%)\n`;
            // List top 1-3 activities within the cluster
            cluster.activities.slice(0, 3).forEach(act => {
                 // Corrected: Use score directly with maxScore=100
                markdown += `- ${formatString(act.name)} (${formatScoreWithBar(act.score, 100)})\n`; // Show score bar inline maybe? Or just %
                // Alternative: Just show percentage text
                // markdown += `- ${formatString(act.name)} (${act.score}%)\n`;
            });
            markdown += `\n`;
        });
    } else {
        console.log('[DEBUG Formatter] No activityClusters found or array is empty.'); // Log skip condition

         markdown += `No specific activity themes strongly recommended.\n\n`;
    }

    // Removed the incorrect "Activity Suitability Scores" section that used non-existent data keys

    // Add explanation about the logic
    markdown += `## Activity Matching Logic\n\n`;
    markdown += `These recommendations consider the tea's:\n\n`;
    markdown += `- Energetic profile (stimulation/relaxation)\n`;
    markdown += `- Base hints from tea type and flavor\n`;
    markdown += `- Traditional consumption patterns\n\n`;
    markdown += `Activities are grouped into themes for broader suggestions.`;

    console.log('[DEBUG Formatter] Final Markdown Length:', markdown.length); // Log final length

    return markdown;
}