import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../../models/CalculatorResult.js';

/**
 * ActivityCalculator - Determines best activities for tea
 *
 * Inputs: compounds (caffeine, L-theanine ratio), flavor
 * Outputs: recommended activities
 * Confidence: 0.7-0.95
 *
 * No dependencies: Runs independently
 */
export class ActivityCalculator extends BaseCalculator {

  constructor() {
    super('ActivityCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('ActivityCalculator');

    try {
      const caffeine = teaModel.compounds.caffeine;
      const lTheanine = teaModel.compounds.lTheanine;
      const ratio = teaModel.compounds.ratio;
      const flavorProfile = teaModel.flavor.primary;

      let activities = [];
      let confidence = 0.7;
      let reasoning = [];

      // High stimulation (ratio > 2): Focus work
      if (ratio > 2) {
        activities.push('High-Focus Work', 'Morning Routines', 'Exercise');
        confidence = 0.95;
        reasoning.push(
          `High caffeine/L-theanine ratio (${ratio.toFixed(2)}) indicates stimulation`
        );
      }
      // Moderate stimulation (ratio 1-2): Balanced activities
      else if (ratio >= 1 && ratio <= 2) {
        activities.push('Work', 'Study', 'Creative Projects', 'Social Gatherings');
        confidence = 0.85;
        reasoning.push(
          `Balanced caffeine/L-theanine ratio (${ratio.toFixed(2)}) suggests diverse activities`
        );
      }
      // Low stimulation (ratio < 1): Relaxation
      else if (ratio < 1) {
        activities.push('Meditation', 'Yoga', 'Contemplation', 'Evening Wind-Down');
        confidence = 0.95;
        reasoning.push(
          `Low caffeine/L-theanine ratio (${ratio.toFixed(2)}) indicates relaxation`
        );
      }

      // Fruity/Floral flavors → Creative activities
      if (flavorProfile.some(f => f.toLowerCase().includes('fruity') || f.toLowerCase().includes('floral'))) {
        if (!activities.includes('Creative Projects')) {
          activities.push('Creative Projects', 'Journaling');
        }
        confidence = Math.max(confidence, 0.8);
        reasoning.push(`Fruity/floral flavors enhance creative activities`);
      }

      // Roasted flavors → Contemplative activities
      if (flavorProfile.some(f => f.toLowerCase().includes('roast') || f.toLowerCase().includes('woody'))) {
        if (!activities.includes('Contemplation')) {
          activities.push('Contemplation', 'Reflection');
        }
        confidence = Math.max(confidence, 0.75);
        reasoning.push(`Roasted/woody flavors enhance contemplative activities`);
      }

      result.data = {
        recommendedActivities: [...new Set(activities)],
        profile: {
          caffeine,
          lTheanine,
          ratio: ratio.toFixed(2)
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`ActivityCalculator error: ${error.message}`);
    }
  }
}
