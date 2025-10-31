/**
 * Complete 5-Factor Algorithm Trace
 *
 * Shows the EXACT numerical contribution of each of the 5 factors:
 * 1. Tea Type (weight: 2.5)
 * 2. Compounds (weight: 2.0-2.8)
 * 3. Flavor (weight: 2.0)
 * 4. Processing (weight: 1.5)
 * 5. Geography (weight: 2.0)
 */

import { TeaModel } from './backend/src/models/TeaModel.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import { TeaTypeNormalizer } from './backend/src/utils/TeaTypeNormalizer.js';
import fs from 'fs';

const dataset = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_comprehensive.json', 'utf8'));

async function completeTeaTrace(tea, index) {
  console.log('\n' + '═'.repeat(100));
  console.log(`COMPLETE 5-FACTOR TRACE: ${tea.name}`);
  console.log('═'.repeat(100));

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

  console.log('\n📋 RAW INPUT:');
  console.log(`  Name: ${tea.name}`);
  console.log(`  Type: ${tea.type}`);
  console.log(`  Caffeine: ${tea.caffeineLevel}/5 | L-Theanine: ${tea.lTheanineLevel}/5`);
  console.log(`  Flavors: ${tea.flavorProfile.join(', ')}`);
  console.log(`  Processing: ${tea.processingMethods.join(', ')}`);
  console.log(`  Geography: alt=${tea.geography.altitude}m, temp=${tea.geography.temperature}°C, humidity=${tea.geography.humidity}%, solar=${tea.geography.solarRadiation}W/m²`);
  console.log(`  Expected Effects: ${tea.expectedEffects.dominant} + ${tea.expectedEffects.supporting}`);

  // Create TeaModel
  const teaModel = new TeaModel(teaData);

  // Get all service analyses
  const compoundResult = await new CompoundService().analyze(teaModel);
  const flavorResult = await new FlavorService().analyze(teaModel);
  const processingResult = await new ProcessingService().analyze(teaModel);
  const geographyResult = await new GeographyService().analyze(teaModel);
  const effectService = new EffectService();

  console.log('\n🔍 EXTRACTED PARAMETERS (from services):');
  console.log(`  Tea Type Canonical: ${TeaTypeNormalizer.normalize(teaData.type).canonical}`);
  console.log(`  Stimulation Level: ${compoundResult.analysis?.stimulationLevel}`);
  console.log(`  Relaxation Level: ${compoundResult.analysis?.relaxationLevel}`);
  console.log(`  Flavor Categories: ${flavorResult.profile?.categories?.join(', ') || 'none'}`);
  console.log(`  Processing Roast: ${processingResult.roastLevel}`);
  console.log(`  Geography Climate: altitude=${geographyResult.climate?.altitude}, temp=${geographyResult.climate?.temperature}°C, humidity=${geographyResult.climate?.humidity}%, solar=${geographyResult.climate?.solarRadiation}`);

  // Now manually calculate with FULL detail
  console.log('\n🧮 FACTOR-BY-FACTOR CALCULATION:\n');

  const scores = {};
  const CORE_EFFECTS = ['energizing', 'calming', 'focusing', 'harmonizing', 'grounding', 'elevating', 'comforting', 'restorative'];
  CORE_EFFECTS.forEach(e => scores[e] = 0);

  // FACTOR 1: TEA TYPE (weight: 2.5)
  console.log('═ FACTOR 1: TEA TYPE (weight: 2.5) ═');
  const teaType = TeaTypeNormalizer.normalize(teaData.type).canonical;
  const TEA_TYPE_EFFECTS = {
    green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 },
    white: { restorative: 8, calming: 6, comforting: 5, harmonizing: 5, focusing: 3, elevating: 4 },
    yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 },
    oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 },
    red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 },
    dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 },
    puerh: {
      sheng: { energizing: 5, focusing: 6, harmonizing: 5, grounding: 6 },
      shou: { grounding: 9, harmonizing: 5, comforting: 8, restorative: 4 }
    }
  };

  let baseEffects = {};
  if (teaType === 'puerh') {
    const pueringEffectsObj = TEA_TYPE_EFFECTS.puerh || {};
    const explicitSubType = (teaModel?.subType || '').toLowerCase().trim();
    const pueringSubtype = explicitSubType || TeaTypeNormalizer.normalize(teaData.type).subtype || 'sheng';
    baseEffects = pueringEffectsObj[pueringSubtype] || pueringEffectsObj.sheng || {};
    console.log(`Tea Type: ${teaType} (${pueringSubtype})`);
  } else {
    baseEffects = TEA_TYPE_EFFECTS[teaType] || {};
    console.log(`Tea Type: ${teaType}`);
  }

  console.log(`Base effects: ${JSON.stringify(baseEffects)}`);
  Object.entries(baseEffects).forEach(([effect, value]) => {
    const addition = value * 2.5;
    scores[effect] = (scores[effect] || 0) + addition;
    console.log(`  ${effect.padEnd(12)}: ${value} × 2.5 = ${addition.toFixed(1)}`);
  });
  console.log(`Running total: ${JSON.stringify(Object.fromEntries(Object.entries(scores).filter(([_, v]) => v > 0)))}`);

  // FACTOR 2: COMPOUNDS (weight: 2.0-2.8)
  console.log('\n═ FACTOR 2: COMPOUNDS (weight: 2.0-2.8) ═');
  const relaxationLevel = compoundResult.analysis?.relaxationLevel;
  const stimulationLevel = compoundResult.analysis?.stimulationLevel;
  console.log(`Stimulation: ${stimulationLevel} | Relaxation: ${relaxationLevel}`);

  const COMPOUND_EFFECT_MODIFIERS = {
    'Very High Caffeine': { energizing: 2, focusing: 2, grounding: -1, calming: -2 },
    'High Caffeine': { energizing: 1, focusing: 1, calming: -1 },
    'Moderate Caffeine': { energizing: 0.5, focusing: 0.5 },
    'Very High L-Theanine': { calming: 4, harmonizing: 2, restorative: 1.5, elevating: 1 },
    'High L-Theanine': { calming: 3, harmonizing: 1, restorative: 0.5, comforting: 0.5 },
    'Balanced': { harmonizing: 1, focusing: 0.5 },
    'Caffeine Dominant': { energizing: 1, focusing: 0.5, comforting: -0.5 }
  };

  let compoundModifier = {};
  let compoundWeight = 2.0; // will be 2.8 if extreme

  if (relaxationLevel === 'Very High') {
    compoundModifier = COMPOUND_EFFECT_MODIFIERS['Very High L-Theanine'];
    compoundWeight = 2.8;
    console.log(`Applied: Very High L-Theanine (weight: ${compoundWeight})`);
  } else if (relaxationLevel === 'High') {
    compoundModifier = COMPOUND_EFFECT_MODIFIERS['High L-Theanine'];
    console.log(`Applied: High L-Theanine (weight: ${compoundWeight})`);
  } else if (relaxationLevel === 'Moderate') {
    compoundModifier = COMPOUND_EFFECT_MODIFIERS['High L-Theanine'];
    console.log(`Applied: High L-Theanine (weight: ${compoundWeight})`);
  } else if (stimulationLevel === 'Very High') {
    compoundModifier = COMPOUND_EFFECT_MODIFIERS['Very High Caffeine'];
    compoundWeight = 2.8;
    console.log(`Applied: Very High Caffeine (weight: ${compoundWeight})`);
  } else if (stimulationLevel === 'High') {
    compoundModifier = COMPOUND_EFFECT_MODIFIERS['High Caffeine'];
    console.log(`Applied: High Caffeine (weight: ${compoundWeight})`);
  } else if (stimulationLevel === 'Moderate') {
    compoundModifier = COMPOUND_EFFECT_MODIFIERS['Moderate Caffeine'];
    console.log(`Applied: Moderate Caffeine (weight: ${compoundWeight})`);
  } else {
    console.log(`No compound modifier applied`);
  }

  if (Object.keys(compoundModifier).length > 0) {
    console.log(`Modifiers: ${JSON.stringify(compoundModifier)}`);
    Object.entries(compoundModifier).forEach(([effect, modifier]) => {
      const addition = modifier * compoundWeight;
      scores[effect] = (scores[effect] || 0) + addition;
      console.log(`  ${effect.padEnd(12)}: ${modifier > 0 ? '+' : ''}${modifier} × ${compoundWeight} = ${addition > 0 ? '+' : ''}${addition.toFixed(1)}`);
    });
  }
  console.log(`Running total: ${JSON.stringify(Object.fromEntries(Object.entries(scores).filter(([_, v]) => v > 0)))}`);

  // FACTOR 3: FLAVOR (weight: 2.0)
  console.log('\n═ FACTOR 3: FLAVOR (weight: 2.0) ═');
  const flavorCategories = flavorResult.profile?.categories || [];
  console.log(`Categories: ${flavorCategories.length > 0 ? flavorCategories.join(', ') : 'none'}`);

  const FLAVOR_EFFECT_MAP = {
    Floral: { elevating: 2, harmonizing: 1, comforting: 0.5, calming: 0.5 },
    Fruity: { elevating: 1, energizing: 0.5, harmonizing: 0.5 },
    Vegetal: { focusing: 1, grounding: 0.5, energizing: 0.5 },
    'Nutty/Toasty': { comforting: 1, grounding: 0.5, restorative: 0.5 },
    Spicy: { energizing: 1, focusing: 0.5 },
    Sweet: { elevating: 0.5, comforting: 1, restorative: 0.5, calming: 0.5 },
    'Earthy/Mineral': { grounding: 1.5, harmonizing: 0.5, restorative: 0.5 },
    Woody: { grounding: 1, comforting: 0.5 },
    Roasted: { comforting: 1, grounding: 0.5 },
    'Umami/Marine': { focusing: 1, energizing: 0.5, grounding: 0.5 },
    'Aged/Earthy': { grounding: 1.5, restorative: 1 }
  };

  let flavorContributions = 0;
  flavorCategories.forEach(category => {
    const flavorEffects = FLAVOR_EFFECT_MAP[category] || {};
    if (Object.keys(flavorEffects).length > 0) {
      console.log(`  ${category}: ${JSON.stringify(flavorEffects)}`);
      Object.entries(flavorEffects).forEach(([effect, modifier]) => {
        const addition = modifier * 2;
        scores[effect] = (scores[effect] || 0) + addition;
        flavorContributions++;
        console.log(`    ${effect.padEnd(12)}: ${modifier} × 2.0 = +${addition.toFixed(1)}`);
      });
    }
  });

  if (flavorContributions === 0) {
    console.log(`  (no flavor categories matched - zero contribution from FLAVOR factor)`);
  }
  console.log(`Running total: ${JSON.stringify(Object.fromEntries(Object.entries(scores).filter(([_, v]) => v > 0)))}`);

  // FACTOR 4: PROCESSING (weight: 1.5)
  console.log('\n═ FACTOR 4: PROCESSING (weight: 1.5) ═');
  const roastLevel = processingResult.roastLevel;
  console.log(`Roast Level: ${roastLevel}`);

  const ROAST_LEVEL_MODIFIERS = {
    Charcoal: { grounding: 3, comforting: 2 },
    Heavy: { grounding: 2.5, comforting: 1.5, warming: 0.5 },
    Medium: { comforting: 0.5, harmonizing: 0.5 },
    Light: { energizing: 0.5, elevating: 0.5 },
    Minimal: { elevating: 0.5, focusing: 0.5 },
    None: {}
  };

  const roastModifier = ROAST_LEVEL_MODIFIERS[roastLevel] || {};
  if (Object.keys(roastModifier).length > 0) {
    console.log(`Modifiers: ${JSON.stringify(roastModifier)}`);
    Object.entries(roastModifier).forEach(([effect, modifier]) => {
      const addition = modifier * 1.5;
      scores[effect] = (scores[effect] || 0) + addition;
      console.log(`  ${effect.padEnd(12)}: ${modifier} × 1.5 = +${addition.toFixed(1)}`);
    });
  } else {
    console.log(`  (no roast modifier for "${roastLevel}" - zero contribution from PROCESSING factor)`);
  }
  console.log(`Running total: ${JSON.stringify(Object.fromEntries(Object.entries(scores).filter(([_, v]) => v > 0)))}`);

  // FACTOR 5: GEOGRAPHY (weight: 2.0)
  console.log('\n═ FACTOR 5: GEOGRAPHY (weight: 2.0) ═');
  const climate = geographyResult.climate || {};
  const altitude = climate.altitude || 0;
  const temperature = climate.temperature || 15;
  const humidity = climate.humidity || 70;
  const solarRadiation = climate.solarRadiation || 175;

  console.log(`Geography Data: altitude=${altitude}m, temp=${temperature}°C, humidity=${humidity}%, solar=${solarRadiation}W/m²`);

  const GEOGRAPHIC_EFFECT_MODIFIERS = {
    altitude: {
      veryLow: { energizing: 0.5, comforting: 0.5 },      // < 500m
      low: { harmonizing: 0.5, focusing: 0.5 },           // 500-1000m
      medium: { elevating: 0.75, harmonizing: 0.5 },      // 1000-1500m
      high: { elevating: 1, restorative: 0.5, calming: 0.5 }  // > 1500m
    },
    temperature: {
      warm: { energizing: 0.5, comforting: 0.5 },         // > 18°C
      moderate: { harmonizing: 0.75, elevating: 0.5 },    // 15-18°C
      cool: { calming: 1, harmonizing: 0.5 },             // 12-15°C
      cold: { calming: 1, restorative: 0.5, focusing: 0.5 }  // < 12°C
    },
    humidity: {
      low: { energizing: 0.5, focusing: 0.5 },            // < 60%
      moderate: { harmonizing: 0.75, focusing: 0.5 },     // 60-75%
      high: { elevating: 0.75, harmonizing: 0.75, calming: 0.25 },  // 75-85%
      veryHigh: { calming: 1, restorative: 0.5, harmonizing: 0.5 }  // > 85%
    },
    solarRadiation: {
      low: { calming: 0.5, restorative: 0.5, focusing: 0.25 },    // < 150
      moderate: { harmonizing: 0.5, elevating: 0.5 },             // 150-200
      high: { energizing: 0.75, focusing: 0.5 },                  // > 200
      veryHigh: { energizing: 1, grounding: 0.5 }                 // > 250
    }
  };

  let geoContributions = 0;

  // Altitude
  let altitudeModifier = {};
  if (altitude < 500) {
    altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.veryLow;
    console.log(`  Altitude: <500m (very low) → ${JSON.stringify(altitudeModifier)}`);
  } else if (altitude < 1000) {
    altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.low;
    console.log(`  Altitude: 500-1000m (low) → ${JSON.stringify(altitudeModifier)}`);
  } else if (altitude < 1500) {
    altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.medium;
    console.log(`  Altitude: 1000-1500m (medium) → ${JSON.stringify(altitudeModifier)}`);
  } else {
    altitudeModifier = GEOGRAPHIC_EFFECT_MODIFIERS.altitude.high;
    console.log(`  Altitude: >1500m (high) → ${JSON.stringify(altitudeModifier)}`);
  }
  Object.entries(altitudeModifier).forEach(([effect, modifier]) => {
    const addition = modifier * 2.0;
    scores[effect] = (scores[effect] || 0) + addition;
    geoContributions++;
    console.log(`    ${effect.padEnd(12)}: ${modifier} × 2.0 = +${addition.toFixed(1)}`);
  });

  // Temperature
  let temperatureModifier = {};
  if (temperature > 18) {
    temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.warm;
    console.log(`  Temperature: >18°C (warm) → ${JSON.stringify(temperatureModifier)}`);
  } else if (temperature >= 15) {
    temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.moderate;
    console.log(`  Temperature: 15-18°C (moderate) → ${JSON.stringify(temperatureModifier)}`);
  } else if (temperature >= 12) {
    temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.cool;
    console.log(`  Temperature: 12-15°C (cool) → ${JSON.stringify(temperatureModifier)}`);
  } else {
    temperatureModifier = GEOGRAPHIC_EFFECT_MODIFIERS.temperature.cold;
    console.log(`  Temperature: <12°C (cold) → ${JSON.stringify(temperatureModifier)}`);
  }
  Object.entries(temperatureModifier).forEach(([effect, modifier]) => {
    const addition = modifier * 2.0;
    scores[effect] = (scores[effect] || 0) + addition;
    geoContributions++;
    console.log(`    ${effect.padEnd(12)}: ${modifier} × 2.0 = +${addition.toFixed(1)}`);
  });

  // Humidity
  let humidityModifier = {};
  if (humidity < 60) {
    humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.low;
    console.log(`  Humidity: <60% (low) → ${JSON.stringify(humidityModifier)}`);
  } else if (humidity <= 75) {
    humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.moderate;
    console.log(`  Humidity: 60-75% (moderate) → ${JSON.stringify(humidityModifier)}`);
  } else if (humidity <= 85) {
    humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.high;
    console.log(`  Humidity: 75-85% (high) → ${JSON.stringify(humidityModifier)}`);
  } else {
    humidityModifier = GEOGRAPHIC_EFFECT_MODIFIERS.humidity.veryHigh;
    console.log(`  Humidity: >85% (very high) → ${JSON.stringify(humidityModifier)}`);
  }
  Object.entries(humidityModifier).forEach(([effect, modifier]) => {
    const addition = modifier * 2.0;
    scores[effect] = (scores[effect] || 0) + addition;
    geoContributions++;
    console.log(`    ${effect.padEnd(12)}: ${modifier} × 2.0 = +${addition.toFixed(1)}`);
  });

  // Solar Radiation
  let radiationModifier = {};
  if (solarRadiation < 150) {
    radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.low;
    console.log(`  Solar: <150W/m² (low) → ${JSON.stringify(radiationModifier)}`);
  } else if (solarRadiation <= 200) {
    radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.moderate;
    console.log(`  Solar: 150-200W/m² (moderate) → ${JSON.stringify(radiationModifier)}`);
  } else if (solarRadiation <= 250) {
    radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.high;
    console.log(`  Solar: 200-250W/m² (high) → ${JSON.stringify(radiationModifier)}`);
  } else {
    radiationModifier = GEOGRAPHIC_EFFECT_MODIFIERS.solarRadiation.veryHigh;
    console.log(`  Solar: >250W/m² (very high) → ${JSON.stringify(radiationModifier)}`);
  }
  Object.entries(radiationModifier).forEach(([effect, modifier]) => {
    const addition = modifier * 2.0;
    scores[effect] = (scores[effect] || 0) + addition;
    geoContributions++;
    console.log(`    ${effect.padEnd(12)}: ${modifier} × 2.0 = +${addition.toFixed(1)}`);
  });

  console.log(`Total geographic contributions applied: ${geoContributions}`);
  console.log(`Running total: ${JSON.stringify(Object.fromEntries(Object.entries(scores).filter(([_, v]) => v > 0)))}`);

  // FINAL RESULTS
  console.log('\n' + '═'.repeat(100));
  console.log('FINAL SCORES (all 5 factors combined):');
  console.log('═'.repeat(100));
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  sorted.forEach(([effect, score]) => {
    const pct = (score / sorted[0][1] * 100).toFixed(0);
    console.log(`  ${effect.padEnd(12)}: ${score.toFixed(1).padStart(6)} (${pct.padStart(3)}%)`);
  });

  console.log(`\n🎯 RESULTS:`);
  console.log(`  Dominant: ${sorted[0][0]} (${sorted[0][1].toFixed(1)})`);
  console.log(`  Supporting: ${sorted[1][0]} (${sorted[1][1].toFixed(1)})`);
  console.log(`  Expected: ${tea.expectedEffects.dominant} + ${tea.expectedEffects.supporting}`);

  const matches = {
    dominant: sorted[0][0] === tea.expectedEffects.dominant,
    supporting: sorted[1][0] === tea.expectedEffects.supporting
  };

  if (matches.dominant && matches.supporting) {
    console.log(`  ✓✓ PERFECT MATCH`);
  } else if (matches.dominant || matches.supporting) {
    console.log(`  ✓ PARTIAL MATCH`);
  } else {
    console.log(`  ✗ MISMATCH`);
  }
}

async function run() {
  console.log('\n╔' + '═'.repeat(98) + '╗');
  console.log('║' + ' '.repeat(30) + 'COMPLETE 5-FACTOR ALGORITHM TRACE' + ' '.repeat(35) + '║');
  console.log('║' + ' '.repeat(20) + 'Shows how all 5 parameters combine to generate effects' + ' '.repeat(25) + '║');
  console.log('╚' + '═'.repeat(98) + '╝\n');

  // Test 3 teas: one that works well, one that fails
  const testIndices = [
    2,   // Dragon Well Green Tea - failing
    0,   // Tie Guan Yin Oolong - partial match
    4,   // Silver Needle White Tea - working
  ];

  for (const idx of testIndices) {
    if (idx < dataset.length) {
      await completeTeaTrace(dataset[idx], idx);
    }
  }

  console.log('\n' + '═'.repeat(100));
  console.log('TRACE COMPLETE - All 5 factors have been accounted for above');
  console.log('═'.repeat(100) + '\n');
}

run().catch(console.error);
