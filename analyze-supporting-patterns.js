import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log('\n=== SUPPORTING EFFECT PATTERNS BY TEA TYPE + DOMINANT EFFECT ===\n');

// Group by type and dominant effect
const patterns = {};

dataset.forEach(tea => {
  const key = `${tea.type}:${tea.expectedEffects?.dominant}`;

  if (!patterns[key]) {
    patterns[key] = {};
  }

  const sup = tea.expectedEffects?.supporting;
  if (sup) {
    patterns[key][sup] = (patterns[key][sup] || 0) + 1;
  }
});

Object.entries(patterns)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([key, supportingMap]) => {
    const entries = Object.entries(supportingMap).sort((a, b) => b[1] - a[1]);
    const dominant = entries[0][1];

    console.log(`${key.padEnd(25)} Total: ${Object.values(supportingMap).reduce((a,b) => a+b, 0)}`);
    entries.forEach(([sup, count]) => {
      const pct = ((count / Object.values(supportingMap).reduce((a,b) => a+b, 0)) * 100).toFixed(0);
      console.log(`  ${sup.padEnd(15)} ${count}x (${pct}%)`);
    });
    console.log();
  });
