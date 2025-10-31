# Tea Analysis System - Architecture Analysis

**Date**: 2025-01-31
**Phase**: 1 - Analysis & Setup
**Status**: CURRENT STATE DOCUMENTED

---

## Current Data Flow & Issue

### The Redundancy Problem

**Current Flow** (INEFFICIENT):
```
analyzeTea(tea)
  ├─ _runCoreCalculations(tea)  [CALL 1] → 5 calculators run
  │  ├─ TeaTypeCalculator
  │  ├─ CompoundCalculator
  │  ├─ ProcessingCalculator
  │  ├─ GeographyCalculator
  │  └─ FlavorCalculator
  │
  ├─ getTimingRecommendations(tea)
  │  └─ _runCoreCalculations(tea)  [CALL 2] → 5 calculators run AGAIN
  │
  ├─ getSeasonalRecommendations(tea)
  │  └─ _runCoreCalculations(tea)  [CALL 3] → 5 calculators run AGAIN
  │
  ├─ getActivityRecommendations(tea)
  │  └─ _runCoreCalculations(tea)  [CALL 4] → 5 calculators run AGAIN
  │
  ├─ getFoodPairingRecommendations(tea)
  │  └─ _runCoreCalculations(tea)  [CALL 5] → 5 calculators run AGAIN
  │
  └─ getBrewingRecommendations(tea)
     └─ _runCoreCalculations(tea)  [CALL 6] → 5 calculators run AGAIN
```

**IMPACT**:
- Core calculations run **6 times** instead of **1 time**
- 5 matchers each recalculate the entire system
- Performance: ~83% wasted computation

---

## Current Architecture Components

### 1. Core Calculators (5 total)

| Calculator | Input | Output | Purpose |
|-----------|-------|--------|---------|
| **TeaTypeCalculator** | `tea.type`, `tea.subType`, `tea.name` | `{ identified, characteristics }` | Determine tea type and subtype |
| **CompoundCalculator** | `tea.caffeineLevel`, `tea.lTheanineLevel` | `{ levels, analysis, profile }` | Analyze chemical compounds |
| **ProcessingCalculator** | `tea.processingMethods`, `tea.processing` | `{ methods, analysis }` | Analyze processing techniques |
| **GeographyCalculator** | `tea.geography.*` | `{ characteristics, terroir }` | Analyze geographical origin |
| **FlavorCalculator** | `tea.flavorProfile[]` | `{ profile, analysis, intensity }` | Analyze flavor notes |

### 2. Matchers/Derivation Services (5 total)

| Matcher | Input from Core | Output | Purpose |
|---------|-----------------|--------|---------|
| **TimeMatcher** | compounds | `{ recommendations, hourly_scores }` | Best time of day to drink |
| **SeasonMatcher** | geography, processing, teaType, flavor | `{ season, affinity }` | Best season to drink |
| **FoodMatcher** | flavor, processing, teaType | `{ foods, clusters }` | Food pairing recommendations |
| **ActivityMatcher** | compounds, teaType, flavor | `{ activities, recommendations }` | Best activity to pair with |
| **BrewingMatcher** | teaType, processing | `{ gongfu, western }` | Brewing instructions |

### 3. Data Flow Issues

**Issue 1: Data Structure Inconsistency**
- Admin panel creates: `{ flavorProfile: [], processingMethods: [] }`
- TeaModel expects: `{ flavor: { primary: [] }, processing: {} }`
- Database stores: Mixed formats
- **Solution**: Normalize early with `TeaModel` wrapper

**Issue 2: Reference Data Access**
- Reference data scattered across files
- Imported individually by each calculator
- No centralized access or caching
- **Solution**: Create `ReferenceDataManager` singleton

**Issue 3: Error Handling**
- Silent failures (e.g., `teaTypeResult?.data?.teaType || {}`)
- No validation between stages
- **Solution**: Explicit validation with error propagation

---

## Proposed Service Architecture

### New Backend Structure

```
backend/src/
├── services/
│   ├── index.js                          # Service exports
│   ├── CompoundService.js                # Extracted from CompoundCalculator
│   ├── FlavorService.js                  # Extracted from FlavorCalculator
│   ├── TeaTypeService.js                 # Extracted from TeaTypeCalculator
│   ├── ProcessingService.js              # Extracted from ProcessingCalculator
│   ├── GeographyService.js               # Extracted from GeographyCalculator
│   └── RecommendationService.js          # Consolidated from 5 matchers
│
├── models/
│   ├── TeaModel.js                       # Data structure & validation
│   ├── TeaCalculation.js                 # Result object
│   ├── TeaCalculationOrchestrator.js    # **NEW** - Orchestrates single-pass
│   └── validators.js                     # Input/output validation
│
├── reference/
│   ├── index.js                          # **NEW** - ReferenceDataManager
│   ├── TeaTypeDescriptors.js             # Copied from js/descriptors/
│   ├── FlavorInfluences.js
│   ├── ProcessingInfluences.js
│   └── TeaDatabase.js
│
├── utils/
│   ├── normalization.js                  # **NEW** - Normalize tea data
│   ├── helpers.js
│   └── validation.js
│
├── routes/
│   ├── index.js
│   ├── analysis.js                       # POST /api/analysis
│   └── recommendations.js                # POST /api/recommendations (if separate)
│
├── middleware/
│   ├── errorHandler.js
│   └── validation.js
│
└── app.js                                 # Express app
```

---

## Data Normalization Layer

### Problem
```javascript
// Input format A (Admin panel)
{
  flavorProfile: ["umami", "marine"],
  processingMethods: ["steamed", "rolled"]
}

// Input format B (TeaModel)
{
  flavor: { primary: ["umami", "marine"] },
  processing: { methods: ["steamed", "rolled"] }
}

// Calculators expect various formats
FlavorCalculator expects: tea.flavorProfile OR tea.flavor.primary
ProcessingCalculator expects: tea.processingMethods OR tea.processing.methods
```

### Solution: Normalization Function
```javascript
// utils/normalization.js
function normalizeTeaData(rawData) {
  // Accepts any format
  // Returns TeaModel instance with consistent structure

  const tea = new TeaModel({
    name: rawData.name || rawData.teaName,
    type: rawData.type || rawData.teaType,
    subType: rawData.subType || '',
    caffeineLevel: rawData.caffeineLevel || 0,
    lTheanineLevel: rawData.lTheanineLevel || 0,

    flavor: {
      primary: rawData.flavor?.primary || rawData.flavorProfile || [],
    },

    processing: {
      methods: rawData.processing?.methods || rawData.processingMethods || [],
    },

    geography: rawData.geography || {},

    // ... etc
  });

  return tea;
}
```

---

## TeaCalculationOrchestrator (NEW)

### Purpose
Single point of orchestration - runs core calculations ONCE, passes to all matchers

### Implementation
```javascript
// models/TeaCalculationOrchestrator.js

class TeaCalculationOrchestrator {
  constructor(services) {
    this.services = services; // All services
  }

  async calculateTea(teaData) {
    // 1. Validate & normalize input
    const validatedTea = validateAndNormalize(teaData);

    // 2. Run CORE calculations ONCE
    const coreAnalysis = await this.runCoreCalculations(validatedTea);
    if (!coreAnalysis.success) {
      return { success: false, error: coreAnalysis.error };
    }

    // 3. Run MATCHERS IN PARALLEL using same coreAnalysis
    const [timing, seasonal, activities, food, brewing] =
      await Promise.all([
        this.services.recommendationService.getTimingRecommendations(
          validatedTea,
          coreAnalysis
        ),
        this.services.recommendationService.getSeasonalRecommendations(
          validatedTea,
          coreAnalysis
        ),
        this.services.recommendationService.getActivityRecommendations(
          validatedTea,
          coreAnalysis
        ),
        this.services.recommendationService.getFoodRecommendations(
          validatedTea,
          coreAnalysis
        ),
        this.services.recommendationService.getBrewingRecommendations(
          validatedTea,
          coreAnalysis
        )
      ]);

    // 4. Combine and return
    return {
      success: true,
      data: {
        teaType: coreAnalysis.teaType,
        compounds: coreAnalysis.compounds,
        flavor: coreAnalysis.flavor,
        processing: coreAnalysis.processing,
        geography: coreAnalysis.geography,
        timing,
        seasonal,
        activities,
        food,
        brewing,
        calculatedAt: new Date().toISOString()
      }
    };
  }

  async runCoreCalculations(tea) {
    try {
      // Only calculate ONCE
      const [teaType, compounds, flavor, processing, geography] =
        await Promise.all([
          this.services.teaTypeService.analyze(tea),
          this.services.compoundService.analyze(tea),
          this.services.flavorService.analyze(tea),
          this.services.processingService.analyze(tea),
          this.services.geographyService.analyze(tea)
        ]);

      return {
        success: true,
        teaType,
        compounds,
        flavor,
        processing,
        geography,
        _sourceTea: tea
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

---

## Service Extraction Plan

### Phase 2.1: CompoundService
- **From**: `js/calculators/CompoundCalculator.js`
- **New**: `services/CompoundService.js`
- **Input**: `{ caffeineLevel, lTheanineLevel }`
- **Output**: `{ levels, analysis, description }`
- **Dependencies**: None (except validators)
- **Status**: Ready for extraction

### Phase 2.2: FlavorService
- **From**: `js/calculators/FlavorCalculator.js`
- **New**: `services/FlavorService.js`
- **Input**: `{ flavorProfile: string[] }`
- **Output**: `{ profile, analysis, intensity }`
- **Dependencies**: ReferenceDataManager (flavor influences)
- **Status**: Ready

### Phase 2.3: TeaTypeService
- **From**: `js/calculators/TeaTypeCalculator.js`
- **New**: `services/TeaTypeService.js`
- **Input**: `{ type, subType?, name? }`
- **Output**: `{ identified, characteristics, confidence }`
- **Dependencies**: ReferenceDataManager (tea types)
- **Status**: Ready (needs confidence scoring addition)

### Phase 2.4: ProcessingService
- **From**: `js/calculators/ProcessingCalculator.js`
- **New**: `services/ProcessingService.js`
- **Input**: `{ methods, oxidationLevel? }`
- **Output**: `{ analysis, characteristics }`
- **Dependencies**: ReferenceDataManager (processing influences)
- **Status**: Needs review

### Phase 2.5: GeographyService
- **From**: `js/calculators/GeographyCalculator.js`
- **New**: `services/GeographyService.js`
- **Input**: `{ country, province, location, lat, lon, altitude, humidity, temp, solar }`
- **Output**: `{ characteristics, terroir, climate }`
- **Dependencies**: ReferenceDataManager
- **Status**: Ready

### Phase 2.6: RecommendationService
- **From**: 5 matchers (TimeMatcher, SeasonMatcher, FoodMatcher, ActivityMatcher, BrewingMatcher)
- **New**: `services/RecommendationService.js`
- **Input**: `{ tea, coreAnalysis }`
- **Output**: `{ timing, seasonal, food, activities, brewing }`
- **Dependencies**: All core analysis (passed in)
- **Status**: Ready (no redundant recalculation)

---

## Reference Data Manager

### Purpose
Centralized access to all reference data with lazy loading

```javascript
// reference/index.js

class ReferenceDataManager {
  static instance = null;

  constructor() {
    this._teaTypes = null;
    this._flavorInfluences = null;
    this._processingInfluences = null;
  }

  static getInstance() {
    if (!ReferenceDataManager.instance) {
      ReferenceDataManager.instance = new ReferenceDataManager();
    }
    return ReferenceDataManager.instance;
  }

  getTeaTypeData(type, subtype) {
    if (!this._teaTypes) this._loadTeaTypes();
    // return data
  }

  getFlavorData(flavorName) {
    if (!this._flavorInfluences) this._loadFlavorInfluences();
    // return data
  }

  // ... other methods

  _loadTeaTypes() {
    this._teaTypes = loadTeaTypeDescriptors();
  }

  _loadFlavorInfluences() {
    this._flavorInfluences = loadFlavorInfluences();
  }
}
```

---

## API Endpoint Design

### POST /api/analysis (Main Endpoint)

**Request**:
```json
{
  "name": "Gyokuro",
  "originalName": "玉露",
  "type": "green",
  "subType": "gyokuro",
  "caffeineLevel": 4.5,
  "lTheanineLevel": 9,
  "processingMethods": ["shade-grown", "steamed", "rolled", "dried"],
  "flavorProfile": ["umami", "marine", "sweet", "grass", "seaweed"],
  "geography": {
    "country": "Japan",
    "province": "Kyoto Prefecture",
    "location": "Uji",
    "latitude": 34.88,
    "longitude": 135.80,
    "altitude": 200,
    "humidity": 75,
    "temperature": 15.5,
    "solarRadiation": 165
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "teaType": { ... },
    "compounds": { ... },
    "flavor": { ... },
    "processing": { ... },
    "geography": { ... },
    "timing": { ... },
    "seasonal": { ... },
    "food": { ... },
    "activities": { ... },
    "brewing": { ... },
    "calculatedAt": "2025-01-31T10:30:00Z"
  }
}
```

**Response** (400):
```json
{
  "success": false,
  "error": "Invalid input: missing required field 'type'"
}
```

---

## Next Steps

✅ **Completed**: Current state analysis
⏭️ **Next**: Begin Phase 2 - Extract services and create TeaCalculationOrchestrator

---

## Questions for Implementation

1. **Browser Support**: Should backend work with very old browsers? (Affects async/await vs Promises)
2. **Error Detail Level**: How much error detail in API responses? (For debugging)
3. **Caching**: Should we implement response caching? (Not needed for serverless, but useful for testing)
4. **Logging**: What logging level? (Development vs Production)
5. **Validation Strictness**: Fail on missing optional fields or provide defaults?
