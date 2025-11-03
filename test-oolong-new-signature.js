import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { BrewingRenderer } from './endpoint/src/processors/renderers/BrewingRenderer.js';

// Oolong roasted sample - Da Hong Pao (Big Red Robe)
const oologData = {
  name: "Da Hong Pao",
  type: "oolong",
  subType: "roasted_oolong",
  flavorProfile: ["roasted", "fruity", "floral", "woody", "sweet"],
  caffeineLevel: 3.5,
  lTheanineLevel: 4.0,
  processingMethods: ["roasting", "rolling"],
  geography: {
    location: "Wuyi Mountains",
    province: "Fujian",
    country: "China",
    altitude: 800,
    humidity: 85,
    temperature: 15.5,
    solarRadiation: 155
  }
};

async function test() {
  console.log("=== TESTING OOLONG ON UNIFIED-RENDERER-SIGNATURES BRANCH ===\n");
  
  const [flavorResult, compoundResult, teaTypeResult, geographyResult, processingResult] = await Promise.all([
    new FlavorInferrer().infer({ flavorProfiles: oologData.flavorProfile }),
    new CompoundInferrer().infer({
      caffeineLevel: oologData.caffeineLevel,
      lTheanineLevel: oologData.lTheanineLevel
    }),
    new TeaTypeInferrer().infer({
      type: oologData.type,
      subType: oologData.subType
    }),
    new GeographyInferrer().infer({ geography: oologData.geography }),
    new ProcessingInferrer().infer({ processingMethods: oologData.processingMethods })
  ]);

  console.log("FLAVOR INFERENCE:", JSON.stringify(flavorResult, null, 2).substring(0, 300) + "...");
  console.log("\nCOMPOUND INFERENCE:", JSON.stringify(compoundResult, null, 2).substring(0, 300) + "...");
  console.log("\nTEA TYPE INFERENCE:", JSON.stringify(teaTypeResult, null, 2).substring(0, 300) + "...");

  // Test Food Renderer with new unified signature
  console.log("\n=== FOOD RENDERER (NEW UNIFIED SIGNATURE) ===");
  const foodResult = new FoodRenderer().render({
    flavor: flavorResult,
    compound: compoundResult,
    teaType: teaTypeResult
  });
  console.log("Food recommendations count:", foodResult.recommendations?.length || 0);
  console.log("Food confidence:", foodResult.confidence);
  console.log("First recommendation:", foodResult.recommendations?.[0] ? JSON.stringify(foodResult.recommendations[0], null, 2).substring(0, 200) + "..." : "NONE");

  // Test Brewing Renderer with new unified signature
  console.log("\n=== BREWING RENDERER (NEW UNIFIED SIGNATURE) ===");
  const brewingResult = new BrewingRenderer().render({
    formData: oologData,
    processing: processingResult,
    geography: geographyResult,
    compound: compoundResult
  });
  console.log("Brewing styles count:", brewingResult.brewingStyles?.length || 0);
  console.log("Brewing confidence:", brewingResult.confidence);
  console.log("Brewing trace:", brewingResult.trace?.length || 0, "steps");
}

test().catch(console.error);
