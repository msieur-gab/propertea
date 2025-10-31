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

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Initialize orchestrator
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

// Test first tea
const tea = dataset[0];
const teaModel = {
  name: tea.name,
  type: tea.type,
  subType: tea.subType || null,
  caffeineLevel: tea.caffeineLevel,
  lTheanineLevel: tea.lTheanineLevel,
  flavorProfile: tea.flavorProfile || [],
  processingMethods: tea.processingMethods || [],
  geography: tea.geography || {}
};

console.log(`Testing: ${tea.name}\n`);

orchestrator.calculateTea(teaModel).then(result => {
  if (!result.success) {
    console.log('ERROR:', result.error);
    return;
  }

  const analysis = result.data;

  console.log('=== SEASONAL MATCHER OUTPUT ===\n');
  console.log(JSON.stringify(analysis.seasonal, null, 2));

  console.log('\n=== EXPECTED SEASONS ===\n');
  console.log(tea.recommendedContext.drinkingSeason);

  process.exit(0);
}).catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});
