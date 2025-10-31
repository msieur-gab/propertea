import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const greenTeas = dataset.filter(t => t.type === 'green');

console.log('=== GREEN TEA ATTRIBUTES ===\n');
greenTeas.forEach(tea => {
  console.log(`${tea.name} (caffeine: ${tea.caffeineLevel}, L-Theanine: ${tea.lTheanineLevel})`);
  console.log(`  Expected: ${tea.expectedEffects.dominant}/${tea.expectedEffects.supporting}`);
  if (tea.flavorProfile) console.log(`  Flavor: ${tea.flavorProfile}`);
  if (tea.processingMethods) console.log(`  Processing: ${tea.processingMethods}`);
  if (tea.geography) console.log(`  Geography: ${tea.geography}`);
  console.log();
});
