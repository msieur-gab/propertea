import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';
import { FlavorTaxonomy, ActivityTaxonomy } from './endpoint/src/taxonomies/index.js';

const teas = [
  {
    name: "Tie Guan Yin",
    type: "oolong",
    caffeineLevel: 4,
    lTheanineLevel: 5.5,
    flavorProfile: ["orchid", "creamy", "sweet", "floral", "buttery"]
  },
  {
    name: "Da Hong Pao",
    type: "oolong",
    caffeineLevel: 4.5,
    lTheanineLevel: 4.5,
    flavorProfile: ["roasted", "mineral", "dark fruits", "woody", "caramel"]
  }
];

const flavorInferrer = new FlavorInferrer();
const compoundInferrer = new CompoundInferrer();
const teaTypeInferrer = new TeaTypeInferrer();
const renderer = new ActivityRenderer();

for (const tea of teas) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Tea: ${tea.name}`);
  console.log('='.repeat(70));

  const [flavorResult, compoundResult, teaTypeResult] = await Promise.all([
    flavorInferrer.infer({ flavorProfiles: tea.flavorProfile }),
    compoundInferrer.infer({ caffeineLevel: tea.caffeineLevel, lTheanineLevel: tea.lTheanineLevel }),
    teaTypeInferrer.infer({ type: tea.type })
  ]);

  // Show identified flavors
  console.log('\nIdentified Flavors:');
  flavorResult.analysis.identifiedFlavors.forEach(flavor => {
    const flavorObj = FlavorTaxonomy.getFlavor(flavor);
    console.log(`  ${flavor}: ${flavorObj.activityHints.length} activity hints`);
  });

  // Manually calculate what ActivityRenderer should extract
  const hints = new Map();
  flavorResult.analysis.identifiedFlavors.forEach(flavorName => {
    const flavorObj = FlavorTaxonomy.getFlavor(flavorName);
    if (flavorObj?.activityHints && Array.isArray(flavorObj.activityHints)) {
      flavorObj.activityHints.forEach(activityId => {
        const activityObj = ActivityTaxonomy.ACTIVITIES[activityId];
        if (activityObj?.displayName) {
          const count = hints.get(activityObj.displayName) || 0;
          hints.set(activityObj.displayName, count + 1);
        }
      });
    }
  });

  console.log('\nAggregated Flavor Activity Hints (from ActivityRenderer logic):');
  const sortedHints = Array.from(hints.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedHints.forEach(([activity, count]) => {
    const bonus = (20 + count * 8) * 0.40;
    console.log(`  ${activity}: count=${count}, bonus=${bonus.toFixed(2)}`);
  });

  // Render recommendations
  const result = renderer.render({
    compound: compoundResult,
    teaType: teaTypeResult,
    flavor: flavorResult
  });

  console.log(`\nCompound Profile: ${result.analysis.compoundProfile}`);
  console.log('\nTop 3 Recommendations:');
  result.recommendations.slice(0, 3).forEach(rec => {
    console.log(`  ${rec.activity}: ${rec.score.toFixed(1)}`);
  });
}
