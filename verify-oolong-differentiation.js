import fs from 'fs';

// Read the exported time recommendations
const timeData = JSON.parse(fs.readFileSync('_dataset/time-recommendations/oolong-time.json', 'utf-8'));

console.log("=== OOLONG DIFFERENTIATION VERIFICATION ===\n");

// Group by compound profile
const byProfile = {};
for (const tea of timeData) {
  const profile = tea.analysis?.compoundProfile || 'Unknown';
  if (!byProfile[profile]) {
    byProfile[profile] = [];
  }
  byProfile[profile].push(tea);
}

// Show teas with identical profiles but different hourly scores
for (const [profile, teas] of Object.entries(byProfile)) {
  if (teas.length > 1) {
    console.log(`\nProfile: "${profile}" (${teas.length} teas)`);
    console.log('─'.repeat(70));

    for (const tea of teas) {
      const topHour = tea.recommendations[0];
      const teaName = tea.teaName || 'Unknown';
      console.log(`${teaName.padEnd(30)} | Top: ${topHour.hour.toString().padStart(2)}:00 (${topHour.score.toFixed(1)})`);
    }

    // Check if scores differ
    const scores = teas.map(t => t.recommendations[0].score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const diff = maxScore - minScore;

    if (diff > 1) {
      console.log(`✅ SCORES DIFFER: ${minScore.toFixed(1)} vs ${maxScore.toFixed(1)} (Δ${diff.toFixed(1)})`);
    } else {
      console.log(`❌ SCORES IDENTICAL: All ${minScore.toFixed(1)}`);
    }
  }
}

console.log("\n" + "=".repeat(70));
console.log("✅ VERIFICATION COMPLETE");
console.log("If you see ✅ marks above, the problem is SOLVED!");
