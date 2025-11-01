import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * SeasonCalculator - Determines best seasons for tea
 *
 * Inputs: geography (altitude, temperature), harvest season, processing
 * Outputs: recommended seasons
 * Confidence: 0.85-1.0
 *
 * No dependencies: Runs independently
 */
export class SeasonCalculator extends BaseCalculator {

  constructor() {
    super('SeasonCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('SeasonCalculator');

    try {
      const altitude = teaModel.geography.altitude;
      const temperature = teaModel.geography.temperature;
      const harvestSeason = this.normalize(teaModel.geography.harvestSeason);
      const roastLevel = this.normalize(teaModel.processing.roastLevel);

      let seasons = [];
      let confidence = 0.85;
      let reasoning = [];

      // Spring teas (high altitude, delicate) → Spring/Summer
      if (altitude > 1200 && roastLevel === 'light') {
        seasons.push('Spring', 'Summer');
        confidence = 0.98;
        reasoning.push('High-altitude delicate tea best in spring/summer');
      }
      // Summer teas → Summer/Autumn
      else if (harvestSeason.includes('summer')) {
        seasons.push('Summer', 'Autumn');
        confidence = 0.95;
        reasoning.push('Summer harvest ideal for summer/autumn drinking');
      }
      // Autumn teas (medium oxidation) → Autumn/Winter
      else if (harvestSeason.includes('autumn')) {
        seasons.push('Autumn', 'Winter');
        confidence = 0.95;
        reasoning.push('Autumn harvest pairs with autumn/winter');
      }
      // Dark/roasted teas → Winter
      else if (roastLevel === 'dark' || teaModel.processing.oxidationLevel > 80) {
        seasons.push('Winter');
        confidence = 0.95;
        reasoning.push('Dark roasted tea perfect for winter warming');
      }
      // Default: year-round
      else {
        seasons.push('Spring', 'Summer', 'Autumn', 'Winter');
        confidence = 0.9;
        reasoning.push('Balanced tea suitable year-round');
      }

      result.data = {
        recommendedSeasons: [...new Set(seasons)],
        factors: {
          altitude,
          temperature,
          harvestSeason,
          roastLevel
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`SeasonCalculator error: ${error.message}`);
    }
  }
}
