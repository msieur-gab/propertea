import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { BrewingRenderer } from './endpoint/src/processors/renderers/BrewingRenderer.js';

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

  console.log("=== FOOD RENDERER (WITH ALL INFERENCES) ===\n");
  const foodResult = new FoodRenderer().render(flavorResult, compoundResult, teaTypeResult);
  console.log(JSON.stringify(foodResult, null, 2));

  console.log("\n\n=== BREWING RENDERER (WITH ALL INFERENCES) ===\n");
  // OLD SIGNATURE: render(formData, processingInference, geographyInference, compoundInference, brewingStyle)
  const brewingResult = new BrewingRenderer().render(oologData, processingResult, geographyResult, compoundResult, 'gongfu');
  console.log(JSON.stringify(brewingResult, null, 2));
}

test().catch(console.error);
