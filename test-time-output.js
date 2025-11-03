import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';

const testTea = {
  name: "Longjing",
  type: "green",
  caffeineLevel: 2.5,
  lTheanineLevel: 4.5
};

async function test() {
  const [compoundResult, teaTypeResult] = await Promise.all([
    new CompoundInferrer().infer({
      caffeineLevel: testTea.caffeineLevel,
      lTheanineLevel: testTea.lTheanineLevel
    }),
    new TeaTypeInferrer().infer({
      type: testTea.type
    })
  ]);

  const result = new TimeRenderer().render({
    compound: compoundResult,
    teaType: teaTypeResult
  });

  console.log("=== TIME RENDERER OUTPUT ===");
  console.log(JSON.stringify(result, null, 2));
  console.log("\n=== TRACE LENGTH ===");
  console.log(`Trace array length: ${result.trace.length}`);
  console.log("\n=== TRACE ENTRIES ===");
  console.log(JSON.stringify(result.trace, null, 2));
}

test().catch(console.error);
