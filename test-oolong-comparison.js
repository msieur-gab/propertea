import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
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
  console.log("=== TESTING OOLONG ON FORM-INTEGRATION BRANCH ===\n");
  
  const [flavorResult, compoundResult, teaTypeResult] = await Promise.all([
    new FlavorInferrer().infer({ flavorProfiles: oologData.flavorProfile }),
    new CompoundInferrer().infer({
      caffeineLevel: oologData.caffeineLevel,
      lTheanineLevel: oologData.lTheanineLevel
    }),
    new TeaTypeInferrer().infer({
      type: oologData.type,
      subType: oologData.subType
    })
  ]);

  console.log("FLAVOR INFERENCE:", JSON.stringify(flavorResult, null, 2).substring(0, 300) + "...");
  console.log("\nCOMPOUND INFERENCE:", JSON.stringify(compoundResult, null, 2).substring(0, 300) + "...");
  console.log("\nTEA TYPE INFERENCE:", JSON.stringify(teaTypeResult, null, 2).substring(0, 300) + "...");

  // Test Food Renderer with positional args (old signature)
  console.log("\n=== FOOD RENDERER (OLD POSITIONAL SIGNATURE) ===");
  const foodResult = new FoodRenderer().render(flavorResult, compoundResult, teaTypeResult);
  console.log("Food recommendations count:", foodResult.recommendations?.length || 0);
  console.log("Food confidence:", foodResult.confidence);
  console.log("First recommendation:", foodResult.recommendations?.[0] ? JSON.stringify(foodResult.recommendations[0], null, 2).substring(0, 200) + "..." : "NONE");

  // Test Brewing Renderer with positional args (old signature)
  console.log("\n=== BREWING RENDERER (OLD POSITIONAL SIGNATURE) ===");
  const brewingResult = new BrewingRenderer().render(oologData, {}, {}, compoundResult, 'gongfu');
  console.log("Brewing styles count:", brewingResult.brewingStyles?.length || 0);
  console.log("Brewing confidence:", brewingResult.confidence);
  console.log("Brewing trace:", brewingResult.trace?.length || 0, "steps");
}

test().catch(console.error);
