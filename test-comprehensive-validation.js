/**
 * Comprehensive Validation Test - 54 Teas
 *
 * Tests the complete effect calculation system against all 54 unique teas
 * Generates detailed analysis to identify calculation patterns and weaknesses
 */

import { TeaCalculationOrchestrator } from './backend/src/models/TeaCalculationOrchestrator.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import { RecommendationService } from './backend/src/services/RecommendationService.js';
import fs from 'fs';

// Load comprehensive validation dataset
const datasetPath = './_dataset/chinese_teas_validation_comprehensive.json';
let dataset = [];

try {
  dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
  console.log(`✓ Loaded comprehensive dataset: ${dataset.length} teas\n`);
} catch (e) {
  console.error('Error loading dataset:', e.message);
  process.exit(1);
}

// Initialize orchestrator (same as API)
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

// Results tracking
let results = {
  total: 0,
  perfect: 0,
  partial: 0,
  different: 0,
  byType: {},
  byEffect: {},
  details: []
};

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Comprehensive Validation Test - 54 Unique Teas');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (let i = 0; i < dataset.length; i++) {
    const tea = dataset[i];
    const expectedEffects = tea.expectedEffects;

    const teaData = {
      name: tea.name,
      type: tea.type,
      subType: tea.subType || undefined,
      caffeineLevel: tea.caffeineLevel,
      lTheanineLevel: tea.lTheanineLevel,
      flavorProfile: tea.flavorProfile,
      processingMethods: tea.processingMethods,
      geography: tea.geography
    };

    try {
      const apiResult = await orchestrator.calculateTea(teaData);

      if (!apiResult.success) {
        results.different++;
        results.details.push({
          idx: i + 1,
          name: tea.name,
          type: tea.type,
          status: 'ERROR',
          error: apiResult.error
        });
        continue;
      }

      const calculatedEffects = apiResult.data.effects.expectedEffects;

      // Compare
      const domMatch = calculatedEffects.dominant === expectedEffects.dominant;
      const supMatch = calculatedEffects.supporting === expectedEffects.supporting;

      let status, result;
      if (domMatch && supMatch) {
        status = 'PERFECT ✓✓';
        result = 'perfect';
        results.perfect++;
      } else if (domMatch || supMatch) {
        status = 'PARTIAL ✓';
        result = 'partial';
        results.partial++;
      } else {
        status = 'DIFFERENT ⚠';
        result = 'different';
        results.different++;
      }

      results.total++;

      // Track by type
      if (!results.byType[tea.type]) {
        results.byType[tea.type] = { perfect: 0, partial: 0, different: 0 };
      }
      results.byType[tea.type][result]++;

      // Track by dominant effect
      const effectKey = `${expectedEffects.dominant}`;
      if (!results.byEffect[effectKey]) {
        results.byEffect[effectKey] = { perfect: 0, partial: 0, different: 0 };
      }
      results.byEffect[effectKey][result]++;

      // Print progress every 10 teas
      if ((i + 1) % 10 === 0) {
        console.log(`Progress: ${i + 1}/${dataset.length}`);
      }

      results.details.push({
        idx: i + 1,
        name: tea.name,
        type: tea.type,
        status: result.toUpperCase(),
        expected: expectedEffects,
        calculated: calculatedEffects
      });

    } catch (error) {
      results.different++;
      results.details.push({
        idx: i + 1,
        name: tea.name,
        type: tea.type,
        status: 'ERROR',
        error: error.message
      });
    }
  }

  printResults();
}

function printResults() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('Summary Results');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const perfectPct = ((results.perfect / results.total) * 100).toFixed(1);
  const partialPct = ((results.partial / results.total) * 100).toFixed(1);
  const differentPct = ((results.different / results.total) * 100).toFixed(1);
  const overallAccuracy = (((results.perfect + results.partial) / results.total) * 100).toFixed(1);

  console.log(`Total Teas Tested: ${results.total}`);
  console.log(`Perfect Matches: ${results.perfect} (${perfectPct}%)`);
  console.log(`Partial Matches: ${results.partial} (${partialPct}%)`);
  console.log(`Different Results: ${results.different} (${differentPct}%)`);
  console.log(`\n*** Overall Accuracy: ${overallAccuracy}% ***\n`);

  // Breakdown by tea type
  console.log('Breakdown by Tea Type:');
  Object.entries(results.byType)
    .sort()
    .forEach(([type, stats]) => {
      const total = stats.perfect + stats.partial + stats.different;
      const acc = (((stats.perfect + stats.partial) / total) * 100).toFixed(0);
      console.log(`  ${type.padEnd(10)}: ${String(stats.perfect).padStart(2)}P + ${String(stats.partial).padStart(2)}Pa + ${String(stats.different).padStart(2)}D = ${acc}% accuracy`);
    });

  // Breakdown by expected dominant effect
  console.log('\nBreakdown by Expected Dominant Effect:');
  Object.entries(results.byEffect)
    .sort()
    .forEach(([effect, stats]) => {
      const total = stats.perfect + stats.partial + stats.different;
      const acc = (((stats.perfect + stats.partial) / total) * 100).toFixed(0);
      console.log(`  ${effect.padEnd(12)}: ${String(stats.perfect).padStart(2)}P + ${String(stats.partial).padStart(2)}Pa + ${String(stats.different).padStart(2)}D = ${acc}% accuracy`);
    });

  // Show mismatches
  const mismatches = results.details.filter(d => d.status !== 'PERFECT' && !d.error);
  if (mismatches.length > 0) {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log(`Mismatches (${mismatches.length} teas):`);
    console.log('───────────────────────────────────────────────────────────────\n');

    // Group by type
    const mismatchesByType = {};
    mismatches.forEach(m => {
      if (!mismatchesByType[m.type]) {
        mismatchesByType[m.type] = [];
      }
      mismatchesByType[m.type].push(m);
    });

    Object.entries(mismatchesByType)
      .sort()
      .forEach(([type, items]) => {
        console.log(`${type.toUpperCase()} (${items.length}):`);
        items.forEach(m => {
          console.log(`  [${String(m.idx).padStart(2)}] ${m.name}`);
          console.log(`      Expected: ${m.expected.dominant} + ${m.expected.supporting}`);
          console.log(`      Got:      ${m.calculated.dominant} + ${m.calculated.supporting}`);
        });
        console.log('');
      });
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Test Complete');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
