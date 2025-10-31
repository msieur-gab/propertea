/**
 * Detailed Comparison Test - All 54 Teas
 * Shows expected vs calculated effects for every single tea
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

const dataset = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_comprehensive.json', 'utf8'));

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

let stats = {
  perfect: 0,
  partial: 0,
  different: 0,
  errors: 0
};

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║           DETAILED COMPARISON - ALL 54 TEAS                         ║');
  console.log('║         EXPECTED EFFECTS vs CALCULATED EFFECTS                      ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  for (let i = 0; i < dataset.length; i++) {
    const tea = dataset[i];
    const expected = tea.expectedEffects;

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
      const result = await orchestrator.calculateTea(teaData);

      if (!result.success) {
        console.log(`[${String(i + 1).padStart(2)}] ✗ ${tea.name.padEnd(40)} [ERROR]`);
        console.log(`     Type: ${tea.type}\n`);
        stats.errors++;
        continue;
      }

      const calculated = result.data.effects.expectedEffects;

      // Determine match status
      const domMatch = calculated.dominant === expected.dominant;
      const supMatch = calculated.supporting === expected.supporting;

      let statusIcon, statusText;
      if (domMatch && supMatch) {
        statusIcon = '✓✓';
        statusText = 'PERFECT';
        stats.perfect++;
      } else if (domMatch || supMatch) {
        statusIcon = '✓';
        statusText = 'PARTIAL';
        stats.partial++;
      } else {
        statusIcon = '✗';
        statusText = 'DIFFERENT';
        stats.different++;
      }

      // Print tea info
      console.log(`[${String(i + 1).padStart(2)}] ${statusIcon} ${tea.name.padEnd(40)} [${statusText}]`);
      console.log(`     Type: ${tea.type.padEnd(10)} | Caffeine: ${tea.caffeineLevel}/5 | L-Theanine: ${tea.lTheanineLevel}/5`);

      // Expected vs Calculated
      console.log(`     Expected:   dominant="${expected.dominant.padEnd(12)}" + supporting="${expected.supporting}"`);
      console.log(`     Calculated: dominant="${calculated.dominant.padEnd(12)}" + supporting="${calculated.supporting}"`);
      console.log('');

    } catch (error) {
      console.log(`[${String(i + 1).padStart(2)}] ✗ ${tea.name.padEnd(40)} [ERROR: ${error.message}]`);
      console.log('');
      stats.errors++;
    }
  }

  // Print summary
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                           SUMMARY                                   ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');

  const total = stats.perfect + stats.partial + stats.different;
  const accuracy = (((stats.perfect + stats.partial) / total) * 100).toFixed(1);

  console.log(`Total Teas:        ${total}`);
  console.log(`Perfect Matches:   ${stats.perfect} (${((stats.perfect / total) * 100).toFixed(1)}%)`);
  console.log(`Partial Matches:   ${stats.partial} (${((stats.partial / total) * 100).toFixed(1)}%)`);
  console.log(`Different Results: ${stats.different} (${((stats.different / total) * 100).toFixed(1)}%)`);
  console.log(`Errors:            ${stats.errors}`);
  console.log(`\n*** OVERALL ACCURACY: ${accuracy}% ***\n`);
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
