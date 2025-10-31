# Backend Fixes - Quick Reference Guide

## The Problem in 30 Seconds

**Backend RecommendationService is too simplistic.** It only returns basic categories (e.g., "bestTimes: ['Morning']") instead of the sophisticated algorithms the frontend uses.

| Feature | Frontend | Backend | Gap |
|---------|----------|---------|-----|
| Timing | 24-hour hourly scoring with profiles | 4 hardcoded categories | 95% missing |
| Seasonal | 12-season algorithm with 5 scoring factors | Check roast level only | 95% missing |
| Activities | 50+ activities with clustering | 4-8 hardcoded activities | 90% missing |
| Food Pairings | 100+ foods with flavor mapping | 3-4 foods per category | 85% missing |
| Brewing | Basic guides | Basic guides | ✅ Acceptable |

---

## Critical Issues (In Order of Severity)

### 1. TimeMatcher - Completely Missing ❌
**File:** `RecommendationService.getTimingRecommendations()` (lines 33-78)

**What it should do:**
- Create 24-hour array with scores for each hour
- Apply compound effect profiles (Intense & Sharp, Focused & Energized, etc.)
- Apply stimulation/relaxation curves
- Normalize to 0-100 percentile
- Return detailed hourly data + top hours + ideal ranges

**What it actually does:**
```javascript
if (caffeineLevel <= 1) {
  bestTimes = ['Evening', 'Night', 'Before bed'];
}
// Returns just 3-4 categories
```

**Copy from:** `js/derivation/TimeMatcher.js` (entire file, ~330 lines)

---

### 2. SeasonMatcher - Completely Missing ❌
**File:** `RecommendationService.getSeasonalRecommendations()` (lines 90-130)

**What it should do:**
- Initialize 12 sub-seasons with base score 50
- Layer scoring from tea type, processing, flavor, harvest season
- Normalize and identify continuous ranges (e.g., "Spring through Early Summer")
- Return detailed season scores + simplified categories

**What it actually does:**
```javascript
if (processing?.roastLevel === 'Heavy') {
  bestSeasons = ['Autumn', 'Winter'];
}
// Only checks roast level
```

**Copy from:** `js/derivation/SeasonMatcher.js` (entire file, ~200+ lines)

---

### 3. ActivityMatcher - Completely Missing ❌
**File:** `RecommendationService.getActivityRecommendations()` (lines 207-243)

**What it should do:**
- Score 50+ activities (meditation, work, exercise, yoga, reading, socializing, etc.)
- Apply modifiers based on compounds, tea type, flavor
- Cluster related activities together
- Return detailed activity scores + clusters

**What it actually does:**
```javascript
if (lTheanineLevel >= 7 && caffeineLevel <= 3) {
  activities.push('Meditation', 'Relaxation', 'Reading', 'Contemplation');
}
// Only 4 hardcoded activities per profile
```

**Copy from:** `js/derivation/ActivityMatcher.js` (entire file, ~350+ lines)

---

### 4. FoodMatcher - Completely Missing ❌
**File:** `RecommendationService.getFoodRecommendations()` (lines 141-196)

**What it should do:**
- Initialize 100+ food items across cuisines
- Score based on flavor hints, flavor categories, mouthfeel, intensity, roast level
- Cluster by meal occasion (breakfast, lunch, dinner, dessert, snacks)
- Return detailed food scores + occasion groupings + reasoning

**What it actually does:**
```javascript
const categoryToFoods = {
  Floral: ['Light Desserts', 'Pastries', 'Spring Salads'],
  Fruity: ['Fruit Dishes', 'Desserts', 'Cheese'],
  // Only 7 categories, 3 foods each
};
```

**Copy from:** `js/derivation/FoodMatcher.js` (entire file, ~350+ lines)

---

### 5. Missing Reference Data - Completely Absent ❌
**Files needed:**

1. **FlavorInfluences** (maps each flavor to food pairings, seasonal affinity, activities)
   - Copy from: `js/descriptors/FlavorInfluences.js`
   - Use in: All matchers that deal with flavor

2. **ProcessingInfluences** (maps each processing method to flavor/body/energetic impacts)
   - Copy from: `js/descriptors/ProcessingInfluences.js`
   - Use in: ProcessingService, all matchers

3. **SeasonalFactors** (seasonal scoring profiles)
   - Copy from: `js/descriptors/SeasonalFactors.js`
   - Use in: SeasonMatcher

4. **GeographicalDescriptors** (altitude/humidity/temperature/radiation ranges)
   - Already used in: EffectService ✅
   - But format is messy (mixing strings and numbers)

---

## Missing Features (By Impact)

### High Impact
- [ ] 24-hour hourly timing algorithm
- [ ] 12-season detailed scoring algorithm
- [ ] 50+ activity database with clustering
- [ ] 100+ food database with occasion mapping
- [ ] Flavor influence reference data

### Medium Impact
- [ ] Trace/debug logging in all matchers
- [ ] Roast level adjustments to brewing parameters
- [ ] Detailed reasoning for each recommendation
- [ ] Meal occasion clustering

### Low Impact
- [ ] Unit tests for matchers
- [ ] Integration tests
- [ ] Support for additional tea types

---

## How to Fix (Implementation Path)

### Step 1: Create Descriptor System (2-3 hours)
1. Create `/backend/src/descriptors/` directory
2. Copy from frontend:
   - `FlavorInfluences.js`
   - `ProcessingInfluences.js`
   - `SeasonalFactors.js`
   - `TeaTypeDescriptors.js`
3. Update imports in services

### Step 2: Implement TimeMatcher (8-10 hours)
1. Create `TimingRecommendationService.js`
2. Copy & adapt algorithm from `js/derivation/TimeMatcher.js`
3. Test with known teas
4. Update `RecommendationService` to use it

### Step 3: Implement SeasonMatcher (8-10 hours)
1. Create `SeasonalRecommendationService.js`
2. Copy & adapt algorithm from `js/derivation/SeasonMatcher.js`
3. Test with known teas
4. Update `RecommendationService` to use it

### Step 4: Implement ActivityMatcher (8-10 hours)
1. Create `ActivityRecommendationService.js`
2. Copy & adapt algorithm from `js/derivation/ActivityMatcher.js`
3. Test with known teas
4. Update `RecommendationService` to use it

### Step 5: Implement FoodMatcher (10-12 hours)
1. Create `FoodRecommendationService.js`
2. Copy & adapt algorithm from `js/derivation/FoodMatcher.js`
3. Test with known teas
4. Update `RecommendationService` to use it

### Step 6: Add Trace Logging (4-6 hours)
1. Add trace arrays to all matchers
2. Log each scoring step
3. Return reasoning in results

### Step 7: Validation (4-6 hours)
1. Test against `_dataset/chinese_teas_validation_comprehensive.json`
2. Verify recommendations match `expectedEffects` and `recommendedContext`
3. Fix any discrepancies

**Total estimated effort: 50-60 hours**

---

## Quick Validation Test

After fixes, these should produce detailed output:

```javascript
// Should return hourly data, not just categories
const timing = await recommendationService.getTimingRecommendations(tea, coreAnalysis);
console.assert(timing.hourlyScores?.length === 24, "Should have 24 hours");
console.assert(timing.topHours?.length > 0, "Should have top hours");
console.assert(timing.idealRange?.start !== undefined, "Should have ideal range");

// Should return 12 seasons, not just 2-3
const seasonal = await recommendationService.getSeasonalRecommendations(tea, coreAnalysis);
console.assert(Object.keys(seasonal.detailed || {}).length >= 8, "Should score multiple seasons");
console.assert(seasonal.ranges?.length > 0, "Should have continuous ranges");

// Should return 20+ activities with clusters
const activities = await recommendationService.getActivityRecommendations(tea, coreAnalysis);
console.assert(activities.activities?.length >= 20, "Should have 20+ activities");
console.assert(activities.clusters !== undefined, "Should have activity clusters");

// Should return 30+ foods with occasion grouping
const food = await recommendationService.getFoodRecommendations(tea, coreAnalysis);
console.assert(food.foods?.length >= 30, "Should have 30+ foods");
console.assert(food.byOccasion !== undefined, "Should group by occasion");
```

---

## Key Insight: Why This Matters

The frontend uses **sophisticated algorithms** to create personalized, nuanced recommendations. The backend is **too simple** and loses all that intelligence.

**Example:** For "Golden Monkey Black Tea"
- **Frontend:** 24 different hour scores, identifies ideal window 7am-1pm
- **Backend:** "Morning" and "Early Afternoon"

**Example:** For seasonal timing
- **Frontend:** Scores all 12 seasons, identifies continuous "Autumn through Winter" range with 78+ scores
- **Backend:** Just hardcodes "Autumn" and "Winter"

The backend doesn't fail functionally, but it delivers *much less valuable* recommendations.

---

## Reference Implementation Timeline

| Week | Tasks |
|------|-------|
| Week 1 | Descriptors + TimeMatcher |
| Week 2 | SeasonMatcher + ActivityMatcher |
| Week 3 | FoodMatcher + Trace logging |
| Week 4 | Validation + Testing |

