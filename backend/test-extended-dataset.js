/**
 * test-extended-dataset.js - Test the extended tea dataset
 *
 * Validates that all teas in the dataset are properly formatted
 * and can be used for recommendations
 */

import {
  teaDatabase,
  getTeaById,
  searchTeaByName,
  searchTeaByType,
  searchTeaByTag,
  searchTeas,
  getTeaTypes,
  getAllTags,
  getTeasByCaffeineLevel
} from './src/data/ExtendedTeaDataset.js';

import SchemaValidator, {
  calculateDataCompleteness
} from './src/utils/SchemaValidator.js';

console.log('🧪 EXTENDED TEA DATASET - VALIDATION TEST SUITE\n');
console.log('='.repeat(70));

// ============================================================================
// TEST 1: Dataset Size and Structure
// ============================================================================
console.log('\n✓ TEST 1: Dataset Size and Structure');
console.log('  ' + '─'.repeat(65));

console.log(`  Total teas in database: ${teaDatabase.length}`);
console.log(`  Tea types: ${getTeaTypes().join(', ')}`);
console.log(`  Unique tags: ${getAllTags().length}`);

const typeDistribution = {};
teaDatabase.forEach(tea => {
  typeDistribution[tea.type] = (typeDistribution[tea.type] || 0) + 1;
});

console.log(`\n  Type distribution:`);
Object.entries(typeDistribution).forEach(([type, count]) => {
  console.log(`    - ${type}: ${count} tea(s)`);
});

// ============================================================================
// TEST 2: Schema Validation for All Teas
// ============================================================================
console.log('\n✓ TEST 2: Schema Validation for All Teas');
console.log('  ' + '─'.repeat(65));

let allValid = true;
let validationResults = {
  passing: 0,
  failing: 0,
  warningCounts: []
};

teaDatabase.forEach(tea => {
  const result = SchemaValidator.validateTeaModel(tea);
  if (result.isValid) {
    validationResults.passing++;
    validationResults.warningCounts.push(result.warnings.length);
  } else {
    allValid = false;
    validationResults.failing++;
    console.log(`  ❌ ${tea.name}:`);
    result.errors.forEach(error => {
      console.log(`     - [${error.code}] ${error.field}: ${error.message}`);
    });
  }
});

console.log(`  Validation Result: ${allValid ? '✅ ALL PASS' : '❌ SOME FAIL'}`);
console.log(`  Passing: ${validationResults.passing}/${teaDatabase.length}`);
if (!allValid) {
  console.log(`  Failing: ${validationResults.failing}/${teaDatabase.length}`);
}

const avgWarnings = (validationResults.warningCounts.reduce((a, b) => a + b, 0) / validationResults.warningCounts.length).toFixed(1);
console.log(`  Average warnings per tea: ${avgWarnings}`);

// ============================================================================
// TEST 3: Data Completeness Analysis
// ============================================================================
console.log('\n✓ TEST 3: Data Completeness Analysis');
console.log('  ' + '─'.repeat(65));

const completenessData = teaDatabase.map(tea => ({
  name: tea.name,
  completeness: calculateDataCompleteness(tea)
})).sort((a, b) => b.completeness - a.completeness);

console.log(`  Completeness ranges:`);
const ranges = {
  excellent: completenessData.filter(d => d.completeness >= 80).length,
  good: completenessData.filter(d => d.completeness >= 60 && d.completeness < 80).length,
  fair: completenessData.filter(d => d.completeness >= 40 && d.completeness < 60).length,
  limited: completenessData.filter(d => d.completeness < 40).length
};

console.log(`    Excellent (80-100%): ${ranges.excellent}`);
console.log(`    Good (60-79%): ${ranges.good}`);
console.log(`    Fair (40-59%): ${ranges.fair}`);
console.log(`    Limited (<40%): ${ranges.limited}`);

console.log(`\n  Completeness by tea (top 5):`);
completenessData.slice(0, 5).forEach((data, idx) => {
  console.log(`    ${idx + 1}. ${data.name}: ${data.completeness}%`);
});

// ============================================================================
// TEST 4: Search Functions
// ============================================================================
console.log('\n✓ TEST 4: Search Functionality');
console.log('  ' + '─'.repeat(65));

const searchTests = [
  { name: 'green teas', fn: () => searchTeaByType('green'), expected: 2 },
  { name: 'puerh teas', fn: () => searchTeaByType('puerh'), expected: 2 },
  { name: '"matcha" by name', fn: () => searchTeaByName('matcha'), expected: 1 },
  { name: 'morning teas', fn: () => searchTeaByTag('morning'), expected: 2 },
  { name: 'calming teas', fn: () => searchTeaByTag('calming'), expected: 2 },
  { name: 'caffeine-free herbal', fn: () => getTeasByCaffeineLevel(0, 0), expected: 1 }
];

let searchAccuracy = 0;
searchTests.forEach(test => {
  const results = test.fn();
  const passed = results.length === test.expected;
  const status = passed ? '✅' : '❌';
  console.log(`  ${status} Search ${test.name}: ${results.length} found (expected ${test.expected})`);
  if (passed) searchAccuracy++;
});

console.log(`  Search Accuracy: ${Math.round((searchAccuracy / searchTests.length) * 100)}%`);

// ============================================================================
// TEST 5: Caffeine Level Distribution
// ============================================================================
console.log('\n✓ TEST 5: Caffeine Level Distribution');
console.log('  ' + '─'.repeat(65));

const caffeineStats = {
  veryLow: teaDatabase.filter(t => t.caffeineLevel <= 2).map(t => t.name),
  low: teaDatabase.filter(t => t.caffeineLevel > 2 && t.caffeineLevel <= 4).map(t => t.name),
  moderate: teaDatabase.filter(t => t.caffeineLevel > 4 && t.caffeineLevel <= 6).map(t => t.name),
  high: teaDatabase.filter(t => t.caffeineLevel > 6 && t.caffeineLevel <= 8).map(t => t.name),
  veryHigh: teaDatabase.filter(t => t.caffeineLevel > 8).map(t => t.name)
};

console.log(`  Very Low (0-2): ${caffeineStats.veryLow.length} teas`);
console.log(`  Low (3-4): ${caffeineStats.low.length} teas`);
console.log(`  Moderate (5-6): ${caffeineStats.moderate.length} teas`);
console.log(`  High (7-8): ${caffeineStats.high.length} teas`);
console.log(`  Very High (9-10): ${caffeineStats.veryHigh.length} teas`);

// ============================================================================
// TEST 6: Data Attributes Completeness
// ============================================================================
console.log('\n✓ TEST 6: Data Attributes Completeness');
console.log('  ' + '─'.repeat(65));

const attributePresence = {
  id: 0,
  name: 0,
  type: 0,
  caffeineLevel: 0,
  lTheanineLevel: 0,
  flavor: 0,
  geography: 0,
  processing: 0,
  harvest: 0,
  storage: 0,
  source: 0,
  tags: 0,
  bestPairedFood: 0
};

teaDatabase.forEach(tea => {
  Object.keys(attributePresence).forEach(attr => {
    if (tea[attr]) attributePresence[attr]++;
  });
});

console.log(`  Attribute presence:`);
Object.entries(attributePresence).forEach(([attr, count]) => {
  const percentage = Math.round((count / teaDatabase.length) * 100);
  const status = percentage === 100 ? '✅' : '⚠️';
  console.log(`    ${status} ${attr}: ${count}/${teaDatabase.length} (${percentage}%)`);
});

// ============================================================================
// TEST 7: Recommendation-Ready Assessment
// ============================================================================
console.log('\n✓ TEST 7: Recommendation-Ready Assessment');
console.log('  ' + '─'.repeat(65));

const recommendationReady = teaDatabase.map(tea => {
  const hasEssentials = !!(tea.id && tea.name && tea.type &&
                           tea.caffeineLevel !== undefined &&
                           tea.lTheanineLevel !== undefined);
  const hasDetail = !!(tea.flavor && tea.geography && tea.processing && tea.tags);

  return {
    name: tea.name,
    ready: hasEssentials && hasDetail,
    essentials: hasEssentials,
    detailed: hasDetail
  };
});

const fullReady = recommendationReady.filter(t => t.ready).length;
const essentialsOnly = recommendationReady.filter(t => t.essentials && !t.detailed).length;

console.log(`  Fully recommendation-ready: ${fullReady}/${teaDatabase.length}`);
console.log(`  Essentials only: ${essentialsOnly}/${teaDatabase.length}`);

if (fullReady < teaDatabase.length) {
  console.log(`\n  Teas needing more detail:`);
  recommendationReady.filter(t => !t.detailed).forEach(tea => {
    console.log(`    - ${tea.name}`);
  });
}

// ============================================================================
// TEST 8: Tag Diversity
// ============================================================================
console.log('\n✓ TEST 8: Tag Diversity and Coverage');
console.log('  ' + '─'.repeat(65));

const allTags = getAllTags();
const tagUsage = {};

teaDatabase.forEach(tea => {
  tea.tags.forEach(tag => {
    tagUsage[tag] = (tagUsage[tag] || 0) + 1;
  });
});

console.log(`  Total unique tags: ${allTags.length}`);
console.log(`  Most common tags:`);
const sortedTags = Object.entries(tagUsage)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5);

sortedTags.forEach(([tag, count]) => {
  console.log(`    - ${tag}: used in ${count} teas`);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('✅ DATASET VALIDATION COMPLETE\n');

console.log('Dataset Summary:');
console.log(`  Total teas: ${teaDatabase.length}`);
console.log(`  Schema validation: ${allValid ? '✅ Pass' : '❌ Fail'}`);
console.log(`  Search functions: ${searchAccuracy}/${searchTests.length} accurate`);
console.log(`  Recommendation ready: ${fullReady}/${teaDatabase.length}`);
console.log(`  Average completeness: ${completenessData.reduce((sum, d) => sum + d.completeness, 0) / completenessData.length.toFixed(0)}%`);
console.log(`\nDataset coverage:`);
console.log(`  Tea types: ${getTeaTypes().length} types covered`);
console.log(`  Tags: ${allTags.length} unique tags`);
console.log(`  Caffeine range: ${Math.min(...teaDatabase.map(t => t.caffeineLevel))}-${Math.max(...teaDatabase.map(t => t.caffeineLevel))}`);
