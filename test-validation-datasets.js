/**
 * Comprehensive validation test against Chinese tea datasets
 * Tests our 5-factor EffectService against expected effects
 */

import { TeaModel } from './backend/src/models/TeaModel.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import fs from 'fs';

// Load datasets
const validationSetPath = './_dataset/chinese_teas_validation_set.json';
const effectsSetPath = './_dataset/chinese_teas_effects.json';

let validationSet = [];
let effectsSet = [];

try {
  validationSet = JSON.parse(fs.readFileSync(validationSetPath, 'utf8'));
  effectsSet = JSON.parse(fs.readFileSync(effectsSetPath, 'utf8'));
} catch (e) {
  console.error('Error loading datasets:', e.message);
  process.exit(1);
}

async function analyzeTea(teaData) {
  const teaModel = new TeaModel(teaData);
  const teaType = await new TeaTypeService().analyze(teaModel);
  const compounds = await new CompoundService().analyze(teaModel);
  const flavor = await new FlavorService().analyze(teaModel);
  const processing = await new ProcessingService().analyze(teaModel);
  const geography = await new GeographyService().analyze(teaModel);

  const coreAnalysis = { teaType, compounds, flavor, processing, geography, _sourceTea: teaModel };
  const effects = await new EffectService().analyze(teaModel, coreAnalysis);

  return effects.expectedEffects;
}

function compareEffects(calculated, expected) {
  const domMatch = calculated.dominant === expected.dominant;
  const supMatch = calculated.supporting === expected.supporting;

  if (domMatch && supMatch) return 'PERFECT ✓✓';
  if (domMatch || supMatch) return 'PARTIAL ✓';
  return 'DIFFERENT ⚠';
}

async function runValidation() {
  console.log('='.repeat(120));
  console.log('TEA EFFECTS VALIDATION - TESTING 5-FACTOR EFFECTSERVICE');
  console.log('='.repeat(120));
  console.log();

  // Test validation set (smaller, 12 teas)
  console.log('\n' + '█'.repeat(120));
  console.log('DATASET 1: Validation Set (12 teas) - chinese_teas_validation_set.json');
  console.log('█'.repeat(120));
  console.log();

  let validationResults = [];
  let perfect = 0, partial = 0, different = 0;

  for (const tea of validationSet) {
    try {
      const calculated = await analyzeTea(tea);
      const status = compareEffects(calculated, tea.expectedEffects);

      let statusIcon = '';
      if (status.includes('PERFECT')) perfect++;
      else if (status.includes('PARTIAL')) partial++;
      else different++;

      validationResults.push({
        name: tea.name,
        type: tea.type,
        expected: tea.expectedEffects,
        calculated: calculated,
        status: status
      });

      console.log(`${tea.name.padEnd(40)} ${tea.type.padEnd(15)} Expected: ${tea.expectedEffects.dominant.padEnd(12)} + ${tea.expectedEffects.supporting.padEnd(12)} | Calculated: ${calculated.dominant.padEnd(12)} + ${calculated.supporting.padEnd(12)} | ${status}`);
    } catch (error) {
      console.error(`✗ Error analyzing ${tea.name}:`, error.message);
    }
  }

  console.log();
  console.log(`Validation Set Results: ${perfect} PERFECT | ${partial} PARTIAL | ${different} DIFFERENT`);
  const validationAccuracy = ((perfect + partial) / validationSet.length * 100).toFixed(1);
  console.log(`Accuracy: ${validationAccuracy}% (Perfect + Partial matches)`);

  // Test effects set (larger, 27 teas)
  console.log('\n\n' + '█'.repeat(120));
  console.log('DATASET 2: Effects Set (27 teas) - chinese_teas_effects.json');
  console.log('█'.repeat(120));
  console.log();

  let effectsResults = [];
  perfect = 0;
  partial = 0;
  different = 0;

  for (const tea of effectsSet) {
    try {
      const calculated = await analyzeTea(tea);
      const status = compareEffects(calculated, tea.expectedEffects);

      if (status.includes('PERFECT')) perfect++;
      else if (status.includes('PARTIAL')) partial++;
      else different++;

      effectsResults.push({
        name: tea.name,
        type: tea.type,
        expected: tea.expectedEffects,
        calculated: calculated,
        status: status
      });

      console.log(`${tea.name.padEnd(40)} ${tea.type.padEnd(15)} Expected: ${tea.expectedEffects.dominant.padEnd(12)} + ${tea.expectedEffects.supporting.padEnd(12)} | Calculated: ${calculated.dominant.padEnd(12)} + ${calculated.supporting.padEnd(12)} | ${status}`);
    } catch (error) {
      console.error(`✗ Error analyzing ${tea.name}:`, error.message);
    }
  }

  console.log();
  console.log(`Effects Set Results: ${perfect} PERFECT | ${partial} PARTIAL | ${different} DIFFERENT`);
  const effectsAccuracy = ((perfect + partial) / effectsSet.length * 100).toFixed(1);
  console.log(`Accuracy: ${effectsAccuracy}% (Perfect + Partial matches)`);

  // Combined summary
  console.log('\n\n' + '='.repeat(120));
  console.log('COMBINED RESULTS');
  console.log('='.repeat(120));
  console.log();

  const allResults = [...validationResults, ...effectsResults];
  const allPerfect = allResults.filter(r => r.status.includes('PERFECT')).length;
  const allPartial = allResults.filter(r => r.status.includes('PARTIAL')).length;
  const allDifferent = allResults.filter(r => r.status.includes('DIFFERENT')).length;

  console.log(`Total Teas Tested: ${allResults.length}`);
  console.log(`Perfect Matches:   ${allPerfect} (${(allPerfect/allResults.length*100).toFixed(1)}%)`);
  console.log(`Partial Matches:   ${allPartial} (${(allPartial/allResults.length*100).toFixed(1)}%)`);
  console.log(`Different:         ${allDifferent} (${(allDifferent/allResults.length*100).toFixed(1)}%)`);
  console.log(`Combined Accuracy: ${((allPerfect + allPartial)/allResults.length*100).toFixed(1)}%`);

  // Show mismatches
  const mismatches = allResults.filter(r => r.status.includes('DIFFERENT'));
  if (mismatches.length > 0) {
    console.log('\n\n' + '─'.repeat(120));
    console.log(`ANALYSIS OF ${mismatches.length} DIFFERENT RESULTS`);
    console.log('─'.repeat(120));
    console.log();

    mismatches.forEach(mismatch => {
      console.log(`${mismatch.name} (${mismatch.type})`);
      console.log(`  Expected:    ${mismatch.expected.dominant} + ${mismatch.expected.supporting}`);
      console.log(`  Calculated:  ${mismatch.calculated.dominant} + ${mismatch.calculated.supporting}`);
      console.log();
    });
  }

  // Show partials
  const partials = allResults.filter(r => r.status.includes('PARTIAL'));
  if (partials.length > 0) {
    console.log('\n' + '─'.repeat(120));
    console.log(`ANALYSIS OF ${partials.length} PARTIAL MATCHES`);
    console.log('─'.repeat(120));
    console.log();

    partials.forEach(partial => {
      console.log(`${partial.name} (${partial.type})`);
      console.log(`  Expected:    ${partial.expected.dominant} + ${partial.expected.supporting}`);
      console.log(`  Calculated:  ${partial.calculated.dominant} + ${partial.calculated.supporting}`);
      const match = partial.expected.dominant === partial.calculated.dominant ? 'Dominant' : 'Supporting';
      console.log(`  Match Type:  ${match} effect matches`);
      console.log();
    });
  }

  console.log('\n' + '='.repeat(120));
  console.log('✓ Validation complete!');
  console.log('='.repeat(120));
}

runValidation().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
