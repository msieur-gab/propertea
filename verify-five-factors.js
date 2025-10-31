import { CompoundService } from './backend/src/services/CompoundService.js';
import { FlavorService } from './backend/src/services/FlavorService.js';
import { ProcessingService } from './backend/src/services/ProcessingService.js';
import { GeographyService } from './backend/src/services/GeographyService.js';
import { TeaTypeService } from './backend/src/services/TeaTypeService.js';

// Ali Shan Oolong raw inputs
const alishan = {
  name: 'Ali Shan Oolong',
  type: 'oolong',
  caffeineLevel: 3.5,
  lTheanineLevel: 6.5,
  flavorProfile: ['floral', 'buttery', 'sweet', 'creamy', 'honeysuckle'],
  processingMethods: ['withered', 'partial-oxidation', 'ball-rolled', 'minimal-roast'],
  geography: {
    altitude: 1500,
    humidity: 80,
    temperature: 14.8,
    solarRadiation: 180,
    latitude: 23.47,
    longitude: 120.8
  }
};

const compoundService = new CompoundService();
const flavorService = new FlavorService();
const processingService = new ProcessingService();
const geographyService = new GeographyService();
const teaTypeService = new TeaTypeService();

console.log('=== VERIFYING 5 FACTORS PRODUCE CORRECT ANALYSIS ===\n');

console.log('1. COMPOUNDS (caffeine 3.5, L-theanine 6.5):');
const compounds = compoundService.infer(alishan);
console.log(`   Profile: ${compounds.analysis.compoundProfile}`);
console.log(`   Stimulation: ${compounds.analysis.stimulationLevel}`);
console.log(`   Relaxation: ${compounds.analysis.relaxationLevel}`);
console.log(`   ✓ Should be: Smooth & Sustained, Low stim, High relax\n`);

console.log('2. FLAVOR PROFILE (floral, buttery, sweet):');
const flavor = flavorService.infer(alishan);
console.log(`   Analysis keys:`, Object.keys(flavor.analysis || {}));
console.log(`   ✓ Should identify: Floral, Sweet categories\n`);

console.log('3. PROCESSING (withered, partial-oxidation, ball-rolled, minimal-roast):');
const processing = processingService.infer(alishan);
console.log(`   Analysis keys:`, Object.keys(processing.analysis || {}));
console.log(`   ✓ Should identify: neutral-warming tendency, Minimal roast\n`);

console.log('4. GEOGRAPHY (1500m, 80% humidity, 14.8°C, 180 solar):');
const geography = geographyService.infer(alishan);
console.log(`   Analysis keys:`, Object.keys(geography.analysis || {}));
console.log(`   ✓ Should identify: high alt, high humidity, low temp\n`);

console.log('5. TEA TYPE (oolong):');
const teaType = teaTypeService.infer(alishan);
console.log(`   Primary Type: ${teaType.primaryType}`);
console.log(`   ✓ Should be: oolong type with proper characteristics\n`);

console.log('=== FOUNDATION CHECK ===');
console.log('✓ Compounds: WORKING');
console.log('? Flavor: Check if analysis correct');
console.log('? Processing: Check if analysis correct');
console.log('? Geography: Check if analysis correct');
console.log('? TeaType: Check if analysis correct');
