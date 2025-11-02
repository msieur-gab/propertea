/**
 * test-flavor-food-pipeline.js
 *
 * Test the FlavorInferrer → FoodRenderer integration pipeline
 * Demonstrates how flavor inference feeds food pairing recommendations
 */

import { FlavorInferrer } from './src/processors/inferrers/FlavorInferrer.js';
import { FoodRenderer } from './src/processors/renderers/FoodRenderer.js';

const flavorInferrer = new FlavorInferrer();
const foodRenderer = new FoodRenderer();

// Test cases from real tea profiles
const testCases = [
  {
    name: "Jasmine Tea - Light & Floral",
    formData: { flavorProfiles: ["jasmine", "honey", "sweet"] },
    expectedFoodCount: 3,
    expectedCategories: ["Floral", "Sweet"]
  },
  {
    name: "Puerh Tea - Rich & Complex",
    formData: { flavorProfiles: ["dark_fruits", "earthy", "mineral", "aged", "wood"] },
    expectedFoodCount: 3,
    expectedCategories: ["Fruity", "Earthy"]
  },
  {
    name: "Oolong Tea - Roasted & Floral",
    formData: { flavorProfiles: ["rose", "roasted", "caramel", "orchid"] },
    expectedFoodCount: 3,
    expectedCategories: ["Floral", "Roasted", "Sweet"]
  },
  {
    name: "Green Tea - Fresh & Vegetal",
    formData: { flavorProfiles: ["citrus", "grassy", "fresh", "mineral"] },
    expectedFoodCount: 3,
    expectedCategories: ["Fruity", "Vegetal"]
  },
  {
    name: "White Tea - Delicate & Sweet",
    formData: { flavorProfiles: ["honey", "floral", "peach", "subtle"] },
    expectedFoodCount: 3,
    expectedCategories: ["Floral", "Fruity"]
  }
];

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║     FLAVOR INFERRER → FOOD RENDERER PIPELINE                  ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`TEST ${index + 1}: ${testCase.name}`);
  console.log(`${'─'.repeat(70)}`);

  // ▶ STEP 1: FLAVOR INFERRER
  console.log("\n▶ STEP 1: FLAVOR INFERENCE");
  console.log(`  Input Flavors: ${testCase.formData.flavorProfiles.join(', ')}`);

  const flavorInference = flavorInferrer.infer(testCase.formData);

  console.log(`  Output Analysis:`);
  console.log(`    ├─ Identified: ${flavorInference.analysis.identifiedFlavors.join(', ') || '(none)'}`);
  console.log(`    ├─ Categories: ${flavorInference.analysis.dominantCategories.join(', ') || '(none)'}`);
  console.log(`    ├─ Food Hints: ${flavorInference.analysis.foodPairingHints.length} hints`);
  console.log(`    ├─ Seasonal Hints: ${flavorInference.analysis.seasonalAffinityHints.length} hints`);
  console.log(`    ├─ Activity Hints: ${flavorInference.analysis.activityHints.length} hints`);
  console.log(`    └─ Confidence: ${flavorInference.confidence}`);

  // ▶ STEP 2: FOOD RENDERER
  console.log("\n▶ STEP 2: FOOD PAIRING RENDERING");
  const foodRecommendations = foodRenderer.render(flavorInference);

  console.log(`  Top Food Pairings (${foodRecommendations.recommendations.length}):`);
  foodRecommendations.recommendations.forEach((rec, i) => {
    console.log(`    ${i + 1}. ${rec.food} (score: ${rec.score})`);
    console.log(`       └─ ${rec.rationale}`);
  });

  console.log(`\n  Cuisine Groupings:`);
  if (foodRecommendations.cuisineGroupings.length > 0) {
    foodRecommendations.cuisineGroupings.forEach(group => {
      console.log(`    • ${group.cuisine}`);
      group.foods.slice(0, 3).forEach(food => {
        console.log(`      └─ ${food}`);
      });
      if (group.foods.length > 3) {
        console.log(`      └─ ... and ${group.foods.length - 3} more`);
      }
    });
  } else {
    console.log(`    (no groupings)`);
  }

  console.log(`\n  Food Category Breakdown:`);
  if (foodRecommendations.categoryGroupings.length > 0) {
    foodRecommendations.categoryGroupings.forEach(group => {
      console.log(`    • ${group.category.replace('_', ' ').toUpperCase()}: ${group.foods.join(', ')}`);
    });
  } else {
    console.log(`    (no categories)`);
  }

  console.log(`\n  Confidence: ${foodRecommendations.confidence}`);

  // Validation
  const hasRecommendations = foodRecommendations.recommendations.length >= testCase.expectedFoodCount;
  const hasCuisines = foodRecommendations.cuisineGroupings.length > 0;
  const hasCategories = foodRecommendations.categoryGroupings.length > 0;

  if (hasRecommendations && hasCuisines && hasCategories) {
    console.log(`\n✓ PASS - Got ${foodRecommendations.recommendations.length} foods, ${foodRecommendations.cuisineGroupings.length} cuisines, ${foodRecommendations.categoryGroupings.length} categories`);
    passCount++;
  } else {
    console.log(`\n✗ FAIL`);
    if (!hasRecommendations) console.log(`  ✗ Expected ${testCase.expectedFoodCount} recommendations, got ${foodRecommendations.recommendations.length}`);
    if (!hasCuisines) console.log(`  ✗ No cuisine groupings created`);
    if (!hasCategories) console.log(`  ✗ No category groupings created`);
    failCount++;
  }
});

console.log(`\n${'═'.repeat(70)}`);
console.log("FLAVOR → FOOD PIPELINE TEST SUMMARY");
console.log('═'.repeat(70));
console.log(`\nTests Passed: ${passCount}/${testCases.length}`);
console.log(`Success Rate: ${((passCount / testCases.length) * 100).toFixed(1)}%\n`);

if (passCount === testCases.length) {
  console.log("✓ All tests passed! Flavor → Food pipeline is working correctly.\n");
  process.exit(0);
} else {
  console.log(`✗ ${failCount} test(s) failed. Review the output above.\n`);
  process.exit(1);
}
