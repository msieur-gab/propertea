/**
 * test-17-tea-validation.js - Validate API against real-world Chinese tea dataset
 *
 * Tests the comprehensive effect scorer against a diverse 17-tea dataset provided by an expert
 * Chinese tea enthusiast. Validates:
 * - Mood/Energy Effects accuracy
 * - Food pairing matches (fuzzy)
 * - Activities matches (fuzzy)
 * - Timing recommendations (best_time_of_day)
 * - Season recommendations
 *
 * Dataset covers all major tea types: green, white, yellow, oolong, puerh, dark, red/black
 */

import fs from 'fs';
import SchemaValidator from './src/utils/SchemaValidator.js';
import { EffectService } from './src/services/EffectService.js';
import TimeMatcher from './src/services/matchers/TimeMatcher.js';
import SeasonMatcher from './src/services/matchers/SeasonMatcher.js';
import FoodMatcher from './src/services/matchers/FoodMatcher.js';
import ActivityMatcher from './src/services/matchers/ActivityMatcher.js';

// Load the 17-tea dataset
const validationData = JSON.parse(fs.readFileSync('./validation-dataset-17-tea.json', 'utf-8'));

// Initialize services
const effectService = new EffectService({ useNewModel: true });
const timeMatcher = new TimeMatcher();
const seasonMatcher = new SeasonMatcher();
const foodMatcher = new FoodMatcher();
const activityMatcher = new ActivityMatcher();

// Mock analysis objects for matchers
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

// Mood to Effect Mapping (8 core effects only)
// Includes all exact phrases from 17-tea dataset for complete matching
const moodEffectMapping = {
  // Core mapped effects
  'calming': ['calming', 'centering'],
  'relaxing': ['calming', 'centering'],
  'energizing': ['invigorating', 'clarifying'],
  'energized': ['invigorating', 'clarifying'],
  'alerting': ['invigorating', 'clarifying'],
  'alertness': ['invigorating', 'clarifying'],
  'alert': ['invigorating', 'clarifying'],
  'mental clarity': ['clarifying', 'invigorating'],
  'clear-headed': ['clarifying', 'invigorating'],
  'mental alertness': ['clarifying', 'invigorating'],
  'concentration': ['clarifying', 'centering'],
  'focus': ['clarifying', 'centering'],
  'focus and alertness': ['clarifying', 'invigorating'],
  'focus and energy': ['invigorating', 'clarifying'],
  'gentle energy boost': ['uplifting', 'invigorating'],
  'gentle alertness': ['uplifting', 'invigorating'],
  'balanced energy': ['harmonizing', 'centering'],
  'balanced and calm': ['harmonizing', 'calming'],
  'balanced state of mind': ['harmonizing', 'centering'],
  'steady energy': ['centering', 'nourishing'],
  'enhances efficiency': ['clarifying', 'invigorating'],
  'improves thinking': ['clarifying', 'invigorating'],
  'improves concentration': ['clarifying', 'centering'],
  'improves alertness': ['clarifying', 'invigorating'],
  'stress reduction': ['calming', 'centering'],
  'reduces anxiety': ['calming', 'centering'],
  'reduces fatigue': ['invigorating', 'clarifying'],
  'refreshing': ['clarifying', 'invigorating'],
  'invigorating': ['invigorating', 'clarifying'],
  'lift spirits': ['uplifting', 'harmonizing'],
  'bright and powerful': ['clarifying', 'invigorating'],
  'promotes relaxation': ['calming', 'centering'],
  'mindful alertness': ['clarifying', 'centering'],
  'mindful tasting': ['clarifying', 'centering'],
  'balanced energy boost': ['harmonizing', 'invigorating'],
  'gentle start to the day': ['calming', 'uplifting'],
  'calming effect': ['calming', 'centering'],
  'boosts energy': ['invigorating', 'uplifting'],
  'promotes a sense of calm': ['calming', 'centering'],
  'expelling dampness': ['releasing', 'centering'],
  'releasing': ['releasing', 'centering'],
  'deep sustenance': ['nourishing', 'centering'],
  'nourishing': ['nourishing', 'centering'],
  'digestive aid': ['releasing', 'nourishing'],

  // Additional phrases from 17-tea dataset
  'aids in mental clarity': ['clarifying', 'invigorating'],
  'aids in relaxation and stress reduction': ['calming', 'centering'],
  'enhances alertness and concentration': ['clarifying', 'invigorating'],
  'enhances mental clarity': ['clarifying', 'invigorating'],
  'enhances mental focus and alertness': ['clarifying', 'invigorating'],
  'gentle energy boost': ['uplifting', 'invigorating'],
  'gentler start to the day': ['calming', 'uplifting'],
  'improves concentration and alertness': ['clarifying', 'invigorating'],
  'improves mental alertness': ['clarifying', 'invigorating'],
  'induce a sense of relaxation': ['calming', 'centering'],
  'provides an energy boost': ['invigorating', 'uplifting'],
  'reduces anxiety and stress': ['calming', 'centering'],
  'promotes a balanced and calm state of mind': ['harmonizing', 'calming'],
  'promotes a sense of calm and focus': ['calming', 'centering'],
  'promotes a sense of calm and stress reduction': ['calming', 'centering'],
  'can lift spirits': ['uplifting', 'harmonizing'],
  'can also be calming and relaxing': ['calming', 'centering'],
  'can also be relaxing': ['calming', 'centering'],
  'can have a calming effect': ['calming', 'centering'],
  'can enhance energy and focus': ['invigorating', 'clarifying'],
  'creates a \'clear-headed\' energy': ['clarifying', 'invigorating'],
  'calming effect that can clear the mind': ['clarifying', 'calming'],
};

// Fuzzy match helper (from previous test)
function fuzzyMatch(actual, expected, threshold = 0.6) {
  const actualLower = (actual || '').toLowerCase();
  const expectedLower = (expected || '').toLowerCase();

  if (actualLower === expectedLower) return 1.0;
  if (actualLower.includes(expectedLower) || expectedLower.includes(actualLower)) return 0.8;

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

// Check if mood effect matches API effect
function checkMoodEffectMatch(moodPhrase, apiDominant, apiSupporting) {
  const moodLower = (moodPhrase || '').toLowerCase().trim();
  const possibleEffects = moodEffectMapping[moodLower] || [];

  // Check if either API effect matches the mapped effects
  for (const possibleEffect of possibleEffects) {
    if (apiDominant === possibleEffect || apiSupporting === possibleEffect) {
      return 1.0;  // Primary effect match
    }
  }

  // Check if mood phrase mentions the API effect directly
  if (moodLower.includes(apiDominant) || moodLower.includes(apiSupporting)) {
    return 0.8;  // Partial match
  }

  return 0.0;
}

// Results tracking
const results = {
  total: 0,
  passed: 0,
  moodEffectsMatched: 0,
  moodEffectsTotal: 0,
  foodMatched: 0,
  foodTotal: 0,
  activitiesMatched: 0,
  activitiesTotal: 0,
  timeMatched: 0,
  timeTotal: 0,
  seasonMatched: 0,
  seasonTotal: 0,
  details: []
};

console.log('\n');
console.log('████████████████████████████████████████████████████████████████████████████████');
console.log('█ VALIDATION TEST - 17 TEA DIVERSITY DATASET');
console.log('████████████████████████████████████████████████████████████████████████████████\n');

// Helper to map tea type to our format
function mapTeaType(teaType) {
  const mapping = {
    'green': 'green',
    'white': 'white',
    'yellow': 'yellow',
    'oolong': 'oolong',
    'puerh': 'puerh',
    'dark': 'dark',
    'red/black': 'black',
    'red': 'black'
  };
  return mapping[teaType.toLowerCase()] || 'green';
}

// Test each tea
for (const validation of validationData) {
  results.total++;

  // Convert validation data to API format
  const teaData = {
    name: validation.name,
    type: mapTeaType(validation.type),
    caffeineLevel: validation.characteristics?.caffeine_level ? mapCaffeineLevel(validation.characteristics.caffeine_level) : 5,
    lTheanineLevel: 5,  // Default - not provided in this dataset
    flavor: {
      primary: [],  // Not explicitly provided, would be extracted from flavor_profile
      intensity: 'moderate'
    },
    geography: {
      altitude: 1000,  // Default
      temperature: 15,
      humidity: 70,
      solarRadiation: 150
    },
    processing: {
      methods: [],  // Not in this dataset
      oxidationLevel: 30,
      roastLevel: 'light'
    }
  };

  let passed = true;
  const detail = {
    name: validation.name,
    type: validation.type,
    metrics: {
      moodEffects: 0,
      food: 0,
      activities: 0,
      timing: 0,
      season: 0
    },
    results: {
      moodEffects: [],
      food: [],
      activities: [],
      timing: null,
      season: null
    }
  };

  try {
    // Run effect analysis
    const effectResult = effectService.infer(teaData);
    const timeResult = timeMatcher.matchTime(teaData, mockCompoundAnalysis, mockTeaTypeAnalysis, mockFlavorAnalysis);
    const seasonResult = seasonMatcher.matchSeason(teaData);
    const foodResult = foodMatcher.matchFood(teaData, mockFlavorAnalysis, mockCompoundAnalysis, mockTeaTypeAnalysis);
    const activityResult = activityMatcher.matchActivity(teaData, mockCompoundAnalysis, mockTeaTypeAnalysis, mockFlavorAnalysis);

    const apiDominant = effectResult.expectedEffects.dominant || '';
    const apiSupporting = effectResult.expectedEffects.supporting || '';

    // === MOOD ENERGY EFFECTS ACCURACY ===
    if (validation.characteristics?.mood_energy_effects && Array.isArray(validation.characteristics.mood_energy_effects)) {
      validation.characteristics.mood_energy_effects.forEach(moodPhrase => {
        results.moodEffectsTotal++;
        const match = checkMoodEffectMatch(moodPhrase, apiDominant, apiSupporting);

        if (match >= 0.7) {
          results.moodEffectsMatched++;
          detail.metrics.moodEffects += 1;
          detail.results.moodEffects.push({ mood: moodPhrase, status: '✓' });
        } else {
          detail.results.moodEffects.push({ mood: moodPhrase, status: '✗' });
          passed = false;
        }
      });
    }

    // === TIMING ACCURACY ===
    results.timeTotal++;
    const validationTimes = validation.best_time_of_day || [];
    const apiTimes = timeResult.recommendedTimes.slice(0, 3).map(t => {
      const hour = t.hour;
      if (hour < 12) return 'Morning';
      if (hour < 17) return 'Afternoon';
      if (hour < 21) return 'Evening';
      return 'Night';
    });

    const timeMatch = validationTimes.some(vt => apiTimes.includes(vt));
    if (timeMatch) {
      results.timeMatched++;
      detail.metrics.timing = 1;
      detail.results.timing = `✓ ${apiTimes[0]}`;
    } else {
      detail.results.timing = `✗ API: ${apiTimes[0]}, Expected: ${validationTimes[0]}`;
      passed = false;
    }

    // === SEASON ACCURACY ===
    results.seasonTotal++;
    const validationSeasons = validation.best_season || [];
    const apiSeasons = seasonResult.recommendedSeasons.map(s => s.season?.toLowerCase() || '');

    const seasonMatch = validationSeasons.some(vs =>
      apiSeasons.some(as => fuzzyMatch(as, vs.toLowerCase()) >= 0.7)
    );

    if (seasonMatch) {
      results.seasonMatched++;
      detail.metrics.season = 1;
      detail.results.season = `✓ ${apiSeasons[0]}`;
    } else {
      detail.results.season = `✗ API: ${apiSeasons[0]}, Expected: ${validationSeasons[0]}`;
      passed = false;
    }

    // === FOOD PAIRING ACCURACY ===
    const validationFoods = validation.food_pairings || [];
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
    const validationActivities = validation.activities || [];
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
    detail.apiEffects = { dominant: apiDominant, supporting: apiSupporting };

    results.details.push(detail);

  } catch (error) {
    detail.status = '❌';
    detail.error = error.message;
    results.details.push(detail);
    passed = false;
  }
}

// === PRINT RESULTS ===
console.log('📊 OVERALL ACCURACY METRICS');
console.log('─'.repeat(80));
console.log(`✅ Teas with valid analysis: ${results.passed}/${results.total} (${(results.passed/results.total*100).toFixed(1)}%)`);
console.log(`\n💫 MOOD/ENERGY EFFECTS ACCURACY`);
console.log(`  Matches: ${results.moodEffectsMatched}/${results.moodEffectsTotal} (${(results.moodEffectsMatched/results.moodEffectsTotal*100).toFixed(1)}%)`);
console.log(`\n⏰ TIMING ACCURACY`);
console.log(`  Best times of day: ${results.timeMatched}/${results.timeTotal} (${(results.timeMatched/results.timeTotal*100).toFixed(1)}%)`);
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
    console.log(`   API Effects: ${detail.apiEffects.dominant} / ${detail.apiEffects.supporting}`);
    if (detail.results.moodEffects.length > 0) {
      console.log(`   Mood Effects: ${detail.results.moodEffects.map(m => m.status).join('/')}`);
    }
    console.log(`   Timing: ${detail.results.timing} | Season: ${detail.results.season}`);
    console.log(`   Metrics: Mood:${detail.metrics.moodEffects.toFixed(1)} Food:${detail.metrics.food.toFixed(1)} Act:${detail.metrics.activities.toFixed(1)}`);
  }
});

console.log('\n' + '████████████████████████████████████████████████████████████████████████████████');
console.log('█ VALIDATION COMPLETE');
console.log('████████████████████████████████████████████████████████████████████████████████\n');

// Helper: Map caffeine level text to numeric
function mapCaffeineLevel(level) {
  const mapping = {
    'low': 2,
    'low to moderate': 3,
    'moderate': 5,
    'moderate to high': 7,
    'high': 8
  };
  return mapping[level.toLowerCase()] || 5;
}
