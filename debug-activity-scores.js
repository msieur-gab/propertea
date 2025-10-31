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
import { ActivityValidator } from './backend/src/validation/MatcherValidators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, 'tea_validation_data.json');
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

// Test Tie Guan Yin
const teaData = dataset[0];
console.log(`\n=== DEBUG: ${teaData.name} Activity Matching ===\n`);

const result = await orchestrator.calculateTea({
  name: teaData.name,
  type: teaData.type
});

const activities = result.data.activities;
console.log('Recommended Activities (top 10):');
activities.recommendedActivities.slice(0, 10).forEach(act => {
  console.log(`  ${act.name}: ${act.score}%`);
});

console.log('\nExpected Activities (from validation):');
teaData.activities.forEach(act => {
  console.log(`  - ${act}`);
});

console.log('\nValidation Results:');
const validation = ActivityValidator.validate(activities, teaData.activities);
console.log('  Success matches:', validation.matches, '/', validation.total);
console.log('  Accuracy:', validation.accuracy.toFixed(1), '%');
console.log('  Recommended:', validation.recommended.join(', '));
console.log('  Expected:', validation.expected.join(', '));
