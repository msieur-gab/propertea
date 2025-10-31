import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectService();

const puerhTeas = dataset.filter(t => t.type === 'puerh');

console.log(`Found ${puerhTeas.length} puerh teas\n`);

puerhTeas.forEach(tea => {
  const result = effectService.infer(tea, {});
  console.log(`${tea.name}`);
  console.log(`  SubType: ${tea.subType}`);
  console.log(`  Expected: ${tea.expectedEffects.dominant}/${tea.expectedEffects.supporting}`);
  console.log(`  Got:      ${result.expectedEffects.dominant}/${result.expectedEffects.supporting}`);
  const topScores = Object.entries(result.allScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  console.log(`  Scores:   ${topScores.map(([e, s]) => `${e}:${s.toFixed(1)}`).join(', ')}`);
  console.log();
});
