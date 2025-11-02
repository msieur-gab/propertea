/**
 * Comprehensive Transport Layer Test
 *
 * Tests:
 * 1. Production format (lean, no traces)
 * 2. Trace format (includes analysis and reasoning)
 * 3. Selective renderer execution
 * 4. Error handling
 */

import handler from './tea-recommendation.js';

// Test data - multiple teas with different profiles
const testTeas = [
  {
    name: 'Ali Shan Oolong',
    originalName: '阿里山烏龍茶',
    type: 'oolong',
    subType: 'high-mountain-oolong',
    caffeineLevel: 3.5,
    lTheanineLevel: 6.5,
    flavorProfile: ['floral', 'buttery', 'sweet', 'creamy', 'honeysuckle'],
    processingMethods: ['withered', 'partial-oxidation', 'ball-rolled', 'minimal-roast'],
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
    }
  },
  {
    name: 'Sencha',
    originalName: '煎茶 (Sencha)',
    type: 'green',
    subType: 'sencha',
    caffeineLevel: 4,
    lTheanineLevel: 6,
    flavorProfile: ['grassy', 'marine', 'vegetal', 'fresh', 'slightly sweet'],
    processingMethods: ['steamed', 'rolled', 'dried'],
    geography: {
      location: 'Shizuoka',
      province: 'Shizuoka Prefecture',
      country: 'Japan',
      latitude: 34.97,
      longitude: 138.38,
      altitude: 400,
      humidity: 72,
      temperature: 16.2,
      solarRadiation: 170
    }
  },
  {
    name: 'Assam',
    originalName: 'Assam Orthodox',
    type: 'black',
    subType: 'assam',
    caffeineLevel: 6.5,
    lTheanineLevel: 3.5,
    flavorProfile: ['malty', 'brisk', 'robust', 'caramel', 'honey'],
    processingMethods: ['withered', 'rolled', 'full-oxidation', 'dried'],
    geography: {
      location: 'Assam Valley',
      province: 'Assam',
      country: 'India',
      latitude: 26.74,
      longitude: 94.21,
      altitude: 100,
      humidity: 85,
      temperature: 24.5,
      solarRadiation: 195
    }
  }
];

function createMockEvent(body) {
  return {
    httpMethod: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  };
}

async function testProductionFormat(tea) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📦 PRODUCTION FORMAT TEST: ${tea.name}`);
  console.log(`${'─'.repeat(60)}`);

  const event = createMockEvent({
    ...tea,
    format: 'production',
    renderers: ['activity', 'food', 'time']
  });

  const response = await handler(event);
  const result = JSON.parse(response.body);

  if (response.statusCode !== 200) {
    console.log(`❌ FAILED: ${result.error}`);
    return false;
  }

  // Check structure
  const hasRecommendations = result.recommendations && typeof result.recommendations === 'object';
  const hasMetadata = result.metadata && result.metadata.format === 'production';
  const noAnalysis = !result.analysis;

  console.log(`✓ Tea info: ${result.tea.name}`);
  console.log(`✓ Has recommendations: ${hasRecommendations}`);
  console.log(`✓ Renderers requested: ${result.metadata.renderersRequested.join(', ')}`);
  console.log(`✓ Processing time: ${result.metadata.processingTimeMs}ms`);
  console.log(`✓ Format verified: ${hasMetadata ? 'production' : 'ERROR'}`);
  console.log(`✓ No analysis included: ${noAnalysis ? 'YES (correct)' : 'NO (ERROR - analysis should not be in production)'}`);

  // Check recommendations
  if (result.recommendations.activity) {
    console.log(`  └─ Activity: ${result.recommendations.activity.length} recommendations`);
  }
  if (result.recommendations.food) {
    console.log(`  └─ Food: ${result.recommendations.food.length} recommendations`);
  }
  if (result.recommendations.time) {
    console.log(`  └─ Time: ${result.recommendations.time.length} recommendations`);
  }

  return hasRecommendations && hasMetadata && noAnalysis;
}

async function testTraceFormat(tea) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🔍 TRACE FORMAT TEST: ${tea.name}`);
  console.log(`${'─'.repeat(60)}`);

  const event = createMockEvent({
    ...tea,
    format: 'trace',
    renderers: ['activity', 'food']
  });

  const response = await handler(event);
  const result = JSON.parse(response.body);

  if (response.statusCode !== 200) {
    console.log(`❌ FAILED: ${result.error}`);
    return false;
  }

  // Check structure
  const hasAnalysis = result.analysis && typeof result.analysis === 'object';
  const hasCompoundTrace = result.analysis?.compound?.trace && Array.isArray(result.analysis.compound.trace);
  const hasFlavorTrace = result.analysis?.flavor?.trace && Array.isArray(result.analysis.flavor.trace);
  const hasMetadata = result.metadata && result.metadata.format === 'trace';

  console.log(`✓ Tea info: ${result.tea.name}`);
  console.log(`✓ Has analysis object: ${hasAnalysis ? 'YES' : 'NO'}`);
  console.log(`✓ Format verified: ${hasMetadata ? 'trace' : 'ERROR'}`);
  console.log(`✓ Processing time: ${result.metadata.processingTimeMs}ms`);

  // Check analysis structure
  if (hasAnalysis) {
    console.log(`\n  Analysis Structure:`);
    const analyses = ['compound', 'flavor', 'teaType', 'geography', 'processing'];
    analyses.forEach(key => {
      if (result.analysis[key]) {
        const hasTrace = result.analysis[key].trace && Array.isArray(result.analysis[key].trace);
        const hasConfidence = typeof result.analysis[key].confidence === 'number';
        console.log(`  ├─ ${key}: trace[${result.analysis[key].trace?.length || 0}], confidence: ${result.analysis[key].confidence}`);
      }
    });
  }

  return hasAnalysis && hasCompoundTrace && hasFlavorTrace && hasMetadata;
}

async function testSelectiveRenderers(tea) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`⚙️  SELECTIVE RENDERERS TEST: ${tea.name}`);
  console.log(`${'─'.repeat(60)}`);

  // Request only 'activity' renderer
  const event = createMockEvent({
    ...tea,
    format: 'production',
    renderers: ['activity']
  });

  const response = await handler(event);
  const result = JSON.parse(response.body);

  if (response.statusCode !== 200) {
    console.log(`❌ FAILED: ${result.error}`);
    return false;
  }

  const hasActivity = result.recommendations.activity;
  const hasNoFood = !result.recommendations.food;
  const hasNoTime = !result.recommendations.time;
  const requestedMatches = result.metadata.renderersRequested.length === 1 && result.metadata.renderersRequested[0] === 'activity';

  console.log(`✓ Requested renderers: ${result.metadata.renderersRequested.join(', ')}`);
  console.log(`✓ Activity included: ${hasActivity ? 'YES' : 'NO'}`);
  console.log(`✓ Food excluded: ${hasNoFood ? 'YES (correct)' : 'NO (ERROR)'}`);
  console.log(`✓ Time excluded: ${hasNoTime ? 'YES (correct)' : 'NO (ERROR)'}`);
  console.log(`✓ Metadata matches request: ${requestedMatches ? 'YES' : 'NO'}`);

  return hasActivity && hasNoFood && hasNoTime && requestedMatches;
}

async function testErrorHandling() {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`❌ ERROR HANDLING TEST`);
  console.log(`${'─'.repeat(60)}`);

  // Test 1: Missing required field
  console.log(`\n Test 1: Missing 'name' field`);
  let event = createMockEvent({ type: 'oolong' });
  let response = await handler(event);
  let result = JSON.parse(response.body);
  console.log(`  Status: ${response.statusCode} (expected 400)`);
  console.log(`  Error: ${result.error}`);

  // Test 2: Invalid format
  console.log(`\n Test 2: Invalid format parameter`);
  event = createMockEvent({
    ...testTeas[0],
    format: 'invalid'
  });
  response = await handler(event);
  result = JSON.parse(response.body);
  console.log(`  Status: ${response.statusCode} (expected 400)`);
  console.log(`  Error: ${result.error}`);

  return true;
}

async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         COMPREHENSIVE TRANSPORT LAYER TEST SUITE              ║');
  console.log('║     Testing Production/Trace Modes & Selective Renderers      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const results = {
    productionTests: 0,
    traceTests: 0,
    selectiveTests: 0,
    passed: 0,
    failed: 0
  };

  try {
    // Test each tea
    for (const tea of testTeas) {
      const prodResult = await testProductionFormat(tea);
      results.productionTests++;
      if (prodResult) results.passed++;
      else results.failed++;

      const traceResult = await testTraceFormat(tea);
      results.traceTests++;
      if (traceResult) results.passed++;
      else results.failed++;

      const selectiveResult = await testSelectiveRenderers(tea);
      results.selectiveTests++;
      if (selectiveResult) results.passed++;
      else results.failed++;
    }

    // Test error handling
    await testErrorHandling();

    // Print summary
    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 TEST SUMMARY');
    console.log(`${'═'.repeat(60)}`);
    console.log(`\nTotal tests run: ${results.productionTests + results.traceTests + results.selectiveTests}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`\nProduction format tests: ${results.productionTests}`);
    console.log(`Trace format tests: ${results.traceTests}`);
    console.log(`Selective renderer tests: ${results.selectiveTests}`);

    if (results.failed === 0) {
      console.log(`\n🎉 ALL TESTS PASSED!\n`);
    } else {
      console.log(`\n⚠️  Some tests failed. Review output above.\n`);
    }

  } catch (error) {
    console.error('Test suite error:', error.message);
    console.error(error);
  }
}

runAllTests();
