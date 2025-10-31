/**
 * Test API with Extended Validation Dataset
 *
 * Loads the extended validation set and tests the complete orchestrator
 * against expected effects to validate our integration changes.
 *
 * This simulates what the API endpoint does when receiving requests.
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

// Load extended validation dataset
const extendedSetPath = './_dataset/chinese_teas_validation_extended_set.json';

let extendedSet = [];
try {
  extendedSet = JSON.parse(fs.readFileSync(extendedSetPath, 'utf8'));
  console.log(`✓ Loaded extended validation dataset: ${extendedSet.length} teas\n`);
} catch (e) {
  console.error('Error loading dataset:', e.message);
  process.exit(1);
}

// Initialize orchestrator (same as API endpoint)
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

// Test results tracking
let results = {
  total: 0,
  perfect: 0,
  partial: 0,
  different: 0,
  details: []
};

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('Testing API with Extended Validation Dataset');
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (let i = 0; i < extendedSet.length; i++) {
    const tea = extendedSet[i];
    const expectedEffects = tea.expectedEffects;

    // Prepare tea data for API (simulating form submission)
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
      // Call orchestrator (same as API endpoint)
      const apiResult = await orchestrator.calculateTea(teaData);

      if (!apiResult.success) {
        console.error(`✗ Tea ${i + 1}: ${tea.name} - Analysis failed`);
        results.different++;
        results.details.push({
          name: tea.name,
          type: tea.type,
          subType: tea.subType || 'N/A',
          status: 'FAILED',
          expected: expectedEffects,
          calculated: null,
          error: apiResult.error
        });
        continue;
      }

      const calculatedEffects = apiResult.data.effects.expectedEffects;

      // Compare effects
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

      // Log detailed output
      console.log(`[${String(i + 1).padStart(2, '0')}] ${tea.name}`);
      console.log(`    Type: ${tea.type}${tea.subType ? ` (${tea.subType})` : ''}`);
      console.log(`    Expected: ${expectedEffects.dominant} + ${expectedEffects.supporting}`);
      console.log(`    Calculated: ${calculatedEffects.dominant} + ${calculatedEffects.supporting}`);
      console.log(`    Result: ${status}`);
      console.log('');

      results.details.push({
        name: tea.name,
        type: tea.type,
        subType: tea.subType || 'N/A',
        status: result.toUpperCase(),
        expected: expectedEffects,
        calculated: calculatedEffects
      });
    } catch (error) {
      console.error(`✗ Tea ${i + 1}: ${tea.name}`);
      console.error(`  Error: ${error.message}\n`);
      results.different++;
      results.details.push({
        name: tea.name,
        type: tea.type,
        subType: tea.subType || 'N/A',
        status: 'ERROR',
        expected: expectedEffects,
        calculated: null,
        error: error.message
      });
    }
  }

  // Summary statistics
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
  console.log(`\nOverall Accuracy: ${overallAccuracy}%\n`);

  // Breakdown by type
  console.log('Breakdown by Tea Type:');
  const byType = {};
  results.details.forEach(detail => {
    const typeKey = detail.type + (detail.subType !== 'N/A' ? `-${detail.subType}` : '');
    if (!byType[typeKey]) {
      byType[typeKey] = { perfect: 0, partial: 0, different: 0, total: 0 };
    }
    byType[typeKey].total++;
    if (detail.status === 'PERFECT') byType[typeKey].perfect++;
    else if (detail.status === 'PARTIAL') byType[typeKey].partial++;
    else byType[typeKey].different++;
  });

  Object.entries(byType).forEach(([type, stats]) => {
    const acc = (((stats.perfect + stats.partial) / stats.total) * 100).toFixed(0);
    console.log(`  ${type}: ${stats.perfect}P + ${stats.partial}Pa + ${stats.different}D = ${acc}% accuracy`);
  });

  // Show mismatches details
  const mismatches = results.details.filter(d => d.status !== 'PERFECT');
  if (mismatches.length > 0) {
    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('Detailed Mismatches:');
    console.log('───────────────────────────────────────────────────────────────\n');

    mismatches.forEach(detail => {
      console.log(`• ${detail.name} [${detail.type}${detail.subType !== 'N/A' ? ` - ${detail.subType}` : ''}]`);
      if (detail.error) {
        console.log(`  Error: ${detail.error}`);
      } else {
        console.log(`  Expected: dominant="${detail.expected.dominant}", supporting="${detail.expected.supporting}"`);
        console.log(`  Got:      dominant="${detail.calculated.dominant}", supporting="${detail.calculated.supporting}"`);
      }
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
