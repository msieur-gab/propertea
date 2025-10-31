/**
 * RecommendationService.js
 *
 * Consolidated recommendation service for all derived analyses
 * Consolidates 5 matchers into a single service:
 * - TimeMatcher → getTimingRecommendations()
 * - SeasonMatcher → getSeasonalRecommendations()
 * - FoodMatcher → getFoodRecommendations()
 * - ActivityMatcher → getActivityRecommendations()
 * - BrewingMatcher → getBrewingRecommendations()
 *
 * CRITICAL: This service receives PRE-CALCULATED core analysis from
 * TeaCalculationOrchestrator, eliminating redundant recalculations.
 *
 * Input: TeaModel + Core analysis (from Orchestrator)
 * Output: Timing, seasonal, food, activity, and brewing recommendations
 */

export class RecommendationService {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Get timing/time-of-day recommendations
   *
   * Based on: compounds (caffeine/theanine ratio)
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Timing recommendations
   */
  getTimingRecommendations(teaModel, coreAnalysis) {
    const compounds = coreAnalysis?.compounds;

    if (!compounds) {
      return {
        recommendations: {
          bestTimes: [],
          worstTimes: [],
          explanation: 'Insufficient compound data for timing analysis'
        }
      };
    }

    const { caffeineLevel, lTheanineLevel } = compounds.levels || {};
    const ratio = compounds.levels?.lTheanineToCaffeineRatio || 0;

    // Determine best times based on caffeine/theanine profile
    let bestTimes = [];
    let worstTimes = [];
    let explanation = '';

    if (caffeineLevel <= 1) {
      bestTimes = ['Evening', 'Night', 'Before bed'];
      worstTimes = ['Morning'];
      explanation = 'Low caffeine makes this ideal for evening relaxation';
    } else if (caffeineLevel >= 7) {
      bestTimes = ['Morning', 'Work hours'];
      worstTimes = ['Evening', 'Night'];
      explanation = 'High caffeine content makes this best for morning energy';
    } else if (ratio >= 1.5) {
      bestTimes = ['Afternoon', 'Evening', 'Anytime'];
      worstTimes = [];
      explanation = 'High L-theanine smooths caffeine for calm focus throughout the day';
    } else {
      bestTimes = ['Morning', 'Afternoon', 'Work'];
      worstTimes = ['Night'];
      explanation = 'Balanced profile works well during active hours';
    }

    return {
      recommendations: {
        bestTimes,
        worstTimes,
        explanation
      }
    };
  }

  /**
   * Get seasonal recommendations
   *
   * Based on: geography (climate), processing (roast), flavor
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Seasonal recommendations
   */
  getSeasonalRecommendations(teaModel, coreAnalysis) {
    const geography = coreAnalysis?.geography;
    const processing = coreAnalysis?.processing;

    if (!geography && !processing) {
      return {
        recommendations: {
          bestSeasons: [],
          explanation: 'Insufficient data for seasonal analysis'
        }
      };
    }

    let bestSeasons = [];
    let explanation = '';

    // Determine based on climate tendency
    if (geography?.characteristics?.temperatureTendency === 'Cooling') {
      bestSeasons = ['Spring', 'Summer'];
      explanation = 'Cooling teas are refreshing during warm seasons';
    } else if (geography?.characteristics?.temperatureTendency === 'Warming') {
      bestSeasons = ['Autumn', 'Winter'];
      explanation = 'Warming teas are comforting during cold seasons';
    } else {
      bestSeasons = ['Anytime'];
      explanation = 'This tea is enjoyable year-round';
    }

    // Check processing for roast influence
    if (processing?.roastLevel === 'Heavy' || processing?.roastLevel === 'Charcoal') {
      bestSeasons = ['Autumn', 'Winter'];
      explanation = `Heavy roast profile makes this ideal for ${bestSeasons.join('/')}`;
    }

    return {
      recommendations: {
        bestSeasons,
        explanation
      }
    };
  }

  /**
   * Get food pairing recommendations
   *
   * Based on: flavor profile, processing, tea type
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Food pairing recommendations
   */
  getFoodRecommendations(teaModel, coreAnalysis) {
    const flavor = coreAnalysis?.flavor;
    const teaType = coreAnalysis?.teaType;

    if (!flavor || !flavor.profile || flavor.profile.identified.length === 0) {
      return {
        recommendations: {
          foods: [],
          occasions: [],
          explanation: 'Insufficient flavor data for food pairing'
        }
      };
    }

    // Basic food pairing logic based on flavor categories
    const categories = flavor.profile.categories || [];
    const foods = [];
    const occasions = [];

    const categoryToFoods = {
      Floral: ['Light Desserts', 'Pastries', 'Spring Salads'],
      Fruity: ['Fruit Dishes', 'Desserts', 'Cheese'],
      Roasted: ['Grilled Meats', 'Roasted Vegetables', 'Dark Chocolate'],
      Sweet: ['Desserts', 'Pastries', 'Breakfast Foods'],
      Umami: ['Savory Dishes', 'Seafood', 'Sushi'],
      Earthy: ['Mushrooms', 'Root Vegetables', 'Stews'],
      Spicy: ['Spiced Foods', 'Curries', 'Grilled Meats']
    };

    categories.forEach(category => {
      const categoryFoods = categoryToFoods[category] || [];
      foods.push(...categoryFoods);
    });

    // Determine occasions based on tea type
    if (teaType?.identified?.type === 'green') {
      occasions.push('Breakfast', 'Light lunch', 'Afternoon tea');
    } else if (teaType?.identified?.type === 'black') {
      occasions.push('Breakfast', 'Afternoon tea', 'Dinner');
    } else if (teaType?.identified?.type === 'oolong') {
      occasions.push('Afternoon', 'Evening', 'Social');
    } else {
      occasions.push('Anytime');
    }

    // Remove duplicates
    const uniqueFoods = [...new Set(foods)];

    return {
      recommendations: {
        foods: uniqueFoods.slice(0, 8),
        occasions: [...new Set(occasions)],
        explanation: `Pairs well with ${uniqueFoods.slice(0, 3).join(', ')}`
      }
    };
  }

  /**
   * Get activity recommendations
   *
   * Based on: compounds, tea type, flavor
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Activity recommendations
   */
  getActivityRecommendations(teaModel, coreAnalysis) {
    const compounds = coreAnalysis?.compounds;
    const teaType = coreAnalysis?.teaType;

    if (!compounds) {
      return {
        recommendations: {
          activities: [],
          explanation: 'Insufficient data for activity recommendations'
        }
      };
    }

    const { caffeineLevel, lTheanineLevel } = compounds.levels || {};
    const ratio = compounds.levels?.lTheanineToCaffeineRatio || 0;
    const activities = [];

    // Determine activities based on caffeine/theanine
    if (lTheanineLevel >= 7 && caffeineLevel <= 3) {
      activities.push('Meditation', 'Relaxation', 'Reading', 'Contemplation');
    } else if (caffeineLevel >= 7 && lTheanineLevel <= 3) {
      activities.push('Work', 'Exercise', 'Energy tasks', 'Problem-solving');
    } else if (ratio > 1.2) {
      activities.push('Focused work', 'Creative tasks', 'Study', 'Calm activities');
    } else if (ratio < 0.8) {
      activities.push('Physical activity', 'Energetic tasks', 'Social');
    } else {
      activities.push('Balanced activities', 'Social', 'Work', 'Relaxation');
    }

    return {
      recommendations: {
        activities: [...new Set(activities)],
        explanation: `Ideal for ${activities.slice(0, 2).join(' or ')}`
      }
    };
  }

  /**
   * Get brewing recommendations
   *
   * Based on: tea type, processing
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Brewing recommendations
   */
  getBrewingRecommendations(teaModel, coreAnalysis) {
    const teaType = coreAnalysis?.teaType;
    const processing = coreAnalysis?.processing;

    // Default brewing parameters by tea type
    const brewingGuides = {
      green: {
        waterTemp: '70-80°C',
        steepTime: '2-3 minutes',
        ratio: '1:50 (leaf to water)',
        gongfu: {
          waterTemp: '75°C',
          steepTime: '10-30 seconds per infusion',
          infusions: '5-8 infusions'
        },
        western: {
          waterTemp: '75°C',
          steepTime: '2-3 minutes',
          infusions: '1-2 infusions'
        }
      },
      black: {
        waterTemp: '90-100°C',
        steepTime: '3-5 minutes',
        ratio: '1:50',
        gongfu: {
          waterTemp: '95°C',
          steepTime: '15-45 seconds per infusion',
          infusions: '6-8 infusions'
        },
        western: {
          waterTemp: '95°C',
          steepTime: '3-5 minutes',
          infusions: '1-2 infusions'
        }
      },
      oolong: {
        waterTemp: '85-95°C',
        steepTime: '2-5 minutes',
        ratio: '1:40 (more leaf)',
        gongfu: {
          waterTemp: '90°C',
          steepTime: '20-45 seconds per infusion',
          infusions: '6-10 infusions'
        },
        western: {
          waterTemp: '90°C',
          steepTime: '3-5 minutes',
          infusions: '1-2 infusions'
        }
      },
      white: {
        waterTemp: '65-75°C',
        steepTime: '3-5 minutes',
        ratio: '1:50',
        gongfu: {
          waterTemp: '70°C',
          steepTime: '15-30 seconds per infusion',
          infusions: '4-6 infusions'
        },
        western: {
          waterTemp: '70°C',
          steepTime: '3-5 minutes',
          infusions: '1-2 infusions'
        }
      }
    };

    const type = teaType?.identified?.type || 'green';
    const guide = brewingGuides[type] || brewingGuides.green;

    return {
      recommendations: {
        general: {
          waterTemperature: guide.waterTemp,
          steepTime: guide.steepTime,
          leafToWaterRatio: guide.ratio
        },
        gongfu: guide.gongfu,
        western: guide.western,
        explanation: `Recommended brewing for ${type} tea`
      }
    };
  }

  /**
   * Serialize all recommendations
   */
  serialize(
    timing,
    seasonal,
    food,
    activities,
    brewing
  ) {
    return {
      timing: timing?.recommendations || {},
      seasonal: seasonal?.recommendations || {},
      food: food?.recommendations || {},
      activities: activities?.recommendations || {},
      brewing: brewing?.recommendations || {}
    };
  }
}

// Export singleton instance for convenience
export const recommendationService = new RecommendationService();
