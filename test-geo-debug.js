import { EffectService } from './backend/src/services/EffectService.js';
import NormalizationDescriptorService from './backend/src/services/NormalizationDescriptorService.js';

const effectService = new EffectService();

// Sencha from TeaDatabase - should be energizing/focusing
const sencha = {
  name: 'Sencha',
  type: 'green',
  caffeineLevel: 4,
  lTheanineLevel: 6,
  flavorProfile: ['vegetal', 'fresh', 'grassy'],
  processingMethods: ['steaming', 'rolling'],
  geography: {
    altitude: 400,
    humidity: 72,
    temperature: 16.2,
    solarRadiation: 170
  }
};

console.log('=== SENCHA DEBUG ===\n');

// Test normalization
const geoNorm = NormalizationDescriptorService.normalizeGeography(sencha.geography);
console.log('Geography Normalization:');
console.log(JSON.stringify(geoNorm, null, 2));

// Test effect calculation
const result = effectService.infer(sencha, {});
console.log('\nEffect Service Result:');
console.log(`Dominant: ${result.expectedEffects.dominant}`);
console.log(`Supporting: ${result.expectedEffects.supporting}`);
console.log(`Expected: energizing/focusing`);

console.log('\nAll Scores:');
Object.entries(result.allScores)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .forEach(([effect, score]) => {
    console.log(`  ${effect.padEnd(15)}: ${score.toFixed(2)}`);
  });

console.log('\nReasoning:');
console.log(result.reasoning);
