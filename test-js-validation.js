import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TeaInsights } from './js/TeaInsights.js';
import {
  ActivityValidator,
  FoodValidator
} from './backend/src/validation/MatcherValidators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, 'tea_validation_data.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const teaInsights = new TeaInsights();

const results = {
  total: 0,
  processed: 0,
  errors: 0,
  activities: { total: 0, success: 0, partial: 0, failed: 0 },
  foods: { total: 0, success: 0, partial: 0, failed: 0 },
  details: []
};

console.log('================================================================================');
console.log('JS SYSTEM VALIDATION TEST (Original Implementation)');
console.log('================================================================================\n');

for (const teaData of dataset) {
  results.total++;

  try {
    const tea = { name: teaData.name, type: teaData.type };
    const analysis = teaInsights.analyzeTea(tea);

    if (!analysis) {
      results.errors++;
      continue;
    }

    const detail = { name: teaData.name, activities: {}, foods: {} };

    // Validate activities
    if (teaData.activities) {
      results.activities.total++;
      const activityValidation = ActivityValidator.validate(
        analysis.activities || {},
        teaData.activities
      );

      detail.activities = {
        accuracy: activityValidation.accuracy.toFixed(1),
        recommended: activityValidation.recommended,
        expected: activityValidation.expected
      };

      if (activityValidation.accuracy === 100) {
        results.activities.success++;
      } else if (activityValidation.accuracy > 0) {
        results.activities.partial++;
      } else {
        results.activities.failed++;
      }
    }

    // Validate foods
    if (teaData.food_pairings) {
      results.foods.total++;
      const foodValidation = FoodValidator.validate(
        analysis.food || {},
        teaData.food_pairings
      );

      detail.foods = {
        accuracy: foodValidation.accuracy.toFixed(1),
        recommended: foodValidation.recommended,
        expected: foodValidation.expected
      };

      if (foodValidation.accuracy === 100) {
        results.foods.success++;
      } else if (foodValidation.accuracy > 0) {
        results.foods.partial++;
      } else {
        results.foods.failed++;
      }
    }

    results.details.push(detail);
    results.processed++;
  } catch (error) {
    results.errors++;
    console.error(`Error processing ${teaData.name}: ${error.message}`);
  }
}

console.log('VALIDATION RESULTS');
console.log('================================================================================\n');
console.log(`Total Teas: ${results.total}`);
console.log(`Processed: ${results.processed}`);
console.log(`Errors: ${results.errors}\n`);

console.log('--- ACTIVITY RECOMMENDATIONS ---');
console.log(`Success (100%): ${results.activities.success}/${results.activities.total} (${((results.activities.success / results.activities.total) * 100).toFixed(1)}%)`);
console.log(`Partial (>0%): ${results.activities.partial}/${results.activities.total} (${((results.activities.partial / results.activities.total) * 100).toFixed(1)}%)`);
console.log(`Failed (0%): ${results.activities.failed}/${results.activities.total} (${((results.activities.failed / results.activities.total) * 100).toFixed(1)}%)\n`);

console.log('--- FOOD PAIRING RECOMMENDATIONS ---');
console.log(`Success (100%): ${results.foods.success}/${results.foods.total} (${((results.foods.success / results.foods.total) * 100).toFixed(1)}%)`);
console.log(`Partial (>0%): ${results.foods.partial}/${results.foods.total} (${((results.foods.partial / results.foods.total) * 100).toFixed(1)}%)`);
console.log(`Failed (0%): ${results.foods.failed}/${results.foods.total} (${((results.foods.failed / results.foods.total) * 100).toFixed(1)}%)\n`);

// Show first few results
console.log('--- SAMPLE RESULTS ---\n');
results.details.slice(0, 3).forEach(detail => {
  console.log(`${detail.name}:`);
  console.log(`  Activities: ${detail.activities.accuracy}% (${detail.activities.recommended?.join(', ') || 'N/A'})`);
  console.log(`  Foods: ${detail.foods.accuracy}% (${detail.foods.recommended?.slice(0, 3).join(', ') || 'N/A'}\n`);
});
