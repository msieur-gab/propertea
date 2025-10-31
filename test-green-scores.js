import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectService();

const greenTeas = dataset.filter(t => t.type === 'green');

console.log('=== GREEN TEA SCORES (first 5) ===\n');
greenTeas.slice(0, 5).forEach(tea => {
  const result = effectService.infer(tea, {});
  console.log(`${tea.name} (caffeine: ${tea.caffeineLevel})`);
  console.log(`  Expected: ${tea.expectedEffects.dominant}/${tea.expectedEffects.supporting}`);
  console.log(`  Got: ${result.expectedEffects.dominant}/${result.expectedEffects.supporting}`);
  const allScores = Object.entries(result.allScores || {})
    .sort(([, a], [, b]) => b - a);
  console.log('  All Scores:');
  allScores.forEach(([effect, score]) => {
    console.log(`    ${effect.padEnd(12)}: ${score.toFixed(1)}`);
  });
  console.log();
});
