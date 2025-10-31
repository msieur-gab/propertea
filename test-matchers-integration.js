import { RecommendationService } from './backend/src/services/RecommendationService.js';

const recService = new RecommendationService();

// Mock core analysis with sample data
const mockTeaModel = {
  name: 'Green Tea',
  type: 'green',
  caffeineLevel: 5,
  lTheanineLevel: 4
};

const mockCoreAnalysis = {
  compounds: {
    levels: {
      caffeineLevel: 5,
      lTheanineLevel: 4,
      lTheanineToCaffeineRatio: 0.8
    },
    analysis: {
      stimulationLevel: 'moderate',
      relaxationLevel: 'moderate',
      compoundProfile: 'Balanced'
    }
  },
  teaType: {
    teaType: 'green',
    subType: null,
    analysis: {
      typicalCaffeine: 'medium'
    }
  },
  processing: {
    roastLevel: 'None'
  },
  flavor: {
    profile: {
      identified: ['Vegetal', 'Grassy']
    }
  },
  geography: {
    altitude: 1200,
    temperature: 15,
    humidity: 70
  }
};

console.log('Testing Recommendation Service with Matchers...\n');

// Test TimeMatcher
console.log('=== TimeMatcher Results ===');
const timingResult = recService.getTimingRecommendations(mockTeaModel, mockCoreAnalysis);
console.log(timingResult.success ? 'SUCCESS' : 'FAILED');
if (timingResult.success) {
  const times = timingResult.recommendations?.recommendedTimes || [];
  console.log(`Recommended times count: ${times.length}`);
  console.log(`Hourly scores available: ${Object.keys(timingResult.recommendations?.hourlyScores || {}).length}`);
}

// Test SeasonMatcher
console.log('\n=== SeasonMatcher Results ===');
const seasonResult = recService.getSeasonalRecommendations(mockTeaModel, mockCoreAnalysis);
console.log(seasonResult.success ? 'SUCCESS' : 'FAILED');
if (seasonResult.success) {
  console.log('Seasonal recommendation type:', typeof seasonResult.recommendations);
}

// Test ActivityMatcher
console.log('\n=== ActivityMatcher Results ===');
const activityResult = recService.getActivityRecommendations(mockTeaModel, mockCoreAnalysis);
console.log(activityResult.success ? 'SUCCESS' : 'FAILED');
if (activityResult.success) {
  console.log('Activity recommendation type:', typeof activityResult.recommendations);
}

// Test FoodMatcher
console.log('\n=== FoodMatcher Results ===');
const foodResult = recService.getFoodRecommendations(mockTeaModel, mockCoreAnalysis);
console.log(foodResult.success ? 'SUCCESS' : 'FAILED');
if (foodResult.success) {
  console.log('Food recommendation type:', typeof foodResult.recommendations);
}

// Test BrewingMatcher
console.log('\n=== BrewingMatcher Results ===');
const brewingResult = recService.getBrewingRecommendations(mockTeaModel, mockCoreAnalysis);
console.log(brewingResult.success ? 'SUCCESS' : 'FAILED');
if (brewingResult.success) {
  const styles = Object.keys(brewingResult.recommendations);
  console.log('Brewing styles available:', styles.join(', '));
}

console.log('\n=== Summary ===');
const results = [timingResult, seasonResult, activityResult, foodResult, brewingResult];
const successful = results.filter(r => r.success).length;
console.log(`${successful}/${results.length} matchers executed successfully`);
