import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * FoodPairingCalculator - Determines best food pairings
 *
 * Inputs: flavor profile, compounds (caffeine), type
 * Outputs: recommended foods
 * Confidence: 0.7-0.85
 *
 * No dependencies: Runs independently
 */
export class FoodPairingCalculator extends BaseCalculator {

  constructor() {
    super('FoodPairingCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('FoodPairingCalculator');

    try {
      const flavorProfile = teaModel.flavor.primary;
      const caffeine = teaModel.compounds.caffeine;
      const type = this.normalize(teaModel.type);
      const intensity = this.normalize(teaModel.flavor.intensity);

      let foods = [];
      let confidence = 0.7;
      let reasoning = [];

      // Light, delicate (white/green tea) → light foods
      if ((type === 'white' || type === 'green') && intensity === 'light') {
        foods.push('Pastries', 'Light Desserts', 'Fresh Fruit', 'Light Cheese');
        confidence = 0.85;
        reasoning.push('Light delicate tea pairs with subtle foods');
      }

      // Fruity flavors → fresh fruits, pastries
      if (flavorProfile.some(f => f.toLowerCase().includes('fruit') || f.toLowerCase().includes('citrus'))) {
        foods.push('Fresh Fruit', 'Citrus Desserts', 'Light Pastries');
        confidence = 0.8;
        reasoning.push('Fruity notes pair with fresh fruits and citrus desserts');
      }

      // Floral flavors → sweet desserts
      if (flavorProfile.some(f => f.toLowerCase().includes('floral') || f.toLowerCase().includes('orchid'))) {
        foods.push('Pastries', 'Light Desserts', 'Cream Puffs');
        confidence = 0.8;
        reasoning.push('Floral notes pair with delicate desserts');
      }

      // Roasted/woody → chocolate, nuts
      if (flavorProfile.some(f => f.toLowerCase().includes('roast') || f.toLowerCase().includes('woody'))) {
        foods.push('Dark Chocolate', 'Nuts', 'Aged Cheese');
        confidence = 0.8;
        reasoning.push('Roasted notes pair with chocolate and nuts');
      }

      // Earthy/mineral → cheese, bread
      if (flavorProfile.some(f => f.toLowerCase().includes('earth') || f.toLowerCase().includes('mineral'))) {
        foods.push('Cheese', 'Bread', 'Root Vegetables');
        confidence = 0.75;
        reasoning.push('Earthy notes pair with cheese and whole grains');
      }

      // High caffeine → light foods
      if (caffeine > 7) {
        if (!foods.includes('Light Meals')) foods.push('Light Meals');
        reasoning.push(`High caffeine (${caffeine}mg) pairs with light foods`);
      }

      // Low caffeine → anytime foods
      if (caffeine < 3) {
        foods.push('Rich Desserts', 'Chocolate', 'Creamy Foods');
        reasoning.push(`Low caffeine (${caffeine}mg) good with richer foods`);
      }

      result.data = {
        recommendedFoods: [...new Set(foods)],
        profile: {
          flavorProfile,
          caffeine,
          intensity
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`FoodPairingCalculator error: ${error.message}`);
    }
  }
}
