import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectService();

// Analyze passing vs failing teas by type
const analysis = {};

dataset.forEach(tea => {
  const result = effectService.infer(tea, {});
  const domMatch = result.expectedEffects.dominant === tea.expectedEffects.dominant;
  const supMatch = result.expectedEffects.supporting === tea.expectedEffects.supporting;
  const match = domMatch && supMatch;

  if (!analysis[tea.type]) {
    analysis[tea.type] = { passing: [], failing: [] };
  }

  if (match) {
    analysis[tea.type].passing.push({
      name: tea.name,
      caffeine: tea.caffeineLevel,
      ltheanine: tea.lTheanineLevel,
      effects: tea.expectedEffects
    });
  } else {
    analysis[tea.type].failing.push({
      name: tea.name,
      caffeine: tea.caffeineLevel,
      ltheanine: tea.lTheanineLevel,
      expected: tea.expectedEffects,
      got: result.expectedEffects
    });
  }
});

// Print analysis
Object.entries(analysis).forEach(([type, data]) => {
  if (data.passing.length > 0) {
    console.log(`\n=== ${type.toUpperCase()} - PASSING (${data.passing.length}) ===`);
    data.passing.forEach(p => {
      console.log(`  ${p.name.padEnd(40)} → ${p.effects.dominant}/${p.effects.supporting}`);
    });
  }

  if (data.failing.length > 0) {
    console.log(`\n=== ${type.toUpperCase()} - FAILING (${data.failing.length}) ===`);
    data.failing.slice(0, 5).forEach(f => {
      console.log(`  ${f.name.padEnd(40)} Expected: ${f.expected.dominant}/${f.expected.supporting}, Got: ${f.got.dominant}/${f.got.supporting}`);
    });
    if (data.failing.length > 5) {
      console.log(`  ... and ${data.failing.length - 5} more`);
    }
  }
});
