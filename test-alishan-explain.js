import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

// Find Alishan oolong
const alishan = dataset.find(t => t.name && t.name.toLowerCase().includes('alishan'));

if (alishan) {
  console.log('=== ALISHAN OOLONG FOUND ===\n');
  console.log('Tea Data:');
  console.log(JSON.stringify(alishan, null, 2));
} else {
  console.log('Alishan not found. Available oolong teas:');
  dataset.filter(t => t.type === 'oolong').forEach(t => {
    console.log(`  - ${t.name}`);
  });
}
