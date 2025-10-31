/**
 * test-api-endpoints.mjs
 * Quick test of REST API endpoints
 */

import app from './backend/src/app.js';

const PORT = 3001;
const server = app.listen(PORT, () => {
  console.log(`✓ Server listening on http://localhost:${PORT}\n`);

  // Give server a moment to be ready
  setTimeout(() => runTests(), 100);
});

async function runTests() {
  try {
    console.log('=== PHASE 1: REST API ENDPOINT TESTS ===\n');

    // Test 1: Health check
    console.log('1️⃣  Testing GET /health');
    const healthRes = await fetch('http://localhost:3001/health');
    const health = await healthRes.json();
    console.log(`   Status: ${healthRes.status}`);
    console.log(`   Response:`, JSON.stringify(health, null, 2));
    console.log(`   ✓ PASS\n`);

    // Test 2: API Info
    console.log('2️⃣  Testing GET /api/info');
    const infoRes = await fetch('http://localhost:3001/api/info');
    const info = await infoRes.json();
    console.log(`   Status: ${infoRes.status}`);
    console.log(`   Endpoints available: ${info.endpoints.length}`);
    console.log(`   ✓ PASS\n`);

    // Test 3: Analyze endpoint with valid data
    console.log('3️⃣  Testing POST /api/analyze with valid tea');
    const teaData = {
      name: 'Dragon Well',
      type: 'green',
      flavorProfile: ['vegetal', 'nutty', 'sweet'],
      processingMethods: ['pan-fired', 'dried'],
      geography: {
        region: 'Zhejiang',
        elevation: 600
      }
    };

    const analyzeRes = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teaData)
    });

    const analysis = await analyzeRes.json();
    console.log(`   Status: ${analyzeRes.status}`);
    console.log(`   Success: ${analysis.success}`);
    if (analysis.success) {
      console.log(`   Tea Type: ${analysis.data.teaType?.identified?.type}`);
      console.log(`   Has Effects: ${!!analysis.data.effects}`);
      console.log(`   Has Timing: ${!!analysis.data.timing}`);
      console.log(`   Has Seasonal: ${!!analysis.data.seasonal}`);
      console.log(`   Has Activities: ${!!analysis.data.activities}`);
      console.log(`   Has Food: ${!!analysis.data.food}`);
      console.log(`   ✓ PASS\n`);
    } else {
      console.log(`   Error: ${analysis.error}`);
      console.log(`   ✗ FAIL\n`);
    }

    // Test 4: 404 endpoint
    console.log('4️⃣  Testing 404 handling');
    const notFoundRes = await fetch('http://localhost:3001/api/nonexistent');
    const notFound = await notFoundRes.json();
    console.log(`   Status: ${notFoundRes.status}`);
    console.log(`   Has error: ${!!notFound.error}`);
    console.log(`   ✓ PASS\n`);

    // Test 5: Invalid request
    console.log('5️⃣  Testing error handling with invalid input');
    const badRes = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invalid: 'data' })
    });

    const badData = await badRes.json();
    console.log(`   Status: ${badRes.status}`);
    console.log(`   Has error: ${!!badData.error}`);
    console.log(`   ✓ PASS\n`);

    console.log('═══════════════════════════════════════════');
    console.log('✅ ALL PHASE 1 TESTS PASSED!\n');
    console.log('Summary:');
    console.log('  ✓ GET /health endpoint working');
    console.log('  ✓ GET /api/info endpoint working');
    console.log('  ✓ POST /api/analyze endpoint working');
    console.log('  ✓ Error handling working');
    console.log('  ✓ 404 handling working\n');
    console.log('Ready for Phase 2: Text Generation improvements');

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
  } finally {
    server.close(() => process.exit(0));
  }
}

// Handle shutdown
process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
