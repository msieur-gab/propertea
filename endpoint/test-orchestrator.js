import { TeaModel } from './src/models/TeaModel.js';
import { TeaRecommendationAPI } from './src/api/TeaRecommendationAPI.js';

// Test data: various tea types
const testTeas = [
  {
    name: 'Dragon Well',
    type: 'green',
    origin: 'Hangzhou, China',
    compounds: { caffeine: 5, lTheanine: 8, ratio: 0.625 },
    flavor: { primary: ['grassy', 'sweet', 'vegetal'], intensity: 'light' },
    geography: { altitude: 1200, temperature: 15, harvestSeason: 'spring', origin: 'Hangzhou, China' },
    processing: { oxidationLevel: 5, roastLevel: 'light' },
    leaf: { size: 'medium', wholeness: 85 }
  },
  {
    name: 'Da Hong Pao',
    type: 'oolong',
    origin: 'Wuyi Mountains, China',
    compounds: { caffeine: 8, lTheanine: 4, ratio: 2.0 },
    flavor: { primary: ['fruity', 'floral', 'roasted'], intensity: 'medium' },
    geography: { altitude: 1500, temperature: 12, harvestSeason: 'autumn', origin: 'Wuyi Mountains, China' },
    processing: { oxidationLevel: 60, roastLevel: 'medium' },
    leaf: { size: 'large', wholeness: 90 }
  },
  {
    name: 'White Peony',
    type: 'white',
    origin: 'Fujian, China',
    compounds: { caffeine: 2, lTheanine: 6, ratio: 0.33 },
    flavor: { primary: ['sweet', 'floral', 'fruity'], intensity: 'light' },
    geography: { altitude: 1100, temperature: 16, harvestSeason: 'spring', origin: 'Fujian, China' },
    processing: { oxidationLevel: 12, roastLevel: 'none' },
    leaf: { size: 'medium', wholeness: 95 }
  }
];

console.log('\n=== Tea Recommendation API Test ===\n');

const api = new TeaRecommendationAPI();

// Test each tea
testTeas.forEach((teaData, index) => {
  console.log(`\n--- Test ${index + 1}: ${teaData.name} ---`);

  const tea = new TeaModel(teaData);
  const otherTeas = testTeas
    .filter(t => t.name !== teaData.name)
    .map(t => new TeaModel(t));

  const recommendations = api.analyze(tea, otherTeas);

  // Validate structure
  console.log('✓ Tea:', recommendations.tea.name);
  console.log('✓ Type:', recommendations.tea.type);
  console.log('✓ Timestamp:', recommendations.timestamp);
  console.log('✓ Version:', recommendations.version);

  // Check each calculator
  const recs = recommendations.recommendations;
  console.log('\nCalculator Results:');

  console.log(`  • Time:        ${recs.time.success ? '✓' : '✗'} (confidence: ${recs.time.confidence.toFixed(2)})`);
  if (recs.time.success) {
    console.log(`                Recommended: ${recs.time.data.recommendedTimes.join(', ')}`);
  }

  console.log(`  • Activity:    ${recs.activity.success ? '✓' : '✗'} (confidence: ${recs.activity.confidence.toFixed(2)})`);
  if (recs.activity.success) {
    console.log(`                Recommended: ${recs.activity.data.recommendedActivities.slice(0, 3).join(', ')}`);
  }

  console.log(`  • Season:      ${recs.season.success ? '✓' : '✗'} (confidence: ${recs.season.confidence.toFixed(2)})`);
  if (recs.season.success) {
    console.log(`                Recommended: ${recs.season.data.recommendedSeasons.join(', ')}`);
  }

  console.log(`  • Brewing:     ${recs.brewing.success ? '✓' : '✗'} (confidence: ${recs.brewing.confidence.toFixed(2)})`);
  if (recs.brewing.success) {
    console.log(`                Temp: ${recs.brewing.data.temperature}°C, Time: ${recs.brewing.data.infusionTime}min, Vessel: ${recs.brewing.data.vesselType}`);
  }

  console.log(`  • Food:        ${recs.food.success ? '✓' : '✗'} (confidence: ${recs.food.confidence.toFixed(2)})`);
  if (recs.food.success) {
    console.log(`                Recommended: ${recs.food.data.recommendedFoods.slice(0, 3).join(', ')}`);
  }

  console.log(`  • Presentation:${recs.presentation.success ? '✓' : '✗'} (confidence: ${recs.presentation.confidence.toFixed(2)})`);
  if (recs.presentation.success) {
    console.log(`                Description: ${recs.presentation.data.shortDescription}`);
  }

  console.log(`  • TeaPairing:  ${recs.teaPairing.success ? '✓' : '✗'} (confidence: ${recs.teaPairing.confidence.toFixed(2)})`);
  if (recs.teaPairing.success) {
    console.log(`                Found ${recs.teaPairing.data.count} compatible teas`);
    recs.teaPairing.data.compatibleTeas.forEach(t => {
      console.log(`                  - ${t.name} (score: ${t.score.toFixed(2)})`);
    });
  }

  // Overall status
  const allSuccess = Object.values(recs).every(r => r.success);
  const avgConfidence = Object.values(recs).reduce((sum, r) => sum + r.confidence, 0) / Object.values(recs).length;

  console.log(`\nOverall: ${allSuccess ? '✓ ALL PASS' : '✗ SOME FAILED'}`);
  console.log(`Average Confidence: ${avgConfidence.toFixed(2)}`);
});

console.log('\n=== Test Complete ===\n');
