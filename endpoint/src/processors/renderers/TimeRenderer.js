/**
 * TimeRenderer.js
 *
 * Purpose: Render time-of-day recommendations based on compound + tea type
 * Input:
 *   - compoundInference: { analysis: { stimulationLevel, relaxationLevel, compoundProfile } }
 *   - teaTypeInference: { analysis: { teaType, teaSubType } } (optional, for 15% refinement)
 * Output: Hourly recommendations with optimal drinking times
 *
 * Weighting: 85% compound profile + 15% tea type cultural tradition
 * Both use CompoundTaxonomy and TeaTypeTaxonomy for data-driven profiles
 */

import { CompoundTaxonomy, TeaTypeTaxonomy } from '../../taxonomies/index.js';

export class TimeRenderer {
  constructor(config = {}) {
    this.config = {
      rangeThreshold: config.rangeThreshold || 70,
      baseScore: config.baseScore || 50,
      maxRecommendations: config.maxRecommendations || 5,
      ...config
    };

    this.hours = Array.from({ length: 24 }, (_, i) => i); // [0, 1, ..., 23]

    // Map stimulation/relaxation levels to numeric values
    this.levelMap = {
      "none": 0,
      "very low": 1,
      "low": 2,
      "moderate": 3,
      "medium": 3,
      "medium-high": 4,
      "high": 5,
      "very high": 6,
      "high (smooth)": 5,
      "very high (smooth)": 6
    };

    // Time period names
    this.timePeriods = {
      night: { name: 'Night (0-5)', hours: [0, 1, 2, 3, 4, 5] },
      early_morning: { name: 'Early Morning (6-8)', hours: [6, 7, 8] },
      morning: { name: 'Morning (9-11)', hours: [9, 10, 11] },
      midday: { name: 'Midday (12-14)', hours: [12, 13, 14] },
      afternoon: { name: 'Afternoon (15-17)', hours: [15, 16, 17] },
      evening: { name: 'Evening (18-20)', hours: [18, 19, 20] },
      late_evening: { name: 'Late Evening (21-23)', hours: [21, 22, 23] }
    };
  }

  /**
   * Render time recommendations from compound + tea type
   * @param {Object} compoundInference - Output from CompoundInferrer
   * @param {Object} teaTypeInference - Output from TeaTypeInferrer (optional)
   * @returns {Object} - Time recommendations organized by hour and period
   */
  render(compoundInference, teaTypeInference = null) {
    const trace = [];

    // Extract inference data
    if (!compoundInference?.analysis) {
      return this._failedRender("No compound inference data provided", trace);
    }

    const analysis = compoundInference.analysis;
    const { stimulationLevel, relaxationLevel, compoundProfile } = analysis;

    trace.push({
      step: "Data Reception",
      reason: "Received compound inference",
      adjustment: `Profile: ${compoundProfile}, Stimulation: ${stimulationLevel}, Relaxation: ${relaxationLevel}`,
      value: "Inference validated"
    });

    // Initialize hourly scores
    const hourlyScores = new Map();
    this.hours.forEach(hour => {
      hourlyScores.set(hour, this.config.baseScore);
    });

    trace.push({
      step: "Scoring Initialization",
      reason: "Set base scores for all 24 hours",
      adjustment: `Initialized with base score ${this.config.baseScore}`,
      value: "Ready for profile matching"
    });

    // Apply stimulation level profile
    const stimulationProfile = this._getStimulationProfile(stimulationLevel);
    let stimulationAdjusted = 0;

    this.hours.forEach(hour => {
      const adjustment = stimulationProfile[hour];
      const currentScore = hourlyScores.get(hour);
      hourlyScores.set(hour, currentScore + adjustment);
      stimulationAdjusted += Math.abs(adjustment);
    });

    trace.push({
      step: "Stimulation Scoring",
      reason: `Stimulation level: ${stimulationLevel}`,
      adjustment: `Applied stimulation profile to all 24 hours`,
      value: `Total adjustments: ${stimulationAdjusted.toFixed(0)}`
    });

    // Apply relaxation level profile
    const relaxationProfile = this._getRelaxationProfile(relaxationLevel);
    let relaxationAdjusted = 0;

    this.hours.forEach(hour => {
      const adjustment = relaxationProfile[hour];
      const currentScore = hourlyScores.get(hour);
      hourlyScores.set(hour, currentScore + adjustment);
      relaxationAdjusted += Math.abs(adjustment);
    });

    trace.push({
      step: "Relaxation Scoring",
      reason: `Relaxation level: ${relaxationLevel}`,
      adjustment: `Applied relaxation profile to all 24 hours`,
      value: `Total adjustments: ${relaxationAdjusted.toFixed(0)}`
    });

    // ========== Apply Compound Profile (85% weight) ==========
    const compoundProfileObj = CompoundTaxonomy.getProfileByName(compoundProfile);
    let compoundAdjusted = 0;

    if (compoundProfileObj && compoundProfileObj.circadianProfile) {
      this.hours.forEach(hour => {
        const adjustment = compoundProfileObj.circadianProfile[hour];
        const currentScore = hourlyScores.get(hour);
        // Apply 85% of compound adjustment (the rest is for tea type)
        hourlyScores.set(hour, Math.max(1, currentScore + (adjustment * 0.85)));
        compoundAdjusted += Math.abs(adjustment);
      });
    }

    trace.push({
      step: "Compound Profile Scoring (85%)",
      reason: `Compound profile: ${compoundProfile}`,
      adjustment: `Applied compound profile at 85% weight to all 24 hours`,
      value: `Total adjustments: ${compoundAdjusted.toFixed(0)}`
    });

    // ========== Apply Tea Type Tradition (15% weight) ==========
    let teaTypeAdjusted = 0;
    let appliedTeaType = null;

    if (teaTypeInference?.analysis) {
      const teaTypeId = teaTypeInference.analysis.teaType;
      const teaType = teaTypeId ? TeaTypeTaxonomy.getType(teaTypeId) : null;

      if (teaType && teaType.baseTimeOfDayAffinities) {
        appliedTeaType = teaType.displayName;

        // Map time period affinities to hourly adjustments (centered on each period)
        const affinities = teaType.baseTimeOfDayAffinities;
        const timePeriodMaps = {
          night: [0, 1, 2, 3, 4, 5],
          earlyMorning: [6, 7, 8],
          morning: [9, 10, 11],
          midday: [12, 13, 14],
          afternoon: [15, 16, 17],
          evening: [18, 19, 20],
          lateEvening: [21, 22, 23]
        };

        // Calculate adjustment factor: convert 0-100 affinity to -50 to +50 adjustment
        Object.entries(timePeriodMaps).forEach(([period, hours]) => {
          const affinity = affinities[period] || 50; // Default to neutral (50)
          const adjustment = (affinity - 50) * 0.3; // Scale: -50 to +50 range * 0.3 intensity

          hours.forEach(hour => {
            const currentScore = hourlyScores.get(hour);
            // Apply 15% of tea type adjustment
            hourlyScores.set(hour, Math.max(1, currentScore + (adjustment * 0.15)));
            teaTypeAdjusted += Math.abs(adjustment);
          });
        });
      }
    }

    trace.push({
      step: "Tea Type Tradition Scoring (15%)",
      reason: appliedTeaType ? `Tea type: ${appliedTeaType} (cultural tradition)` : 'No tea type provided',
      adjustment: `Applied tea type cultural preference at 15% weight`,
      value: `Total adjustments: ${teaTypeAdjusted.toFixed(0)}`
    });

    // Get top recommendations
    const sortedHours = Array.from(hourlyScores.entries())
      .map(([hour, score]) => ({
        hour,
        score: Math.min(100, Math.max(0, score)),
        timeOfDay: this._getTimePeriod(hour)
      }))
      .sort((a, b) => b.score - a.score);

    const recommendations = sortedHours.slice(0, this.config.maxRecommendations);

    trace.push({
      step: "Final Selection",
      reason: "Selected top hours",
      adjustment: `Selected ${recommendations.length} top hours`,
      value: recommendations.map(r => `${r.hour}:00 (${r.score.toFixed(0)})`).join(", ")
    });

    // Group by time period
    const periodGrouping = this._groupByPeriod(sortedHours);

    return {
      // Top recommended hours
      recommendations,

      // All hourly scores (for visualization)
      hourlyScores: Object.fromEntries(hourlyScores),

      // Grouped by time period
      periodGrouping,

      // Supporting data
      analysis: {
        compoundProfile,
        stimulationLevel,
        relaxationLevel,
        teaTypeApplied: appliedTeaType ? true : false,
        teaType: appliedTeaType,
        weighting: {
          compound: '85%',
          teaType: '15%',
          note: 'Compound profile (stimulation/relaxation) weighted 85%, tea type cultural tradition weighted 15%'
        }
      },

      // Metadata
      trace,
      confidence: compoundInference.confidence || 0.85,
      rendererVersion: '1.0'
    };
  }

  // ========== Helper Methods ==========

  /**
   * Get stimulation profile for all 24 hours
   */
  _getStimulationProfile(levelStr) {
    const level = this.levelMap[levelStr.toLowerCase()] || 0;
    const profile = new Array(24).fill(0);
    const boost = level * 5;
    const penalty = -level * 8;

    // Morning/Midday Boost (7am to 4pm, peak at 10:30)
    for (let h = 7; h <= 16; h++) {
      let factor = Math.max(0, 1.0 - Math.abs(h - 10.5) / 6.5);
      profile[h] = boost * factor;
    }

    // Evening/Night Penalty (6pm onwards, deep night 0-5am)
    for (let h = 18; h <= 23; h++) {
      profile[h] = penalty * 0.6 * (1 + (h - 18) / 5);
    }
    for (let h = 0; h <= 5; h++) {
      profile[h] = penalty;
    }

    return profile.map(p => Math.round(p));
  }

  /**
   * Get relaxation profile for all 24 hours
   */
  _getRelaxationProfile(levelStr) {
    const level = this.levelMap[levelStr.toLowerCase()] || 0;
    const profile = new Array(24).fill(0);
    const boost = level * 3.5;
    const penalty = -level * 3;

    // Evening/Night Boost (5pm to midnight, peak at 9pm)
    for (let h = 17; h <= 23; h++) {
      let factor = Math.max(0, 1 - Math.abs(h - 21) / 4.5);
      if (h === 23 || h === 0 || h === 1) factor *= 0.1;
      profile[h] = boost * factor;
    }
    for (let h = 0; h <= 1; h++) {
      profile[h] = boost * 0.1;
    }

    // Morning Penalty (7am to 11am)
    for (let h = 7; h <= 11; h++) {
      profile[h] = penalty;
    }

    return profile.map(p => Math.round(p));
  }


  /**
   * Get time period name for an hour
   */
  _getTimePeriod(hour) {
    for (const [key, period] of Object.entries(this.timePeriods)) {
      if (period.hours.includes(hour)) {
        return period.name;
      }
    }
    return "Unknown";
  }

  /**
   * Group hours by time period
   */
  _groupByPeriod(hourlyData) {
    const grouped = {};

    for (const [key, period] of Object.entries(this.timePeriods)) {
      const hoursInPeriod = hourlyData.filter(h => period.hours.includes(h.hour));

      if (hoursInPeriod.length > 0) {
        const avgScore = hoursInPeriod.reduce((sum, h) => sum + h.score, 0) / hoursInPeriod.length;

        grouped[key] = {
          period: period.name,
          hours: hoursInPeriod.map(h => ({
            hour: h.hour,
            score: h.score
          })),
          averageScore: parseFloat(avgScore.toFixed(1)),
          count: hoursInPeriod.length
        };
      }
    }

    return grouped;
  }

  /**
   * Return error render when inference fails
   */
  _failedRender(reason, trace) {
    return {
      recommendations: [],
      hourlyScores: {},
      periodGrouping: {},
      analysis: {
        compoundProfile: "Unknown",
        stimulationLevel: "Unknown",
        relaxationLevel: "Unknown"
      },
      trace: [{
        step: "Error",
        reason,
        adjustment: "Unable to render recommendations",
        value: "Failed"
      }],
      confidence: 0.0,
      rendererVersion: '1.0'
    };
  }
}
