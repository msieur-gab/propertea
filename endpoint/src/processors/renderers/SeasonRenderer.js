/**
 * SeasonRenderer.js
 *
 * Purpose: Render seasonal recommendations based on tea type and processing method
 * Input: TeaType analysis and Processing analysis data
 * Output: Seasonal recommendations with complete 12-month circular visualization
 *
 * This Renderer uses SeasonTaxonomy and seasonal affinities from TeaTypeTaxonomy
 *
 * SEASONAL RECOMMENDATION HIERARCHY (Chinese Tea Culture):
 * Tier 1 (Primary 60%): Tea type/subtype seasonal affinity
 *   - Reflects cultural traditions and natural seasonal pairing (green tea = spring)
 * Tier 2 (Secondary 40%): Processing method seasonal affinity
 *   - Reflects thermal character and post-harvest processing (heavy roast = winter)
 *
 * Note: Seasonal affinity comes from the TEA itself (type + processing), not external factors
 * Geography, climate, and flavor are not used - they don't determine seasonal suitability
 */

import { SeasonTaxonomy, ProcessingTaxonomy, TeaTypeTaxonomy } from '../../taxonomies/index.js';

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
   * Render seasonal recommendations from tea type, processing, and geography analysis
   * @param {Object} teaTypeAnalysis - Analysis from tea type/subtype
   * @param {Object} processingAnalysis - Analysis from processing methods
   * @param {Object} geographyAnalysis - Analysis from geographic/altitude data (optional)
   * @returns {Object} - Seasonal recommendations with altitude awareness
   */
  render(teaTypeAnalysis = {}, processingAnalysis = {}, geographyAnalysis = {}) {
    const trace = [];

    // Initialize season scores
    const seasonScores = new Map();
    this.granularSeasons.forEach(seasonId => {
      seasonScores.set(seasonId, 50); // Base score
    });

    trace.push({
      step: "Scoring Initialization",
      reason: "Initialize all 13 seasons with neutral base score",
      adjustment: `Initialized ${this.granularSeasons.length} seasons with base score 50`,
      value: "Using tea type + processing for seasonal affinity"
    });

    // ========== TIER 1 (60%): Tea Type/Subtype Seasonal Affinity ==========
    // Extract tea type IDs from analysis and look up objects from taxonomy
    const teaTypeId = teaTypeAnalysis?.analysis?.teaType;
    const teaSubtypeId = teaTypeAnalysis?.analysis?.teaSubType;

    // Look up full objects from taxonomy to get seasonalAffinity
    const teaType = teaTypeId ? TeaTypeTaxonomy.getType(teaTypeId) : null;
    const teaSubtype = teaSubtypeId ? TeaTypeTaxonomy.getSubtype(teaSubtypeId) : null;
    let typeAffinitiesApplied = 0;

    if (teaType && teaType.seasonalAffinity && Array.isArray(teaType.seasonalAffinity)) {
      teaType.seasonalAffinity.forEach(affinity => {
        const current = seasonScores.get(affinity.seasonId) || 50;
        // Tier 1: 60% weight
        seasonScores.set(affinity.seasonId, current + (affinity.boost * 0.6));
        typeAffinitiesApplied++;
      });
    }

    // If subtype has different affinity, apply it with additional boost
    if (teaSubtype && teaSubtype.seasonalAffinity && Array.isArray(teaSubtype.seasonalAffinity)) {
      teaSubtype.seasonalAffinity.forEach(affinity => {
        const current = seasonScores.get(affinity.seasonId) || 50;
        // Subtype provides additional refinement (up to 60% total for tea type)
        seasonScores.set(affinity.seasonId, current + (affinity.boost * 0.4));
        typeAffinitiesApplied++;
      });
    }

    trace.push({
      step: "Tea Type Seasonal Affinity (TIER 1 - 60%)",
      reason: `Tea type: ${teaType?.displayName || 'unknown'}, Subtype: ${teaSubtype?.displayName || 'none'}`,
      adjustment: `Applied ${typeAffinitiesApplied} seasonal affinity boosts from tea type/subtype`,
      value: "Tea type defines intrinsic seasonal suitability per cultural tradition"
    });

    // ========== TIER 2 (40%): Processing Method Seasonal Affinity ==========
    let processingAffinitiesApplied = 0;
    let appliedMethods = [];

    if (processingAnalysis?.analysis?.identifiedMethods && Array.isArray(processingAnalysis.analysis.identifiedMethods)) {
      processingAnalysis.analysis.identifiedMethods.forEach(methodData => {
        // Look up full method from taxonomy to get seasonalAffinity
        const fullMethod = ProcessingTaxonomy.getMethod(methodData.id);
        if (fullMethod && fullMethod.seasonalAffinity && Array.isArray(fullMethod.seasonalAffinity)) {
          appliedMethods.push(methodData.displayName);
          fullMethod.seasonalAffinity.forEach(affinity => {
            const current = seasonScores.get(affinity.seasonId) || 50;
            // Tier 2: 40% weight
            seasonScores.set(affinity.seasonId, current + (affinity.boost * 0.4));
            processingAffinitiesApplied++;
          });
        }
      });
    }

    trace.push({
      step: "Processing Method Seasonal Affinity (TIER 2 - 40%)",
      reason: `Processing methods: ${appliedMethods.join(', ') || 'none'}`,
      adjustment: `Applied ${processingAffinitiesApplied} seasonal affinity boosts from processing methods`,
      value: "Processing thermal character refines seasonal recommendation"
    });

    // ========== TIER 3 (±15% Modifier): Geographic/Altitude Awareness ==========
    // High-mountain teas (1200m+): Extended spring, cooler preference
    // Low-elevation teas (<600m): Stronger autumn/winter, warmer affinity
    let altitudeModifier = 0;
    let elevationLevel = "Unknown";

    if (geographyAnalysis?.analysis?.elevation) {
      // Extract classification from elevation object
      const elevationObj = geographyAnalysis.analysis.elevation;
      elevationLevel = typeof elevationObj === 'object' ? elevationObj.classification : elevationObj;

      // Apply altitude-based seasonal modulation
      if (elevationLevel === "Very High" || elevationLevel === "High") {
        // High-mountain teas: Extend spring, reduce hot seasons, slight autumn
        altitudeModifier = 8; // +8 points for spring/cool seasons

        // Boost spring seasons (+8)
        ['SEASON_EARLY_SPRING', 'SEASON_SPRING', 'SEASON_LATE_SPRING'].forEach(seasonId => {
          const current = seasonScores.get(seasonId) || 50;
          seasonScores.set(seasonId, current + altitudeModifier);
        });

        // Slight reduction for hot seasons (-3)
        ['SEASON_SUMMER', 'SEASON_LATE_SUMMER'].forEach(seasonId => {
          const current = seasonScores.get(seasonId) || 50;
          seasonScores.set(seasonId, Math.max(50, current - 3));
        });

        trace.push({
          step: "Geographic Altitude Awareness (TIER 3 - ±15% Modifier)",
          reason: `Elevation: ${elevationLevel} (high-mountain)`,
          adjustment: `High-altitude boosts spring seasons (+${altitudeModifier}), reduces summer (-3)`,
          value: "Cooler microclimate extends spring season, limits heat-tolerant months"
        });

      } else if (elevationLevel === "Very Low" || elevationLevel === "Low") {
        // Low-elevation teas: Emphasize autumn/winter, reduce spring intensity
        altitudeModifier = -5; // -5 for spring/cool, +8 for autumn/winter

        // Reduce spring seasons (-5)
        ['SEASON_EARLY_SPRING', 'SEASON_SPRING', 'SEASON_LATE_SPRING'].forEach(seasonId => {
          const current = seasonScores.get(seasonId) || 50;
          seasonScores.set(seasonId, Math.max(50, current + altitudeModifier));
        });

        // Boost autumn/winter (+8)
        ['SEASON_EARLY_AUTUMN', 'SEASON_AUTUMN', 'SEASON_LATE_AUTUMN', 'SEASON_EARLY_WINTER', 'SEASON_WINTER', 'SEASON_LATE_WINTER'].forEach(seasonId => {
          const current = seasonScores.get(seasonId) || 50;
          seasonScores.set(seasonId, current + 8);
        });

        trace.push({
          step: "Geographic Altitude Awareness (TIER 3 - ±15% Modifier)",
          reason: `Elevation: ${elevationLevel} (low-elevation)`,
          adjustment: `Low-altitude reduces spring (-5), boosts autumn/winter (+8)`,
          value: "Warmer microclimate favors autumn/winter drinking, weak spring affinity"
        });

      } else {
        // Medium elevation: No altitude adjustment
        trace.push({
          step: "Geographic Altitude Awareness (TIER 3 - ±15% Modifier)",
          reason: `Elevation: ${elevationLevel} (medium-altitude)`,
          adjustment: "No altitude modifier applied",
          value: "Medium elevation has balanced seasonal affinity"
        });
      }
    } else {
      trace.push({
        step: "Geographic Altitude Awareness (TIER 3 - ±15% Modifier)",
        reason: "No geographic data provided",
        adjustment: "Skipped altitude-based seasonal modulation",
        value: "Using Tier 1 and Tier 2 scoring only"
      });
    }

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

    // Build month-by-month circular year view (all 12 granular seasons with scores)
    const circularYear = this.granularSeasons
      .filter(seasonId => seasonId !== 'SEASON_ANYTIME') // Exclude ANYTIME from circular view
      .map((seasonId, index) => {
        const season = this.seasonTaxonomy.getSeason(seasonId);
        const score = seasonScores.get(seasonId) || 50;
        return {
          month: index + 1, // 1-12 for display
          seasonId,
          displayName: season ? season.displayName : seasonId,
          score: Math.min(100, Math.max(0, score))
        };
      });

    // Build flat seasonal scores object for simple lookup and chart plotting
    // Parallel to TimeRenderer's hourlyScores structure
    // Uses seasonId as key (e.g., "SEASON_EARLY_SPRING") for semantic clarity
    const monthlyScores = {};
    circularYear.forEach(monthData => {
      monthlyScores[monthData.seasonId] = monthData.score;
    });

    return {
      // Top recommended seasons (above threshold)
      recommendations,

      // Circular year view: All 12 months with scores and names for visualization
      // Perfect for circular/radial charts showing seasonal affinity throughout the year
      circularYear,

      // Flat monthly scores for simple lookup (month: score)
      // Parallel to TimeRenderer's hourlyScores
      // Perfect for chart implementations: { 1: 65, 2: 72, ..., 12: 58 }
      monthlyScores,

      // All seasonal scores (including ANYTIME)
      seasonalScores: this._formatSeasonalScores(sortedSeasons),

      // Continuous seasonal range (if applicable)
      seasonalRange,

      // Supporting data
      analysis: {
        teaTypeApplied: true,
        processingApplied: true,
        method: 'Tea type + Processing seasonal affinity'
      },

      // Metadata
      trace,
      confidence: 0.85,
      rendererVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Find continuous seasonal range
   *
   * IMPORTANT: Recommendations arrive sorted by score (descending), not chronologically.
   * We must sort indices chronologically before checking for contiguity.
   *
   * Example: If recommendations = [Late Autumn (score 85), Early Winter (score 90), Winter (score 80)]
   * - Original indices: [8, 9, 10] → happens to be continuous
   * - But if indices were [8, 10, 9] from reordering, we'd get "scattered" without sorting first
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

    // ✅ CRITICAL: Sort indices chronologically (ascending) before checking contiguity
    // This ensures "Late Autumn → Early Winter → Winter" is recognized as continuous,
    // not scattered, even if recommendations arrived in score order [90, 85, 80]
    const sortedIndices = [...indices].sort((a, b) => a - b);

    // Find continuous ranges using chronologically sorted indices
    const ranges = [];
    let currentRange = [sortedIndices[0]];

    for (let i = 1; i < sortedIndices.length; i++) {
      if (sortedIndices[i] === currentRange[currentRange.length - 1] + 1) {
        currentRange.push(sortedIndices[i]);
      } else {
        ranges.push([...currentRange]);
        currentRange = [sortedIndices[i]];
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
