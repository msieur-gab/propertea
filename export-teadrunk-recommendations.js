/**
 * Export Tea Drunkenness Recommendations for All Teas
 *
 * Purpose: Generate tea drunkenness predictions for all teas in _dataset/
 * Output: _dataset/drunkenness-recommendations/{type}-teadrunk.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';
import { TeaDrunkenessRenderer } from './endpoint/src/processors/renderers/TeaDrunkenessRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tea type files to process
const teaTypes = ['black', 'green', 'oolong', 'white', 'yellow', 'puerh_sheng', 'puerh_shou'];

/**
 * Process a single tea and return drunkenness prediction
 */
function processTea(tea) {
  // Run inferrers
  const compoundInf = new CompoundInferrer().infer({
    caffeineLevel: tea.caffeineLevel,
    lTheanineLevel: tea.lTheanineLevel
  });

  const geographyInf = new GeographyInferrer().infer({
    geography: tea.geography || {}
  });

  const teaTypeInf = new TeaTypeInferrer().infer({
    type: tea.type,
    subType: tea.subType
  });

  const processingInf = new ProcessingInferrer().infer({
    processingMethods: tea.processingMethods || []
  });

  // Run renderer (v2.0 with catechin estimation)
  const renderer = new TeaDrunkenessRenderer();
  const result = renderer.render({
    compound: compoundInf,
    geography: geographyInf,
    teaType: teaTypeInf,
    processing: processingInf
  });

  return result;
}

/**
 * Main execution
 */
async function main() {
  console.log('🍵 Exporting Tea Drunkenness Recommendations');
  console.log('='.repeat(70));
  console.log('');

  // Create output directory
  const outputDir = path.join(__dirname, '_dataset', 'drunkenness-recommendations');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: drunkenness-recommendations/\n`);
  }

  for (const teaType of teaTypes) {
    console.log(`📦 Processing tea type: ${teaType}`);
    console.log('─'.repeat(70));

    // Read tea data
    const teaFile = path.join(__dirname, '_dataset', `${teaType}.json`);

    if (!fs.existsSync(teaFile)) {
      console.log(`  ⚠️  File not found: ${teaFile}\n`);
      continue;
    }

    const teas = JSON.parse(fs.readFileSync(teaFile, 'utf-8'));
    console.log(`  📊 Loaded ${teas.length} teas from ${teaType}.json`);

    // Process each tea
    const allResults = teas.map(tea => {
      const result = processTea(tea);

      console.log(`  ✓ ${tea.name}: ${result.drunkennessPotential}/100 (${result.intensity})`);

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

    // Export to file
    const filename = `${teaType}-teadrunk.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(allResults, null, 2));
    console.log(`  💾 Exported: drunkenness-recommendations/${filename}`);
    console.log('');
  }

  console.log('✅ All tea drunkenness exports complete!\n');

  // Summary statistics
  console.log('📊 Summary:');
  const allFiles = fs.readdirSync(outputDir);
  let totalTeas = 0;
  const intensityCounts = { 'Very High': 0, 'High': 0, 'Medium': 0, 'Low': 0, 'Very Low': 0 };

  allFiles.forEach(file => {
    if (file.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(path.join(outputDir, file), 'utf-8'));
      totalTeas += data.length;

      data.forEach(tea => {
        intensityCounts[tea.intensity] = (intensityCounts[tea.intensity] || 0) + 1;
      });
    }
  });

  console.log(`  Total teas analyzed: ${totalTeas}`);
  console.log(`  Intensity distribution:`);
  Object.entries(intensityCounts).forEach(([intensity, count]) => {
    if (count > 0) {
      console.log(`    ${intensity}: ${count} teas`);
    }
  });
}

main().catch(error => {
  console.error('❌ Export failed:', error);
  console.error(error.stack);
  process.exit(1);
});
