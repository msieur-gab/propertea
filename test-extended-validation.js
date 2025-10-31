/**
 * Test validation against the extended dataset with proper subType fields
 */

import { TeaModel } from './backend/src/models/TeaModel.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import fs from 'fs';

// Load extended dataset
const extendedSetPath = './_dataset/chinese_teas_validation_extended_set.json';
let extendedSet = [];

try {
  extendedSet = JSON.parse(fs.readFileSync(extendedSetPath, 'utf8'));
} catch (e) {
  console.error('Error loading extended dataset:', e.message);
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
  console.log('EXTENDED DATASET VALIDATION - With Proper subType Fields');
  console.log('='.repeat(120));
  console.log();

  let results = [];
  let perfect = 0, partial = 0, different = 0;

  for (const tea of extendedSet) {
    try {
      const calculated = await analyzeTea(tea);
      const status = compareEffects(calculated, tea.expectedEffects);

      if (status.includes('PERFECT')) perfect++;
      else if (status.includes('PARTIAL')) partial++;
      else different++;

      results.push({
        name: tea.name,
        type: tea.type,
        subType: tea.subType || 'none',
        expected: tea.expectedEffects,
        calculated: calculated,
        status: status
      });

      const typeInfo = tea.subType ? `${tea.type}/${tea.subType}` : tea.type;
      console.log(`${tea.name.padEnd(40)} ${typeInfo.padEnd(20)} Expected: ${tea.expectedEffects.dominant.padEnd(12)} + ${tea.expectedEffects.supporting.padEnd(12)} | Calculated: ${calculated.dominant.padEnd(12)} + ${calculated.supporting.padEnd(12)} | ${status}`);
    } catch (error) {
      console.error(`✗ Error analyzing ${tea.name}:`, error.message);
    }
  }

  console.log();
  console.log(`\nExtended Set Results: ${perfect} PERFECT | ${partial} PARTIAL | ${different} DIFFERENT`);
  const accuracy = ((perfect + partial) / extendedSet.length * 100).toFixed(1);
  console.log(`Accuracy: ${accuracy}% (Perfect + Partial matches)`);

  // Summary of different results
  const differentResults = results.filter(r => r.status.includes('DIFFERENT'));
  if (differentResults.length > 0) {
    console.log('\n' + '─'.repeat(120));
    console.log(`ANALYSIS OF ${differentResults.length} DIFFERENT RESULTS`);
    console.log('─'.repeat(120));

    differentResults.forEach(result => {
      console.log(`\n${result.name} (${result.type}${result.subType !== 'none' ? '/' + result.subType : ''})`);
      console.log(`  Expected:    ${result.expected.dominant} + ${result.expected.supporting}`);
      console.log(`  Calculated:  ${result.calculated.dominant} + ${result.calculated.supporting}`);
    });
  }

  // Summary statistics
  console.log('\n' + '='.repeat(120));
  console.log('SUMMARY STATISTICS');
  console.log('='.repeat(120));
  console.log(`Total Teas Tested: ${extendedSet.length}`);
  console.log(`Perfect Matches:   ${perfect} (${(perfect / extendedSet.length * 100).toFixed(1)}%)`);
  console.log(`Partial Matches:   ${partial} (${(partial / extendedSet.length * 100).toFixed(1)}%)`);
  console.log(`Different:         ${different} (${(different / extendedSet.length * 100).toFixed(1)}%)`);
  console.log(`Combined Accuracy: ${accuracy}%`);
  console.log();
}

runValidation().catch(console.error);
