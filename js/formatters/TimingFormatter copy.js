import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the timing analysis results into Markdown.
 * @param {object} timingAnalysis - The timing analysis object from TeaInsights/TimeMatcher.
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatTimingAnalysis(timingAnalysis, teaName) {
    let markdown = `# Timing Analysis for ${teaName}\n\n`;

    if (!timingAnalysis || timingAnalysis.error) {
        return markdown + `*No timing analysis available or calculation failed: ${timingAnalysis?.error || 'Unknown error'}*\n\n`;
    }

    // Display best time if available
    // Note: The TimeMatcher might return recommendedTimes instead of a single bestTime now.
    // Let's use the top recommended time.
    const topTime = timingAnalysis.recommendedTimes?.[0];
    if (topTime) {
        markdown += `## Best Time to Enjoy\n\n`;
        markdown += `**Top Recommended Time:** ${formatString(topTime.name)} (${topTime.score}% match)\n\n`;
    }

    // Display explanation if available (assuming TimeMatcher provides one now, or generate it here)
    // For now, we'll use a generic explanation based on top time.
    if (topTime) {
        markdown += `This time is suggested based on the tea's compound profile (stimulation/relaxation) and typical daily rhythms.\n\n`;
    } else if (timingAnalysis.explanation) {
         markdown += `${timingAnalysis.explanation}\n\n`; // Use explanation if matcher provides it
    }


    // Display recommendations (scores) if available
    if (timingAnalysis.recommendations && Object.keys(timingAnalysis.recommendations).length > 0) {
        markdown += `## Time of Day Suitability\n\n`;
        // Sort times based on the standard order if possible, otherwise by score
        const timeOrder = ["Early Morning", "Morning", "Midday", "Afternoon", "Evening", "Night"];
        Object.entries(timingAnalysis.recommendations)
            .sort((a, b) => {
                const indexA = timeOrder.indexOf(a[0]);
                const indexB = timeOrder.indexOf(b[0]);
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                return b[1] - a[1]; // Fallback sort by score if time not in order
            })
            .forEach(([time, score]) => {
                // Use formatScoreWithBar, assuming score is 0-100
                markdown += `- **${formatString(time)}:** ${formatScoreWithBar(score, 100)}\n`;
            });
        markdown += `\n`;
    }

    // Display ideal ranges if available
    if (timingAnalysis.idealRanges && timingAnalysis.idealRanges.length > 0) {
        markdown += `## Ideal Consumption Ranges (Score >= ${timingAnalysis.idealRanges[0]?.threshold || 70}%)\n\n`; // Assuming threshold is available or default
        timingAnalysis.idealRanges.forEach(range => {
            if (range.start === range.end) {
                markdown += `- **${formatString(range.start)}**: Avg Score ${range.score}%\n`;
            } else {
                markdown += `- **${formatString(range.start)} to ${formatString(range.end)}**: Avg Score ${range.score}%\n`;
            }
        });
        markdown += `\n`;
    }

    // Add generic explanation about the logic
    markdown += `## Time Matching Logic\n\n`;
    markdown += `Recommendations are based on factors like caffeine level, L-theanine ratio, and tea type characteristics balanced against typical daily energy patterns.\n`;

    return markdown;
} 