import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Use Taiwanese High Mountain Oolong as example
const exampleTea = dataset.find(t => t.name === 'Taiwanese High Mountain Oolong');

if (exampleTea) {
  console.log('=== TAIWANESE HIGH MOUNTAIN OOLONG - DETAILED CALCULATION ===\n');
  console.log('STEP 1: INPUT TEA DATA');
  console.log('─'.repeat(50));
  console.log(`Name: ${exampleTea.name}`);
  console.log(`Tea Type: ${exampleTea.type}`);
  console.log(`Subtype: ${exampleTea.subType || 'none'}`);
  console.log(`Caffeine Level: ${exampleTea.caffeineLevel}`);
  console.log(`L-Theanine Level: ${exampleTea.lTheanineLevel}`);
  console.log(`Flavor Profile: ${exampleTea.flavorProfile}`);
  console.log(`Processing Methods: ${exampleTea.processingMethods}`);
  console.log(`Geography: Altitude=${exampleTea.geography?.altitude}, Region=${exampleTea.geography?.region}`);
  console.log();

  console.log('STEP 2: WHAT WE EXPECT');
  console.log('─'.repeat(50));
  console.log(`Expected Dominant Effect: ${exampleTea.expectedEffects.dominant}`);
  console.log(`Expected Supporting Effect: ${exampleTea.expectedEffects.supporting}`);
  console.log();

  console.log('STEP 3: WHAT WE CALCULATE');
  console.log('─'.repeat(50));
  const effectService = new EffectService();
  const result = effectService.infer(exampleTea, {});

  console.log(`Calculated Dominant Effect: ${result.expectedEffects.dominant}`);
  console.log(`Calculated Supporting Effect: ${result.expectedEffects.supporting}`);
  console.log();

  console.log('STEP 4: DETAILED EFFECT SCORES');
  console.log('─'.repeat(50));
  const sortedScores = Object.entries(result.allScores || {})
    .sort(([, a], [, b]) => b - a);
  sortedScores.forEach(([effect, score]) => {
    const bar = '█'.repeat(Math.round(score / 2));
    console.log(`${effect.padEnd(14)}: ${score.toFixed(1).padStart(5)} ${bar}`);
  });
  console.log();

  console.log('STEP 5: MATCH RESULT');
  console.log('─'.repeat(50));
  const domMatch = result.expectedEffects.dominant === exampleTea.expectedEffects.dominant;
  const supMatch = result.expectedEffects.supporting === exampleTea.expectedEffects.supporting;
  console.log(`Dominant Match: ${domMatch ? '✓ YES' : '✗ NO'}`);
  console.log(`Supporting Match: ${supMatch ? '✓ YES' : '✗ NO'}`);
  console.log(`Overall: ${domMatch && supMatch ? '✓ PASS' : '✗ FAIL'}`);
}
