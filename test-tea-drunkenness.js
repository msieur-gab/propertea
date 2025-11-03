/**
 * Test Tea Drunkenness Renderer
 *
 * Purpose: Validate tea drunkenness predictions across different tea types
 * Tests various compound profiles, elevations, and tea types
 */

import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { TeaDrunkenessRenderer } from "./endpoint/src/processors/renderers/TeaDrunkenessRenderer.js";

console.log('🍵 Tea Drunkenness Renderer Test');
console.log('='.repeat(70));
console.log('');

// Test cases covering different scenarios
const testCases = [
  {
    name: "Young Raw Puerh (High Mountain)",
    description: "Should be VERY HIGH - notorious for tea drunk",
    tea: {
      type: "puerh_sheng",
      subType: "young-sheng",
      caffeineLevel: 7,
      lTheanineLevel: 8,
      geography: { altitude: 1500 }
    }
  },
  {
    name: "Tie Guan Yin (High Mountain Oolong)",
    description: "Should be HIGH - classic tea drunk tea",
    tea: {
      type: "oolong",
      subType: "tie-guan-yin",
      caffeineLevel: 4,
      lTheanineLevel: 5.5,
      geography: { altitude: 700 }
    }
  },
  {
    name: "Mengding Huangya (Yellow Tea, Very High Mountain)",
    description: "Should be MEDIUM-HIGH - gentle but noticeable",
    tea: {
      type: "yellow",
      subType: "mengding-huangya",
      caffeineLevel: 3,
      lTheanineLevel: 4,
      geography: { altitude: 1200 }
    }
  },
  {
    name: "Longjing (Spring Green, High Mountain)",
    description: "Should be MEDIUM - early spring greens have effect",
    tea: {
      type: "green",
      subType: "longjing",
      caffeineLevel: 5,
      lTheanineLevel: 6,
      geography: { altitude: 800 }
    }
  },
  {
    name: "Keemun (Black Tea, Low Elevation)",
    description: "Should be LOW - oxidation reduces L-theanine",
    tea: {
      type: "black",
      subType: "keemun",
      caffeineLevel: 5,
      lTheanineLevel: 4,
      geography: { altitude: 300 }
    }
  },
  {
    name: "Menghai Shou (Ripe Puerh)",
    description: "Should be LOW - fermentation changes compounds",
    tea: {
      type: "puerh_shou",
      subType: "menghai-shou",
      caffeineLevel: 4,
      lTheanineLevel: 3,
      geography: { altitude: 1200 }
    }
  },
  {
    name: "High Caffeine, Low L-Theanine (Imbalanced)",
    description: "Should be LOW - jittery not drunk",
    tea: {
      type: "green",
      subType: "sencha",
      caffeineLevel: 8,
      lTheanineLevel: 3,
      geography: { altitude: 600 }
    }
  },
  {
    name: "Perfect Ratio (1.25) High Mountain",
    description: "Should be VERY HIGH - ideal sweet spot",
    tea: {
      type: "oolong",
      subType: "alishan",
      caffeineLevel: 6,
      lTheanineLevel: 7.5,
      geography: { altitude: 1600 }
    }
  }
];

// Run tests
const results = [];

testCases.forEach((testCase, index) => {
  console.log(`\n📋 Test ${index + 1}: ${testCase.name}`);
  console.log('─'.repeat(70));
  console.log(`   Expected: ${testCase.description}`);

  // Run inferrers
  const compoundInf = new CompoundInferrer().infer({
    caffeineLevel: testCase.tea.caffeineLevel,
    lTheanineLevel: testCase.tea.lTheanineLevel
  });

  const geographyInf = new GeographyInferrer().infer({
    geography: testCase.tea.geography
  });

  const teaTypeInf = new TeaTypeInferrer().infer({
    type: testCase.tea.type,
    subType: testCase.tea.subType
  });

  // Run renderer
  const renderer = new TeaDrunkenessRenderer();
  const result = renderer.render({
    compound: compoundInf,
    geography: geographyInf,
    teaType: teaTypeInf
  });

  // Display results
  console.log(`\n   🎯 Results:`);
  console.log(`      Drunkenness Potential: ${result.drunkennessPotential}/100`);
  console.log(`      Intensity: ${result.intensity}`);
  console.log(`      Character: ${result.character}`);
  console.log(`      Confidence: ${(result.confidence * 100).toFixed(0)}%`);

  console.log(`\n   ⏱️  Timing:`);
  console.log(`      Onset: ${result.timing?.onset || 'N/A'}`);
  console.log(`      Peak Duration: ${result.timing?.peak || 'N/A'}`);

  console.log(`\n   📊 Factor Breakdown:`);
  console.log(`      L-Theanine contribution: ${result.analysis?.factors?.lTheanine || 'N/A'}`);
  console.log(`      Caffeine contribution: ${result.analysis?.factors?.caffeine || 'N/A'}`);
  console.log(`      Ratio balance: ${result.analysis?.factors?.ratioBalance || 'N/A'}`);
  console.log(`      Elevation bonus: ${result.analysis?.factors?.elevation || 'N/A'}`);
  console.log(`      Tea type multiplier: ${result.analysis?.teaTypeMultiplier || 'N/A'}x`);

  if (result.recommendations && result.recommendations.length > 0) {
    console.log(`\n   💡 Top Recommendation:`);
    console.log(`      ${result.recommendations[0]}`);
  }

  if (result.warnings && result.warnings.length > 0) {
    console.log(`\n   ⚠️  Warning:`);
    console.log(`      ${result.warnings[0]}`);
  }

  results.push({
    name: testCase.name,
    expected: testCase.description,
    potential: result.drunkennessPotential,
    intensity: result.intensity,
    character: result.character,
    confidence: result.confidence
  });
});

// Summary table
console.log('\n\n📊 Summary Table');
console.log('='.repeat(70));
console.log('Tea Name'.padEnd(40), 'Score', 'Intensity'.padEnd(12), 'Conf');
console.log('─'.repeat(70));

results.forEach(r => {
  console.log(
    r.name.padEnd(40),
    String(r.potential).padStart(5),
    r.intensity.padEnd(12),
    `${(r.confidence * 100).toFixed(0)}%`.padStart(4)
  );
});

console.log('\n✅ All tea drunkenness predictions complete!\n');
console.log('📝 Key Insights:');
console.log('   - Young raw puerh + high mountain = highest potential');
console.log('   - Ideal L-theanine/Caffeine ratio: 1.0-1.5');
console.log('   - Elevation amplifies effects (1500m+ best)');
console.log('   - Black/ripe puerh have lower potential due to oxidation/fermentation');
console.log('   - High caffeine without L-theanine = jittery, not drunk');
