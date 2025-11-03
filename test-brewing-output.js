import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { BrewingRenderer } from './endpoint/src/processors/renderers/BrewingRenderer.js';

// Test data - Longjing
const testTea = {
  name: "Longjing",
  type: "green",
  subType: "longjing",
  processingMethods: ["pan-firing"],
  geography: {
    location: "West Lake",
    province: "Zhejiang",
    country: "China",
    altitude: 200,
    humidity: 78,
    temperature: 17.2,
    solarRadiation: 168
  },
  caffeineLevel: 2.5,
  lTheanineLevel: 4.5
};

async function test() {
  const [processingResult, geographyResult, compoundResult] = await Promise.all([
    new ProcessingInferrer().infer({ processingMethods: testTea.processingMethods }),
    new GeographyInferrer().infer({ geography: testTea.geography }),
    new CompoundInferrer().infer({
      caffeineLevel: testTea.caffeineLevel,
      lTheanineLevel: testTea.lTheanineLevel
    })
  ]);

  const result = new BrewingRenderer().render({
    formData: testTea,
    processing: processingResult,
    geography: geographyResult,
    compound: compoundResult
  });

  console.log("=== BREWING RENDERER OUTPUT ===");
  console.log(JSON.stringify(result, null, 2));
  console.log("\n=== KEYS ===");
  console.log(Object.keys(result).sort());
}

test().catch(console.error);
