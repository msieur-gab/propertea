import { TeaModel } from './src/models/TeaModel.js';
import { TeaRecommendationAPI } from './src/api/TeaRecommendationAPI.js';

/**
 * Accuracy Validation Test
 * Measures how well each calculator predicts expected results
 */

// Validation dataset: Tea with known characteristics and expected recommendations
const validationDataset = [
  {
    tea: {
      name: 'Dragon Well (High Altitude)',
      type: 'green',
      origin: 'Hangzhou, China',
      compounds: { caffeine: 5, lTheanine: 8, ratio: 0.625 },
      flavor: { primary: ['grassy', 'sweet', 'vegetal'], intensity: 'light' },
      geography: { altitude: 1400, temperature: 14, harvestSeason: 'spring', origin: 'Hangzhou, China' },
      processing: { oxidationLevel: 5, roastLevel: 'light' },
      leaf: { size: 'medium', wholeness: 85 }
    },
    expected: {
      time: {
        shouldContain: ['Morning'],
        shouldNotContain: ['Evening', 'Night']
      },
      activity: {
        shouldContain: ['Work', 'Study', 'Creative'],
        shouldNotContain: ['Meditation']
      },
      season: {
        shouldContain: ['Spring', 'Summer'],
        confidence: { min: 0.85, max: 1.0 }
      },
      brewing: {
        temperatureRange: [65, 75],
        vesselType: 'cup'
      },
      food: {
        shouldContain: ['Pastries', 'Light', 'Fruit'],
        shouldNotContain: ['Chocolate', 'Rich']
      },
      presentation: {
        shouldInclude: 'high-altitude'
      }
    }
  },
  {
    tea: {
      name: 'Da Hong Pao (Dark Roasted)',
      type: 'oolong',
      origin: 'Wuyi Mountains, China',
      compounds: { caffeine: 9, lTheanine: 3, ratio: 3.0 },
      flavor: { primary: ['roasted', 'chocolate', 'fruity'], intensity: 'bold' },
      geography: { altitude: 1500, temperature: 12, harvestSeason: 'autumn', origin: 'Wuyi Mountains, China' },
      processing: { oxidationLevel: 70, roastLevel: 'dark' },
      leaf: { size: 'large', wholeness: 90 }
    },
    expected: {
      time: {
        shouldContain: ['Morning', 'Afternoon'],
        shouldNotContain: ['Evening']
      },
      activity: {
        shouldContain: ['High-Focus', 'Work', 'Exercise'],
        shouldNotContain: ['Meditation', 'Yoga']
      },
      season: {
        shouldContain: ['Autumn', 'Winter'],
        confidence: { min: 0.9, max: 1.0 }
      },
      brewing: {
        temperatureRange: [90, 100],
        vesselType: 'gaiwan',
        infusions: { min: 6, max: 8 }
      },
      food: {
        shouldContain: ['Chocolate', 'Nuts'],
        shouldNotContain: ['Light', 'Pastries']
      }
    }
  },
  {
    tea: {
      name: 'White Peony (Low Caffeine)',
      type: 'white',
      origin: 'Fujian, China',
      compounds: { caffeine: 2, lTheanine: 6, ratio: 0.33 },
      flavor: { primary: ['sweet', 'floral', 'fruity'], intensity: 'delicate' },
      geography: { altitude: 1100, temperature: 16, harvestSeason: 'spring', origin: 'Fujian, China' },
      processing: { oxidationLevel: 12, roastLevel: 'none' },
      leaf: { size: 'medium', wholeness: 95 }
    },
    expected: {
      time: {
        shouldContain: ['Afternoon', 'Evening'],
        shouldNotContain: ['Morning']
      },
      activity: {
        shouldContain: ['Meditation', 'Yoga', 'Contemplation'],
        shouldNotContain: ['Exercise', 'High-Focus']
      },
      season: {
        shouldContain: ['Spring'],
        confidence: { min: 0.9, max: 1.0 }
      },
      brewing: {
        temperatureRange: [60, 70],
        vesselType: 'cup',
        infusions: { min: 3, max: 5 }
      },
      food: {
        shouldContain: ['Pastries', 'Light', 'Desserts'],
        shouldNotContain: ['Chocolate', 'Nuts']
      }
    }
  },
  {
    tea: {
      name: 'High Caffeine Black Tea',
      type: 'black',
      origin: 'Assam, India',
      compounds: { caffeine: 10, lTheanine: 5, ratio: 2.0 },
      flavor: { primary: ['malty', 'woody', 'bold'], intensity: 'strong' },
      geography: { altitude: 500, temperature: 25, harvestSeason: 'spring', origin: 'Assam, India' },
      processing: { oxidationLevel: 95, roastLevel: 'dark' },
      leaf: { size: 'small', wholeness: 60 }
    },
    expected: {
      time: {
        shouldContain: ['Morning'],
        shouldNotContain: ['Evening']
      },
      activity: {
        shouldContain: ['High-Focus', 'Exercise'],
        shouldNotContain: ['Meditation']
      },
      brewing: {
        temperatureRange: [90, 100],
        infusions: { min: 4, max: 6 }
      },
      food: {
        shouldContain: ['Chocolate', 'Nuts']
      }
    }
  }
];

// Validation functions
function validateArrayInclusion(actual, expected) {
  if (!actual || !Array.isArray(actual)) return false;
  return expected.some(item =>
    actual.some(a =>
      typeof a === 'string' ? a.includes(item) : false
    )
  );
}

function validateArrayExclusion(actual, expected) {
  if (!actual || !Array.isArray(actual)) return true;
  return !expected.some(item =>
    actual.some(a =>
      typeof a === 'string' ? a.includes(item) : false
    )
  );
}

function validateRange(actual, min, max) {
  return actual >= min && actual <= max;
}

function validateConfidenceRange(actual, expected) {
  return actual >= expected.min && actual <= expected.max;
}

// Run validation
console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║        TEA RECOMMENDATION ACCURACY VALIDATION TEST              ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const api = new TeaRecommendationAPI();
let totalTests = 0;
let totalPasses = 0;
let calculatorScores = {
  time: { pass: 0, total: 0 },
  activity: { pass: 0, total: 0 },
  season: { pass: 0, total: 0 },
  brewing: { pass: 0, total: 0 },
  food: { pass: 0, total: 0 },
  presentation: { pass: 0, total: 0 },
  teaPairing: { pass: 0, total: 0 }
};

validationDataset.forEach((dataset, datasetIdx) => {
  const teaData = dataset.tea;
  const expected = dataset.expected;

  const tea = new TeaModel(teaData);
  const recommendations = api.analyze(tea,
    validationDataset
      .filter(d => d.tea.name !== teaData.name)
      .map(d => new TeaModel(d.tea))
  );

  const recs = recommendations.recommendations;

  console.log(`\n${'═'.repeat(65)}`);
  console.log(`TEST ${datasetIdx + 1}: ${teaData.name}`);
  console.log(`${'═'.repeat(65)}`);
  console.log(`Type: ${teaData.type} | Caffeine: ${teaData.compounds.caffeine}mg | Ratio: ${teaData.compounds.ratio.toFixed(2)}\n`);

  // TIME CALCULATOR TEST
  if (expected.time) {
    let timePass = true;
    let timeDetails = [];

    calculatorScores.time.total++;
    totalTests++;

    const times = recs.time.data.recommendedTimes;

    if (expected.time.shouldContain) {
      const hasExpected = validateArrayInclusion(times, expected.time.shouldContain);
      timePass = timePass && hasExpected;
      timeDetails.push(`✓ Contains expected times (${times.join(', ')})` ||
                       `✗ Missing expected times: ${expected.time.shouldContain.join(', ')}`);
    }

    if (expected.time.shouldNotContain) {
      const noUnwanted = validateArrayExclusion(times, expected.time.shouldNotContain);
      timePass = timePass && noUnwanted;
      if (!noUnwanted) {
        timeDetails.push(`✗ Contains unwanted times: ${expected.time.shouldNotContain.join(', ')}`);
      } else {
        timeDetails.push(`✓ Excludes unwanted times`);
      }
    }

    if (timePass) calculatorScores.time.pass++;
    console.log(`${timePass ? '✅' : '❌'} TIME CALCULATOR (confidence: ${recs.time.confidence.toFixed(2)})`);
    timeDetails.forEach(d => console.log(`   ${d}`));
  }

  // ACTIVITY CALCULATOR TEST
  if (expected.activity) {
    let activityPass = true;
    let activityDetails = [];

    calculatorScores.activity.total++;
    totalTests++;

    const activities = recs.activity.data.recommendedActivities;

    if (expected.activity.shouldContain) {
      const hasExpected = validateArrayInclusion(activities, expected.activity.shouldContain);
      activityPass = activityPass && hasExpected;
      if (hasExpected) {
        activityDetails.push(`✓ Contains expected activities`);
      } else {
        activityDetails.push(`✗ Missing: ${expected.activity.shouldContain.join(', ')}`);
      }
    }

    if (expected.activity.shouldNotContain) {
      const noUnwanted = validateArrayExclusion(activities, expected.activity.shouldNotContain);
      activityPass = activityPass && noUnwanted;
      if (!noUnwanted) {
        activityDetails.push(`✗ Contains: ${expected.activity.shouldNotContain.join(', ')}`);
      } else {
        activityDetails.push(`✓ Excludes unwanted activities`);
      }
    }

    if (activityPass) calculatorScores.activity.pass++;
    console.log(`${activityPass ? '✅' : '❌'} ACTIVITY CALCULATOR (confidence: ${recs.activity.confidence.toFixed(2)})`);
    activityDetails.forEach(d => console.log(`   ${d}`));
  }

  // SEASON CALCULATOR TEST
  if (expected.season) {
    let seasonPass = true;
    let seasonDetails = [];

    calculatorScores.season.total++;
    totalTests++;

    const seasons = recs.season.data.recommendedSeasons;

    if (expected.season.shouldContain) {
      const hasExpected = validateArrayInclusion(seasons, expected.season.shouldContain);
      seasonPass = seasonPass && hasExpected;
      if (hasExpected) {
        seasonDetails.push(`✓ Contains expected seasons (${seasons.join(', ')})`);
      } else {
        seasonDetails.push(`✗ Missing: ${expected.season.shouldContain.join(', ')}`);
      }
    }

    if (expected.season.confidence) {
      const confPass = validateConfidenceRange(recs.season.confidence, expected.season.confidence);
      seasonPass = seasonPass && confPass;
      if (confPass) {
        seasonDetails.push(`✓ Confidence in range [${expected.season.confidence.min}, ${expected.season.confidence.max}]`);
      } else {
        seasonDetails.push(`✗ Confidence out of range: ${recs.season.confidence.toFixed(2)}`);
      }
    }

    if (seasonPass) calculatorScores.season.pass++;
    console.log(`${seasonPass ? '✅' : '❌'} SEASON CALCULATOR (confidence: ${recs.season.confidence.toFixed(2)})`);
    seasonDetails.forEach(d => console.log(`   ${d}`));
  }

  // BREWING CALCULATOR TEST
  if (expected.brewing) {
    let brewingPass = true;
    let brewingDetails = [];

    calculatorScores.brewing.total++;
    totalTests++;

    const brewing = recs.brewing.data;

    if (expected.brewing.temperatureRange) {
      const tempPass = validateRange(brewing.temperature,
        expected.brewing.temperatureRange[0],
        expected.brewing.temperatureRange[1]);
      brewingPass = brewingPass && tempPass;
      if (tempPass) {
        brewingDetails.push(`✓ Temperature ${brewing.temperature}°C in range [${expected.brewing.temperatureRange[0]}, ${expected.brewing.temperatureRange[1]}]`);
      } else {
        brewingDetails.push(`✗ Temperature ${brewing.temperature}°C out of range`);
      }
    }

    if (expected.brewing.vesselType) {
      const vesselPass = brewing.vesselType === expected.brewing.vesselType;
      brewingPass = brewingPass && vesselPass;
      if (vesselPass) {
        brewingDetails.push(`✓ Vessel type: ${brewing.vesselType}`);
      } else {
        brewingDetails.push(`✗ Expected vessel: ${expected.brewing.vesselType}, got: ${brewing.vesselType}`);
      }
    }

    if (expected.brewing.infusions) {
      const infusionsPass = validateRange(brewing.numberOfInfusions,
        expected.brewing.infusions.min,
        expected.brewing.infusions.max);
      brewingPass = brewingPass && infusionsPass;
      if (infusionsPass) {
        brewingDetails.push(`✓ Infusions ${brewing.numberOfInfusions} in range [${expected.brewing.infusions.min}, ${expected.brewing.infusions.max}]`);
      }
    }

    if (brewingPass) calculatorScores.brewing.pass++;
    console.log(`${brewingPass ? '✅' : '❌'} BREWING CALCULATOR (confidence: ${recs.brewing.confidence.toFixed(2)})`);
    brewingDetails.forEach(d => console.log(`   ${d}`));
  }

  // FOOD PAIRING CALCULATOR TEST
  if (expected.food) {
    let foodPass = true;
    let foodDetails = [];

    calculatorScores.food.total++;
    totalTests++;

    const foods = recs.food.data.recommendedFoods;

    if (expected.food.shouldContain) {
      const hasExpected = validateArrayInclusion(foods, expected.food.shouldContain);
      foodPass = foodPass && hasExpected;
      if (hasExpected) {
        foodDetails.push(`✓ Contains expected foods`);
      } else {
        foodDetails.push(`✗ Missing: ${expected.food.shouldContain.join(', ')}`);
      }
    }

    if (expected.food.shouldNotContain) {
      const noUnwanted = validateArrayExclusion(foods, expected.food.shouldNotContain);
      foodPass = foodPass && noUnwanted;
      if (!noUnwanted) {
        foodDetails.push(`✗ Contains unwanted: ${expected.food.shouldNotContain.join(', ')}`);
      } else {
        foodDetails.push(`✓ Excludes unwanted foods`);
      }
    }

    if (foodPass) calculatorScores.food.pass++;
    console.log(`${foodPass ? '✅' : '❌'} FOOD PAIRING CALCULATOR (confidence: ${recs.food.confidence.toFixed(2)})`);
    foodDetails.forEach(d => console.log(`   ${d}`));
  }

  // PRESENTATION CALCULATOR TEST
  if (expected.presentation) {
    let presentationPass = true;
    let presentationDetails = [];

    calculatorScores.presentation.total++;
    totalTests++;

    const description = recs.presentation.data.description.toLowerCase();

    if (expected.presentation.shouldInclude) {
      const hasExpected = description.includes(expected.presentation.shouldInclude.toLowerCase());
      presentationPass = presentationPass && hasExpected;
      if (hasExpected) {
        presentationDetails.push(`✓ Includes: "${expected.presentation.shouldInclude}"`);
      } else {
        presentationDetails.push(`✗ Missing: "${expected.presentation.shouldInclude}"`);
      }
    }

    if (presentationPass) calculatorScores.presentation.pass++;
    console.log(`${presentationPass ? '✅' : '❌'} PRESENTATION CALCULATOR (confidence: ${recs.presentation.confidence.toFixed(2)})`);
    presentationDetails.forEach(d => console.log(`   ${d}`));
  }

  // TEA PAIRING CALCULATOR TEST
  if (recs.teaPairing.success) {
    calculatorScores.teaPairing.total++;
    totalTests++;

    const hasCompatible = recs.teaPairing.data.count > 0;
    if (hasCompatible) calculatorScores.teaPairing.pass++;

    console.log(`${hasCompatible ? '✅' : '❌'} TEA PAIRING CALCULATOR (confidence: ${recs.teaPairing.confidence.toFixed(2)})`);
    console.log(`   Found ${recs.teaPairing.data.count} compatible teas`);
  }

  totalPasses += Object.values(calculatorScores).reduce((sum, obj) => sum + (obj.pass || 0), 0);
});

// Summary
console.log(`\n${'═'.repeat(65)}`);
console.log('OVERALL ACCURACY SUMMARY');
console.log(`${'═'.repeat(65)}\n`);

Object.entries(calculatorScores).forEach(([name, scores]) => {
  const accuracy = scores.total > 0 ? ((scores.pass / scores.total) * 100).toFixed(1) : 'N/A';
  const bar = '█'.repeat(Math.floor(scores.pass / scores.total * 20)) +
              '░'.repeat(20 - Math.floor(scores.pass / scores.total * 20));
  console.log(`${name.padEnd(18)} ${bar} ${accuracy}% (${scores.pass}/${scores.total})`);
});

const overallAccuracy = totalTests > 0 ? ((totalPasses / totalTests) * 100).toFixed(1) : 'N/A';
console.log(`\n${'─'.repeat(65)}`);
console.log(`OVERALL SYSTEM ACCURACY: ${overallAccuracy}% (${totalPasses}/${totalTests} tests passed)`);
console.log(`${'═'.repeat(65)}\n`);
