#!/usr/bin/env node

/**
 * Export Terroir Recommendations for All Teas
 * Reads all tea JSON files from _dataset/ and generates terroir recommendations
 * Saves results to _dataset/terroir-recommendations/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the tea recommendation pipeline
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { TerroirRenderer } from './endpoint/src/processors/renderers/TerroirRenderer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const datasetDir = path.join(__dirname, '_dataset');
const outputDir = path.join(datasetDir, 'terroir-recommendations');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`✓ Created output directory: ${outputDir}\n`);
}

/**
 * Process a single tea and generate terroir recommendations
 */
async function processTeaForTerroir(tea) {
  try {
    // Run geography inferrer
    const geographyResult = await new GeographyInferrer().infer({
      origin: tea.origin || '',
      elevation: tea.elevation || 0
    });

    // Render terroir recommendations
    const terroirResult = new TerroirRenderer().render({
      geography: geographyResult,
      teaType: null,
      formData: tea,
      compound: null,
      flavor: null
    });

    return {
      teaName: tea.name,
      originalName: tea.originalName,
      type: tea.type,
      subType: tea.subType,
      flavorProfile: tea.flavorProfile || [],
      origin: tea.origin || '',
      elevation: tea.elevation || 0,
      recommendations: terroirResult.recommendations || [],
      analysis: terroirResult.analysis || {},
      confidence: terroirResult.confidence || 0,
      rendererVersion: terroirResult.rendererVersion || '1.0',
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
  console.log('🏔️  Exporting Terroir Recommendations for All Teas\n');

  // Find all JSON files in dataset directory
  const teaFiles = fs.readdirSync(datasetDir)
    .filter(file => file.endsWith('.json') && !file.includes('activity') && !file.includes('season') && !file.includes('food') && !file.includes('time') && !file.includes('brewing') && !file.includes('terroir'))
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
        const result = await processTeaForTerroir(tea);
        if (result) {
          recommendations.push(result);
          successCount++;
          process.stdout.write('.');
        } else {
          process.stdout.write('✗');
        }
      }

      // Save results to JSON file
      const outputFile = path.join(outputDir, `${fileNameWithoutExt}-terroir.json`);
      fs.writeFileSync(outputFile, JSON.stringify(recommendations, null, 2));
      console.log(`\n   ✓ Saved: ${fileNameWithoutExt}-terroir.json (${recommendations.length} teas)\n`);

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
