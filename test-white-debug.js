import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EffectService } from './backend/src/services/EffectService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const effectService = new EffectService();

// Find first white tea
const whiteTeas = dataset.filter(t => t.type === 'white').slice(0, 3);

whiteTeas.forEach(tea => {
  console.log(`\n=== ${tea.name} (${tea.type}) ===`);
  console.log(`Expected: ${tea.expectedEffects.dominant}/${tea.expectedEffects.supporting}`);
  console.log(`Caffeine: ${tea.caffeineLevel}, L-Theanine: ${tea.lTheanineLevel}`);

  const teaModel = {
    name: tea.name,
    type: tea.type,
    caffeineLevel: tea.caffeineLevel || 0,
    lTheanineLevel: tea.lTheanineLevel || 0,
    flavorProfile: tea.flavorProfile || [],
    processingMethods: tea.processingMethods || [],
    geography: tea.geography || {}
  };

  const result = effectService.infer(teaModel, {});
  console.log(`Got: ${result.expectedEffects.dominant}/${result.expectedEffects.supporting}`);

  console.log('\nTop 3 Scores:');
  Object.entries(result.allScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([effect, score]) => {
      console.log(`  ${effect.padEnd(15)}: ${score.toFixed(2)}`);
    });
});
