/**
 * index.js
 *
 * Central Taxonomy Registry
 * Single access point for all taxonomy definitions
 * Provides lookup methods, validation, and cross-taxonomy consistency checks
 *
 * This is the UNIFIED TAXONOMY SYSTEM - the single source of truth
 */

import FlavorTaxonomy from './flavors.js';
import ActivityTaxonomy from './activities.js';
import FoodTaxonomy from './foods.js';
import ProcessingTaxonomy from './processing.js';
import SeasonTaxonomy from './seasons.js';
import GeographyTaxonomy from './geography.js';
import TeaTypeTaxonomy from './teaTypes.js';
import CompoundTaxonomy from './compoundTaxonomy.js';

/**
 * Central registry providing unified access to all taxonomies
 */
export class TaxonomyRegistry {
  // Individual taxonomy accessors
  static flavors = FlavorTaxonomy;
  static activities = ActivityTaxonomy;
  static foods = FoodTaxonomy;
  static processing = ProcessingTaxonomy;
  static seasons = SeasonTaxonomy;
  static geography = GeographyTaxonomy;
  static teaTypes = TeaTypeTaxonomy;
  static compounds = CompoundTaxonomy;

  /**
   * Safe lookup across any domain
   * Normalizes input and returns typed results with helpful error messages
   * @param {string} domain - Taxonomy domain (flavors, activities, foods, processing, seasons, geography, teaTypes)
   * @param {string} query - Query string (ID or alias)
   * @returns {Object} - Matched item from the requested taxonomy
   * @throws {Error} - If domain or item not found
   */
  static lookup(domain, query) {
    const normalizedDomain = String(domain).toLowerCase().trim();

    // Map domain names to taxonomy classes and lookup methods
    const taxonomyMap = {
      flavors: { taxonomy: FlavorTaxonomy, method: 'getFlavor' },
      flavor: { taxonomy: FlavorTaxonomy, method: 'getFlavor' },
      activities: { taxonomy: ActivityTaxonomy, method: 'getActivity' },
      activity: { taxonomy: ActivityTaxonomy, method: 'getActivity' },
      foods: { taxonomy: FoodTaxonomy, method: 'getFood' },
      food: { taxonomy: FoodTaxonomy, method: 'getFood' },
      processing: { taxonomy: ProcessingTaxonomy, method: 'getMethod' },
      seasons: { taxonomy: SeasonTaxonomy, method: 'getSeason' },
      season: { taxonomy: SeasonTaxonomy, method: 'getSeason' },
      geography: { taxonomy: GeographyTaxonomy, method: 'getElevation' },
      teatypes: { taxonomy: TeaTypeTaxonomy, method: 'getType' },
      'tea-types': { taxonomy: TeaTypeTaxonomy, method: 'getType' },
      'tea types': { taxonomy: TeaTypeTaxonomy, method: 'getType' },
      compounds: { taxonomy: CompoundTaxonomy, method: 'getProfile' },
      compound: { taxonomy: CompoundTaxonomy, method: 'getProfile' }
    };

    const entry = taxonomyMap[normalizedDomain];
    if (!entry) {
      throw new Error(
        `Unknown taxonomy domain: "${domain}"\n` +
        `Valid domains: ${Object.keys(taxonomyMap).join(', ')}`
      );
    }

    const result = entry.taxonomy[entry.method](query);
    if (!result) {
      throw new Error(
        `Unknown ${domain} value: "${query}"\n` +
        `Valid ${domain}: ${entry.taxonomy.listAllValid?.().join(', ') || 'N/A'}`
      );
    }

    return result;
  }

  /**
   * Get all items from a specific taxonomy
   * @param {string} domain - Taxonomy domain
   * @returns {Array} - All items in that taxonomy
   * @throws {Error} - If domain not found
   */
  static getAll(domain) {
    const normalizedDomain = String(domain).toLowerCase().trim();

    const methods = {
      flavors: () => FlavorTaxonomy.getAllFlavors(),
      flavor: () => FlavorTaxonomy.getAllFlavors(),
      activities: () => ActivityTaxonomy.getAllActivities(),
      activity: () => ActivityTaxonomy.getAllActivities(),
      foods: () => FoodTaxonomy.getAllFoods(),
      food: () => FoodTaxonomy.getAllFoods(),
      processing: () => ProcessingTaxonomy.getAllMethods(),
      seasons: () => SeasonTaxonomy.getAllSeasons(),
      season: () => SeasonTaxonomy.getAllSeasons(),
      'tea-types': () => TeaTypeTaxonomy.getAllTypes(),
      teatypes: () => TeaTypeTaxonomy.getAllTypes(),
      'tea types': () => TeaTypeTaxonomy.getAllTypes(),
      compounds: () => CompoundTaxonomy.getAllProfiles(),
      compound: () => CompoundTaxonomy.getAllProfiles()
    };

    const method = methods[normalizedDomain];
    if (!method) {
      throw new Error(`Unknown taxonomy domain: "${domain}"`);
    }

    return method();
  }

  /**
   * Validate all cross-taxonomy references
   * Checks that all references between taxonomies are valid (e.g., activity IDs in flavor hints)
   * @returns {Object} - { isConsistent: boolean, issues: Array<string> }
   */
  static validateConsistency() {
    const issues = [];

    // ========== FLAVOR TAXONOMY CHECKS ==========
    // Check: All flavor activity hints reference valid activities
    Object.entries(FlavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
      flavor.activityHints?.forEach(activityId => {
        const activity = ActivityTaxonomy.getActivity(activityId);
        if (!activity) {
          issues.push(
            `Flavor "${flavorId}" references unknown activity: "${activityId}"`
          );
        }
      });
    });

    // Check: All flavor food pairing hints reference valid foods
    Object.entries(FlavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
      flavor.foodPairingHints?.forEach(foodId => {
        const food = FoodTaxonomy.getFood(foodId);
        if (!food) {
          issues.push(
            `Flavor "${flavorId}" references unknown food: "${foodId}"`
          );
        }
      });
    });

    // Check: All flavor seasonal affinity hints reference valid seasons
    Object.entries(FlavorTaxonomy.FLAVORS).forEach(([flavorId, flavor]) => {
      flavor.seasonalAffinityHints?.forEach(seasonId => {
        const season = SeasonTaxonomy.getSeason(seasonId);
        if (!season) {
          issues.push(
            `Flavor "${flavorId}" references unknown season: "${seasonId}"`
          );
        }
      });
    });

    // ========== TEA TYPE TAXONOMY CHECKS ==========
    // Check: All tea type activity hints reference valid activities
    Object.entries(TeaTypeTaxonomy.TYPES).forEach(([typeId, type]) => {
      type.baseActivityHints?.forEach(activityId => {
        const activity = ActivityTaxonomy.getActivity(activityId);
        if (!activity) {
          issues.push(
            `Tea Type "${typeId}" references unknown activity: "${activityId}"`
          );
        }
      });
    });

    // Check: All tea type processing methods reference valid processing methods
    Object.entries(TeaTypeTaxonomy.TYPES).forEach(([typeId, type]) => {
      type.commonProcessing?.forEach(processingId => {
        const processing = ProcessingTaxonomy.getMethod(processingId);
        if (!processing) {
          issues.push(
            `Tea Type "${typeId}" references unknown processing method: "${processingId}"`
          );
        }
      });
    });

    // ========== TEA SUBTYPE CHECKS ==========
    // Check: All tea subtypes reference valid parent types
    Object.entries(TeaTypeTaxonomy.SUBTYPES).forEach(([subtypeId, subtype]) => {
      const parentType = TeaTypeTaxonomy.getType(subtype.parentType);
      if (!parentType) {
        issues.push(
          `Tea Subtype "${subtypeId}" references unknown parent type: "${subtype.parentType}"`
        );
      }
    });

    // Check: All subtype activity hints reference valid activities
    Object.entries(TeaTypeTaxonomy.SUBTYPES).forEach(([subtypeId, subtype]) => {
      subtype.baseActivityHints?.forEach(activityId => {
        const activity = ActivityTaxonomy.getActivity(activityId);
        if (!activity) {
          issues.push(
            `Tea Subtype "${subtypeId}" references unknown activity: "${activityId}"`
          );
        }
      });
    });

    return {
      isConsistent: issues.length === 0,
      issues,
      timestamp: new Date().toISOString(),
      taxonomyCount: 8,
      itemCounts: {
        flavors: Object.keys(FlavorTaxonomy.FLAVORS).length,
        activities: Object.keys(ActivityTaxonomy.ACTIVITIES).length,
        foods: Object.keys(FoodTaxonomy.FOODS).length,
        processing: Object.keys(ProcessingTaxonomy.METHODS).length,
        seasons: Object.keys(SeasonTaxonomy.SEASONS).length,
        teaTypes: Object.keys(TeaTypeTaxonomy.TYPES).length,
        teaSubtypes: Object.keys(TeaTypeTaxonomy.SUBTYPES).length,
        compounds: Object.keys(CompoundTaxonomy.profiles).length
      }
    };
  }

  /**
   * Get summary statistics about all taxonomies
   * @returns {Object} - Statistics about taxonomy content
   */
  static getStats() {
    const validation = this.validateConsistency();
    return {
      ...validation.itemCounts,
      isConsistent: validation.isConsistent,
      issueCount: validation.issues.length,
      issues: validation.issues
    };
  }

  /**
   * Print human-readable validation report
   * @param {boolean} verbose - Show all details including valid items
   * @returns {string} - Formatted validation report
   */
  static getValidationReport(verbose = false) {
    const validation = this.validateConsistency();
    let report = '';

    report += '╔════════════════════════════════════════════════════════════════╗\n';
    report += '║              TAXONOMY CONSISTENCY VALIDATION REPORT             ║\n';
    report += '╚════════════════════════════════════════════════════════════════╝\n\n';

    // Status
    report += validation.isConsistent
      ? '✅ All taxonomies are CONSISTENT\n\n'
      : `❌ Found ${validation.issues.length} consistency issue(s):\n\n`;

    if (!validation.isConsistent) {
      validation.issues.forEach((issue, i) => {
        report += `  ${i + 1}. ${issue}\n`;
      });
      report += '\n';
    }

    // Statistics
    report += '📊 Taxonomy Statistics:\n';
    report += `  Flavors:      ${validation.itemCounts.flavors}\n`;
    report += `  Activities:   ${validation.itemCounts.activities}\n`;
    report += `  Foods:        ${validation.itemCounts.foods}\n`;
    report += `  Processing:   ${validation.itemCounts.processing}\n`;
    report += `  Seasons:      ${validation.itemCounts.seasons}\n`;
    report += `  Tea Types:    ${validation.itemCounts.teaTypes}\n`;
    report += `  Subtypes:     ${validation.itemCounts.teaSubtypes}\n`;
    report += `  Compounds:    ${validation.itemCounts.compounds}\n`;
    report += `  Total Items:  ${
      Object.values(validation.itemCounts).reduce((a, b) => a + b, 0)
    }\n`;

    if (verbose) {
      report += '\n📋 All Valid References:\n';
      report += `  Activity IDs: ${ActivityTaxonomy.listAllValid().join(', ')}\n\n`;
      report += `  Food IDs: ${FoodTaxonomy.listAllValid().join(', ')}\n`;
    }

    report += '\n' + new Date().toISOString() + '\n';

    return report;
  }
}

// Export individual taxonomies for direct access
export {
  FlavorTaxonomy,
  ActivityTaxonomy,
  FoodTaxonomy,
  ProcessingTaxonomy,
  SeasonTaxonomy,
  GeographyTaxonomy,
  TeaTypeTaxonomy,
  CompoundTaxonomy
};

// Default export is the registry
export default TaxonomyRegistry;
