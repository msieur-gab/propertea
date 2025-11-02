/**
 * test-inferrer-renderer.js
 *
 * Test the Inferrer/Renderer pattern integration
 * Proof of concept: CompoundInferrer → ActivityRenderer
 */

import { CompoundInferrer } from './src/processors/inferrers/CompoundInferrer.js';
import { ActivityRenderer } from './src/processors/renderers/ActivityRenderer.js';

// Initialize processors
const compoundInferrer = new CompoundInferrer();
const activityRenderer = new ActivityRenderer();

// Test cases from form data
const testCases = [
  {
    name: "High Energy Tea (Caffeine-dominant)",
    formData: { caffeineLevel: 8, lTheanineLevel: 3 },
    expectedProfile: "Intense & Sharp"
  },
  {
    name: "Balanced Tea",
    formData: { caffeineLevel: 6, lTheanineLevel: 6 },
    expectedProfile: "Balanced & Focused"
  },
  {
    name: "Calming Tea (L-theanine dominant)",
    formData: { caffeineLevel: 2, lTheanineLevel: 8 },
    expectedProfile: "Calm & Clear"
  },
  {
    name: "Smooth High Caffeine",
    formData: { caffeineLevel: 7, lTheanineLevel: 6 },
    expectedProfile: "Balanced & Focused"
  },
  {
    name: "Empty Data",
    formData: { caffeineLevel: 0, lTheanineLevel: 0 },
    expectedProfile: "N/A"
  }
];

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║        INFERRER/RENDERER PATTERN - PROOF OF CONCEPT            ║");
console.log("╚════════════════════════════════════════════════════════════════╝\n");

testCases.forEach((testCase, index) => {
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`TEST ${index + 1}: ${testCase.name}`);
  console.log(`${'─'.repeat(70)}`);

  // Step 1: Infer
  console.log("\n▶ STEP 1: COMPOUND INFERRER");
  console.log(`  Input: ${JSON.stringify(testCase.formData)}`);

  const compoundInference = compoundInferrer.infer(testCase.formData);

  console.log(`  Output Analysis:`);
  console.log(`    ├─ Profile: ${compoundInference.analysis.compoundProfile}`);
  console.log(`    ├─ Ratio: ${compoundInference.analysis.ratio}`);
  console.log(`    ├─ Stimulation: ${compoundInference.analysis.stimulationLevel}`);
  console.log(`    ├─ Relaxation: ${compoundInference.analysis.relaxationLevel}`);
  console.log(`    └─ Confidence: ${compoundInference.confidence}`);

  // Validation
  const profileMatch = compoundInference.analysis.compoundProfile === testCase.expectedProfile;
  console.log(`  ✓ Profile Match: ${profileMatch ? '✓ PASS' : '✗ FAIL'} (expected: ${testCase.expectedProfile})`);

  // Step 2: Render
  console.log("\n▶ STEP 2: ACTIVITY RENDERER");
  const activityRecommendations = activityRenderer.render(compoundInference);

  console.log(`  Recommended Activities (${activityRecommendations.recommendations.length}):`);
  activityRecommendations.recommendations.forEach((rec, i) => {
    console.log(`    ${i + 1}. ${rec.activity} (score: ${rec.score})`);
    console.log(`       └─ ${rec.rationale}`);
  });

  console.log(`\n  Themed Clusters:`);
  activityRecommendations.clusters.forEach(cluster => {
    console.log(`    • ${cluster.theme}`);
    cluster.activities.forEach(activity => {
      console.log(`      └─ ${activity}`);
    });
  });

  console.log(`\n  Confidence: ${activityRecommendations.confidence}`);

  // Validation
  const hasRecommendations = activityRecommendations.recommendations.length > 0;
  console.log(`  ✓ Has Recommendations: ${hasRecommendations ? '✓ PASS' : '✗ FAIL'}`);
});

console.log(`\n${'═'.repeat(70)}`);
console.log("INTEGRATION TEST SUMMARY");
console.log('═'.repeat(70));

// Summary
let passCount = 0;
let totalTests = testCases.length * 2; // 2 assertions per test

testCases.forEach((testCase) => {
  const inference = compoundInferrer.infer(testCase.formData);
  if (inference.analysis.compoundProfile === testCase.expectedProfile) passCount++;

  const recommendations = activityRenderer.render(inference);
  if (recommendations.recommendations.length > 0 || testCase.expectedProfile === "N/A") passCount++;
});

console.log(`\nTests Passed: ${passCount}/${totalTests}`);
console.log(`Success Rate: ${((passCount / totalTests) * 100).toFixed(1)}%\n`);

if (passCount === totalTests) {
  console.log("✓ All tests passed! Inferrer/Renderer pattern is working correctly.\n");
  process.exit(0);
} else {
  console.log("✗ Some tests failed. Review the output above.\n");
  process.exit(1);
}
