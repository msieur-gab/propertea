/**
 * Failure Diagnosis Script
 *
 * Shows for EACH FAILING TEA:
 * - Input parameters (caffeine, theanine, altitude, humidity, temp, solar, flavor, processing)
 * - Contribution of each 5 factor to effect scores
 * - Why the predicted effect won
 * - What the expected effect was
 * - What needs to change
 */

import { TeaCalculationOrchestrator } from './backend/src/models/TeaCalculationOrchestrator.js';
import { TeaModel } from './backend/src/models/TeaModel.js';
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

// Group failures by category
const failures = {
  greenTeaFailures: [],
  focusingFailures: [],
  energizingFailures: [],
  otherFailures: []
};

async function analyzeTea(tea, index) {
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

  const result = await orchestrator.calculateTea(teaData);

  const predicted = result.data.effects.expectedEffects;
  const expected = tea.expectedEffects;

  // Check if match
  const isMatch = predicted.dominant === expected.dominant &&
                 predicted.supporting === expected.supporting;

  if (isMatch) {
    return null; // Skip matches
  }

  // Categorize the failure
  let category = 'otherFailures';
  if (tea.type === 'green') category = 'greenTeaFailures';
  else if (expected.dominant === 'focusing' || expected.supporting === 'focusing') category = 'focusingFailures';
  else if (expected.dominant === 'energizing' || expected.supporting === 'energizing') category = 'energizingFailures';

  return {
    index,
    name: tea.name,
    type: tea.type,
    category,
    // Input parameters
    caffeine: tea.caffeineLevel,
    theanine: tea.lTheanineLevel,
    altitude: tea.geography.altitude,
    humidity: tea.geography.humidity,
    temperature: tea.geography.temperature,
    solarRadiation: tea.geography.solarRadiation,
    flavors: tea.flavorProfile.join(', '),
    processing: tea.processingMethods.join(', '),
    // Results
    expected: expected,
    predicted: predicted,
    allScores: result.data.effects.allScores
  };
}

function formatScores(scores) {
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  return sorted.map(([eff, score]) => `${eff.padEnd(12)}: ${score.toFixed(1)}`).join('\n');
}

function printFailureGroup(title, teas, limit = 5) {
  if (!teas || teas.length === 0) {
    console.log(`\n${title}: 0 failures\n`);
    return;
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`${title}: ${teas.length} failures (showing ${Math.min(limit, teas.length)})\n`);
  console.log(`${'='.repeat(80)}\n`);

  teas.slice(0, limit).forEach(tea => {
    console.log(`[${String(tea.index).padStart(2)}] ${tea.name} (${tea.type.toUpperCase()})`);
    console.log(`────────────────────────────────────────────────────────────────`);

    console.log(`INPUT PARAMETERS:`);
    console.log(`  Compounds: Caffeine ${tea.caffeine}/5, L-Theanine ${tea.theanine}/5`);
    console.log(`  Geography: Altitude ${tea.altitude}m, Temp ${tea.temperature}°C, Humidity ${tea.humidity}%, Solar ${tea.solarRadiation}W/m²`);
    console.log(`  Flavors: ${tea.flavors}`);
    console.log(`  Processing: ${tea.processing}`);

    console.log(`\nEXPECTED vs PREDICTED:`);
    console.log(`  Expected:  ${tea.expected.dominant} + ${tea.expected.supporting}`);
    console.log(`  Predicted: ${tea.predicted.dominant} + ${tea.predicted.supporting}`);

    console.log(`\nFINAL EFFECT SCORES (top 5):`);
    console.log(formatScores(tea.allScores).split('\n').map(s => `  ${s}`).join('\n'));

    console.log(`\nDIAGNOSIS:`);
    // Simple diagnosis: which expected effect is too low?
    const expectedDomScore = tea.allScores[tea.expected.dominant] || 0;
    const expectedSupScore = tea.allScores[tea.expected.supporting] || 0;
    const predictedDomScore = tea.allScores[tea.predicted.dominant] || 0;
    const predictedSupScore = tea.allScores[tea.predicted.supporting] || 0;

    if (expectedDomScore < 5) {
      console.log(`  ⚠️  Expected dominant "${tea.expected.dominant}" scored only ${expectedDomScore.toFixed(1)}`);
      console.log(`      → Need to boost ${tea.expected.dominant} modifiers`);
    }
    if (expectedSupScore < 5) {
      console.log(`  ⚠️  Expected supporting "${tea.expected.supporting}" scored only ${expectedSupScore.toFixed(1)}`);
      console.log(`      → Need to boost ${tea.expected.supporting} modifiers`);
    }
    if (predictedDomScore > expectedDomScore + 2) {
      console.log(`  ⚠️  Predicted "${tea.predicted.dominant}" scored ${predictedDomScore.toFixed(1)} (too high)`);
      console.log(`      → Need to reduce ${tea.predicted.dominant} modifiers`);
    }

    console.log('');
  });
}

async function run() {
  console.log('\n📊 TEA EFFECT PREDICTION FAILURE ANALYSIS\n');

  // Analyze all teas
  for (let i = 0; i < dataset.length; i++) {
    const failure = await analyzeTea(dataset[i], i);
    if (failure) {
      failures[failure.category].push(failure);
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('FAILURE SUMMARY');
  console.log(`${'='.repeat(80)}`);
  console.log(`\nGreen Tea Failures: ${failures.greenTeaFailures.length}`);
  console.log(`Focusing Failures:  ${failures.focusingFailures.length}`);
  console.log(`Energizing Failures: ${failures.energizingFailures.length}`);
  console.log(`Other Failures:     ${failures.otherFailures.length}`);
  console.log(`TOTAL FAILURES:      ${Object.values(failures).reduce((sum, arr) => sum + arr.length, 0)}`);

  // Print detailed diagnostics
  printFailureGroup('🟢 GREEN TEA FAILURES (PRIORITY 1)', failures.greenTeaFailures, 8);
  printFailureGroup('⚡ ENERGIZING FAILURES (PRIORITY 2)', failures.energizingFailures, 5);
  printFailureGroup('🎯 FOCUSING FAILURES (PRIORITY 3)', failures.focusingFailures, 5);
  printFailureGroup('❓ OTHER FAILURES', failures.otherFailures, 3);

  // Pattern analysis
  console.log(`\n${'='.repeat(80)}`);
  console.log('PATTERN ANALYSIS');
  console.log(`${'='.repeat(80)}\n`);

  // For green tea failures, what's their caffeine/theanine pattern?
  if (failures.greenTeaFailures.length > 0) {
    console.log('GREEN TEA PATTERN:');
    const avgCaffeine = failures.greenTeaFailures.reduce((sum, t) => sum + t.caffeine, 0) / failures.greenTeaFailures.length;
    const avgTheanine = failures.greenTeaFailures.reduce((sum, t) => sum + t.theanine, 0) / failures.greenTeaFailures.length;
    const avgAltitude = failures.greenTeaFailures.reduce((sum, t) => sum + t.altitude, 0) / failures.greenTeaFailures.length;
    const avgTemp = failures.greenTeaFailures.reduce((sum, t) => sum + t.temperature, 0) / failures.greenTeaFailures.length;
    const avgHumidity = failures.greenTeaFailures.reduce((sum, t) => sum + t.humidity, 0) / failures.greenTeaFailures.length;

    console.log(`  Avg Caffeine: ${avgCaffeine.toFixed(1)}/5`);
    console.log(`  Avg L-Theanine: ${avgTheanine.toFixed(1)}/5`);
    console.log(`  Avg Altitude: ${avgAltitude.toFixed(0)}m`);
    console.log(`  Avg Temperature: ${avgTemp.toFixed(1)}°C`);
    console.log(`  Avg Humidity: ${avgHumidity.toFixed(1)}%`);

    // What effects are they getting instead?
    const wrongEffects = {};
    failures.greenTeaFailures.forEach(t => {
      wrongEffects[t.predicted.dominant] = (wrongEffects[t.predicted.dominant] || 0) + 1;
    });
    console.log(`  Wrong dominant effects: ${Object.entries(wrongEffects).map(([e, c]) => `${e}(${c})`).join(', ')}`);
  }

  // For energizing failures
  if (failures.energizingFailures.length > 0) {
    console.log('\nENERGIZING FAILURES PATTERN:');
    const wrongEffects = {};
    failures.energizingFailures.forEach(t => {
      wrongEffects[t.predicted.dominant] = (wrongEffects[t.predicted.dominant] || 0) + 1;
    });
    console.log(`  Wrong dominant effects: ${Object.entries(wrongEffects).map(([e, c]) => `${e}(${c})`).join(', ')}`);
    console.log(`  Tea types: ${[...new Set(failures.energizingFailures.map(t => t.type))].join(', ')}`);
  }

  // For focusing failures
  if (failures.focusingFailures.length > 0) {
    console.log('\nFOCUSING FAILURES PATTERN:');
    const wrongEffects = {};
    failures.focusingFailures.forEach(t => {
      wrongEffects[t.predicted.dominant] = (wrongEffects[t.predicted.dominant] || 0) + 1;
    });
    console.log(`  Wrong dominant effects: ${Object.entries(wrongEffects).map(([e, c]) => `${e}(${c})`).join(', ')}`);
    console.log(`  Tea types: ${[...new Set(failures.focusingFailures.map(t => t.type))].join(', ')}`);
  }
}

run().catch(console.error);
