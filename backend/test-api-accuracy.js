/**
 * test-api-accuracy.js - Validate API accuracy against ground truth
 *
 * Tests the Phase 2 API against the 26-tea validation set
 * Measures accuracy for effects, timing, seasons, food pairings, and activities
 *
 * Notes on matching:
 * - Effects: Direct comparison + semantic similarity (harmonizing ≈ balancing)
 * - Food/Activities: Fuzzy matching (different references allowed)
 * - Seasons/Times: Exact interval comparison
 */

import fs from 'fs';
import SchemaValidator from './src/utils/SchemaValidator.js';
import { EffectService } from './src/services/EffectService.js';
import TimeMatcher from './src/services/matchers/TimeMatcher.js';
import SeasonMatcher from './src/services/matchers/SeasonMatcher.js';
import FoodMatcher from './src/services/matchers/FoodMatcher.js';
import ActivityMatcher from './src/services/matchers/ActivityMatcher.js';

// Load validation dataset
const validationData = JSON.parse(fs.readFileSync('./tea_data_26.json', 'utf-8'));

// Initialize services
const effectService = new EffectService({ useNewModel: true });
const timeMatcher = new TimeMatcher();
const seasonMatcher = new SeasonMatcher();
const foodMatcher = new FoodMatcher();
const activityMatcher = new ActivityMatcher();

// Mock analyses for testing
const mockCompoundAnalysis = {
  analysis: {
    compoundProfile: 'Balanced',
    stimulationLevel: 'medium',
    relaxationLevel: 'moderate',
    bodyImpact: 'balanced'
  }
};

const mockTeaTypeAnalysis = {
  analysis: {
    baseActivityHints: ['Afternoon']
  },
  primaryType: 'green'
};

const mockFlavorAnalysis = {
  analysis: {
    foodPairingHints: [],
    activityHints: [],
    bodyImpact: 'balanced'
  },
  profile: {
    categories: [],
    dominant: [],
    intensity: 'Moderate'
  }
};

// Semantic similarity mapping for effects
const effectSimilarity = {
  'clarifying': ['focusing', 'energizing', 'stimulating'],
  'refreshing': ['energizing', 'clarifying', 'focusing'],
  'calming': ['relaxing', 'soothing', 'harmonizing'],
  'relaxing': ['calming', 'soothing', 'grounding'],
  'energizing': ['clarifying', 'refreshing', 'focusing'],
  'harmonizing': ['balancing', 'calming', 'elevating'],
  'warming': ['grounding', 'comforting', 'energizing'],
  'aromatic': ['elevating', 'energizing', 'refreshing'],
  'mentally-stimulating': ['energizing', 'focusing', 'clarifying']
};

// Fuzzy match helper
function fuzzyMatch(actual, expected, threshold = 0.6) {
  const actualLower = (actual || '').toLowerCase();
  const expectedLower = (expected || '').toLowerCase();

  // Exact match
  if (actualLower === expectedLower) return 1.0;

  // Substring match
  if (actualLower.includes(expectedLower) || expectedLower.includes(actualLower)) return 0.8;

  // Check semantic similarity
  const similar = effectSimilarity[expectedLower] || [];
  if (similar.some(s => s === actualLower)) return 0.85;

  // Levenshtein distance
  return levenshteinSimilarity(actualLower, expectedLower);
}

function levenshteinSimilarity(a, b) {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - (distance / maxLength);
}

// Test results tracking
const results = {
  total: 0,
  passed: 0,
  effectsMatched: 0,
  effectsTotal: 0,
  foodMatched: 0,
  foodTotal: 0,
  activitiesMatched: 0,
  activitiesTotal: 0,
  timingMatched: 0,
  timingTotal: 0,
  seasonMatched: 0,
  seasonTotal: 0,
  details: []
};

console.log('\n');
console.log('████████████████████████████████████████████████████████████████████████████████');
console.log('█ API ACCURACY VALIDATION - 26 CHINESE TEAS');
console.log('████████████████████████████████████████████████████████████████████████████████\n');

// Test each tea
for (const validation of validationData) {
  results.total++;

  // Helper function to derive roast level from processing methods
  const deriveRoastLevel = (methods) => {
    if (!methods) return 'light';
    const methodsLower = methods.map(m => m.toLowerCase());

    if (methodsLower.includes('charcoal roasting')) return 'charcoal';
    if (methodsLower.includes('heavy roasting')) return 'heavy';
    if (methodsLower.includes('roasting') || methodsLower.includes('roasted')) {
      // Check context - oolong with roasting is typically medium-heavy
      return 'medium';
    }
    if (methodsLower.includes('baking')) return 'light';
    if (methodsLower.includes('drying')) return 'none';

    return 'light';
  };

  // Convert validation data to our API format
  const teaData = {
    name: validation.name,
    type: validation.type.toLowerCase(),
    caffeineLevel: normalizeCaffeine(validation.caffeineLevel),
    lTheanineLevel: normalizeTheanine(validation.lTheanineLevel),
    flavor: {
      primary: validation.flavorProfile || [],
      intensity: 'moderate'
    },
    geography: {
      ...validation.geography,
      temperature: 15,
      humidity: 70,
      solarRadiation: 150
    },
    processing: {
      methods: validation.processingMethods || [],
      oxidationLevel: 30,
      roastLevel: deriveRoastLevel(validation.processingMethods)
    },
    harvest: {
      season: (validation.recommendedContext?.drinkingSeason || ['spring'])[0].toLowerCase()
    }
  };

  let passed = true;
  const detail = {
    name: validation.name,
    type: validation.type,
    metrics: {
      effects: 0,
      food: 0,
      activities: 0,
      timing: 0,
      season: 0
    }
  };

  try {
    // Run analysis
    const effectResult = effectService.infer(teaData);
    const timeResult = timeMatcher.matchTime(teaData, mockCompoundAnalysis, mockTeaTypeAnalysis, mockFlavorAnalysis);
    const seasonResult = seasonMatcher.matchSeason(teaData);
    const foodResult = foodMatcher.matchFood(teaData, mockFlavorAnalysis, mockCompoundAnalysis, mockTeaTypeAnalysis);
    const activityResult = activityMatcher.matchActivity(teaData, mockCompoundAnalysis, mockTeaTypeAnalysis, mockFlavorAnalysis);

    // === EFFECTS ACCURACY ===
    results.effectsTotal += 2;

    const apiDominant = effectResult.expectedEffects.dominant || '';
    const expectedDominant = validation.expectedEffects.dominant || '';
    const dominantMatch = fuzzyMatch(apiDominant, expectedDominant);

    if (dominantMatch >= 0.7) {
      results.effectsMatched++;
      detail.metrics.effects += 1;
    } else {
      passed = false;
    }

    const apiSupporting = effectResult.expectedEffects.supporting || '';
    const expectedSupporting = validation.expectedEffects.supporting || '';
    const supportingMatch = fuzzyMatch(apiSupporting, expectedSupporting);

    if (supportingMatch >= 0.7) {
      results.effectsMatched++;
      detail.metrics.effects += 1;
    } else {
      passed = false;
    }

    // === TIMING ACCURACY ===
    results.timingTotal++;
    const validationTimes = validation.recommendedContext?.timeOfDay || [12];
    const apiTimes = timeResult.recommendedTimes.slice(0, 3).map(t => t.hour);

    const timeMatch = validationTimes.some(vt => apiTimes.includes(vt) ||
      Math.abs(vt - (apiTimes[0] || 12)) <= 2);

    if (timeMatch) {
      results.timingMatched++;
      detail.metrics.timing = 1;
    } else {
      passed = false;
    }

    // === SEASON ACCURACY ===
    results.seasonTotal++;
    const validationSeasons = validation.recommendedContext?.drinkingSeason || ['spring'];
    const apiSeasons = seasonResult.recommendedSeasons.map(s => s.season?.toLowerCase() || '');

    const seasonMatch = validationSeasons.some(vs =>
      apiSeasons.some(as => fuzzyMatch(as, vs.toLowerCase()) >= 0.7)
    );

    if (seasonMatch) {
      results.seasonMatched++;
      detail.metrics.season = 1;
    } else {
      passed = false;
    }

    // === FOOD PAIRING ACCURACY ===
    const validationFoods = validation.recommendedContext?.foodPairing || [];
    const apiFoods = foodResult.recommendedFoods.map(f => f.name);

    validationFoods.forEach(vf => {
      results.foodTotal++;
      const matched = apiFoods.some(af => fuzzyMatch(af, vf) >= 0.6);
      if (matched) {
        results.foodMatched++;
        detail.metrics.food += 1 / validationFoods.length;
      }
    });

    // === ACTIVITY ACCURACY ===
    const validationActivities = validation.recommendedContext?.recommendedActivity || [];
    const apiActivities = activityResult.recommendedActivities.map(a => a.name);

    validationActivities.forEach(va => {
      results.activitiesTotal++;
      const matched = apiActivities.some(aa => fuzzyMatch(aa, va) >= 0.6);
      if (matched) {
        results.activitiesMatched++;
        detail.metrics.activities += 1 / validationActivities.length;
      }
    });

    if (passed) {
      results.passed++;
    }

    detail.status = passed ? '✅' : '⚠️';
    detail.dominantEffect = { api: apiDominant, expected: expectedDominant, match: (dominantMatch * 100).toFixed(0) + '%' };
    detail.supportingEffect = { api: apiSupporting, expected: expectedSupporting, match: (supportingMatch * 100).toFixed(0) + '%' };

    results.details.push(detail);

  } catch (error) {
    detail.status = '❌';
    detail.error = error.message;
    results.details.push(detail);
    passed = false;
  }
}

// === PRINT RESULTS ===
console.log('\n📊 OVERALL ACCURACY METRICS');
console.log('─'.repeat(80));
console.log(`✅ Teas with valid analysis: ${results.passed}/${results.total} (${(results.passed/results.total*100).toFixed(1)}%)`);
console.log(`\n💫 EFFECTS ACCURACY`);
console.log(`  Dominant + Supporting: ${results.effectsMatched}/${results.effectsTotal} (${(results.effectsMatched/results.effectsTotal*100).toFixed(1)}%)`);
console.log(`\n⏰ TIMING ACCURACY`);
console.log(`  Recommended times: ${results.timingMatched}/${results.timingTotal} (${(results.timingMatched/results.timingTotal*100).toFixed(1)}%)`);
console.log(`\n🌍 SEASON ACCURACY`);
console.log(`  Best seasons: ${results.seasonMatched}/${results.seasonTotal} (${(results.seasonMatched/results.seasonTotal*100).toFixed(1)}%)`);
console.log(`\n🍽️ FOOD PAIRING ACCURACY`);
console.log(`  Food matches: ${results.foodMatched}/${results.foodTotal} (${(results.foodMatched/results.foodTotal*100).toFixed(1)}%)`);
console.log(`\n🎯 ACTIVITY ACCURACY`);
console.log(`  Activity matches: ${results.activitiesMatched}/${results.activitiesTotal} (${(results.activitiesMatched/results.activitiesTotal*100).toFixed(1)}%)`);

console.log('\n\n📋 DETAILED RESULTS BY TEA');
console.log('─'.repeat(80));

results.details.forEach((detail, idx) => {
  console.log(`\n${idx + 1}. ${detail.status} ${detail.name} (${detail.type})`);
  if (detail.error) {
    console.log(`   Error: ${detail.error}`);
  } else {
    console.log(`   Dominant:  ${detail.dominantEffect.api} vs ${detail.dominantEffect.expected} (${detail.dominantEffect.match})`);
    console.log(`   Supporting: ${detail.supportingEffect.api} vs ${detail.supportingEffect.expected} (${detail.supportingEffect.match})`);
    console.log(`   Metrics: E:${detail.metrics.effects.toFixed(1)} F:${detail.metrics.food.toFixed(1)} A:${detail.metrics.activities.toFixed(1)} T:${detail.metrics.timing} S:${detail.metrics.season}`);
  }
});

console.log('\n' + '████████████████████████████████████████████████████████████████████████████████');
console.log('█ VALIDATION COMPLETE');
console.log('████████████████████████████████████████████████████████████████████████████████\n');

// Helper functions
function normalizeCaffeine(level) {
  // Convert from 0-100 scale to 0-10 scale
  if (level > 10) return Math.round(level / 10);
  return level;
}

function normalizeTheanine(level) {
  // Convert from 0-100 scale to 0-10 scale
  if (level > 10) return Math.round(level / 10);
  return level;
}
