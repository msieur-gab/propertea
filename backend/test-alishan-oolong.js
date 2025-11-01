/**
 * test-alishan-oolong.js - Test the Phase 2 system with Alishan Oolong
 *
 * Shows what a real API call would return for a specific tea
 */

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

// Mock analysis objects (same as in integration test)
const mockCompoundAnalysis = {
  analysis: {
    compoundProfile: 'Balanced & Focused',
    stimulationLevel: 'medium',
    relaxationLevel: 'moderate',
    bodyImpact: 'balanced'
  }
};

const mockTeaTypeAnalysis = {
  analysis: {
    baseActivityHints: ['Afternoon', 'Social']
  },
  primaryType: 'oolong'
};

const mockFlavorAnalysis = {
  analysis: {
    foodPairingHints: ['Light Pastries', 'Fresh Fruit'],
    activityHints: ['Conversation', 'Reading'],
    bodyImpact: 'balanced'
  },
  profile: {
    categories: ['fruity', 'floral', 'sweet'],
    dominant: ['fruity', 'orchid', 'honey'],
    intensity: 'Moderate'
  }
};

// Alishan Oolong tea data
const alishanOolong = {
  name: 'Alishan Oolong',
  type: 'oolong',
  caffeineLevel: 6,
  lTheanineLevel: 5,
  flavor: {
    primary: ['fruity', 'orchid', 'honey'],
    secondary: ['sweet', 'creamy'],
    intensity: 'moderate'
  },
  geography: {
    country: 'Taiwan',
    province: 'Chiayi',
    location: 'Alishan Mountains',
    altitude: 1400,
    temperature: 12,
    humidity: 78,
    solarRadiation: 120
  },
  processing: {
    methods: ['rolling', 'roasting'],
    oxidationLevel: 40,
    roastLevel: 'light'
  },
  harvest: {
    season: 'spring'
  },
  storage: {
    ageInYears: 1,
    storageCondition: 'dry'
  },
  tags: ['fruity', 'floral', 'afternoon', 'social'],
  bestPairedFood: ['light pastries', 'fresh fruit', 'cheese'],
  optimalTemperature: 90,
  steepTime: 90,
  steepCount: 6
};

async function analyzeAlishanOolong() {
  const startTime = Date.now();
  const requestId = `req-alishan-${Date.now()}`;

  console.log('\n');
  console.log('████████████████████████████████████████████████████████████████████████████████');
  console.log('█ PROPERTEA API - ALISHAN OOLONG ANALYSIS');
  console.log('████████████████████████████████████████████████████████████████████████████████');
  console.log(`\nRequest ID: ${requestId}`);
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  // ========================================================================
  // STEP 1: VALIDATION
  // ========================================================================
  console.log('📋 STEP 1: VALIDATION');
  console.log('─'.repeat(80));

  const validation = SchemaValidator.validateTeaModel(alishanOolong);
  const dataCompleteness = calculateDataCompleteness(alishanOolong);

  console.log(`✅ Schema Validation: ${validation.isValid ? 'PASS' : 'FAIL'}`);
  console.log(`📊 Data Completeness: ${dataCompleteness}%`);
  console.log(`⚠️  Warnings: ${validation.warnings.length}`);

  if (validation.warnings.length > 0) {
    console.log(`\n  Warnings:`);
    validation.warnings.forEach((w, idx) => {
      console.log(`  ${idx + 1}. ${w.code} - ${w.field}`);
      console.log(`     → ${w.message}`);
    });
  }

  // ========================================================================
  // STEP 2: RECOMMENDATIONS
  // ========================================================================
  console.log('\n\n📊 STEP 2: RUNNING RECOMMENDATIONS');
  console.log('─'.repeat(80));

  console.log('Running: Effect Analysis...');
  const effectResult = effectService.infer(alishanOolong);

  console.log('Running: Time Analysis...');
  const timeResult = timeMatcher.matchTime(
    alishanOolong,
    mockCompoundAnalysis,
    mockTeaTypeAnalysis,
    mockFlavorAnalysis
  );

  console.log('Running: Season Analysis...');
  const seasonResult = seasonMatcher.matchSeason(alishanOolong);

  console.log('Running: Food Pairing Analysis...');
  const foodResult = foodMatcher.matchFood(
    alishanOolong,
    mockFlavorAnalysis,
    mockCompoundAnalysis,
    mockTeaTypeAnalysis
  );

  console.log('Running: Activity Analysis...');
  const activityResult = activityMatcher.matchActivity(
    alishanOolong,
    mockCompoundAnalysis,
    mockTeaTypeAnalysis,
    mockFlavorAnalysis
  );

  // ========================================================================
  // STEP 3: BUILD API RESPONSE
  // ========================================================================
  console.log('\n\n🎯 STEP 3: API RESPONSE STRUCTURE');
  console.log('─'.repeat(80));

  const responseTime = Date.now() - startTime;

  const apiResponse = {
    success: true,
    data: {
      summary: {
        teaName: alishanOolong.name,
        teaType: alishanOolong.type,
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
          name: f.name,
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
          name: a.name,
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

  console.log('\n📋 JSON API RESPONSE:');
  console.log('─'.repeat(80));
  console.log(JSON.stringify(apiResponse, null, 2));

  // ========================================================================
  // HUMAN-READABLE SUMMARY
  // ========================================================================
  console.log('\n\n📝 HUMAN-READABLE INTERPRETATION');
  console.log('─'.repeat(80));

  const summary = apiResponse.data.summary;
  const fullData = apiResponse.data;

  console.log(`\n🌿 Tea: ${summary.teaName} (${summary.teaType})`);
  console.log(`📊 Analysis Quality: ${summary.analysisQuality.dataCompleteness}% complete, ${summary.analysisQuality.estimatedConfidence}% confidence`);

  console.log(`\n💫 DOMINANT EFFECTS:`);
  console.log(`  ${fullData.effects.dominantEffect.effect}: ${fullData.effects.dominantEffect.score}/100`);
  console.log(`  Confidence: ${fullData.effects.confidence}%`);
  console.log(`  Description: ${fullData.effects.dominantEffect.description}`);

  console.log(`\n⏰ BEST TIMES TO DRINK:`);
  fullData.timing.optimalTimes.forEach(time => {
    const ampm = time.hour < 12 ? 'AM' : 'PM';
    const hour = time.hour % 12 || 12;
    console.log(`  ${hour}:00 ${ampm} - Score: ${time.score}%, Confidence: ${time.confidence}%`);
  });
  if (fullData.timing.idealRange) {
    const startHour = fullData.timing.idealRange.start % 12 || 12;
    const endHour = fullData.timing.idealRange.end % 12 || 12;
    console.log(`  Ideal Window: ${startHour}:00 - ${endHour}:00 (${fullData.timing.idealRange.score}% match)`);
  }

  console.log(`\n🌍 BEST SEASONS:`);
  fullData.seasons.recommended.forEach(season => {
    console.log(`  ${season.season}: ${season.score}% match (${season.confidence}% confidence)`);
  });

  console.log(`\n🍽️  TOP FOOD PAIRINGS:`);
  fullData.food.topPairings.forEach(pairing => {
    console.log(`  ${pairing.name}: ${pairing.score}% match (${pairing.confidence}% confidence)`);
  });

  console.log(`\n🎯 BEST ACTIVITIES:`);
  fullData.activities.topActivities.forEach(activity => {
    console.log(`  ${activity.name}: ${activity.score}% match (${activity.confidence}% confidence)`);
  });

  console.log(`\n⏱️  METADATA:`);
  console.log(`  Request ID: ${apiResponse.metadata.requestId}`);
  console.log(`  Processing Time: ${apiResponse.metadata.processingTimeMs}ms`);
  console.log(`  Data Quality: ${apiResponse.metadata.dataQuality.completeness}% complete`);
  console.log(`  Overall Confidence: ${apiResponse.metadata.dataQuality.estimatedConfidence}%`);

  if (apiResponse.warnings.length > 0) {
    console.log(`\n⚠️  DATA QUALITY WARNINGS:`);
    apiResponse.warnings.forEach((w, idx) => {
      console.log(`  ${idx + 1}. ${w.code}: ${w.message}`);
    });
  } else {
    console.log(`\n✅ No data quality warnings - all recommended fields provided!`);
  }

  console.log('\n' + '████████████████████████████████████████████████████████████████████████████████');
  console.log('');
}

analyzeAlishanOolong().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
