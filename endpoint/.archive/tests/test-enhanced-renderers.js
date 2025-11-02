import { ActivityRenderer } from './src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from './src/processors/renderers/FoodRenderer.js';
import { BrewingRenderer } from './src/processors/renderers/BrewingRenderer.js';
import { FlavorInferrer } from './src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './src/processors/inferrers/CompoundInferrer.js';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║        ENHANCED RENDERERS WITH TAXONOMY DESCRIPTIONS          ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const testTeaData = {
  name: "Ali Shan Oolong",
  type: "oolong",
  subType: "high-mountain-oolong",
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: ["floral", "buttery", "sweet", "creamy", "honeysuckle"],
  processingMethods: ["withered", "partial-oxidation", "ball-rolled", "minimal-roast"]
};

// 1. Test ActivityRenderer with descriptions
console.log('1️⃣  ACTIVITY RENDERER WITH DESCRIPTIONS\n');
const compoundInferrer = new CompoundInferrer();
const compoundAnalysis = compoundInferrer.infer({
  caffeineLevel: testTeaData.caffeineLevel,
  lTheanineLevel: testTeaData.lTheanineLevel
});

const activityRenderer = new ActivityRenderer();
const activityRecommendations = activityRenderer.render(compoundAnalysis);

if (activityRecommendations.recommendations) {
  activityRecommendations.recommendations.forEach((rec, i) => {
    console.log(`  ${i+1}. ${rec.activity} (Score: ${rec.score})`);
    console.log(`     Description: ${rec.description}`);
    console.log(`     Rationale: ${rec.rationale}`);
    console.log(`     Timing: ${rec.timing}`);
    if (rec.benefits && rec.benefits.length > 0) {
      console.log(`     Benefits: ${rec.benefits.join(', ')}`);
    }
    console.log();
  });
}

// 2. Test FoodRenderer with descriptions and pairing techniques
console.log('2️⃣  FOOD RENDERER WITH DESCRIPTIONS & PAIRING TECHNIQUES\n');
const flavorInferrer = new FlavorInferrer();
const flavorAnalysis = flavorInferrer.infer({ flavorProfiles: testTeaData.flavorProfile });

const foodRenderer = new FoodRenderer();
const foodRecommendations = foodRenderer.render(flavorAnalysis);

if (foodRecommendations.recommendations) {
  foodRecommendations.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`  ${i+1}. ${rec.food} (Score: ${rec.score})`);
    console.log(`     Description: ${rec.description}`);
    console.log(`     Category: ${rec.category}`);
    console.log(`     Pairing Technique: ${rec.pairingTechnique}`);
    console.log(`     Rationale: ${rec.rationale}`);
    console.log();
  });
}

// 3. Test BrewingRenderer with both styles and vessels
console.log('3️⃣  BREWING RENDERER WITH DUAL STYLES & VESSEL RECOMMENDATIONS\n');
const brewingRenderer = new BrewingRenderer();
const brewingRecommendations = brewingRenderer.render(testTeaData, 'gongfu');

if (brewingRecommendations.tea) {
  console.log(`Tea: ${brewingRecommendations.tea.name}`);
  console.log(`Type: ${brewingRecommendations.tea.type}`);
  console.log(`Description: ${brewingRecommendations.tea.description}\n`);

  // Show both brewing styles
  if (brewingRecommendations.brewingStyles) {
    brewingRecommendations.brewingStyles.forEach((style, i) => {
      console.log(`\n  ${i === 0 ? '🔥' : '💧'} ${style.style.toUpperCase()} STYLE`);
      console.log(`     Philosophy: ${style.philosophy}`);
      console.log(`     Description: ${style.description}`);
      console.log(`     Temperature: ${style.parameters.temperature}°C`);
      console.log(`     Steep Time: ${style.parameters.steepTime}s`);
      console.log(`     Amount: ${style.parameters.amountPerGram}g/ml`);
      console.log(`     Infusions: ${style.parameters.infusions}`);

      if (style.vessels) {
        console.log(`\n     Recommended Vessel: ${style.vessels.recommended.name}`);
        console.log(`     → ${style.vessels.recommended.description}`);
        if (style.vessels.alternatives && style.vessels.alternatives.length > 0) {
          console.log(`\n     Alternative Vessels:`);
          style.vessels.alternatives.forEach(alt => {
            console.log(`     • ${alt.name}: ${alt.description}`);
          });
        }
      }

      if (style.guidance && style.guidance.length > 0) {
        console.log(`\n     Guidance:`);
        style.guidance.slice(0, 3).forEach(g => {
          console.log(`     • ${g}`);
        });
      }
    });
  }

  if (brewingRecommendations.recommendedStyle) {
    console.log(`\n\n  ✨ RECOMMENDED: ${brewingRecommendations.recommendedStyle.name.toUpperCase()}`);
    console.log(`     Reason: ${brewingRecommendations.recommendedStyle.reason}`);
  }
}

console.log('\n\n✅ Enhanced Renderers Successfully Demonstrating Taxonomy Data');
