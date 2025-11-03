import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * SeasonCalculator - Determines best seasons for tea (12-SEASON SYSTEM)
 *
 * Inputs: geography (altitude, temperature), harvest season, processing, compounds
 * Outputs: recommended seasons (from 12 granular seasons), seasonal ranges
 * Confidence: 0.85-1.0
 *
 * No dependencies: Runs independently
 *
 * GRANULARITY: 12 seasons (Early Spring, Spring, Late Spring, Early Summer,
 *              Summer, Late Summer, Early Autumn, Autumn, Late Autumn,
 *              Early Winter, Winter, Late Winter)
 */
export class SeasonCalculator extends BaseCalculator {

  constructor() {
    super('SeasonCalculator');
    // 12 granular seasons matching traditional tea harvest seasons
    this.seasons = [
      'Early Spring',
      'Spring',
      'Late Spring',
      'Early Summer',
      'Summer',
      'Late Summer',
      'Early Autumn',
      'Autumn',
      'Late Autumn',
      'Early Winter',
      'Winter',
      'Late Winter'
    ];
  }

  calculate(teaModel) {
    const result = new CalculatorResult('SeasonCalculator');

    try {
      const altitude = teaModel.geography.altitude;
      const temperature = teaModel.geography.temperature;
      const roastLevel = this.normalize(teaModel.processing.roastLevel);
      const oxidationLevel = teaModel.processing.oxidationLevel;
      const caffeine = teaModel.compounds.caffeine;
      const ratio = teaModel.compounds.ratio;

      // Initialize seasonal scores
      const seasonalScores = {};
      this.seasons.forEach(s => { seasonalScores[s] = 50; }); // Base score

      let reasoning = [];

      // 1. Altitude-based scoring (high altitude = spring/early summer preference)
      if (altitude > 1500) {
        seasonalScores['Early Spring'] += 25;
        seasonalScores['Spring'] += 20;
        seasonalScores['Late Spring'] += 15;
        seasonalScores['Early Summer'] += 10;
        reasoning.push(`High altitude (${altitude}m) tea best in spring`);
      } else if (altitude > 1200) {
        seasonalScores['Spring'] += 15;
        seasonalScores['Late Spring'] += 10;
      }

      // 3. Roast level scoring (dark roast = winter preference)
      if (roastLevel === 'dark' || roastLevel === 'heavy') {
        seasonalScores['Late Autumn'] += 25;
        seasonalScores['Early Winter'] += 30;
        seasonalScores['Winter'] += 35;
        seasonalScores['Late Winter'] += 25;
        reasoning.push(`Dark roast (${roastLevel}) best consumed in winter`);
      } else if (roastLevel === 'medium') {
        seasonalScores['Autumn'] += 20;
        seasonalScores['Winter'] += 20;
      } else if (roastLevel === 'light' || roastLevel === 'none') {
        seasonalScores['Spring'] += 20;
        seasonalScores['Early Summer'] += 15;
        reasoning.push(`Light/no roast (${roastLevel}) best consumed in spring`);
      }

      // 4. Oxidation level scoring
      if (oxidationLevel > 80) {
        // Heavily oxidized = winter teas
        seasonalScores['Autumn'] += 15;
        seasonalScores['Winter'] += 25;
        seasonalScores['Late Autumn'] += 20;
      } else if (oxidationLevel < 30) {
        // Lightly oxidized = spring/summer teas
        seasonalScores['Early Spring'] += 20;
        seasonalScores['Spring'] += 15;
        seasonalScores['Summer'] += 10;
        reasoning.push(`Light oxidation (${oxidationLevel}%) indicates spring/summer tea`);
      }

      // 5. Caffeine/stimulation level scoring
      if (caffeine > 7) {
        // High caffeine = morning tea = spring preference
        seasonalScores['Early Spring'] += 15;
        seasonalScores['Spring'] += 10;
      } else if (caffeine < 3) {
        // Low caffeine = evening/relaxation = winter preference
        seasonalScores['Late Autumn'] += 10;
        seasonalScores['Winter'] += 15;
        reasoning.push(`Low caffeine (${caffeine}mg) suitable for relaxing autumn/winter seasons`);
      }

      // 6. Ratio-based thermal effect
      if (ratio < 1) {
        // Calming (warming effect) = winter
        seasonalScores['Early Winter'] += 15;
        seasonalScores['Winter'] += 20;
        seasonalScores['Late Winter'] += 15;
        reasoning.push(`Low caffeine/L-theanine ratio (${ratio.toFixed(2)}) indicates calming winter tea`);
      } else if (ratio > 2) {
        // Stimulating (cooling effect) = spring
        seasonalScores['Early Spring'] += 15;
        seasonalScores['Spring'] += 15;
        reasoning.push(`High caffeine/L-theanine ratio (${ratio.toFixed(2)}) indicates stimulating spring tea`);
      }

      // Normalize scores
      const normalizedScores = this.normalizeSeasonalScores(seasonalScores);

      // Get recommended seasons
      const recommendedSeasons = this.getRecommendedSeasons(normalizedScores);

      // Identify seasonal ranges
      const seasonalRanges = this.identifySeasonalRanges(normalizedScores);

      // Also generate simplified results for backward compatibility
      const simplifiedScores = this.generateSimplifiedScores(normalizedScores);

      result.data = {
        recommendedSeasons: recommendedSeasons.map(s => s.name),
        seasonalScores: normalizedScores,
        seasonalRanges: seasonalRanges,
        simplifiedSeasons: Object.keys(simplifiedScores).filter(s => simplifiedScores[s] >= 60),
        reasoning: reasoning.join('; '),
        factors: {
          altitude,
          temperature,
          roastLevel,
          oxidationLevel
        },
        summary: {
          bestSeasons: recommendedSeasons.slice(0, 3).map(s => s.name).join(', '),
          primaryRange: seasonalRanges.length > 0 ? `${seasonalRanges[0].start} to ${seasonalRanges[0].end}` : 'N/A'
        }
      };

      result.setConfidence(0.92);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`SeasonCalculator error: ${error.message}`);
    }
  }

  normalizeSeasonalScores(seasonalScores) {
    const scores = Object.values(seasonalScores);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;

    const normalized = {};
    Object.keys(seasonalScores).forEach(season => {
      normalized[season] = Math.round(((seasonalScores[season] - min) / range) * 100);
    });
    return normalized;
  }

  getRecommendedSeasons(normalizedScores) {
    return Object.entries(normalizedScores)
      .map(([season, score]) => ({ name: season, score }))
      .sort((a, b) => b.score - a.score)
      .filter((item, idx) => idx < 5 || item.score >= 65)
      .sort((a, b) => this.seasons.indexOf(a.name) - this.seasons.indexOf(b.name));
  }

  generateSimplifiedScores(detailedScores) {
    const simplified = {
      'Spring': 0,
      'Summer': 0,
      'Autumn': 0,
      'Winter': 0
    };

    const counts = { ...simplified };

    Object.entries(detailedScores).forEach(([season, score]) => {
      const lower = season.toLowerCase();
      if (lower.includes('spring')) {
        simplified['Spring'] += score;
        counts['Spring']++;
      } else if (lower.includes('summer')) {
        simplified['Summer'] += score;
        counts['Summer']++;
      } else if (lower.includes('autumn')) {
        simplified['Autumn'] += score;
        counts['Autumn']++;
      } else if (lower.includes('winter')) {
        simplified['Winter'] += score;
        counts['Winter']++;
      }
    });

    Object.keys(simplified).forEach(season => {
      simplified[season] = counts[season] > 0 ? Math.round(simplified[season] / counts[season]) : 50;
    });

    return simplified;
  }

  identifySeasonalRanges(normalizedScores) {
    const threshold = 70;
    const suitableSeasons = this.seasons.filter(s => normalizedScores[s] >= threshold);

    if (suitableSeasons.length === 0) return [];

    const ranges = [];
    let rangeStart = suitableSeasons[0];
    let rangeIndex = [this.seasons.indexOf(rangeStart)];

    for (let i = 1; i < suitableSeasons.length; i++) {
      const currentIdx = this.seasons.indexOf(suitableSeasons[i]);
      const prevIdx = this.seasons.indexOf(suitableSeasons[i - 1]);

      if (currentIdx === prevIdx + 1) {
        rangeIndex.push(currentIdx);
      } else {
        ranges.push({
          start: this.seasons[rangeIndex[0]],
          end: this.seasons[rangeIndex[rangeIndex.length - 1]],
          score: Math.round(rangeIndex.reduce((sum, idx) => sum + normalizedScores[this.seasons[idx]], 0) / rangeIndex.length)
        });
        rangeStart = suitableSeasons[i];
        rangeIndex = [currentIdx];
      }
    }

    if (rangeIndex.length > 0) {
      ranges.push({
        start: this.seasons[rangeIndex[0]],
        end: this.seasons[rangeIndex[rangeIndex.length - 1]],
        score: Math.round(rangeIndex.reduce((sum, idx) => sum + normalizedScores[this.seasons[idx]], 0) / rangeIndex.length)
      });
    }

    return ranges.sort((a, b) => b.score - a.score);
  }
}
