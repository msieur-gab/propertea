/**
 * test-cha-qi-integration.js - Test ChaQiMatcher integration with EffectService
 */

import fs from 'fs';
import { EffectService } from './src/services/EffectService.js';

const validationData = JSON.parse(fs.readFileSync('./validation-dataset-17-tea.json', 'utf-8'));

const effectService = new EffectService({ useNewModel: true });

// Test with 5 teas covering different types
const testTeas = validationData.slice(0, 5);

console.log('\n');
console.log('████████████████████████████████████████████████████████████████████████████████');
console.log('█ CHA QI MATCHER INTEGRATION TEST');
console.log('████████████████████████████████████████████████████████████████████████████████\n');

function mapTeaType(teaType) {
  const mapping = {
    'green': 'green',
    'white': 'white',
    'yellow': 'yellow',
    'oolong': 'oolong',
    'puerh': 'puerh',
    'dark': 'dark',
    'red/black': 'black',
    'red': 'black'
  };
  return mapping[teaType.toLowerCase()] || 'green';
}

function mapCaffeineLevel(level) {
  const mapping = {
    'low': 2,
    'low to moderate': 3,
    'moderate': 5,
    'moderate to high': 7,
    'high': 8
  };
  return mapping[level.toLowerCase()] || 5;
}

for (const tea of testTeas) {
  const teaData = {
    name: tea.name,
    type: mapTeaType(tea.type),
    caffeineLevel: tea.characteristics?.caffeine_level ? mapCaffeineLevel(tea.characteristics.caffeine_level) : 5,
    lTheanineLevel: 5,
    flavor: {
      primary: [],
      intensity: 'moderate'
    },
    geography: {
      altitude: 1000,
      temperature: 15,
      humidity: 70,
      solarRadiation: 150
    },
    processing: {
      methods: [],
      oxidationLevel: 30,
      roastLevel: 'light'
    }
  };

  try {
    const result = effectService.infer(teaData);

    console.log(`\n📱 ${tea.name} (${tea.type})`);
    console.log('─'.repeat(80));
    console.log(`Primary Effect: ${result.expectedEffects.dominant}`);
    console.log(`Secondary Effect: ${result.expectedEffects.supporting}`);

    if (result.chaQi) {
      console.log(`\n🍵 CHA QI ASSESSMENT:`);
      console.log(`  Potential Score: ${result.chaQi.chaQiPotential}/1`);
      console.log(`  Effect Harmony: ${(result.chaQi.factors.effectHarmony * 100).toFixed(0)}%`);
      console.log(`  Effect Intensity: ${(result.chaQi.factors.effectIntensity * 100).toFixed(0)}%`);
      console.log(`  Physical Sensations: ${(result.chaQi.factors.physicalSensations * 100).toFixed(0)}%`);
      console.log(`  Emotional Resonance: ${(result.chaQi.factors.emotionalResonance * 100).toFixed(0)}%`);
      console.log(`  Accumulation Potential: ${(result.chaQi.factors.accumulationPotential * 100).toFixed(0)}%`);

      if (result.chaQi.characteristics.length > 0) {
        console.log(`\n  Characteristics:`);
        result.chaQi.characteristics.forEach(c => console.log(`    • ${c}`));
      }

      console.log(`\n  Recommended Brewing: ${result.chaQi.recommendedBrewingStyle.style}`);
      console.log(`    Temperature: ${result.chaQi.recommendedBrewingStyle.waterTemp}`);
      console.log(`    Infusions: ${result.chaQi.recommendedBrewingStyle.infusions}`);
      console.log(`    Peak Time: ${result.chaQi.estimatedPeakTime.estimate}`);
    } else {
      console.log('\n⚠️ CHA QI Assessment not returned!');
    }

  } catch (error) {
    console.log(`\n❌ ${tea.name}: ${error.message}`);
  }
}

console.log('\n' + '████████████████████████████████████████████████████████████████████████████████');
console.log('█ TEST COMPLETE');
console.log('████████████████████████████████████████████████████████████████████████████████\n');
