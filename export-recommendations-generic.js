#!/usr/bin/env node

/**
 * Generic Export Script for All Renderers
 * 
 * Usage: node export-recommendations-generic.js <renderer-name>
 * Example: node export-recommendations-generic.js food
 * 
 * This script:
 * - Uses rendererRegistry to determine required inferrers for the renderer
 * - Dynamically runs only those inferrers
 * - Calls the renderer with the complete results
 * - Exports raw renderer output + tea metadata (no transformation)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import registry and helper
import { rendererRegistry, getRequiredInferrers } from './endpoint/src/rendererRegistry.js';

// Import all inferrers
import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';

// Import all renderers
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';
import { SeasonRenderer } from './endpoint/src/processors/renderers/SeasonRenderer.js';
import { BrewingRenderer } from './endpoint/src/processors/renderers/BrewingRenderer.js';
import { TerroirRenderer } from './endpoint/src/processors/renderers/TerroirRenderer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetDir = path.join(__dirname, '_dataset');

// Map renderer names to classes
const rendererClasses = {
  activity: ActivityRenderer,
  food: FoodRenderer,
  time: TimeRenderer,
  season: SeasonRenderer,
  brewing: BrewingRenderer,
  terroir: TerroirRenderer
};

// Map inferrer names to classes
const inferrerClasses = {
  flavor: FlavorInferrer,
  compound: CompoundInferrer,
  teaType: TeaTypeInferrer,
  geography: GeographyInferrer,
  processing: ProcessingInferrer
};

/**
 * Main execution
 */
async function main() {
  // Get renderer name from command line
  const rendererName = process.argv[2]?.toLowerCase();
  
  if (!rendererName) {
    console.error('❌ Usage: node export-recommendations-generic.js <renderer-name>');
    console.error(`Available renderers: ${Object.keys(rendererRegistry).join(', ')}`);
    process.exit(1);
  }

  // Validate renderer
  if (!rendererRegistry[rendererName]) {
    console.error(`❌ Unknown renderer: "${rendererName}"`);
    console.error(`Available renderers: ${Object.keys(rendererRegistry).join(', ')}`);
    process.exit(1);
  }

  const rendererDef = rendererRegistry[rendererName];
  const outputDir = path.join(datasetDir, `${rendererName}-recommendations`);
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created output directory: ${outputDir}\n`);
  }

  console.log(`📊 Exporting ${rendererDef.displayName}\n`);
  console.log(`Required inferrers: ${rendererDef.requiredInferrers.join(', ')}\n`);

  // Find all tea files
  const teaFiles = fs.readdirSync(datasetDir)
    .filter(file => file.endsWith('.json') && !file.includes('-recommendations'))
    .sort();

  console.log(`Found ${teaFiles.length} tea files to process:\n`);

  let processedCount = 0;
  let successCount = 0;

  for (const file of teaFiles) {
    const filePath = path.join(datasetDir, file);
    const fileNameWithoutExt = path.basename(file, '.json');

    try {
      // Read tea data
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const teaData = JSON.parse(fileContent);
      const teas = Array.isArray(teaData) ? teaData : [teaData];

      console.log(`📄 Processing: ${file} (${teas.length} teas)`);

      // Process each tea
      const recommendations = [];
      for (const tea of teas) {
        processedCount++;
        const result = await processTeaWithRenderer(tea, rendererName, rendererDef.requiredInferrers);
        if (result) {
          recommendations.push(result);
          successCount++;
          process.stdout.write('.');
        } else {
          process.stdout.write('✗');
        }
      }

      // Save results
      const outputFile = path.join(outputDir, `${fileNameWithoutExt}-${rendererName}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(recommendations, null, 2));
      console.log(`\n   ✓ Saved: ${fileNameWithoutExt}-${rendererName}.json (${recommendations.length} teas)\n`);

    } catch (error) {
      console.error(`✗ Failed to process file ${file}:`, error.message);
    }
  }

  // Summary
  console.log(`${'='.repeat(60)}`);
  console.log(`📊 Summary:`);
  console.log(`   Total teas processed: ${processedCount}`);
  console.log(`   Successfully generated: ${successCount}`);
  console.log(`   Failed: ${processedCount - successCount}`);
  console.log(`   Output directory: ${outputDir}`);
  console.log(`${'='.repeat(60)}\n`);
}

/**
 * Process single tea with specified renderer
 * @param {Object} tea - Tea data
 * @param {string} rendererName - Name of renderer to use
 * @param {Array} requiredInferrers - List of required inferrer names
 * @returns {Object|null} - Exported result or null if error
 */
async function processTeaWithRenderer(tea, rendererName, requiredInferrers) {
  try {
    // Build inference tasks based on registry requirements
    const inferenceTasks = [];
    const inferenceNames = [];

    for (const inferrerName of requiredInferrers) {
      const InferrerClass = inferrerClasses[inferrerName];
      if (!InferrerClass) {
        throw new Error(`Unknown inferrer: ${inferrerName}`);
      }

      // Prepare input based on inferrer type
      let input = {};
      if (inferrerName === 'flavor') {
        input = { flavorProfiles: tea.flavorProfile || [] };
      } else if (inferrerName === 'compound') {
        input = {
          caffeineLevel: tea.caffeineLevel || 0,
          lTheanineLevel: tea.lTheanineLevel || 0
        };
      } else if (inferrerName === 'teaType') {
        input = {
          type: tea.type,
          subType: tea.subType
        };
      } else if (inferrerName === 'geography') {
        input = { geography: tea.geography || {} };
      } else if (inferrerName === 'processing') {
        input = { processingMethods: tea.processingMethods || [] };
      }

      inferenceTasks.push(new InferrerClass().infer(input));
      inferenceNames.push(inferrerName);
    }

    // Run all required inferrers in parallel
    const inferenceResults = await Promise.all(inferenceTasks);
    const allInferences = {};
    inferenceResults.forEach((result, index) => {
      allInferences[inferenceNames[index]] = result;
    });

    // Get renderer class
    const RendererClass = rendererClasses[rendererName];
    if (!RendererClass) {
      throw new Error(`Unknown renderer: ${rendererName}`);
    }

    // Call renderer with appropriate arguments based on renderer type
    let rendererResult;
    const renderer = new RendererClass();

    switch (rendererName) {
      case 'activity':
        rendererResult = renderer.render({
          compound: allInferences.compound,
          teaType: allInferences.teaType,
          flavor: allInferences.flavor
        });
        break;
      case 'food':
        rendererResult = renderer.render({
          flavor: allInferences.flavor,
          compound: allInferences.compound,
          teaType: allInferences.teaType
        });
        break;
      case 'time':
        rendererResult = renderer.render({
          compound: allInferences.compound,
          teaType: allInferences.teaType
        });
        break;
      case 'season':
        rendererResult = renderer.render({
          teaType: allInferences.teaType,
          processing: allInferences.processing,
          geography: allInferences.geography
        });
        break;
      case 'brewing':
        rendererResult = renderer.render({
          formData: tea,
          processing: allInferences.processing,
          geography: allInferences.geography,
          compound: allInferences.compound
        });
        break;
      case 'terroir':
        rendererResult = renderer.render({
          geography: allInferences.geography,
          teaType: allInferences.teaType,
          formData: tea,
          compound: allInferences.compound,
          flavor: allInferences.flavor
        });
        break;
      default:
        throw new Error(`Unsupported renderer: ${rendererName}`);
    }

    // Return tea metadata + complete renderer output (no transformation)
    return {
      teaName: tea.name,
      originalName: tea.originalName || '',
      type: tea.type,
      subType: tea.subType || '',
      flavorProfile: tea.flavorProfile || [],
      ...rendererResult  // Spread all renderer output directly
    };

  } catch (error) {
    console.error(`✗ Error processing tea "${tea.name}":`, error.message);
    return null;
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
