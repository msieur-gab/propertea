import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Group by tea type and aggregate expected effects
const effectsByType = {};

dataset.forEach(tea => {
  if (!effectsByType[tea.type]) {
    effectsByType[tea.type] = {
      dominant: {},
      supporting: {},
      count: 0
    };
  }

  const typeData = effectsByType[tea.type];
  typeData.count++;

  const dom = tea.expectedEffects.dominant;
  const sup = tea.expectedEffects.supporting;

  typeData.dominant[dom] = (typeData.dominant[dom] || 0) + 1;
  typeData.supporting[sup] = (typeData.supporting[sup] || 0) + 1;
});

// Show what the dataset ACTUALLY expects
console.log('DATASET EXPECTATIONS BY TEA TYPE:\n');
Object.entries(effectsByType).forEach(([type, data]) => {
  console.log(`${type.toUpperCase()} (${data.count} teas):`);

  const domEntries = Object.entries(data.dominant).sort((a,b) => b[1] - a[1]);
  const supEntries = Object.entries(data.supporting).sort((a,b) => b[1] - a[1]);

  console.log('  Dominant effects:');
  domEntries.forEach(([eff, count]) => {
    console.log(`    ${eff}: ${count} (${((count/data.count)*100).toFixed(1)}%)`);
  });

  console.log('  Supporting effects:');
  supEntries.forEach(([eff, count]) => {
    console.log(`    ${eff}: ${count} (${((count/data.count)*100).toFixed(1)}%)`);
  });
  console.log('');
});
