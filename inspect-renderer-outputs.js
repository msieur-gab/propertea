#!/usr/bin/env node

/**
 * Inspect Renderer Outputs
 * Generates outputs from all renderers for each tea, to determine optimal raw format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import renderers
import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';
import { SeasonRenderer } from './endpoint/src/processors/renderers/SeasonRenderer.js';
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetDir = path.join(__dirname, '_dataset');
const outputDir = path.join(__dirname, '_renderer_inspection');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function inspectSingleTea(teaFile) {
  const filePath = path.join(datasetDir, teaFile);
  let fileContent = fs.readFileSync(filePath, 'utf-8');
  const teaData = JSON.parse(fileContent);

  // Handle both single tea and array of teas
  const teas = Array.isArray(teaData) ? teaData : [teaData];

  console.log(`\n📊 Inspecting ${teaFile} (${teas.length} tea(s))\n`);

  for (const tea of teas) {
    console.log(`  Processing: ${tea.name}`);

    try {
      // Run all inferences in parallel
      const [flavorResult, compoundResult, teaTypeResult] = await Promise.all([
        new FlavorInferrer().infer({
          flavorProfiles: tea.flavorProfile || []
        }),
        new CompoundInferrer().infer({
          caffeineLevel: tea.caffeineLevel || 0,
          lTheanineLevel: tea.lTheanineLevel || 0
        }),
        new TeaTypeInferrer().infer({
          type: tea.type,
          subType: tea.subType
        })
      ]);

      // Get all renderer outputs
      const foodOutput = new FoodRenderer().render({
        flavor: flavorResult,
        compound: compoundResult,
        teaType: teaTypeResult
      });

      const timeOutput = new TimeRenderer().render({
        compound: compoundResult,
        teaType: teaTypeResult
      });

      const seasonOutput = new SeasonRenderer().render({
        teaType: teaTypeResult,
        processing: null,
        geography: null
      });

      const activityOutput = new ActivityRenderer().render({
        compound: compoundResult,
        teaType: teaTypeResult,
        flavor: flavorResult
      });

      // Save inspection output for this tea
      const teaOutputPath = path.join(
        outputDir,
        `${tea.name.replace(/\s+/g, '_').toLowerCase()}.json`
      );

      const inspection = {
        teaName: tea.name,
        teaType: tea.type,
        flavorProfile: tea.flavorProfile,
        compoundProfile: {
          caffeine: tea.caffeineLevel,
          lTheanine: tea.lTheanineLevel
        },
        renderers: {
          food: foodOutput,
          time: timeOutput,
          season: seasonOutput,
          activity: activityOutput
        }
      };

      fs.writeFileSync(teaOutputPath, JSON.stringify(inspection, null, 2));
      console.log(`    ✓ Saved to: ${path.basename(teaOutputPath)}`);

    } catch (error) {
      console.error(`    ✗ Error: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🔍 Inspecting Renderer Outputs for Format Design\n');
  console.log(`Output directory: ${outputDir}\n`);

  // Process all tea files
  const teaFiles = fs.readdirSync(datasetDir)
    .filter(f => f.match(/^(black|green|oolong|puerh|white|yellow).*\.json$/))
    .sort();

  for (const file of teaFiles) {
    await inspectSingleTea(file);
  }

  console.log('\n✅ Inspection complete!');
  console.log(`\nNext: Review files in ${outputDir} to determine optimal raw format for each renderer`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
