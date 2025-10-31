import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TeaCalculationOrchestrator } from './backend/src/models/TeaCalculationOrchestrator.js';
import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { EffectService } from './backend/src/services/EffectService.js';
import { RecommendationService } from './backend/src/services/RecommendationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, 'tea_validation_data.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const services = {
  teaTypeService: new TeaTypeService(),
  compoundService: new CompoundService(),
  flavorService: new FlavorService(),
  processingService: new ProcessingService(),
  geographyService: new GeographyService(),
  effectService: new EffectService(),
  recommendationService: new RecommendationService()
};

const orchestrator = new TeaCalculationOrchestrator(services);

// Test Tie Guan Yin
const teaData = dataset[0];
console.log(`\n=== Activity Hints for ${teaData.name} ===\n`);

// Run core calculations
const teaModel = { name: teaData.name, type: teaData.type };
const coreAnalysis = await orchestrator.runCoreCalculations(teaModel);

console.log('TeaType.identified:', coreAnalysis.data.teaType.identified);
console.log('\nTeaType.characteristics:',  coreAnalysis.data.teaType.characteristics);
console.log('\nCompound Profile:', coreAnalysis.data.compounds.analysis.compoundProfile);
console.log('\nFlavor Activity Hints:', coreAnalysis.data.flavor.analysis.activityHints);
