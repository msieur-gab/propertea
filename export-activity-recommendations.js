#!/usr/bin/env node

/**
 * Export Activity Recommendations for All Teas
 * Reads all tea files from _dataset/ and generates activity recommendations
 * Saves results to _dataset/activity-recommendations/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import all dataset files dynamically
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetDir = path.join(__dirname, '_dataset');
const outputDir = path.join(datasetDir, 'activity-recommendations');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created output directory: ${outputDir}`);
}

// Import the tea recommendation pipeline (reuse the same logic as the API)
import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';

/**
 * Process a single tea and generate activity recommendations
 */
async function processTeaForActivity(tea) {
  try {
    // Run the three required inferrers
    const [flavorResult, compoundResult, teaTypeResult] = await Promise.all([
      new FlavorInferrer().infer({ flavorProfiles: tea.flavorProfile || [] }),
      new CompoundInferrer().infer({
        caffeineLevel: tea.caffeineLevel,
        lTheanineLevel: tea.lTheanineLevel
      }),
      new TeaTypeInferrer().infer({
        type: tea.type,
        subType: tea.subType
      })
    ]);

    // Render activity recommendations using all three sources
    const activityResult = new ActivityRenderer().render({
      compound: compoundResult,
      teaType: teaTypeResult,
      flavor: flavorResult
    });

    return {
      teaName: tea.name,
      originalName: tea.originalName,
      type: tea.type,
      subType: tea.subType,
      recommendations: activityResult.recommendations || [],
      clusters: activityResult.clusters || [],
      analysis: activityResult.analysis || {},
      scoringSources: activityResult.scoringSources || {},
      confidence: activityResult.confidence || 0,
      rendererVersion: activityResult.rendererVersion || '2.0',
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
  console.log('🍵 Exporting Activity Recommendations for All Teas\n');

  const teaFiles = fs.readdirSync(datasetDir).filter(file => {
    const isFile = fs.statSync(path.join(datasetDir, file)).isFile();
    return isFile && (file.endsWith('.json') || file.endsWith('.js'));
  });

  console.log(`Found ${teaFiles.length} tea files to process:\n`);

  let processedCount = 0;
  let successCount = 0;

  for (const file of teaFiles) {
    const filePath = path.join(datasetDir, file);
    const fileNameWithoutExt = path.basename(file, '.js');

    try {
      // Read and parse the JavaScript file
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Remove 'export default' and trailing semicolon
      let cleanedContent = fileContent
        .replace(/^export\s+default\s+/, '')
        .trim();

      if (cleanedContent.endsWith(';')) {
        cleanedContent = cleanedContent.slice(0, -1);
      }

      // Convert JavaScript object literals to JSON-compatible format
      // Replace unquoted keys with quoted keys
      let jsonContent = cleanedContent
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
        .replace(/'/g, '"');  // Replace single quotes with double quotes

      // Wrap in array brackets if not already an array
      if (!jsonContent.trim().startsWith('[')) {
        jsonContent = '[' + jsonContent + ']';
      }

      // Parse as JSON
      let teaData;
      try {
        teaData = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error(`     Parse error: ${parseError.message}`);
        console.error(`     Content: ${jsonContent.substring(0, 100)}...`);
        throw parseError;
      }

      const teas = Array.isArray(teaData) ? teaData : [teaData];

      console.log(`\n📄 Processing: ${file} (${teas.length} teas)`);

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
      console.log(`\n   ✓ Saved to: ${fileNameWithoutExt}-activity.json (${recommendations.length} teas)`);

    } catch (error) {
      console.error(`\n   ✗ Failed to process file ${file}:`, error.message);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
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
