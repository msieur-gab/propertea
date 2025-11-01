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
        region: 'Taiwan, Chiayi, Alishan Mountains',
        elevation: '1400m (High Mountain Oolong)',
        oxidationLevel: 40,
        roastLevel: 'light',
        analysisQuality: {
          dataCompleteness,
          estimatedConfidence: validation.summary.estimatedConfidence,
          warningsCount: validation.warnings.length
        },
        overallNarrative: `Alishan Oolong is a premium high-mountain oolong from Taiwan's Alishan region. With its moderate oxidation (40%) and light roasting, this tea balances the fresh, fruity character of lightly oxidized oolongs with subtle roasted complexity. The high altitude (1400m) and cool climate create a naturally sweet, orchid-forward profile with remarkable smoothness. This is a tea for refined palates seeking harmony and contemplation.`
      },
      effects: {
        profile: effectResult.description.summary,
        detailed: `This ${alishanOolong.name}'s dominant effect is ${effectResult.expectedEffects.dominant} — ${effectResult.description.dominant.description}, supported by ${effectResult.expectedEffects.supporting} characteristics — ${effectResult.description.supporting.description}`,
        dominant: {
          effect: effectResult.expectedEffects.dominant,
          description: effectResult.description.dominant.description,
          score: Math.round(effectResult.description.dominant.score),
          confidence: Math.round(effectResult.confidence.overall),
          narrative: `The ${effectResult.expectedEffects.dominant} effect is pronounced in this tea due to its balanced caffeine-to-L-theanine ratio (6:5). This creates a gentle equilibrium that neither overstimulates nor sedates, but rather centers your awareness and calms mental chatter. Perfect for moments when you need clarity without jitteriness.`
        },
        supporting: {
          effect: effectResult.expectedEffects.supporting,
          description: effectResult.description.supporting.description,
          score: Math.round(effectResult.description.supporting.score),
          confidence: Math.round(effectResult.confidence.overall - 3),
          narrative: `The ${effectResult.expectedEffects.supporting} quality enhances the primary effect by creating an uplifting quality. Where grounding energy centers you downward, this elevation lifts your mood and opens your perspective. Together they create a uniquely balanced experience.`
        },
        overallConfidence: effectResult.confidence.overall,
        interpretation: `This is a ${effectResult.confidence.overall >= 90 ? 'highly confident' : 'well-supported'} analysis based on the tea's documented chemical profile and terroir characteristics. The balanced compound profile (6:5 caffeine-to-L-theanine) combined with the moderate roasting creates a predictable and consistent effect pattern.`
      },
      timing: {
        narrative: `Alishan Oolong is ideally enjoyed during the afternoon, when its balanced energy supports both relaxation and gentle engagement with the world.`,
        bestTime: {
          hour: 12,
          ampm: 'PM',
          description: 'Perfect timing - at noon, when daytime brightness peaks'
        },
        optimalTimes: timeResult.recommendedTimes.slice(0, 3).map(t => {
          const ampm = t.hour < 12 ? 'AM' : 'PM';
          const hourDisplay = t.hour % 12 || 12;
          const timeDescriptions = {
            12: 'Midday peak - perfect energy balance',
            13: 'Early afternoon - sustained harmony',
            14: 'Mid-afternoon - gentle wind-down begins'
          };
          return {
            hour: t.hour,
            display: `${hourDisplay}:00 ${ampm}`,
            score: t.score,
            confidence: t.confidence,
            description: timeDescriptions[t.hour] || 'Good afternoon window'
          };
        }),
        idealRange: timeResult.idealRanges[0] ? {
          start: timeResult.idealRanges[0].start % 12 || 12,
          end: timeResult.idealRanges[0].end % 12 || 12,
          startAmpm: timeResult.idealRanges[0].start < 12 ? 'AM' : 'PM',
          endAmpm: timeResult.idealRanges[0].end < 12 ? 'AM' : 'PM',
          score: timeResult.idealRanges[0].score,
          confidence: timeResult.idealRanges[0].confidence,
          narrative: `Between 9:00 AM and 5:00 PM provides an ideal 8-hour window. The afternoon hours (12 PM - 5 PM) are optimal for full effect appreciation. Morning consumption is less ideal due to the tea's naturally calming undertone.`
        } : null
      },
      seasons: {
        narrative: `Alishan Oolong pairs beautifully with the transitional seasons when contemplation becomes valuable.`,
        recommended: seasonResult.recommendedSeasons.slice(0, 3).map(s => ({
          season: s.season || 'Spring/Autumn',
          score: s.score,
          confidence: s.confidence,
          description: {
            'Spring': 'Fresh mountain air meets fresh tea character - renewal and rebirth',
            'Autumn': 'The cooling temperatures complement the tea\'s calming nature beautifully',
            'Summer': 'Refreshing choice as afternoon heat builds',
            'Winter': 'Warming and grounding for darker months'
          }[s.season] || 'Good year-round, though especially in transitional seasons'
        }))
      },
      food: {
        narrative: `Alishan's fruity, honey-forward profile with creamy texture pairs elegantly with foods that don't overpower its delicate complexity.`,
        topPairings: foodResult.recommendedFoods.slice(0, 3).map(f => ({
          name: f.name,
          score: f.score,
          confidence: f.confidence,
          whyItWorks: {
            'Fruits': 'The tea\'s natural fruitiness harmonizes with fresh fruit - raspberries, peaches, or apples enhance each other',
            'Yogurt': 'Creamy texture mirrors the tea\'s smooth mouthfeel. Pairs beautifully at breakfast or afternoon break',
            'Light Desserts': 'Almond cakes, shortbread, or honey pastries complement without overwhelming. The tea\'s sweetness shines',
            'Light Pastries': 'Croissants or scones echo the tea\'s delicate, buttery undertones',
            'Cheese': 'Mild cheeses (gouda, mild cheddar) create sophisticated flavor bridges'
          }[f.name] || 'Complements the tea\'s fruity, honey-forward character'
        })),
        mealClusters: foodResult.mealClusters.slice(0, 2).map(c => ({
          occasion: c.occasion,
          score: c.score,
          confidence: c.confidence,
          context: {
            'Breakfast': 'Start your day with grace - Alishan\'s balanced energy eases you into morning',
            'Afternoon Tea': 'The classic afternoon ritual - this tea elevates the experience with its sophisticated profile',
            'Lunch': 'Light lunch pairings highlight the tea\'s refreshing qualities',
            'Dinner': 'As an after-dinner tea (caffeine-moderate), aids digestion and creates a calm evening'
          }[c.occasion] || 'An excellent pairing opportunity'
        }))
      },
      activities: {
        narrative: `This tea's harmonizing, gently elevating nature suits activities requiring both presence and lightness of being.`,
        topActivities: activityResult.recommendedActivities.slice(0, 5).map(a => ({
          name: a.name,
          score: a.score,
          confidence: a.confidence,
          whyItMatches: {
            'Reading': 'The tea\'s focused calm creates perfect conditions for deep engagement with text. Natural pairing for contemplative reading',
            'Conversation': 'Balanced energy supports social connection without over-stimulation. Creates warmth and presence',
            'Work/Focus': 'Sustained mental clarity without the crash - ideal for afternoon productivity',
            'Meditation': 'Calming without sedation enables clear, peaceful awareness',
            'Writing': 'Unlocks creative flow - the balanced compound profile supports both idea generation and expression',
            'Journaling': 'Encourages introspection and honest self-expression through its grounding influence',
            'Creative Projects': 'Harmonizes left/right brain function for genuine creative engagement'
          }[a.name] || 'Supports engaged, present activity'
        })),
        activityClusters: activityResult.activityClusters.slice(0, 3).map(c => ({
          theme: c.theme,
          score: c.score,
          confidence: c.confidence,
          narrative: {
            'Focus & Productivity': 'Alishan supports afternoon work sessions with clarity and calm focus - you stay sharp without anxiety',
            'Social Engagement': 'The tea\'s harmony and gentle uplift make it perfect for meaningful connection and conversation',
            'Mindfulness & Relaxation': 'Creates the ideal mental state for meditation, yoga, or breathing practices',
            'Creative Pursuits': 'Unlocks creative flow and expression across any artistic medium',
            'Contemplative & Reflective': 'Encourages deep thinking and self-inquiry - excellent for journaling or philosophical reflection'
          }[c.theme] || 'A natural match for this activity cluster'
        }))
      },
      brewing: {
        gongfu: {
          leafAmount: '5-6g per 100ml water',
          waterTemp: '90-95°C (194-203°F)',
          steepingTimes: [20, 30, 40, 50],
          infusions: '5-8+ infusions possible',
          vessel: 'Gaiwan or small clay teapot',
          narrative: `Gongfu brewing reveals Alishan's full complexity. Start with 20-second infusions, increasing by 10 seconds each round. The first infusion can be quick (10-15s) to "rinse" the leaves. You'll notice new flavors emerge in each subsequent infusion - this is the tea revealing its layers.`
        },
        western: {
          leafAmount: '1 heaping teaspoon per 8oz water (or 5-7g per 500ml)',
          waterTemp: '90-95°C (194-203°F)',
          steepingTime: '3-5 minutes',
          resteeps: '2-3 additional infusions (add 1-2 minutes each)',
          vessel: 'Ceramic or porcelain teapot',
          narrative: `For western-style brewing, use a generous leaf amount and hotter water. Steep 3-5 minutes for your first infusion. This tea benefits from multiple steepings - don't discard after one cup. Subsequent infusions develop different flavor notes and create a longer tea experience.`
        },
        storage: 'Keep in an airtight container away from light, heat, and strong odors. Oolongs age gracefully - this tea will develop deeper character over 2-5 years if stored properly.',
        quality_notes: 'This is a premium high-mountain oolong. The leaves should be tightly rolled and fragrant. Color when brewed should be golden to light amber. Aroma should feature orchid, honey, and subtle roasted notes.'
      },
      recommendations: {
        bestFor: 'Afternoon moments requiring focus, creativity, or meaningful connection',
        avoidWhen: 'Late evening if you\'re caffeine-sensitive - the 6/10 caffeine level may disrupt sleep',
        idealFrequency: '2-3 times per week for regular enjoyment; daily use can diminish appreciation',
        comparison: 'Like other high-mountain Taiwan oolongs (Tie Guan Yin, Da Yu Ling), but with a unique fruity-honey character and lighter roast'
      }
    },
    metadata: {
      requestId,
      timestamp: new Date().toISOString(),
      processingTimeMs: responseTime,
      dataQuality: {
        completeness: dataCompleteness,
        estimatedConfidence: validation.summary.estimatedConfidence,
        interpretation: dataCompleteness >= 90 ? 'Excellent - highly reliable analysis' : dataCompleteness >= 75 ? 'Good - solid recommendations' : 'Fair - additional data would improve accuracy'
      },
      version: '2.0.0-literate'
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
  const dominantEffect = fullData.effects.dominant;
  console.log(`  ${dominantEffect.effect}: ${dominantEffect.score}/100`);
  console.log(`  Confidence: ${dominantEffect.confidence}%`);
  console.log(`  "${dominantEffect.description}"`);
  console.log(`\n  Narrative: ${dominantEffect.narrative}`);

  console.log(`\n⏰ BEST TIMES TO DRINK:`);
  console.log(`  ${fullData.timing.narrative}`);
  fullData.timing.optimalTimes.forEach(time => {
    console.log(`\n  ${time.display}`);
    console.log(`    Score: ${time.score}% | Confidence: ${time.confidence}%`);
    console.log(`    ${time.description}`);
  });
  if (fullData.timing.idealRange) {
    console.log(`\n  💫 Ideal Window: ${fullData.timing.idealRange.start}:00 ${fullData.timing.idealRange.startAmpm} - ${fullData.timing.idealRange.end}:00 ${fullData.timing.idealRange.endAmpm}`);
    console.log(`  ${fullData.timing.idealRange.narrative}`);
  }

  console.log(`\n🌍 BEST SEASONS:`);
  console.log(`  ${fullData.seasons.narrative}`);
  fullData.seasons.recommended.slice(0, 2).forEach((season, i) => {
    if (season.season !== 'Spring/Autumn' || i === 0) {
      console.log(`  • ${season.season}: ${season.score}% match`);
    }
  });

  console.log(`\n🍽️  TOP FOOD PAIRINGS:`);
  console.log(`  ${fullData.food.narrative}`);
  fullData.food.topPairings.forEach(pairing => {
    console.log(`\n  ${pairing.name}`);
    console.log(`    Score: ${pairing.score}% | Confidence: ${pairing.confidence}%`);
    console.log(`    Why it works: ${pairing.whyItWorks}`);
  });

  console.log(`\n🎯 BEST ACTIVITIES:`);
  console.log(`  ${fullData.activities.narrative}`);
  fullData.activities.topActivities.forEach(activity => {
    console.log(`\n  ${activity.name}`);
    console.log(`    Score: ${activity.score}% | Confidence: ${activity.confidence}%`);
    console.log(`    ${activity.whyItMatches}`);
  });

  if (fullData.brewing) {
    console.log(`\n🍵 BREWING GUIDE:`);
    console.log(`\n  Gongfu Style:`);
    console.log(`    ${fullData.brewing.gongfu.narrative}`);
    console.log(`\n  Western Style:`);
    console.log(`    ${fullData.brewing.western.narrative}`);
  }

  if (fullData.recommendations) {
    console.log(`\n💡 RECOMMENDATIONS:`);
    console.log(`  Best for: ${fullData.recommendations.bestFor}`);
    console.log(`  Avoid when: ${fullData.recommendations.avoidWhen}`);
    console.log(`  Ideal frequency: ${fullData.recommendations.idealFrequency}`);
  }

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
