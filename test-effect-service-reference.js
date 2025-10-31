import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';
import { teaDatabase } from './js/data/TeaDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const effectService = new EffectService();

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}  Testing EffectService Against Expert-Validated Reference Teas${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

let matches = 0;
let partialMatches = 0;
let failures = 0;

const resultsByType = {};

teaDatabase.forEach(tea => {
  // Skip if no expected effects
  if (!tea.expectedEffects) return;

  const teaModel = {
    name: tea.name,
    type: tea.type,
    subType: tea.subType || '',
    caffeineLevel: tea.caffeineLevel || 0,
    lTheanineLevel: tea.lTheanineLevel || 0,
    flavorProfile: tea.flavorProfile || [],
    processingMethods: tea.processingMethods || [],
    geography: tea.geography || {}
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

  // Show result
  const ratio = tea.caffeineLevel > 0 ? (tea.lTheanineLevel / tea.caffeineLevel).toFixed(2) : 'N/A';
  const status = bothMatch ? `${colors.green}✅${colors.reset}` : domMatch || supMatch ? `${colors.yellow}⚠️ ${colors.reset}` : `${colors.red}❌${colors.reset}`;

  console.log(`${status} ${tea.name.padEnd(30)} | Ratio: ${ratio.padStart(4)} | Expected: ${expected.dominant.padEnd(12)}/${expected.supporting.padEnd(12)} | Got: ${calculated.dominant.padEnd(12)}/${calculated.supporting}`);

  // Show details for mismatches
  if (!bothMatch) {
    if (result._debug) {
      console.log(`   ${colors.blue}Tea Type: ${result._debug.teaType.padEnd(10)} | Caffeine: ${result._debug.caffeine.toFixed(1)} | L-Theanine: ${result._debug.lTheanine.toFixed(1)}${colors.reset}`);
    }
  }
});

// Print summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                          RESULTS${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);

const total = matches + partialMatches + failures;
console.log(`\n${colors.green}✅ Exact Matches:   ${matches}/${total} (${((matches/total)*100).toFixed(1)}%)${colors.reset}`);
console.log(`${colors.yellow}⚠️  Partial Matches: ${partialMatches}/${total} (${((partialMatches/total)*100).toFixed(1)}%)${colors.reset}`);
console.log(`${colors.red}❌ Failures:        ${failures}/${total} (${((failures/total)*100).toFixed(1)}%)${colors.reset}`);

console.log(`\n${colors.cyan}Results by Tea Type:${colors.reset}`);
Object.entries(resultsByType).forEach(([type, stats]) => {
  if (stats.total === 0) return;
  const pct = ((stats.exact / stats.total) * 100).toFixed(0);
  const bar = '█'.repeat(stats.exact) + '░'.repeat(stats.total - stats.exact);
  console.log(`  ${type.padEnd(15)} | ${stats.exact}/${stats.total} (${pct.padStart(3)}%) ${bar}`);
});

console.log(`\n${colors.cyan}Key Insight: This is the expert-validated reference set.${colors.reset}`);
console.log(`${colors.cyan}Use this to calibrate the five-factor algorithm.${colors.reset}\n`);
