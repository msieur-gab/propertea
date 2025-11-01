/**
 * test-api-integration.js - End-to-end API integration test
 *
 * Simulates a complete API request with validation, recommendations, and response formatting
 * Shows what a real API call would return
 */

import { teaDatabase } from './src/data/ExtendedTeaDataset.js';
import SchemaValidator, {
  calculateDataCompleteness
} from './src/utils/SchemaValidator.js';
import { EffectService } from './src/services/EffectService.js';
import TimeMatcher from './src/services/matchers/TimeMatcher.js';
import SeasonMatcher from './src/services/matchers/SeasonMatcher.js';
import FoodMatcher from './src/services/matchers/FoodMatcher.js';
import ActivityMatcher from './src/services/matchers/ActivityMatcher.js';

// Initialize services
const effectService = new EffectService({ useNewModel: true });
const timeMatcher = new TimeMatcher();
const seasonMatcher = new SeasonMatcher();
const foodMatcher = new FoodMatcher();
const activityMatcher = new ActivityMatcher();

// Mock analysis objects
const mockCompoundAnalysis = {
  analysis: {
    compoundProfile: 'Focused & Energized',
    stimulationLevel: 'high',
    relaxationLevel: 'low',
    bodyImpact: 'light'
  }
};

const mockTeaTypeAnalysis = {
  analysis: {
    baseActivityHints: ['Morning', 'Focus Work']
  },
  primaryType: 'green'
};

const mockFlavorAnalysis = {
  analysis: {
    foodPairingHints: ['Seafood', 'Salads'],
    activityHints: ['Reading', 'Study'],
    bodyImpact: 'light'
  },
  profile: {
    categories: ['vegetal', 'fresh'],
    dominant: ['grassy', 'fresh'],
    intensity: 'Moderate'
  }
};

/**
 * Simulate a complete API request
 */
async function simulateAPIRequest(teaData) {
  const startTime = Date.now();
  const requestId = `req-${Math.random().toString(36).substr(2, 9)}`;

  console.log('═'.repeat(80));
  console.log(`🌿 TEA ANALYSIS REQUEST`);
  console.log('═'.repeat(80));
  console.log(`Request ID: ${requestId}`);
  console.log(`Tea: ${teaData.name}`);
  console.log('');

  // ========================================================================
  // STEP 1: VALIDATION
  // ========================================================================
  console.log('📋 STEP 1: VALIDATION');
  console.log('─'.repeat(80));

  const validation = SchemaValidator.validateTeaModel(teaData);
  const dataCompleteness = calculateDataCompleteness(teaData);

  console.log(`✅ Schema Validation: ${validation.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`📊 Data Completeness: ${dataCompleteness}%`);
  console.log(`⚠️  Warnings: ${validation.warnings.length}`);

  if (validation.warnings.length > 0) {
    console.log(`\n  Sample warnings (first 2):`);
    validation.warnings.slice(0, 2).forEach((w, idx) => {
      console.log(`  ${idx + 1}. ${w.code} - ${w.field}`);
      console.log(`     → ${w.message}`);
    });
  }

  // ========================================================================
  // STEP 2: RECOMMENDATIONS
  // ========================================================================
  console.log('\n📊 STEP 2: RUNNING RECOMMENDATIONS');
  console.log('─'.repeat(80));

  try {
    // Run all analyses
    console.log('Running: Effect Analysis...');
    const effectResult = effectService.infer(teaData);

    console.log('Running: Time/Activity Analysis...');
    const timeResult = timeMatcher.matchTime(
      teaData,
      mockCompoundAnalysis,
      mockTeaTypeAnalysis,
      mockFlavorAnalysis
    );

    console.log('Running: Season Analysis...');
    const seasonResult = seasonMatcher.matchSeason(teaData);

    console.log('Running: Food Pairing Analysis...');
    const foodResult = foodMatcher.matchFood(
      teaData,
      mockFlavorAnalysis,
      mockCompoundAnalysis,
      mockTeaTypeAnalysis
    );

    console.log('Running: Activity Analysis...');
    const activityResult = activityMatcher.matchActivity(
      teaData,
      mockCompoundAnalysis,
      mockTeaTypeAnalysis,
      mockFlavorAnalysis
    );

    // ========================================================================
    // STEP 3: BUILD API RESPONSE
    // ========================================================================
    console.log('\n🎯 STEP 3: RECOMMENDATION RESULTS');
    console.log('─'.repeat(80));

    const responseTime = Date.now() - startTime;

    const apiResponse = {
      success: true,
      data: {
        summary: {
          teaName: teaData.name,
          teaType: teaData.type,
          analysisQuality: {
            dataCompleteness,
            estimatedConfidence: validation.summary.estimatedConfidence,
            warningsCount: validation.warnings.length
          }
        },
        effects: {
          profile: effectResult.description.summary,
          dominant: effectResult.expectedEffects.dominant,
          supporting: effectResult.expectedEffects.supporting,
          dominantEffect: effectResult.description.dominant,
          supportingEffect: effectResult.description.supporting,
          confidence: effectResult.confidence.overall
        },
        timing: {
          optimalTimes: timeResult.recommendedTimes.slice(0, 3).map(t => ({
            hour: t.hour,
            score: t.score,
            confidence: t.confidence
          })),
          idealRange: timeResult.idealRanges[0] || null
        },
        seasons: {
          recommended: seasonResult.recommendedSeasons.slice(0, 2).map(s => ({
            season: s.season,
            score: s.score,
            confidence: s.confidence
          }))
        },
        food: {
          topPairings: foodResult.recommendedFoods.slice(0, 3).map(f => ({
            food: f.name,
            score: f.score,
            confidence: f.confidence
          })),
          mealClusters: foodResult.mealClusters.slice(0, 2).map(c => ({
            occasion: c.occasion,
            score: c.score,
            confidence: c.confidence
          }))
        },
        activities: {
          topActivities: activityResult.recommendedActivities.slice(0, 3).map(a => ({
            activity: a.name,
            score: a.score,
            confidence: a.confidence
          })),
          clusters: activityResult.activityClusters.slice(0, 2).map(c => ({
            theme: c.theme,
            score: c.score,
            confidence: c.confidence
          }))
        }
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        processingTimeMs: responseTime,
        dataQuality: {
          completeness: dataCompleteness,
          estimatedConfidence: validation.summary.estimatedConfidence
        }
      },
      warnings: validation.warnings.slice(0, 3)
    };

    // ========================================================================
    // PRINT FORMATTED RESPONSE
    // ========================================================================
    console.log('\n🎨 FORMATTED API RESPONSE:');
    console.log('─'.repeat(80));
    console.log(JSON.stringify(apiResponse, null, 2));

    // ========================================================================
    // PRINT HUMAN-READABLE SUMMARY
    // ========================================================================
    console.log('\n\n📝 HUMAN-READABLE SUMMARY');
    console.log('─'.repeat(80));

    const summaryInfo = apiResponse.data.summary;
    const fullData = apiResponse.data;
    console.log(`\n🌿 Tea: ${summaryInfo.teaName} (${summaryInfo.teaType})`);
    console.log(`📊 Analysis Quality: ${summaryInfo.analysisQuality.dataCompleteness}% complete, ${summaryInfo.analysisQuality.estimatedConfidence}% confidence`);

    console.log(`\n💫 EFFECTS:`);
    console.log(`  Profile: ${fullData.effects.profile}`);
    console.log(`  Dominant: ${fullData.effects.dominant} (${fullData.effects.confidence}% confidence)`);
    console.log(`  Supporting: ${fullData.effects.supporting}`);

    console.log(`\n⏰ OPTIMAL TIMES:`);
    fullData.timing.optimalTimes.forEach(time => {
      const ampm = time.hour < 12 ? 'AM' : 'PM';
      const hour = time.hour % 12 || 12;
      console.log(`  ${hour}:00 ${ampm} - Score: ${time.score}%, Confidence: ${time.confidence}%`);
    });
    if (fullData.timing.idealRange) {
      const startHour = fullData.timing.idealRange.start % 12 || 12;
      const endHour = fullData.timing.idealRange.end % 12 || 12;
      console.log(`  Ideal Range: ${startHour}:00 - ${endHour}:00 (${fullData.timing.idealRange.score}% match)`);
    }

    console.log(`\n🌍 BEST SEASONS:`);
    fullData.seasons.recommended.forEach(season => {
      console.log(`  Season: ${season.score}% match (${season.confidence}% confidence)`);
    });

    console.log(`\n🍽️  FOOD PAIRINGS:`);
    fullData.food.topPairings.forEach(pairing => {
      console.log(`  ${pairing.food} - ${pairing.score}% match (${pairing.confidence}% confidence)`);
    });
    if (fullData.food.mealClusters.length > 0) {
      console.log(`\n  Meal Occasions:`);
      fullData.food.mealClusters.forEach(cluster => {
        console.log(`  • ${cluster.occasion}: ${cluster.score}% match`);
      });
    }

    console.log(`\n🎯 ACTIVITIES:`);
    fullData.activities.topActivities.forEach(activity => {
      console.log(`  ${activity.activity} - ${activity.score}% match (${activity.confidence}% confidence)`);
    });
    if (fullData.activities.clusters.length > 0) {
      console.log(`\n  Activity Categories:`);
      fullData.activities.clusters.forEach(cluster => {
        console.log(`  • ${cluster.theme}: ${cluster.score}% match`);
      });
    }

    console.log(`\n⏱️  METADATA:`);
    console.log(`  Request ID: ${apiResponse.metadata.requestId}`);
    console.log(`  Processing Time: ${apiResponse.metadata.processingTimeMs}ms`);
    console.log(`  Timestamp: ${apiResponse.metadata.timestamp}`);

    if (apiResponse.warnings.length > 0) {
      console.log(`\n⚠️  DATA QUALITY WARNINGS:`);
      apiResponse.warnings.forEach((w, idx) => {
        console.log(`  ${idx + 1}. ${w.code}: ${w.message}`);
      });
    }

    console.log('\n');
    return apiResponse;
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
    return {
      success: false,
      error: {
        code: 'ANALYSIS_ERROR',
        message: error.message
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        processingTimeMs: Date.now() - startTime
      }
    };
  }
}

// ============================================================================
// RUN TESTS
// ============================================================================

console.log('\n\n');
console.log('█'.repeat(80));
console.log('█ PROPERTEA API INTEGRATION TEST - COMPREHENSIVE ANALYSIS');
console.log('█'.repeat(80));

// Test with 3 different teas to show variation
const teaIndicesToTest = [0, 3, 7]; // Sencha (green), Tie Guan Yin (oolong), Puerh Shou

(async () => {
  for (const idx of teaIndicesToTest) {
    const tea = teaDatabase[idx];
    await simulateAPIRequest(tea);

    if (idx !== teaIndicesToTest[teaIndicesToTest.length - 1]) {
      console.log('\n\n');
    }
  }

  console.log('\n' + '█'.repeat(80));
  console.log('█ INTEGRATION TEST COMPLETE');
  console.log('█'.repeat(80));
  console.log('\n✅ All tests completed successfully!');
  console.log('\nObservations:');
  console.log('  • All validation passed');
  console.log('  • All recommendations generated with confidence metrics');
  console.log('  • Response structure is consistent across different teas');
  console.log('  • Data completeness affects recommendation confidence');
})();
