import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectService();

let matches = 0;
let partialMatches = 0;
let failures = 0;
const resultsByType = {};

dataset.forEach(tea => {
  const teaModel = {
    name: tea.name,
    type: tea.type,
    caffeineLevel: tea.caffeineLevel || 0,
    lTheanineLevel: tea.lTheanineLevel || 0,
    flavorProfile: tea.flavorProfile || [],
    processingMethods: tea.processingMethods || [],
    geography: tea.geography || {}
  };

  const result = effectService.infer(teaModel, {});
  const calculated = result.expectedEffects;
  const expected = tea.expectedEffects;

  const domMatch = calculated.dominant === expected.dominant;
  const supMatch = calculated.supporting === expected.supporting;
  const bothMatch = domMatch && supMatch;

  if (bothMatch) {
    matches++;
  } else if (domMatch || supMatch) {
    partialMatches++;
  } else {
    failures++;
  }

  if (!resultsByType[tea.type]) {
    resultsByType[tea.type] = { exact: 0, partial: 0, fail: 0, total: 0 };
  }
  resultsByType[tea.type].total++;
  if (bothMatch) resultsByType[tea.type].exact++;
  else if (domMatch || supMatch) resultsByType[tea.type].partial++;
  else resultsByType[tea.type].fail++;
});

const total = matches + partialMatches + failures;
console.log(`\nExact Matches:   ${matches}/${total} (${((matches/total)*100).toFixed(1)}%)`);
console.log(`Partial Matches: ${partialMatches}/${total} (${((partialMatches/total)*100).toFixed(1)}%)`);
console.log(`Failures:        ${failures}/${total} (${((failures/total)*100).toFixed(1)}%)`);

console.log(`\nResults by Tea Type:`);
Object.entries(resultsByType).forEach(([type, stats]) => {
  const pct = ((stats.exact / stats.total) * 100).toFixed(0);
  console.log(`  ${type.padEnd(10)} | ${stats.exact}/${stats.total} (${pct}%)`);
});
