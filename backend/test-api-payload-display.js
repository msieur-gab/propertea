/**
 * test-api-payload-display.js - Display API payloads with separate matchers
 *
 * Shows how ChaQiMatcher is used as a standalone matcher, just like
 * TimeMatcher, FoodMatcher, ActivityMatcher, etc.
 */

import { EffectService } from './src/services/EffectService.js';
import ChaQiMatcher from './src/services/matchers/ChaQiMatcher.js';

const effectService = new EffectService({ useNewModel: true });

// Create a tea model for an aged Puerh
const agedPuerhData = {
  name: 'Aged Ripe Puerh (20+ years)',
  type: 'puerh',
  caffeineLevel: 5,
  lTheanineLevel: 6,
  flavor: {
    primary: [],
    intensity: 'moderate'
  },
  geography: {
    altitude: 1500,
    temperature: 16,
    humidity: 75,
    solarRadiation: 140
  },
  processing: {
    methods: [],
    oxidationLevel: 85,
    roastLevel: 'none'
  }
};

console.log('\n');
console.log('████████████████████████████████████████████████████████████████████████████████');
console.log('█ EFFECT SERVICE PAYLOAD - AGED RIPE PUERH');
console.log('████████████████████████████████████████████████████████████████████████████████\n');

try {
  const effectResult = effectService.infer(agedPuerhData);

  console.log('✅ EFFECT ANALYSIS:\n');
  console.log(JSON.stringify(effectResult, null, 2));

  // Now optionally call ChaQiMatcher as a separate matcher
  console.log('\n\n');
  console.log('████████████████████████████████████████████████████████████████████████████████');
  console.log('█ CHA QI MATCHER (Optional Matcher - Called Separately)');
  console.log('████████████████████████████████████████████████████████████████████████████████\n');

  const chaQiAssessment = ChaQiMatcher.assessChaQi(agedPuerhData, {
    expectedEffects: {
      dominant: effectResult.expectedEffects.dominant,
      supporting: effectResult.expectedEffects.supporting
    },
    allScores: effectResult.allScores
  });

  console.log('🍵 CHA QI ASSESSMENT:\n');
  console.log(JSON.stringify(chaQiAssessment, null, 2));

} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}

console.log('\n' + '████████████████████████████████████████████████████████████████████████████████\n');
