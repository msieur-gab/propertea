/**
 * Debug Effect Calculation
 *
 * Traces through the exact calculation for a specific tea to understand
 * how parameters are being combined
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
import { TeaTypeNormalizer } from './backend/src/utils/TeaTypeNormalizer.js';
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

async function debugTea(tea, index) {
  console.log('\n' + '═'.repeat(80));
  console.log(`DEBUG: ${tea.name} (Green Tea - Currently failing)`);
  console.log('═'.repeat(80));

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

  // Manually trace the effect calculation
  console.log('\n📋 INPUT PARAMETERS:');
  console.log(`  Type: ${tea.type}`);
  console.log(`  Caffeine: ${tea.caffeineLevel}/5 | L-Theanine: ${tea.lTheanineLevel}/5`);
  console.log(`  Flavors: ${tea.flavorProfile.join(', ')}`);
  console.log(`  Processing: ${tea.processingMethods.join(', ')}`);
  console.log(`  Geography: alt=${tea.geography.altitude}m, temp=${tea.geography.temperature}°C, humidity=${tea.geography.humidity}%, solar=${tea.geography.solarRadiation}W/m²`);

  // Create TeaModel (this is what the orchestrator does)
  const teaModel = new TeaModel(teaData);

  // Get service outputs (using TeaModel, not raw teaData)
  const compoundResult = await services.compoundService.analyze(teaModel);
  const flavorResult = await services.flavorService.analyze(teaModel);
  const processingResult = await services.processingService.analyze(teaModel);
  const geographyResult = await services.geographyService.analyze(teaModel);

  console.log('\n🔍 SERVICE OUTPUTS:');
  console.log(`  Compound stimulation: ${compoundResult.analysis?.stimulationLevel}`);
  console.log(`  Compound relaxation: ${compoundResult.analysis?.relaxationLevel}`);
  console.log(`  Flavor categories: ${flavorResult.profile?.categories?.join(', ') || 'none'}`);
  console.log(`  Processing roast: ${processingResult.roastLevel}`);
  console.log(`  Geography climate: ${JSON.stringify(geographyResult.climate)}`);

  // Manual calculation following EffectService._buildEffectScores logic
  console.log('\n🧮 MANUAL CALCULATION TRACE:');

  const scores = {};
  const CORE_EFFECTS = ['energizing', 'calming', 'focusing', 'harmonizing', 'grounding', 'elevating', 'comforting', 'restorative'];
  CORE_EFFECTS.forEach(e => scores[e] = 0);

  // 1. Tea type base effects
  const normalized = TeaTypeNormalizer.normalize(teaData.type);
  const canonicalTeaType = normalized.canonical;
  console.log(`\n  Step 1 - Tea Type Base Effects (${canonicalTeaType}, weight 2.5):`);
  console.log(`    green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 }`);

  const TEA_TYPE_EFFECTS = {
    green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 }
  };
  const baseEffects = TEA_TYPE_EFFECTS[canonicalTeaType] || {};
  Object.entries(baseEffects).forEach(([effect, value]) => {
    const addition = value * 2.5;
    scores[effect] = (scores[effect] || 0) + addition;
    console.log(`      ${effect}: ${value} × 2.5 = ${addition} (total: ${scores[effect]})`);
  });

  // 2. Compound modifiers
  const relaxationLevel = compoundResult.analysis?.relaxationLevel;
  console.log(`\n  Step 2 - Compound Modifiers (${relaxationLevel}, weight 2.0):`);

  const COMPOUND_MODIFIERS = {
    'High L-Theanine': { calming: 3, harmonizing: 1, restorative: 0.5, comforting: 0.5 },
    'Very High L-Theanine': { calming: 4, harmonizing: 2, restorative: 1.5, elevating: 1 }
  };

  let compoundModifier = {};
  if (relaxationLevel === 'High') {
    compoundModifier = COMPOUND_MODIFIERS['High L-Theanine'];
    console.log(`    High L-Theanine: ${JSON.stringify(compoundModifier)}`);
  } else if (relaxationLevel === 'Very High') {
    compoundModifier = COMPOUND_MODIFIERS['Very High L-Theanine'];
    console.log(`    Very High L-Theanine: ${JSON.stringify(compoundModifier)}`);
  }

  Object.entries(compoundModifier).forEach(([effect, modifier]) => {
    const addition = modifier * 2.0;
    scores[effect] = (scores[effect] || 0) + addition;
    console.log(`      ${effect}: ${modifier} × 2.0 = ${addition} (total: ${scores[effect]})`);
  });

  // 3. Flavor effects
  const flavorCategories = flavorResult.profile?.categories || [];
  console.log(`\n  Step 3 - Flavor Effects (weight 2.0):`);
  console.log(`    Categories: ${flavorCategories.join(', ')}`);

  const FLAVOR_EFFECT_MAP = {
    Sweet: { elevating: 0.5, comforting: 1, restorative: 0.5, calming: 0.5 },
    Vegetal: { focusing: 1, grounding: 0.5, energizing: 0.5 }
  };

  flavorCategories.forEach(category => {
    const flavorEffects = FLAVOR_EFFECT_MAP[category] || {};
    if (Object.keys(flavorEffects).length > 0) {
      console.log(`    ${category}: ${JSON.stringify(flavorEffects)}`);
      Object.entries(flavorEffects).forEach(([effect, modifier]) => {
        const addition = modifier * 2;
        scores[effect] = (scores[effect] || 0) + addition;
        console.log(`      ${effect}: ${modifier} × 2 = ${addition} (total: ${scores[effect]})`);
      });
    }
  });

  // 4. Processing roast level
  const roastLevel = processingResult.roastLevel;
  console.log(`\n  Step 4 - Processing Roast (${roastLevel}, weight 1.5):`);
  const ROAST_MODIFIERS = {
    Light: { energizing: 0.5, elevating: 0.5 },
    Minimal: { elevating: 0.5, focusing: 0.5 },
    None: {}
  };
  const roastModifier = ROAST_MODIFIERS[roastLevel] || {};
  console.log(`    ${roastLevel}: ${JSON.stringify(roastModifier)}`);
  Object.entries(roastModifier).forEach(([effect, modifier]) => {
    const addition = modifier * 1.5;
    scores[effect] = (scores[effect] || 0) + addition;
    console.log(`      ${effect}: ${modifier} × 1.5 = ${addition} (total: ${scores[effect]})`);
  });

  // 5. Geography
  console.log(`\n  Step 5 - Geography/Climate (weight 2.0):`);
  const climate = geographyResult.climate;
  const altitude = climate?.altitude || 0;
  const humidity = climate?.humidity || 70;

  if (altitude < 500) {
    console.log(`    Altitude < 500m (very low): comforting: 0.5`);
    scores.comforting = (scores.comforting || 0) + (0.5 * 2.0);
    console.log(`      comforting: 0.5 × 2.0 = 1.0 (total: ${scores.comforting})`);
  }

  if (humidity >= 75 && humidity <= 85) {
    console.log(`    Humidity 75-85% (high): elevating: 0.75, harmonizing: 0.75, calming: 0.25`);
    const elevAdd = 0.75 * 2.0;
    const harmAdd = 0.75 * 2.0;
    const calmAdd = 0.25 * 2.0;
    scores.elevating = (scores.elevating || 0) + elevAdd;
    scores.harmonizing = (scores.harmonizing || 0) + harmAdd;
    scores.calming = (scores.calming || 0) + calmAdd;
    console.log(`      elevating: 0.75 × 2.0 = ${elevAdd} (total: ${scores.elevating})`);
    console.log(`      harmonizing: 0.75 × 2.0 = ${harmAdd} (total: ${scores.harmonizing})`);
    console.log(`      calming: 0.25 × 2.0 = ${calmAdd} (total: ${scores.calming})`);
  }

  console.log('\n📊 FINAL SCORES:');
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  sorted.forEach(([effect, score]) => {
    console.log(`    ${effect.padEnd(12)}: ${score.toFixed(1)}`);
  });

  console.log(`\n🎯 TOP EFFECTS:`);
  console.log(`    Dominant: ${sorted[0][0]} (${sorted[0][1].toFixed(1)})`);
  console.log(`    Supporting: ${sorted[1][0]} (${sorted[1][1].toFixed(1)})`);
  console.log(`    Expected: ${tea.expectedEffects.dominant} + ${tea.expectedEffects.supporting}`);

  // Now run actual orchestrator to compare
  const result = await orchestrator.calculateTea(teaData);
  if (result.success) {
    console.log(`\n✅ ACTUAL ORCHESTRATOR RESULT:`);
    console.log(`    Dominant: ${result.data.effects.expectedEffects.dominant}`);
    console.log(`    Supporting: ${result.data.effects.expectedEffects.supporting}`);
    console.log(`    Scores:`, JSON.stringify(result.data.effects.allScores, null, 2).split('\n').slice(0, 10).join('\n'));
  }
}

async function run() {
  // Test one green tea
  const teaIndex = 2; // Dragon Well
  await debugTea(dataset[teaIndex], teaIndex);

  console.log('\n' + '═'.repeat(80));
}

run().catch(console.error);
