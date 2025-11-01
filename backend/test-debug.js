import fs from 'fs';
import FoodMatcher from './src/services/matchers/FoodMatcher.js';
import ActivityMatcher from './src/services/matchers/ActivityMatcher.js';

const data = JSON.parse(fs.readFileSync('validation-dataset-17-tea.json', 'utf-8'));
const tea = data[0]; // Tie Guan Yin

const teaData = {
    name: tea.name,
    type: tea.type.toLowerCase(),
    caffeineLevel: 5,
    lTheanineLevel: 5,
    flavor: { primary: [], secondary: [], intensity: 'moderate' },
    geography: { altitude: 1000, temperature: 15, humidity: 70, solarRadiation: 150 },
    processing: { methods: [], oxidationLevel: 50, roastLevel: 'light' }
};

const mockFlavorAnalysis = {
    analysis: { foodPairingHints: [], activityHints: [] },
    profile: { categories: [], dominant: [], intensity: 'Moderate' }
};

const mockCompoundAnalysis = {
    analysis: { compoundProfile: 'Balanced', stimulationLevel: 'medium', relaxationLevel: 'moderate', bodyImpact: 'balanced' }
};

const mockTeaTypeAnalysis = { analysis: { baseActivityHints: [] }, primaryType: 'oolong' };

const foodMatcher = new FoodMatcher();
const activityMatcher = new ActivityMatcher();

const foodResult = foodMatcher.matchFood(teaData, mockFlavorAnalysis, mockCompoundAnalysis, mockTeaTypeAnalysis);
const activityResult = activityMatcher.matchActivity(teaData, mockCompoundAnalysis, mockTeaTypeAnalysis, mockFlavorAnalysis);

console.log('Expected foods:', tea.food_pairings);
console.log('Recommended foods:', foodResult.recommendedFoods.slice(0, 10).map(f => f.name));
console.log('\nExpected activities:', tea.activities);
console.log('Recommended activities:', activityResult.recommendedActivities.slice(0, 10).map(a => a.name));
