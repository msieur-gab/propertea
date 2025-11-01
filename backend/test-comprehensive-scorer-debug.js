import fs from 'fs';
import { ComprehensiveEffectScorer } from './src/models/ComprehensiveEffectScorer.js';

// Load validation data
const validationData = JSON.parse(fs.readFileSync('./tea_data_26.json', 'utf-8'));

// Test with first 3 teas
const teaIndicesToTest = [0, 1, 2];

console.log('\n' + '='.repeat(80));
console.log('COMPREHENSIVE SCORER DEBUG - EFFECT SCORING BREAKDOWN');
console.log('='.repeat(80) + '\n');

for (const idx of teaIndicesToTest) {
  const validation = validationData[idx];

  // Normalize caffeine/theanine data
  const normalizeCaffeine = (level) => level > 10 ? Math.round(level / 10) : level;
  const normalizeTheanine = (level) => level > 10 ? Math.round(level / 10) : level;

  // Convert validation data to API format
  const teaData = {
    name: validation.name,
    type: validation.type.toLowerCase(),
    caffeineLevel: normalizeCaffeine(validation.caffeineLevel),
    lTheanineLevel: normalizeTheanine(validation.lTheanineLevel),
    flavor: {
      primary: validation.flavorProfile || [],
      secondary: [],
      intensity: 'moderate'
    },
    geography: {
      ...validation.geography,
      temperature: 15,
      humidity: 70,
      solarRadiation: 150
    },
    processing: {
      methods: validation.processingMethods || [],
      oxidationLevel: 30,
      roastLevel: 'light'
    }
  };

  console.log(`\n📊 ${validation.name} (${validation.type})`);
  console.log(`Expected: ${validation.expectedEffects.dominant} / ${validation.expectedEffects.supporting}`);
  console.log(`Caffeine: ${teaData.caffeineLevel}, L-Theanine: ${teaData.lTheanineLevel}`);
  console.log(`Flavor: ${teaData.flavor.primary.join(', ')}`);
  console.log(`Processing: ${teaData.processing.methods.join(', ')}`);

  try {
    const result = ComprehensiveEffectScorer.calculateEffects(teaData);

    console.log(`\nResult:`);
    console.log(`  Dominant: ${result.dominant}`);
    console.log(`  Supporting: ${result.supporting}`);
    console.log(`  Tertiary: ${result.tertiary}`);

    console.log(`\nAll Effect Scores (sorted):`);
    Object.entries(result.allScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([effect, score]) => {
        console.log(`  ${effect}: ${score.toFixed(2)}`);
      });

    console.log(`\nTotal points: ${result.details.totalEffectPoints.toFixed(2)}`);
    console.log(`Top effects count: ${result.details.topEffectsCount}`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

  console.log('-'.repeat(80));
}
