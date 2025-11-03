# Implementation Roadmap: Independent Calculator Architecture

## Current State vs. Proposed State

### Current Architecture (Broken)
```
Tea Data
  ↓
CompoundService (calculates compounds)
  ↓
Multiple Matchers (ActivityMatcher, FoodMatcher, etc.)
  ↓
EffectService (attempted centralization)
  ↓
Result: Tight coupling, hard to test, easy to break
Status: ❌ FAILED (33% → 18.8% accuracy regression)
```

### Proposed Architecture (Clean)
```
Tea Data → TeaModel
  ↓
Independent Calculators (run in parallel):
  ├→ TimeCalculator (geography + compounds)
  ├→ ActivityCalculator (compounds + flavor)
  ├→ SeasonCalculator (geography + processing)
  ├→ BrewingCalculator (type + oxidation + roast)
  ├→ FoodPairingCalculator (flavor + compounds)
  ├→ PresentationCalculator (name + origin + flavor)
  └→ TeaPairingCalculator (flavor + compounds + all teas)
  ↓
TeaRecommendationAPI (orchestrator)
  ↓
Result: Zero coupling, easy to test, easy to improve
Status: ✓ PROPOSED (should reach 50%+ accuracy)
```

---

## Implementation Timeline

### Phase 1: Setup & Foundation (4-6 hours)
Create base structure and models that all calculators will use.

### Phase 2: Migrate Existing Calculators (6-8 hours)
Convert old matchers to new independent calculators.

### Phase 3: Add New Calculators (4-6 hours)
Create PresentationCalculator and TeaPairingCalculator (new features).

### Phase 4: Testing & Validation (4-6 hours)
Comprehensive testing and accuracy measurement.

---

## Phase 1: Setup & Foundation (START HERE)

### Step 1.1: Create Base Models

**File:** `src/models/TeaModel.js`

```javascript
/**
 * TeaModel - Standardized input for all calculators
 *
 * Purpose: Single source of truth for tea data
 * Used by: All calculators
 * No dependencies on: EffectService, other calculators
 */
export class TeaModel {
  constructor(rawData) {
    // Identity
    this.name = rawData.name || 'Unknown Tea';
    this.type = rawData.type || 'green';

    // Compound profile (calculated once, used by many)
    this.compounds = {
      caffeine: rawData.caffeine || 5,
      lTheanine: rawData.lTheanine || 5,
      ratio: (rawData.caffeine || 5) / (rawData.lTheanine || 5),
      catechins: rawData.catechins || 0,
      polyphenols: rawData.polyphenols || 0
    };

    // Flavor (primary driver for FoodMatcher)
    this.flavor = {
      primary: Array.isArray(rawData.flavor?.primary) ?
        rawData.flavor.primary : [],
      secondary: Array.isArray(rawData.flavor?.secondary) ?
        rawData.flavor.secondary : [],
      intensity: rawData.flavor?.intensity || 'moderate',
      aroma: Array.isArray(rawData.flavor?.aroma) ?
        rawData.flavor.aroma : []
    };

    // Geography (primary driver for TimeCalculator, SeasonCalculator)
    this.geography = {
      origin: rawData.origin || 'Unknown',
      altitude: rawData.altitude || 1000,
      latitude: rawData.latitude || 0,
      temperature: rawData.temperature || 15,
      humidity: rawData.humidity || 70,
      solarRadiation: rawData.solarRadiation || 150,
      harvestSeason: rawData.harvestSeason || 'Spring'
    };

    // Processing (primary driver for BrewingCalculator)
    this.processing = {
      oxidationLevel: rawData.oxidationLevel || 30,
      roastLevel: rawData.roastLevel || 'light',
      methods: Array.isArray(rawData.methods) ? rawData.methods : [],
      harvestTime: rawData.harvestTime || 'morning'
    };

    // Leaf characteristics (used by BrewingCalculator)
    this.leaf = {
      size: rawData.leafSize || 'medium',
      wholeness: rawData.wholeness || 80,
      fragmentation: rawData.fragmentation || 20
    };
  }

  // Validation
  isValid() {
    return this.name && this.type && this.compounds.caffeine >= 0;
  }

  // Helper: get compound profile label
  getCompoundProfile() {
    const ratio = this.compounds.ratio;
    const caffeine = this.compounds.caffeine;

    if (ratio > 2 && caffeine > 7) return 'Intense & Sharp';
    if (ratio > 1.5 && caffeine > 6) return 'Focused & Energized';
    if (ratio >= 0.7 && ratio <= 1.5) return 'Balanced';
    if (ratio < 0.7 && caffeine < 4) return 'Deeply Calm';
    return 'Balanced';
  }
}
```

**File:** `src/models/CalculatorResult.js`

```javascript
/**
 * CalculatorResult - Standardized output for all calculators
 *
 * Purpose: Consistent response format
 * Used by: All calculators
 * Returned to: TeaRecommendationAPI
 */
export class CalculatorResult {
  constructor(calculatorName, data = {}) {
    this.calculator = calculatorName;
    this.success = true;
    this.data = data;                    // Calculator-specific output
    this.confidence = 0.5;               // 0-1, how certain we are
    this.reasoning = '';                 // Why this recommendation
    this.timestamp = new Date();
    this.version = '1.0';
  }

  // Set confidence level
  setConfidence(confidence) {
    this.confidence = Math.max(0, Math.min(1, confidence));
    return this;
  }

  // Set reasoning
  setReasoning(reasoning) {
    this.reasoning = reasoning;
    return this;
  }

  // Mark as failed
  fail(error) {
    this.success = false;
    this.error = error;
    this.data = null;
    return this;
  }

  // Fluent API
  toJSON() {
    return {
      calculator: this.calculator,
      success: this.success,
      data: this.data,
      confidence: this.confidence,
      reasoning: this.reasoning,
      error: this.error || undefined
    };
  }
}
```

### Step 1.2: Create Calculator Base Class

**File:** `src/api/calculators/BaseCalculator.js`

```javascript
/**
 * BaseCalculator - Abstract base for all calculators
 *
 * Provides:
 * - Standard calculate() method signature
 * - Helper methods for common operations
 * - Consistent error handling
 */
export class BaseCalculator {

  constructor(name) {
    this.name = name;
  }

  /**
   * Main calculation method (implement in subclass)
   * @param {TeaModel} teaModel - The tea being analyzed
   * @returns {CalculatorResult}
   */
  calculate(teaModel) {
    throw new Error(`${this.name}.calculate() not implemented`);
  }

  // Helper: safely get nested property
  getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }
    return current;
  }

  // Helper: normalize string to lowercase
  normalize(str) {
    return (str || '').toLowerCase().trim();
  }

  // Helper: calculate similarity between strings (0-1)
  similarity(str1, str2) {
    const a = this.normalize(str1);
    const b = this.normalize(str2);

    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.8;

    // Levenshtein distance
    const matrix = Array(b.length + 1).fill(null)
      .map(() => Array(a.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        if (a[i - 1] === b[j - 1]) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = 1 + Math.min(
            matrix[j - 1][i],
            matrix[j][i - 1],
            matrix[j - 1][i - 1]
          );
        }
      }
    }

    const distance = matrix[b.length][a.length];
    return 1 - (distance / Math.max(a.length, b.length));
  }
}
```

### Step 1.3: Create Directory Structure

```bash
mkdir -p src/api/calculators
mkdir -p src/models
mkdir -p tests/calculators
```

---

## Phase 2: Migrate Existing Calculators

### Step 2.1: TimeCalculator (Migrate from TimeMatcher)

**File:** `src/api/calculators/TimeCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * TimeCalculator - Determines best time of day to drink tea
 *
 * Inputs: geography (altitude, temperature), compounds (caffeine)
 * Outputs: recommended times (Morning, Afternoon, Evening, Night)
 * Confidence: 0.8-0.95
 *
 * No dependencies: Runs independently
 */
export class TimeCalculator extends BaseCalculator {

  constructor() {
    super('TimeCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('TimeCalculator');

    try {
      const altitude = teaModel.geography.altitude;
      const caffeine = teaModel.compounds.caffeine;
      const temperature = teaModel.geography.temperature;

      let recommendedTimes = [];
      let confidence = 0.7;
      let reasoning = [];

      // High altitude (>1500m) = cooler origin = morning tea
      if (altitude > 1500) {
        recommendedTimes.push('Morning');
        confidence = Math.max(confidence, 0.95);
        reasoning.push(`High altitude (${altitude}m) suggests morning tea`);
      }

      // High caffeine (>7) = energizing = morning/afternoon
      if (caffeine > 7) {
        recommendedTimes.push('Morning');
        if (!recommendedTimes.includes('Afternoon')) {
          recommendedTimes.push('Afternoon');
        }
        confidence = Math.max(confidence, 0.9);
        reasoning.push(`High caffeine (${caffeine}mg) suitable for morning/afternoon`);
      }

      // Moderate caffeine (4-7) = flexible
      if (caffeine >= 4 && caffeine <= 7) {
        recommendedTimes.push('Morning');
        recommendedTimes.push('Afternoon');
        confidence = Math.max(confidence, 0.8);
        reasoning.push(`Moderate caffeine (${caffeine}mg) suitable for daytime`);
      }

      // Low caffeine (<4) = calming = evening friendly
      if (caffeine < 4) {
        recommendedTimes.push('Afternoon');
        recommendedTimes.push('Evening');
        confidence = Math.max(confidence, 0.9);
        reasoning.push(`Low caffeine (${caffeine}mg) suitable for afternoon/evening`);
      }

      // Remove duplicates
      recommendedTimes = [...new Set(recommendedTimes)];

      result.data = {
        recommendedTimes,
        reasoning: reasoning.join('; '),
        factors: {
          altitude,
          caffeine,
          temperature
        }
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`TimeCalculator error: ${error.message}`);
    }
  }
}
```

### Step 2.2: ActivityCalculator (Migrate from ActivityMatcher)

**File:** `src/api/calculators/ActivityCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * ActivityCalculator - Determines best activities for tea
 *
 * Inputs: compounds (caffeine, L-theanine ratio), flavor
 * Outputs: recommended activities
 * Confidence: 0.7-0.95
 *
 * No dependencies: Runs independently
 */
export class ActivityCalculator extends BaseCalculator {

  constructor() {
    super('ActivityCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('ActivityCalculator');

    try {
      const caffeine = teaModel.compounds.caffeine;
      const lTheanine = teaModel.compounds.lTheanine;
      const ratio = teaModel.compounds.ratio;
      const flavorProfile = teaModel.flavor.primary;

      let activities = [];
      let confidence = 0.7;
      let reasoning = [];

      // High stimulation (ratio > 2): Focus work
      if (ratio > 2) {
        activities.push('High-Focus Work', 'Morning Routines', 'Exercise');
        confidence = 0.95;
        reasoning.push(
          `High caffeine/L-theanine ratio (${ratio.toFixed(2)}) indicates stimulation`
        );
      }
      // Moderate stimulation (ratio 1-2): Balanced activities
      else if (ratio >= 1 && ratio <= 2) {
        activities.push('Work', 'Study', 'Creative Projects', 'Social Gatherings');
        confidence = 0.85;
        reasoning.push(
          `Balanced caffeine/L-theanine ratio (${ratio.toFixed(2)}) suggests diverse activities`
        );
      }
      // Low stimulation (ratio < 1): Relaxation
      else if (ratio < 1) {
        activities.push('Meditation', 'Yoga', 'Contemplation', 'Evening Wind-Down');
        confidence = 0.95;
        reasoning.push(
          `Low caffeine/L-theanine ratio (${ratio.toFixed(2)}) indicates relaxation`
        );
      }

      // Fruity/Floral flavors → Creative activities
      if (flavorProfile.includes('fruity') || flavorProfile.includes('floral')) {
        if (!activities.includes('Creative Projects')) {
          activities.push('Creative Projects', 'Journaling');
        }
        confidence = Math.max(confidence, 0.8);
        reasoning.push(`Fruity/floral flavors enhance creative activities`);
      }

      // Roasted flavors → Contemplative activities
      if (flavorProfile.includes('roasted') || flavorProfile.includes('woody')) {
        if (!activities.includes('Contemplation')) {
          activities.push('Contemplation', 'Reflection');
        }
        confidence = Math.max(confidence, 0.75);
        reasoning.push(`Roasted/woody flavors enhance contemplative activities`);
      }

      result.data = {
        recommendedActivities: [...new Set(activities)],
        profile: {
          caffeine,
          lTheanine,
          ratio: ratio.toFixed(2)
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`ActivityCalculator error: ${error.message}`);
    }
  }
}
```

### Step 2.3: SeasonCalculator (Migrate from SeasonMatcher)

**File:** `src/api/calculators/SeasonCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * SeasonCalculator - Determines best seasons for tea
 *
 * Inputs: geography (altitude, temperature), harvest season, processing
 * Outputs: recommended seasons
 * Confidence: 0.85-1.0
 *
 * No dependencies: Runs independently
 */
export class SeasonCalculator extends BaseCalculator {

  constructor() {
    super('SeasonCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('SeasonCalculator');

    try {
      const altitude = teaModel.geography.altitude;
      const temperature = teaModel.geography.temperature;
      const harvestSeason = this.normalize(teaModel.geography.harvestSeason);
      const roastLevel = this.normalize(teaModel.processing.roastLevel);

      let seasons = [];
      let confidence = 0.85;
      let reasoning = [];

      // Spring teas (high altitude, delicate) → Spring/Summer
      if (altitude > 1200 && roastLevel === 'light') {
        seasons.push('Spring', 'Summer');
        confidence = 0.98;
        reasoning.push('High-altitude delicate tea best in spring/summer');
      }
      // Summer teas → Summer/Autumn
      else if (harvestSeason.includes('summer')) {
        seasons.push('Summer', 'Autumn');
        confidence = 0.95;
        reasoning.push('Summer harvest ideal for summer/autumn drinking');
      }
      // Autumn teas (medium oxidation) → Autumn/Winter
      else if (harvestSeason.includes('autumn')) {
        seasons.push('Autumn', 'Winter');
        confidence = 0.95;
        reasoning.push('Autumn harvest pairs with autumn/winter');
      }
      // Dark/roasted teas → Winter
      else if (roastLevel === 'dark' || teaModel.processing.oxidationLevel > 80) {
        seasons.push('Winter');
        confidence = 0.95;
        reasoning.push('Dark roasted tea perfect for winter warming');
      }
      // Default: year-round
      else {
        seasons.push('Spring', 'Summer', 'Autumn', 'Winter');
        confidence = 0.9;
        reasoning.push('Balanced tea suitable year-round');
      }

      result.data = {
        recommendedSeasons: [...new Set(seasons)],
        factors: {
          altitude,
          temperature,
          harvestSeason,
          roastLevel
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`SeasonCalculator error: ${error.message}`);
    }
  }
}
```

### Step 2.4: BrewingCalculator (Migrate from brewingMatcher)

**File:** `src/api/calculators/BrewingCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * BrewingCalculator - Determines brewing parameters
 *
 * Inputs: type, oxidationLevel, roastLevel, leafSize, wholeness
 * Outputs: temperature, infusionTime, numberOfInfusions, vesselType
 * Confidence: 0.8-0.95
 *
 * No dependencies: Runs independently
 */
export class BrewingCalculator extends BaseCalculator {

  constructor() {
    super('BrewingCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('BrewingCalculator');

    try {
      const type = this.normalize(teaModel.type);
      const oxidation = teaModel.processing.oxidationLevel;
      const roastLevel = this.normalize(teaModel.processing.roastLevel);
      const leafSize = this.normalize(teaModel.leaf.size);
      const wholeness = teaModel.leaf.wholeness;

      let brewingParams = {
        temperature: 75,
        infusionTime: 3,
        numberOfInfusions: 5,
        vesselType: 'cup'
      };

      let confidence = 0.8;
      let reasoning = [];

      // Green teas: low temperature, short steep
      if (type === 'green') {
        brewingParams.temperature = 70;
        brewingParams.infusionTime = 2;
        brewingParams.numberOfInfusions = 3;
        confidence = 0.95;
        reasoning.push('Green tea: cooler water, shorter infusions');
      }
      // White teas: very low temperature
      else if (type === 'white') {
        brewingParams.temperature = 65;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 4;
        confidence = 0.95;
        reasoning.push('White tea: very cool water to preserve delicacy');
      }
      // Yellow teas: moderate
      else if (type === 'yellow') {
        brewingParams.temperature = 75;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 5;
        confidence = 0.9;
        reasoning.push('Yellow tea: moderate brewing parameters');
      }
      // Oolong: hot water, many infusions, gaiwan
      else if (type === 'oolong') {
        brewingParams.temperature = 95;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 7;
        brewingParams.vesselType = 'gaiwan';
        confidence = 0.95;
        reasoning.push('Oolong: hot water, gaiwan, multiple infusions');
      }
      // Dark/Black: hot water
      else if (type === 'dark' || type === 'black' || type === 'red') {
        brewingParams.temperature = 95;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 5;
        confidence = 0.9;
        reasoning.push('Dark/Black tea: hot water');
      }
      // Puerh: hot water, many infusions
      else if (type === 'puerh') {
        brewingParams.temperature = 95;
        brewingParams.infusionTime = 3;
        brewingParams.numberOfInfusions = 8;
        brewingParams.vesselType = 'gaiwan';
        confidence = 0.9;
        reasoning.push('Puerh: hot water, gaiwan, many infusions');
      }

      // Adjust for roast level
      if (roastLevel === 'dark') {
        brewingParams.temperature = Math.min(100, brewingParams.temperature + 5);
        reasoning.push(`Dark roast: +5°C temperature`);
      }

      // Adjust for broken/fragmented leaves
      if (wholeness < 50) {
        brewingParams.infusionTime = Math.max(1, brewingParams.infusionTime - 1);
        reasoning.push('Broken leaves: reduce steep time');
      }

      result.data = {
        ...brewingParams,
        factors: {
          type,
          oxidation,
          roastLevel,
          leafSize,
          wholeness
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`BrewingCalculator error: ${error.message}`);
    }
  }
}
```

### Step 2.5: FoodPairingCalculator (Migrate from FoodMatcher)

**File:** `src/api/calculators/FoodPairingCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * FoodPairingCalculator - Determines best food pairings
 *
 * Inputs: flavor profile, compounds (caffeine), type
 * Outputs: recommended foods
 * Confidence: 0.7-0.85
 *
 * No dependencies: Runs independently
 */
export class FoodPairingCalculator extends BaseCalculator {

  constructor() {
    super('FoodPairingCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('FoodPairingCalculator');

    try {
      const flavorProfile = teaModel.flavor.primary;
      const caffeine = teaModel.compounds.caffeine;
      const type = this.normalize(teaModel.type);
      const intensity = this.normalize(teaModel.flavor.intensity);

      let foods = [];
      let confidence = 0.7;
      let reasoning = [];

      // Light, delicate (white/green tea) → light foods
      if ((type === 'white' || type === 'green') && intensity === 'light') {
        foods.push('Pastries', 'Light Desserts', 'Fresh Fruit', 'Light Cheese');
        confidence = 0.85;
        reasoning.push('Light delicate tea pairs with subtle foods');
      }

      // Fruity flavors → fresh fruits, pastries
      if (flavorProfile.some(f => f.includes('fruit') || f.includes('citrus'))) {
        foods.push('Fresh Fruit', 'Citrus Desserts', 'Light Pastries');
        confidence = 0.8;
        reasoning.push('Fruity notes pair with fresh fruits and citrus desserts');
      }

      // Floral flavors → sweet desserts
      if (flavorProfile.some(f => f.includes('floral') || f.includes('orchid'))) {
        foods.push('Pastries', 'Light Desserts', 'Cream Puffs');
        confidence = 0.8;
        reasoning.push('Floral notes pair with delicate desserts');
      }

      // Roasted/woody → chocolate, nuts
      if (flavorProfile.some(f => f.includes('roast') || f.includes('woody'))) {
        foods.push('Dark Chocolate', 'Nuts', 'Aged Cheese');
        confidence = 0.8;
        reasoning.push('Roasted notes pair with chocolate and nuts');
      }

      // Earthy/mineral → cheese, bread
      if (flavorProfile.some(f => f.includes('earth') || f.includes('mineral'))) {
        foods.push('Cheese', 'Bread', 'Root Vegetables');
        confidence = 0.75;
        reasoning.push('Earthy notes pair with cheese and whole grains');
      }

      // High caffeine → light foods
      if (caffeine > 7) {
        if (!foods.includes('Light Meals')) foods.push('Light Meals');
        reasoning.push(`High caffeine (${caffeine}mg) pairs with light foods`);
      }

      // Low caffeine → anytime foods
      if (caffeine < 3) {
        foods.push('Rich Desserts', 'Chocolate', 'Creamy Foods');
        reasoning.push(`Low caffeine (${caffeine}mg) good with richer foods`);
      }

      result.data = {
        recommendedFoods: [...new Set(foods)],
        profile: {
          flavorProfile,
          caffeine,
          intensity
        },
        reasoning: reasoning.join('; ')
      };

      result.setConfidence(confidence);
      result.setReasoning(reasoning.join('; '));

      return result;
    } catch (error) {
      return result.fail(`FoodPairingCalculator error: ${error.message}`);
    }
  }
}
```

---

## Phase 3: Add New Calculators

### Step 3.1: PresentationCalculator (NEW)

**File:** `src/api/calculators/PresentationCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * PresentationCalculator - Generates tea description and marketing copy
 *
 * Inputs: name, origin, flavor, altitude, type
 * Outputs: description, marketing highlights
 * Confidence: 0.85-0.95
 *
 * No dependencies: Runs independently
 */
export class PresentationCalculator extends BaseCalculator {

  constructor() {
    super('PresentationCalculator');
  }

  calculate(teaModel) {
    const result = new CalculatorResult('PresentationCalculator');

    try {
      const name = teaModel.name;
      const origin = teaModel.geography.origin;
      const flavorProfile = teaModel.flavor.primary.join(', ');
      const altitude = teaModel.geography.altitude;
      const type = this.normalize(teaModel.type);

      let description = '';
      let highlights = [];

      // Build description
      description = `${name}`;

      if (origin !== 'Unknown') {
        description += ` from ${origin}`;
      }

      description += ` is a ${type} tea`;

      if (altitude > 1500) {
        description += ` grown at high altitude (${altitude}m), `;
        description += 'producing delicate and complex flavors.';
        highlights.push(`High-altitude (${altitude}m) - Premium quality`);
      } else if (altitude > 1000) {
        description += ` grown at moderate altitude (${altitude}m), `;
        description += 'offering balanced characteristics.';
        highlights.push(`Mid-altitude (${altitude}m) - Good balance`);
      } else {
        description += ` from lower elevations, `;
        description += 'with bold and robust character.';
        highlights.push('Low-altitude - Bold character');
      }

      if (flavorProfile) {
        description += ` Featuring notes of ${flavorProfile}.`;
        highlights.push(`Flavor: ${flavorProfile}`);
      }

      // Add key characteristics
      highlights.push(`Type: ${type.charAt(0).toUpperCase() + type.slice(1)} Tea`);

      result.data = {
        name,
        description,
        highlights,
        shortDescription: description.substring(0, 100) + '...',
        marketingCopy: description
      };

      result.setConfidence(0.9);
      result.setReasoning('Generated from tea metadata');

      return result;
    } catch (error) {
      return result.fail(`PresentationCalculator error: ${error.message}`);
    }
  }
}
```

### Step 3.2: TeaPairingCalculator (NEW)

**File:** `src/api/calculators/TeaPairingCalculator.js`

```javascript
import { BaseCalculator } from './BaseCalculator.js';
import { CalculatorResult } from '../models/CalculatorResult.js';

/**
 * TeaPairingCalculator - Finds teas that pair well together
 *
 * Inputs: current tea model, array of all teas
 * Outputs: compatible tea pairings
 * Confidence: 0.7-0.85
 *
 * No dependencies: Runs independently
 */
export class TeaPairingCalculator extends BaseCalculator {

  constructor() {
    super('TeaPairingCalculator');
  }

  calculate(teaModel, allTeas = []) {
    const result = new CalculatorResult('TeaPairingCalculator');

    try {
      if (!allTeas || allTeas.length === 0) {
        result.data = {
          compatibleTeas: [],
          count: 0,
          note: 'No other teas available for comparison'
        };
        result.setConfidence(0.5);
        return result;
      }

      const myFlavorProfile = teaModel.flavor.primary;
      const myCaffeine = teaModel.compounds.caffeine;
      const myType = this.normalize(teaModel.type);

      let scores = [];

      allTeas.forEach(other => {
        if (!other || other.name === teaModel.name) return;

        // Score based on flavor compatibility
        let flavorScore = 0;
        const otherFlavor = other.flavor?.primary || [];

        const commonFlavors = myFlavorProfile.filter(f =>
          otherFlavor.some(of => this.similarity(f, of) > 0.7)
        );

        if (commonFlavors.length > 0) {
          flavorScore = 0.5; // Same flavor family
        }

        // Score based on caffeine balance (different = better pairing)
        const caffeineBalance = Math.abs(other.compounds?.caffeine || 5 - myCaffeine);
        const caffeineScore = caffeineBalance > 2 ? 0.3 : 0.1;

        // Score based on type diversity
        const otherType = this.normalize(other.type || '');
        const typeDiversity = otherType !== myType ? 0.2 : 0;

        const totalScore = flavorScore + caffeineScore + typeDiversity;

        if (totalScore > 0) {
          scores.push({
            name: other.name || 'Unknown',
            score: totalScore,
            reasons: [
              commonFlavors.length > 0 ? 'Similar flavor profile' : null,
              caffeineBalance > 2 ? 'Complimentary caffeine levels' : null,
              typeDiversity > 0 ? 'Different tea type' : null
            ].filter(r => r !== null)
          });
        }
      });

      // Sort by score, return top 3
      const compatibleTeas = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      result.data = {
        compatibleTeas,
        count: compatibleTeas.length,
        note: `Found ${compatibleTeas.length} compatible teas`
      };

      result.setConfidence(0.75);
      result.setReasoning('Based on flavor profile and caffeine balance');

      return result;
    } catch (error) {
      return result.fail(`TeaPairingCalculator error: ${error.message}`);
    }
  }
}
```

---

## Phase 4: Create Orchestrator API

**File:** `src/api/TeaRecommendationAPI.js`

```javascript
import { TimeCalculator } from './calculators/TimeCalculator.js';
import { ActivityCalculator } from './calculators/ActivityCalculator.js';
import { SeasonCalculator } from './calculators/SeasonCalculator.js';
import { BrewingCalculator } from './calculators/BrewingCalculator.js';
import { FoodPairingCalculator } from './calculators/FoodPairingCalculator.js';
import { PresentationCalculator } from './calculators/PresentationCalculator.js';
import { TeaPairingCalculator } from './calculators/TeaPairingCalculator.js';

/**
 * TeaRecommendationAPI - Main orchestrator
 *
 * Purpose: Run all independent calculators in parallel
 * Returns: Comprehensive recommendation object
 *
 * Architecture:
 * - Each calculator is independent
 * - No dependencies between calculators
 * - Easy to test each calculator in isolation
 * - Easy to improve any calculator without affecting others
 * - Easy to add new calculators
 */
export class TeaRecommendationAPI {

  constructor() {
    this.calculators = {
      time: new TimeCalculator(),
      activity: new ActivityCalculator(),
      season: new SeasonCalculator(),
      brewing: new BrewingCalculator(),
      food: new FoodPairingCalculator(),
      presentation: new PresentationCalculator(),
      teaPairing: new TeaPairingCalculator()
    };
  }

  /**
   * Analyze a tea and return all recommendations
   *
   * @param {TeaModel} teaModel - The tea to analyze
   * @param {Array<TeaModel>} allTeas - All available teas (for TeaPairingCalculator)
   * @returns {Object} - Comprehensive recommendation object
   */
  analyze(teaModel, allTeas = []) {
    // Run all calculators in parallel (can be Promise.all for async)
    const results = {
      tea: {
        name: teaModel.name,
        type: teaModel.type
      },
      recommendations: {
        time: this.calculators.time.calculate(teaModel),
        activity: this.calculators.activity.calculate(teaModel),
        season: this.calculators.season.calculate(teaModel),
        brewing: this.calculators.brewing.calculate(teaModel),
        food: this.calculators.food.calculate(teaModel),
        presentation: this.calculators.presentation.calculate(teaModel),
        teaPairing: this.calculators.teaPairing.calculate(teaModel, allTeas)
      },
      timestamp: new Date(),
      version: '2.0'
    };

    return results;
  }
}
```

---

## Phase 5: Testing Structure

**File:** `tests/calculators/TimeCalculator.test.js` (Example)

```javascript
import { TimeCalculator } from '../../src/api/calculators/TimeCalculator.js';
import { TeaModel } from '../../src/models/TeaModel.js';

describe('TimeCalculator', () => {

  let calculator;

  beforeEach(() => {
    calculator = new TimeCalculator();
  });

  test('high caffeine tea should recommend morning', () => {
    const teaData = {
      name: 'Test Tea',
      type: 'green',
      caffeine: 8,
      lTheanine: 5,
      altitude: 1000,
      temperature: 15
    };

    const tea = new TeaModel(teaData);
    const result = calculator.calculate(tea);

    expect(result.success).toBe(true);
    expect(result.data.recommendedTimes).toContain('Morning');
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  test('low caffeine tea should recommend evening', () => {
    const teaData = {
      name: 'Test Tea',
      type: 'white',
      caffeine: 2,
      lTheanine: 5,
      altitude: 800,
      temperature: 20
    };

    const tea = new TeaModel(teaData);
    const result = calculator.calculate(tea);

    expect(result.success).toBe(true);
    expect(result.data.recommendedTimes).toContain('Evening');
  });

  test('high altitude tea should recommend morning', () => {
    const teaData = {
      name: 'Test Tea',
      type: 'green',
      caffeine: 5,
      lTheanine: 5,
      altitude: 1600,
      temperature: 10
    };

    const tea = new TeaModel(teaData);
    const result = calculator.calculate(tea);

    expect(result.success).toBe(true);
    expect(result.data.recommendedTimes).toContain('Morning');
  });
});
```

---

## Next Immediate Steps

### TODAY (4-6 hours):
```bash
1. [ ] Create src/models/TeaModel.js
2. [ ] Create src/models/CalculatorResult.js
3. [ ] Create src/api/calculators/BaseCalculator.js
4. [ ] Create directory structure
5. [ ] Run tests on base classes
```

### TOMORROW (6-8 hours):
```bash
6. [ ] Create TimeCalculator
7. [ ] Create ActivityCalculator
8. [ ] Create SeasonCalculator
9. [ ] Create BrewingCalculator
10. [ ] Create FoodPairingCalculator
11. [ ] Test each calculator independently
```

### DAY 3 (4-6 hours):
```bash
12. [ ] Create PresentationCalculator
13. [ ] Create TeaPairingCalculator
14. [ ] Create TeaRecommendationAPI orchestrator
15. [ ] Integration testing
```

### DAY 4 (4-6 hours):
```bash
16. [ ] Comprehensive test suite
17. [ ] Validation against test dataset
18. [ ] Accuracy measurement
19. [ ] Documentation
```

---

## Success Criteria

✓ Each calculator is completely independent
✓ Each calculator has own test file
✓ No shared state between calculators
✓ Easy to modify any calculator without breaking others
✓ New calculators (PresentationCalculator, TeaPairingCalculator) work
✓ Accuracy metrics: Target 50%+ mood accuracy (up from 33.3%)
✓ All tests pass
✓ Code committed regularly

---

## Key Differences from Old Architecture

| Aspect | Old (Failed) | New (Proposed) |
|--------|------------|----------------|
| **Coupling** | EffectService dependency | Zero dependencies |
| **TeaModel** | Multiple formats passed | Single standardized format |
| **Output** | Custom per matcher | CalculatorResult standard |
| **Testing** | Difficult, cascading failures | Easy, isolated tests |
| **Adding Feature** | Refactor whole system | Add new calculator |
| **Debugging** | Hard to isolate issues | Easy to find root cause |

This is the approach that should have been taken from day one.

