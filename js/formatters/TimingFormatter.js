// js/formatters/TimingFormatter.js
import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the hourly timing analysis results into Markdown.
 * @param {object} timingAnalysis - The timing analysis object from TeaInsights/TimeMatcher (hourly version).
 * Expected properties: hourlyScores, recommendedTimes, idealRanges, trace
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatTimingAnalysis(timingAnalysis, teaName) {
    let markdown = `# Timing Analysis for ${teaName}\n\n`;

    if (!timingAnalysis || timingAnalysis.error) {
        return markdown + `*No timing analysis available or calculation failed: ${timingAnalysis?.error || 'Unknown error'}*\n\n`;
    }

    // --- Display Top Recommended Hours ---
    if (timingAnalysis.recommendedTimes && timingAnalysis.recommendedTimes.length > 0) {
        markdown += `## Top Recommended Hours\n\n`;
        timingAnalysis.recommendedTimes.forEach(time => {
            const hourString = time.hour.toString().padStart(2, '0') + ":00"; // Format as HH:00
            markdown += `- **${hourString}:** Score ${time.score}%\n`;
        });
        markdown += `\n`;
    } else {
        markdown += `*No specific peak hours strongly recommended based on thresholds.*\n\n`;
    }

    // --- Display Ideal Consumption Ranges ---
    if (timingAnalysis.idealRanges && timingAnalysis.idealRanges.length > 0) {
        markdown += `## Ideal Consumption Ranges (Score >= ${timingAnalysis.idealRanges[0]?.threshold || 70}%)\n\n`; // Use actual threshold if available
        timingAnalysis.idealRanges.forEach(range => {
            const startHour = range.start.toString().padStart(2, '0') + ":00";
            const endHour = range.end.toString().padStart(2, '0') + ":59"; // Indicate end of the hour
            const rangeText = range.start === range.end ? startHour : `${startHour} - ${endHour}`;
            const wrapIndicator = range.isWraparound ? " (Wraps Around Midnight)" : "";
            markdown += `- **${rangeText}${wrapIndicator}**: (Avg Score ${range.score}%)\n`;
        });
        markdown += `\n`;
    } else {
        markdown += `*No extended periods of high suitability identified.*\n\n`;
    }

    // --- Display Hourly Suitability Scores (Optional - can be verbose) ---
    if (timingAnalysis.hourlyScores && Object.keys(timingAnalysis.hourlyScores).length > 0) {
        markdown += `## Hourly Suitability Scores (0-100)\n\n`;
        // Sort by hour for readability
        Object.entries(timingAnalysis.hourlyScores)
            .map(([hour, score]) => ({ hour: parseInt(hour), score }))
            .sort((a, b) => a.hour - b.hour)
            .forEach(({ hour, score }) => {
                const hourString = hour.toString().padStart(2, '0') + ":00";
                // Use formatScoreWithBar for visual representation
                markdown += `- **${hourString}:** ${formatScoreWithBar(score, 100)}\n`;
            });
        markdown += `\n`;
    }

    // --- Add Explanation ---
    markdown += `## Time Matching Logic\n\n`;
    markdown += `Recommendations are based on hourly scores calculated from the tea's compound profile (stimulation/relaxation), caffeine level, tea type, and general daily energy patterns. Scores indicate suitability relative to the tea's peak potential across the day.\n`;

    // --- Add Trace (Optional - for debugging) ---
    // if (timingAnalysis.trace && timingAnalysis.trace.length > 0) {
    //     markdown += `\n## Calculation Trace (Debug)\n\n`;
    //     timingAnalysis.trace.forEach(step => {
    //         markdown += `- **${step.step || 'Step'}**: ${step.reason || ''} -> ${step.adjustment || ''} (Value: ${step.value || 'N/A'})\n`;
    //     });
    // }

    return markdown;
}