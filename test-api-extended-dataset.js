/**
 * Test API endpoint against extended validation dataset
 * Makes actual HTTP requests to the running API server
 */

import fs from 'fs';
import fetch from 'node-fetch';

// Configuration
const API_URL = 'http://localhost:8888/.netlify/functions/analyze';
const DATASET_PATH = './_dataset/chinese_teas_validation_extended_set.json';

// Load dataset
let dataset = [];
try {
  dataset = JSON.parse(fs.readFileSync(DATASET_PATH, 'utf8'));
  console.log(`✅ Loaded ${dataset.length} teas from extended dataset\n`);
} catch (e) {
  console.error('❌ Error loading dataset:', e.message);
  process.exit(1);
}

async function callAPI(teaData) {
  // Format request for API
  const requestBody = {
    name: teaData.name,
    originalName: teaData.originalName || '',
    type: teaData.type,
    subType: teaData.subType || '',
    caffeineLevel: teaData.caffeineLevel || 0,
    lTheanineLevel: teaData.lTheanineLevel || 0,
    flavorProfile: teaData.flavorProfile || [],
    processingMethods: teaData.processingMethods || [],
    geography: teaData.geography || {}
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const result = await response.json();
    if (!result.success) {
      return { error: result.error || 'Unknown error' };
    }

    return result.data;
  } catch (error) {
    return { error: error.message };
  }
}

function compareEffects(calculated, expected) {
  const domMatch = calculated.dominant === expected.dominant;
  const supMatch = calculated.supporting === expected.supporting;

  if (domMatch && supMatch) return 'PERFECT ✓✓';
  if (domMatch || supMatch) return 'PARTIAL ✓';
  return 'DIFFERENT ⚠';
}

async function runTest() {
  console.log('='.repeat(140));
  console.log('API ENDPOINT TEST - Extended Validation Dataset');
  console.log(`Endpoint: ${API_URL}`);
  console.log('='.repeat(140));
  console.log();

  let results = [];
  let perfect = 0, partial = 0, different = 0, errors = 0;

  for (const tea of dataset) {
    process.stdout.write(`Testing: ${tea.name.padEnd(40)}`);

    const analysis = await callAPI(tea);

    if (analysis.error) {
      console.log(`❌ ERROR: ${analysis.error}`);
      errors++;
      continue;
    }

    const calculated = analysis.effects?.expectedEffects || {};
    const status = compareEffects(calculated, tea.expectedEffects);

    if (status.includes('PERFECT')) perfect++;
    else if (status.includes('PARTIAL')) partial++;
    else different++;

    const typeInfo = tea.subType ? `${tea.type}/${tea.subType}` : tea.type;
    console.log(
      ` [${typeInfo.padEnd(18)}] Expected: ${tea.expectedEffects.dominant.padEnd(12)} + ${tea.expectedEffects.supporting.padEnd(12)} | ` +
      `Calculated: ${(calculated.dominant || 'N/A').padEnd(12)} + ${(calculated.supporting || 'N/A').padEnd(12)} | ${status}`
    );

    results.push({
      name: tea.name,
      type: tea.type,
      subType: tea.subType || 'none',
      expected: tea.expectedEffects,
      calculated: calculated,
      status: status,
      fullAnalysis: analysis
    });
  }

  // Summary
  console.log();
  console.log('='.repeat(140));
  console.log('SUMMARY');
  console.log('='.repeat(140));
  console.log(`Total Teas:        ${dataset.length}`);
  console.log(`Perfect Matches:   ${perfect} (${(perfect / dataset.length * 100).toFixed(1)}%)`);
  console.log(`Partial Matches:   ${partial} (${(partial / dataset.length * 100).toFixed(1)}%)`);
  console.log(`Different:         ${different} (${(different / dataset.length * 100).toFixed(1)}%)`);
  console.log(`Errors:            ${errors}`);
  const accuracy = ((perfect + partial) / (dataset.length - errors) * 100).toFixed(1);
  console.log(`Combined Accuracy: ${accuracy}%`);
  console.log();

  // Show examples of each type
  console.log('='.repeat(140));
  console.log('EXAMPLE RESULTS');
  console.log('='.repeat(140));

  const perfects = results.filter(r => r.status.includes('PERFECT'));
  const partials = results.filter(r => r.status.includes('PARTIAL'));
  const differents = results.filter(r => r.status.includes('DIFFERENT'));

  if (perfects.length > 0) {
    console.log('\n✓✓ PERFECT MATCH EXAMPLE:');
    const example = perfects[0];
    console.log(`Tea: ${example.name} (${example.type}${example.subType !== 'none' ? '/' + example.subType : ''})`);
    console.log(`Expected:    dominant="${example.expected.dominant}", supporting="${example.expected.supporting}"`);
    console.log(`Calculated:  dominant="${example.calculated.dominant}", supporting="${example.calculated.supporting}"`);
  }

  if (partials.length > 0) {
    console.log('\n✓ PARTIAL MATCH EXAMPLE:');
    const example = partials[0];
    console.log(`Tea: ${example.name} (${example.type}${example.subType !== 'none' ? '/' + example.subType : ''})`);
    console.log(`Expected:    dominant="${example.expected.dominant}", supporting="${example.expected.supporting}"`);
    console.log(`Calculated:  dominant="${example.calculated.dominant}", supporting="${example.calculated.supporting}"`);
    console.log(`Match: ${example.calculated.dominant === example.expected.dominant ? 'dominant' : 'supporting'}`);
  }

  if (differents.length > 0) {
    console.log('\n⚠ DIFFERENT MATCH EXAMPLE:');
    const example = differents[0];
    console.log(`Tea: ${example.name} (${example.type}${example.subType !== 'none' ? '/' + example.subType : ''})`);
    console.log(`Expected:    dominant="${example.expected.dominant}", supporting="${example.expected.supporting}"`);
    console.log(`Calculated:  dominant="${example.calculated.dominant}", supporting="${example.calculated.supporting}"`);
  }

  // Show full analysis for one example
  if (results.length > 0) {
    console.log('\n' + '='.repeat(140));
    console.log('DETAILED ANALYSIS EXAMPLE (Full API Response)');
    console.log('='.repeat(140));
    const example = results[0];
    console.log(`\nTea: ${example.name}`);
    console.log(`Expected Effects: ${JSON.stringify(example.expected, null, 2)}`);
    console.log(`\nCalculated Effects: ${JSON.stringify(example.calculated, null, 2)}`);
    console.log(`\nFull API Response (excerpt):`);
    console.log(JSON.stringify({
      teaType: example.fullAnalysis.teaType,
      compounds: example.fullAnalysis.compounds,
      flavor: example.fullAnalysis.flavor,
      processing: example.fullAnalysis.processing,
      geography: example.fullAnalysis.geography,
      effects: example.fullAnalysis.effects
    }, null, 2));
  }
}

runTest().catch(console.error);
