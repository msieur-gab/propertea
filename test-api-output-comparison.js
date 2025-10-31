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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Initialize orchestrator with all services
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

// Test 4 diverse teas
const testTeas = [
  dataset[0],  // Traditional Tie Guan Yin (Oolong)
  dataset[2],  // Dragon Well Green Tea (Green)
  dataset[4],  // Silver Needle White Tea (White)
  dataset[7]   // Aged Ripe Puerh (Puerh)
];

console.log('='
.repeat(80));
console.log('API OUTPUT COMPARISON TEST');
console.log('='
.repeat(80));

for (const tea of testTeas) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`TEA: ${tea.name}`);
  console.log(`Original: ${tea.originalName}`);
  console.log(`Type: ${tea.type}${tea.subType ? ` (${tea.subType})` : ''}`);
  console.log(`${'='.repeat(80)}`);

  // Prepare tea model
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

  // Call the API
  orchestrator.calculateTea(teaModel).then(result => {
    if (!result.success) {
      console.log('ERROR:', result.error);
      return;
    }

    const analysis = result.data;
    const expectedEffects = tea.expectedEffects;

    // EFFECTS COMPARISON
    console.log('\n--- EFFECTS ---');
    console.log(`Expected: dominant="${expectedEffects.dominant}", supporting="${expectedEffects.supporting}"`);

    if (analysis.effects && analysis.effects.expectedEffects) {
      const actual = analysis.effects.expectedEffects;
      console.log(`Actual:   dominant="${actual.dominant}", supporting="${actual.supporting}"`);

      const domMatch = actual.dominant === expectedEffects.dominant ? '✓' : '✗';
      const supMatch = actual.supporting === expectedEffects.supporting ? '✓' : '✗';
      console.log(`Match: ${domMatch} dominant, ${supMatch} supporting`);
    }

    // RECOMMENDATIONS SUMMARY
    console.log('\n--- RECOMMENDATIONS ---');

    if (analysis.timing && analysis.timing.recommendedTimes) {
      console.log(`Timing: ${analysis.timing.recommendedTimes.map(t => `${t.hour}:00 (${t.score})`).join(', ')}`);
      console.log(`  Ranges: ${analysis.timing.idealRanges.map(r => `${r.start}-${r.end} (avg: ${r.score})`).join(', ')}`);
    }

    if (analysis.seasonal) {
      console.log(`Seasonal: ${Object.keys(analysis.seasonal).slice(0, 3).join(', ')}...`);
    }

    if (analysis.food) {
      console.log(`Food: ${typeof analysis.food === 'object' ? Object.keys(analysis.food).slice(0, 3).join(', ') : 'N/A'}...`);
    }

    if (analysis.activities) {
      console.log(`Activities: ${typeof analysis.activities === 'object' ? Object.keys(analysis.activities).slice(0, 3).join(', ') : 'N/A'}...`);
    }

    if (analysis.brewing) {
      if (analysis.brewing.gongfu && !analysis.brewing.gongfu.error) {
        console.log(`Brewing Gongfu: ${analysis.brewing.gongfu.waterTemperature}, ${analysis.brewing.gongfu.steepTime}`);
      }
      if (analysis.brewing.western && !analysis.brewing.western.error) {
        console.log(`Brewing Western: ${analysis.brewing.western.waterTemperature}, ${analysis.brewing.western.steepTime}`);
      }
    }

    // EXPECTED CONTEXT COMPARISON
    console.log('\n--- EXPECTED CONTEXT (from dataset) ---');
    const context = tea.recommendedContext;
    console.log(`Seasons: ${context.drinkingSeason.join(', ')}`);
    console.log(`Food Pairings: ${context.foodPairing.slice(0, 2).join(', ')}...`);
    console.log(`Activities: ${context.recommendedActivity.slice(0, 2).join(', ')}...`);
    console.log(`Times: ${context.timeOfDay.join(', ')}`);

  }).catch(err => {
    console.error('ERROR:', err.message);
  });
}

// Wait for all async operations
setTimeout(() => {
  console.log('\n' + '='.repeat(80));
  console.log('Comparison complete');
  console.log('='.repeat(80));
}, 3000);
