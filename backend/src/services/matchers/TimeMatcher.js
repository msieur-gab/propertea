/**
 * TimeMatcher.js - REFACTORED WITH CONFIDENCE WEIGHTING
 *
 * Matches a tea's profile to suitable hours of the day (0-23).
 * Now includes confidence metrics for each hourly recommendation.
 *
 * IMPROVEMENTS:
 * - Each hourly score includes confidence bounds
 * - Confidence reflects data completeness (more data = higher confidence)
 * - Recommended times include confidence assessment
 * - Ideal time ranges show confidence levels
 *
 * INPUT: Tea model with compound analysis, tea type, processing
 * OUTPUT: Hourly scores with confidence, recommended times, ideal ranges
 */

import ConfidenceCalculator, {
  calculateDataConfidence,
  calculateUncertaintyRange
} from '../../models/ConfidenceCalculator.js';

export class TimeMatcher {
  constructor(config = {}) {
    this.config = {
      rangeThreshold: config.rangeThreshold || 70,
      baseScore: config.baseScore || 50,
      maxRecommendations: config.maxRecommendations || 3,
      ...config
    };
    this.hours = Array.from({ length: 24 }, (_, i) => i);

    this.levelMap = {
      'none': 0,
      'very low': 1,
      'low': 2,
      'moderate': 3,
      'medium': 3,
      'medium-high': 4,
      'high': 5,
      'very high': 6
    };
  }

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  _adjustScoreForHour(trace, scoreMap, hour, adjustment, reasonStep, reasonDetail) {
    if (hour < 0 || hour > 23) return;
    const currentScore = scoreMap.get(hour);
    let newScore = currentScore + adjustment;
    if (adjustment < 0) {
      newScore = Math.max(1, newScore);
    } else {
      newScore = Math.max(0, newScore);
    }
    scoreMap.set(hour, newScore);
    trace.push({
      step: reasonStep,
      reason: reasonDetail,
      adjustment: `${adjustment >= 0 ? '+' : ''}${adjustment} @ Hour ${hour}`,
      value: newScore.toFixed(1)
    });
  }

  _applyHourlyProfile(trace, scoreMap, profile, reasonStep, reasonDetail) {
    if (!Array.isArray(profile) || profile.length !== 24) {
      console.error('Invalid hourly profile provided.');
      trace.push({
        step: 'Error',
        reason: 'Invalid hourly profile applied',
        adjustment: 'Skipped profile application'
      });
      return;
    }
    this.hours.forEach(hour => {
      this._adjustScoreForHour(trace, scoreMap, hour, profile[hour], reasonStep, reasonDetail);
    });
  }

  // ========================================================================
  // HOURLY PROFILES (unchanged from v2)
  // ========================================================================

  _getStimulationProfile(level) {
    const profile = new Array(24).fill(0);
    const boost = level * 5;
    const penalty = -level * 8;

    for (let h = 7; h <= 16; h++) {
      let factor = Math.max(0, 1.0 - Math.abs(h - 10.5) / 6.5);
      profile[h] = boost * factor;
    }
    for (let h = 18; h <= 23; h++) {
      profile[h] = penalty * 0.6 * (1 + (h - 18) / 5);
    }
    for (let h = 0; h <= 5; h++) {
      profile[h] = penalty;
    }

    return profile.map(p => Math.round(p));
  }

  _getRelaxationProfile(level) {
    const profile = new Array(24).fill(0);
    const boost = level * 3.5;
    const penalty = -level * 3;

    for (let h = 17; h <= 23; h++) {
      let factor = Math.max(0, 1 - Math.abs(h - 21) / 4.5);
      if (h === 23 || h === 0 || h === 1) factor *= 0.1;
      profile[h] = boost * factor;
    }
    for (let h = 0; h <= 1; h++) {
      profile[h] = boost * 0.1;
    }

    for (let h = 7; h <= 11; h++) {
      profile[h] = penalty;
    }

    return profile.map(p => Math.round(p));
  }

  _getCompoundEffectProfile(compoundProfileName) {
    const profile = new Array(24).fill(0);
    switch (compoundProfileName) {
      case 'Intense & Sharp':
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
      case 'Focused & Energized':
        for (let h = 8; h <= 15; h++) {
          profile[h] = 15 * (1 - Math.abs(h - 11) / 5);
        }
        for (let h = 19; h <= 23; h++) {
          profile[h] = -25 * ((h - 18) / 5);
        }
        for (let h = 0; h <= 5; h++) {
          profile[h] = -35;
        }
        break;
      case 'Balanced':
      case 'Balanced & Focused':
        for (let h = 9; h <= 17; h++) {
          profile[h] = 6;
        }
        for (let h = 22; h <= 23; h++) {
          profile[h] = -8;
        }
        break;
      case 'Calm & Clear':
      case 'Smooth & Sustained':
        for (let h = 14; h <= 20; h++) {
          profile[h] = 10 * (1 - Math.abs(h - 17) / 4);
        }
        for (let h = 7; h <= 9; h++) {
          profile[h] = -10;
        }
        break;
      case 'Deeply Calm':
      case 'Primarily Relaxing':
        for (let h = 18; h <= 23; h++) {
          profile[h] = 15 * (1 - Math.abs(h - 21) / 4);
        }
        for (let h = 0; h <= 1; h++) {
          profile[h] = 3;
        }
        for (let h = 7; h <= 12; h++) {
          profile[h] = -20;
        }
        break;
      default:
        for (let h = 10; h <= 16; h++) {
          profile[h] = 4;
        }
        break;
    }
    return profile.map(p => Math.round(p));
  }

  _getCaffeineCategoryProfile(category) {
    const profile = new Array(24).fill(0);
    if (category === 'high') {
      for (let h = 7; h <= 14; h++) {
        profile[h] = 10 * (1 - Math.abs(h - 9.5) / 5.5);
      }
      for (let h = 18; h <= 23; h++) {
        profile[h] = -40 * ((h - 17) / 6);
      }
      for (let h = 0; h <= 5; h++) {
        profile[h] = -50;
      }
    } else if (category === 'low') {
      for (let h = 7; h <= 9; h++) {
        profile[h] = -5;
      }
      for (let h = 20; h <= 23; h++) {
        profile[h] = 3;
      }
    }
    return profile.map(p => Math.round(p));
  }

  _getTeaTypeSpecificProfile(primaryTeaType, subType) {
    const profile = new Array(24).fill(0);
    const typeToCheck = subType ? subType.toLowerCase() : primaryTeaType.toLowerCase();

    if (typeToCheck.includes('gyokuro') || typeToCheck.includes('matcha')) {
      for (let h = 18; h <= 23; h++) {
        profile[h] = -50 * ((h - 17) / 6);
      }
      for (let h = 0; h <= 5; h++) {
        profile[h] = -60;
      }
      for (let h = 10; h <= 16; h++) {
        profile[h] = 8;
      }
    } else if (
      typeToCheck.includes('herbal') ||
      typeToCheck.includes('tisane') ||
      typeToCheck.includes('hojicha') ||
      typeToCheck.includes('chamomile') ||
      typeToCheck.includes('lavender')
    ) {
      for (let h = 17; h <= 23; h++) {
        profile[h] = 12 * (1 - Math.abs(h - 20) / 6);
      }
      for (let h = 0; h <= 1; h++) {
        profile[h] = 8;
      }
      for (let h = 7; h <= 11; h++) {
        profile[h] = -12;
      }
    } else if (typeToCheck.includes('breakfast') || typeToCheck.includes('assam')) {
      for (let h = 6; h <= 9; h++) {
        profile[h] = 12;
      }
      for (let h = 21; h <= 23; h++) {
        profile[h] = -8;
      }
    } else if (typeToCheck.includes('puerh-shou') || typeToCheck.includes('shou')) {
      for (let h = 14; h <= 19; h++) {
        profile[h] = 6;
      }
    } else if (typeToCheck.includes('silver needle')) {
      for (let h = 22; h <= 23; h++) {
        profile[h] = -10;
      }
      for (let h = 0; h <= 4; h++) {
        profile[h] = -15;
      }
    }

    return profile.map(p => Math.round(p));
  }

  // ========================================================================
  // MAIN MATCHING FUNCTION WITH CONFIDENCE
  // ========================================================================

  /**
   * Match tea to ideal hours with confidence metrics
   * @param {Object} teaModel - Full tea model with all characteristics
   * @param {Object} compoundAnalysis - Optional pre-calculated compound analysis
   * @param {Object} teaTypeAnalysis - Optional pre-calculated tea type analysis
   * @param {Object} processingAnalysis - Optional pre-calculated processing analysis
   * @returns {Object} Hourly scores with confidence, recommendations, ranges
   */
  matchTime(
    teaModel = {},
    compoundAnalysis = {},
    teaTypeAnalysis = {},
    processingAnalysis = {}
  ) {
    let trace = [];
    const hourlyScores = new Map();

    // Initialize all hours to base score
    this.hours.forEach(hour => hourlyScores.set(hour, this.config.baseScore));
    trace.push({
      step: 'Initialization',
      reason: 'Baseline setup',
      adjustment: `All 24 hours initialized to ${this.config.baseScore}`
    });

    // Extract inputs (backward compatible with both old and new parameter styles)
    const stimulationStr =
      compoundAnalysis?.analysis?.stimulationLevel ||
      compoundAnalysis.stimulationLevel ||
      'moderate';
    const relaxationStr =
      compoundAnalysis?.analysis?.relaxationLevel ||
      compoundAnalysis.relaxationLevel ||
      'moderate';
    const compoundProfile =
      compoundAnalysis?.analysis?.compoundProfile ||
      compoundAnalysis.compoundProfile ||
      'Balanced';
    const stimulationLevelNum = this.levelMap[stimulationStr.toLowerCase()] ?? 3;
    const relaxationLevelNum = this.levelMap[relaxationStr.toLowerCase()] ?? 3;

    const primaryTeaType = teaTypeAnalysis?.teaType || teaModel?.type || '';
    const subType = teaTypeAnalysis?.subType || teaModel?.subType || '';
    const typicalCaffeineStr =
      teaTypeAnalysis?.analysis?.typicalCaffeine || 'medium';

    let caffeineCategory = 'medium';
    const lowerCaffeineStr = typicalCaffeineStr.toLowerCase();
    if (
      lowerCaffeineStr.includes('very high') ||
      lowerCaffeineStr.includes('high')
    ) {
      caffeineCategory = 'high';
    } else if (
      lowerCaffeineStr.includes('very low') ||
      lowerCaffeineStr.includes('low') ||
      lowerCaffeineStr.includes('none')
    ) {
      caffeineCategory = 'low';
    }

    trace.push({
      step: 'Input Processing',
      reason: 'Extracting analysis data',
      adjustment: `Stim: ${stimulationStr}(${stimulationLevelNum}), Relax: ${relaxationStr}(${relaxationLevelNum}), Profile: ${compoundProfile}, CaffeineCat: ${caffeineCategory}, Type: ${primaryTeaType}, SubType: ${subType}`
    });

    // Apply profiles
    const compoundProfileAdjustments = this._getCompoundEffectProfile(compoundProfile);
    this._applyHourlyProfile(
      trace,
      hourlyScores,
      compoundProfileAdjustments,
      'Compound Profile Adjustment',
      `Based on profile: '${compoundProfile}'`
    );

    const stimulationProfileAdjustments = this._getStimulationProfile(
      stimulationLevelNum
    );
    this._applyHourlyProfile(
      trace,
      hourlyScores,
      stimulationProfileAdjustments,
      'Stimulation Level Adjustment',
      `Based on level: ${stimulationStr} (${stimulationLevelNum})`
    );

    const relaxationProfileAdjustments = this._getRelaxationProfile(
      relaxationLevelNum
    );
    this._applyHourlyProfile(
      trace,
      hourlyScores,
      relaxationProfileAdjustments,
      'Relaxation Level Adjustment',
      `Based on level: ${relaxationStr} (${relaxationLevelNum})`
    );

    const caffeineCategoryAdjustments = this._getCaffeineCategoryProfile(
      caffeineCategory
    );
    this._applyHourlyProfile(
      trace,
      hourlyScores,
      caffeineCategoryAdjustments,
      'Caffeine Category Adjustment',
      `Based on category: '${caffeineCategory}'`
    );

    const teaTypeAdjustments = this._getTeaTypeSpecificProfile(
      primaryTeaType,
      subType
    );
    this._applyHourlyProfile(
      trace,
      hourlyScores,
      teaTypeAdjustments,
      'Tea Type Specific Adjustment',
      `Based on type: '${primaryTeaType}', subtype: '${subType}'`
    );

    // Normalize scores
    const finalScores = Object.fromEntries(hourlyScores);
    const normalizedScores = this.normalizeScores(finalScores);

    // Calculate confidence for time matching
    const dataConfidence = calculateDataConfidence(teaModel || {});
    trace.push({
      step: 'Confidence Assessment',
      reason: 'Data quality evaluation',
      adjustment: `Data confidence: ${(dataConfidence * 100).toFixed(0)}%`
    });

    // Wrap hourly scores with confidence
    const hourlyScoresWithConfidence = this._addConfidenceToScores(
      normalizedScores,
      dataConfidence
    );

    // Get recommended times
    const recommendedTimes = this.getRecommendedTimes(normalizedScores);
    const recommendedTimesWithConfidence = recommendedTimes.map(time => ({
      ...time,
      confidence: Math.round(
        (normalizedScores[time.hour] / 100) * dataConfidence * 100 + (1 - dataConfidence) * 60
      )
    }));

    // Identify time ranges
    const idealRanges = this.identifyTimeRanges(normalizedScores);
    const idealRangesWithConfidence = idealRanges.map(range => ({
      ...range,
      confidence: Math.round((range.score / 100) * dataConfidence * 100 + (1 - dataConfidence) * 60)
    }));

    trace.push({
      step: 'Recommendation Generation',
      reason: 'Finding best hours',
      adjustment: `Selected ${recommendedTimesWithConfidence.length} hours with confidence`,
      value: recommendedTimesWithConfidence
        .map(item => `${item.hour}:${item.score}(${item.confidence}%)`)
        .join(', ')
    });

    return {
      hourlyScores: hourlyScoresWithConfidence,
      recommendedTimes: recommendedTimesWithConfidence,
      idealRanges: idealRangesWithConfidence,
      confidence: {
        overall: Math.round(dataConfidence * 100),
        dataQuality: this._getConfidenceLabel(dataConfidence)
      },
      trace
    };
  }

  /**
   * Add confidence metrics to hourly scores
   * @private
   */
  _addConfidenceToScores(normalizedScores, baseConfidence) {
    const result = {};

    for (const [hour, score] of Object.entries(normalizedScores)) {
      // Confidence is higher for recommended hours, lower for non-recommended
      const scoreConfidence = baseConfidence * (0.5 + (score / 200));
      const range = calculateUncertaintyRange(score, scoreConfidence);

      result[hour] = {
        score: score,
        confidence: Math.round(scoreConfidence * 100),
        range: range
      };
    }

    return result;
  }

  /**
   * Get human-readable confidence label
   * @private
   */
  _getConfidenceLabel(confidence) {
    if (confidence >= 0.85) return 'Very High';
    if (confidence >= 0.70) return 'High';
    if (confidence >= 0.55) return 'Moderate';
    if (confidence >= 0.40) return 'Low';
    return 'Very Low';
  }

  // ========================================================================
  // SCORE NORMALIZATION & RECOMMENDATIONS (unchanged)
  // ========================================================================

  normalizeScores(hourlyScores) {
    const scoreEntries = Object.entries(hourlyScores);
    if (scoreEntries.length === 0) return {};

    const scores = Object.values(hourlyScores).sort((a, b) => a - b);
    if (scores.length < 2) {
      return Object.fromEntries(
        scoreEntries.map(([hour, score]) => [
          hour,
          Math.max(0, Math.min(100, Math.round(score)))
        ])
      );
    }

    const medianIndex = Math.floor(scores.length / 2);
    const q90Index = Math.floor(scores.length * 0.9);
    const median = scores[medianIndex];
    const q90 = scores[Math.min(q90Index, scores.length - 1)];
    const denominator = q90 - median;

    if (denominator <= 0) {
      if (scores[0] === scores[scores.length - 1]) {
        return Object.fromEntries(scoreEntries.map(([hour]) => [hour, 50]));
      } else {
        const minScore = scores[0];
        const maxScore = scores[scores.length - 1];
        const range = maxScore - minScore;
        if (range <= 0) {
          return Object.fromEntries(scoreEntries.map(([hour]) => [hour, 50]));
        }
        return Object.fromEntries(
          scoreEntries.map(([hour, score]) => [
            hour,
            Math.max(0, Math.min(100, Math.round(((score - minScore) / range) * 100)))
          ])
        );
      }
    }

    return Object.fromEntries(
      scoreEntries.map(([hour, score]) => {
        let normalizedScore = 50 + ((score - median) * 40) / denominator;
        normalizedScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));
        return [hour, normalizedScore];
      })
    );
  }

  getRecommendedTimes(normalizedScores) {
    const sortedTimes = Object.entries(normalizedScores)
      .map(([hour, score]) => ({ hour: parseInt(hour), score }))
      .sort((a, b) => b.score - a.score);

    if (sortedTimes.length === 0) return [];

    const maxScore = sortedTimes[0].score;
    const absoluteThreshold = 65;
    const relativeThreshold = 20;
    const recommended = sortedTimes
      .filter(
        item =>
          item.score >= absoluteThreshold && item.score >= maxScore - relativeThreshold
      )
      .slice(0, this.config.maxRecommendations);

    if (recommended.length === 0 && sortedTimes.length > 0) {
      return [sortedTimes[0]];
    }

    recommended.sort((a, b) => a.hour - b.hour);
    return recommended;
  }

  identifyTimeRanges(normalizedScores) {
    const ranges = [];
    const threshold = this.config.rangeThreshold;
    const suitableHours = this.hours.filter(
      hour => normalizedScores[hour] >= threshold
    );

    if (suitableHours.length === 0) return [];

    let currentRange = [];
    for (let i = 0; i < suitableHours.length; i++) {
      const hour = suitableHours[i];
      if (
        currentRange.length === 0 ||
        hour === (currentRange[currentRange.length - 1] + 1) % 24
      ) {
        currentRange.push(hour);
      } else {
        ranges.push({
          start: currentRange[0],
          end: currentRange[currentRange.length - 1],
          score: this.calculateAverageScore(currentRange, normalizedScores)
        });
        currentRange = [hour];
      }
    }

    ranges.push({
      start: currentRange[0],
      end: currentRange[currentRange.length - 1],
      score: this.calculateAverageScore(currentRange, normalizedScores)
    });

    if (
      ranges.length > 1 &&
      ranges[0].start === 0 &&
      ranges[ranges.length - 1].end === 23
    ) {
      const lastRange = ranges.pop();
      const firstRange = ranges.shift();
      const combinedHours = [
        ...Array(firstRange.end + 1)
          .keys()
      ].concat([...Array(24).keys()].slice(lastRange.start));
      ranges.push({
        start: lastRange.start,
        end: firstRange.end,
        score: this.calculateAverageScore(combinedHours, normalizedScores),
        isWraparound: true
      });
    }

    ranges.sort((a, b) => b.score - a.score);
    return ranges;
  }

  calculateAverageScore(hourRange, normalizedScores) {
    let hoursToAverage = [];
    if (!hourRange || hourRange.length === 0) return 0;

    const start = hourRange[0];
    const end = hourRange[hourRange.length - 1];

    if (start <= end) {
      for (let h = start; h <= end; h++) {
        hoursToAverage.push(h);
      }
    } else {
      for (let h = start; h <= 23; h++) {
        hoursToAverage.push(h);
      }
      for (let h = 0; h <= end; h++) {
        hoursToAverage.push(h);
      }
    }

    if (hoursToAverage.length === 0) return 0;

    const sum = hoursToAverage.reduce((acc, hour) => acc + (normalizedScores[hour] || 0), 0);
    return Math.round(sum / hoursToAverage.length);
  }
}

export default TimeMatcher;
