#!/usr/bin/env node

/**
 * Export Activity Recommendations for All Teas
 * Reads all tea JSON files from _dataset/ and generates activity recommendations
 * Saves results to _dataset/activity-recommendations/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the tea recommendation pipeline
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetDir = path.join(__dirname, '_dataset');
const outputDir = path.join(datasetDir, 'activity-recommendations');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created output directory: ${outputDir}\n`);
}

/**
 * Process a single tea and generate activity recommendations
 */
async function processTeaForActivity(tea) {
  try {
    // Run compound inferrer
    const compoundResult = await new CompoundInferrer().infer({
      caffeineLevel: tea.caffeineLevel || 0,
      lTheanineLevel: tea.lTheanineLevel || 0
    });

    // Render activity recommendations
    const activityResult = new ActivityRenderer().render({
      compound: compoundResult,
      teaType: null,
      flavor: null
    });

    return {
      teaName: tea.name,
      originalName: tea.originalName,
      type: tea.type,
      subType: tea.subType,
      flavorProfile: tea.flavorProfile || [],
      recommendations: activityResult.recommendations || [],
      analysis: activityResult.analysis || {},
      confidence: activityResult.confidence || 0,
      rendererVersion: activityResult.rendererVersion || '1.0',
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`✗ Error processing tea "${tea.name}":`, error.message);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🏃 Exporting Activity Recommendations for All Teas\n');

  // Find all JSON files in dataset directory
  const teaFiles = fs.readdirSync(datasetDir)
    .filter(file => file.endsWith('.json') && !file.includes('activity') && !file.includes('season') && !file.includes('food') && !file.includes('time'))
    .sort();

  console.log(`Found ${teaFiles.length} tea files to process:\n`);

  let processedCount = 0;
  let successCount = 0;

  for (const file of teaFiles) {
    const filePath = path.join(datasetDir, file);
    const fileNameWithoutExt = path.basename(file, '.json');

    try {
      // Read file
      let fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse as JSON
      const teaData = JSON.parse(fileContent);
      const teas = Array.isArray(teaData) ? teaData : [teaData];

      console.log(`📄 Processing: ${file} (${teas.length} teas)`);

      // Process each tea and collect results
      const recommendations = [];
      for (const tea of teas) {
        processedCount++;
        const result = await processTeaForActivity(tea);
        if (result) {
          recommendations.push(result);
          successCount++;
          process.stdout.write('.');
        } else {
          process.stdout.write('✗');
        }
      }

      // Save results to JSON file
      const outputFile = path.join(outputDir, `${fileNameWithoutExt}-activity.json`);
      fs.writeFileSync(outputFile, JSON.stringify(recommendations, null, 2));
      console.log(`\n   ✓ Saved: ${fileNameWithoutExt}-activity.json (${recommendations.length} teas)\n`);

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

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
