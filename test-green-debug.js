import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectService();

console.log('=== GREEN TEAS (failures and partial matches) ===\n');
const greenTeas = dataset.filter(t => t.type === 'green');
greenTeas.forEach(tea => {
  const result = effectService.infer(tea, {});
  const domMatch = result.expectedEffects.dominant === tea.expectedEffects.dominant;
  const supMatch = result.expectedEffects.supporting === tea.expectedEffects.supporting;

  if (!domMatch || !supMatch) {
    console.log(`${tea.name}`);
    console.log(`  Caffeine: ${tea.caffeineLevel}, L-Theanine: ${tea.lTheanineLevel}`);
    console.log(`  Expected: ${tea.expectedEffects.dominant}/${tea.expectedEffects.supporting}`);
    console.log(`  Got:      ${result.expectedEffects.dominant}/${result.expectedEffects.supporting}`);
    const topScores = Object.entries(result.allScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    console.log(`  Scores:   ${topScores.map(([e, s]) => `${e}:${s.toFixed(1)}`).join(', ')}`);
    console.log();
  }
});
