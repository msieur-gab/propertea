import { EffectService } from './backend/src/services/EffectService.js';

const effectService = new EffectService();

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

const result = effectService.infer(sencha, {});

console.log('\nSencha Scores:');
Object.entries(result.allScores)
  .sort((a, b) => b[1] - a[1])
  .forEach(([effect, score]) => {
    console.log(`  ${effect.padEnd(15)}: ${score.toFixed(2)}`);
  });

console.log(`\nDominant: ${result.expectedEffects.dominant}`);
console.log(`Supporting: ${result.expectedEffects.supporting}`);
console.log(`Expected: energizing/focusing`);
