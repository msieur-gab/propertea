/**
 * Test Format Modes
 *
 * Purpose: Verify all three format modes (raw/display/verbose) work correctly
 * Tests a single tea through the pipeline with each format mode
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import the pipeline function (same logic as Netlify function)
import { FlavorInferrer } from './endpoint/src/processors/inferrers/FlavorInferrer.js';
import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { ProcessingInferrer } from './endpoint/src/processors/inferrers/ProcessingInferrer.js';

import { ActivityRenderer } from './endpoint/src/processors/renderers/ActivityRenderer.js';
import { FoodRenderer } from './endpoint/src/processors/renderers/FoodRenderer.js';
import { TimeRenderer } from './endpoint/src/processors/renderers/TimeRenderer.js';
import { SeasonRenderer } from './endpoint/src/processors/renderers/SeasonRenderer.js';
import { BrewingRenderer } from './endpoint/src/processors/renderers/BrewingRenderer.js';
import { TerroirRenderer } from './endpoint/src/processors/renderers/TerroirRenderer.js';

import { getRequiredInferrers } from './endpoint/src/rendererRegistry.js';
import { formatResponse } from './endpoint/src/formatters/responseFormatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample tea for testing
const testTea = {
  name: "Tie Guan Yin",
  originalName: "铁观音 (Tiě Guān Yīn)",
  type: "oolong",
  subType: "tie-guan-yin",
  caffeineLevel: 4,
  lTheanineLevel: 5,
  flavorProfile: ["floral", "orchid", "creamy", "sweet", "mineral"],
  processingMethods: ["withered", "bruised", "partial-oxidation", "rolled", "roasted"],
  geography: {
    location: "Anxi",
    province: "Fujian",
    country: "China",
    latitude: 25.07,
    longitude: 118.19,
    altitude: 800,
    humidity: 80,
    temperature: 19.5
  }
};

/**
 * Run recommendation pipeline (simulates Netlify function logic)
 */
async function runPipeline(tea, format) {
  const renderers = ['activity', 'food', 'time', 'season', 'brewing', 'terroir'];
  const requiredInferrers = getRequiredInferrers(renderers);

  // Run inferrers
  const allInferences = {};

  if (requiredInferrers.has('compound')) {
    allInferences.compound = new CompoundInferrer().infer({
      caffeineLevel: tea.caffeineLevel,
      lTheanineLevel: tea.lTheanineLevel
    });
  }

  if (requiredInferrers.has('flavor')) {
    allInferences.flavor = new FlavorInferrer().infer({
      flavorProfiles: tea.flavorProfile || []
    });
  }

  if (requiredInferrers.has('teaType')) {
    allInferences.teaType = new TeaTypeInferrer().infer({
      type: tea.type,
      subType: tea.subType
    });
  }

  if (requiredInferrers.has('geography')) {
    allInferences.geography = new GeographyInferrer().infer({
      geography: tea.geography || {}
    });
  }

  if (requiredInferrers.has('processing')) {
    allInferences.processing = new ProcessingInferrer().infer({
      processingMethods: tea.processingMethods || []
    });
  }

  // Run renderers
  const recommendations = {};

  recommendations.activity = new ActivityRenderer().render(allInferences);
  recommendations.food = new FoodRenderer().render(allInferences);
  recommendations.time = new TimeRenderer().render(allInferences);
  recommendations.season = new SeasonRenderer().render(allInferences);
  recommendations.brewing = new BrewingRenderer().render({ ...allInferences, formData: tea });
  recommendations.terroir = new TerroirRenderer().render({ ...allInferences, formData: tea });

  // Build base response
  const baseResponse = {
    tea: {
      name: tea.name,
      originalName: tea.originalName || '',
      type: tea.type,
      subType: tea.subType || ''
    },
    recommendations,
    metadata: {
      timestamp: new Date().toISOString(),
      processingTimeMs: 0,
      version: '2.0',
      pipeline: 'inferrer-renderer',
      format,
      renderersRequested: renderers
    }
  };

  // Apply format transformation
  return formatResponse(baseResponse, allInferences, format, renderers);
}

/**
 * Calculate size of JSON output
 */
function getSize(obj) {
  const str = JSON.stringify(obj, null, 2);
  const bytes = Buffer.byteLength(str, 'utf8');
  return {
    bytes,
    kb: (bytes / 1024).toFixed(2),
    lines: str.split('\n').length
  };
}

/**
 * Main test execution
 */
async function main() {
  console.log('🧪 Testing Format Modes');
  console.log('======================\n');
  console.log(`Test Tea: ${testTea.name} (${testTea.type})\n`);

  const formats = ['raw', 'display', 'verbose'];
  const results = {};

  for (const format of formats) {
    console.log(`📋 Testing format: ${format}`);
    console.log('─'.repeat(50));

    const result = await runPipeline(testTea, format);
    results[format] = result;

    const size = getSize(result);

    console.log(`  Size: ${size.kb} KB (${size.lines} lines)`);
    console.log(`  Tea: ${result.tea?.name || 'N/A'}`);
    console.log(`  Recommendations: ${Object.keys(result.recommendations || {}).length} renderers`);

    // Check what's included
    const includes = [];
    if (result.recommendations) includes.push('recommendations');
    if (result.inferences) includes.push('inferences');
    if (result.debug) includes.push('debug');
    if (result.metadata) includes.push('metadata');

    console.log(`  Includes: ${includes.join(', ')}`);

    // Check if renderer traces are included
    const firstRenderer = Object.values(result.recommendations || {})[0];
    if (firstRenderer?.trace) {
      console.log(`  Renderer traces: ✓ (${firstRenderer.trace.length} steps)`);
    } else {
      console.log(`  Renderer traces: ✗`);
    }

    // Check if inference traces are included
    if (result.inferences) {
      const inferenceCount = Object.keys(result.inferences).length;
      const traceSteps = Object.values(result.inferences).reduce((sum, inf) => sum + (inf.trace?.length || 0), 0);
      console.log(`  Inference traces: ✓ (${inferenceCount} inferrers, ${traceSteps} steps)`);
    } else {
      console.log(`  Inference traces: ✗`);
    }

    console.log('');
  }

  // Export samples
  console.log('💾 Exporting sample outputs...\n');
  const sampleDir = path.join(__dirname, '_dataset', 'format-samples');

  if (!fs.existsSync(sampleDir)) {
    fs.mkdirSync(sampleDir, { recursive: true });
  }

  formats.forEach(format => {
    const filename = path.join(sampleDir, `${testTea.type}-${format}.json`);
    fs.writeFileSync(filename, JSON.stringify(results[format], null, 2));
    console.log(`  ✓ Exported: format-samples/${testTea.type}-${format}.json`);
  });

  // Summary
  console.log('\n📊 Format Comparison:');
  console.log('─'.repeat(70));
  console.log('Format     Size (KB)   Traces   Inferences   Best For');
  console.log('─'.repeat(70));

  formats.forEach(format => {
    const size = getSize(results[format]);
    const hasTraces = !!Object.values(results[format].recommendations || {})[0]?.trace ? 'Yes' : 'No';
    const hasInferences = !!results[format].inferences ? 'Yes' : 'No';

    let bestFor = '';
    if (format === 'raw') bestFor = 'Testing, exports';
    if (format === 'display') bestFor = 'Production UI';
    if (format === 'verbose') bestFor = 'Debugging';

    console.log(`${format.padEnd(10)} ${size.kb.padStart(7)}    ${hasTraces.padEnd(7)}  ${hasInferences.padEnd(11)}  ${bestFor}`);
  });

  console.log('\n✅ All format modes tested successfully!\n');
}

main().catch(error => {
  console.error('❌ Test failed:', error);
  console.error(error.stack);
  process.exit(1);
});
