import fs from 'fs';
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

const mockCompoundAnalysis = {
    analysis: { compoundProfile: 'Balanced', stimulationLevel: 'medium', relaxationLevel: 'moderate', bodyImpact: 'balanced' }
};

const mockTeaTypeAnalysis = { analysis: { baseActivityHints: [] }, primaryType: 'oolong' };
const mockFlavorAnalysis = {
    analysis: { foodPairingHints: [], activityHints: [] },
    profile: { categories: [], dominant: [], intensity: 'Moderate' }
};

const activityMatcher = new ActivityMatcher();
const activityResult = activityMatcher.matchActivity(teaData, mockCompoundAnalysis, mockTeaTypeAnalysis, mockFlavorAnalysis);

console.log('All recommended activities:');
activityResult.recommendedActivities.slice(0, 20).forEach((a, i) => {
    console.log(i+1 + '. ' + a.name + ' (' + a.score.toFixed(2) + ')');
});
