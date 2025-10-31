/**
 * API Output Demo - Clean dataset by removing fields API should ignore
 * Sends only necessary fields to API and compares against expectedEffects
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
const rawDataset = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_extended_set.json', 'utf8'));

console.log('='.repeat(160));
console.log('API OUTPUT TEST - Clean Dataset (API-Only Fields)');
console.log('='.repeat(160));
console.log();
console.log(`Loaded: ${rawDataset.length} teas from extended dataset`);
console.log('Filtering to API-only fields: name, type, subType, caffeineLevel, lTheanineLevel, flavorProfile, processingMethods, geography');
console.log();

// Clean dataset - extract only fields the API needs
function cleanTeaData(tea) {
  return {
    name: tea.name,
    originalName: tea.originalName || '',
    type: tea.type,
    subType: tea.subType || '',
    caffeineLevel: tea.caffeineLevel || 0,
    lTheanineLevel: tea.lTheanineLevel || 0,
    flavorProfile: tea.flavorProfile || [],
    processingMethods: tea.processingMethods || [],
    geography: tea.geography || {}
  };
}

async function analyzeTeaForAPI(teaData) {
  const teaModel = new TeaModel(teaData);
  const teaType = await new TeaTypeService().analyze(teaModel);
  const compounds = await new CompoundService().analyze(teaModel);
  const flavor = await new FlavorService().analyze(teaModel);
  const processing = await new ProcessingService().analyze(teaModel);
  const geography = await new GeographyService().analyze(teaModel);

  const coreAnalysis = { teaType, compounds, flavor, processing, geography, _sourceTea: teaModel };
  const effects = await new EffectService().analyze(teaModel, coreAnalysis);

  return {
    success: true,
    data: {
      teaType,
      compounds,
      flavor,
      processing,
      geography,
      effects,
      calculatedAt: new Date().toISOString()
    }
  };
}

function compareEffects(calculated, expected) {
  const domMatch = calculated.dominant === expected.dominant;
  const supMatch = calculated.supporting === expected.supporting;

  if (domMatch && supMatch) return 'PERFECT ✓✓';
  if (domMatch || supMatch) return 'PARTIAL ✓';
  return 'DIFFERENT ⚠';
}

async function runTest() {
  let perfect = 0, partial = 0, different = 0;
  const results = [];

  console.log('Testing all ' + rawDataset.length + ' teas...\n');

  for (const rawTea of rawDataset) {
    const cleanTea = cleanTeaData(rawTea);

    try {
      const apiResponse = await analyzeTeaForAPI(cleanTea);
      const calculated = apiResponse.data.effects.expectedEffects;
      const expected = rawTea.expectedEffects;
      const status = compareEffects(calculated, expected);

      if (status.includes('PERFECT')) perfect++;
      else if (status.includes('PARTIAL')) partial++;
      else different++;

      const typeInfo = rawTea.subType ? `${rawTea.type}/${rawTea.subType}` : rawTea.type;

      results.push({
        name: rawTea.name,
        typeInfo,
        expected,
        calculated,
        status
      });

      console.log(`${rawTea.name.padEnd(40)} [${typeInfo.padEnd(18)}] Expected: ${expected.dominant.padEnd(12)} + ${expected.supporting.padEnd(12)} | Calculated: ${calculated.dominant.padEnd(12)} + ${calculated.supporting.padEnd(12)} | ${status}`);
    } catch (error) {
      console.log(`${rawTea.name.padEnd(40)} ❌ ERROR: ${error.message}`);
    }
  }

  // Summary
  console.log();
  console.log('='.repeat(160));
  console.log('SUMMARY');
  console.log('='.repeat(160));
  console.log(`Total Teas:        ${rawDataset.length}`);
  console.log(`Perfect Matches:   ${perfect} (${(perfect / rawDataset.length * 100).toFixed(1)}%)`);
  console.log(`Partial Matches:   ${partial} (${(partial / rawDataset.length * 100).toFixed(1)}%)`);
  console.log(`Different:         ${different} (${(different / rawDataset.length * 100).toFixed(1)}%)`);
  const accuracy = ((perfect + partial) / rawDataset.length * 100).toFixed(1);
  console.log(`Combined Accuracy: ${accuracy}%`);
  console.log();

  // Show examples
  const perfectExample = results.find(r => r.status.includes('PERFECT'));
  const partialExample = results.find(r => r.status.includes('PARTIAL') && !r.status.includes('PERFECT'));
  const differentExample = results.find(r => r.status.includes('DIFFERENT'));

  if (perfectExample) {
    console.log('='.repeat(160));
    console.log('✓✓ PERFECT EXAMPLE: ' + perfectExample.name);
    console.log('='.repeat(160));
    console.log(`Type: ${perfectExample.typeInfo}`);
    console.log(`Expected:    dominant="${perfectExample.expected.dominant}", supporting="${perfectExample.expected.supporting}"`);
    console.log(`Calculated:  dominant="${perfectExample.calculated.dominant}", supporting="${perfectExample.calculated.supporting}"`);
    console.log();
  }

  if (partialExample) {
    console.log('='.repeat(160));
    console.log('✓ PARTIAL EXAMPLE: ' + partialExample.name);
    console.log('='.repeat(160));
    console.log(`Type: ${partialExample.typeInfo}`);
    console.log(`Expected:    dominant="${partialExample.expected.dominant}", supporting="${partialExample.expected.supporting}"`);
    console.log(`Calculated:  dominant="${partialExample.calculated.dominant}", supporting="${partialExample.calculated.supporting}"`);
    const domMatch = partialExample.calculated.dominant === partialExample.expected.dominant;
    console.log(`Match: ${domMatch ? 'dominant' : 'supporting'}`);
    console.log();
  }

  if (differentExample) {
    console.log('='.repeat(160));
    console.log('⚠ DIFFERENT EXAMPLE: ' + differentExample.name);
    console.log('='.repeat(160));
    console.log(`Type: ${differentExample.typeInfo}`);
    console.log(`Expected:    dominant="${differentExample.expected.dominant}", supporting="${differentExample.expected.supporting}"`);
    console.log(`Calculated:  dominant="${differentExample.calculated.dominant}", supporting="${differentExample.calculated.supporting}"`);
    console.log();
  }
}

runTest().catch(console.error);
