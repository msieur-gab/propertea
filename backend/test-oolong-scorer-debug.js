import fs from 'fs';
import { ComprehensiveEffectScorer } from './src/models/ComprehensiveEffectScorer.js';

// Load validation data
const validationData = JSON.parse(fs.readFileSync('./tea_data_26.json', 'utf-8'));

// Test with oolong teas (16-20)
const teaIndicesToTest = [15, 16, 17]; // Tie Guan Yin, Da Hong Pao, Rougui

console.log('\n' + '='.repeat(80));
console.log('COMPREHENSIVE SCORER DEBUG - OOLONG TEA SCORING');
console.log('='.repeat(80) + '\n');

for (const idx of teaIndicesToTest) {
  const validation = validationData[idx];

  // Normalize caffeine/theanine data
  const normalizeCaffeine = (level) => level > 10 ? Math.round(level / 10) : level;
  const normalizeTheanine = (level) => level > 10 ? Math.round(level / 10) : level;

  // Helper function to derive roast level
  const deriveRoastLevel = (methods) => {
    if (!methods) return 'light';
    const methodsLower = methods.map(m => m.toLowerCase());
    if (methodsLower.includes('charcoal roasting')) return 'charcoal';
    if (methodsLower.includes('heavy roasting')) return 'heavy';
    if (methodsLower.includes('roasting') || methodsLower.includes('roasted')) return 'medium';
    if (methodsLower.includes('baking')) return 'light';
    if (methodsLower.includes('drying')) return 'none';
    return 'light';
  };

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
      roastLevel: deriveRoastLevel(validation.processingMethods)
    }
  };

  console.log(`\n📊 ${validation.name} (${validation.type})`);
  console.log(`Expected: ${validation.expectedEffects.dominant} / ${validation.expectedEffects.supporting}`);
  console.log(`Flavor: ${teaData.flavor.primary.join(', ')}`);

  try {
    const result = ComprehensiveEffectScorer.calculateEffects(teaData);

    console.log(`\nResult: ${result.dominant} / ${result.supporting}`);

    console.log(`\nTop 6 Effect Scores (sorted):`);
    Object.entries(result.allScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .forEach(([effect, score]) => {
        console.log(`  ${effect.padEnd(20)}: ${score.toFixed(2)}`);
      });

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }

  console.log('-'.repeat(80));
}
