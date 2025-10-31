#!/usr/bin/env node

/**
 * Test API against tea_data_26.json validation dataset
 * Compares expected effects with API predictions
 */

import fs from 'fs';
import http from 'http';

// Load validation data
const teaDataPath = '/home/msieur-gab/propertea/tea_data_26.json';
const teaData = JSON.parse(fs.readFileSync(teaDataPath, 'utf-8'));

const API_URL = 'http://localhost:3000/api/analyze';

/**
 * Call API with tea data
 * Normalize caffeine/theanine from 0-100 scale to 0-10 scale
 */
async function callAPI(tea) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: tea.name,
      type: tea.type,
      subType: tea.subType,
      caffeineLevel: tea.caffeineLevel / 10,  // Normalize from 0-100 to 0-10
      lTheanineLevel: tea.lTheanineLevel / 10,  // Normalize from 0-100 to 0-10
      flavorProfile: tea.flavorProfile,
      processingMethods: tea.processingMethods,
      geography: {
        country: tea.geography.region || tea.geography.province,
        province: tea.geography.province,
        altitude: tea.geography.elevation
      }
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Normalize effect names for comparison
 */
function normalizeEffect(effect) {
  if (!effect) return null;
  return effect.toLowerCase().trim();
}

/**
 * Compare expected vs actual effects
 */
function compareEffects(expected, actual) {
  const normExpectedDom = normalizeEffect(expected.dominant);
  const normExpectedSup = normalizeEffect(expected.supporting);

  const normActualDom = normalizeEffect(actual.dominant);
  const normActualSup = normalizeEffect(actual.supporting);

  // Exact match on dominant
  const dominantMatch = normExpectedDom === normActualDom;

  // Supporting can match either way (since order doesn't matter as much)
  const supportingMatch =
    normExpectedSup === normActualSup ||
    (normExpectedDom === normActualSup && normExpectedSup === normActualDom);

  return {
    dominantMatch,
    supportingMatch,
    fullMatch: dominantMatch && supportingMatch,
    expected: expected,
    actual: actual
  };
}

/**
 * Run validation tests
 */
async function runValidation() {
  console.log('🧪 Testing API against tea_data_26.json validation dataset\n');
  console.log(`Total teas to test: ${teaData.length}\n`);

  const results = {
    total: teaData.length,
    dominantMatches: 0,
    supportingMatches: 0,
    fullMatches: 0,
    errors: 0,
    tests: []
  };

  for (let i = 0; i < teaData.length; i++) {
    const tea = teaData[i];
    process.stdout.write(`\n[${i + 1}/${teaData.length}] Testing ${tea.name}... `);

    try {
      const response = await callAPI(tea);

      if (!response.success) {
        console.log(`❌ API Error: ${response.error}`);
        results.errors++;
        results.tests.push({
          name: tea.name,
          status: 'error',
          error: response.error
        });
        continue;
      }

      const apiEffects = response.data.effects.expectedEffects;
      const expectedEffects = tea.expectedEffects;

      const comparison = compareEffects(expectedEffects, apiEffects);

      if (comparison.fullMatch) {
        console.log('✅ Full match');
        results.fullMatches++;
      } else if (comparison.dominantMatch && comparison.supportingMatch) {
        console.log('⚠️  Supporting effects match (order swapped)');
        results.supportingMatches++;
      } else if (comparison.dominantMatch) {
        console.log('⚡ Dominant matches only');
        results.dominantMatches++;
      } else {
        console.log(`❌ Mismatch`);
        console.log(`   Expected: ${expectedEffects.dominant} / ${expectedEffects.supporting}`);
        console.log(`   Got:      ${apiEffects.dominant} / ${apiEffects.supporting}`);
      }

      results.tests.push({
        name: tea.name,
        type: tea.type,
        status: comparison.fullMatch ? 'full_match' : comparison.dominantMatch ? 'partial_match' : 'mismatch',
        expected: expectedEffects,
        actual: apiEffects,
        comparison
      });
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
      results.errors++;
      results.tests.push({
        name: tea.name,
        status: 'error',
        error: error.message
      });
    }

    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Print summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${results.total}`);
  console.log(`Full matches: ${results.fullMatches} (${((results.fullMatches / results.total) * 100).toFixed(1)}%)`);
  console.log(`Dominant matches: ${results.dominantMatches} (${((results.dominantMatches / results.total) * 100).toFixed(1)}%)`);
  console.log(`Supporting matches: ${results.supportingMatches} (${((results.supportingMatches / results.total) * 100).toFixed(1)}%)`);
  console.log(`Errors: ${results.errors}`);
  console.log('='.repeat(60));

  // Print by tea type
  const byType = {};
  results.tests.forEach(test => {
    if (test.type) {
      if (!byType[test.type]) byType[test.type] = { total: 0, matches: 0 };
      byType[test.type].total++;
      if (test.status === 'full_match') byType[test.type].matches++;
    }
  });

  console.log('\n📋 By Tea Type:');
  Object.entries(byType).forEach(([type, stats]) => {
    const accuracy = ((stats.matches / stats.total) * 100).toFixed(1);
    console.log(`  ${type}: ${stats.matches}/${stats.total} (${accuracy}%)`);
  });

  // Save detailed results
  const resultsFile = '/home/msieur-gab/propertea/validation-results.json';
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📁 Detailed results saved to: ${resultsFile}`);

  return results;
}

// Run tests
runValidation()
  .then(results => {
    process.exit(results.errors > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
