import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the seasonal analysis results into Markdown.
 * @param {object} seasonalAnalysis - The seasonal analysis object from TeaInsights/SeasonMatcher.
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatSeasonalAnalysis(seasonalAnalysis, teaName) {
    let markdown = `# Seasonal Analysis for ${teaName}\n\n`;

    if (!seasonalAnalysis || seasonalAnalysis.error) {
        return markdown + `*No seasonal analysis available or calculation failed: ${seasonalAnalysis?.error || 'Unknown error'}*\n\n`;
    }

    // Display top recommended season(s)
    if (seasonalAnalysis.recommendedSeasons && seasonalAnalysis.recommendedSeasons.length > 0) {
        markdown += `## Top Recommended Seasons\n\n`;
        seasonalAnalysis.recommendedSeasons.forEach(season => {
             markdown += `- **${formatString(season.name)}:** ${formatScoreWithBar(season.score, 100)}\n`;
         });
        markdown += `\n`;
    }

    // Display explanation (assuming SeasonMatcher provides one, or generate here)
    // For now, use a generic one based on top season
     const topSeason = seasonalAnalysis.recommendedSeasons?.[0]?.name;
     if (topSeason) {
        markdown += `This season is suggested based on the tea's thermal properties (warming/cooling), flavor profile, and alignment with the season's typical characteristics.\n\n`;
     } else if (seasonalAnalysis.explanation) {
         markdown += `${seasonalAnalysis.explanation}\n\n`;
     }

    // Display detailed recommendations (scores) if available
    if (seasonalAnalysis.recommendations && Object.keys(seasonalAnalysis.recommendations).length > 0) {
        markdown += `## Seasonal Suitability Scores\n\n`;
         // Use the defined order from SeasonMatcher if possible
         const seasonOrder = [
            "Early Spring", "Spring", "Late Spring",
            "Early Summer", "Summer", "Late Summer",
            "Early Autumn", "Autumn", "Late Autumn",
            "Early Winter", "Winter", "Late Winter"
        ];
        Object.entries(seasonalAnalysis.recommendations)
            .sort((a, b) => {
                 const indexA = seasonOrder.indexOf(a[0]);
                 const indexB = seasonOrder.indexOf(b[0]);
                 if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                 return b[1] - a[1]; // Fallback sort by score
             })
            .forEach(([season, score]) => {
                markdown += `- **${formatString(season)}:** ${formatScoreWithBar(score, 100)}\n`;
            });
        markdown += `\n`;
    }

    // Display ideal ranges if available
    if (seasonalAnalysis.idealRanges && seasonalAnalysis.idealRanges.length > 0) {
        markdown += `## Ideal Consumption Ranges (Score >= ${seasonalAnalysis.idealRanges[0]?.threshold || 70}%)\n\n`; // Assuming threshold is available or default
        seasonalAnalysis.idealRanges.forEach(range => {
             const rangeText = range.start === range.end ? formatString(range.start) : `${formatString(range.start)} to ${formatString(range.end)}`;
             const wrapIndicator = range.isWraparound ? " (Wraps Year)" : "";
             markdown += `- **${rangeText}${wrapIndicator}**: Avg Score ${range.score}%\n`;
         });
        markdown += `\n`;
    }

    // Add generic explanation about the logic
    markdown += `## Season Matching Logic\n\n`;
    markdown += `Recommendations consider the tea's type, processing (thermal effect, roast), flavor affinities, and harvest season against seasonal characteristics.\n`;

    return markdown;
} 