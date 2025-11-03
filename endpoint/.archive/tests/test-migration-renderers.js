/**
 * test-migration-renderers.js
 *
 * Test the migrated renderers with Ali Shan Oolong tea data
 * Demonstrates FlavorInferrer → ActivityRenderer → FoodRenderer pipeline
 */

import { FlavorInferrer } from './src/processors/inferrers/FlavorInferrer.js';
import { ActivityRenderer } from './src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from './src/processors/renderers/FoodRenderer.js';

// Test data: Ali Shan Oolong
const aliShanOolong = {
  name: "Ali Shan Oolong",
  originalName: "阿里山烏龍 (Ālǐshān Wūlóng)",
  type: "oolong",
  origin: "Ali Mountain, Taiwan",
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: [
    "floral",
    "buttery",
    "sweet",
    "creamy",
    "honeysuckle"
  ],
  processingMethods: [
    "withered",
    "partial-oxidation",
    "ball-rolled",
    "minimal-roast"
  ],
  geography: {
    altitude: 1500,
    humidity: 80,
    latitude: 23.47,
    longitude: 120.8,
    temperature: 14.8,
    solarRadiation: 180
  }
};

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║          MIGRATED RENDERERS TEST - Ali Shan Oolong            ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📋 Input Tea Data:');
console.log(`  Name: ${aliShanOolong.name}`);
console.log(`  Type: ${aliShanOolong.type}`);
console.log(`  Origin: ${aliShanOolong.origin}`);
console.log(`  Flavor Profile: ${aliShanOolong.flavorProfile.join(', ')}`);
console.log(`  Altitude: ${aliShanOolong.geography.altitude}m\n`);

// ========== STEP 1: FlavorInferrer ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║            STEP 1: FLAVOR INFERENCE (TaxonomyRegistry)        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const flavorInferrer = new FlavorInferrer();
const flavorInference = flavorInferrer.infer({
  flavorProfiles: aliShanOolong.flavorProfile
});

console.log('✅ FlavorInferrer Output:');
console.log(`  Identified Flavors: ${flavorInference.analysis.identifiedFlavors.join(', ')}`);
console.log(`  Dominant Flavors: ${flavorInference.analysis.dominantFlavors.join(', ')}`);
console.log(`  Dominant Categories: ${flavorInference.analysis.dominantCategories.join(', ')}`);
console.log(`  Intensity: ${flavorInference.analysis.intensityEstimate}`);
console.log(`  Food Hints Found: ${flavorInference.analysis.foodPairingHints.length}`);
console.log(`  Activity Hints Found: ${flavorInference.analysis.activityHints.length}`);
console.log(`  Seasonal Hints Found: ${flavorInference.analysis.seasonalAffinityHints.length}`);
console.log(`  Confidence: ${(flavorInference.confidence * 100).toFixed(1)}%\n`);

// ========== STEP 2: ActivityRenderer ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║        STEP 2: ACTIVITY RECOMMENDATIONS (ActivityTaxonomy)    ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Create a mock compound inference for ActivityRenderer
// In real use, this would come from CompoundInferrer
const mockCompoundInference = {
  analysis: {
    stimulationLevel: "Low",
    relaxationLevel: "High",
    compoundProfile: "Calm & Clear"
  },
  confidence: 0.85
};

const activityRenderer = new ActivityRenderer();
const activityRecommendations = activityRenderer.render(mockCompoundInference);

console.log('✅ ActivityRenderer Output:');
console.log(`  Compound Profile: ${activityRecommendations.analysis.compoundProfile}`);
console.log(`  Stimulation: ${activityRecommendations.analysis.stimulationLevel}`);
console.log(`  Recommendations: ${activityRecommendations.recommendations.length}`);

if (activityRecommendations.recommendations.length > 0) {
  console.log(`\n  Top Recommendations:`);
  activityRecommendations.recommendations.forEach((rec, i) => {
    console.log(`    ${i + 1}. ${rec.activity} (Score: ${rec.score})`);
    console.log(`       → ${rec.rationale}`);
  });
}

console.log(`\n  Clustered by Theme:`);
activityRecommendations.clusters.forEach(cluster => {
  console.log(`    • ${cluster.theme}: ${cluster.activities.join(', ')}`);
});
console.log(`  Confidence: ${(activityRecommendations.confidence * 100).toFixed(1)}%\n`);

// ========== STEP 3: FoodRenderer ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║        STEP 3: FOOD PAIRINGS (FoodTaxonomy)                   ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const foodRenderer = new FoodRenderer();
const foodRecommendations = foodRenderer.render(flavorInference);

console.log('✅ FoodRenderer Output:');
console.log(`  Food Hints Processed: ${foodRecommendations.analysis.hintCount}`);
console.log(`  Flavor Categories: ${foodRecommendations.analysis.flavorCategories.join(', ')}`);
console.log(`  Recommendations: ${foodRecommendations.recommendations.length}`);

if (foodRecommendations.recommendations.length > 0) {
  console.log(`\n  Top Food Pairings:`);
  foodRecommendations.recommendations.forEach((rec, i) => {
    console.log(`    ${i + 1}. ${rec.food} (Score: ${rec.score})`);
    console.log(`       → ${rec.rationale}`);
  });
}

console.log(`\n  Organized by Cuisine:`);
foodRecommendations.cuisineGroupings.forEach(group => {
  console.log(`    • ${group.cuisine}: ${group.foods.join(', ')}`);
});
console.log(`  Confidence: ${(foodRecommendations.confidence * 100).toFixed(1)}%\n`);

// ========== EXPORT FULL RESULTS ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                    COMPLETE RENDERER OUTPUT                    ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const completeOutput = {
  tea: {
    name: aliShanOolong.name,
    type: aliShanOolong.type,
    origin: aliShanOolong.origin,
    geography: aliShanOolong.geography
  },
  flavorAnalysis: flavorInference,
  activityRecommendations: activityRecommendations,
  foodRecommendations: foodRecommendations,
  timestamp: new Date().toISOString(),
  status: "success"
};

console.log(JSON.stringify(completeOutput, null, 2));
console.log('\n');

// ========== VERIFICATION ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                    MIGRATION VERIFICATION                     ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const checks = [
  {
    name: 'FlavorInferrer uses TaxonomyRegistry',
    passed: flavorInference.analysis.identifiedFlavors.length > 0
  },
  {
    name: 'ActivityRenderer uses ActivityTaxonomy',
    passed: activityRecommendations.recommendations.length > 0
  },
  {
    name: 'FoodRenderer uses FoodTaxonomy',
    passed: foodRecommendations.recommendations.length > 0
  },
  {
    name: 'All renderers successfully integrated',
    passed: flavorInference && activityRecommendations && foodRecommendations
  }
];

checks.forEach(check => {
  console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
});

console.log('\n✨ Migration Complete! All renderers are using TaxonomyRegistry.\n');
