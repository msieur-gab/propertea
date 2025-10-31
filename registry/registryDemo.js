/**
 * Descriptor Registry Demo
 * 
 * This file demonstrates how to use the descriptor registry and utility functions.
 * It can be run directly to see the registry in action.
 */

import { 
  normalizeEnergyTerm,
  getEnergyValue,
  normalizeIntensityLevel,
  getIntensityValue,
  getProcessingMethod,
  getFlavorData,
  isFlavorInCategory,
  normalizeSeasonName,
  getSeasonValue,
  getCompoundProfile,
  getDescriptorDocumentation,
  detectTerminologyMismatches,
  generateFlavorTaxonomyDiagram
} from '../js/utils/descriptorUtils.js';

// Demo function to test the registry and utilities
async function runRegistryDemo() {
  let output = [];
  output.push('=== Tea Analysis System Descriptor Registry Demo ===\n');
  
  // 1. Basic term normalization
  output.push('Energy Term Normalization:');
  const energyTerms = ['cooling', 'COOLING', 'cool', 'cold', 'warming', 'warm', 'hot'];
  energyTerms.forEach(term => {
    output.push(`  "${term}" → "${normalizeEnergyTerm(term)}" (value: ${getEnergyValue(term)})`);
  });
  output.push('');
  
  // 2. Intensity level normalization
  output.push('Intensity Level Normalization:');
  const intensityLevels = ['none', 'very low', 'low', 'moderate', 'medium', 'high', 'very high'];
  intensityLevels.forEach(level => {
    output.push(`  "${level}" → "${normalizeIntensityLevel(level)}" (value: ${getIntensityValue(level)})`);
  });
  output.push('');
  
  // 3. Processing method lookup
  output.push('Processing Method Lookup:');
  const processingMethods = ['steamed', 'pan-fired', 'heavy roast', 'heavy-roast', 'unknown-method'];
  processingMethods.forEach(method => {
    const methodData = getProcessingMethod(method);
    output.push(`  "${method}" → ${methodData ? `Found: ${methodData.category}` : 'Not found'}`);
  });
  output.push('');
  
  // 4. Flavor category checking
  output.push('Flavor Category Checking:');
  const flavorTests = [
    { flavor: 'jasmine', category: 'floral' },
    { flavor: 'apple', category: 'fruity' },
    { flavor: 'cinnamon', category: 'spicy' },
    { flavor: 'grass', category: 'vegetal' },
    { flavor: 'jasmine', category: 'fruity' } // Should be false
  ];
  flavorTests.forEach(test => {
    output.push(`  "${test.flavor}" in category "${test.category}"? ${isFlavorInCategory(test.flavor, test.category)}`);
  });
  output.push('');
  
  // 5. Compound profile lookup
  output.push('Compound Profile Lookup:');
  const compoundProfiles = [
    'intense & sharp', 
    'balanced & focused', 
    'deeply calm',
    'balanced focused' // Without '&'
  ];
  compoundProfiles.forEach(profile => {
    const profileData = getCompoundProfile(profile);
    output.push(`  "${profile}" → ${profileData ? `Found: ${profileData.description}` : 'Not found'}`);
  });
  output.push('');
  
  // 6. Season name normalization
  output.push('Season Name Normalization:');
  const seasons = ['spring', 'early spring', 'late summer', 'fall', 'autumn'];
  seasons.forEach(season => {
    output.push(`  "${season}" → "${normalizeSeasonName(season)}" (value: ${getSeasonValue(season)})`);
  });
  output.push('');
  
  // 7. Detect terminology mismatches
  output.push('Detecting Terminology Mismatches:');
  try {
    const mismatches = await detectTerminologyMismatches();
    output.push(`  ${mismatches.summary}`);
    if (mismatches.count > 0) {
      output.push('  Sample mismatches:');
      mismatches.mismatches.slice(0, 3).forEach(mismatch => {
        output.push(`    - ${mismatch.type}: ${mismatch.term || ''} (${mismatch.issue})`);
      });
      if (mismatches.count > 3) {
        output.push(`    ...and ${mismatches.count - 3} more`);
      }
    }
  } catch (e) {
    output.push(`  Error detecting mismatches: ${e.message}`);
  }
  output.push('');
  
  // 8. Generate documentation (abbreviated output)
  output.push('Registry Documentation (abbreviated):');
  const doc = getDescriptorDocumentation();
  output.push(`  Energy Terms: ${doc.energyTerms.length} defined`);
  output.push(`  Intensity Levels: ${doc.intensityLevels.length} defined`);
  output.push(`  Processing Methods: ${doc.processingMethods.length} defined`);
  output.push(`  Flavor Categories: ${doc.flavorCategories.length} defined`);
  output.push(`  Compound Profiles: ${doc.compoundProfiles.length} defined`);
  output.push('');
  
  // 9. Generate flavor taxonomy diagram
  output.push('Flavor Taxonomy Diagram:');
  const diagram = generateFlavorTaxonomyDiagram();
  output.push(diagram);
  output.push('');
  
  output.push('=== Demo Complete ===');
  
  return output.join('\n');
}

// Run the demo if this is the main module
if (typeof window !== 'undefined') {
  // In browser
  window.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('run-demo');
    if (button) {
      button.addEventListener('click', async () => {
        const output = document.getElementById('output');
        if (output) {
          output.innerHTML = '<span class="loading"></span> Running demo...';
          try {
            const result = await runRegistryDemo();
            output.innerHTML = `<pre>${result}</pre>`;
          } catch (error) {
            output.innerHTML = `<div class="error">Error running demo: ${error.message}</div>`;
          }
        }
      });
    }
  });
} else {
  // In Node.js
  runRegistryDemo().then(console.log).catch(console.error);
}

export { runRegistryDemo };

export { 
  detectTerminologyMismatches,
  generateFlavorTaxonomyDiagram,
  getDescriptorDocumentation,
  normalizeEnergyTerm,
  getEnergyValue,
  normalizeIntensityLevel,
  getIntensityValue,
  normalizeSeasonName,
  getSeasonValue
} from '../js/utils/descriptorUtils.js';