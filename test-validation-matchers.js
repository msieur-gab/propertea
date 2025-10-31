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
  TimingValidator,
  SeasonValidator,
  ActivityValidator,
  FoodValidator,
  RecommendationValidator
} from './backend/src/validation/MatcherValidators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Initialize orchestrator
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

// Tracking metrics
const results = {
  total: 0,
  processed: 0,
  errors: 0,
  timing: { total: 0, success: 0, partial: 0, failed: 0 },
  seasonal: { total: 0, success: 0, partial: 0, failed: 0 },
  activities: { total: 0, success: 0, partial: 0, failed: 0 },
  foods: { total: 0, success: 0, partial: 0, failed: 0 },
  byTeaType: {},
  teaDetails: []
};

console.log('=' .repeat(80));
console.log('COMPREHENSIVE MATCHER VALIDATION TEST');
console.log('=' .repeat(80));
console.log(`Loading ${dataset.length} teas from dataset...\n`);

async function validateTea(tea, index) {
  return new Promise((resolve) => {
    try {
      const teaModel = {
        name: tea.name,
        type: tea.type,
        subType: tea.subType || null,
        caffeineLevel: tea.caffeineLevel,
        lTheanineLevel: tea.lTheanineLevel,
        flavorProfile: tea.flavorProfile || [],
        processingMethods: tea.processingMethods || [],
        geography: tea.geography || {}
      };

      orchestrator.calculateTea(teaModel).then(result => {
        if (!result.success) {
          results.errors++;
          resolve();
          return;
        }

        results.processed++;
        const analysis = result.data;
        const expectedContext = tea.recommendedContext;

        // Validate recommendations using MatcherValidators
        const validationResults = RecommendationValidator.validateAll(
          analysis,
          expectedContext
        );

        // Track by tea type
        const teaType = tea.type;
        if (!results.byTeaType[teaType]) {
          results.byTeaType[teaType] = {
            total: 0,
            timing: { success: 0, partial: 0, failed: 0 },
            seasonal: { success: 0, partial: 0, failed: 0 },
            activities: { success: 0, partial: 0, failed: 0 },
            foods: { success: 0, partial: 0, failed: 0 }
          };
        }
        results.byTeaType[teaType].total++;

        // Timing validation
        const timingValid = validationResults.timing;
        results.timing.total++;
        if (timingValid.success && timingValid.accuracy === 100) {
          results.timing.success++;
          results.byTeaType[teaType].timing.success++;
        } else if (timingValid.success && timingValid.accuracy > 0) {
          results.timing.partial++;
          results.byTeaType[teaType].timing.partial++;
        } else {
          results.timing.failed++;
          results.byTeaType[teaType].timing.failed++;
        }

        // Seasonal validation
        const seasonalValid = validationResults.seasons;
        results.seasonal.total++;
        if (seasonalValid.success && seasonalValid.accuracy === 100) {
          results.seasonal.success++;
          results.byTeaType[teaType].seasonal.success++;
        } else if (seasonalValid.success && seasonalValid.accuracy > 0) {
          results.seasonal.partial++;
          results.byTeaType[teaType].seasonal.partial++;
        } else {
          results.seasonal.failed++;
          results.byTeaType[teaType].seasonal.failed++;
        }

        // Activities validation
        const activitiesValid = validationResults.activities;
        results.activities.total++;
        if (activitiesValid.success && activitiesValid.accuracy === 100) {
          results.activities.success++;
          results.byTeaType[teaType].activities.success++;
        } else if (activitiesValid.success && activitiesValid.accuracy > 0) {
          results.activities.partial++;
          results.byTeaType[teaType].activities.partial++;
        } else {
          results.activities.failed++;
          results.byTeaType[teaType].activities.failed++;
        }

        // Foods validation
        const foodsValid = validationResults.foods;
        results.foods.total++;
        if (foodsValid.success && foodsValid.accuracy === 100) {
          results.foods.success++;
          results.byTeaType[teaType].foods.success++;
        } else if (foodsValid.success && foodsValid.accuracy > 0) {
          results.foods.partial++;
          results.byTeaType[teaType].foods.partial++;
        } else {
          results.foods.failed++;
          results.byTeaType[teaType].foods.failed++;
        }

        // Store detail for individual tea
        results.teaDetails.push({
          name: tea.name,
          type: teaType,
          timing: {
            accuracy: timingValid.accuracy.toFixed(1),
            success: timingValid.success && timingValid.accuracy === 100,
            recommended: timingValid.recommended,
            expected: timingValid.expected
          },
          seasonal: {
            accuracy: seasonalValid.accuracy.toFixed(1),
            success: seasonalValid.success && seasonalValid.accuracy === 100,
            recommended: seasonalValid.recommended,
            expected: seasonalValid.expected
          },
          activities: {
            accuracy: activitiesValid.accuracy.toFixed(1),
            success: activitiesValid.success && activitiesValid.accuracy === 100,
            recommended: activitiesValid.recommended,
            expected: activitiesValid.expected
          },
          foods: {
            accuracy: foodsValid.accuracy.toFixed(1),
            success: foodsValid.success && foodsValid.accuracy === 100,
            recommended: foodsValid.recommended,
            expected: foodsValid.expected
          }
        });

        resolve();
      }).catch(err => {
        results.errors++;
        resolve();
      });
    } catch (err) {
      results.errors++;
      resolve();
    }
  });
}

// Process all teas sequentially
async function runValidation() {
  results.total = dataset.length;

  for (let i = 0; i < dataset.length; i++) {
    const tea = dataset[i];
    await validateTea(tea, i);

    // Progress indicator
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`\rProcessed: ${i + 1}/${dataset.length}`);
    }
  }

  console.log(`\n\n${'=' .repeat(80)}`);
  console.log('VALIDATION RESULTS SUMMARY');
  console.log('=' .repeat(80));

  // Overall statistics
  console.log(`\nTotal Teas: ${results.total}`);
  console.log(`Processed: ${results.processed}`);
  console.log(`Errors: ${results.errors}`);

  // Timing results
  console.log(`\n--- TIMING RECOMMENDATIONS ---`);
  const timingSuccessRate = ((results.timing.success / results.timing.total) * 100).toFixed(1);
  const timingPartialRate = ((results.timing.partial / results.timing.total) * 100).toFixed(1);
  const timingFailRate = ((results.timing.failed / results.timing.total) * 100).toFixed(1);
  console.log(`Success (100%): ${results.timing.success}/${results.timing.total} (${timingSuccessRate}%)`);
  console.log(`Partial (>0%): ${results.timing.partial}/${results.timing.total} (${timingPartialRate}%)`);
  console.log(`Failed (0%): ${results.timing.failed}/${results.timing.total} (${timingFailRate}%)`);

  // Seasonal results
  console.log(`\n--- SEASONAL RECOMMENDATIONS ---`);
  const seasonalSuccessRate = ((results.seasonal.success / results.seasonal.total) * 100).toFixed(1);
  const seasonalPartialRate = ((results.seasonal.partial / results.seasonal.total) * 100).toFixed(1);
  const seasonalFailRate = ((results.seasonal.failed / results.seasonal.total) * 100).toFixed(1);
  console.log(`Success (100%): ${results.seasonal.success}/${results.seasonal.total} (${seasonalSuccessRate}%)`);
  console.log(`Partial (>0%): ${results.seasonal.partial}/${results.seasonal.total} (${seasonalPartialRate}%)`);
  console.log(`Failed (0%): ${results.seasonal.failed}/${results.seasonal.total} (${seasonalFailRate}%)`);

  // Activities results
  console.log(`\n--- ACTIVITY RECOMMENDATIONS ---`);
  const activitiesSuccessRate = ((results.activities.success / results.activities.total) * 100).toFixed(1);
  const activitiesPartialRate = ((results.activities.partial / results.activities.total) * 100).toFixed(1);
  const activitiesFailRate = ((results.activities.failed / results.activities.total) * 100).toFixed(1);
  console.log(`Success (100%): ${results.activities.success}/${results.activities.total} (${activitiesSuccessRate}%)`);
  console.log(`Partial (>0%): ${results.activities.partial}/${results.activities.total} (${activitiesPartialRate}%)`);
  console.log(`Failed (0%): ${results.activities.failed}/${results.activities.total} (${activitiesFailRate}%)`);

  // Foods results
  console.log(`\n--- FOOD PAIRING RECOMMENDATIONS ---`);
  const foodsSuccessRate = ((results.foods.success / results.foods.total) * 100).toFixed(1);
  const foodsPartialRate = ((results.foods.partial / results.foods.total) * 100).toFixed(1);
  const foodsFailRate = ((results.foods.failed / results.foods.total) * 100).toFixed(1);
  console.log(`Success (100%): ${results.foods.success}/${results.foods.total} (${foodsSuccessRate}%)`);
  console.log(`Partial (>0%): ${results.foods.partial}/${results.foods.total} (${foodsPartialRate}%)`);
  console.log(`Failed (0%): ${results.foods.failed}/${results.foods.total} (${foodsFailRate}%)`);

  // By tea type breakdown
  console.log(`\n${'=' .repeat(80)}`);
  console.log('RESULTS BY TEA TYPE');
  console.log('=' .repeat(80));

  Object.entries(results.byTeaType)
    .sort(([, a], [, b]) => b.total - a.total)
    .forEach(([teaType, stats]) => {
      console.log(`\n${teaType.toUpperCase()} (${stats.total} teas)`);
      console.log(`  Timing: ${stats.timing.success} success, ${stats.timing.partial} partial, ${stats.timing.failed} failed`);
      console.log(`  Seasonal: ${stats.seasonal.success} success, ${stats.seasonal.partial} partial, ${stats.seasonal.failed} failed`);
      console.log(`  Activities: ${stats.activities.success} success, ${stats.activities.partial} partial, ${stats.activities.failed} failed`);
      console.log(`  Foods: ${stats.foods.success} success, ${stats.foods.partial} partial, ${stats.foods.failed} failed`);
    });

  // Sample failures for debugging
  console.log(`\n${'=' .repeat(80)}`);
  console.log('SAMPLE FAILURES (First 5 by type)');
  console.log('=' .repeat(80));

  const failures = results.teaDetails.filter(
    t => !t.timing.success || !t.seasonal.success || !t.activities.success || !t.foods.success
  );

  let timingFails = 0, seasonalFails = 0, activitiesFails = 0, foodsFails = 0;

  failures.forEach(tea => {
    if (!tea.timing.success && timingFails < 3) {
      console.log(`\n[TIMING FAIL] ${tea.name} (${tea.type})`);
      console.log(`  Accuracy: ${tea.timing.accuracy}%`);
      console.log(`  Recommended: ${tea.timing.recommended.join(', ')}`);
      console.log(`  Expected: ${tea.timing.expected.join(', ')}`);
      timingFails++;
    }

    if (!tea.seasonal.success && seasonalFails < 3) {
      console.log(`\n[SEASONAL FAIL] ${tea.name} (${tea.type})`);
      console.log(`  Accuracy: ${tea.seasonal.accuracy}%`);
      console.log(`  Recommended: ${tea.seasonal.recommended.join(', ')}`);
      console.log(`  Expected: ${tea.seasonal.expected.join(', ')}`);
      seasonalFails++;
    }

    if (!tea.activities.success && activitiesFails < 3) {
      console.log(`\n[ACTIVITIES FAIL] ${tea.name} (${tea.type})`);
      console.log(`  Accuracy: ${tea.activities.accuracy}%`);
      console.log(`  Recommended: ${tea.activities.recommended.join(', ')}`);
      console.log(`  Expected: ${tea.activities.expected.join(', ')}`);
      activitiesFails++;
    }

    if (!tea.foods.success && foodsFails < 3) {
      console.log(`\n[FOODS FAIL] ${tea.name} (${tea.type})`);
      console.log(`  Accuracy: ${tea.foods.accuracy}%`);
      console.log(`  Recommended: ${tea.foods.recommended.join(', ')}`);
      console.log(`  Expected: ${tea.foods.expected.join(', ')}`);
      foodsFails++;
    }
  });

  console.log(`\n${'=' .repeat(80)}`);
  console.log('Validation test complete');
  console.log('=' .repeat(80));
}

runValidation().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
