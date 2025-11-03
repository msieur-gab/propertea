#!/usr/bin/env node

/**
 * Test Renderer Outputs
 * Call renderers directly with proper data to see what they actually output
 * This will inform us about proper raw format design
 */

import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';

import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';
import { TerroirRenderer } from './endpoint/src/processors/renderers/TerroirRenderer.js';

// Test data: Ali Shan Oolong from test-ui.html
const testTea = {
  name: "Ali Shan Oolong",
  originalName: "阿里山烏龍 (Ālǐshān Wūlóng)",
  type: "oolong",
  subType: "high-mountain-oolong",
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: ["floral", "buttery", "sweet", "creamy", "honeysuckle"],
  geography: {
    location: "Alishan",
    province: "Chiayi",
    country: "Taiwan",
    latitude: 23.47,
    longitude: 120.80,
    altitude: 1500,
    humidity: 80,
    temperature: 14.8,
    solarRadiation: 180
  }
};

async function testRenderers() {
  console.log('🧪 Testing Renderer Outputs with Proper Data\n');
  console.log(`Tea: ${testTea.name}\n`);

  try {
    // Run all inferences
    console.log('⏳ Running inferences...\n');
    const [flavorResult, compoundResult, teaTypeResult, geographyResult] = await Promise.all([
      new FlavorInferrer().infer({ flavorProfiles: testTea.flavorProfile || [] }),
      new CompoundInferrer().infer({
        caffeineLevel: testTea.caffeineLevel,
        lTheanineLevel: testTea.lTheanineLevel
      }),
      new TeaTypeInferrer().infer({
        type: testTea.type,
        subType: testTea.subType
      }),
      new GeographyInferrer().infer({ geography: testTea.geography || {} })
    ]);

    // Test FoodRenderer
    console.log('='.repeat(60));
    console.log('FOOD RENDERER');
    console.log('='.repeat(60));
    const foodResult = new FoodRenderer().render({
      flavor: flavorResult,
      compound: compoundResult,
      teaType: teaTypeResult
    });
    console.log(JSON.stringify(foodResult, null, 2));

    // Test TimeRenderer
    console.log('\n' + '='.repeat(60));
    console.log('TIME RENDERER');
    console.log('='.repeat(60));
    const timeResult = new TimeRenderer().render({
      compound: compoundResult,
      teaType: teaTypeResult
    });
    console.log(JSON.stringify(timeResult, null, 2));

    // Test TerroirRenderer
    console.log('\n' + '='.repeat(60));
    console.log('TERROIR RENDERER');
    console.log('='.repeat(60));
    const terroirResult = new TerroirRenderer().render({
      geography: geographyResult,
      teaType: teaTypeResult,
      formData: testTea,
      compound: compoundResult,
      flavor: flavorResult
    });
    console.log(JSON.stringify(terroirResult, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

testRenderers();
