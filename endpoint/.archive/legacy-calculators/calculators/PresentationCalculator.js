import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * PresentationCalculator - Generates tea description and marketing copy
 *
 * Inputs: name, origin, flavor, altitude, type
 * Outputs: description, marketing highlights
 * Confidence: 0.85-0.95
 *
 * No dependencies: Runs independently
 */
export class PresentationCalculator extends BaseCalculator {

  constructor() {
    super('PresentationCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('PresentationCalculator');

    try {
      const name = teaModel.name;
      const origin = teaModel.geography.origin;
      const flavorProfile = teaModel.flavor.primary.join(', ');
      const altitude = teaModel.geography.altitude;
      const type = this.normalize(teaModel.type);

      let description = '';
      let highlights = [];

      // Build description
      description = `${name}`;

      if (origin !== 'Unknown') {
        description += ` from ${origin}`;
      }

      description += ` is a ${type} tea`;

      if (altitude > 1500) {
        description += ` grown at high altitude (${altitude}m), `;
        description += 'producing delicate and complex flavors.';
        highlights.push(`High-altitude (${altitude}m) - Premium quality`);
      } else if (altitude > 1000) {
        description += ` grown at moderate altitude (${altitude}m), `;
        description += 'offering balanced characteristics.';
        highlights.push(`Mid-altitude (${altitude}m) - Good balance`);
      } else {
        description += ` from lower elevations, `;
        description += 'with bold and robust character.';
        highlights.push('Low-altitude - Bold character');
      }

      if (flavorProfile) {
        description += ` Featuring notes of ${flavorProfile}.`;
        highlights.push(`Flavor: ${flavorProfile}`);
      }

      // Add key characteristics
      highlights.push(`Type: ${type.charAt(0).toUpperCase() + type.slice(1)} Tea`);

      result.data = {
        name,
        description,
        highlights,
        shortDescription: description.substring(0, 100) + '...',
        marketingCopy: description
      };

      result.setConfidence(0.9);
      result.setReasoning('Generated from tea metadata');

      return result;
    } catch (error) {
      return result.fail(`PresentationCalculator error: ${error.message}`);
    }
  }
}
