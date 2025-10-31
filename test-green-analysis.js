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

console.log('=== GREEN TEAS ANALYSIS ===\n');
greenTeas.forEach(tea => {
  const result = effectService.infer(tea, {});
  const domMatch = result.expectedEffects.dominant === tea.expectedEffects.dominant;
  const supMatch = result.expectedEffects.supporting === tea.expectedEffects.supporting;
  const match = domMatch && supMatch;
  
  const status = match ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} ${tea.name}`);
  console.log(`  Caffeine: ${tea.caffeineLevel}, Expected: ${tea.expectedEffects.dominant}/${tea.expectedEffects.supporting}`);
  console.log(`  Got: ${result.expectedEffects.dominant}/${result.expectedEffects.supporting}`);
  if (!domMatch) console.log(`    → Dominant mismatch: expected ${tea.expectedEffects.dominant}, got ${result.expectedEffects.dominant}`);
  if (!supMatch) console.log(`    → Supporting mismatch: expected ${tea.expectedEffects.supporting}, got ${result.expectedEffects.supporting}`);
  console.log();
});
