/**
 * Demo test showing API output format and matching against expected effects
 * Uses direct service calls to show what the API would return
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
const dataset = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_extended_set.json', 'utf8'));

console.log('='.repeat(160));
console.log('API OUTPUT DEMO - Showing Calculated vs Expected Effects');
console.log('='.repeat(160));
console.log();

async function analyzeTeaForAPI(teaData) {
  const teaModel = new TeaModel(teaData);
  const teaType = await new TeaTypeService().analyze(teaModel);
  const compounds = await new CompoundService().analyze(teaModel);
  const flavor = await new FlavorService().analyze(teaModel);
  const processing = await new ProcessingService().analyze(teaModel);
  const geography = await new GeographyService().analyze(teaModel);

  const coreAnalysis = { teaType, compounds, flavor, processing, geography, _sourceTea: teaModel };
  const effects = await new EffectService().analyze(teaModel, coreAnalysis);

  // Return what the API would return
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

async function runDemo() {
  let perfect = 0, partial = 0, different = 0;
  const results = [];

  // Test first 12 teas
  const teaSubset = dataset.slice(0, 12);

  for (const tea of teaSubset) {
    const apiResponse = await analyzeTeaForAPI(tea);
    const calculated = apiResponse.data.effects.expectedEffects;
    const status = compareEffects(calculated, tea.expectedEffects);

    if (status.includes('PERFECT')) perfect++;
    else if (status.includes('PARTIAL')) partial++;
    else different++;

    const typeInfo = tea.subType ? `${tea.type}/${tea.subType}` : tea.type;

    results.push({
      name: tea.name,
      typeInfo,
      expected: tea.expectedEffects,
      calculated,
      status,
      apiResponse
    });

    console.log(`${tea.name.padEnd(35)} [${typeInfo.padEnd(18)}]`);
    console.log(`  Expected:    dominant="${tea.expectedEffects.dominant.padEnd(12)}" supporting="${tea.expectedEffects.supporting}"`);
    console.log(`  Calculated:  dominant="${calculated.dominant.padEnd(12)}" supporting="${calculated.supporting}"`);
    console.log(`  Match: ${status}`);
    console.log();
  }

  // Summary
  console.log('='.repeat(160));
  console.log('SUMMARY (12 teas tested)');
  console.log('='.repeat(160));
  console.log(`Perfect Matches:  ${perfect}`);
  console.log(`Partial Matches:  ${partial}`);
  console.log(`Different:        ${different}`);
  console.log(`Accuracy:         ${((perfect + partial) / teaSubset.length * 100).toFixed(1)}%`);
  console.log();

  // Show one full API response example
  console.log('='.repeat(160));
  console.log('EXAMPLE 1: FULL API RESPONSE (Perfect Match)');
  console.log('='.repeat(160));
  const perfectExample = results.find(r => r.status.includes('PERFECT'));
  if (perfectExample) {
    console.log(`\nTea: ${perfectExample.name}`);
    console.log('\nJSON Request Format:');
    console.log(JSON.stringify({
      name: perfectExample.name,
      type: dataset.find(t => t.name === perfectExample.name).type,
      subType: dataset.find(t => t.name === perfectExample.name).subType || null,
      caffeineLevel: dataset.find(t => t.name === perfectExample.name).caffeineLevel,
      lTheanineLevel: dataset.find(t => t.name === perfectExample.name).lTheanineLevel,
      flavorProfile: dataset.find(t => t.name === perfectExample.name).flavorProfile,
      processingMethods: dataset.find(t => t.name === perfectExample.name).processingMethods,
      geography: dataset.find(t => t.name === perfectExample.name).geography
    }, null, 2));

    console.log('\nJSON Response (effects section only):');
    console.log(JSON.stringify({
      effects: perfectExample.apiResponse.data.effects
    }, null, 2));

    console.log('\nComparison:');
    console.log(`Expected Effects: ${JSON.stringify(perfectExample.expected)}`);
    console.log(`Calculated Effects: ${JSON.stringify(perfectExample.calculated)}`);
    console.log(`✓✓ PERFECT MATCH!`);
  }

  // Show one partial match example
  console.log('\n' + '='.repeat(160));
  console.log('EXAMPLE 2: PARTIAL MATCH');
  console.log('='.repeat(160));
  const partialExample = results.find(r => r.status.includes('PARTIAL') && !r.status.includes('PERFECT'));
  if (partialExample) {
    console.log(`\nTea: ${partialExample.name}`);
    console.log(`\nExpected Effects: ${JSON.stringify(partialExample.expected)}`);
    console.log(`Calculated Effects: ${JSON.stringify(partialExample.calculated)}`);
    const domMatch = partialExample.calculated.dominant === partialExample.expected.dominant;
    const supMatch = partialExample.calculated.supporting === partialExample.expected.supporting;
    console.log(`\nResult:`);
    if (domMatch) console.log(`  ✓ Dominant effect matches: "${partialExample.calculated.dominant}"`);
    else console.log(`  ✗ Dominant effect: expected "${partialExample.expected.dominant}", got "${partialExample.calculated.dominant}"`);
    if (supMatch) console.log(`  ✓ Supporting effect matches: "${partialExample.calculated.supporting}"`);
    else console.log(`  ✗ Supporting effect: expected "${partialExample.expected.supporting}", got "${partialExample.calculated.supporting}"`);
    console.log(`\n✓ PARTIAL MATCH (one effect matches)`);
  }

  // Show one different example
  console.log('\n' + '='.repeat(160));
  console.log('EXAMPLE 3: DIFFERENT (No match)');
  console.log('='.repeat(160));
  const differentExample = results.find(r => r.status.includes('DIFFERENT'));
  if (differentExample) {
    console.log(`\nTea: ${differentExample.name}`);
    console.log(`\nExpected Effects: ${JSON.stringify(differentExample.expected)}`);
    console.log(`Calculated Effects: ${JSON.stringify(differentExample.calculated)}`);
    console.log(`\n⚠ DIFFERENT - Both effects don't match`);
    console.log(`  Expected dominant: "${differentExample.expected.dominant}" but got "${differentExample.calculated.dominant}"`);
    console.log(`  Expected supporting: "${differentExample.expected.supporting}" but got "${differentExample.calculated.supporting}"`);
  }

  // Show effect calculation details for one tea
  console.log('\n' + '='.repeat(160));
  console.log('EFFECT CALCULATION DETAILS (Example: Aged Ripe Puerh)');
  console.log('='.repeat(160));
  const puerh = dataset.find(t => t.name === 'Aged Ripe Puerh');
  if (puerh) {
    console.log(`\nTea: ${puerh.name}`);
    console.log(`Type: ${puerh.type}, SubType: ${puerh.subType}`);
    const apiResp = await analyzeTeaForAPI(puerh);
    console.log(`\nExpected Effects: ${JSON.stringify(puerh.expectedEffects)}`);
    console.log(`Calculated Effects: ${JSON.stringify(apiResp.data.effects.expectedEffects)}`);

    console.log(`\nDetailed Analysis from API Response:`);
    console.log(`\n1. Tea Type Analysis:`);
    console.log(JSON.stringify(apiResp.data.teaType, null, 2));

    console.log(`\n2. Compound Analysis:`);
    console.log(JSON.stringify(apiResp.data.compounds, null, 2));

    console.log(`\n3. Flavor Analysis:`);
    console.log(JSON.stringify(apiResp.data.flavor, null, 2));

    console.log(`\n4. Processing Analysis:`);
    console.log(JSON.stringify(apiResp.data.processing, null, 2));

    console.log(`\n5. Geography Analysis:`);
    console.log(JSON.stringify(apiResp.data.geography, null, 2));

    console.log(`\n6. Expected Effects (calculated):`);
    console.log(JSON.stringify(apiResp.data.effects.expectedEffects, null, 2));
  }
}

runDemo().catch(console.error);
