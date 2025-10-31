/**
 * Merge and normalize all validation datasets
 * - Combines 3 dataset files into 1 comprehensive file (~60 teas)
 * - Normalizes tea types (heicha → dark)
 * - Normalizes effect types (uplifting → elevating, digestive → grounding)
 */

import fs from 'fs';

// Load all three datasets
const file1 = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_extended_set.json', 'utf8'));
const file2 = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_extended_set_01.json', 'utf8'));
const file3 = JSON.parse(fs.readFileSync('./_dataset/chinese_teas_validation_extended_set_02.json', 'utf8'));

console.log(`Loaded: ${file1.length} teas from file 1`);
console.log(`Loaded: ${file2.length} teas from file 2`);
console.log(`Loaded: ${file3.length} teas from file 3`);

// Normalize a single tea record
function normalizeTea(tea) {
  const normalized = { ...tea };

  // Normalize tea type: heicha → dark
  if (normalized.type === 'heicha') {
    normalized.type = 'dark';
  }

  // Normalize effect types in expectedEffects
  if (normalized.expectedEffects) {
    // Map uplifting → elevating
    if (normalized.expectedEffects.dominant === 'uplifting') {
      normalized.expectedEffects.dominant = 'elevating';
    }
    if (normalized.expectedEffects.supporting === 'uplifting') {
      normalized.expectedEffects.supporting = 'elevating';
    }

    // Map digestive → grounding (fermented teas aid digestion through grounding warmth)
    if (normalized.expectedEffects.dominant === 'digestive') {
      normalized.expectedEffects.dominant = 'grounding';
    }
    if (normalized.expectedEffects.supporting === 'digestive') {
      normalized.expectedEffects.supporting = 'grounding';
    }
  }

  return normalized;
}

// Merge and normalize
const merged = [
  ...file1.map(normalizeTea),
  ...file2.map(normalizeTea),
  ...file3.map(normalizeTea)
];

console.log(`\nTotal teas after merge: ${merged.length}`);

// Check for duplicates by name
const names = merged.map(t => t.name);
const uniqueNames = new Set(names);
if (names.length !== uniqueNames.size) {
  console.warn(`\nWarning: ${names.length - uniqueNames.size} duplicate tea names detected!`);
  const dupes = names.filter((name, idx) => names.indexOf(name) !== idx);
  console.warn('Duplicates:', [...new Set(dupes)]);
} else {
  console.log('✓ No duplicate tea names');
}

// Validate canonical tea types
const validTypes = ['green', 'white', 'yellow', 'oolong', 'red', 'dark', 'puerh'];
const typeCount = {};
merged.forEach(tea => {
  if (!validTypes.includes(tea.type)) {
    console.error(`✗ Invalid tea type: "${tea.type}" in ${tea.name}`);
  }
  typeCount[tea.type] = (typeCount[tea.type] || 0) + 1;
});

console.log('\nTea type distribution:');
Object.entries(typeCount).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

// Validate canonical effect types
const validEffects = ['energizing', 'calming', 'focusing', 'harmonizing', 'grounding', 'elevating', 'comforting', 'restorative'];
let effectIssues = 0;
merged.forEach(tea => {
  if (tea.expectedEffects) {
    if (!validEffects.includes(tea.expectedEffects.dominant)) {
      console.error(`✗ Invalid dominant effect: "${tea.expectedEffects.dominant}" in ${tea.name}`);
      effectIssues++;
    }
    if (!validEffects.includes(tea.expectedEffects.supporting)) {
      console.error(`✗ Invalid supporting effect: "${tea.expectedEffects.supporting}" in ${tea.name}`);
      effectIssues++;
    }
  }
});

if (effectIssues === 0) {
  console.log('✓ All effect types are canonical');
}

// Write merged file
const outputPath = './_dataset/chinese_teas_validation_comprehensive.json';
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));

console.log(`\n✓ Merged and normalized dataset saved to: ${outputPath}`);
console.log(`✓ Total teas ready for testing: ${merged.length}`);
