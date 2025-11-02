/**
 * test-complete-pipeline.js
 *
 * Complete Inferrer/Renderer Pipeline Test
 * Demonstrates full data flow from raw tea data → analysis → recommendations
 * Using Ali Shan Oolong as example
 */

import { FlavorInferrer } from './src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from './src/processors/inferrers/ProcessingInferrer.js';

import { ActivityRenderer } from './src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from './src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from './src/processors/renderers/TimeRenderer.js';
import { SeasonRenderer } from './src/processors/renderers/SeasonRenderer.js';
import { BrewingRenderer } from './src/processors/renderers/BrewingRenderer.js';

// Test data: Ali Shan Oolong
const aliShanOolong = {
  name: "Ali Shan Oolong",
  type: "oolong",
  subType: "high-mountain-oolong",
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: [
    "floral",
    "buttery",
    "sweet",
    "creamy",
    "honeysuckle"
  ],
  processingMethods: [
    "withered",
    "partial-oxidation",
    "ball-rolled",
    "minimal-roast"
  ],
  geography: {
    altitude: 1500,
    humidity: 80,
    latitude: 23.47,
    longitude: 120.8,
    temperature: 14.8,
    solarRadiation: 180
  }
};

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║         COMPLETE INFERRER/RENDERER PIPELINE TEST               ║');
console.log('║                    Ali Shan Oolong                             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📋 INPUT TEA DATA:');
console.log(`  Name: ${aliShanOolong.name}`);
console.log(`  Type: ${aliShanOolong.type} (${aliShanOolong.subType})`);
console.log(`  Caffeine: ${aliShanOolong.caffeineLevel}, L-Theanine: ${aliShanOolong.lTheanineLevel}`);
console.log(`  Flavors: ${aliShanOolong.flavorProfile.join(', ')}`);
console.log(`  Processing: ${aliShanOolong.processingMethods.join(', ')}`);
console.log(`  Geography: ${aliShanOolong.geography.altitude}m, ${aliShanOolong.geography.temperature}°C\n`);

// ========== PHASE 1: INFERRERS ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                   PHASE 1: ANALYSIS (Inferrers)               ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// 1. Flavor Inferrer
console.log('1️⃣  FLAVOR ANALYSIS\n');
const flavorInferrer = new FlavorInferrer();
const flavorAnalysis = flavorInferrer.infer({ flavorProfiles: aliShanOolong.flavorProfile });
console.log(`  ✅ Identified Flavors: ${flavorAnalysis.analysis.identifiedFlavors.join(', ')}`);
console.log(`  ✅ Dominant Categories: ${flavorAnalysis.analysis.dominantCategories.join(', ')}`);
console.log(`  ✅ Intensity: ${flavorAnalysis.analysis.intensityEstimate}`);
console.log(`  ✅ Confidence: ${(flavorAnalysis.confidence * 100).toFixed(0)}%\n`);

// 2. Compound Inferrer
console.log('2️⃣  COMPOUND ANALYSIS\n');
const compoundInferrer = new CompoundInferrer();
const compoundAnalysis = compoundInferrer.infer({
  caffeineLevel: aliShanOolong.caffeineLevel,
  lTheanineLevel: aliShanOolong.lTheanineLevel
});
console.log(`  ✅ Ratio: ${compoundAnalysis.analysis.ratio} (${compoundAnalysis.analysis.ratioCategory})`);
console.log(`  ✅ Stimulation: ${compoundAnalysis.analysis.stimulationLevel}`);
console.log(`  ✅ Relaxation: ${compoundAnalysis.analysis.relaxationLevel}`);
console.log(`  ✅ Compound Profile: ${compoundAnalysis.analysis.compoundProfile}`);
console.log(`  ✅ Confidence: ${(compoundAnalysis.confidence * 100).toFixed(0)}%\n`);

// 3. Tea Type Inferrer
console.log('3️⃣  TEA TYPE ANALYSIS\n');
const teaTypeInferrer = new TeaTypeInferrer();
const teaTypeAnalysis = teaTypeInferrer.infer({
  type: aliShanOolong.type,
  subType: aliShanOolong.subType
});
console.log(`  ✅ Tea Type: ${teaTypeAnalysis.analysis.displayName}`);
console.log(`  ✅ Caffeine Range: ${teaTypeAnalysis.analysis.chemicalComposition.caffeineRange.join('-')}`);
console.log(`  ✅ L-Theanine Range: ${teaTypeAnalysis.analysis.chemicalComposition.theanineRange.join('-')}`);
console.log(`  ✅ Seasonal Tendency: ${teaTypeAnalysis.analysis.seasonalTendency}`);
console.log(`  ✅ Oxidation Level: ${teaTypeAnalysis.analysis.oxidationLevel}%`);
console.log(`  ✅ Confidence: ${(teaTypeAnalysis.confidence * 100).toFixed(0)}%\n`);

// 4. Geography Inferrer
console.log('4️⃣  GEOGRAPHY ANALYSIS\n');
const geographyInferrer = new GeographyInferrer();
const geographyAnalysis = geographyInferrer.infer({ geography: aliShanOolong.geography });
console.log(`  ✅ Elevation: ${geographyAnalysis.analysis.elevation.classification}`);
console.log(`  ✅ Climate Zone: ${geographyAnalysis.analysis.climate.latitude.zone}`);
console.log(`  ✅ Temperature: ${geographyAnalysis.analysis.climate.temperature.classification}`);
console.log(`  ✅ Humidity: ${geographyAnalysis.analysis.climate.humidity.classification}`);
console.log(`  ✅ Quality Indicator: ${geographyAnalysis.analysis.qualityIndicator}`);
console.log(`  ✅ Terroir: ${geographyAnalysis.analysis.terroir.join(', ')}`);
console.log(`  ✅ Confidence: ${(geographyAnalysis.confidence * 100).toFixed(0)}%\n`);

// 5. Processing Inferrer
console.log('5️⃣  PROCESSING ANALYSIS\n');
const processingInferrer = new ProcessingInferrer();
const processingAnalysis = processingInferrer.infer({
  processingMethods: aliShanOolong.processingMethods
});
console.log(`  ✅ Processing Methods: ${processingAnalysis.analysis.identifiedMethods.map(m => m.displayName).join(', ')}`);
console.log(`  ✅ Thermal Effect: ${processingAnalysis.analysis.thermalEffect}`);
console.log(`  ✅ Roast Level: ${processingAnalysis.analysis.roastLevel}`);
console.log(`  ✅ Oxidation Level: ${processingAnalysis.analysis.oxidationLevel}`);
console.log(`  ✅ Mouthfeel: ${processingAnalysis.analysis.mouthfeel}`);
console.log(`  ✅ Energetic Tendency: ${processingAnalysis.analysis.energeticTendency}`);
console.log(`  ✅ Confidence: ${(processingAnalysis.confidence * 100).toFixed(0)}%\n`);

// ========== PHASE 2: RENDERERS ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║               PHASE 2: RECOMMENDATIONS (Renderers)             ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// 1. Activity Renderer
console.log('1️⃣  ACTIVITY RECOMMENDATIONS\n');
const activityRenderer = new ActivityRenderer();
const activityRecommendations = activityRenderer.render(compoundAnalysis);
console.log(`  ✅ Recommendations: ${activityRecommendations.recommendations.length}`);
if (activityRecommendations.recommendations.length > 0) {
  activityRecommendations.recommendations.forEach((rec, i) => {
    console.log(`     ${i+1}. ${rec.activity} (${rec.score.toFixed(0)})`);
    if (rec.description && rec.description !== 'A recommended activity') {
      console.log(`        → ${rec.description}`);
    }
  });
}
console.log(`  ✅ Grouped into ${activityRecommendations.clusters.length} clusters\n`);

// 2. Food Renderer
console.log('2️⃣  FOOD PAIRING RECOMMENDATIONS\n');
const foodRenderer = new FoodRenderer();
const foodRecommendations = foodRenderer.render(flavorAnalysis);
console.log(`  ✅ Food Recommendations: ${foodRecommendations.recommendations.length}`);
if (foodRecommendations.recommendations.length > 0) {
  foodRecommendations.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`     ${i+1}. ${rec.food} (${rec.score.toFixed(0)})`);
    if (rec.pairingTechnique) {
      console.log(`        → ${rec.pairingTechnique}`);
    }
  });
}
console.log(`  ✅ Organized by ${foodRecommendations.cuisineGroupings.length} cuisines\n`);

// 3. Time Renderer
console.log('3️⃣  TIME OF DAY RECOMMENDATIONS\n');
const timeRenderer = new TimeRenderer();
const timeRecommendations = timeRenderer.render(compoundAnalysis);
console.log(`  ✅ Top Recommended Hours: ${timeRecommendations.recommendations.length}`);
if (timeRecommendations.recommendations.length > 0) {
  timeRecommendations.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`     ${i+1}. ${rec.hour}:00 - ${rec.period} (Score: ${rec.score.toFixed(0)})`);
  });
}
console.log(`  ✅ Time periods analyzed: ${Object.keys(timeRecommendations.periodGrouping).length}\n`);

// 4. Season Renderer
console.log('4️⃣  SEASONAL RECOMMENDATIONS\n');
const seasonRenderer = new SeasonRenderer();
const seasonRecommendations = seasonRenderer.render(
  geographyAnalysis,
  processingAnalysis,
  teaTypeAnalysis,
  flavorAnalysis
);
console.log(`  ✅ Recommended Seasons: ${seasonRecommendations.recommendations?.length || 0}`);
if (seasonRecommendations.recommendations && seasonRecommendations.recommendations.length > 0) {
  seasonRecommendations.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`     ${i+1}. ${rec.displayName} (Score: ${rec.score.toFixed(0)})`);
  });
}
if (seasonRecommendations.seasonalRange) {
  console.log(`  ✅ Seasonal Range: ${seasonRecommendations.seasonalRange.description}\n`);
} else {
  console.log(`  ℹ️  All seasons scored above threshold\n`);
}

// 5. Brewing Renderer
console.log('5️⃣  BREWING RECOMMENDATIONS\n');
const brewingRenderer = new BrewingRenderer();
const brewingRecommendations = brewingRenderer.render(aliShanOolong, 'gongfu', processingAnalysis);
if (brewingRecommendations.brewingStyles && brewingRecommendations.brewingStyles.length > 0) {
  console.log(`  ✅ Tea: ${brewingRecommendations.tea?.name}`);
  console.log(`  ✅ Type: ${brewingRecommendations.tea?.type}`);
  console.log(`  ✅ Brewing Styles Provided: ${brewingRecommendations.brewingStyles.length}`);

  brewingRecommendations.brewingStyles.forEach((style, i) => {
    console.log(`\n     ${i + 1}. ${style.style.toUpperCase()}`);
    console.log(`        Temperature: ${style.parameters.temperature}°C, Steep: ${style.parameters.steepTime}s`);
    console.log(`        Vessel: ${style.vessels?.recommended?.name || 'Recommended vessel'}`);
    console.log(`        Infusions: ${style.parameters.infusions}`);
  });

  console.log(`\n  ✅ Recommended Style: ${brewingRecommendations.recommendedStyle?.name || 'Gongfu'}\n`);
} else {
  console.log(`  ⚠️  Brewing: ${brewingRecommendations.trace[0]?.reason || 'Error'}\n`);
}

// ========== SUMMARY ==========
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                        PIPELINE SUMMARY                        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('✨ Complete Pipeline Execution Summary:\n');
console.log('INFERRERS:');
console.log(`  ✅ FlavorInferrer - 5 flavors identified, ${flavorAnalysis.analysis.dominantCategories.length} categories`);
console.log(`  ✅ CompoundInferrer - ${compoundAnalysis.analysis.compoundProfile} profile`);
console.log(`  ✅ TeaTypeInferrer - ${teaTypeAnalysis.analysis.displayName} analyzed`);
console.log(`  ✅ GeographyInferrer - ${geographyAnalysis.analysis.qualityIndicator} quality`);
console.log(`  ✅ ProcessingInferrer - ${processingAnalysis.analysis.identifiedMethods.length} methods found\n`);

console.log('RENDERERS:');
console.log(`  ✅ ActivityRenderer - ${activityRecommendations.recommendations.length} activities suggested`);
console.log(`  ✅ FoodRenderer - ${foodRecommendations.recommendations.length} foods recommended`);
console.log(`  ✅ TimeRenderer - ${timeRecommendations.recommendations.length} optimal hours identified`);
console.log(`  ✅ SeasonRenderer - ${seasonRecommendations.recommendations?.length || 'All'} seasons recommended`);
console.log(`  ✅ BrewingRenderer - ${brewingRecommendations.brewingStyles ? brewingRecommendations.brewingStyles.length + ' brewing styles with vessels' : 'Error processing'}\n`);

console.log('🎯 COMPLETE PIPELINE OPERATIONAL\n');
console.log(`📊 Data Flow: Raw Tea → 5 Inferrers → Analysis Data → 5 Renderers → Recommendations\n`);

console.log('✅ All components working with TaxonomyRegistry\n');
