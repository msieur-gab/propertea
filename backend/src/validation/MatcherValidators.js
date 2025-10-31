/**
 * MatcherValidators.js
 *
 * Validates matcher outputs against expected recommendations from dataset
 */

export class TimingValidator {
  /**
   * Map hour numbers to time-of-day labels
   */
  static hourToTimeOfDay(hour) {
    if (hour >= 6 && hour <= 8) return 'Morning';
    if (hour >= 9 && hour <= 11) return 'Late Morning';
    if (hour >= 12 && hour <= 13) return 'Early Afternoon';
    if (hour >= 14 && hour <= 16) return 'Afternoon';
    if (hour >= 17 && hour <= 19) return 'Early Evening';
    if (hour >= 20 && hour <= 23) return 'Evening';
    return 'Night';
  }

  /**
   * Validate timing recommendations
   * @param {Object} matcherOutput - Output from TimeMatcher
   * @param {Array<string>} expectedTimes - Expected times from dataset
   * @returns {Object} Validation result
   */
  static validate(matcherOutput, expectedTimes) {
    if (!matcherOutput || !matcherOutput.recommendedTimes) {
      return { success: false, error: 'No timing recommendations' };
    }

    // Get unique recommended labels (avoid duplicates from multiple recommendations)
    const recommendedLabelsSet = new Set(
      matcherOutput.recommendedTimes.map(t => this.hourToTimeOfDay(t.hour))
    );
    const recommendedLabels = Array.from(recommendedLabelsSet);

    // Normalize expected times
    const normalizedExpected = expectedTimes.map(t =>
      t.toLowerCase().replace(/[\/\-,\s]+/g, ' ').trim()
    );

    // Mapping of expected patterns to our time categories
    const timeMapping = {
      'morning': 'Morning',
      'late morning': 'Late Morning',
      'early afternoon': 'Early Afternoon',
      'afternoon': 'Afternoon',
      'early evening': 'Early Evening',
      'evening': 'Evening',
      'night': 'Night'
    };

    // Check for exact matches
    const matches = recommendedLabels.filter(label => {
      const labelLower = label.toLowerCase();
      return normalizedExpected.some(exp => {
        // Exact match
        if (exp === labelLower) return true;
        // Check if expected contains specific keywords
        if (exp.includes('morning') && (labelLower === 'morning' || labelLower === 'late morning')) return true;
        if (exp.includes('afternoon') && (labelLower === 'early afternoon' || labelLower === 'afternoon')) return true;
        if (exp.includes('evening') && (labelLower === 'early evening' || labelLower === 'evening')) return true;
        return false;
      });
    });

    // Cap accuracy at 100%
    const accuracy = Math.min(100, (matches.length / normalizedExpected.length) * 100);

    return {
      success: matches.length > 0,
      matches: matches.length,
      total: normalizedExpected.length,
      accuracy: accuracy,
      recommended: recommendedLabels,
      expected: normalizedExpected,
      scores: matcherOutput.recommendedTimes.map(t => `${t.hour}:00=${t.score}%`)
    };
  }
}

export class SeasonValidator {
  /**
   * Validate seasonal recommendations
   * @param {Object} matcherOutput - Output from SeasonMatcher
   * @param {Array<string>} expectedSeasons - Expected seasons from dataset
   * @returns {Object} Validation result
   */
  static validate(matcherOutput, expectedSeasons) {
    if (!matcherOutput) {
      return { success: false, error: 'No seasonal recommendations' };
    }

    // Extract seasonal scores from different possible structures
    let seasonScores = {};
    let recommendedSeasons = [];

    // Try different structures from SeasonMatcher
    if (matcherOutput.simplified && matcherOutput.simplified.scores) {
      // Preferred structure: simplified.scores has Spring, Summer, Autumn, Winter
      seasonScores = matcherOutput.simplified.scores;
      recommendedSeasons = matcherOutput.simplified.recommended || [];
    } else if (matcherOutput.recommendations && typeof matcherOutput.recommendations === 'object') {
      // Alternative structure: recommendations object
      seasonScores = matcherOutput.recommendations;
      recommendedSeasons = Object.keys(seasonScores)
        .sort((a, b) => seasonScores[b] - seasonScores[a])
        .slice(0, 3);
    } else if (matcherOutput.seasonScores && typeof matcherOutput.seasonScores === 'object') {
      seasonScores = matcherOutput.seasonScores;
      recommendedSeasons = Object.keys(seasonScores)
        .sort((a, b) => seasonScores[b] - seasonScores[a])
        .slice(0, 3);
    } else if (Array.isArray(matcherOutput.recommended)) {
      // If it's already an array of season names
      recommendedSeasons = matcherOutput.recommended;
    } else if (typeof matcherOutput === 'object') {
      // Try to extract seasons from the object itself
      Object.keys(matcherOutput).forEach(key => {
        if (typeof matcherOutput[key] === 'number' && key !== 'success') {
          seasonScores[key] = matcherOutput[key];
        }
      });
      recommendedSeasons = Object.keys(seasonScores)
        .sort((a, b) => seasonScores[b] - seasonScores[a])
        .slice(0, 3);
    }

    // Ensure we have an array
    if (!Array.isArray(recommendedSeasons)) {
      recommendedSeasons = [];
    }

    // Normalize expected seasons
    const normalizedExpected = expectedSeasons.map(s =>
      s.toLowerCase().replace(/[\/\-,\s]+/g, ' ').trim()
    );

    // Check for matches with semantic awareness
    const matches = recommendedSeasons.filter(rec => {
      const recLower = rec.toLowerCase();
      return normalizedExpected.some(exp => {
        // Exact match
        if (exp === recLower) return true;
        // Partial keyword match
        return exp.includes(recLower) || recLower.includes(exp);
      });
    });

    // Cap accuracy at 100%
    const accuracy = Math.min(100, (matches.length / normalizedExpected.length) * 100);

    return {
      success: matches.length > 0,
      matches: matches.length,
      total: normalizedExpected.length,
      accuracy: accuracy,
      recommended: recommendedSeasons,
      expected: normalizedExpected,
      scores: recommendedSeasons.map(s => `${s}=${seasonScores[s]}%`)
    };
  }
}

export class ActivityValidator {
  /**
   * Extract key words from a phrase
   */
  static getKeyWords(phrase) {
    return phrase.toLowerCase().split(/[\s\-]+/).filter(w => w.length > 2);
  }

  /**
   * Check if two activities are semantically similar
   */
  static isSimilar(rec, exp) {
    const recLower = rec.toLowerCase();
    const expLower = exp.toLowerCase();

    // Exact match
    if (recLower === expLower) return true;

    // Substring match (one is contained in the other)
    if (recLower.includes(expLower) || expLower.includes(recLower)) return true;

    // Key word matching - check if any significant words match
    const recWords = this.getKeyWords(rec);
    const expWords = this.getKeyWords(exp);

    // If any word from expected is in recommended
    return expWords.some(w => recWords.includes(w));
  }

  /**
   * Validate activity recommendations
   * @param {Object} matcherOutput - Output from ActivityMatcher
   * @param {Array<string>} expectedActivities - Expected activities from dataset
   * @returns {Object} Validation result
   */
  static validate(matcherOutput, expectedActivities) {
    if (!matcherOutput || !matcherOutput.recommendedActivities) {
      return { success: false, error: 'No activity recommendations' };
    }

    // Get recommended activities (top scored)
    const recommendedActivities = matcherOutput.recommendedActivities
      .slice(0, 5)
      .map(a => a.name || a);

    // Normalize expected activities
    const normalizedExpected = expectedActivities.map(a =>
      a.toLowerCase().replace(/[\/\-,\s]+/g, ' ').trim()
    );

    // Check for matches with semantic awareness
    const matches = recommendedActivities.filter(rec =>
      normalizedExpected.some(exp => this.isSimilar(rec, exp))
    );

    // Cap accuracy at 100%
    const accuracy = Math.min(100, (matches.length / normalizedExpected.length) * 100);

    return {
      success: matches.length > 0,
      matches: matches.length,
      total: normalizedExpected.length,
      accuracy: accuracy,
      recommended: recommendedActivities,
      expected: normalizedExpected,
      topClusters: matcherOutput.activityClusters ?
        matcherOutput.activityClusters.slice(0, 2).map(c => c.theme) : []
    };
  }
}

export class FoodValidator {
  /**
   * Extract key food terms from a phrase
   */
  static getKeyWords(phrase) {
    return phrase.toLowerCase().split(/[\s\-,]+/).filter(w => w.length > 2);
  }

  /**
   * Check if two food items are semantically similar
   */
  static isSimilar(rec, exp) {
    const recLower = rec.toLowerCase();
    const expLower = exp.toLowerCase();

    // Exact match
    if (recLower === expLower) return true;

    // Substring match (one is contained in the other)
    if (recLower.includes(expLower) || expLower.includes(recLower)) return true;

    // Key word matching - check if any significant words match
    const recWords = this.getKeyWords(rec);
    const expWords = this.getKeyWords(exp);

    // If any word from expected is in recommended
    return expWords.some(w => recWords.includes(w));
  }

  /**
   * Validate food pairing recommendations
   * @param {Object} matcherOutput - Output from FoodMatcher
   * @param {Array<string>} expectedFoods - Expected foods from dataset
   * @returns {Object} Validation result
   */
  static validate(matcherOutput, expectedFoods) {
    if (!matcherOutput || !matcherOutput.recommendedFoods) {
      return { success: false, error: 'No food recommendations' };
    }

    // Get recommended foods (top scored)
    const recommendedFoods = matcherOutput.recommendedFoods
      .slice(0, 5)
      .map(f => f.name || f);

    // Normalize expected foods
    const normalizedExpected = expectedFoods.map(f =>
      f.toLowerCase().replace(/[\/\-,\s\(\)]+/g, ' ').trim()
    );

    // Check for matches with semantic awareness
    const matches = recommendedFoods.filter(rec =>
      normalizedExpected.some(exp => this.isSimilar(rec, exp))
    );

    // Cap accuracy at 100%
    const accuracy = Math.min(100, (matches.length / normalizedExpected.length) * 100);

    return {
      success: matches.length > 0,
      matches: matches.length,
      total: normalizedExpected.length,
      accuracy: accuracy,
      recommended: recommendedFoods,
      expected: normalizedExpected,
      topOccasions: matcherOutput.mealClusters ?
        matcherOutput.mealClusters.slice(0, 2).map(c => c.occasion) : []
    };
  }
}

export class RecommendationValidator {
  /**
   * Validate all recommendations together
   */
  static validateAll(analysis, expectedContext) {
    return {
      timing: TimingValidator.validate(
        analysis.timing,
        expectedContext.timeOfDay
      ),
      seasons: SeasonValidator.validate(
        analysis.seasonal,
        expectedContext.drinkingSeason
      ),
      activities: ActivityValidator.validate(
        analysis.activities,
        expectedContext.recommendedActivity
      ),
      foods: FoodValidator.validate(
        analysis.food,
        expectedContext.foodPairing
      )
    };
  }

  /**
   * Calculate overall accuracy
   */
  static calculateOverallAccuracy(validationResults) {
    const accuracies = [
      validationResults.timing.accuracy,
      validationResults.seasons.accuracy,
      validationResults.activities.accuracy,
      validationResults.foods.accuracy
    ];
    return {
      average: (accuracies.reduce((a, b) => a + b, 0) / accuracies.length).toFixed(1),
      details: {
        timing: validationResults.timing.accuracy.toFixed(1),
        seasons: validationResults.seasons.accuracy.toFixed(1),
        activities: validationResults.activities.accuracy.toFixed(1),
        foods: validationResults.foods.accuracy.toFixed(1)
      }
    };
  }
}

export default {
  TimingValidator,
  SeasonValidator,
  ActivityValidator,
  FoodValidator,
  RecommendationValidator
};
