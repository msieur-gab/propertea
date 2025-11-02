/**
 * SeasonRenderer.js
 *
 * Purpose: Render seasonal recommendations based on multiple analyses
 * Input: Geography, Processing, TeaType, and Flavor analysis data
 * Output: Seasonal recommendations with continuous seasonal ranges
 *
 * This Renderer adapts logic from SeasonMatcher using SeasonTaxonomy
 */

import { SeasonTaxonomy } from '../../taxonomies/index.js';

export class SeasonRenderer {
  constructor(config = {}) {
    this.config = {
      rangeThreshold: config.rangeThreshold || 60,
      ...config
    };

    this.seasonTaxonomy = SeasonTaxonomy;

    // Granular seasons in order (12 seasons + Anytime)
    this.granularSeasons = [
      'SEASON_EARLY_SPRING',
      'SEASON_SPRING',
      'SEASON_LATE_SPRING',
      'SEASON_EARLY_SUMMER',
      'SEASON_SUMMER',
      'SEASON_LATE_SUMMER',
      'SEASON_EARLY_AUTUMN',
      'SEASON_AUTUMN',
      'SEASON_LATE_AUTUMN',
      'SEASON_EARLY_WINTER',
      'SEASON_WINTER',
      'SEASON_LATE_WINTER',
      'SEASON_ANYTIME'
    ];

    // Simple seasons for compatibility
    this.simpleSeasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'Anytime'];
  }

  /**
   * Render seasonal recommendations from multiple analyses
   * @param {Object} geographyAnalysis - Analysis from geography/harvest data
   * @param {Object} processingAnalysis - Analysis from processing methods
   * @param {Object} teaTypeAnalysis - Analysis from tea type
   * @param {Object} flavorAnalysis - Analysis from flavor profile
   * @returns {Object} - Seasonal recommendations
   */
  render(geographyAnalysis = {}, processingAnalysis = {}, teaTypeAnalysis = {}, flavorAnalysis = {}) {
    const trace = [];

    // Extract relevant seasonal hints from inputs
    const geographySeasonalHint = geographyAnalysis?.harvestSeason || geographyAnalysis?.season?.harvestSeason || "Unknown";
    const processingThermalEffect = processingAnalysis?.energeticTendency || processingAnalysis?.thermalEffect || "neutral";
    const teaSeasonalTendency = teaTypeAnalysis?.seasonalTendency || teaTypeAnalysis?.analysis?.seasonalTendency || "neutral";
    const seasonalAffinityHints = flavorAnalysis?.analysis?.seasonalAffinityHints ||
                                  flavorAnalysis?.seasonalAffinityHints ||
                                  [];
    const dominantFlavorCategories = flavorAnalysis?.analysis?.dominantCategories ||
                                     flavorAnalysis?.dominantFlavorCategories ||
                                     [];

    trace.push({
      step: "Input Processing",
      reason: "Extract seasonal data from multiple analyses",
      adjustment: `Geography: ${geographySeasonalHint}, Processing: ${processingThermalEffect}, Type: ${teaSeasonalTendency}`,
      value: `Flavor categories: ${dominantFlavorCategories.join(', ')}`
    });

    // Initialize season scores
    const seasonScores = new Map();
    this.granularSeasons.forEach(seasonId => {
      seasonScores.set(seasonId, 50); // Base score
    });

    trace.push({
      step: "Scoring Initialization",
      reason: "Initialize all 13 seasons with base score",
      adjustment: `Initialized ${this.granularSeasons.length} seasons with base score 50`,
      value: "Ready for matching"
    });

    // Apply geography/harvest season affinity
    if (geographySeasonalHint && geographySeasonalHint !== "Unknown") {
      const harvestSeasonMap = this._getHarvestSeasonMap(geographySeasonalHint);
      harvestSeasonMap.forEach((boost, seasonId) => {
        const current = seasonScores.get(seasonId) || 50;
        seasonScores.set(seasonId, current + boost);
      });

      trace.push({
        step: "Geography Matching",
        reason: `Harvest season: ${geographySeasonalHint}`,
        adjustment: "Applied harvest season affinities",
        value: "Season scores updated"
      });
    }

    // Apply processing thermal effect
    const thermalAdjustments = this._getProcessingThermalAdjustments(processingThermalEffect);
    thermalAdjustments.forEach((boost, seasonId) => {
      const current = seasonScores.get(seasonId) || 50;
      seasonScores.set(seasonId, current + boost);
    });

    trace.push({
      step: "Processing Matching",
      reason: `Processing thermal effect: ${processingThermalEffect}`,
      adjustment: "Applied processing affinity to seasons",
      value: "Season scores updated"
    });

    // Apply tea type seasonal tendency
    const typeAdjustments = this._getTeaTypeSeasonalAdjustments(teaSeasonalTendency);
    typeAdjustments.forEach((boost, seasonId) => {
      const current = seasonScores.get(seasonId) || 50;
      seasonScores.set(seasonId, current + boost);
    });

    trace.push({
      step: "Tea Type Matching",
      reason: `Tea type seasonal tendency: ${teaSeasonalTendency}`,
      adjustment: "Applied tea type seasonal affinities",
      value: "Season scores updated"
    });

    // Apply flavor seasonal affinity hints
    let flavorHintsApplied = 0;
    seasonalAffinityHints.forEach(seasonId => {
      const current = seasonScores.get(seasonId) || 50;
      seasonScores.set(seasonId, current + 15);
      flavorHintsApplied++;
    });

    trace.push({
      step: "Flavor Matching",
      reason: `Applied ${seasonalAffinityHints.length} flavor seasonal hints`,
      adjustment: `Boosted ${flavorHintsApplied} season scores by +15`,
      value: `Hint seasons: ${seasonalAffinityHints.join(', ')}`
    });

    // Get recommendations
    const sortedSeasons = Array.from(seasonScores.entries())
      .map(([seasonId, score]) => {
        const season = this.seasonTaxonomy.getSeason(seasonId);
        return {
          seasonId,
          displayName: season ? season.displayName : seasonId,
          score: Math.min(100, Math.max(0, score))
        };
      })
      .sort((a, b) => b.score - a.score);

    const recommendations = sortedSeasons.filter(s => s.score >= this.config.rangeThreshold);

    trace.push({
      step: "Final Selection",
      reason: `Filter seasons with score >= ${this.config.rangeThreshold}`,
      adjustment: `Found ${recommendations.length} recommended seasons`,
      value: recommendations.map(r => `${r.displayName} (${r.score.toFixed(0)})`).join(", ")
    });

    // Identify continuous seasonal range
    const seasonalRange = this._findContinuousRange(recommendations);

    return {
      // Top recommended seasons
      recommendations,

      // All seasonal scores
      seasonalScores: this._formatSeasonalScores(sortedSeasons),

      // Continuous seasonal range (if applicable)
      seasonalRange,

      // Supporting data
      analysis: {
        geographySeasonalHint,
        processingThermalEffect,
        teaSeasonalTendency,
        flavorHintsCount: seasonalAffinityHints.length
      },

      // Metadata
      trace,
      confidence: 0.85,
      rendererVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Map harvest season to season score adjustments
   */
  _getHarvestSeasonMap(harvestSeason) {
    const map = new Map();
    const seasonMatch = harvestSeason.toLowerCase();

    // Default boost for seasons matching harvest
    if (seasonMatch.includes('spring')) {
      ['SEASON_EARLY_SPRING', 'SEASON_SPRING', 'SEASON_LATE_SPRING'].forEach(s => {
        map.set(s, 20);
      });
    } else if (seasonMatch.includes('summer')) {
      ['SEASON_EARLY_SUMMER', 'SEASON_SUMMER', 'SEASON_LATE_SUMMER'].forEach(s => {
        map.set(s, 20);
      });
    } else if (seasonMatch.includes('autumn')) {
      ['SEASON_EARLY_AUTUMN', 'SEASON_AUTUMN', 'SEASON_LATE_AUTUMN'].forEach(s => {
        map.set(s, 20);
      });
    } else if (seasonMatch.includes('winter')) {
      ['SEASON_EARLY_WINTER', 'SEASON_WINTER', 'SEASON_LATE_WINTER'].forEach(s => {
        map.set(s, 20);
      });
    }

    return map;
  }

  /**
   * Get processing thermal effect adjustments
   */
  _getProcessingThermalAdjustments(thermalEffect) {
    const map = new Map();
    const effect = thermalEffect.toLowerCase();

    if (effect.includes('warming') || effect.includes('hot')) {
      // Warming teas are better in cold seasons
      ['SEASON_EARLY_WINTER', 'SEASON_WINTER', 'SEASON_LATE_WINTER', 'SEASON_LATE_AUTUMN'].forEach(s => {
        map.set(s, 12);
      });
      // Penalize hot seasons
      ['SEASON_EARLY_SUMMER', 'SEASON_SUMMER', 'SEASON_LATE_SUMMER'].forEach(s => {
        map.set(s, -8);
      });
    } else if (effect.includes('cooling') || effect.includes('cool')) {
      // Cooling teas are better in warm seasons
      ['SEASON_EARLY_SUMMER', 'SEASON_SUMMER', 'SEASON_LATE_SUMMER'].forEach(s => {
        map.set(s, 12);
      });
      // Penalize cold seasons
      ['SEASON_EARLY_WINTER', 'SEASON_WINTER', 'SEASON_LATE_WINTER'].forEach(s => {
        map.set(s, -8);
      });
    }

    return map;
  }

  /**
   * Get tea type seasonal adjustments
   */
  _getTeaTypeSeasonalAdjustments(seasonalTendency) {
    const map = new Map();
    const tendency = seasonalTendency.toLowerCase();

    if (tendency.includes('spring')) {
      ['SEASON_EARLY_SPRING', 'SEASON_SPRING', 'SEASON_LATE_SPRING'].forEach(s => {
        map.set(s, 10);
      });
    } else if (tendency.includes('summer')) {
      ['SEASON_EARLY_SUMMER', 'SEASON_SUMMER', 'SEASON_LATE_SUMMER'].forEach(s => {
        map.set(s, 10);
      });
    } else if (tendency.includes('autumn')) {
      ['SEASON_EARLY_AUTUMN', 'SEASON_AUTUMN', 'SEASON_LATE_AUTUMN'].forEach(s => {
        map.set(s, 10);
      });
    } else if (tendency.includes('winter')) {
      ['SEASON_EARLY_WINTER', 'SEASON_WINTER', 'SEASON_LATE_WINTER'].forEach(s => {
        map.set(s, 10);
      });
    } else if (tendency.includes('year') || tendency.includes('anytime')) {
      map.set('SEASON_ANYTIME', 15);
    }

    return map;
  }

  /**
   * Find continuous seasonal range
   */
  _findContinuousRange(recommendations) {
    if (recommendations.length === 0) {
      return null;
    }

    // Map season IDs to indices
    const recommendedIds = recommendations.map(r => r.seasonId);
    const indices = recommendedIds.map(id => this.granularSeasons.indexOf(id));

    if (indices.length === 1) {
      return {
        type: 'single',
        seasons: recommendations,
        description: recommendations[0].displayName
      };
    }

    // Find continuous ranges
    const ranges = [];
    let currentRange = [indices[0]];

    for (let i = 1; i < indices.length; i++) {
      if (indices[i] === currentRange[currentRange.length - 1] + 1) {
        currentRange.push(indices[i]);
      } else {
        ranges.push([...currentRange]);
        currentRange = [indices[i]];
      }
    }
    ranges.push(currentRange);

    if (ranges.length === 1 && ranges[0].length > 2) {
      const seasonIds = ranges[0].map(i => this.granularSeasons[i]);
      const seasons = seasonIds.map(id => {
        const season = this.seasonTaxonomy.getSeason(id);
        return season ? season.displayName : id;
      });
      return {
        type: 'continuous',
        seasons: seasons,
        description: `${seasons[0]} through ${seasons[seasons.length - 1]}`
      };
    }

    return {
      type: 'scattered',
      seasons: recommendations.map(r => r.displayName),
      description: "Multiple scattered seasons"
    };
  }

  /**
   * Format seasonal scores for output
   */
  _formatSeasonalScores(seasons) {
    const formatted = {};
    seasons.forEach(season => {
      formatted[season.seasonId] = {
        displayName: season.displayName,
        score: season.score
      };
    });
    return formatted;
  }
}
