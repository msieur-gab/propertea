import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * TimeCalculator - Determines best time of day to drink tea (24-HOUR SYSTEM)
 *
 * Inputs: geography (altitude, temperature), compounds (caffeine, ratio)
 * Outputs: recommended hours (0-23), time ranges, confidence per hour
 * Confidence: 0.8-0.95
 *
 * No dependencies: Runs independently
 *
 * GRANULARITY: Full 24-hour system (not simplified 4-period)
 */
export class TimeCalculator extends BaseCalculator {

  constructor() {
    super('TimeCalculator');
    // 24 hours of the day
    this.hours = Array.from({ length: 24 }, (_, i) => i);
  }

  calculate(teaModel) {
    const result = new CalculatorResult('TimeCalculator');

    try {
      const caffeine = teaModel.compounds.caffeine;
      const ratio = teaModel.compounds.ratio;
      const altitude = teaModel.geography.altitude;

      // Initialize hourly scores
      const hourlyScores = {};
      this.hours.forEach(h => { hourlyScores[h] = 50; }); // Base score

      let reasoning = [];

      // Apply caffeine-based scoring across all 24 hours
      if (caffeine > 7) {
        // High caffeine: boost morning/midday hours (6-16), penalize night (18-23, 0-5)
        for (let h = 6; h <= 16; h++) {
          hourlyScores[h] += 25;
        }
        for (let h = 18; h <= 23; h++) {
          hourlyScores[h] -= 30;
        }
        for (let h = 0; h <= 5; h++) {
          hourlyScores[h] -= 35;
        }
        reasoning.push(`High caffeine (${caffeine}mg) best in morning/daytime (6-16)`);
      } else if (caffeine >= 4 && caffeine <= 7) {
        // Moderate caffeine: flexible across daytime
        for (let h = 7; h <= 17; h++) {
          hourlyScores[h] += 15;
        }
        for (let h = 20; h <= 23; h++) {
          hourlyScores[h] -= 8;
        }
        reasoning.push(`Moderate caffeine (${caffeine}mg) suitable for daytime`);
      } else if (caffeine < 4) {
        // Low caffeine: boost afternoon/evening (14-23), penalize morning (7-11)
        for (let h = 14; h <= 23; h++) {
          hourlyScores[h] += 20;
        }
        for (let h = 7; h <= 11; h++) {
          hourlyScores[h] -= 15;
        }
        reasoning.push(`Low caffeine (${caffeine}mg) best for afternoon/evening (14-23)`);
      }

      // Apply altitude-based scoring
      if (altitude > 1500) {
        // High altitude teas are morning teas
        for (let h = 7; h <= 12; h++) {
          hourlyScores[h] += 10;
        }
        reasoning.push(`High altitude (${altitude}m) indicates morning tea preference`);
      }

      // Apply ratio-based scoring
      if (ratio < 1) {
        // Low ratio (calming) - favor evening
        for (let h = 17; h <= 22; h++) {
          hourlyScores[h] += 15;
        }
        reasoning.push(`Low caffeine/L-theanine ratio (${ratio.toFixed(2)}) favors evening`);
      } else if (ratio > 2) {
        // High ratio (stimulating) - favor early morning
        for (let h = 6; h <= 11; h++) {
          hourlyScores[h] += 20;
        }
        reasoning.push(`High caffeine/L-theanine ratio (${ratio.toFixed(2)}) favors early morning`);
      }

      // Normalize scores to 0-100 range
      const normalizedScores = this.normalizeHourlyScores(hourlyScores);

      // Get recommended times (top hours)
      const recommendedHours = this.getRecommendedHours(normalizedScores);

      // Identify continuous time ranges
      const timeRanges = this.identifyTimeRanges(normalizedScores);

      result.data = {
        recommendedHours: recommendedHours,
        hourlyScores: normalizedScores,
        timeRanges: timeRanges,
        reasoning: reasoning.join('; '),
        factors: {
          caffeine,
          ratio: ratio.toFixed(2),
          altitude
        },
        summary: {
          bestHours: recommendedHours.slice(0, 3).map(h => `${h}:00`).join(', '),
          primaryRange: timeRanges.length > 0 ? `${timeRanges[0].start}:00-${timeRanges[0].end}:00` : 'N/A'
        }
      };

      result.setConfidence(0.9);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`TimeCalculator error: ${error.message}`);
    }
  }

  normalizeHourlyScores(hourlyScores) {
    const scores = Object.values(hourlyScores);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;

    const normalized = {};
    this.hours.forEach(h => {
      normalized[h] = Math.round(((hourlyScores[h] - min) / range) * 100);
    });
    return normalized;
  }

  getRecommendedHours(normalizedScores) {
    return Object.entries(normalizedScores)
      .map(([hour, score]) => ({ hour: parseInt(hour), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .sort((a, b) => a.hour - b.hour)
      .map(item => item.hour);
  }

  identifyTimeRanges(normalizedScores) {
    const threshold = 70;
    const suitableHours = this.hours.filter(h => normalizedScores[h] >= threshold);

    if (suitableHours.length === 0) return [];

    const ranges = [];
    let rangeStart = suitableHours[0];

    for (let i = 1; i < suitableHours.length; i++) {
      if (suitableHours[i] !== suitableHours[i - 1] + 1) {
        ranges.push({
          start: rangeStart,
          end: suitableHours[i - 1],
          score: Math.round(
            suitableHours.slice(
              suitableHours.indexOf(rangeStart),
              i
            ).reduce((sum, h) => sum + normalizedScores[h], 0) /
            (i - suitableHours.indexOf(rangeStart))
          )
        });
        rangeStart = suitableHours[i];
      }
    }

    ranges.push({
      start: rangeStart,
      end: suitableHours[suitableHours.length - 1],
      score: Math.round(
        suitableHours.slice(suitableHours.indexOf(rangeStart)).reduce((sum, h) => sum + normalizedScores[h], 0) /
        (suitableHours.length - suitableHours.indexOf(rangeStart))
      )
    });

    return ranges.sort((a, b) => b.score - a.score);
  }
}
