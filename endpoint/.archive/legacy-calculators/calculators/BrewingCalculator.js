import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * BrewingCalculator - Determines brewing parameters
 *
 * Inputs: type, oxidationLevel, roastLevel, leafSize, wholeness
 * Outputs: temperature, infusionTime, numberOfInfusions, vesselType
 * Confidence: 0.8-0.95
 *
 * No dependencies: Runs independently
 */
export class BrewingCalculator extends BaseCalculator {

  constructor() {
    super('BrewingCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('BrewingCalculator');

    try {
      const type = this.normalize(teaModel.type);
      const oxidation = teaModel.processing.oxidationLevel;
      const roastLevel = this.normalize(teaModel.processing.roastLevel);
      const leafSize = this.normalize(teaModel.leaf.size);
      const wholeness = teaModel.leaf.wholeness;

      let brewingParams = {
        temperature: 75,
        infusionTime: 3,
        numberOfInfusions: 5,
        vesselType: 'cup'
      };

      let confidence = 0.8;
      let reasoning = [];

      // Green teas: low temperature, short steep
      if (type === 'green') {
        brewingParams.temperature = 70;
        brewingParams.infusionTime = 2;
        brewingParams.numberOfInfusions = 3;
        confidence = 0.95;
        reasoning.push('Green tea: cooler water, shorter infusions');
      }
      // White teas: very low temperature
      else if (type === 'white') {
        brewingParams.temperature = 65;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 4;
        confidence = 0.95;
        reasoning.push('White tea: very cool water to preserve delicacy');
      }
      // Yellow teas: moderate
      else if (type === 'yellow') {
        brewingParams.temperature = 75;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 5;
        confidence = 0.9;
        reasoning.push('Yellow tea: moderate brewing parameters');
      }
      // Oolong: hot water, many infusions, gaiwan
      else if (type === 'oolong') {
        brewingParams.temperature = 95;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 7;
        brewingParams.vesselType = 'gaiwan';
        confidence = 0.95;
        reasoning.push('Oolong: hot water, gaiwan, multiple infusions');
      }
      // Dark/Black: hot water
      else if (type === 'dark' || type === 'black' || type === 'red') {
        brewingParams.temperature = 95;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 5;
        confidence = 0.9;
        reasoning.push('Dark/Black tea: hot water');
      }
      // Puerh: hot water, many infusions
      else if (type === 'puerh') {
        brewingParams.temperature = 95;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 8;
        brewingParams.vesselType = 'gaiwan';
        confidence = 0.9;
        reasoning.push('Puerh: hot water, gaiwan, many infusions');
      }

      // Adjust for roast level
      if (roastLevel === 'dark') {
        brewingParams.temperature = Math.min(100, brewingParams.temperature + 5);
        reasoning.push(`Dark roast: +5°C temperature`);
      }

      // Adjust for broken/fragmented leaves
      if (wholeness < 50) {
        brewingParams.infusionTime = Math.max(1, brewingParams.infusionTime - 1);
        reasoning.push('Broken leaves: reduce steep time');
      }

      result.data = {
        ...brewingParams,
        factors: {
          type,
          oxidation,
          roastLevel,
          leafSize,
          wholeness
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`BrewingCalculator error: ${error.message}`);
    }
  }
}
