/**
 * TimeRenderer.js
 *
 * Purpose: Render time-of-day recommendations based on compound inference
 * Input: CompoundInferrer output { analysis: { stimulationLevel, relaxationLevel, compoundProfile } }
 * Output: Hourly recommendations with optimal drinking times
 *
 * This Renderer adapts logic from TimeMatcher to provide time-based recommendations
 */

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
   * Render time recommendations from compound inference
   * @param {Object} compoundInference - Output from CompoundInferrer
   * @returns {Object} - Time recommendations organized by hour and period
   */
  render(compoundInference) {
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

    // Apply compound profile adjustments
    const compoundProfile_adjusted = this._getCompoundEffectProfile(compoundProfile);
    let compoundAdjusted = 0;

    this.hours.forEach(hour => {
      const adjustment = compoundProfile_adjusted[hour];
      const currentScore = hourlyScores.get(hour);
      hourlyScores.set(hour, Math.max(1, currentScore + adjustment));
      compoundAdjusted += Math.abs(adjustment);
    });

    trace.push({
      step: "Compound Profile Scoring",
      reason: `Compound profile: ${compoundProfile}`,
      adjustment: `Applied compound profile to all 24 hours`,
      value: `Total adjustments: ${compoundAdjusted.toFixed(0)}`
    });

    // Get top recommendations
    const sortedHours = Array.from(hourlyScores.entries())
      .map(([hour, score]) => ({
        hour,
        score: Math.min(100, Math.max(0, score)),
        period: this._getTimePeriod(hour)
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
        relaxationLevel
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
   * Get compound profile adjustments
   */
  _getCompoundEffectProfile(profileName) {
    const profile = new Array(24).fill(0);

    switch (profileName) {
      case "Intense & Sharp":
        for (let h = 7; h <= 13; h++) {
          profile[h] = 18 * (1 - Math.abs(h - 9.5) / 4.5);
        }
        for (let h = 18; h <= 23; h++) {
          profile[h] = -35 * ((h - 17) / 6);
        }
        for (let h = 0; h <= 5; h++) {
          profile[h] = -45;
        }
        break;

      case "Focused & Energized":
        for (let h = 8; h <= 15; h++) {
          profile[h] = 15 * (1 - Math.abs(h - 11) / 5);
        }
        for (let h = 19; h <= 23; h++) {
          profile[h] = -25 * ((h - 18) / 5);
        }
        for (let h = 0; h <= 6; h++) {
          profile[h] = -30;
        }
        break;

      case "Calm & Clear":
        for (let h = 9; h <= 18; h++) {
          profile[h] = 10 * (1 - Math.abs(h - 13.5) / 9);
        }
        for (let h = 19; h <= 22; h++) {
          profile[h] = 12 * (1 - Math.abs(h - 20.5) / 2.5);
        }
        for (let h = 0; h <= 7; h++) {
          profile[h] = -20;
        }
        break;

      case "Deeply Calm":
        for (let h = 17; h <= 23; h++) {
          profile[h] = 20 * (1 - Math.abs(h - 21) / 6);
        }
        for (let h = 0; h <= 7; h++) {
          profile[h] = 5;
        }
        for (let h = 8; h <= 16; h++) {
          profile[h] = -25;
        }
        break;

      case "Balanced & Focused":
        for (let h = 8; h <= 17; h++) {
          profile[h] = 12 * (1 - Math.abs(h - 12.5) / 9);
        }
        for (let h = 18; h <= 21; h++) {
          profile[h] = 8;
        }
        for (let h = 0; h <= 6; h++) {
          profile[h] = -15;
        }
        break;

      case "Smooth & Sustained":
        for (let h = 8; h <= 20; h++) {
          profile[h] = 8;
        }
        for (let h = 0; h <= 7; h++) {
          profile[h] = -10;
        }
        break;

      case "Smooth & Alert":
        for (let h = 7; h <= 19; h++) {
          profile[h] = 10 * (1 - Math.abs(h - 13) / 12);
        }
        for (let h = 0; h <= 6; h++) {
          profile[h] = -20;
        }
        break;

      default:
        // Neutral profile
        break;
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
