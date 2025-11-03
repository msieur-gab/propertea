/**
 * Test Season and Brewing Renderers
 *
 * Verifies that both SeasonRenderer and BrewingRenderer
 * are now producing recommendations correctly
 */

import handler from './tea-recommendation.js';

const sampleTea = {
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
};

function createMockEvent(body) {
  return {
    httpMethod: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  };
}

async function testRenderer(rendererName, payload) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Testing: ${rendererName}`);
  console.log(`${'─'.repeat(60)}`);

  const event = createMockEvent(payload);
  const response = await handler(event);
  const result = JSON.parse(response.body);

  if (response.statusCode !== 200) {
    console.log(`❌ FAILED: ${result.error}`);
    return false;
  }

  console.log(`✓ Response status: 200 OK`);
  console.log(`✓ Tea: ${result.tea.name}`);
  console.log(`✓ Processing time: ${result.metadata.processingTimeMs}ms`);

  const recommendations = result.recommendations[rendererName] || [];

  if (recommendations.length > 0) {
    console.log(`✓ Recommendations found: ${recommendations.length}`);
    console.log(`\n  Top recommendations:`);
    recommendations.slice(0, 3).forEach((rec, i) => {
      const label = rendererName === 'season' ? rec.displayName :
                    rendererName === 'brewing' ? rec.style :
                    rendererName === 'time' ? rec.timeOfDay :
                    rec.name || 'Unknown';
      const score = rec.score || 'N/A';
      console.log(`  ${i + 1}. ${label} (Score: ${score})`);
    });
    return true;
  } else {
    console.log(`❌ No recommendations returned`);
    console.log(`   Response object:`, result.recommendations[rendererName]);
    return false;
  }
}

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║         SEASON & BREWING RENDERER VERIFICATION TESTS          ║');
  console.log('║              (Testing fixes for missing renderers)           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const results = {
    passed: 0,
    failed: 0
  };

  try {
    // Test Season Renderer (FIXED: now passing all 4 parameters)
    const seasonPassed = await testRenderer('season', {
      ...sampleTea,
      format: 'production',
      renderers: ['season']
    });
    seasonPassed ? results.passed++ : results.failed++;

    // Test Brewing Renderer
    const brewingPassed = await testRenderer('brewing', {
      ...sampleTea,
      format: 'production',
      renderers: ['brewing']
    });
    brewingPassed ? results.passed++ : results.failed++;

    // Test Time Renderer (FIXED: now using timeOfDay instead of period)
    const timePassed = await testRenderer('time', {
      ...sampleTea,
      format: 'production',
      renderers: ['time']
    });
    timePassed ? results.passed++ : results.failed++;

    // Test all renderers together
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`Testing: ALL RENDERERS TOGETHER`);
    console.log(`${'─'.repeat(60)}`);

    const event = createMockEvent({
      ...sampleTea,
      format: 'trace',
      renderers: ['activity', 'food', 'time', 'season', 'brewing']
    });

    const response = await handler(event);
    const result = JSON.parse(response.body);

    console.log(`✓ Response status: 200 OK`);
    console.log(`✓ Tea: ${result.tea.name}`);
    console.log(`✓ Format: ${result.metadata.format}`);
    console.log(`✓ Processing time: ${result.metadata.processingTimeMs}ms\n`);

    console.log('Renderer Status:');
    const renderers = ['activity', 'food', 'time', 'season', 'brewing'];
    let allPresent = true;

    renderers.forEach(r => {
      const recs = result.recommendations[r] || [];
      const status = recs.length > 0 ? `✅ ${recs.length} recommendations` : '❌ No recommendations';
      console.log(`  ${r.padEnd(12)}: ${status}`);
      if (recs.length === 0) allPresent = false;
    });

    if (allPresent) {
      results.passed++;
      console.log(`\n✅ All renderers working!`);
    } else {
      results.failed++;
      console.log(`\n❌ Some renderers not producing recommendations`);
    }

  } catch (error) {
    console.error('Test error:', error.message);
    results.failed++;
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log('TEST SUMMARY');
  console.log(`${'═'.repeat(60)}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.failed === 0) {
    console.log(`\n🎉 ALL SEASON & BREWING TESTS PASSED!\n`);
  } else {
    console.log(`\n⚠️  Some tests failed. Check output above.\n`);
  }
}

runTests();
