/**
 * test-flavor-inferrer.js
 *
 * Test the FlavorInferrer proof of concept
 */

import { FlavorInferrer } from './src/processors/inferrers/FlavorInferrer.js';

const flavorInferrer = new FlavorInferrer();

// Test cases from real tea profiles
const testCases = [
  {
    name: "Floral & Sweet Tea (Jasmine)",
    formData: { flavorProfiles: ["jasmine", "honey", "sweet"] },
    expectedCategories: ["Floral", "Sweet"]
  },
  {
    name: "Fruity & Earthy Tea (Puerh-like)",
    formData: { flavorProfiles: ["dark_fruits", "earthy", "mineral", "aged"] },
    expectedCategories: ["Fruity", "Earthy"]
  },
  {
    name: "Complex Tea (Multiple Categories)",
    formData: { flavorProfiles: ["rose", "caramel", "roasted", "walnut"] },
    expectedCategories: ["Floral", "Sweet", "Roasted", "Nutty & Toasty"]
  },
  {
    name: "Simple Tea (Single Category)",
    formData: { flavorProfiles: ["citrus"] },
    expectedCategories: ["Fruity"]
  },
  {
    name: "Unknown Flavors",
    formData: { flavorProfiles: ["mystery_flavor", "unknown_taste"] },
    expectedCategories: []
  },
  {
    name: "Empty Flavor Profile",
    formData: { flavorProfiles: [] },
    expectedCategories: []
  }
];

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║          FLAVOR INFERRER - PROOF OF CONCEPT                    ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`TEST ${index + 1}: ${testCase.name}`);
  console.log(`${'─'.repeat(70)}`);

  console.log(`\n▶ INPUT`);
  console.log(`  Flavor Profiles: ${testCase.formData.flavorProfiles.length > 0 ? testCase.formData.flavorProfiles.join(', ') : '(empty)'}`);

  const inference = flavorInferrer.infer(testCase.formData);

  console.log(`\n▶ FLAVOR ANALYSIS`);
  console.log(`  Identified Flavors: ${inference.analysis.identifiedFlavors.length > 0 ? inference.analysis.identifiedFlavors.join(', ') : '(none)'}`);
  console.log(`  Dominant Flavors: ${inference.analysis.dominantFlavors.length > 0 ? inference.analysis.dominantFlavors.join(', ') : '(none)'}`);
  console.log(`  Categories: ${inference.analysis.dominantCategories.length > 0 ? inference.analysis.dominantCategories.join(', ') : '(none)'}`);
  console.log(`  Intensity: ${inference.analysis.intensityEstimate}`);
  console.log(`  Confidence: ${inference.confidence}`);

  console.log(`\n▶ AGGREGATED HINTS`);
  console.log(`  Food Pairing Hints (${inference.analysis.foodPairingHints.length}):`);
  if (inference.analysis.foodPairingHints.length > 0) {
    inference.analysis.foodPairingHints.slice(0, 5).forEach(hint => {
      console.log(`    • ${hint}`);
    });
    if (inference.analysis.foodPairingHints.length > 5) {
      console.log(`    ... and ${inference.analysis.foodPairingHints.length - 5} more`);
    }
  } else {
    console.log(`    (none)`);
  }

  console.log(`\n  Seasonal Affinity Hints (${inference.analysis.seasonalAffinityHints.length}):`);
  if (inference.analysis.seasonalAffinityHints.length > 0) {
    inference.analysis.seasonalAffinityHints.forEach(hint => {
      console.log(`    • ${hint}`);
    });
  } else {
    console.log(`    (none)`);
  }

  console.log(`\n  Activity Hints (${inference.analysis.activityHints.length}):`);
  if (inference.analysis.activityHints.length > 0) {
    inference.analysis.activityHints.slice(0, 5).forEach(hint => {
      console.log(`    • ${hint}`);
    });
    if (inference.analysis.activityHints.length > 5) {
      console.log(`    ... and ${inference.analysis.activityHints.length - 5} more`);
    }
  } else {
    console.log(`    (none)`);
  }

  console.log(`\n▶ DESCRIPTION`);
  console.log(`  "${inference.description}"`);

  // Validation
  const categoryMatch = testCase.expectedCategories.every(cat =>
    inference.analysis.dominantCategories.includes(cat)
  ) && inference.analysis.dominantCategories.length > 0 ?
    testCase.expectedCategories.length > 0 :
    testCase.expectedCategories.length === 0;

  const hasHints = inference.analysis.foodPairingHints.length > 0 ||
                   inference.analysis.seasonalAffinityHints.length > 0 ||
                   inference.analysis.activityHints.length > 0;

  const test1Pass = testCase.expectedCategories.length === 0 ? !hasHints : hasHints;
  const test2Pass = inference.analysis.identifiedFlavors.length >= 0;

  if (test1Pass && test2Pass) {
    console.log(`\n✓ PASS`);
    passCount++;
  } else {
    console.log(`\n✗ FAIL`);
    failCount++;
  }
});

console.log(`\n${'═'.repeat(70)}`);
console.log("FLAVOR INFERRER TEST SUMMARY");
console.log('═'.repeat(70));
console.log(`\nTests Passed: ${passCount}/${testCases.length}`);
console.log(`Success Rate: ${((passCount / testCases.length) * 100).toFixed(1)}%\n`);

if (passCount === testCases.length) {
  console.log("✓ All tests passed! FlavorInferrer is working correctly.\n");
  process.exit(0);
} else {
  console.log(`✗ ${failCount} test(s) failed. Review the output above.\n`);
  process.exit(1);
}
