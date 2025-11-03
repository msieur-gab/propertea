import { FlavorTaxonomy } from './endpoint/src/taxonomies/index.js';
import { ActivityTaxonomy } from './endpoint/src/taxonomies/index.js';

const tieGuanYinFlavors = ["orchid", "creamy", "sweet", "floral", "buttery"];
const daHongPaoFlavors = ["roasted", "mineral", "dark fruits", "woody", "caramel"];

function showFlavorHints(teaName, flavors) {
  console.log(`\n${teaName}:`);
  console.log('-'.repeat(50));
  
  const allActivities = new Map();
  
  flavors.forEach(flavorName => {
    const flavorObj = FlavorTaxonomy.getFlavor(flavorName);
    if (!flavorObj) {
      console.log(`  ${flavorName}: NOT FOUND`);
      return;
    }
    
    console.log(`  ${flavorName}: ${flavorObj.activityHints.length} hints`);
    flavorObj.activityHints.forEach(activityId => {
      const activity = ActivityTaxonomy.ACTIVITIES[activityId];
      const displayName = activity?.displayName || activityId;
      const count = allActivities.get(displayName) || 0;
      allActivities.set(displayName, count + 1);
    });
  });
  
  console.log(`\n  Aggregated Activity Counts:`);
  Array.from(allActivities.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([activity, count]) => {
      console.log(`    ${activity}: ${count}`);
    });
}

showFlavorHints("Tie Guan Yin", tieGuanYinFlavors);
showFlavorHints("Da Hong Pao", daHongPaoFlavors);
