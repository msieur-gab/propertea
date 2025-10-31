/**
 * Parameter Audit Test
 *
 * Inspects exactly what parameters are being extracted and used for effect calculation
 * Shows all 5 factors (tea type, compounds, flavor, processing, geography) for specific teas
 */

import { TeaCalculationOrchestrator } from './backend/src/models/TeaCalculationOrchestrator.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import { RecommendationService } from './backend/src/services/RecommendationService.js';
import fs from 'fs';

const dataset = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_comprehensive.json', 'utf8'));

const services = {
  teaTypeService: new TeaTypeService(),
  compoundService: new CompoundService(),
  flavorService: new FlavorService(),
  processingService: new ProcessingService(),
  geographyService: new GeographyService(),
  effectService: new EffectService(),
  recommendationService: new RecommendationService()
};

const orchestrator = new TeaCalculationOrchestrator(services);

// Test specific teas to audit parameters
const testIndices = [
  2,   // Dragon Well Green Tea - failing badly
  0,   // Traditional Tie Guan Yin - oolong issue
  10,  // Lapsang Souchong - red tea
  4,   // Silver Needle White Tea - working well
];

async function auditTea(tea, index) {
  console.log('\n' + '═'.repeat(80));
  console.log(`TEA [${String(index + 1).padStart(2)}]: ${tea.name}`);
  console.log('═'.repeat(80));

  console.log(`\n📋 INPUT DATA:`);
  console.log(`  Type: ${tea.type}${tea.subType ? ' (subType: ' + tea.subType + ')' : ''}`);
  console.log(`  Caffeine Level: ${tea.caffeineLevel}/5`);
  console.log(`  L-Theanine Level: ${tea.lTheanineLevel}/5`);
  console.log(`  Flavor Profile: ${tea.flavorProfile.join(', ')}`);
  console.log(`  Processing Methods: ${tea.processingMethods.join(', ')}`);
  console.log(`  Geography: ${tea.geography}`);
  console.log(`  Expected Effects: ${tea.expectedEffects.dominant} + ${tea.expectedEffects.supporting}`);

  const teaData = {
    name: tea.name,
    type: tea.type,
    subType: tea.subType || undefined,
    caffeineLevel: tea.caffeineLevel,
    lTheanineLevel: tea.lTheanineLevel,
    flavorProfile: tea.flavorProfile,
    processingMethods: tea.processingMethods,
    geography: tea.geography
  };

  try {
    // Manually call each service to see what they extract
    console.log(`\n📊 EXTRACTED PARAMETERS:`);

    // Tea Type
    const teaTypeResult = await services.teaTypeService.analyze(teaData);
    console.log(`\n  [Tea Type Service]`);
    console.log(`    Canonical Type: ${teaTypeResult.data?.canonical || 'unknown'}`);
    console.log(`    Subtype: ${teaTypeResult.data?.subtype || 'none'}`);

    // Compounds
    const compoundResult = await services.compoundService.analyze(teaData);
    console.log(`\n  [Compound Service]`);
    console.log(`    Stimulation Level: ${compoundResult.data?.analysis?.stimulationLevel || 'unknown'}`);
    console.log(`    Relaxation Level: ${compoundResult.data?.analysis?.relaxationLevel || 'unknown'}`);
    console.log(`    Caffeine Score: ${compoundResult.data?.analysis?.caffeineScore || 'unknown'}`);
    console.log(`    L-Theanine Score: ${compoundResult.data?.analysis?.lTheanineScore || 'unknown'}`);
    console.log(`    Balance: ${compoundResult.data?.analysis?.balance || 'unknown'}`);

    // Flavor
    const flavorResult = await services.flavorService.analyze(teaData);
    console.log(`\n  [Flavor Service]`);
    console.log(`    Categories: ${flavorResult.data?.profile?.categories?.join(', ') || 'none'}`);
    console.log(`    Primary: ${flavorResult.data?.profile?.primary || 'unknown'}`);
    console.log(`    Secondary: ${flavorResult.data?.profile?.secondary?.join(', ') || 'none'}`);

    // Processing
    const processingResult = await services.processingService.analyze(teaData);
    console.log(`\n  [Processing Service]`);
    console.log(`    Roast Level: ${processingResult.data?.roastLevel || 'unknown'}`);
    console.log(`    Oxidation: ${processingResult.data?.oxidationLevel || 'unknown'}`);
    console.log(`    Methods: ${processingResult.data?.methods?.join(', ') || 'none'}`);

    // Geography
    const geographyResult = await services.geographyService.analyze(teaData);
    console.log(`\n  [Geography Service]`);
    if (geographyResult.data?.climate) {
      console.log(`    Altitude: ${geographyResult.data.climate.altitude}m`);
      console.log(`    Temperature: ${geographyResult.data.climate.temperature}°C`);
      console.log(`    Humidity: ${geographyResult.data.climate.humidity}%`);
      console.log(`    Solar Radiation: ${geographyResult.data.climate.solarRadiation}W/m²`);
    } else {
      console.log(`    Climate data: NOT AVAILABLE`);
    }

    // Full orchestrator result
    console.log(`\n💭 EFFECT CALCULATION RESULT:`);
    const result = await orchestrator.calculateTea(teaData);
    if (result.success) {
      console.log(`    Dominant: ${result.data.effects.expectedEffects.dominant}`);
      console.log(`    Supporting: ${result.data.effects.expectedEffects.supporting}`);
      console.log(`    All Scores: ${JSON.stringify(result.data.effects.allScores, null, 2).split('\n').slice(0, 10).join('\n')}`);
      console.log(`    ...[truncated]`);
    } else {
      console.log(`    ERROR: ${result.error}`);
    }

    // Compare
    const calculated = result.data?.effects?.expectedEffects;
    const matches = {
      dominant: calculated?.dominant === tea.expectedEffects.dominant,
      supporting: calculated?.supporting === tea.expectedEffects.supporting
    };
    console.log(`\n✅ COMPARISON:`);
    console.log(`    Expected:   ${tea.expectedEffects.dominant} + ${tea.expectedEffects.supporting}`);
    console.log(`    Got:        ${calculated?.dominant} + ${calculated?.supporting}`);
    console.log(`    Dominant Match: ${matches.dominant ? '✓' : '✗'}`);
    console.log(`    Supporting Match: ${matches.supporting ? '✓' : '✗'}`);

  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
  }
}

async function runAudit() {
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║              ALGORITHM PARAMETER AUDIT TEST                        ║');
  console.log('║   Inspecting 5-factor algorithm for sample teas                    ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');

  for (const idx of testIndices) {
    if (idx < dataset.length) {
      await auditTea(dataset[idx], idx);
    }
  }

  console.log('\n' + '═'.repeat(80));
  console.log('AUDIT COMPLETE');
  console.log('═'.repeat(80) + '\n');
}

runAudit().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
