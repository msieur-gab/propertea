# Tea Recommendation API: Audit Findings & Implementation Roadmap

**Last Updated:** 2025-11-02
**Audit Type:** Security, Code Quality, Architecture Assessment
**Status:** 4 Critical Fixes Applied ✅ | 3 Tasks Pending | Future Work Documented

---

## 🎯 Executive Summary

This document captures comprehensive findings from audits of the tea recommendation endpoint (v2.0) and serves as the single source of truth for implementation priorities across iterations.

**Key Metrics:**
- ✅ **4 Critical/Medium fixes applied** (CORS, renderers array, JSON parsing, season range detection)
- ⚠️ **3 Medium-priority pending items** (input validation, error handling, logging)
- 📋 **Geography integration pending** (will feed into future renderers)
- 🏗️ **Architectural strengths:** Inferrer/Renderer split, taxonomy-driven design, confidence scoring

---

## 🚀 Enhancements (This Session)

### TerroirRenderer: Geographic Origin Narrative (REFACTORED)
**Files Modified:**
- ✅ Created `endpoint/src/processors/renderers/TerroirRenderer.js` (completely refactored, 416 lines)
- ✅ Enhanced `endpoint/src/processors/inferrers/GeographyInferrer.js` (now returns full taxonomy arrays)
- ✅ Updated `endpoint/src/rendererRegistry.js` (terroir renderer dependency)
- ✅ Updated `netlify/functions/tea-recommendation.js` (passes formData for location)
- ✅ Updated `netlify/test-ui.html` (terroir checkbox)

**Feature Improvements:**
- **DATA-DRIVEN NARRATIVES:** Pulls actual values (100m altitude, 85% humidity, 24.5°C temp, 195 MJ/m²/day solar)
- **TAXONOMY ARRAYS:** Uses flavorInfluence and compoundTendency arrays from GeographyTaxonomy
- **LOCATION CONTEXT:** Includes specific location (e.g., "Assam Valley, Assam, India")
- **FOCUSED & SPECIFIC:** No generic text—each narrative is personalized to the actual tea and its terroir

**Enhanced GeographyInferrer:**
- Returns not just classifications but full descriptions from taxonomy
- Includes `flavorInfluence` arrays (e.g., ["complex aromatics", "brighter notes"])
- Includes `compoundTendency` arrays (e.g., ["increases amino acids (L-theanine)", "potentially lower caffeine"])
- Structure now includes: value, classification, description, flavorInfluence, compoundTendency

**TerroirRenderer Sections (9 total):**
1. **Geographic Origin** — "Assam at 100m elevation in Assam Valley, Assam, India with average temperatures of 24.5°C and humidity around 85%"
2. **Elevation Impact (100m)** — "Very low elevation gardens tend towards robust teas... For Black Tea, this means..."
3. **Humidity & Moisture (85%)** — "Very high humidity... Flavor influences: soft, sweet flavors, less astringency..."
4. **Temperature Range (24.5°C)** — "Warm regions support faster growth... Flavor influences: vibrant flavors, fruity notes..."
5. **Sun Exposure (195 MJ/m²/day)** — "High solar radiation... Compound effects: very high caffeine, lower amino acids..."
6. **Climate Zone (27° latitude)** — "Subtropical climate... Description: balanced profiles, good aromatic development..."
7. **Compound Development** — Links geographic factors to biochemical profile
8. **Flavor Expression** — Shows how terroir manifests in identified flavors
9. **Terroir Quality & Character** — Quality assessment with terroir characteristics

**Output Structure:**
```javascript
recommendations.terroir = {
  narrative: "Full multi-section terroir story with specific values...",
  sections: [
    "**Geographic Origin** - Assam at 100m elevation in Assam Valley, Assam, India...",
    "**Elevation Impact (100m)** - Very low elevation tends towards robust teas...",
    "**Humidity & Moisture (85%)** - Very high humidity encourages soft flavors...",
    // ... temperature, solar radiation, latitude, compound, flavor, quality sections
  ],
  geographicInfluences: [
    {
      factor: "Elevation",
      value: "100m",                                      // ACTUAL VALUE
      classification: "Very Low",
      description: "Very low elevation gardens (<300m) tend towards robust...",
      flavorInfluence: ["bold flavors", "higher astringency"],
      compoundEffect: ["potentially higher caffeine", "faster growth cycle"]
    },
    {
      factor: "Humidity",
      value: "85%",                                       // ACTUAL VALUE
      classification: "Very High",
      description: "Very high humidity can promote fungal growth...",
      flavorInfluence: ["soft, sweet flavors", "less astringency"],
      compoundEffect: ["reduced caffeine", "higher L-theanine"]
    },
    // ... temperature, solar radiation, latitude
  ],
  teaType: "Black Tea",
  teaTypeId: "TEA_TYPE_BLACK",
  location: "Assam Valley, Assam, India",                // LOCATION CONTEXT
  qualityIndicator: "Good Quality",
  characteristics: ["Misty/misty-mountain character"],
  harvestSeason: "Spring/Early Summer",
  analysis: {
    elevation: "Very Low",
    humidity: "Very High",
    latitude: "Subtropical (Upper)",
    temperature: "Warm",
    solarRadiation: "High"
  },
  confidence: 0.95,
  rendererVersion: '1.0'
}
```

**Example Narrative Output (Assam Black Tea):**
> "**Geographic Origin**
> Black Tea grows in Assam Valley, Assam, India at 100m elevation, with average temperatures of 24.5°C and humidity levels around 85%. This specific terroir fundamentally shapes the tea's character from leaf to cup.
>
> **Elevation Impact (100m)**
> Very low elevation gardens (<300m) tend towards robust teas with bold flavors and higher astringency. For Black Tea, this elevation means the tea plants grow more slowly...
> Flavor influences from this elevation: **bold flavors, higher astringency**
> Compound development: **potentially higher caffeine, faster growth cycle**
>
> **Humidity & Moisture (85%)**
> Very high humidity (>85%) can promote fungal growth and disease but create soft, sweet teas in healthy conditions. In this humid microclimate, Black Tea develops...
> Flavor characteristics: **soft, sweet flavors, less astringency**
> Compound effects: **reduced caffeine, higher L-theanine**"

**Key Design Improvements:**
- **Actual values embedded** — "100m", "85%", "24.5°C", "195 MJ/m²/day", "27°"
- **Taxonomy arrays integrated** — Every section includes flavorInfluence and compoundTendency arrays
- **Location specificity** — "Assam Valley, Assam, India" not generic "tea origin"
- **Data-driven not templated** — Each section uses real taxonomy descriptions
- **Tea-type contextualized** — "For Black Tea, this means..." vs. "For this tea..."

---

### SeasonRenderer: Added Monthly Scores Object
**Files:**
- ✅ `endpoint/src/processors/renderers/SeasonRenderer.js` (lines 175-181)
- ✅ `netlify/functions/tea-recommendation.js` (line 261)

**Improvement:** Added `monthlyScores` object (parallel to TimeRenderer's `hourlyScores`)

**Structure (Updated):**
```javascript
monthlyScores: {
  "SEASON_EARLY_SPRING": 56,
  "SEASON_SPRING": 50,
  "SEASON_LATE_SPRING": 50,
  "SEASON_EARLY_SUMMER": 50,
  "SEASON_SUMMER": 50,
  "SEASON_LATE_SUMMER": 50,
  "SEASON_EARLY_AUTUMN": 60.8,
  "SEASON_AUTUMN": 69.2,
  "SEASON_LATE_AUTUMN": 72.2,
  "SEASON_EARLY_WINTER": 84.8,
  "SEASON_WINTER": 84.2,
  "SEASON_LATE_WINTER": 72
}
```

**Benefits:**
- Semantic keys using seasonId instead of numeric indices (more readable)
- Simple flat structure for month-by-month lookup
- Optimized for chart implementations (polar/radial charts)
- Mirrors TimeRenderer's design pattern for consistency
- Easy iteration for client-side visualization loops

**Note on Scoring:**
Scores never go below 50 (base neutral score). This is because:
- All seasons initialize at 50 (neutral)
- Only *positive* boosts are applied from tea type and processing affinities
- No negative penalties currently exist in taxonomy

This means every tea is suitable year-round (baseline), with better seasons rated above 50. See "Future Design Questions" section below for potential refinement.

**Response Structure Now Includes:**
```javascript
recommendations.season = {
  recommendations: [...],      // Filtered seasons above threshold
  circularYear: [...],         // Structured 12-month array with names
  monthlyScores: {...},        // ✅ NEW: Flat monthly scores for charts
  seasonalScores: {...},       // All seasons including ANYTIME
  seasonalRange: {...},        // Continuous range analysis
  analysis: {...},
  confidence: 0.85,
  rendererVersion: '1.0'
}
```

---

### BrewingRenderer: Realistic Steep Times & Taxonomy-Driven Parameters (COMPLETED ✅)
**Files Created/Modified:**
- ✅ Created `endpoint/src/taxonomies/brewing.js` (501 lines, complete taxonomy)
- ✅ Refactored `endpoint/src/processors/renderers/BrewingRenderer.js` (now data-driven)
- ✅ Updated `endpoint/src/taxonomies/index.js` (added BrewingTaxonomy export)
- ✅ Updated `endpoint/src/rendererRegistry.js` (brewing dependencies)
- ✅ Updated `netlify/functions/tea-recommendation.js` (Netlify v2 compatibility)
- ✅ Updated `dev-server.js` (Netlify v2 Request format support)

**Critical Fix: Base Steep Times**
- **Problem:** Base steep times were impossible (3-4 seconds for all teas)
  - Gongfu: 3-5 seconds → completely unbrewed
  - Western: 4-5 seconds → espresso-like, not tea
- **Root Cause:** Parameters never validated against real brewing practice
- **Solution:** Updated to scientifically-grounded values:

| Tea Type | Before (s) | After (s) | Context |
|----------|-----------|----------|---------|
| White Gongfu | 3 | 35 | Gentle extraction of delicate aromatics |
| White Western | 4 | 180 (3 min) | Single longer infusion in larger vessel |
| Green Gongfu | 2 | 25 | Quick extraction across multiple infusions |
| Green Western | 3 | 150 (2.5 min) | Careful extraction avoiding astringency |
| Yellow Gongfu | 3 | 30 | Balanced between green and oxidized |
| Yellow Western | 4 | 120 (2 min) | Subtle character preservation |
| Oolong Gongfu | 3 | 15 | Complex flavors in short, hot infusions |
| Oolong Western | 5 | 240 (4 min) | Full oxidized tea development |
| Black Gongfu | 3 | 12 | Robust extraction in high heat |
| Black Western | 4 | 210 (3.5 min) | Standard black tea brewing time |
| Puerh Gongfu | 3 | 10 | Dense aged leaves, quick release |
| Puerh Western | 4 | 240 (4 min) | Full aging character expression |

**BrewingTaxonomy Structure:**
```javascript
// Base parameters (tea type × style) with realistic values
BASE_PARAMETERS {
  'TEA_TYPE_WHITE': {
    gongfu: { temperature: 75, steepTime: 35, gramsPer100ml: 5, infusions: 4, reasoning: '...' },
    western: { temperature: 80, steepTime: 180, gramsPer100ml: 3, infusions: 2, reasoning: '...' }
  },
  // ... 6 tea types total
}

// Adjustment rules (roast, oxidation, altitude, astringency, age, vessel)
LEAF_STYLE_ADJUSTMENTS { ... }
ROAST_LEVEL_ADJUSTMENTS { ... }
OXIDATION_ADJUSTMENTS { ... }
ALTITUDE_ADJUSTMENTS { ... }
AGE_ADJUSTMENTS { ... }
VESSEL_MATERIALS { ... }

// Helper methods
getBaseParameters(teaType, style)
calculateAdjustedParameters(baseParams, adjustments)
calculateAstringencyFromCompounds(caffeine, theanine, catechins)
calculateAdvancedConfidence(dataAvailable)
```

**BrewingRenderer Improvements:**
1. ✅ **Data-driven:** All parameters come from BrewingTaxonomy
2. ✅ **Multi-inference synthesis:** Uses processing, geography, compound inferences
3. ✅ **Cumulative adjustments:** Multiple factors (roast, altitude, astringency) compose naturally
4. ✅ **Separate gongfu/western:** Each style calculated independently from start
5. ✅ **Transparent reasoning:** Every adjustment explained to user
6. ✅ **Confidence scoring:** Based on data completeness (70% base + increments for each data source)
7. ✅ **Bounds safety:** Temperature stays 70-100°C, steep time minimum 1s

**Testing & Validation:**
- ✅ All 6 tea types verified with realistic parameters
- ✅ Adjustment logic tested (altitude + astringency adjustments compose correctly)
- ✅ Gongfu/western parameters independently calculated and distinct
- ✅ gramsPer100ml displays correctly in narrative output
- ✅ Confidence scoring increases with more complete input data

**Files Modified:**
- ✅ `/endpoint/src/taxonomies/brewing.js` (created)
- ✅ `/endpoint/src/processors/renderers/BrewingRenderer.js` (refactored)
- ✅ `/endpoint/src/taxonomies/index.js`
- ✅ `/endpoint/src/rendererRegistry.js`
- ✅ `/netlify/functions/tea-recommendation.js` (v2 compatibility)
- ✅ `/dev-server.js` (v2 compatibility)

---

## ✅ Fixed Issues (Applied Commits)

### [HIGH] CORS Headers Missing on Error Responses
**File:** `netlify/functions/tea-recommendation.js` (lines 36-41, applied throughout)
**Problem:** Only 200 and preflight responses included CORS headers; 400/405/500 responses caused opaque browser errors instead of exposing JSON payloads.

**Impact:** Clients got cryptic "network error" instead of actual validation failure messages.

**Solution Applied:**
```javascript
// Centralized CORS header constant
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Applied to ALL response branches (200, 400, 405, 500)
return {
  statusCode: 400,
  headers: corsHeaders,
  body: JSON.stringify({ error: '...' })
};
```

**Files Modified:**
- ✅ `netlify/functions/tea-recommendation.js` (lines 36-41, 50, 59, 71, 85, etc.)

---

### [MEDIUM] Renderers Array Type Mismatch
**File:** `netlify/functions/tea-recommendation.js` (lines 94-114, applied)
**Problem:** `renderers` parameter assumed to be an array. Clients submitting form-post strings (e.g., `renderers: "activity"`) would crash with opaque "filter is not a function" error before validation.

**Root Cause:** No type normalization before passing to `validateRenderers()`.

**Solution Applied:**
```javascript
// Normalize renderers to array: handle string input, deduplicate, lowercase
if (typeof renderers === 'string') {
  renderers = [renderers];
}
if (!Array.isArray(renderers)) {
  return {
    statusCode: 400,
    headers: corsHeaders,
    body: JSON.stringify({
      error: 'renderers must be a string or array of strings',
      example: 'renderers: "activity" or renderers: ["activity", "food", "time"]',
      available: ['activity', 'food', 'time', 'season', 'brewing']
    })
  };
}

// Deduplicate and normalize to lowercase
renderers = [...new Set(renderers.map(r => String(r).toLowerCase()))];
```

**Files Modified:**
- ✅ `netlify/functions/tea-recommendation.js` (lines 97-114)

---

### [MEDIUM] SeasonRenderer False "Scattered" Detection
**File:** `endpoint/src/processors/renderers/SeasonRenderer.js` (lines 208-257, applied)
**Problem:** `_findContinuousRange()` checked for contiguity without sorting recommendations chronologically first. Since recommendations arrive sorted by *score* (descending), natural sequences like "Late Autumn → Early Winter → Winter" were incorrectly reported as "scattered."

**Root Cause:** Recommendations = `[{seasonId: "SEASON_LATE_AUTUMN", score: 85}, {seasonId: "SEASON_EARLY_WINTER", score: 90}, {seasonId: "SEASON_WINTER", score: 80}]`
→ Indices from score order: `[8, 9, 10]` (happens to be continuous)
→ But if score order was `[90, 85, 80]`, indices would be `[9, 8, 10]` → "scattered" ❌

**Solution Applied:**
```javascript
// ✅ CRITICAL: Sort indices chronologically (ascending) before checking contiguity
const sortedIndices = [...indices].sort((a, b) => a - b);

// Now check for contiguity using sorted order
for (let i = 1; i < sortedIndices.length; i++) {
  if (sortedIndices[i] === currentRange[currentRange.length - 1] + 1) {
    currentRange.push(sortedIndices[i]);
  } else {
    ranges.push([...currentRange]);
    currentRange = [sortedIndices[i]];
  }
}
```

**Files Modified:**
- ✅ `endpoint/src/processors/renderers/SeasonRenderer.js` (lines 215-249, added detailed explanation)

---

### [LOW] JSON Parse Errors → Generic 500
**File:** `netlify/functions/tea-recommendation.js` (lines 64-77, applied)
**Problem:** Malformed JSON input fell into generic 500 error handler, misrepresenting client errors as server failures. No helpful error message.

**Solution Applied:**
```javascript
// Parse request body with proper error handling
let requestBody;
try {
  requestBody = JSON.parse(event.body);
} catch (parseError) {
  return {
    statusCode: 400,  // Correct status: client error
    headers: corsHeaders,
    body: JSON.stringify({
      error: 'Invalid JSON in request body',
      hint: 'Ensure payload is valid JSON and contains required fields: name, type'
    })
  };
}
```

**Files Modified:**
- ✅ `netlify/functions/tea-recommendation.js` (lines 64-77)

---

## 📋 Pending Tasks (Priority Order)

### [MEDIUM] Comprehensive Input Validation Schema
**Priority:** P1
**Impact:** Prevents garbage-in-garbage-out; ensures data quality for inference
**Effort:** 2-3 hours

**What's Needed:**
- Validate `caffeineLevel` and `lTheanineLevel` are numbers in range [0, 10]
- Validate `flavorProfile` array items against flavor taxonomy
- Validate `processingMethods` against processing taxonomy
- Validate `geography` object structure and numeric ranges (latitude, longitude, altitude)
- Type checking: ensure arrays are arrays, objects are objects, strings are strings

**Files to Create/Modify:**
- Create: `endpoint/src/validators/PayloadValidator.js`
- Create: `endpoint/src/validators/schemas.js`
- Modify: `netlify/functions/tea-recommendation.js` (add validation call after line 79)

**Example:**
```javascript
// Pseudo-code
class PayloadValidator {
  validateCaffeineLevel(value) {
    if (typeof value !== 'number' || value < 0 || value > 10) {
      throw new ValidationError('caffeineLevel must be a number between 0-10');
    }
  }

  validateFlavorProfile(flavorArray) {
    const validFlavors = FlavorTaxonomy.getAllFlavorIds();
    flavorArray.forEach(flavor => {
      if (!validFlavors.includes(flavor)) {
        throw new ValidationError(`"${flavor}" not recognized. Valid options: ${validFlavors.join(', ')}`);
      }
    });
  }

  // ... similar for processingMethods, geography, etc.
}
```

---

### [MEDIUM] Improve Error Messages & Sanitization
**Priority:** P1
**Impact:** Production safety; prevents information disclosure; aids debugging
**Effort:** 1-2 hours

**What's Needed:**
- Don't expose stack traces to clients in error responses
- Identify which renderer/inferrer failed (if applicable)
- Provide actionable hints (e.g., "You must provide flavorProfile to use food renderer")
- Add error codes for client-side error handling (e.g., `INVALID_PAYLOAD`, `MISSING_REQUIRED_INFERRER`)

**Files to Modify:**
- `netlify/functions/tea-recommendation.js` (error responses, lines 149-158)
- Consider: `endpoint/src/errors/ApiError.js` (new file for custom error types)

**Example:**
```javascript
catch (error) {
  const errorCode = error.code || 'INTERNAL_ERROR';
  const clientMessage = sanitizeErrorMessage(error);

  console.error('[ERROR]', errorCode, error); // Log full error server-side

  return {
    statusCode: 500,
    headers: corsHeaders,
    body: JSON.stringify({
      error: clientMessage,  // Safe for client
      code: errorCode,       // For client error handling
      hint: getHintForError(errorCode)
    })
  };
}
```

---

### [MEDIUM] Request Logging & Observability
**Priority:** P2
**Impact:** Production debugging; performance monitoring
**Effort:** 2-3 hours

**What's Needed:**
- Structured logging (not just `console.error`)
- Request ID tracking (for correlating multi-service errors)
- Per-renderer execution time tracking
- Success/failure rates per renderer
- Timestamp and processing time metadata (already in response, but not logged)

**Files to Create/Modify:**
- Create: `endpoint/src/logging/Logger.js`
- Modify: `netlify/functions/tea-recommendation.js` (add logging at key checkpoints)

**Example:**
```javascript
const logger = new Logger('tea-recommendation');

logger.info('request_received', {
  requestId: generateUUID(),
  format,
  renderersRequested: renderers,
  teaName: formData.name
});

// Later:
logger.info('inference_complete', {
  requestId,
  inferenceName: 'compound',
  durationMs: Date.now() - inferenceStartTime
});
```

---

### [LOW] Rate Limiting & API Key Validation
**Priority:** P3
**Impact:** Security; prevents abuse
**Effort:** 2-4 hours (depends on infra choice)

**What's Needed:**
- Per-IP rate limiting (basic: 10 req/min)
- Optional: API key authentication for production deploys
- Optional: Quota tracking (requests per day)

**Recommended Approach:**
- Use Netlify middleware or serverless rate limiting library
- Store quota data in Durable Objects or external KV store
- Add `X-RateLimit-*` headers to responses

---

## 🏗️ Architectural Strengths (Review-Validated)

These aspects are well-designed and should be maintained:

### ✅ Inferrer/Renderer Split
- `rendererRegistry.js` is the single source of truth for dependencies
- Parallel inferencer execution via `Promise.all()`
- Only required inferrers instantiated → efficient compute
- Sequential renderer execution → deterministic output

**Recommendation:** Document this pattern in a `ARCHITECTURE.md` file for new contributors.

---

### ✅ Taxonomy-Driven Design
- All recommendation logic derives from centralized taxonomy files in `endpoint/src/taxonomies/`
- Case-insensitive lookup with alias support
- Easy to update recommendations without code changes
- All 5 taxonomies (tea types, compounds, activities, flavors, foods, seasons, processing, geography) are now unified

**Recommendation:** Consider versioning taxonomies if they evolve significantly.

---

### ✅ Confidence Scoring
- Each inferrer tracks confidence (0-1 scale)
- Confidence bucketing is smart:
  - Both caffeine & L-theanine provided → 0.95 confidence
  - One provided → 0.75 confidence
  - None provided → 0.1 confidence

**Recommendation:** Add client-side consumption guidance: "Only display recommendations with confidence > 0.7" or similar.

---

### ✅ Flexible Output Formats
- "Production" format: lean, optimized for clients
- "Trace" format: includes `analysis` and reasoning for debugging
- Metadata includes timestamp, processing time, version, pipeline type

**Recommendation:** Document trace format in API docs; it's valuable for auditing and transparency.

---

## 📍 Geography Analysis Status

**Current State:** ✅ NOW INTEGRATED
- `GeographyInferrer` analyzes elevation, humidity, temperature, solar radiation, latitude
- `TerroirRenderer` consumes geography analysis to create narrative presentations
- Terroir is now a first-class renderer alongside Activity, Food, Time, Season, Brewing

**Completed:**
- ✅ Create `TerroirRenderer` (geographic origin narratives + influence chain)

**Future Expansion (Pending):**
- [ ] Create `ClimateRenderer` (geo-adjusted seasonal shifts beyond current seasonal affinity)
- [ ] Integrate geography into `SeasonRenderer` (optional: climate-aware seasonal adjustments)
- [ ] Add `MicroclimateAnalyzer` (harvest-time weather patterns)

**Geography Data Richness:**
- Input: latitude, longitude, altitude, humidity, temperature, solar radiation
- Processing: 5 elevation levels × 5 humidity levels × 5 temperature ranges × 5 solar radiation levels × 5 latitude zones
- Output: Quality indicators, terroir characteristics, flavor/compound influences
- Current renderers use geography: TerroirRenderer (primary), and optionally TimeRenderer and SeasonRenderer (compound/compound influences)

---

## 🚀 Next Iteration Roadmap

### Iteration 2 (Current): Foundation + Brewing Excellence
**Target:** Data validation + error handling + observability + BrewingRenderer refactor

1. ✅ Apply 4 critical fixes (DONE - previous iteration)
2. ✅ **BrewingRenderer major refactor** (COMPLETED THIS SESSION)
   - ✅ Created BrewingTaxonomy with realistic base parameters
   - ✅ Implemented multi-inference synthesis (processing, geography, compound)
   - ✅ Added cumulative adjustment logic with bounds
   - ✅ Confidence scoring and transparent reasoning
3. Implement `PayloadValidator` with full schema validation
4. Add structured logging with request IDs
5. Improve error messages (no stack traces, actionable hints)
6. Add basic rate limiting

**Effort:** 8-12 hours total (4 completed, 4-8 remaining)
**Outcome:** Production-ready reliability with excellent brewing recommendations

---

### Iteration 3: Validation & Observability
**Target:** Data validation + error handling + logging (continuation of Iteration 2)

1. Implement `PayloadValidator` with full schema validation
2. Add structured logging with request IDs
3. Improve error messages (no stack traces, actionable hints)
4. Add basic rate limiting

**Effort:** 4-8 hours
**Outcome:** Production hardening

---

### Iteration 4: Geography Integration
**Target:** Leverage geography data in renderers (now that BrewingRenderer is complete)

1. Update `SeasonRenderer` to optionally incorporate climate data
2. Create `ClimateRenderer` for geographically-adjusted recommendations
3. Enhance `TerroirRenderer` with seasonal variations
4. Test with teas from diverse origins (high-altitude Yunnan, sea-level Fujian, etc.)

**Effort:** 6-10 hours
**Outcome:** Recommendations become location and season aware

---

### Iteration 5: Advanced Features (Future)
- **Caching:** Cache inferences by payload hash (1-5 min TTL)
- **Async renderers:** Support renderers that make external API calls
- **OpenAPI documentation:** Auto-generate from `rendererRegistry`
- **Batch recommendations:** Accept arrays of teas, return parallel recommendations
- **A/B testing:** Track recommendation acceptance rates, feed into weighting

---

## 📊 Data Quality Notes

### Excellent:
- **Semantic richness:** 7 dimensions (name, type, compounds, flavor, processing, geography)
- **Numeric standardization:** Caffeine & L-theanine both 0-10 scale
- **Structured geography:** 6 fields (lat, lon, alt, humidity, temp, solar radiation)
- **Centralized taxonomy:** Prevents data drift

### Concerns:
- **Weighting hardcoded:** TimeRenderer's 85/15 split not configurable
- **Missing metadata:** No oxidation level, harvest time, leaf size (for future)
- **Flavor profile unconstrained:** No schema validation yet (pending iteration 2)
- **Geography underutilized:** Currently analyzed but not consumed (intentional for now)

---

## 🔍 Testing Checklist

Use this sample tea (Da Hong Pao) to verify fixes work:

```json
{
  "name": "Da Hong Pao",
  "originalName": "大红袍 (Dà Hóng Páo)",
  "type": "oolong",
  "subType": "wuyi-oolong",
  "caffeineLevel": 4.5,
  "lTheanineLevel": 4.5,
  "flavorProfile": ["roasted", "mineral", "dark fruits", "woody", "caramel"],
  "processingMethods": ["withered", "partial-oxidation", "rolled", "heavy-roast"],
  "geography": {
    "location": "Wuyi Mountains",
    "province": "Fujian",
    "country": "China",
    "latitude": 27.72,
    "longitude": 117.67,
    "altitude": 600,
    "humidity": 80,
    "temperature": 19.5,
    "solarRadiation": 175
  }
}
```

**Test Cases:**
- ✅ Valid JSON, all fields → should work
- ✅ Malformed JSON → 400 with helpful message
- ✅ `renderers: "activity"` (string instead of array) → should work (normalized)
- ✅ `renderers: ["ACTIVITY", "Food"]` (mixed case) → should normalize to lowercase
- ✅ `renderers: ["activity", "activity"]` (duplicate) → should deduplicate
- ✅ Missing CORS header on 400 response → should now be present
- ✅ Season recommendations should not falsely report as "scattered" for contiguous ranges

---

## 📚 File Structure

```
propertea/
├── AUDIT_FINDINGS_AND_TODO.md       ← You are here
├── netlify/
│   └── functions/
│       └── tea-recommendation.js     ← Main endpoint (FIXED: CORS, renderers, JSON parse)
├── endpoint/
│   └── src/
│       ├── processors/
│       │   ├── inferrers/           ← Analysis engines (Compound, Flavor, TeaType, etc.)
│       │   └── renderers/
│       │       └── SeasonRenderer.js ← (FIXED: chronological sort)
│       ├── taxonomies/              ← Data-driven recommendation profiles
│       ├── validators/              ← (PENDING: Create PayloadValidator.js)
│       ├── logging/                 ← (PENDING: Create Logger.js)
│       └── rendererRegistry.js      ← Dependency manifest (unchanged)
```

---

## 🎓 Key Learnings

1. **CORS applies to all responses, not just success paths** — easy to forget when adding error handlers
2. **Normalize inputs before validation** — type coercion issues often manifest as cryptic errors
3. **Don't rely on accident ordering** — if data arrives in score order but you need chronological order, sort explicitly
4. **Taxonomy-driven systems scale well** — much easier to adjust recommendations than refactoring logic
5. **Confidence scoring enables informed decisions** — clients can filter low-confidence results

---

## 📞 Questions for Future Iterations

- [ ] Should rate limiting be per-IP, per-API-key, or both?
- [ ] What's the acceptable tolerance for processing time (current: ~50ms for full pipeline)?
- [ ] Should renderers be parameterizable? (e.g., user-defined weighting for TimeRenderer)
- [ ] Will geography data be sourced from real climate APIs or pre-computed taxonomy?
- [ ] Should we support "partial" requests (e.g., just return circadianCurve without full time recommendations)?

### Seasonal Scoring Design Question
**Observation:** Monthly scores in SeasonRenderer never go below 50 (base neutral). This means every tea is treated as equally suitable in all seasons at baseline, with only positive boosts applied.

**Options:**
1. **Current design (keep as-is):** Every tea is fine year-round; some seasons are just better
2. **Add negative penalties:** Teas unsuitable for certain seasons score <50 (e.g., lightly-roasted green tea in winter → 30)
3. **Hybrid:** Only apply penalties for extreme mismatches (e.g., summer oolong in winter → 35)

**Implications:**
- Option 2/3 provides stronger seasonal guidance but requires taxonomy updates
- Option 1 is safe but less discriminative
- Consider user feedback: Do clients prefer "everything is ok" vs. "this season is suboptimal"?

**Taxonomy Impact:**
Would require adding `seasonalPenalty` fields to tea type and processing affinities, not just boosts.

---

**End of Document**
*Next update: After Iteration 2 completion*
