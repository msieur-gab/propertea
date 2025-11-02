/**
 * Debug Test - See what renderers actually return
 */

import { SeasonRenderer } from '../../endpoint/src/processors/renderers/SeasonRenderer.js';
import { BrewingRenderer } from '../../endpoint/src/processors/renderers/BrewingRenderer.js';
import { TimeRenderer } from '../../endpoint/src/processors/renderers/TimeRenderer.js';
import { CompoundInferrer } from '../../endpoint/src/processors/inferrers/CompoundInferrer.js';
import { FlavorInferrer } from '../../endpoint/src/processors/inferrers/FlavorInferrer.js';
import { TeaTypeInferrer } from '../../endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from '../../endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from '../../endpoint/src/processors/inferrers/ProcessingInferrer.js';

const sampleTea = {
  name: 'Ali Shan Oolong',
  originalName: '阿里山烏龍茶',
  type: 'oolong',
  subType: 'high-mountain-oolong',
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: ['floral', 'buttery', 'sweet', 'creamy', 'honeysuckle'],
  processingMethods: ['withered', 'partial-oxidation', 'ball-rolled', 'minimal-roast'],
  geography: {
    location: 'Alishan',
    province: 'Chiayi',
    country: 'Taiwan',
    latitude: 23.47,
    longitude: 120.8,
    altitude: 1500,
    humidity: 80,
    temperature: 14.8,
    solarRadiation: 180
  }
};

async function debug() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    RENDERER DEBUG TEST                         ║');
  console.log('║           Examining actual renderer output structures          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  // Run all Inferrers
  console.log('🔍 Running Inferrers...\n');

  const compoundAnalysis = await new CompoundInferrer().infer({
    caffeineLevel: sampleTea.caffeineLevel,
    lTheanineLevel: sampleTea.lTheanineLevel
  });

  const flavorAnalysis = await new FlavorInferrer().infer({
    flavorProfiles: sampleTea.flavorProfile || []
  });

  const teaTypeAnalysis = await new TeaTypeInferrer().infer({
    type: sampleTea.type,
    subType: sampleTea.subType
  });

  const geographyAnalysis = await new GeographyInferrer().infer({
    geography: sampleTea.geography || {}
  });

  const processingAnalysis = await new ProcessingInferrer().infer({
    processingMethods: sampleTea.processingMethods || []
  });

  console.log('✓ All inferrers completed\n');

  // Test TimeRenderer
  console.log('─'.repeat(60));
  console.log('📊 TimeRenderer Output:');
  console.log('─'.repeat(60));

  const timeResult = new TimeRenderer().render(compoundAnalysis);
  console.log('Structure keys:', Object.keys(timeResult));
  console.log('Recommendations count:', timeResult.recommendations?.length || 0);
  if (timeResult.recommendations && timeResult.recommendations.length > 0) {
    console.log('First recommendation:', JSON.stringify(timeResult.recommendations[0], null, 2));
  }

  // Test SeasonRenderer
  console.log('\n' + '─'.repeat(60));
  console.log('🌱 SeasonRenderer Output:');
  console.log('─'.repeat(60));

  const seasonResult = new SeasonRenderer().render(
    geographyAnalysis,
    processingAnalysis,
    teaTypeAnalysis,
    flavorAnalysis
  );
  console.log('Structure keys:', Object.keys(seasonResult));
  console.log('Recommendations count:', seasonResult.recommendations?.length || 0);
  if (seasonResult.recommendations && seasonResult.recommendations.length > 0) {
    console.log('First recommendation:', JSON.stringify(seasonResult.recommendations[0], null, 2));
  } else {
    console.log('Full seasonResult object:', JSON.stringify(seasonResult, null, 2));
  }

  // Test BrewingRenderer
  console.log('\n' + '─'.repeat(60));
  console.log('☕ BrewingRenderer Output:');
  console.log('─'.repeat(60));

  const brewingResult = new BrewingRenderer().render(sampleTea);
  console.log('Structure keys:', Object.keys(brewingResult));
  console.log('Has recommendations property:', 'recommendations' in brewingResult);
  console.log('Has brewingStyles property:', 'brewingStyles' in brewingResult);
  if (brewingResult.recommendations) {
    console.log('Recommendations count:', brewingResult.recommendations.length);
  }
  if (brewingResult.brewingStyles) {
    console.log('BrewingStyles count:', brewingResult.brewingStyles.length);
    console.log('First brewing style:', JSON.stringify(brewingResult.brewingStyles[0], null, 2));
  }
}

debug().catch(err => console.error('Error:', err));
