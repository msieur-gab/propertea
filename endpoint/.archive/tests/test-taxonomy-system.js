/**
 * test-taxonomy-system.js
 *
 * Comprehensive test suite for the Unified Taxonomy System
 * Tests registry functionality, consistency validation, and cross-taxonomy references
 */

import TaxonomyRegistry, {
  FlavorTaxonomy,
  ActivityTaxonomy,
  FoodTaxonomy,
  ProcessingTaxonomy,
  SeasonTaxonomy,
  GeographyTaxonomy,
  TeaTypeTaxonomy
} from './src/taxonomies/index.js';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║         UNIFIED TAXONOMY SYSTEM - COMPREHENSIVE TEST           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

let testsPassed = 0;
let testsFailed = 0;

const test = (name, fn) => {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
};

// ========== TEST SUITE 1: INDIVIDUAL TAXONOMY LOOKUPS ==========
console.log('\n📋 TEST SUITE 1: Individual Taxonomy Lookups\n');

test('FlavorTaxonomy: Lookup FLAVOR_JASMINE by ID', () => {
  const flavor = FlavorTaxonomy.getFlavor('FLAVOR_JASMINE');
  if (!flavor || flavor.id !== 'FLAVOR_JASMINE') throw new Error('Flavor not found');
});

test('FlavorTaxonomy: Lookup jasmine by alias', () => {
  const flavor = FlavorTaxonomy.getFlavor('jasmine');
  if (!flavor || flavor.id !== 'FLAVOR_JASMINE') throw new Error('Flavor alias not found');
});

test('ActivityTaxonomy: Lookup ACTIVITY_RELAXATION by ID', () => {
  const activity = ActivityTaxonomy.getActivity('ACTIVITY_RELAXATION');
  if (!activity || activity.id !== 'ACTIVITY_RELAXATION') throw new Error('Activity not found');
});

test('ActivityTaxonomy: Lookup relaxation by alias', () => {
  const activity = ActivityTaxonomy.getActivity('relaxation');
  if (!activity || activity.id !== 'ACTIVITY_RELAXATION') throw new Error('Activity alias not found');
});

test('FoodTaxonomy: Lookup FOOD_LIGHT_DESSERTS by ID', () => {
  const food = FoodTaxonomy.getFood('FOOD_LIGHT_DESSERTS');
  if (!food || food.id !== 'FOOD_LIGHT_DESSERTS') throw new Error('Food not found');
});

test('ProcessingTaxonomy: Lookup PROCESSING_STEAMED by ID', () => {
  const method = ProcessingTaxonomy.getMethod('PROCESSING_STEAMED');
  if (!method || method.id !== 'PROCESSING_STEAMED') throw new Error('Processing method not found');
});

test('ProcessingTaxonomy: Lookup steamed by alias', () => {
  const method = ProcessingTaxonomy.getMethod('steamed');
  if (!method || method.id !== 'PROCESSING_STEAMED') throw new Error('Processing alias not found');
});

test('SeasonTaxonomy: Lookup SEASON_SPRING by ID', () => {
  const season = SeasonTaxonomy.getSeason('SEASON_SPRING');
  if (!season || season.id !== 'SEASON_SPRING') throw new Error('Season not found');
});

test('GeographyTaxonomy: Lookup ELEVATION_HIGH by ID', () => {
  const elev = GeographyTaxonomy.getElevation('ELEVATION_HIGH');
  if (!elev || elev.id !== 'ELEVATION_HIGH') throw new Error('Elevation not found');
});

test('GeographyTaxonomy: Lookup elevation by altitude (1500m)', () => {
  const elev = GeographyTaxonomy.getElevation(1500);
  if (!elev || elev.id !== 'ELEVATION_HIGH') throw new Error('Elevation range lookup failed');
});

test('TeaTypeTaxonomy: Lookup TEA_TYPE_GREEN by ID', () => {
  const type = TeaTypeTaxonomy.getType('TEA_TYPE_GREEN');
  if (!type || type.id !== 'TEA_TYPE_GREEN') throw new Error('Tea type not found');
});

test('TeaTypeTaxonomy: Lookup green by alias', () => {
  const type = TeaTypeTaxonomy.getType('green');
  if (!type || type.id !== 'TEA_TYPE_GREEN') throw new Error('Tea type alias not found');
});

test('TeaTypeTaxonomy: Lookup TEA_SUBTYPE_MATCHA by ID', () => {
  const subtype = TeaTypeTaxonomy.getSubtype('TEA_SUBTYPE_MATCHA');
  if (!subtype || subtype.id !== 'TEA_SUBTYPE_MATCHA') throw new Error('Tea subtype not found');
});

test('TeaTypeTaxonomy: Get subtypes for GREEN type', () => {
  const subtypes = TeaTypeTaxonomy.getSubtypesByType('green');
  if (!Array.isArray(subtypes) || subtypes.length === 0) throw new Error('No subtypes found');
});

// ========== TEST SUITE 2: REGISTRY UNIFIED LOOKUP ==========
console.log('\n🔗 TEST SUITE 2: Registry Unified Lookup\n');

test('Registry.lookup: Lookup flavor by domain and ID', () => {
  const flavor = TaxonomyRegistry.lookup('flavors', 'FLAVOR_JASMINE');
  if (!flavor || flavor.id !== 'FLAVOR_JASMINE') throw new Error('Registry lookup failed');
});

test('Registry.lookup: Lookup activity by domain and alias', () => {
  const activity = TaxonomyRegistry.lookup('activities', 'relaxation');
  if (!activity || activity.id !== 'ACTIVITY_RELAXATION') throw new Error('Registry lookup failed');
});

test('Registry.lookup: Lookup processing method', () => {
  const method = TaxonomyRegistry.lookup('processing', 'steamed');
  if (!method || method.id !== 'PROCESSING_STEAMED') throw new Error('Registry lookup failed');
});

test('Registry.getAll: Get all flavors', () => {
  const flavors = TaxonomyRegistry.getAll('flavors');
  if (!Array.isArray(flavors) || flavors.length === 0) throw new Error('Get all failed');
});

test('Registry.getAll: Get all activities', () => {
  const activities = TaxonomyRegistry.getAll('activities');
  if (!Array.isArray(activities) || activities.length === 0) throw new Error('Get all failed');
});

// ========== TEST SUITE 3: CROSS-TAXONOMY VALIDATION ==========
console.log('\n🔍 TEST SUITE 3: Cross-Taxonomy Validation\n');

test('Consistency: All flavor activity hints are valid', () => {
  Object.entries(FlavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
    flavor.activityHints?.forEach(activityId => {
      const activity = ActivityTaxonomy.getActivity(activityId);
      if (!activity) throw new Error(`Invalid activity hint in ${flavorId}: ${activityId}`);
    });
  });
});

test('Consistency: All flavor food pairing hints are valid', () => {
  Object.entries(FlavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
    flavor.foodPairingHints?.forEach(foodId => {
      const food = FoodTaxonomy.getFood(foodId);
      if (!food) throw new Error(`Invalid food hint in ${flavorId}: ${foodId}`);
    });
  });
});

test('Consistency: All flavor season hints are valid', () => {
  Object.entries(FlavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
    flavor.seasonalAffinityHints?.forEach(seasonId => {
      const season = SeasonTaxonomy.getSeason(seasonId);
      if (!season) throw new Error(`Invalid season hint in ${flavorId}: ${seasonId}`);
    });
  });
});

test('Consistency: All tea type activity hints are valid', () => {
  Object.entries(TeaTypeTaxonomy.TYPES).forEach(([typeId, type]) => {
    type.baseActivityHints?.forEach(activityId => {
      const activity = ActivityTaxonomy.getActivity(activityId);
      if (!activity) throw new Error(`Invalid activity hint in ${typeId}: ${activityId}`);
    });
  });
});

test('Consistency: All tea type processing methods are valid', () => {
  Object.entries(TeaTypeTaxonomy.TYPES).forEach(([typeId, type]) => {
    type.commonProcessing?.forEach(processingId => {
      const processing = ProcessingTaxonomy.getMethod(processingId);
      if (!processing) throw new Error(`Invalid processing in ${typeId}: ${processingId}`);
    });
  });
});

test('Consistency: All tea subtypes have valid parent types', () => {
  Object.entries(TeaTypeTaxonomy.SUBTYPES).forEach(([subtypeId, subtype]) => {
    const parentType = TeaTypeTaxonomy.getType(subtype.parentType);
    if (!parentType) throw new Error(`Invalid parent type in ${subtypeId}: ${subtype.parentType}`);
  });
});

test('Consistency: Full registry validation passes', () => {
  const validation = TaxonomyRegistry.validateConsistency();
  if (!validation.isConsistent) {
    throw new Error(`Validation failed with ${validation.issues.length} issues:\n${validation.issues.join('\n')}`);
  }
});

// ========== TEST SUITE 4: TAXONOMY STATISTICS ==========
console.log('\n📊 TEST SUITE 4: Taxonomy Statistics\n');

const stats = TaxonomyRegistry.getStats();

console.log(`  📍 Flavors:      ${stats.flavors}`);
console.log(`  🎯 Activities:   ${stats.activities}`);
console.log(`  🍽️  Foods:        ${stats.foods}`);
console.log(`  ⚙️  Processing:   ${stats.processing}`);
console.log(`  🌍 Seasons:      ${stats.seasons}`);
console.log(`  🍵 Tea Types:    ${stats.teaTypes}`);
console.log(`  🌿 Subtypes:     ${stats.teaSubtypes}`);

const totalItems = stats.flavors + stats.activities + stats.foods + stats.processing + stats.seasons + stats.teaTypes + stats.teaSubtypes;
console.log(`  ✨ Total Items:  ${totalItems}\n`);

test('Statistics: Flavors count is correct', () => {
  if (stats.flavors < 35) throw new Error(`Expected 35+ flavors, got ${stats.flavors}`);
});

test('Statistics: Activities count is correct', () => {
  if (stats.activities < 30) throw new Error(`Expected 30+ activities, got ${stats.activities}`);
});

test('Statistics: Foods count is correct', () => {
  if (stats.foods < 75) throw new Error(`Expected 75+ foods, got ${stats.foods}`);
});

test('Statistics: Processing methods count is correct', () => {
  if (stats.processing < 28) throw new Error(`Expected 28+ processing methods, got ${stats.processing}`);
});

test('Statistics: Seasons count is correct', () => {
  if (stats.seasons < 12) throw new Error(`Expected 12+ seasons, got ${stats.seasons}`);
});

test('Statistics: Tea types count is correct', () => {
  if (stats.teaTypes !== 6) throw new Error(`Expected 6 tea types, got ${stats.teaTypes}`);
});

test('Statistics: Tea subtypes count is correct', () => {
  if (stats.teaSubtypes < 18) throw new Error(`Expected 18+ subtypes, got ${stats.teaSubtypes}`);
});

test('Statistics: No consistency issues', () => {
  if (!stats.isConsistent) throw new Error(`${stats.issueCount} consistency issues found`);
});

// ========== TEST SUITE 5: ERROR HANDLING ==========
console.log('\n⚠️  TEST SUITE 5: Error Handling\n');

test('Error handling: Invalid flavor returns null', () => {
  const flavor = FlavorTaxonomy.getFlavor('NONEXISTENT_FLAVOR');
  if (flavor !== null) throw new Error('Should return null for invalid flavor');
});

test('Error handling: Invalid registry lookup throws error', () => {
  try {
    TaxonomyRegistry.lookup('flavors', 'NONEXISTENT');
    throw new Error('Should have thrown an error');
  } catch (error) {
    if (error.message === 'Should have thrown an error') throw error;
  }
});

test('Error handling: Invalid domain throws error', () => {
  try {
    TaxonomyRegistry.lookup('invalid-domain', 'something');
    throw new Error('Should have thrown an error');
  } catch (error) {
    if (error.message === 'Should have thrown an error') throw error;
  }
});

// ========== SUMMARY ==========
console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║                      TEST SUMMARY                               ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📊 Total:  ${testsPassed + testsFailed}\n`);

if (testsFailed === 0) {
  console.log('🎉 All tests passed! Taxonomy system is working correctly.\n');
  process.exit(0);
} else {
  console.log(`⚠️  ${testsFailed} test(s) failed. Review output above.\n`);
  process.exit(1);
}
