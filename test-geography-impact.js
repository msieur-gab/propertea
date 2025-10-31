/**
 * Test impact of increased geography weight (2.0x instead of 1.2x)
 * Compares three teas to show how terroir influences effects
 */

import { TeaModel } from './backend/src/models/TeaModel.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';

const teas = [
  {
    name: 'Ali Shan Oolong',
    type: 'oolong',
    caffeineLevel: 3.5,
    lTheanineLevel: 6.5,
    flavorProfile: ['floral', 'buttery', 'sweet', 'creamy', 'honeysuckle'],
    processingMethods: ['withered', 'partial-oxidation', 'ball-rolled', 'minimal-roast'],
    geography: { altitude: 1500, humidity: 80, temperature: 14.8, solarRadiation: 180 }
  },
  {
    name: 'Mi Lan Xiang Dan Cong',
    type: 'oolong',
    caffeineLevel: 5,
    lTheanineLevel: 4.2,
    flavorProfile: ['honey', 'orchid', 'fruity', 'floral', 'roasted', 'tropical'],
    processingMethods: ['withered', 'partial-oxidation', 'medium-roast', 'strip-rolled'],
    geography: { altitude: 1200, humidity: 78, temperature: 20.8, solarRadiation: 185 }
  },
  {
    name: 'Silver Needle',
    type: 'white',
    caffeineLevel: 2.5,
    lTheanineLevel: 7,
    flavorProfile: ['honey', 'melon', 'hay', 'delicate', 'cucumber'],
    processingMethods: ['withered', 'sun-dried', 'minimal-processing'],
    geography: { altitude: 800, humidity: 78, temperature: 18.6, solarRadiation: 177 }
  },
  {
    name: 'Aged Ripe Puerh',
    type: 'puerh-shou',
    caffeineLevel: 4.5,
    lTheanineLevel: 4.5,
    flavorProfile: ['earthy', 'woody', 'sweet', 'leather', 'compost'],
    processingMethods: ['withered', 'pile-fermented', 'compressed', 'aged'],
    geography: { altitude: 1300, humidity: 75, temperature: 21.2, solarRadiation: 190 }
  }
];

async function analyzeTea(teaData) {
  const teaModel = new TeaModel(teaData);
  const teaType = await new TeaTypeService().analyze(teaModel);
  const compounds = await new CompoundService().analyze(teaModel);
  const flavor = await new FlavorService().analyze(teaModel);
  const processing = await new ProcessingService().analyze(teaModel);
  const geography = await new GeographyService().analyze(teaModel);

  const coreAnalysis = { teaType, compounds, flavor, processing, geography, _sourceTea: teaModel };
  const effects = await new EffectService().analyze(teaModel, coreAnalysis);

  return { effects, compounds, geography, flavor, processing };
}

async function testAllTeas() {
  console.log('='.repeat(110));
  console.log('TEA EFFECTS ANALYSIS WITH GEOGRAPHY WEIGHT 2.0x (TERROIR-FIRST APPROACH)');
  console.log('='.repeat(110));
  console.log();

  for (const teaData of teas) {
    try {
      console.log('\n' + '─'.repeat(110));
      console.log(`TEA: ${teaData.name}`);
      console.log('─'.repeat(110));

      const result = await analyzeTea(teaData);
      const { effects, compounds, geography, flavor, processing } = result;

      // Input profile
      console.log('\n📊 PROFILE:');
      console.log(`   Type:        ${teaData.type}`);
      console.log(`   Caffeine:    ${teaData.caffeineLevel} | L-Theanine: ${teaData.lTheanineLevel} | Ratio: ${compounds.levels.lTheanineToCaffeineRatio?.toFixed(2)}`);
      console.log(`   Altitude:    ${geography.climate.altitude}m | Temp: ${geography.climate.temperature}°C | Humidity: ${geography.climate.humidity}% | Radiation: ${geography.climate.solarRadiation}W/m²`);
      console.log(`   Flavors:     ${flavor.profile.categories.join(', ')}`);
      console.log(`   Processing:  ${processing.roastLevel}`);

      // Results
      console.log('\n🎯 CALCULATED EFFECTS (with Geography 2.0x weight):');
      console.log(`   Dominant:    ${effects.expectedEffects.dominant.toUpperCase()}`);
      console.log(`   Supporting:  ${effects.expectedEffects.supporting.toUpperCase()}`);

      console.log('\n💡 REASONING:');
      console.log(`   Dominant:    ${effects.reasoning.dominant}`);
      console.log(`   Supporting:  ${effects.reasoning.supporting}`);

      // All scores
      console.log('\n📈 ALL EFFECT SCORES:');
      const sorted = Object.entries(effects.allScores).sort(([,a],[,b]) => b - a);
      sorted.forEach(([effect, score]) => {
        const bar = '█'.repeat(Math.round(score / 1.5));
        const marker = (effect === effects.expectedEffects.dominant) ? ' ★ DOMINANT' :
                      (effect === effects.expectedEffects.supporting) ? ' ◆ SUPPORTING' : '';
        console.log(`   ${effect.padEnd(15)} ${bar} ${score.toFixed(1)}${marker}`);
      });

    } catch (error) {
      console.error(`✗ Error analyzing ${teaData.name}:`, error.message);
    }
  }

  // Summary table
  console.log('\n\n' + '='.repeat(110));
  console.log('SUMMARY - GEOGRAPHY 2.0x IMPACT');
  console.log('='.repeat(110));
  console.log();

  const results = [];
  for (const teaData of teas) {
    try {
      const result = await analyzeTea(teaData);
      results.push({
        name: teaData.name,
        type: teaData.type,
        dominant: result.effects.expectedEffects.dominant,
        supporting: result.effects.expectedEffects.supporting,
        altitude: teaData.geography.altitude,
        temperature: teaData.geography.temperature,
        humidity: teaData.geography.humidity,
        dominantScore: result.effects.allScores[result.effects.expectedEffects.dominant].toFixed(1),
        supportingScore: result.effects.allScores[result.effects.expectedEffects.supporting].toFixed(1)
      });
    } catch (e) {
      // skip
    }
  }

  console.log(`${'Tea'.padEnd(30)} ${'Dominant'.padEnd(15)} ${'Score'.padEnd(8)} ${'Supporting'.padEnd(15)} ${'Score'.padEnd(8)} ${'Alt(m)'.padEnd(8)} ${'Temp(°C)'.padEnd(8)} ${'Humidity%'}`);
  console.log('─'.repeat(110));

  results.forEach(r => {
    console.log(
      r.name.padEnd(30) +
      r.dominant.padEnd(15) +
      r.dominantScore.padEnd(8) +
      r.supporting.padEnd(15) +
      r.supportingScore.padEnd(8) +
      String(r.altitude).padEnd(8) +
      String(r.temperature).padEnd(8) +
      String(r.humidity)
    );
  });

  console.log('\n' + '='.repeat(110));
  console.log('✓ Analysis complete with geography weight 2.0x!');
  console.log('='.repeat(110));
}

testAllTeas().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
