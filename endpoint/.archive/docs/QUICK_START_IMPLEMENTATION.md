# Quick Start: Implementation Commands

## What You're Building

```
OLD ARCHITECTURE (Failed)          NEW ARCHITECTURE (Proposed)
─────────────────────────          ──────────────────────────
ActivityMatcher                    ActivityCalculator
  ├─ depends on Effects              (independent)
  ├─ mixed input formats
  └─ hard to test              FoodPairingCalculator
                                 (independent)
FoodMatcher
  ├─ depends on Effects        TimeCalculator
  ├─ mixed input formats         (independent)
  └─ hard to test
                               SeasonCalculator
TimeMatcher                      (independent)
  └─ somewhat independent
                               BrewingCalculator
SeasonMatcher                    (independent)
  └─ independent
                               PresentationCalculator
brewingMatcher                   (independent - NEW)
  └─ independent
                               TeaPairingCalculator
EffectService                    (independent - NEW)
  └─ broken central dependency
                               All run via TeaRecommendationAPI
                               (orchestrator, no logic)
```

---

## Phase 1: Foundation (4-6 hours) ← START HERE

### Step 1: Create Directory Structure

```bash
cd /home/msieur-gab/propertea/endpoint

# Create new directories
mkdir -p src/api/calculators
mkdir -p src/models
mkdir -p tests/calculators

# Verify structure
ls -la src/
ls -la src/api/
ls -la src/models/
```

### Step 2: Create TeaModel.js

**File to create:** `src/models/TeaModel.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 1 → Step 1.2 → First code block

**Why:** Standardized input format for all calculators

**Test it:**
```bash
# Quick validation
node -e "
import('./src/models/TeaModel.js').then(m => {
  const TeaModel = m.TeaModel;
  const tea = new TeaModel({
    name: 'Dragon Well',
    type: 'green',
    caffeine: 8,
    lTheanine: 5
  });
  console.log('✓ TeaModel works');
  console.log('  Name:', tea.name);
  console.log('  Ratio:', tea.compounds.ratio);
  console.log('  Profile:', tea.getCompoundProfile());
});
"
```

### Step 3: Create CalculatorResult.js

**File to create:** `src/models/CalculatorResult.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 1 → Step 1.2 → Second code block

**Why:** Standardized output format for all calculators

**Test it:**
```bash
node -e "
import('./src/models/CalculatorResult.js').then(m => {
  const CalculatorResult = m.CalculatorResult;
  const result = new CalculatorResult('Test')
    .setConfidence(0.9)
    .setReasoning('test reasoning');
  console.log('✓ CalculatorResult works');
  console.log('  Success:', result.success);
  console.log('  Confidence:', result.confidence);
});
"
```

### Step 4: Create BaseCalculator.js

**File to create:** `src/api/calculators/BaseCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 1 → Step 1.3

**Why:** Common functionality for all calculators

**Test it:**
```bash
node -e "
import('./src/api/calculators/BaseCalculator.js').then(m => {
  const BaseCalculator = m.BaseCalculator;
  const calc = new BaseCalculator('test');
  console.log('✓ BaseCalculator works');
  console.log('  Normalize test:', calc.normalize('  HELLO  '));
  console.log('  Similarity:', calc.similarity('coffee', 'tea'));
});
"
```

**✅ Phase 1 Complete!** All calculators now have standard input/output

---

## Phase 2: Migrate Existing Calculators (6-8 hours)

Now convert old matchers to new independent calculators.

### Step 5: Create TimeCalculator

**File to create:** `src/api/calculators/TimeCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 2 → Step 2.1

**Why:** When to drink the tea (uses geography + caffeine)

**Test it:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/TimeCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const TimeCalculator = m2.TimeCalculator;

    const tea = new TeaModel({
      name: 'Dragon Well',
      type: 'green',
      caffeine: 8,
      altitude: 1200,
      temperature: 15
    });

    const calc = new TimeCalculator();
    const result = calc.calculate(tea);

    console.log('✓ TimeCalculator works');
    console.log('  Times:', result.data.recommendedTimes);
    console.log('  Confidence:', result.confidence);
  });
});
"
```

### Step 6: Create ActivityCalculator

**File to create:** `src/api/calculators/ActivityCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 2 → Step 2.2

**Why:** What activities pair with the tea (uses caffeine/L-theanine ratio + flavor)

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/ActivityCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const ActivityCalculator = m2.ActivityCalculator;

    const tea = new TeaModel({
      name: 'Silver Needle',
      type: 'white',
      caffeine: 2,
      lTheanine: 5,
      flavor: { primary: ['floral'] }
    });

    const calc = new ActivityCalculator();
    const result = calc.calculate(tea);

    console.log('✓ ActivityCalculator works');
    console.log('  Activities:', result.data.recommendedActivities);
    console.log('  Ratio:', result.data.profile.ratio);
  });
});
"
```

### Step 7: Create SeasonCalculator

**File to create:** `src/api/calculators/SeasonCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 2 → Step 2.3

**Why:** Best seasons to drink (uses altitude + harvest season + roast)

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/SeasonCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const SeasonCalculator = m2.SeasonCalculator;

    const tea = new TeaModel({
      name: 'Dragon Well',
      type: 'green',
      caffeine: 8,
      altitude: 1200,
      harvestSeason: 'Spring',
      roastLevel: 'light'
    });

    const calc = new SeasonCalculator();
    const result = calc.calculate(tea);

    console.log('✓ SeasonCalculator works');
    console.log('  Seasons:', result.data.recommendedSeasons);
    console.log('  Confidence:', result.confidence);
  });
});
"
```

### Step 8: Create BrewingCalculator

**File to create:** `src/api/calculators/BrewingCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 2 → Step 2.4

**Why:** How to brew (temperature, time, infusions, vessel)

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/BrewingCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const BrewingCalculator = m2.BrewingCalculator;

    const tea = new TeaModel({
      name: 'Oolong',
      type: 'oolong',
      caffeine: 6,
      oxidationLevel: 50
    });

    const calc = new BrewingCalculator();
    const result = calc.calculate(tea);

    console.log('✓ BrewingCalculator works');
    console.log('  Temperature:', result.data.temperature, '°C');
    console.log('  Infusions:', result.data.numberOfInfusions);
    console.log('  Vessel:', result.data.vesselType);
  });
});
"
```

### Step 9: Create FoodPairingCalculator

**File to create:** `src/api/calculators/FoodPairingCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 2 → Step 2.5

**Why:** Best food pairings (uses flavor + caffeine)

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/FoodPairingCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const FoodPairingCalculator = m2.FoodPairingCalculator;

    const tea = new TeaModel({
      name: 'Dragon Well',
      type: 'green',
      caffeine: 8,
      flavor: { primary: ['fruity', 'chestnut'] }
    });

    const calc = new FoodPairingCalculator();
    const result = calc.calculate(tea);

    console.log('✓ FoodPairingCalculator works');
    console.log('  Foods:', result.data.recommendedFoods);
  });
});
"
```

**✅ Phase 2 Complete!** All existing matchers now migrated to independent calculators

---

## Phase 3: Add New Calculators (4-6 hours)

New features that were impossible with old architecture.

### Step 10: Create PresentationCalculator

**File to create:** `src/api/calculators/PresentationCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 3 → Step 3.1

**Why:** Generate marketing description of the tea

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/PresentationCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const PresentationCalculator = m2.PresentationCalculator;

    const tea = new TeaModel({
      name: 'Dragon Well',
      type: 'green',
      origin: 'Hangzhou, China',
      altitude: 1200,
      flavor: { primary: ['grassy', 'chestnut'] }
    });

    const calc = new PresentationCalculator();
    const result = calc.calculate(tea);

    console.log('✓ PresentationCalculator works');
    console.log('  Description:', result.data.description);
    console.log('  Highlights:', result.data.highlights);
  });
});
"
```

### Step 11: Create TeaPairingCalculator

**File to create:** `src/api/calculators/TeaPairingCalculator.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 3 → Step 3.2

**Why:** Find what other teas pair well with this one

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/calculators/TeaPairingCalculator.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const TeaPairingCalculator = m2.TeaPairingCalculator;

    const tea1 = new TeaModel({
      name: 'Dragon Well',
      type: 'green',
      caffeine: 8,
      flavor: { primary: ['fruity'] }
    });

    const tea2 = new TeaModel({
      name: 'Silver Needle',
      type: 'white',
      caffeine: 2,
      flavor: { primary: ['fruity', 'floral'] }
    });

    const calc = new TeaPairingCalculator();
    const result = calc.calculate(tea1, [tea1, tea2]);

    console.log('✓ TeaPairingCalculator works');
    console.log('  Compatible:', result.data.compatibleTeas.length, 'teas');
  });
});
"
```

**✅ Phase 3 Complete!** New calculators created

---

## Phase 4: Create Orchestrator (2-4 hours)

### Step 12: Create TeaRecommendationAPI

**File to create:** `src/api/TeaRecommendationAPI.js`

Copy from IMPLEMENTATION_ROADMAP.md → Phase 4

**Why:** Central orchestrator that calls all calculators

**Test:**
```bash
node -e "
import('./src/models/TeaModel.js').then(m1 => {
  import('./src/api/TeaRecommendationAPI.js').then(m2 => {
    const TeaModel = m1.TeaModel;
    const TeaRecommendationAPI = m2.TeaRecommendationAPI;

    const tea = new TeaModel({
      name: 'Dragon Well',
      type: 'green',
      caffeine: 8,
      lTheanine: 5,
      altitude: 1200,
      temperature: 15,
      flavor: { primary: ['grassy', 'chestnut'] },
      origin: 'Hangzhou',
      roastLevel: 'light',
      harvestSeason: 'Spring'
    });

    const api = new TeaRecommendationAPI();
    const results = api.analyze(tea);

    console.log('✓ TeaRecommendationAPI works');
    console.log('  Tea:', results.tea.name);
    console.log('  Recommendations returned:');
    console.log('    - Time:', results.recommendations.time.success);
    console.log('    - Activity:', results.recommendations.activity.success);
    console.log('    - Season:', results.recommendations.season.success);
    console.log('    - Brewing:', results.recommendations.brewing.success);
    console.log('    - Food:', results.recommendations.food.success);
    console.log('    - Presentation:', results.recommendations.presentation.success);
  });
});
"
```

**✅ Phase 4 Complete!** Orchestrator works

---

## Phase 5: Testing & Validation (4-6 hours)

### Step 13: Run Comprehensive Test

**File:** `test-new-architecture.js` (create in root of endpoint/)

```javascript
import { TeaModel } from './src/models/TeaModel.js';
import { TeaRecommendationAPI } from './src/api/TeaRecommendationAPI.js';

// Load validation data
import fs from 'fs';
const validationData = JSON.parse(
  fs.readFileSync('./validation-dataset-17-tea.json', 'utf-8')
);

const api = new TeaRecommendationAPI();

console.log('\n' + '='.repeat(80));
console.log('COMPREHENSIVE TEA RECOMMENDATION TEST');
console.log('Testing new independent calculator architecture');
console.log('='.repeat(80) + '\n');

let results = {
  tested: 0,
  successful: 0,
  failed: 0,
  details: []
};

for (const tea of validationData.slice(0, 5)) {  // Test first 5 teas
  try {
    const teaModel = new TeaModel({
      name: tea.name,
      type: tea.type,
      caffeine: tea.compounds_calculated?.caffeine_level || 5,
      lTheanine: tea.compounds_calculated?.l_theanine_level || 5,
      altitude: tea.geography?.altitude_meters || 1000,
      temperature: tea.geography?.temperature_celsius || 15,
      flavor: { primary: tea.flavor?.primary_categories || [] },
      origin: tea.geography?.origin || 'Unknown',
      harvestSeason: tea.characteristics?.harvest_season || 'Spring',
      roastLevel: tea.processing?.roast_level || 'light'
    });

    const result = api.analyze(teaModel);

    results.tested++;

    if (
      result.recommendations.time.success &&
      result.recommendations.activity.success &&
      result.recommendations.season.success &&
      result.recommendations.brewing.success &&
      result.recommendations.food.success &&
      result.recommendations.presentation.success
    ) {
      results.successful++;
      console.log(`✓ ${tea.name}`);
      console.log(`  Time: ${result.recommendations.time.data.recommendedTimes.join(', ')}`);
      console.log(`  Activity: ${result.recommendations.activity.data.recommendedActivities.slice(0, 2).join(', ')}`);
      console.log(`  Brewing: ${result.recommendations.brewing.data.temperature}°C`);
      console.log(`  Food: ${result.recommendations.food.data.recommendedFoods.slice(0, 2).join(', ')}`);
      console.log('');
    } else {
      results.failed++;
      console.log(`✗ ${tea.name} - Some calculators failed`);
    }
  } catch (error) {
    results.failed++;
    console.log(`✗ ${tea.name} - Error: ${error.message}`);
  }
}

console.log('='.repeat(80));
console.log('RESULTS');
console.log('='.repeat(80));
console.log(`Tested: ${results.tested}`);
console.log(`Successful: ${results.successful}`);
console.log(`Failed: ${results.failed}`);
console.log(`Success Rate: ${((results.successful / results.tested) * 100).toFixed(1)}%`);
console.log('');
```

**Run it:**
```bash
node test-new-architecture.js
```

---

## Complete File Checklist

Phase 1 (Foundation):
- [ ] src/models/TeaModel.js
- [ ] src/models/CalculatorResult.js
- [ ] src/api/calculators/BaseCalculator.js

Phase 2 (Migrate):
- [ ] src/api/calculators/TimeCalculator.js
- [ ] src/api/calculators/ActivityCalculator.js
- [ ] src/api/calculators/SeasonCalculator.js
- [ ] src/api/calculators/BrewingCalculator.js
- [ ] src/api/calculators/FoodPairingCalculator.js

Phase 3 (New):
- [ ] src/api/calculators/PresentationCalculator.js
- [ ] src/api/calculators/TeaPairingCalculator.js

Phase 4 (Orchestrator):
- [ ] src/api/TeaRecommendationAPI.js

Phase 5 (Testing):
- [ ] test-new-architecture.js

---

## Expected Output After Completion

```
✓ Dragon Well
  Time: Morning, Afternoon
  Activity: High-Focus Work, Morning Routines
  Brewing: 70°C
  Food: Pastries, Light Desserts

✓ Silver Needle
  Time: Afternoon, Evening
  Activity: Meditation, Yoga
  Brewing: 65°C
  Food: Light Desserts, Fresh Fruit

✓ Tie Guan Yin
  Time: Morning
  Activity: Creative Projects, Study
  Brewing: 95°C
  Food: Dark Chocolate, Nuts

Results
────────────────────────────────
Tested: 5
Successful: 5
Failed: 0
Success Rate: 100.0%
```

---

## Next: Commit This New Architecture

```bash
git add src/
git commit -m "feat: implement independent calculator architecture

- Created TeaModel for standardized input
- Created CalculatorResult for standardized output
- Created BaseCalculator for common functionality
- Migrated 5 existing matchers to calculators
- Added 2 new calculators (Presentation, TeaPairing)
- Created orchestrator API
- Zero coupling between calculators
- All calculators tested and working independently

This replaces the failed EffectService centralization approach."
```

---

## Success Criteria ✓

After completing all phases:
- [ ] All calculators are independent (zero dependencies between them)
- [ ] All calculators use TeaModel as input
- [ ] All calculators return CalculatorResult
- [ ] Can modify any calculator without affecting others
- [ ] Can add new calculators easily
- [ ] Comprehensive test shows 100% success on first 5 teas
- [ ] Code committed and documented

You've now built a fundamentally better architecture than the failed EffectService approach.
