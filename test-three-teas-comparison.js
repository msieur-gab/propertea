/**
 * Test script comparing three different teas through the 5-Factor EffectService
 * 1. Mi Lan Xiang Dan Cong (Oolong) - Higher caffeine, warm location
 * 2. Silver Needle (White) - Low caffeine, high L-theanine, lower altitude
 * 3. Aged Ripe Puerh (Puerh Shou) - Balanced compounds, fermented, warmer climate
 *
 * Run with: node test-three-teas-comparison.js
 */

import { TeaModel } from './backend/src/models/TeaModel.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';

async function analyzeTea(teaData) {
  const teaModel = new TeaModel(teaData);
  const teaTypeService = new TeaTypeService();
  const compoundService = new CompoundService();
  const flavorService = new FlavorService();
  const processingService = new ProcessingService();
  const geographyService = new GeographyService();
  const effectService = new EffectService();

  const teaType = await teaTypeService.analyze(teaModel);
  const compounds = await compoundService.analyze(teaModel);
  const flavor = await flavorService.analyze(teaModel);
  const processing = await processingService.analyze(teaModel);
  const geography = await geographyService.analyze(teaModel);

  const coreAnalysis = { teaType, compounds, flavor, processing, geography, _sourceTea: teaModel };
  const effects = await effectService.analyze(teaModel, coreAnalysis);

  return { teaModel, compounds, flavor, processing, geography, effects };
}

async function testAllTeas() {
  console.log('='.repeat(100));
  console.log('COMPREHENSIVE TEA EFFECTS ANALYSIS - THREE TEAS COMPARISON');
  console.log('='.repeat(100));
  console.log();

  const teas = [
    {
      name: 'Mi Lan Xiang Dan Cong',
      originalName: '蜜兰香单枞',
      type: 'oolong',
      origin: 'Phoenix Mountain, Guangdong, China',
      caffeineLevel: 5,
      lTheanineLevel: 4.2,
      flavorProfile: ['honey', 'orchid', 'fruity', 'floral', 'roasted', 'tropical'],
      processingMethods: ['withered', 'partial-oxidation', 'medium-roast', 'strip-rolled'],
      geography: { altitude: 1200, humidity: 78, temperature: 20.8, solarRadiation: 185 },
      expectedEffects: { dominant: 'elevating', supporting: 'energizing' }
    },
    {
      name: 'Silver Needle',
      originalName: '白毫银针',
      type: 'white',
      origin: 'Fuding, Fujian Province, China',
      caffeineLevel: 2.5,
      lTheanineLevel: 7,
      flavorProfile: ['honey', 'melon', 'hay', 'delicate', 'cucumber'],
      processingMethods: ['withered', 'sun-dried', 'minimal-processing'],
      geography: { altitude: 800, humidity: 78, temperature: 18.6, solarRadiation: 177 },
      expectedEffects: { dominant: 'calming', supporting: 'restorative' }
    },
    {
      name: 'Aged Ripe Puerh',
      originalName: '熟普洱',
      type: 'puerh-shou',
      origin: 'Menghai, Yunnan, China',
      caffeineLevel: 4.5,
      lTheanineLevel: 4.5,
      flavorProfile: ['earthy', 'woody', 'sweet', 'leather', 'compost'],
      processingMethods: ['withered', 'pile-fermented', 'compressed', 'aged'],
      geography: { altitude: 1300, humidity: 75, temperature: 21.2, solarRadiation: 190 },
      expectedEffects: { dominant: 'grounding', supporting: 'comforting' }
    }
  ];

  const results = [];

  for (const tea of teas) {
    try {
      console.log('\n' + '─'.repeat(100));
      console.log(`ANALYZING: ${tea.name}`);
      console.log('─'.repeat(100));

      const result = await analyzeTea(tea);
      const { teaModel, compounds, flavor, processing, geography, effects } = result;

      results.push({
        name: tea.name,
        type: tea.type,
        expected: tea.expectedEffects,
        calculated: effects.expectedEffects,
        allScores: effects.allScores,
        reasoning: effects.reasoning,
        compounds: compounds.analysis,
        flavor: flavor.profile,
        processing: processing,
        geography: geography.climate
      });

      console.log(`\n📊 INPUT PROFILE:`);
      console.log(`   Type:              ${teaModel.type}`);
      console.log(`   Caffeine:          ${teaModel.caffeineLevel}`);
      console.log(`   L-Theanine:        ${teaModel.lTheanineLevel}`);
      console.log(`   Ratio:             ${compounds.levels.lTheanineToCaffeineRatio?.toFixed(2)}`);
      console.log(`   Flavor Categories: ${flavor.profile.categories.join(', ')}`);
      console.log(`   Processing:        ${processing.roastLevel}`);
      console.log(`   Altitude:          ${geography.climate.altitude}m, Temp: ${geography.climate.temperature}°C, Humidity: ${geography.climate.humidity}%`);

      console.log(`\n🎯 CALCULATED EFFECTS:`);
      console.log(`   Dominant:    ${effects.expectedEffects.dominant.toUpperCase()}`);
      console.log(`   Supporting:  ${effects.expectedEffects.supporting.toUpperCase()}`);

      console.log(`\n📝 REASONING:`);
      console.log(`   Dominant:    ${effects.reasoning.dominant}`);
      console.log(`   Supporting:  ${effects.reasoning.supporting}`);

      console.log(`\n📈 EFFECT SCORES:`);
      const sorted = Object.entries(effects.allScores).sort(([,a],[,b]) => b - a);
      sorted.forEach(([effect, score]) => {
        const bar = '█'.repeat(Math.round(score / 1.5));
        const marker = (effect === effects.expectedEffects.dominant || effect === effects.expectedEffects.supporting) ? ' ★' : '';
        console.log(`   ${effect.padEnd(15)} ${bar} ${score.toFixed(1)}${marker}`);
      });

      const dominantMatch = effects.expectedEffects.dominant === tea.expectedEffects.dominant;
      const supportingMatch = effects.expectedEffects.supporting === tea.expectedEffects.supporting;
      const status = (dominantMatch && supportingMatch) ? '✓ MATCH' : '⚠ DIFFERENT';
      console.log(`\n✅ Expected: ${tea.expectedEffects.dominant} + ${tea.expectedEffects.supporting} | Status: ${status}`);

    } catch (error) {
      console.error(`✗ Error analyzing ${tea.name}:`, error);
    }
  }

  // Summary
  console.log('\n\n' + '='.repeat(100));
  console.log('SUMMARY COMPARISON');
  console.log('='.repeat(100));
  console.log();

  results.forEach(r => {
    console.log(`${r.name.padEnd(30)} → ${r.calculated.dominant.padEnd(12)} + ${r.calculated.supporting}`);
  });

  console.log('\n' + '='.repeat(100));
  console.log('✓ Analysis complete!');
  console.log('='.repeat(100));
}

testAllTeas().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
