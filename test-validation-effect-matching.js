/**
 * Validation Test Script - Effect Matching Analysis
 *
 * Tests the backend EffectService against the validation dataset
 * Identifies threshold and weight issues in effect calculations
 *
 * Usage: node test-validation-effect-matching.js [--verbose] [--type=<tea-type>]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import backend services
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

// Parse command line arguments
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const typeFilter = args.find(arg => arg.startsWith('--type='))?.split('=')[1];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

/**
 * Load validation dataset
 */
function loadDataset() {
  const datasetPath = path.join(__dirname, '_dataset', 'chinese_teas_validation_comprehensive.json');
  const rawData = fs.readFileSync(datasetPath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Initialize services
 */
function initializeServices() {
  return {
    teaTypeService: new TeaTypeService(),
    compoundService: new CompoundService(),
    flavorService: new FlavorService(),
    processingService: new ProcessingService(),
    geographyService: new GeographyService(),
    effectService: new EffectService(),
    recommendationService: new RecommendationService()
  };
}

/**
 * Run core calculations for a tea
 */
async function runCoreCalculations(tea, services) {
  // Prepare tea model data
  const teaModel = {
    name: tea.name,
    type: tea.type,
    subType: tea.subType || '',
    caffeineLevel: tea.caffeineLevel || 0,
    lTheanineLevel: tea.lTheanineLevel || 0,
    flavor: {
      primary: tea.flavorProfile || []
    },
    processing: {
      methods: tea.processingMethods || [],
      oxidationLevel: tea.processingOxidationLevel || 0
    },
    geography: tea.geography || {}
  };

  try {
    // Run all core calculations
    const [teaType, compounds, flavor, processing, geography] = await Promise.all([
      services.teaTypeService.analyze(teaModel),
      services.compoundService.analyze(teaModel),
      services.flavorService.analyze(teaModel),
      services.processingService.analyze(teaModel),
      services.geographyService.analyze(teaModel)
    ]);

    // Build intermediate analysis
    const intermediateAnalysis = {
      teaType,
      compounds,
      flavor,
      processing,
      geography,
      _sourceTea: teaModel
    };

    // Calculate effects
    const effects = await services.effectService.analyze(teaModel, intermediateAnalysis);

    return {
      success: true,
      teaType,
      compounds,
      flavor,
      processing,
      geography,
      effects
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Compare calculated effects with expected effects
 */
function compareEffects(expected, calculated) {
  const dominantMatch = expected.dominant === calculated.dominant;
  const supportingMatch = expected.supporting === calculated.supporting;
  const eitherDominantMatch =
    expected.dominant === calculated.dominant ||
    expected.dominant === calculated.supporting;

  return {
    exactMatch: dominantMatch && supportingMatch,
    dominantMatch,
    supportingMatch,
    eitherDominantMatch,
    expected,
    calculated
  };
}

/**
 * Format result for display
 */
function formatResult(tea, analysis, comparison) {
  const { exactMatch, dominantMatch, supportingMatch, eitherDominantMatch } = comparison;

  let status = '';
  let statusColor = colors.red;

  if (exactMatch) {
    status = '✅ MATCH';
    statusColor = colors.green;
  } else if (dominantMatch && supportingMatch) {
    status = '✅ EXACT';
    statusColor = colors.green;
  } else if (eitherDominantMatch) {
    status = '⚠️  PARTIAL';
    statusColor = colors.yellow;
  } else {
    status = '❌ FAIL';
    statusColor = colors.red;
  }

  const expected = `${comparison.expected.dominant} / ${comparison.expected.supporting}`;
  const calculated = `${comparison.calculated.dominant} / ${comparison.calculated.supporting}`;

  return {
    status,
    statusColor,
    expected,
    calculated,
    displayLine: `${statusColor}${status}${colors.reset} ${tea.name.padEnd(35)} | Expected: ${expected.padEnd(30)} | Calculated: ${calculated}`
  };
}

/**
 * Analyze compounds impact on effects
 */
function analyzeCompoundsImpact(compounds) {
  if (!compounds || !compounds.levels) {
    return { stimulation: 'N/A', relaxation: 'N/A', ratio: 'N/A' };
  }

  return {
    caffeine: compounds.levels.caffeineLevel,
    theanine: compounds.levels.lTheanineLevel,
    ratio: compounds.levels.lTheanineToCaffeineRatio,
    stimulation: compounds.analysis?.stimulationLevel || 'N/A',
    relaxation: compounds.analysis?.relaxationLevel || 'N/A',
    profile: compounds.analysis?.compoundProfile || 'N/A'
  };
}

/**
 * Analyze which factors should influence the effects
 */
function explainEffectFactors(tea, analysis) {
  const factors = {
    teaType: analysis.teaType?.identified || {},
    compounds: analyzeCompoundsImpact(analysis.compounds),
    flavorCategories: analysis.flavor?.profile?.categories || [],
    processingRoast: analysis.processing?.roastLevel || 'Unknown',
    geography: {
      altitude: analysis.geography?.climate?.altitude_value || 'Unknown',
      temperature: analysis.geography?.climate?.temperature_value || 'Unknown',
      humidity: analysis.geography?.climate?.humidity_value || 'Unknown',
      solarRadiation: analysis.geography?.climate?.solarRadiation_value || 'Unknown'
    }
  };

  return factors;
}

/**
 * Generate detailed mismatch report
 */
function generateMismatchReport(tea, analysis, comparison) {
  const factors = explainEffectFactors(tea, analysis);

  let report = `\n${colors.cyan}=== MISMATCH ANALYSIS: ${tea.name} ===${colors.reset}\n`;
  report += `Type: ${tea.type} | SubType: ${tea.subType || 'N/A'}\n`;
  report += `Expected: ${colors.yellow}${comparison.expected.dominant}${colors.reset} / ${colors.yellow}${comparison.expected.supporting}${colors.reset}\n`;
  report += `Calculated: ${colors.red}${comparison.calculated.dominant}${colors.reset} / ${colors.red}${comparison.calculated.supporting}${colors.reset}\n\n`;

  report += `${colors.blue}Compound Factors:${colors.reset}\n`;
  report += `  Caffeine: ${factors.compounds.caffeine}/10 (${factors.compounds.stimulation})\n`;
  report += `  L-Theanine: ${factors.compounds.theanine}/10 (${factors.compounds.relaxation})\n`;
  report += `  Ratio: ${factors.compounds.ratio.toFixed(2)} (${factors.compounds.profile})\n\n`;

  report += `${colors.blue}Flavor Categories:${colors.reset}\n`;
  report += `  ${factors.flavorCategories.join(', ') || 'None identified'}\n\n`;

  report += `${colors.blue}Processing:${colors.reset}\n`;
  report += `  Roast Level: ${factors.processingRoast}\n\n`;

  report += `${colors.blue}Geography/Climate:${colors.reset}\n`;
  report += `  Altitude: ${factors.geography.altitude}m\n`;
  report += `  Temperature: ${factors.geography.temperature}°C\n`;
  report += `  Humidity: ${factors.geography.humidity}%\n`;
  report += `  Solar Radiation: ${factors.geography.solarRadiation} W/m²\n`;

  return report;
}

/**
 * Main validation function
 */
async function validateEffects() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}         Tea Effect Matching Validation Test${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);

  // Load dataset
  console.log(`${colors.gray}Loading validation dataset...${colors.reset}`);
  const dataset = loadDataset();
  console.log(`${colors.green}Loaded ${dataset.length} teas${colors.reset}\n`);

  // Initialize services
  const services = initializeServices();

  // Filter by type if specified
  let teaList = dataset;
  if (typeFilter) {
    teaList = dataset.filter(tea => tea.type === typeFilter);
    console.log(`${colors.yellow}Filtering by type: ${typeFilter} (${teaList.length} teas)${colors.reset}\n`);
  }

  // Track results
  const results = {
    total: teaList.length,
    exact: 0,
    partial: 0,
    failed: 0,
    errors: [],
    byType: {},
    byEffect: {},
    mismatches: []
  };

  // Test each tea
  console.log(`${colors.blue}Running tests...${colors.reset}\n`);

  for (const tea of teaList) {
    // Run backend analysis
    const analysis = await runCoreCalculations(tea, services);

    if (!analysis.success) {
      results.errors.push({ tea: tea.name, error: analysis.error });
      results.failed++;
      continue;
    }

    // Get expected effects
    const expected = tea.expectedEffects || { dominant: 'unknown', supporting: 'unknown' };
    const calculated = analysis.effects?.expectedEffects || { dominant: 'unknown', supporting: 'unknown' };

    // Compare
    const comparison = compareEffects(expected, calculated);

    // Format display
    const formatted = formatResult(tea, analysis, comparison);
    console.log(formatted.displayLine);

    // Update statistics
    const teaType = tea.type;
    if (!results.byType[teaType]) {
      results.byType[teaType] = { total: 0, exact: 0, partial: 0, failed: 0 };
    }
    results.byType[teaType].total++;

    if (comparison.exactMatch) {
      results.exact++;
      results.byType[teaType].exact++;
    } else if (comparison.eitherDominantMatch) {
      results.partial++;
      results.byType[teaType].partial++;
    } else {
      results.failed++;
      results.byType[teaType].failed++;
      results.mismatches.push({
        tea,
        analysis,
        comparison
      });
    }

    // Track by effect type
    const effectKey = `${expected.dominant}→${expected.supporting}`;
    if (!results.byEffect[effectKey]) {
      results.byEffect[effectKey] = { total: 0, correct: 0 };
    }
    results.byEffect[effectKey].total++;
    if (comparison.exactMatch) {
      results.byEffect[effectKey].correct++;
    }

    // Show verbose details if requested
    if (verbose && !comparison.exactMatch) {
      console.log(generateMismatchReport(tea, analysis, comparison));
    }
  }

  // Summary statistics
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}                        RESULTS SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);

  const exactPercent = ((results.exact / results.total) * 100).toFixed(1);
  const partialPercent = ((results.partial / results.total) * 100).toFixed(1);
  const failedPercent = ((results.failed / results.total) * 100).toFixed(1);

  console.log(`${colors.green}✅ Exact Matches:   ${results.exact}/${results.total} (${exactPercent}%)${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Partial Matches: ${results.partial}/${results.total} (${partialPercent}%)${colors.reset}`);
  console.log(`${colors.red}❌ Failures:        ${results.failed}/${results.total} (${failedPercent}%)${colors.reset}`);

  // By type breakdown
  console.log(`\n${colors.blue}Results by Tea Type:${colors.reset}`);
  for (const [type, stats] of Object.entries(results.byType)) {
    const typePercent = ((stats.exact / stats.total) * 100).toFixed(1);
    console.log(`  ${type.padEnd(12)} | ${stats.exact}/${stats.total} (${typePercent}%)`);
  }

  // By effect breakdown
  console.log(`\n${colors.blue}Results by Expected Effect Pair:${colors.reset}`);
  const sortedEffects = Object.entries(results.byEffect)
    .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total));

  for (const [effect, stats] of sortedEffects) {
    const effectPercent = ((stats.correct / stats.total) * 100).toFixed(1);
    const marker = stats.correct === stats.total ? colors.green : colors.yellow;
    console.log(`  ${marker}${effect.padEnd(30)}${colors.reset} | ${stats.correct}/${stats.total} (${effectPercent}%)`);
  }

  // Detailed mismatch analysis
  if (results.mismatches.length > 0) {
    console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}                   DETAILED MISMATCH ANALYSIS${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);

    // Group mismatches by tea type
    const mismatchesByType = {};
    results.mismatches.forEach(mismatch => {
      const type = mismatch.tea.type;
      if (!mismatchesByType[type]) {
        mismatchesByType[type] = [];
      }
      mismatchesByType[type].push(mismatch);
    });

    for (const [type, mismatches] of Object.entries(mismatchesByType)) {
      console.log(`\n${colors.yellow}${type.toUpperCase()} teas (${mismatches.length} mismatches):${colors.reset}`);

      // Group by expected effect
      const byExpected = {};
      mismatches.forEach(m => {
        const exp = m.comparison.expected.dominant;
        if (!byExpected[exp]) byExpected[exp] = [];
        byExpected[exp].push(m);
      });

      for (const [expected, teas] of Object.entries(byExpected)) {
        console.log(`  Expected: ${colors.yellow}${expected}${colors.reset}`);

        // Count what we calculated instead
        const calculatedCounts = {};
        teas.forEach(t => {
          const calc = t.comparison.calculated.dominant;
          calculatedCounts[calc] = (calculatedCounts[calc] || 0) + 1;
        });

        for (const [calc, count] of Object.entries(calculatedCounts)) {
          console.log(`    → Got ${colors.red}${calc}${colors.reset} (${count}x)`);
        }
      }
    }
  }

  // Error summary
  if (results.errors.length > 0) {
    console.log(`\n${colors.red}═══════════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.red}                          ERRORS${colors.reset}`);
    console.log(`${colors.red}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);

    results.errors.forEach(err => {
      console.log(`${colors.red}✗${colors.reset} ${err.tea}: ${err.error}`);
    });
  }

  // Recommendations
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}                     RECOMMENDATIONS${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);

  if (results.exact === results.total) {
    console.log(`${colors.green}✅ All tests passing! No threshold adjustments needed.${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}Accuracy: ${exactPercent}%${colors.reset}\n`);

    // Find patterns in failures
    const patterns = analyzeFailurePatterns(results.mismatches);

    if (patterns.lowTheanineIssues > 0) {
      console.log(`${colors.yellow}⚠️  Issue: ${patterns.lowTheanineIssues} failures with low L-theanine${colors.reset}`);
      console.log(`   Recommendation: Reduce L-theanine threshold in COMPOUND_EFFECT_MODIFIERS\n`);
    }

    if (patterns.geographyWeightIssues > 0) {
      console.log(`${colors.yellow}⚠️  Issue: ${patterns.geographyWeightIssues} failures linked to geography${colors.reset}`);
      console.log(`   Recommendation: Adjust GEOGRAPHIC_EFFECT_MODIFIERS weights in EffectService\n`);
    }

    if (patterns.flavorMappingIssues > 0) {
      console.log(`${colors.yellow}⚠️  Issue: ${patterns.flavorMappingIssues} failures with specific flavors${colors.reset}`);
      console.log(`   Recommendation: Review FLAVOR_EFFECT_MAP in EffectService\n`);
    }

    console.log(`${colors.blue}Next Steps:${colors.reset}`);
    console.log(`1. Review EffectService.js lines 32-135 (Tea type and compound modifiers)`);
    console.log(`2. Adjust weights for tea types that consistently fail`);
    console.log(`3. Check compound profile thresholds (lines 199-210)`);
    console.log(`4. Verify geographic thresholds match your data ranges`);
    console.log(`5. Re-run validation with: ${colors.cyan}node test-validation-effect-matching.js --verbose${colors.reset}\n`);
  }

  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

/**
 * Analyze failure patterns
 */
function analyzeFailurePatterns(mismatches) {
  const patterns = {
    lowTheanineIssues: 0,
    highCaffeineIssues: 0,
    geographyWeightIssues: 0,
    flavorMappingIssues: 0
  };

  mismatches.forEach(m => {
    const compounds = m.analysis.compounds?.levels || {};
    const altitude = m.analysis.geography?.climate?.altitude_value || 600;

    // Detect patterns
    if (compounds.lTheanineLevel < 3 && compounds.caffeineLevel > 5) {
      patterns.lowTheanineIssues++;
    }

    if (compounds.caffeineLevel > 7) {
      patterns.highCaffeineIssues++;
    }

    if (altitude > 1200 || altitude < 300) {
      patterns.geographyWeightIssues++;
    }

    const flavorCount = m.analysis.flavor?.profile?.categories?.length || 0;
    if (flavorCount > 3) {
      patterns.flavorMappingIssues++;
    }
  });

  return patterns;
}

// Run validation
validateEffects().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
