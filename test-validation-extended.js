import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TeaCalculationOrchestrator } from './backend/src/models/TeaCalculationOrchestrator.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import { RecommendationService } from './backend/src/services/RecommendationService.js';
import {
  ActivityValidator,
  FoodValidator
} from './backend/src/validation/MatcherValidators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, 'tea_data_26.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const services = {
  teaTypeService: new TeaTypeService(),
  compoundService: new CompoundService(),
  flavorService: new FlavorService(),
  processingService: new ProcessingService(),
  geographyService: new GeographyService(),
  effectService: new EffectService(),
  recommendationService: new RecommendationService()
};

const orchestrator = new TeaCalculationOrchestrator(services);

const results = {
  total: 0,
  processed: 0,
  errors: 0,
  activities: { total: 0, success: 0, partial: 0, failed: 0 },
  foods: { total: 0, success: 0, partial: 0, failed: 0 }
};

console.log('================================================================================');
console.log('EXTENDED TEA DATASET VALIDATION TEST');
console.log('================================================================================\n');

for (const teaData of dataset) {
  results.total++;

  try {
    const analysis = await orchestrator.calculateTea({
      name: teaData.name,
      type: teaData.type
    });

    // Validate activities
    if (teaData.recommendedContext?.recommendedActivity) {
      results.activities.total++;
      const activityValidation = ActivityValidator.validate(
        analysis.data.activities,
        teaData.recommendedContext.recommendedActivity
      );

      if (activityValidation.accuracy === 100) {
        results.activities.success++;
      } else if (activityValidation.accuracy > 0) {
        results.activities.partial++;
      } else {
        results.activities.failed++;
      }
    }

    // Validate foods
    if (teaData.recommendedContext?.foodPairing) {
      results.foods.total++;
      const foodValidation = FoodValidator.validate(
        analysis.data.food,
        teaData.recommendedContext.foodPairing
      );

      if (foodValidation.accuracy === 100) {
        results.foods.success++;
      } else if (foodValidation.accuracy > 0) {
        results.foods.partial++;
      } else {
        results.foods.failed++;
      }
    }

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
