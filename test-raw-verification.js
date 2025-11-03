import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';

// Test data - Longjing from dataset
const testTea = {
  name: "Longjing",
  type: "green",
  flavorProfile: ["chestnut", "sweet", "fresh", "vegetal", "delicate"],
  caffeineLevel: 2.5,
  lTheanineLevel: 4.5
};

async function test() {
  // Run inferences
  const [flavorResult, compoundResult, teaTypeResult] = await Promise.all([
    new FlavorInferrer().infer({ flavorProfiles: testTea.flavorProfile }),
    new CompoundInferrer().infer({
      caffeineLevel: testTea.caffeineLevel,
      lTheanineLevel: testTea.lTheanineLevel
    }),
    new TeaTypeInferrer().infer({
      type: testTea.type,
      subType: undefined
    })
  ]);

  // Get raw renderer output
  const rendererResult = new FoodRenderer().render({
    flavor: flavorResult,
    compound: compoundResult,
    teaType: teaTypeResult
  });

  console.log("=== RAW RENDERER OUTPUT ===");
  console.log(JSON.stringify(rendererResult, null, 2));
  console.log("\n=== KEYS IN RENDERER OUTPUT ===");
  console.log(Object.keys(rendererResult));
}

test();
