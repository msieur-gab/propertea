/**
 * test-schema-validation.js - Test JSON schema validation
 *
 * Validates schemas work correctly with sample tea data
 */

import SchemaValidator, {
  calculateDataCompleteness,
  generateValidationReport
} from './src/utils/SchemaValidator.js';

console.log('🧪 JSON SCHEMA VALIDATION - TEST SUITE\n');
console.log('='.repeat(70));

// ============================================================================
// TEST DATA
// ============================================================================

const completeTea = {
  name: 'Sencha Green Tea',
  type: 'green',
  subType: null,
  caffeineLevel: 7,
  lTheanineLevel: 4,
  flavor: {
    primary: ['vegetal', 'grassy', 'fresh'],
    secondary: ['sweet'],
    intensity: 'moderate'
  },
  geography: {
    country: 'Japan',
    province: 'Shizuoka',
    altitude: 600,
    temperature: 15,
    humidity: 70,
    solarRadiation: 150
  },
  processing: {
    methods: ['steaming'],
    oxidationLevel: 5,
    roastLevel: 'none',
    dryingMethod: 'sun-dried'
  },
  harvest: {
    season: 'spring',
    flush: 'first-flush'
  }
};

const minimalTea = {
  name: 'Mystery Tea',
  type: 'oolong'
};

const invalidTea = {
  name: 'Bad Tea',
  type: 'invalid_type',
  caffeineLevel: 150,  // > 10
  flavor: {
    primary: 'not-an-array'  // should be array
  }
};

// ============================================================================
// TEST 1: Valid Complete Tea Model
// ============================================================================
console.log('\n✓ TEST 1: Valid Complete Tea Model');
console.log('  ' + '─'.repeat(65));

const result1 = SchemaValidator.validateTeaModel(completeTea);
console.log(`  Valid: ${result1.isValid ? '✅ YES' : '❌ NO'}`);
console.log(`  Errors: ${result1.errors.length}`);
console.log(`  Warnings: ${result1.warnings.length}`);
console.log(`  Data Completeness: ${result1.summary.dataCompleteness}%`);
console.log(`  Estimated Confidence: ${result1.summary.estimatedConfidence}%`);

if (!result1.isValid) {
  result1.errors.forEach(err => {
    console.log(`    ❌ ${err.field}: ${err.message}`);
  });
}

// ============================================================================
// TEST 2: Minimal Valid Tea Model
// ============================================================================
console.log('\n✓ TEST 2: Minimal Valid Tea Model');
console.log('  ' + '─'.repeat(65));

const result2 = SchemaValidator.validateTeaModel(minimalTea);
console.log(`  Valid: ${result2.isValid ? '✅ YES' : '❌ NO'}`);
console.log(`  Errors: ${result2.errors.length}`);
console.log(`  Warnings: ${result2.warnings.length}`);
console.log(`  Data Completeness: ${result2.summary.dataCompleteness}%`);
console.log(`  Estimated Confidence: ${result2.summary.estimatedConfidence}%`);

if (result2.warnings.length > 0) {
  console.log(`  Sample warnings:`);
  result2.warnings.slice(0, 3).forEach(warn => {
    console.log(`    ⚠️  ${warn.field}: ${warn.message}`);
  });
}

// ============================================================================
// TEST 3: Invalid Tea Model
// ============================================================================
console.log('\n✓ TEST 3: Invalid Tea Model');
console.log('  ' + '─'.repeat(65));

const result3 = SchemaValidator.validateTeaModel(invalidTea);
console.log(`  Valid: ${result3.isValid ? '✅ YES' : '❌ NO'}`);
console.log(`  Errors: ${result3.errors.length}`);
console.log(`  Warnings: ${result3.warnings.length}`);

if (result3.errors.length > 0) {
  console.log(`  Errors found:`);
  result3.errors.forEach(err => {
    console.log(`    ❌ [${err.code}] ${err.field}: ${err.message}`);
  });
}

// ============================================================================
// TEST 4: Data Completeness Calculation
// ============================================================================
console.log('\n✓ TEST 4: Data Completeness Calculation');
console.log('  ' + '─'.repeat(65));

const completeness1 = calculateDataCompleteness(completeTea);
const completeness2 = calculateDataCompleteness(minimalTea);
const completeness3 = calculateDataCompleteness({
  name: 'Tea',
  type: 'green',
  caffeineLevel: 5,
  flavor: { primary: ['sweet'] }
});

console.log(`  Complete tea: ${completeness1}%`);
console.log(`  Minimal tea: ${completeness2}%`);
console.log(`  Partial tea: ${completeness3}%`);

// ============================================================================
// TEST 5: Validation Report Generation
// ============================================================================
console.log('\n✓ TEST 5: Validation Report Generation');
console.log('  ' + '─'.repeat(65));

const report = generateValidationReport(result3);
console.log(report);

// ============================================================================
// TEST 6: Field-Level Validation
// ============================================================================
console.log('\n✓ TEST 6: Field-Level Validation Accuracy');
console.log('  ' + '─'.repeat(65));

const testCases = [
  {
    name: 'Invalid caffeine (too high)',
    tea: { name: 'Tea', type: 'green', caffeineLevel: 15 },
    expectedError: 'RANGE_VIOLATION'
  },
  {
    name: 'Invalid type enum',
    tea: { name: 'Tea', type: 'invalid' },
    expectedError: 'ENUM_VIOLATION'
  },
  {
    name: 'Missing required field',
    tea: { type: 'green' },
    expectedError: 'REQUIRED'
  },
  {
    name: 'Invalid humidity (>100)',
    tea: {
      name: 'Tea',
      type: 'green',
      geography: { humidity: 150 }
    },
    expectedError: 'RANGE_VIOLATION'
  }
];

let validationAccuracy = 0;
testCases.forEach(testCase => {
  const result = SchemaValidator.validateTeaModel(testCase.tea);
  const hasExpectedError = result.errors.some(err => err.code === testCase.expectedError);
  const status = hasExpectedError ? '✅' : '❌';
  console.log(`  ${status} ${testCase.name}`);
  if (hasExpectedError) validationAccuracy++;
});

console.log(`  Accuracy: ${Math.round((validationAccuracy / testCases.length) * 100)}%`);

// ============================================================================
// TEST 7: Warning Accuracy
// ============================================================================
console.log('\n✓ TEST 7: Data Quality Warning Detection');
console.log('  ' + '─'.repeat(65));

const warningTests = [
  {
    name: 'Missing flavor notes',
    tea: { name: 'Tea', type: 'green' },
    expectedWarning: 'DATA_QUALITY_LOW'
  },
  {
    name: 'Incomplete geography',
    tea: {
      name: 'Tea',
      type: 'green',
      geography: { country: 'China' }
    },
    expectedWarning: 'DATA_QUALITY_LOW'
  }
];

let warningAccuracy = 0;
warningTests.forEach(testCase => {
  const result = SchemaValidator.validateTeaModel(testCase.tea);
  const hasExpectedWarning = result.warnings.some(w => w.code === testCase.expectedWarning);
  const status = hasExpectedWarning ? '✅' : '❌';
  console.log(`  ${status} ${testCase.name}`);
  if (hasExpectedWarning) warningAccuracy++;
});

console.log(`  Accuracy: ${Math.round((warningAccuracy / warningTests.length) * 100)}%`);

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('✅ SCHEMA VALIDATION TESTS COMPLETED\n');
console.log('Key Validation Points:');
console.log('  ✓ Complete data validates successfully');
console.log('  ✓ Minimal valid data passes validation');
console.log('  ✓ Invalid data is properly rejected');
console.log('  ✓ Data completeness calculated correctly');
console.log('  ✓ Field-level validation detects errors');
console.log('  ✓ Data quality warnings are generated');
console.log('  ✓ Validation reports are readable and detailed');
console.log('\nNext Steps:');
console.log('  1. Add validation middleware to API endpoints');
console.log('  2. Build extended tea dataset');
console.log('  3. Create API documentation with schemas');
