import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * TeaPairingCalculator - Finds teas that pair well together
 *
 * Inputs: current tea model, array of all teas
 * Outputs: compatible tea pairings
 * Confidence: 0.7-0.85
 *
 * No dependencies: Runs independently
 */
export class TeaPairingCalculator extends BaseCalculator {

  constructor() {
    super('TeaPairingCalculator');
  }

  calculate(teaModel, allTeas = []) {
    const result = new CalculatorResult('TeaPairingCalculator');

    try {
      if (!allTeas || allTeas.length === 0) {
        result.data = {
          compatibleTeas: [],
          count: 0,
          note: 'No other teas available for comparison'
        };
        result.setConfidence(0.5);
        return result;
      }

      const myFlavorProfile = teaModel.flavor.primary;
      const myCaffeine = teaModel.compounds.caffeine;
      const myType = this.normalize(teaModel.type);

      let scores = [];

      allTeas.forEach(other => {
        if (!other || other.name === teaModel.name) return;

        // Score based on flavor compatibility
        let flavorScore = 0;
        const otherFlavor = other.flavor?.primary || [];

        const commonFlavors = myFlavorProfile.filter(f =>
          otherFlavor.some(of => this.similarity(f, of) > 0.7)
        );

        if (commonFlavors.length > 0) {
          flavorScore = 0.5; // Same flavor family
        }

        // Score based on caffeine balance (different = better pairing)
        const caffeineBalance = Math.abs(other.compounds?.caffeine || 5 - myCaffeine);
        const caffeineScore = caffeineBalance > 2 ? 0.3 : 0.1;

        // Score based on type diversity
        const otherType = this.normalize(other.type || '');
        const typeDiversity = otherType !== myType ? 0.2 : 0;

        const totalScore = flavorScore + caffeineScore + typeDiversity;

        if (totalScore > 0) {
          scores.push({
            name: other.name || 'Unknown',
            score: totalScore,
            reasons: [
              commonFlavors.length > 0 ? 'Similar flavor profile' : null,
              caffeineBalance > 2 ? 'Complimentary caffeine levels' : null,
              typeDiversity > 0 ? 'Different tea type' : null
            ].filter(r => r !== null)
          });
        }
      });

      // Sort by score, return top 3
      const compatibleTeas = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      result.data = {
        compatibleTeas,
        count: compatibleTeas.length,
        note: `Found ${compatibleTeas.length} compatible teas`
      };

      result.setConfidence(0.75);
      result.setReasoning('Based on flavor profile and caffeine balance');

      return result;
    } catch (error) {
      return result.fail(`TeaPairingCalculator error: ${error.message}`);
    }
  }
}
