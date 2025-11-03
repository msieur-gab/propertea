import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';

const teas = [
  {
    name: "Tie Guan Yin",
    flavorProfile: ["orchid", "creamy", "sweet", "floral", "buttery"]
  },
  {
    name: "Da Hong Pao",
    flavorProfile: ["roasted", "mineral", "dark fruits", "woody", "caramel"]
  }
];

const inferrer = new FlavorInferrer();

for (const tea of teas) {
  const result = await inferrer.infer({ flavorProfiles: tea.flavorProfile });
  console.log(`\n${tea.name}:`);
  console.log(JSON.stringify(result.analysis, null, 2));
}
