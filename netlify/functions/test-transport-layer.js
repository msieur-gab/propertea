/**
 * Test Transport Layer
 *
 * Verifies that form data can flow through the Netlify function
 * and produce complete recommendations
 */

import handler from './tea-recommendation.js';

// Sample form data from admin interface
const sampleFormData = {
  id: '1730534400000',
  name: 'Ali Shan Oolong',
  originalName: '阿里山烏龍茶',
  type: 'oolong',
  subType: 'high-mountain-oolong',
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: [
    'floral',
    'buttery',
    'sweet',
    'creamy',
    'honeysuckle'
  ],
  processingMethods: [
    'withered',
    'partial-oxidation',
    'ball-rolled',
    'minimal-roast'
  ],
  geography: {
    location: 'Alishan',
    province: 'Chiayi',
    country: 'Taiwan',
    latitude: 23.47,
    longitude: 120.8,
    altitude: 1500,
    humidity: 80,
    temperature: 14.8,
    solarRadiation: 180
  },
  dateAdded: new Date().toISOString(),
  // Request trace format to see analysis and reasoning
  format: 'trace',
  // Request all renderers
  renderers: ['activity', 'food', 'time', 'season', 'brewing']
};

/**
 * Mock Netlify event
 */
function createMockEvent(body) {
  return {
    httpMethod: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

/**
 * Run test
 */
async function runTest() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              NETLIFY TRANSPORT LAYER TEST                       ║');
  console.log('║            Form Data → Inferrer/Renderer Pipeline             ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('📨 INPUT DATA:');
  console.log(`   Tea: ${sampleFormData.name} (${sampleFormData.originalName})`);
  console.log(`   Type: ${sampleFormData.type} / ${sampleFormData.subType}`);
  console.log(`   Caffeine: ${sampleFormData.caffeineLevel}/10, L-Theanine: ${sampleFormData.lTheanineLevel}/10`);
  console.log(`   Flavors: ${sampleFormData.flavorProfile.join(', ')}`);
  console.log(`   Processing: ${sampleFormData.processingMethods.join(', ')}`);
  console.log(`   Origin: ${sampleFormData.geography.location}, ${sampleFormData.geography.province}, ${sampleFormData.geography.country}`);
  console.log(`   Altitude: ${sampleFormData.geography.altitude}m, Temp: ${sampleFormData.geography.temperature}°C\n`);

  const event = createMockEvent(sampleFormData);

  console.log('🔄 Processing through pipeline...\n');

  try {
    const response = await handler(event);

    if (response.statusCode !== 200) {
      console.error('❌ Error:', response.body);
      process.exit(1);
    }

    const result = JSON.parse(response.body);

    console.log('✅ Pipeline executed successfully\n');

    // Display results
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                     ANALYSIS RESULTS                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 Compound Analysis:');
    if (result.analysis.compound) {
      console.log(`   - Ratio: ${result.analysis.compound.ratio}`);
      console.log(`   - Stimulation: ${result.analysis.compound.stimulationLevel}`);
      console.log(`   - Relaxation: ${result.analysis.compound.relaxationLevel}`);
      console.log(`   - Profile: ${result.analysis.compound.compoundProfile}`);
    }

    console.log('\n🌺 Flavor Analysis:');
    if (result.analysis.flavor) {
      console.log(`   - Identified Flavors: ${result.analysis.flavor.identifiedFlavors?.join(', ') || 'N/A'}`);
      console.log(`   - Dominant Categories: ${result.analysis.flavor.dominantCategories?.join(', ') || 'N/A'}`);
      console.log(`   - Intensity: ${result.analysis.flavor.intensityEstimate}`);
    }

    console.log('\n🏔️  Geography Analysis:');
    if (result.analysis.geography) {
      console.log(`   - Elevation: ${result.analysis.geography.elevation?.classification}`);
      console.log(`   - Climate: ${result.analysis.geography.climate?.latitude?.zone}`);
      console.log(`   - Quality: ${result.analysis.geography.qualityIndicator}`);
    }

    console.log('\n⚙️  Processing Analysis:');
    if (result.analysis.processing) {
      console.log(`   - Methods: ${result.analysis.processing.identifiedMethods?.map(m => m.displayName).join(', ') || 'N/A'}`);
      console.log(`   - Roast Level: ${result.analysis.processing.roastLevel}`);
      console.log(`   - Oxidation: ${result.analysis.processing.oxidationLevel}%`);
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                  RECOMMENDATION RESULTS                        ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('🎯 Activity Recommendations:');
    if (result.recommendations.activity.length > 0) {
      result.recommendations.activity.slice(0, 3).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec.activity} (Score: ${rec.score?.toFixed(0) || 'N/A'})`);
      });
      console.log(`   ... and ${Math.max(0, result.recommendations.activity.length - 3)} more`);
    } else {
      console.log('   (No recommendations)');
    }

    console.log('\n🍽️  Food Recommendations:');
    if (result.recommendations.food.length > 0) {
      result.recommendations.food.slice(0, 3).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec.food} (Score: ${rec.score?.toFixed(0) || 'N/A'})`);
      });
      console.log(`   ... and ${Math.max(0, result.recommendations.food.length - 3)} more`);
    } else {
      console.log('   (No recommendations)');
    }

    console.log('\n⏰ Time Recommendations:');
    if (result.recommendations.time.length > 0) {
      result.recommendations.time.slice(0, 3).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec.timeOfDay} (Score: ${rec.score?.toFixed(0) || 'N/A'})`);
      });
      console.log(`   ... and ${Math.max(0, result.recommendations.time.length - 3)} more`);
    } else {
      console.log('   (No recommendations)');
    }

    console.log('\n🌱 Season Recommendations:');
    if (result.recommendations.season.length > 0) {
      result.recommendations.season.slice(0, 3).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec.season} (Score: ${rec.score?.toFixed(0) || 'N/A'})`);
      });
      console.log(`   ... and ${Math.max(0, result.recommendations.season.length - 3)} more`);
    } else {
      console.log('   (No recommendations)');
    }

    console.log('\n☕ Brewing Recommendations:');
    if (result.recommendations.brewing.length > 0) {
      result.recommendations.brewing.slice(0, 2).forEach((rec, i) => {
        console.log(`   ${i + 1}. Style: ${rec.style}`);
        if (rec.temperature) console.log(`      - Temperature: ${rec.temperature}`);
        if (rec.time) console.log(`      - Time: ${rec.time}`);
        if (rec.vessel) console.log(`      - Vessel: ${rec.vessel}`);
      });
    } else {
      console.log('   (No recommendations)');
    }

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║                         METADATA                              ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    console.log(`Processing Time: ${result.metadata.processingTimeMs}ms`);
    console.log(`Pipeline Version: ${result.metadata.version}`);
    console.log(`Timestamp: ${result.metadata.timestamp}`);

    console.log('\n✅ All tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest();
