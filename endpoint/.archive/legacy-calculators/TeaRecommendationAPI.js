import { TimeCalculator } from './calculators/TimeCalculator.js';
import { ActivityCalculator } from './calculators/ActivityCalculator.js';
import { SeasonCalculator } from './calculators/SeasonCalculator.js';
import { BrewingCalculator } from './calculators/BrewingCalculator.js';
import { FoodPairingCalculator } from './calculators/FoodPairingCalculator.js';
import { PresentationCalculator } from './calculators/PresentationCalculator.js';
import { TeaPairingCalculator } from './calculators/TeaPairingCalculator.js';

/**
 * TeaRecommendationAPI - Main orchestrator
 *
 * Purpose: Run all independent calculators in parallel
 * Returns: Comprehensive recommendation object
 *
 * Architecture:
 * - Each calculator is independent
 * - No dependencies between calculators
 * - Easy to test each calculator in isolation
 * - Easy to improve any calculator without affecting others
 * - Easy to add new calculators
 */
export class TeaRecommendationAPI {

  constructor() {
    this.calculators = {
      time: new TimeCalculator(),
      activity: new ActivityCalculator(),
      season: new SeasonCalculator(),
      brewing: new BrewingCalculator(),
      food: new FoodPairingCalculator(),
      presentation: new PresentationCalculator(),
      teaPairing: new TeaPairingCalculator()
    };
  }

  /**
   * Analyze a tea and return all recommendations
   *
   * @param {TeaModel} teaModel - The tea to analyze
   * @param {Array<TeaModel>} allTeas - All available teas (for TeaPairingCalculator)
   * @returns {Object} - Comprehensive recommendation object
   */
  analyze(teaModel, allTeas = []) {
    // Run all calculators in parallel (can be Promise.all for async)
    const results = {
      tea: {
        name: teaModel.name,
        type: teaModel.type
      },
      recommendations: {
        time: this.calculators.time.calculate(teaModel),
        activity: this.calculators.activity.calculate(teaModel),
        season: this.calculators.season.calculate(teaModel),
        brewing: this.calculators.brewing.calculate(teaModel),
        food: this.calculators.food.calculate(teaModel),
        presentation: this.calculators.presentation.calculate(teaModel),
        teaPairing: this.calculators.teaPairing.calculate(teaModel, allTeas)
      },
      timestamp: new Date(),
      version: '2.0'
    };

    return results;
  }
}
