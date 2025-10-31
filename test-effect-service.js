/**
 * Test script for EffectService with Ali Shan Oolong example
 *
 * Run with: node test-effect-service.js
 */

import { TeaModel } from './backend/src/models/TeaModel.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';

// Ali Shan Oolong test data
const aliShanData = {
  name: 'Ali Shan Oolong',
  originalName: '阿里山烏龍 (Ālǐshān Wūlóng)',
  type: 'oolong',
  origin: 'Ali Mountain, Taiwan',
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: ['floral', 'buttery', 'sweet', 'creamy', 'honeysuckle'],
  processingMethods: ['withered', 'partial-oxidation', 'ball-rolled', 'minimal-roast'],
  geography: {
    altitude: 1500,
    humidity: 80,
    latitude: 23.47,
    longitude: 120.8,
    temperature: 14.8,
    solarRadiation: 180
  }
};

async function testEffectService() {
  console.log('='.repeat(80));
  console.log('Testing EffectService with Ali Shan Oolong');
  console.log('='.repeat(80));
  console.log();

  try {
    // Create tea model
    console.log('1. Creating TeaModel...');
    const teaModel = new TeaModel(aliShanData);
    console.log('   ✓ TeaModel created');
    console.log(`   - Name: ${teaModel.name}`);
    console.log(`   - Type: ${teaModel.type}`);
    console.log(`   - Caffeine: ${teaModel.caffeineLevel}, L-Theanine: ${teaModel.lTheanineLevel}`);
    console.log(`   - Flavors: ${teaModel.flavor.primary.join(', ')}`);
    console.log();

    // Run core analyses
    console.log('2. Running core analyses...');
    const teaTypeService = new TeaTypeService();
    const compoundService = new CompoundService();
    const flavorService = new FlavorService();
    const processingService = new ProcessingService();
    const geographyService = new GeographyService();

    const teaType = await teaTypeService.analyze(teaModel);
    const compounds = await compoundService.analyze(teaModel);
    const flavor = await flavorService.analyze(teaModel);
    const processing = await processingService.analyze(teaModel);
    const geography = await geographyService.analyze(teaModel);

    console.log('   ✓ Core analyses completed');
    console.log();

    console.log('3. Analysis Results:');
    console.log(`   Tea Type: ${teaType.identified.type}`);
    console.log(`   Compound Profile: ${compounds.analysis.compoundProfile}`);
    console.log(`   - Stimulation: ${compounds.analysis.stimulationLevel}`);
    console.log(`   - Relaxation: ${compounds.analysis.relaxationLevel}`);
    console.log(`   - Ratio: ${compounds.levels.lTheanineToCaffeineRatio.toFixed(2)}`);
    console.log(`   Flavor Categories: ${flavor.profile.categories.join(', ')}`);
    console.log(`   Processing: ${processing.roastLevel} roast`);
    console.log();

    // Build core analysis for effect calculation
    const coreAnalysis = {
      teaType,
      compounds,
      flavor,
      processing,
      geography,
      _sourceTea: teaModel
    };

    // Calculate effects
    console.log('4. Calculating expected effects...');
    const effectService = new EffectService();
    const effectsResult = await effectService.analyze(teaModel, coreAnalysis);

    console.log('   ✓ Effect analysis completed');
    console.log();

    console.log('5. EXPECTED EFFECTS RESULT:');
    console.log('   ' + '='.repeat(60));
    console.log(`   Dominant Effect: ${effectsResult.expectedEffects.dominant}`);
    console.log(`   Supporting Effect: ${effectsResult.expectedEffects.supporting}`);
    console.log('   ' + '='.repeat(60));
    console.log();

    console.log('6. Effect Reasoning:');
    console.log(`   Dominant: ${effectsResult.reasoning.dominant}`);
    console.log(`   Supporting: ${effectsResult.reasoning.supporting}`);
    console.log();

    console.log('7. All Effect Scores (sorted):');
    const sortedScores = Object.entries(effectsResult.allScores)
      .sort(([, a], [, b]) => b - a);

    sortedScores.forEach(([effect, score]) => {
      const bar = '█'.repeat(Math.round(score / 2));
      console.log(`   ${effect.padEnd(15)} ${bar} ${score.toFixed(1)}`);
    });
    console.log();

    console.log('8. Description:');
    console.log(`   ${effectsResult.description}`);
    console.log();

    // Output as JSON for comparison
    console.log('9. JSON Output Format:');
    console.log(JSON.stringify({
      expectedEffects: effectsResult.expectedEffects,
      reasoning: effectsResult.reasoning
    }, null, 2));
    console.log();

    console.log('='.repeat(80));
    console.log('✓ Test completed successfully!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('✗ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testEffectService().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
