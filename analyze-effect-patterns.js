import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log('\n=== EFFECT PATTERNS BY TEA TYPE ===\n');

// Group by tea type
const byType = {};
dataset.forEach(tea => {
  if (!byType[tea.type]) {
    byType[tea.type] = [];
  }
  byType[tea.type].push(tea);
});

Object.entries(byType).forEach(([type, teas]) => {
  console.log(`\n${type.toUpperCase()} (${teas.length} teas):`);
  console.log('='.repeat(60));

  // Analyze compounds
  const caffeine = teas.map(t => t.caffeineLevel).filter(c => c !== null && c !== undefined);
  const theanine = teas.map(t => t.lTheanineLevel).filter(t => t !== null && t !== undefined);
  const ratio = caffeine.map((c, i) => c > 0 ? theanine[i] / c : 0).filter(r => r > 0);

  if (caffeine.length > 0) {
    console.log(`  Caffeine: ${(caffeine.reduce((a,b) => a+b,0)/caffeine.length).toFixed(2)} avg (${Math.min(...caffeine)}-${Math.max(...caffeine)})`);
  }
  if (theanine.length > 0) {
    console.log(`  L-Theanine: ${(theanine.reduce((a,b) => a+b,0)/theanine.length).toFixed(2)} avg (${Math.min(...theanine)}-${Math.max(...theanine)})`);
  }
  if (ratio.length > 0) {
    console.log(`  Ratio: ${(ratio.reduce((a,b) => a+b,0)/ratio.length).toFixed(2)} avg`);
  }

  // Analyze flavors
  const flavors = new Set();
  teas.forEach(t => {
    if (Array.isArray(t.flavorProfile)) {
      t.flavorProfile.forEach(f => flavors.add(f));
    }
  });
  console.log(`  Common flavors: ${Array.from(flavors).slice(0,5).join(', ')}`);

  // Analyze processing
  const processing = new Set();
  teas.forEach(t => {
    if (Array.isArray(t.processingMethods)) {
      t.processingMethods.forEach(p => processing.add(p));
    }
  });
  console.log(`  Common processing: ${Array.from(processing).slice(0,5).join(', ')}`);

  // Analyze geography
  const alts = teas.map(t => t.geography?.altitude).filter(a => a).sort((a,b) => a-b);
  if (alts.length > 0) {
    console.log(`  Altitude: ${alts[0]}-${alts[alts.length-1]}m`);
  }

  // Expected effects
  const dominantEffects = {};
  const supportingEffects = {};
  teas.forEach(tea => {
    const dom = tea.expectedEffects?.dominant;
    const sup = tea.expectedEffects?.supporting;
    if (dom) dominantEffects[dom] = (dominantEffects[dom] || 0) + 1;
    if (sup) supportingEffects[sup] = (supportingEffects[sup] || 0) + 1;
  });

  console.log('  Expected dominant effects:');
  Object.entries(dominantEffects)
    .sort((a, b) => b[1] - a[1])
    .forEach(([eff, count]) => {
      console.log(`    ${eff}: ${count} (${((count/teas.length)*100).toFixed(0)}%)`);
    });

  console.log('  Expected supporting effects:');
  Object.entries(supportingEffects)
    .sort((a, b) => b[1] - a[1])
    .forEach(([eff, count]) => {
      console.log(`    ${eff}: ${count} (${((count/teas.length)*100).toFixed(0)}%)`);
    });
});

// Now analyze correlations
console.log('\n\n=== EFFECT CORRELATIONS WITH COMPOUNDS ===\n');

const effectCaffeine = {};
const effectTheanine = {};
const effectRatio = {};

dataset.forEach(tea => {
  const dom = tea.expectedEffects?.dominant;
  if (!dom || !tea.caffeineLevel || !tea.lTheanineLevel) return;

  if (!effectCaffeine[dom]) {
    effectCaffeine[dom] = [];
    effectTheanine[dom] = [];
    effectRatio[dom] = [];
  }

  effectCaffeine[dom].push(tea.caffeineLevel);
  effectTheanine[dom].push(tea.lTheanineLevel);
  effectRatio[dom].push(tea.lTheanineLevel / tea.caffeineLevel);
});

Object.entries(effectCaffeine).forEach(([effect, values]) => {
  const avgCaffeine = values.reduce((a,b) => a+b, 0) / values.length;
  const avgTheanine = effectTheanine[effect].reduce((a,b) => a+b, 0) / effectTheanine[effect].length;
  const avgRatio = effectRatio[effect].reduce((a,b) => a+b, 0) / effectRatio[effect].length;

  console.log(`${effect.padEnd(15)} | Caff: ${avgCaffeine.toFixed(2)} | Thea: ${avgTheanine.toFixed(2)} | Ratio: ${avgRatio.toFixed(2)}`);
});
