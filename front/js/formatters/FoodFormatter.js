// js/formatters/FoodFormatter.js
import { formatString, formatScoreWithBar } from '../utils/markdownUtils.js';

/**
 * Formats the food pairing analysis results into Markdown.
 * @param {object} foodAnalysis - The food analysis object from TeaInsights/FoodMatcher.
 * @param {string} teaName - The name of the tea.
 * @returns {string} Formatted Markdown string.
 */
export function formatFoodAnalysis(foodAnalysis, teaName) {
    let markdown = `# Food Pairing Analysis for ${teaName}\n\n`;

    if (!foodAnalysis || foodAnalysis.error) {
        return markdown + `*No food pairing analysis available or calculation failed: ${foodAnalysis?.error || 'Unknown error'}*\n\n`;
    }

    // Display top food pairings if available
    if (foodAnalysis.recommendedFoods && foodAnalysis.recommendedFoods.length > 0) {
        markdown += `## Top Recommended Pairings\n\n`;
        foodAnalysis.recommendedFoods.forEach(food => {
            const foodDisplay = formatString(food.name);
            // Corrected: Use score directly with maxScore=100
            markdown += `- **${foodDisplay}:** ${formatScoreWithBar(food.score, 100)}\n`;
        });
        markdown += `\n`;
    } else {
         markdown += `No specific food pairings strongly recommended.\n\n`;
    }

    // Display meal clusters if available
    if (foodAnalysis.mealClusters && foodAnalysis.mealClusters.length > 0) {
        markdown += `## Recommended Meal Occasions\n\n`;
        foodAnalysis.mealClusters.forEach(cluster => {
            markdown += `### ${cluster.occasion} (Avg Score: ${cluster.score}%)\n`;
            // List top 1-3 foods within the cluster
            cluster.foods.slice(0, 3).forEach(food => {
                 // Corrected: Use score directly with maxScore=100
                markdown += `- ${formatString(food.name)} (${formatScoreWithBar(food.score, 100)})\n`; // Show score bar inline maybe? Or just %
                // Alternative: Just show percentage text
                // markdown += `- ${formatString(food.name)} (${food.score}%)\n`;
            });
            markdown += `\n`;
        });
    } else {
         markdown += `No specific meal occasions strongly recommended.\n\n`;
    }

    // Removed the incorrect "Flavor Pairing Recommendations" section that used non-existent data keys

    // Add explanation about the logic
    markdown += `## Food Pairing Logic\n\n`;
    markdown += `These recommendations consider the tea's:\n\n`;
    markdown += `- Flavor profile (complementary/contrasting)\n`;
    markdown += `- Body and mouthfeel\n`;
    markdown += `- Processing and tea type characteristics\n\n`;
    markdown += `Pairings are grouped by meal occasion for practical suggestions.`;

    return markdown;
}