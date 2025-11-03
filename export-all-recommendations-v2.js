/**
 * Export All Recommendations v2 (CompoundInferrer v2.0 with unified signature)
 *
 * Purpose: Generate A/B test data for signature consistency fixes
 * - Reads tea data from _dataset/*.json
 * - Uses rendererRegistry to determine required inferrers
 * - Runs all renderers for each tea type
 * - Exports to _dataset/*-recommendations/*-typeC.json (C = version C for A/B testing)
 *
 * Architectural validation:
 * - All renderers now access .analysis (not .inputs)
 * - CompoundInferrer v2.0 includes raw values in .analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import inferrers
import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';

// Import renderers
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';
import { SeasonRenderer } from './endpoint/src/processors/renderers/SeasonRenderer.js';
import { BrewingRenderer } from './endpoint/src/processors/renderers/BrewingRenderer.js';

// Import registry
import { rendererRegistry, getRequiredInferrers } from './endpoint/src/rendererRegistry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tea type files to process
const teaTypes = ['black', 'green', 'oolong', 'white', 'yellow', 'puerh_sheng', 'puerh_shou'];

// Renderer to folder mapping
const rendererFolders = {
  activity: 'activity-recommendations',
  time: 'time-recommendations',
  food: 'food-recommendations',
  season: 'season-recommendations',
  brewing: 'brewing-recommendations'
};

/**
 * Run all inferrers needed for a set of renderers
 */
function runInferrers(tea, rendererNames) {
  const requiredInferrers = getRequiredInferrers(rendererNames);
  const inferences = {};

  if (requiredInferrers.has('compound')) {
    const inferrer = new CompoundInferrer();
    inferences.compound = inferrer.infer({
      caffeineLevel: tea.caffeineLevel,
      lTheanineLevel: tea.lTheanineLevel
    });
  }

  if (requiredInferrers.has('flavor')) {
    const inferrer = new FlavorInferrer();
    inferences.flavor = inferrer.infer({
      flavorProfiles: tea.flavorProfile || []
    });
  }

  if (requiredInferrers.has('teaType')) {
    const inferrer = new TeaTypeInferrer();
    inferences.teaType = inferrer.infer({
      type: tea.type,
      subType: tea.subType
    });
  }

  if (requiredInferrers.has('geography')) {
    const inferrer = new GeographyInferrer();
    inferences.geography = inferrer.infer({
      geography: tea.geography || {}
    });
  }

  if (requiredInferrers.has('processing')) {
    const inferrer = new ProcessingInferrer();
    inferences.processing = inferrer.infer({
      processingMethods: tea.processingMethods || []
    });
  }

  return inferences;
}

/**
 * Run a specific renderer with inferences
 */
function runRenderer(rendererName, inferences, formData) {
  switch (rendererName) {
    case 'activity':
      return new ActivityRenderer().render(inferences);

    case 'time':
      return new TimeRenderer().render(inferences);

    case 'food':
      return new FoodRenderer().render(inferences);

    case 'season':
      return new SeasonRenderer().render(inferences);

    case 'brewing':
      return new BrewingRenderer().render({
        ...inferences,
        formData
      });

    default:
      throw new Error(`Unknown renderer: ${rendererName}`);
  }
}

/**
 * Process a single tea and export all recommendations
 */
function processTea(tea, teaType) {
  console.log(`\n📋 Processing: ${tea.name} (${teaType})`);

  const results = {};
  const renderers = Object.keys(rendererFolders);

  // Run all inferrers once
  const inferences = runInferrers(tea, renderers);

  console.log(`  🔬 Inferrers run: ${Object.keys(inferences).join(', ')}`);
  console.log(`  📊 CompoundInferrer version: ${inferences.compound?.inferrerVersion || 'N/A'}`);

  // Run each renderer
  renderers.forEach(rendererName => {
    try {
      const result = runRenderer(rendererName, inferences, tea);
      results[rendererName] = result;
      console.log(`  ✅ ${rendererName}: ${result.recommendations?.length || 0} recommendations (v${result.rendererVersion || 'N/A'})`);
    } catch (error) {
      console.error(`  ❌ ${rendererName}: ${error.message}`);
      results[rendererName] = { error: error.message };
    }
  });

  return results;
}

/**
 * Export results to appropriate folders with 'C' suffix
 */
function exportResults(teaType, teas, allResults) {
  Object.entries(rendererFolders).forEach(([rendererName, folderName]) => {
    const folderPath = path.join(__dirname, '_dataset', folderName);

    // Ensure folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Build export data
    const exportData = teas.map((tea, index) => {
      const result = allResults[index][rendererName];

      return {
        tea: {
          name: tea.name,
          originalName: tea.originalName,
          type: tea.type,
          subType: tea.subType || null
        },
        ...result
      };
    });

    // Write to file with 'C' suffix
    const filename = `${teaType}-${rendererName}C.json`;
    const filepath = path.join(folderPath, filename);

    fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
    console.log(`  📁 Exported: ${folderName}/${filename}`);
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Export All Recommendations v2 (CompoundInferrer v2.0)');
  console.log('=========================================================');
  console.log('Architecture: Unified signature - all renderers use .analysis');
  console.log('');

  for (const teaType of teaTypes) {
    console.log(`\n📦 Processing tea type: ${teaType}`);
    console.log('━'.repeat(60));

    // Read tea data
    const teaFile = path.join(__dirname, '_dataset', `${teaType}.json`);

    if (!fs.existsSync(teaFile)) {
      console.log(`  ⚠️  File not found: ${teaFile}`);
      continue;
    }

    const teas = JSON.parse(fs.readFileSync(teaFile, 'utf-8'));
    console.log(`  📊 Loaded ${teas.length} teas from ${teaType}.json`);

    // Process each tea
    const allResults = teas.map(tea => processTea(tea, teaType));

    // Export results
    console.log(`\n  💾 Exporting results for ${teaType}...`);
    exportResults(teaType, teas, allResults);
  }

  console.log('\n✅ All exports complete!');
  console.log('\n📊 A/B Testing Guide:');
  console.log('  - Old version: *-type.json (CompoundInferrer v1.0)');
  console.log('  - New version: *-typeC.json (CompoundInferrer v2.0)');
  console.log('  - Compare outputs to validate signature consistency fixes');
}

main().catch(error => {
  console.error('❌ Export failed:', error);
  console.error(error.stack);
  process.exit(1);
});
