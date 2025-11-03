# Taxonomy Architecture - Reflection & Design

## Current State Analysis

### What You Already Have (Excellent Foundation!)

You have **5 well-structured descriptor files** in `/js/descriptors/`:

1. **FlavorInfluences.js**
   - Structure: `{ floral: { jasmine: { foodPairingHints, seasonalAffinityHints, activityHints, associatedFlavors } } }`
   - Problem: Referenced inconsistently across inferrers

2. **TeaTypeDescriptors.js**
   - Structure: `{ green: { base: {...}, subTypes: { matcha: {...} } } }`
   - Problem: Not used by inferrers/renderers yet

3. **ProcessingInfluences.js**
   - Structure: `{ steamed: { description, category, flavorImpact, mouthFeel, energeticTendency, ... } }`
   - Problem: Hardcoded processing methods scattered across codebase

4. **SeasonalFactors.js**
   - Structure: `{ seasonalDescriptions, seasonalProfiles }`
   - Problem: Season names must match exactly or lookups fail

5. **GeographicalDescriptors.js**
   - Structure: `{ elevationLevels, latitudeZones, humidityLevels }`
   - Problem: Complex nested lookups, no normalization

### The Growing Problem (You Identified Correctly!)

**Consistency Debt** - Multiple points of failure:

```javascript
// Problem 1: Hardcoded activity names in ActivityRenderer
const activityClusters = [
  { theme: "Mindfulness & Relaxation", activities: ["Meditation", "Yoga", ...] }
];

// Problem 2: Hardcoded food categories in FoodRenderer
const foodCategories = {
  desserts: { foods: ["Light Desserts", "Pastries", ...] }
};

// Problem 3: Hardcoded flavor categories in FoodRenderer
const flavorPairingStrengths = {
  Floral: { strength: "high", pairedWith: [...] }
};

// Result: Change "Floral" → "Floral Notes" in ONE place
// → Breaks inferrers, renderers, validation everywhere
```

---

## Proposed Solution: Unified Taxonomy System

### Architecture

```
src/
├── taxonomies/                          ← SINGLE SOURCE OF TRUTH
│   ├── index.js                         ← Central Registry (queries all taxonomies)
│   ├── flavors.js                       ← Flavors, categories, hints (from FlavorInfluences.js)
│   ├── teaTypes.js                      ← Tea types (from TeaTypeDescriptors.js)
│   ├── activities.js                    ← Activities, clusters (extracted from ActivityRenderer)
│   ├── foods.js                         ← Foods, categories, cuisines (extracted from FoodRenderer)
│   ├── processing.js                    ← Processing methods (from ProcessingInfluences.js)
│   ├── seasons.js                       ← Seasons, temporal (from SeasonalFactors.js)
│   ├── geography.js                     ← Elevation, latitude, humidity (from GeographicalDescriptors.js)
│   └── validators.js                    ← Consistency checks, cross-taxonomy validation
│
├── processors/
│   ├── inferrers/
│   │   ├── CompoundInferrer.js         ← Uses: taxonomies.compounds
│   │   ├── FlavorInferrer.js           ← Uses: taxonomies.flavors
│   │   ├── ProcessingInferrer.js       ← Uses: taxonomies.processing
│   │   ├── GeographyInferrer.js        ← Uses: taxonomies.geography
│   │   └── ActivityInferrer.js         ← Uses: taxonomies.activities
│   │
│   └── renderers/
│       ├── ActivityRenderer.js         ← Uses: taxonomies.activities
│       ├── FoodRenderer.js             ← Uses: taxonomies.foods, taxonomies.flavors
│       ├── TimeRenderer.js             ← Uses: taxonomies.seasons
│       ├── SeasonRenderer.js           ← Uses: taxonomies.seasons
│       └── BrewingRenderer.js          ← Uses: taxonomies.processing
│
└── utils/
    └── TaxonomyCache.js                 ← Performance optimization (lazy loading)
```

---

## Implementation Strategy

### Phase 1: Taxonomy Files (Consolidation)

Each taxonomy file follows this pattern:

```javascript
// taxonomies/flavors.js
export class FlavorTaxonomy {
  // Immutable taxonomy data
  static CATEGORIES = { /* from FlavorInfluences.js */ };
  static FLAVORS = { /* from FlavorInfluences.js */ };

  // Lookup methods (normalize inputs)
  static getFlavor(query) { /* search by ID, name, alias */ }
  static getCategory(query) { /* search by ID, name */ }
  static getFlavorsInCategory(categoryId) { ... }

  // Validation
  static validateFlavor(query) { /* throws if not found */ }
}

// taxonomies/activities.js
export class ActivityTaxonomy {
  static CATEGORIES = { /* activity clusters */ };
  static ACTIVITIES = { /* individual activities */ };
  static getActivity(query) { ... }
  static getCluster(query) { ... }
}

// taxonomies/foods.js
export class FoodTaxonomy {
  static CUISINES = { ... };
  static FOOD_CATEGORIES = { ... };
  static FOODS = { ... };
  static getFood(query) { ... }
  static getCuisine(query) { ... }
}

// ...and so on for each domain
```

### Phase 2: Central Registry

```javascript
// taxonomies/index.js
import { FlavorTaxonomy } from './flavors.js';
import { ActivityTaxonomy } from './activities.js';
import { FoodTaxonomy } from './foods.js';
// ...

export class TaxonomyRegistry {
  // Provide single access point
  static flavors = FlavorTaxonomy;
  static activities = ActivityTaxonomy;
  static foods = FoodTaxonomy;
  static processing = ProcessingTaxonomy;
  static seasons = SeasonTaxonomy;
  static geography = GeographyTaxonomy;
  static teaTypes = TeaTypeTaxonomy;

  /**
   * Safe lookup with normalization
   * Returns matched item or throws helpful error
   */
  static lookup(domain, query) {
    const taxonomy = this[domain];
    if (!taxonomy) throw new Error(`Unknown domain: ${domain}`);

    const result = taxonomy.get(query);
    if (!result) {
      throw new Error(
        `Unknown ${domain} value: "${query}". ` +
        `Valid values: ${taxonomy.listAll().join(', ')}`
      );
    }
    return result;
  }

  /**
   * Validate cross-taxonomy consistency
   * E.g., ensure all activity hints reference valid activities
   */
  static validateConsistency() {
    const issues = [];

    // Check: All flavor hints reference valid activities
    FlavorTaxonomy.FLAVORS.forEach((flavor, flavorId) => {
      flavor.activityHints?.forEach(activityHint => {
        if (!ActivityTaxonomy.getActivity(activityHint)) {
          issues.push(
            `Flavor "${flavorId}" references unknown activity: "${activityHint}"`
          );
        }
      });
    });

    // Check: All food hints reference valid foods
    // ... similar checks

    return issues; // Empty if consistent, array of errors if not
  }
}

export const registry = new TaxonomyRegistry();
```

### Phase 3: Inferrer/Renderer Migration

**Before (Hardcoded):**
```javascript
// activityRenderer.js
const activityClusters = [
  { theme: "Mindfulness & Relaxation", activities: ["Meditation", "Yoga", ...] },
  { theme: "Focus & Productivity", activities: ["Work", "Study", ...] }
];
```

**After (Using Registry):**
```javascript
// activityRenderer.js
import { registry } from '../../taxonomies/index.js';

class ActivityRenderer {
  render(compoundInference) {
    const activityClusters = registry.activities.getAllClusters();
    const allActivities = registry.activities.getAllActivities();

    // Now uses taxonomies - automatically updates when taxonomy changes
    // ...
  }
}
```

---

## Key Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Single Source of Truth** | Scattered across 5+ files | One taxonomy per domain |
| **Hardcoded Values** | "Floral" appears 10+ places | Referenced from taxonomy |
| **Adding New Flavor** | Update 3+ files, risk typos | Update 1 file, auto-propagates |
| **Validation** | Silent failures | `registry.validateConsistency()` catches issues |
| **Admin Form** | Manual dropdown creation | `registry.flavors.listAll()` |
| **Testing** | Test each layer separately | Test taxonomy consistency once |
| **Documentation** | Scattered comments | Each taxonomy is self-documenting |
| **Refactoring** | High risk (changes everywhere) | Safe (changes in one place) |

---

## Cross-Taxonomy Consistency Examples

### Example 1: Activity Hints in Flavors
```javascript
// Current issue:
flavor.activityHints: ["Relaxation", "Social"]  // String values, no validation

// Solution:
flavor.activityHints: ["ACTIVITY_RELAXATION", "ACTIVITY_SOCIAL"]  // IDs from ActivityTaxonomy

// Validation:
registry.validateConsistency() → Error if "ACTIVITY_SOCIAL" doesn't exist
```

### Example 2: Food Pairings in Flavors
```javascript
// Current issue:
flavor.foodPairingHints: ["Light Desserts", "Rice Dishes"]  // Strings, inconsistent

// Solution:
flavor.foodPairingHints: ["FOOD_LIGHT_DESSERTS", "FOOD_RICE_DISHES"]  // IDs

// Validation:
registry.validateConsistency() → Error if "FOOD_RICE_DISHES" not in FoodTaxonomy
```

### Example 3: Season References
```javascript
// Current issue:
flavor.seasonalAffinityHints: ["Spring", "Summer"]  // Spelling-dependent

// Solution:
flavor.seasonalAffinityHints: ["SEASON_SPRING", "SEASON_SUMMER"]  // IDs

// Validation:
registry.validateConsistency() → Error if season IDs invalid
```

---

## Implementation Roadmap

### Step 1: Create Taxonomy Classes
- [ ] `taxonomies/flavors.js` - Migrate from FlavorInfluences.js
- [ ] `taxonomies/activities.js` - Extract from ActivityRenderer
- [ ] `taxonomies/foods.js` - Extract from FoodRenderer
- [ ] `taxonomies/processing.js` - Migrate from ProcessingInfluences.js
- [ ] `taxonomies/seasons.js` - Migrate from SeasonalFactors.js
- [ ] `taxonomies/geography.js` - Migrate from GeographicalDescriptors.js
- [ ] `taxonomies/teaTypes.js` - Migrate from TeaTypeDescriptors.js

### Step 2: Create Registry
- [ ] `taxonomies/index.js` - Central registry with lookup methods
- [ ] `taxonomies/validators.js` - Cross-taxonomy validation
- [ ] Test registry with all existing data

### Step 3: Migrate Inferrers/Renderers
- [ ] Update CompoundInferrer to use registry
- [ ] Update FlavorInferrer to use registry
- [ ] Update ActivityRenderer to use registry
- [ ] Update FoodRenderer to use registry
- [ ] Create ProcessingInferrer using registry
- [ ] Create TimeRenderer using registry

### Step 4: Add Consistency Checks
- [ ] CI/CD hook to validate taxonomy consistency on commit
- [ ] Admin form auto-populates from registry
- [ ] Error messages guide users to valid values

---

## Questions & Decisions Needed

1. **ID Strategy**: Use uppercase with underscores ("FLAVOR_JASMINE") or camelCase ("flavorJasmine")?
   - Recommendation: Uppercase with underscores (more conventional for constants)

2. **Display Names**: Keep human-readable names separate from IDs?
   - Recommendation: Yes, `{ id: "FLAVOR_JASMINE", displayName: "Jasmine", aliases: ["jasmine flower"] }`

3. **Aliases**: Should lookups support fuzzy matching?
   - Recommendation: Exact match + alias support (case-insensitive)

4. **Performance**: Cache registry in memory or lazy-load?
   - Recommendation: Lazy-load on first access, cache in memory

5. **Admin Form**: Generate from taxonomy dynamically?
   - Recommendation: Yes, use `registry.flavors.listAll()` for dropdowns

---

## Success Criteria

✅ No hardcoded values in inferrers/renderers
✅ All taxonomy references use registry
✅ `registry.validateConsistency()` returns empty array
✅ Adding new flavor → works everywhere automatically
✅ Changing "Floral" name → updates everywhere
✅ Admin form auto-updates when taxonomy changes
✅ Clear error messages when invalid references used

---

## Next Steps

1. **Decide on naming conventions** (IDs, display names, aliases)
2. **Start with Phase 1**: Create `taxonomies/flavors.js` as proof of concept
3. **Build registry** and test with existing code
4. **Migrate inferrers/renderers** one by one
5. **Add validation** and CI/CD checks
