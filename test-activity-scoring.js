import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';
import { ActivityTaxonomy } from './endpoint/src/taxonomies/index.js';

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
  console.log(`\n${'-'.repeat(60)}`);
  console.log(`Tea: ${tea.name}`);
  console.log('-'.repeat(60));

  const [flavorResult, compoundResult, teaTypeResult] = await Promise.all([
    flavorInferrer.infer({ flavorProfiles: tea.flavorProfile }),
    compoundInferrer.infer({ caffeineLevel: tea.caffeineLevel, lTheanineLevel: tea.lTheanineLevel }),
    teaTypeInferrer.infer({ type: tea.type })
  ]);

  // Show flavor activity hints extraction
  console.log('\nFlavor Activity Hints from FlavorInferrer:');
  const flavorActivityMap = new Map();
  flavorResult.analysis.activityHints.forEach(activityId => {
    const count = flavorActivityMap.get(activityId) || 0;
    flavorActivityMap.set(activityId, count + 1);
  });

  // Convert IDs to display names
  const displayNameMap = new Map();
  Array.from(flavorActivityMap.entries()).forEach(([activityId, count]) => {
    const activity = ActivityTaxonomy.ACTIVITIES[activityId];
    if (activity) {
      displayNameMap.set(activity.displayName, count);
    }
  });

  Array.from(displayNameMap.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([activity, count]) => {
      const bonus = (20 + count * 8) * 0.40;
      console.log(`  ${activity}: count=${count}, bonus=${bonus.toFixed(2)}`);
    });

  // Render recommendations and show trace
  const result = renderer.render({
    compound: compoundResult,
    teaType: teaTypeResult,
    flavor: flavorResult
  });

  console.log(`\nCompound Profile: ${result.analysis.compoundProfile}`);
  console.log('Stimulation Level:', result.analysis.stimulationLevel);

  console.log('\nTop 3 Recommendations:');
  result.recommendations.slice(0, 3).forEach(rec => {
    console.log(`  ${rec.activity}: ${rec.score.toFixed(1)}`);
  });
}
