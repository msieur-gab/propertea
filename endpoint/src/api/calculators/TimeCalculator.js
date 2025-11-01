import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * TimeCalculator - Determines best time of day to drink tea
 *
 * Inputs: geography (altitude, temperature), compounds (caffeine)
 * Outputs: recommended times (Morning, Afternoon, Evening, Night)
 * Confidence: 0.8-0.95
 *
 * No dependencies: Runs independently
 */
export class TimeCalculator extends BaseCalculator {

  constructor() {
    super('TimeCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('TimeCalculator');

    try {
      const altitude = teaModel.geography.altitude;
      const caffeine = teaModel.compounds.caffeine;
      const temperature = teaModel.geography.temperature;

      let recommendedTimes = [];
      let confidence = 0.7;
      let reasoning = [];

      // High altitude (>1500m) = cooler origin = morning tea
      if (altitude > 1500) {
        recommendedTimes.push('Morning');
        confidence = Math.max(confidence, 0.95);
        reasoning.push(`High altitude (${altitude}m) suggests morning tea`);
      }

      // High caffeine (>7) = energizing = morning/afternoon
      if (caffeine > 7) {
        recommendedTimes.push('Morning');
        if (!recommendedTimes.includes('Afternoon')) {
          recommendedTimes.push('Afternoon');
        }
        confidence = Math.max(confidence, 0.9);
        reasoning.push(`High caffeine (${caffeine}mg) suitable for morning/afternoon`);
      }

      // Moderate caffeine (4-7) = flexible
      if (caffeine >= 4 && caffeine <= 7) {
        recommendedTimes.push('Morning');
        recommendedTimes.push('Afternoon');
        confidence = Math.max(confidence, 0.8);
        reasoning.push(`Moderate caffeine (${caffeine}mg) suitable for daytime`);
      }

      // Low caffeine (<4) = calming = evening friendly
      if (caffeine < 4) {
        recommendedTimes.push('Afternoon');
        recommendedTimes.push('Evening');
        confidence = Math.max(confidence, 0.9);
        reasoning.push(`Low caffeine (${caffeine}mg) suitable for afternoon/evening`);
      }

      // Remove duplicates
      recommendedTimes = [...new Set(recommendedTimes)];

      result.data = {
        recommendedTimes,
        reasoning: reasoning.join('; '),
        factors: {
          altitude,
          caffeine,
          temperature
        }
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`TimeCalculator error: ${error.message}`);
    }
  }
}
