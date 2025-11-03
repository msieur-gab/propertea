/**
 * Export Tea Drunkenness Sample
 *
 * Purpose: Generate real tea drunkenness predictions for Tie Guan Yin
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { CompoundInferrer } from './endpoint/src/processors/inferrers/CompoundInferrer.js';
import { GeographyInferrer } from './endpoint/src/processors/inferrers/GeographyInferrer.js';
import { TeaTypeInferrer } from './endpoint/src/processors/inferrers/TeaTypeInferrer.js';
import { TeaDrunkenessRenderer } from './endpoint/src/processors/renderers/TeaDrunkenessRenderer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Tie Guan Yin from dataset
const oolongData = JSON.parse(fs.readFileSync(path.join(__dirname, '_dataset/oolong.json'), 'utf-8'));
const tieGuanYin = oolongData.find(tea => tea.name === "Tie Guan Yin");

console.log('🍵 Exporting Tea Drunkenness Sample: Tie Guan Yin\n');

// Run inferrers
const compoundInf = new CompoundInferrer().infer({
  caffeineLevel: tieGuanYin.caffeineLevel,
  lTheanineLevel: tieGuanYin.lTheanineLevel
});

const geographyInf = new GeographyInferrer().infer({
  geography: tieGuanYin.geography
});

const teaTypeInf = new TeaTypeInferrer().infer({
  type: tieGuanYin.type,
  subType: tieGuanYin.subType
});

// Run renderer
const renderer = new TeaDrunkenessRenderer();
const result = renderer.render({
  compound: compoundInf,
  geography: geographyInf,
  teaType: teaTypeInf
});

// Add tea info
const fullOutput = {
  tea: {
    name: tieGuanYin.name,
    originalName: tieGuanYin.originalName,
    type: tieGuanYin.type,
    subType: tieGuanYin.subType
  },
  teaDrunk: result
};

// Export
const sampleDir = path.join(__dirname, '_dataset/format-samples');
const filepath = path.join(sampleDir, 'oolong-teadrunk.json');

fs.writeFileSync(filepath, JSON.stringify(fullOutput, null, 2));

console.log('✅ Exported:', filepath);
console.log('\n📊 Results:');
console.log(`   Drunkenness Potential: ${result.drunkennessPotential}/100`);
console.log(`   Intensity: ${result.intensity}`);
console.log(`   Character: ${result.character}`);
console.log(`   Confidence: ${(result.confidence * 100).toFixed(0)}%\n`);
