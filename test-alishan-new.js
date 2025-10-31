import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Find Ali Shan
const alishan = dataset.find(t => t.name && t.name.includes('Taiwanese High Mountain'));

if (alishan) {
  console.log('=== ALI SHAN OOLONG (Taiwanese High Mountain) ===\n');

  // Get all 5 factor analyses
  const compoundService = new CompoundService();
  const flavorService = new FlavorService();
  const processingService = new ProcessingService();
  const geographyService = new GeographyService();
  const teaTypeService = new TeaTypeService();

  const compounds = compoundService.infer(alishan);
  const flavor = flavorService.infer(alishan);
  const processing = processingService.infer(alishan);
  const geography = geographyService.infer(alishan);
  const teaType = teaTypeService.infer(alishan);

  const intermediateAnalysis = {
    compounds,
    flavor,
    processing,
    geography,
    teaType
  };

  // Calculate effects
  const effectService = new EffectService();
  const result = effectService.infer(alishan, intermediateAnalysis);

  console.log('Expected:', alishan.expectedEffects.dominant, '/', alishan.expectedEffects.supporting);
  console.log('Got:     ', result.expectedEffects.dominant, '/', result.expectedEffects.supporting);
  console.log('Match:   ', result.expectedEffects.dominant === alishan.expectedEffects.dominant ? '✓' : '✗');
  console.log();
  console.log('All Scores:');
  Object.entries(result.allScores)
    .sort(([, a], [, b]) => b - a)
    .forEach(([effect, score]) => {
      console.log(`  ${effect.padEnd(12)}: ${score}`);
    });
}
