/**
 * RecommendationService.js
 *
 * Consolidated recommendation service for all derived analyses
 * Uses actual matchers from /js/derivation/:
 * - TimeMatcher → getTimingRecommendations()
 * - SeasonMatcher → getSeasonalRecommendations()
 * - FoodMatcher → getFoodRecommendations()
 * - ActivityMatcher → getActivityRecommendations()
 * - brewingMatcher → getBrewingRecommendations()
 *
 * CRITICAL: This service receives PRE-CALCULATED core analysis from
 * TeaCalculationOrchestrator, eliminating redundant recalculations.
 *
 * Input: TeaModel + Core analysis (from Orchestrator)
 * Output: Timing, seasonal, food, activity, and brewing recommendations
 */

import TimeMatcher from './matchers/TimeMatcher.js';
import { ActivityMatcher } from './matchers/ActivityMatcher.js';
import SeasonMatcher from './matchers/SeasonMatcher.js';
import { FoodMatcher } from './matchers/FoodMatcher.js';
import { brewingMatcher } from './matchers/brewingMatcher.js';

export class RecommendationService {
  constructor(config = {}) {
    this.config = config;

    // Initialize matchers
    this.timeMatcher = new TimeMatcher(config.timeMatcher);
    this.activityMatcher = new ActivityMatcher(config.activityMatcher);
    this.seasonMatcher = new SeasonMatcher(config.seasonMatcher);
    this.foodMatcher = new FoodMatcher(config.foodMatcher);
    this.brewingMatcher = brewingMatcher;
  }

  /**
   * Get timing/time-of-day recommendations using TimeMatcher
   *
   * Based on: compounds (caffeine/theanine ratio) + tea type + processing
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Timing recommendations with hourly scores
   */
  getTimingRecommendations(teaModel, coreAnalysis) {
    try {
      const compoundAnalysis = coreAnalysis?.compounds;
      const teaTypeAnalysis = coreAnalysis?.teaType;
      const processingAnalysis = coreAnalysis?.processing;

      if (!compoundAnalysis || !teaTypeAnalysis) {
        return {
          success: false,
          error: 'Insufficient data for timing analysis'
        };
      }

      // Call TimeMatcher with analysis results
      const result = this.timeMatcher.matchTime(
        compoundAnalysis,
        teaTypeAnalysis,
        processingAnalysis
      );

      return {
        success: true,
        recommendations: {
          hourlyScores: result.hourlyScores,
          recommendedTimes: result.recommendedTimes,
          idealRanges: result.idealRanges,
          trace: result.trace
        }
      };
    } catch (error) {
      console.error('Error in getTimingRecommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get seasonal recommendations using SeasonMatcher
   *
   * Based on: geography (climate) + processing (roast) + tea type + flavor
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Seasonal recommendations with scored seasons
   */
  getSeasonalRecommendations(teaModel, coreAnalysis) {
    try {
      const geographyAnalysis = coreAnalysis?.geography;
      const processingAnalysis = coreAnalysis?.processing;
      const teaTypeAnalysis = coreAnalysis?.teaType;
      const flavorAnalysis = coreAnalysis?.flavor;

      if (!geographyAnalysis && !processingAnalysis) {
        return {
          success: false,
          error: 'Insufficient data for seasonal analysis'
        };
      }

      // Call SeasonMatcher with analysis results
      const result = this.seasonMatcher.matchSeason(
        geographyAnalysis,
        processingAnalysis,
        teaTypeAnalysis,
        flavorAnalysis
      );

      return {
        success: true,
        recommendations: result
      };
    } catch (error) {
      console.error('Error in getSeasonalRecommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get food pairing recommendations using FoodMatcher
   *
   * Based on: flavor profile + processing + tea type
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Food pairing recommendations with scored pairings
   */
  getFoodRecommendations(teaModel, coreAnalysis) {
    try {
      const flavorAnalysis = coreAnalysis?.flavor;
      const processingAnalysis = coreAnalysis?.processing;
      const teaTypeAnalysis = coreAnalysis?.teaType;

      if (!flavorAnalysis) {
        return {
          success: false,
          error: 'Insufficient flavor data for food pairing'
        };
      }

      // Call FoodMatcher with analysis results
      const result = this.foodMatcher.matchFood(
        flavorAnalysis,
        processingAnalysis,
        teaTypeAnalysis
      );

      return {
        success: true,
        recommendations: result
      };
    } catch (error) {
      console.error('Error in getFoodRecommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get activity recommendations using ActivityMatcher
   *
   * Based on: compounds (caffeine/theanine) + tea type + flavor
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Activity recommendations with scored activities and clusters
   */
  getActivityRecommendations(teaModel, coreAnalysis) {
    try {
      const compoundAnalysis = coreAnalysis?.compounds;
      const teaTypeAnalysis = coreAnalysis?.teaType;
      const flavorAnalysis = coreAnalysis?.flavor;

      if (!compoundAnalysis) {
        return {
          success: false,
          error: 'Insufficient data for activity recommendations'
        };
      }

      // Call ActivityMatcher with analysis results
      const result = this.activityMatcher.matchActivity(
        compoundAnalysis,
        teaTypeAnalysis,
        flavorAnalysis
      );

      return {
        success: true,
        recommendations: result
      };
    } catch (error) {
      console.error('Error in getActivityRecommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get brewing recommendations using brewingMatcher
   *
   * Based on: tea type, processing
   *
   * @param {TeaModel} teaModel - Tea model
   * @param {Object} coreAnalysis - Pre-calculated core analysis
   * @returns {Object} Brewing recommendations with gongfu/western parameters
   */
  getBrewingRecommendations(teaModel, coreAnalysis) {
    try {
      const processingAnalysis = coreAnalysis?.processing;

      if (!teaModel) {
        return {
          success: false,
          error: 'Tea model is required for brewing recommendations'
        };
      }

      // Call brewingMatcher for gongfu style
      const gongfuResult = this.brewingMatcher.getBrewingInfo(
        teaModel,
        'gongfu',
        processingAnalysis
      );

      // Call brewingMatcher for western style
      const westernResult = this.brewingMatcher.getBrewingInfo(
        teaModel,
        'western',
        processingAnalysis
      );

      return {
        success: true,
        recommendations: {
          gongfu: gongfuResult,
          western: westernResult
        }
      };
    } catch (error) {
      console.error('Error in getBrewingRecommendations:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Serialize all recommendations into a unified response
   * Each matcher returns results with its own structure
   */
  serialize(
    timing,
    seasonal,
    food,
    activities,
    brewing
  ) {
    return {
      timing: timing?.success ? timing.recommendations : {},
      seasonal: seasonal?.success ? seasonal.recommendations : {},
      food: food?.success ? food.recommendations : {},
      activities: activities?.success ? activities.recommendations : {},
      brewing: brewing?.success ? brewing.recommendations : {}
    };
  }
}

// Export singleton instance for convenience
export const recommendationService = new RecommendationService();
