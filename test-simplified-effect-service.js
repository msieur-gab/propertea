import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectServiceSimplified } from './backend/src/services/EffectService.simplified.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectServiceSimplified();

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.cyan}Testing Simplified EffectService${colors.reset}\n`);

let matches = 0;
let partialMatches = 0;
let failures = 0;

const resultsByType = {};

dataset.forEach(tea => {
  const teaModel = {
    name: tea.name,
    type: tea.type,
    caffeineLevel: tea.caffeineLevel || 0,
    lTheanineLevel: tea.lTheanineLevel || 0
  };

  const result = effectService.infer(teaModel, {});
  const calculated = result.expectedEffects;
  const expected = tea.expectedEffects;

  // Count matches
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

  // Track by type
  if (!resultsByType[tea.type]) {
    resultsByType[tea.type] = { exact: 0, partial: 0, fail: 0, total: 0 };
  }
  resultsByType[tea.type].total++;
  if (bothMatch) resultsByType[tea.type].exact++;
  else if (domMatch || supMatch) resultsByType[tea.type].partial++;
  else resultsByType[tea.type].fail++;

  // Show mismatches
  if (!bothMatch) {
    const status = bothMatch ? '✅' : domMatch || supMatch ? '⚠️' : '❌';
    console.log(`${status} ${tea.name.padEnd(35)} | Expected: ${expected.dominant}/${expected.supporting} | Got: ${calculated.dominant}/${calculated.supporting}`);
  }
});

// Print summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                          RESULTS${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);

console.log(`\n${colors.green}✅ Exact Matches:   ${matches}/${dataset.length} (${((matches/dataset.length)*100).toFixed(1)}%)${colors.reset}`);
console.log(`${colors.yellow}⚠️  Partial Matches: ${partialMatches}/${dataset.length} (${((partialMatches/dataset.length)*100).toFixed(1)}%)${colors.reset}`);
console.log(`${colors.red}❌ Failures:        ${failures}/${dataset.length} (${((failures/dataset.length)*100).toFixed(1)}%)${colors.reset}`);

console.log(`\n${colors.cyan}Results by Tea Type:${colors.reset}`);
Object.entries(resultsByType).forEach(([type, stats]) => {
  const pct = ((stats.exact / stats.total) * 100).toFixed(1);
  console.log(`  ${type.padEnd(10)} | ${stats.exact}/${stats.total} (${pct}%)`);
});
