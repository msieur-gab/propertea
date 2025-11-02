import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';

const flavorInferrer = new FlavorInferrer();

const result = await flavorInferrer.infer({
  flavorProfiles: ["orchid", "creamy", "sweet", "floral", "buttery"]
});

console.log('Keys in analysis:');
Object.keys(result.analysis).forEach(key => {
  if (Array.isArray(result.analysis[key])) {
    console.log(`  ${key}: Array of ${result.analysis[key].length} items`);
  } else {
    console.log(`  ${key}: ${JSON.stringify(result.analysis[key]).substring(0, 60)}`);
  }
});

console.log('\nFlavorProfile value:');
console.log('result.analysis.flavorProfile:', result.analysis.flavorProfile);

console.log('\nIdentifiedFlavors value:');
console.log('result.analysis.identifiedFlavors:', result.analysis.identifiedFlavors);
