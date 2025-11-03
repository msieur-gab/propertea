import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';

// Test three oolongs with different raw compound values
const teas = [
  { name: "Tie Guan Yin", caffeine: 4, ltheanine: 5.5 },
  { name: "Da Hong Pao", caffeine: 4.5, ltheanine: 4.5 },
  { name: "Ali Shan", caffeine: 3.5, ltheanine: 6.5 }
];

async function test() {
  console.log("Testing unified CompoundInferrer signature...\n");

  const results = [];

  for (const tea of teas) {
    console.log(`\n=== ${tea.name} ===`);

    // Compound inference
    const compound = await new CompoundInferrer().infer({
      caffeineLevel: tea.caffeine,
      lTheanineLevel: tea.ltheanine
    });

    console.log(`Compound Profile: ${compound.analysis.compoundProfile}`);
    console.log(`Raw Values - Caffeine: ${compound.analysis.caffeineLevel}, L-Theanine: ${compound.analysis.lTheanineLevel}`);
    console.log(`Ratio: ${compound.analysis.ratio}`);

    // Verify raw values are now in .analysis
    if (!compound.analysis.caffeineLevel) {
      console.error("❌ BROKEN: caffeineLevel not in .analysis!");
      return;
    } else {
      console.log("✅ Raw values accessible in .analysis");
    }

    // Tea type for TimeRenderer
    const teaType = await new TeaTypeInferrer().infer({ type: 'oolong' });

    // Time rendering
    const time = new TimeRenderer().render({
      compound,
      teaType
    });

    const topHour = time.recommendations[0];
    console.log(`Top recommendation: ${topHour.timeOfDay} (score: ${topHour.score})`);

    results.push({
      name: tea.name,
      profile: compound.analysis.compoundProfile,
      topScore: topHour.score,
      topHour: topHour.hour,
      hourlyScores: time.hourlyScores
    });
  }

  console.log("\n\n=== SUMMARY ===");
  console.log("Checking if identical profiles produce different hourly scores:\n");

  for (const result of results) {
    console.log(`${result.name}:`);
    console.log(`  Profile: ${result.profile}`);
    console.log(`  Top hour: ${result.topHour} (score: ${result.topScore})`);
  }

  // Check if profiles are identical but scores differ
  const profile1 = results[0].profile;
  const profile2 = results[1].profile;

  if (profile1 === profile2) {
    console.log(`\n✅ IDENTICAL PROFILES: Both "${profile1}"`);

    const scoreDiff = Math.abs(results[0].topScore - results[1].topScore);
    if (scoreDiff > 1) {
      console.log(`✅ DIFFERENT SCORES: ${results[0].topScore.toFixed(1)} vs ${results[1].topScore.toFixed(1)}`);
      console.log("✅ RAW VALUES ARE BEING USED - PROBLEM SOLVED!");
    } else {
      console.log(`❌ SAME SCORES: ${results[0].topScore.toFixed(1)} vs ${results[1].topScore.toFixed(1)}`);
      console.log("❌ Raw values are NOT being differentiated");
    }
  } else {
    console.log(`Different profiles: "${profile1}" vs "${profile2}"`);
  }
}

test().catch(console.error);
