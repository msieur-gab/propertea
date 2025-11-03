/**
 * Central Descriptor Registry
 * 
 * A lightweight registry that serves as a central reference point for terminology
 * across the tea analysis system. It helps standardize terms, detect mismatches,
 * and provides self-documentation without disrupting the existing code.
 */

export class DescriptorRegistry {
  constructor() {
    // Simple structure with key categories from the system
    this.energyTerms = new Map();
    this.intensityLevels = new Map();
    this.processingMethods = new Map();
    this.flavorCategories = new Map();
    this.seasonalTerms = new Map();
    this.compoundProfiles = new Map();
    this.teaTypes = new Map();
    
    // Tracking for mismatches and warnings
    this.warnings = [];
  }

  // Simple getter that works with any category
  get(category, key) {
    if (!this[category]) return null;
    return this[category].get(this._normalizeKey(key));
  }

  // Simple setter for any category
  set(category, key, value) {
    if (!this[category]) return false;
    this[category].set(this._normalizeKey(key), value);
    return true;
  }

  // Simple helper for normalization
  _normalizeKey(key) {
    if (!key) return '';
    return String(key).toLowerCase().trim();
  }

  // Initialize with existing descriptors
  initialize() {
    this._loadEnergyTerms();
    this._loadIntensityLevels();
    this._loadProcessingMethods();
    this._loadFlavorCategories();
    this._loadSeasonalTerms();
    this._loadCompoundProfiles();
    this._loadTeaTypes();
    return this;
  }

  // Private loaders for each descriptor type
  _loadEnergyTerms() {
    // Standard energy terms used across the system
    const terms = [
      ['cooling', { value: -1, description: 'Cooling effect, better for warmer weather' }],
      ['neutral-cooling', { value: -0.5, description: 'Slightly cooling effect' }],
      ['neutral', { value: 0, description: 'Neutral thermal effect, versatile' }],
      ['neutral-warming', { value: 0.5, description: 'Slightly warming effect' }],
      ['warming', { value: 1, description: 'Warming effect, better for cooler weather' }],
      ['very warming', { value: 2, description: 'Very warming effect, ideal for cold weather' }]
    ];
    
    terms.forEach(([term, data]) => {
      data.term = term; // Add the normalized term itself
      this.energyTerms.set(term, data);
    });
  }

  _loadIntensityLevels() {
    // Standard intensity scale
    const levels = [
      ['none', { value: 0, description: 'Absent or imperceptible' }],
      ['very low', { value: 1, description: 'Minimal presence, barely perceptible' }],
      ['low', { value: 2, description: 'Subtle presence, easily overlooked' }],
      ['moderate', { value: 3, description: 'Medium presence, noticeable' }],
      ['medium', { value: 3, description: 'Medium presence, noticeable' }], // Alias
      ['medium-high', { value: 4, description: 'Prominent presence' }],
      ['high', { value: 4, description: 'Prominent presence' }], // Alias
      ['very high', { value: 5, description: 'Dominant presence, impossible to miss' }]
    ];
    
    levels.forEach(([level, data]) => {
      data.level = level; // Add the normalized level itself
      this.intensityLevels.set(level, data);
    });
  }

  _loadProcessingMethods() {
    // Import processing methods from your existing file
    try {
      // Note: In a browser environment, you'd need dynamic import or a different approach
      // For Node.js, this works but browser might need a different setup
      let processingInfluences;
      try {
        processingInfluences = require('../descriptors/ProcessingInfluences.js').processingInfluences;
      } catch (e) {
        // Mock simple data if file can't be loaded (useful for initial testing)
        processingInfluences = {
          'steamed': { description: 'Steaming process', category: 'heat/oxidation_stop', energeticTendency: 'cooling' },
          'pan-fired': { description: 'Pan-firing process', category: 'heat/oxidation_stop', energeticTendency: 'neutral' },
          'light-roast': { description: 'Light roasting', category: 'roast', energeticTendency: 'neutral-warming' },
          'medium-roast': { description: 'Medium roasting', category: 'roast', energeticTendency: 'warming' },
          'heavy-roast': { description: 'Heavy roasting', category: 'roast', energeticTendency: 'very warming' },
          'shade-grown': { description: 'Shade growing', category: 'growing', energeticTendency: 'cooling' }
        };
        this.warnings.push('Used mock processing influences data - file could not be loaded');
      }
      
      Object.entries(processingInfluences).forEach(([method, data]) => {
        this.processingMethods.set(method, data);
        
        // Add common variations as aliases
        if (method.includes('-')) {
          this.processingMethods.set(method.replace(/-/g, ' '), data);
        }
      });
    } catch (e) {
      this.warnings.push(`Could not load processing methods: ${e.message}`);
    }
  }

  _loadFlavorCategories() {
    // Main flavor categories
    const categories = [
      ['floral', { description: 'Floral aromas and flavors', examples: ['jasmine', 'rose', 'orchid', 'lilac'] }],
      ['fruity', { description: 'Fruit-like aromas and flavors', examples: ['apple', 'citrus', 'berry', 'peach'] }],
      ['vegetal', { description: 'Vegetable-like, grassy flavors', examples: ['grassy', 'leafy', 'spinach', 'artichoke'] }],
      ['nutty', { description: 'Nut-like flavors', examples: ['almond', 'hazelnut', 'walnut'] }],
      ['toasty', { description: 'Toast or grain-like flavors', examples: ['toast', 'grain', 'bread'] }],
      ['spicy', { description: 'Spice notes', examples: ['pepper', 'cinnamon', 'ginger'] }],
      ['sweet', { description: 'Sweet flavors', examples: ['honey', 'caramel', 'chocolate', 'malt'] }],
      ['earthy', { description: 'Earth, soil-like flavors', examples: ['soil', 'moss', 'mushroom', 'forest floor'] }],
      ['woody', { description: 'Wood-like flavors', examples: ['oak', 'cedar', 'pine'] }],
      ['roasted', { description: 'Roast-derived flavors', examples: ['smoky', 'coffee', 'charred', 'burnt'] }],
      ['umami', { description: 'Savory, broth-like flavors', examples: ['broth', 'marine', 'seaweed', 'meat'] }]
    ];
    
    categories.forEach(([category, data]) => {
      data.category = category; // Add the normalized category itself
      this.flavorCategories.set(category, data);
    });
    
    // Try to supplement with data from your existing files
    try {
      let flavorInfluences;
      try {
        flavorInfluences = require('../descriptors/FlavorInfluences.js').flavorInfluences;
      } catch (e) {
        this.warnings.push('Could not load flavor influences - continuing with basic data');
        return;
      }
      
      // More complete extraction would happen here if needed
    } catch (e) {
      this.warnings.push(`Error loading flavor categories: ${e.message}`);
    }
  }

  _loadSeasonalTerms() {
    // Standard seasonal terms
    const seasons = [
      ['spring', { value: 1, description: 'Spring season - renewal and freshness' }],
      ['early spring', { value: 0, description: 'Beginning of spring' }],
      ['late spring', { value: 2, description: 'End of spring, transition to summer' }],
      ['summer', { value: 4, description: 'Summer season - warmth and heat' }],
      ['early summer', { value: 3, description: 'Beginning of summer' }],
      ['late summer', { value: 5, description: 'End of summer, transition to autumn' }],
      ['autumn', { value: 7, description: 'Autumn/Fall season - cooling and harvest' }],
      ['early autumn', { value: 6, description: 'Beginning of autumn' }],
      ['late autumn', { value: 8, description: 'End of autumn, transition to winter' }],
      ['winter', { value: 10, description: 'Winter season - cold and dormancy' }],
      ['early winter', { value: 9, description: 'Beginning of winter' }],
      ['late winter', { value: 11, description: 'End of winter, transition to spring' }]
    ];
    
    seasons.forEach(([season, data]) => {
      data.season = season; // Add the normalized season itself
      this.seasonalTerms.set(season, data);
    });
  }

  _loadCompoundProfiles() {
    // Standard compound effect profiles
    const profiles = [
      ['intense & sharp', { description: 'High caffeine, low L-theanine', stimLevel: 5, relaxLevel: 1 }],
      ['focused & energized', { description: 'High caffeine, moderate L-theanine', stimLevel: 4, relaxLevel: 2 }],
      ['balanced & focused', { description: 'Medium caffeine, medium L-theanine', stimLevel: 3, relaxLevel: 3 }],
      ['smooth & sustained', { description: 'Medium caffeine, high L-theanine', stimLevel: 3, relaxLevel: 4 }],
      ['calm & clear', { description: 'Low caffeine, high L-theanine', stimLevel: 2, relaxLevel: 4 }],
      ['deeply calm', { description: 'Very low caffeine, high L-theanine', stimLevel: 1, relaxLevel: 5 }]
    ];
    
    profiles.forEach(([profile, data]) => {
      data.profile = profile; // Add the normalized profile itself
      this.compoundProfiles.set(profile, data);
      
      // Add without & for more flexible matching
      if (profile.includes(' & ')) {
        this.compoundProfiles.set(profile.replace(' & ', ' '), data);
      }
    });
  }

  _loadTeaTypes() {
    // Basic tea types
    const types = [
      ['green', { description: 'Unoxidized tea', processingCategory: 'unoxidized' }],
      ['white', { description: 'Minimally processed tea', processingCategory: 'unoxidized' }],
      ['yellow', { description: 'Lightly oxidized with smothering', processingCategory: 'lightly-oxidized' }],
      ['oolong', { description: 'Partially oxidized tea', processingCategory: 'partially-oxidized' }],
      ['black', { description: 'Fully oxidized tea', processingCategory: 'fully-oxidized' }],
      ['puerh', { description: 'Post-fermented tea', processingCategory: 'post-fermented' }],
      ['puerh-sheng', { description: 'Raw post-fermented tea', processingCategory: 'post-fermented' }],
      ['puerh-shou', { description: 'Ripe post-fermented tea', processingCategory: 'post-fermented' }]
    ];
    
    types.forEach(([type, data]) => {
      data.type = type; // Add the normalized type itself
      this.teaTypes.set(type, data);
    });
    
    // Try to enhance with more detailed tea type data
    try {
      let teaTypeDescriptors;
      try {
        teaTypeDescriptors = require('../descriptors/TeaTypeDescriptors.js').teaTypeDescriptors;
      } catch (e) {
        this.warnings.push('Could not load tea type descriptors - continuing with basic data');
        return;
      }
      
      // Add more detailed data from descriptors
      Object.entries(teaTypeDescriptors).forEach(([type, descriptor]) => {
        const existingData = this.teaTypes.get(type) || {};
        
        // Merge with existing data if present
        this.teaTypes.set(type, {
          ...existingData,
          ...descriptor.base,
          type // Ensure the normalized type is preserved
        });
        
        // Could also process subtypes here if needed
      });
    } catch (e) {
      this.warnings.push(`Error enhancing tea types: ${e.message}`);
    }
  }

  // Find the best matching term in a category
  findBestMatch(category, term) {
    if (!term) return null;
    if (!this[category]) return null;
    
    const normalizedTerm = this._normalizeKey(term);
    
    // Direct match
    const directMatch = this[category].get(normalizedTerm);
    if (directMatch) return directMatch;
    
    // Partial match
    for (const [key, value] of this[category].entries()) {
      if (key.includes(normalizedTerm) || normalizedTerm.includes(key)) {
        return value;
      }
    }
    
    return null;
  }

  // Generate documentation about the registry
  generateDocumentation() {
    const doc = {
      energyTerms: Array.from(this.energyTerms.entries())
        .map(([term, data]) => ({ term, value: data.value, description: data.description }))
        .sort((a, b) => a.value - b.value),
        
      intensityLevels: Array.from(this.intensityLevels.entries())
        .map(([level, data]) => ({ level, value: data.value, description: data.description }))
        .sort((a, b) => a.value - b.value),
        
      processingMethods: Array.from(this.processingMethods.entries())
        .map(([method, data]) => ({
          method,
          category: data.category,
          energeticTendency: data.energeticTendency,
          description: data.description
        }))
        .sort((a, b) => a.method.localeCompare(b.method)),
        
      flavorCategories: Array.from(this.flavorCategories.entries())
        .map(([category, data]) => ({
          category,
          description: data.description,
          examples: data.examples
        }))
        .sort((a, b) => a.category.localeCompare(b.category)),
        
      seasonalTerms: Array.from(this.seasonalTerms.entries())
        .map(([season, data]) => ({
          season,
          value: data.value,
          description: data.description
        }))
        .sort((a, b) => a.value - b.value),
        
      compoundProfiles: Array.from(this.compoundProfiles.entries())
        .filter(([profile]) => !profile.includes(' ') || profile.includes(' & ')) // Filter out duplicates
        .map(([profile, data]) => ({
          profile,
          description: data.description,
          stimLevel: data.stimLevel,
          relaxLevel: data.relaxLevel
        }))
        .sort((a, b) => a.profile.localeCompare(b.profile)),
        
      teaTypes: Array.from(this.teaTypes.entries())
        .map(([type, data]) => ({
          type,
          description: data.description,
          processingCategory: data.processingCategory
        }))
        .sort((a, b) => a.type.localeCompare(b.type)),
        
      warnings: this.warnings
    };
    
    return doc;
  }

  // Detect terminology mismatches across the system
  async detectTerminologyMismatches() {
    const mismatches = [];
    
    // Dynamically import modules for browser compatibility
    // Note: In a real implementation, you'd need to handle errors more gracefully
    // and potentially use different import methods depending on environment
    let imports = {};
    try {
      // In a browser environment, use dynamic import
      if (typeof window !== 'undefined') {
        const processingImport = await import('../descriptors/ProcessingInfluences.js');
        const teaTypeImport = await import('../descriptors/TeaTypeDescriptors.js');
        const flavorImport = await import('../descriptors/FlavorInfluences.js');
        const teaDbImport = await import('../data/TeaDatabase.js');
        
        imports.processingInfluences = processingImport.processingInfluences;
        imports.teaTypeDescriptors = teaTypeImport.teaTypeDescriptors;
        imports.flavorInfluences = flavorImport.flavorInfluences;
        imports.teaDatabase = teaDbImport.teaDatabase;
      } else {
        // In Node.js, use require
        imports.processingInfluences = require('../descriptors/ProcessingInfluences.js').processingInfluences;
        imports.teaTypeDescriptors = require('../descriptors/TeaTypeDescriptors.js').teaTypeDescriptors;
        imports.flavorInfluences = require('../descriptors/FlavorInfluences.js').flavorInfluences;
        imports.teaDatabase = require('../data/TeaDatabase.js').teaDatabase;
      }
    } catch (e) {
      // For demo purposes, provide basic mock data
      imports = this._getMockData();
      mismatches.push({
        type: 'warning',
        issue: `Using mock data for mismatch detection: ${e.message}`
      });
    }
    
    // 1. Check energy terms
    try {
      if (imports.processingInfluences && imports.teaTypeDescriptors) {
        // Collect energy terms from processing
        const processingEnergyTerms = new Set();
        Object.values(imports.processingInfluences).forEach(influence => {
          if (influence.energeticTendency) {
            processingEnergyTerms.add(this._normalizeKey(influence.energeticTendency));
          }
        });
        
        // Collect energy terms from tea types
        const teaTypeEnergyTerms = new Set();
        Object.values(imports.teaTypeDescriptors).forEach(descriptor => {
          if (descriptor.base?.seasonalTendency) {
            teaTypeEnergyTerms.add(this._normalizeKey(descriptor.base.seasonalTendency));
          }
        });
        
        // Check for mismatches
        processingEnergyTerms.forEach(term => {
          if (!this.energyTerms.has(term)) {
            mismatches.push({
              type: 'energy_term',
              source: 'ProcessingInfluences',
              term,
              issue: 'Energy term used in processing but not in standard registry'
            });
          }
        });
        
        teaTypeEnergyTerms.forEach(term => {
          if (!this.energyTerms.has(term)) {
            mismatches.push({
              type: 'energy_term',
              source: 'TeaTypeDescriptors',
              term,
              issue: 'Energy term used in tea type but not in standard registry'
            });
          }
          
          if (!processingEnergyTerms.has(term)) {
            mismatches.push({
              type: 'energy_term',
              source: 'TeaTypeDescriptors',
              term,
              issue: 'Energy term used in tea type but not in processing influences'
            });
          }
        });
      }
    } catch (e) {
      mismatches.push({
        type: 'error',
        source: 'energy_terms_check',
        issue: `Error checking energy terms: ${e.message}`
      });
    }
    
    // 2. Check processing methods
    try {
      if (imports.teaDatabase && imports.processingInfluences) {
        // Collect processing methods from tea database
        const databaseMethods = new Set();
        imports.teaDatabase.forEach(tea => {
          if (Array.isArray(tea.processingMethods)) {
            tea.processingMethods.forEach(method => {
              databaseMethods.add(this._normalizeKey(method));
            });
          }
        });
        
        // Check against processing influences
        databaseMethods.forEach(method => {
          // Check if method exists in registry
          const registryMatch = this.findBestMatch('processingMethods', method);
          const influencesMatch = Object.keys(imports.processingInfluences)
            .some(key => this._normalizeKey(key) === method || 
                 this._normalizeKey(key).replace(/-/g, ' ') === method ||
                 method.replace(/-/g, ' ') === this._normalizeKey(key));
          
          if (!registryMatch && !influencesMatch) {
            mismatches.push({
              type: 'processing_method',
              source: 'TeaDatabase',
              term: method,
              issue: 'Processing method used in database but not defined in processing influences'
            });
          }
        });
      }
    } catch (e) {
      mismatches.push({
        type: 'error',
        source: 'processing_methods_check',
        issue: `Error checking processing methods: ${e.message}`
      });
    }
    
    // Return all found mismatches
    return {
      mismatches,
      count: mismatches.length,
      summary: `Found ${mismatches.length} terminology mismatches`
    };
  }

  // Generate a diagram of flavor categories
  generateFlavorTaxonomyDiagram() {
    let diagram = 'graph TD\n';
    
    try {
      // Try to use actual flavor influences data
      let flavorInfluences;
      try {
        // In a browser, you'd need dynamic import or to pass the data
        flavorInfluences = require('../descriptors/FlavorInfluences.js').flavorInfluences;
      } catch (e) {
        // Use mock data from registry
        const flavorData = Array.from(this.flavorCategories.entries());
        flavorInfluences = {};
        
        // Create simple mock structure from registry data
        flavorData.forEach(([category, data]) => {
          flavorInfluences[category] = {};
          
          if (Array.isArray(data.examples)) {
            data.examples.forEach(example => {
              flavorInfluences[category][example] = {
                description: `${example} flavor`,
                associatedFlavors: [example]
              };
            });
          }
        });
      }
      
      // Add nodes for top-level categories
      Object.keys(flavorInfluences).forEach(category => {
        const categoryId = category.replace(/\s+/g, '_');
        diagram += `    ${categoryId}["${category}"]\n`;
        
        // Add subcategories if they exist
        if (typeof flavorInfluences[category] === 'object') {
          Object.keys(flavorInfluences[category]).forEach(subcategory => {
            if (subcategory !== '_categoryDefaults') {
              const subId = `${categoryId}_${subcategory}`.replace(/\s+/g, '_');
              diagram += `    ${subId}["${subcategory}"]\n`;
              diagram += `    ${categoryId} --> ${subId}\n`;
              
              // Add specific flavors if available
              const data = flavorInfluences[category][subcategory];
              if (data && Array.isArray(data.associatedFlavors)) {
                data.associatedFlavors.forEach(flavor => {
                  const flavorId = `${subId}_${flavor}`.replace(/\s+/g, '_');
                  diagram += `    ${flavorId}["${flavor}"]\n`;
                  diagram += `    ${subId} --> ${flavorId}\n`;
                });
              }
            }
          });
        }
      });
      
      return diagram;
    } catch (e) {
      return `graph TD\n    error["Error generating diagram: ${e.message}"]`;
    }
  }

  // Helper to create mock data for testing in environments where imports fail
  _getMockData() {
    return {
      processingInfluences: {
        'steamed': { energeticTendency: 'cooling', category: 'heat/oxidation_stop' },
        'pan-fired': { energeticTendency: 'neutral', category: 'heat/oxidation_stop' },
        'medium-roast': { energeticTendency: 'warming', category: 'roast' },
        'heavy-roast': { energeticTendency: 'very warming', category: 'roast' }
      },
      teaTypeDescriptors: {
        'green': { base: { seasonalTendency: 'cooling' } },
        'black': { base: { seasonalTendency: 'warming' } },
        'oolong': { base: { seasonalTendency: 'neutral' } }
      },
      flavorInfluences: {
        'floral': {
          'jasmine': { associatedFlavors: ['jasmine', 'floral'] }
        },
        'fruity': {
          'apple': { associatedFlavors: ['apple', 'fresh', 'crisp'] }
        }
      },
      teaDatabase: [
        { name: 'Test Green', type: 'green', processingMethods: ['steamed', 'pan-fired'] },
        { name: 'Test Black', type: 'black', processingMethods: ['oxidised', 'fully-oxidised'] }
      ]
    };
  }
}

// Create a singleton instance
const registry = new DescriptorRegistry().initialize();
export default registry;