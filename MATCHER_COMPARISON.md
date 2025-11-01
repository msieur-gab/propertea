# ActivityMatcher & FoodMatcher Comparison: Backend vs JS

## Summary
Both systems have **identical architecture and scoring logic** - they appear to be synchronized copies. The JS version is the original source, and the backend version is a port.

## Key Observations

### ActivityMatcher Comparison

| Aspect | Backend | JS |
|--------|---------|-----|
| **Config defaults** | `maxRecommendations: 6` | `maxRecommendations: 3` |
| **Config defaults** | `clusterThreshold: 65` | `clusterThreshold: 80` |
| **Base score** | 50 | 50 |
| **Scoring logic** | Identical | Identical |
| **Activity clusters** | Same 8 clusters | Same 8 clusters |
| **Tea type hints** | No extraction | No extraction |
| **Flavor hints** | No extraction | No extraction |

**Key Issue**: Both are missing **active tea-type-specific bonuses**
- For Oolong: No boost for "Tea Ceremony", "Social Gatherings", "Reflection"
- For Green: No specific boosts for calm/relaxation activities
- For Dark/Aged: No boosts for meditation/grounding activities

### FoodMatcher Comparison

| Aspect | Backend | JS |
|--------|---------|-----|
| **Config defaults** | `maxRecommendations: 8` | `maxRecommendations: 5` |
| **Config defaults** | `clusterThreshold: 60` | `clusterThreshold: 75` |
| **Base score** | 50 | 50 |
| **Flavor mappings** | Identical | Identical |
| **Food clusters** | Same 9 occasions | Same 9 occasions |
| **Scoring logic** | Identical | Identical |

**Key Issue**: Both use generic flavor→food mappings without **tea-type awareness**
- No special bonuses for oolong-appropriate foods
- No distinction between high-oxidation vs low-oxidation teas
- No processing-based recommendations

## Root Cause Analysis

### Problem 1: No Tea-Type-Specific Activity Bonuses

Current code for Tie Guan Yin (Oolong):
```
1. Initialize all activities to score 50
2. Check compound profile: "Balanced" → adds +15 to Social Gatherings only
3. Result: Most activities stay at base 50, so "Casual Sipping" and "General Enjoyment" win at 100%
```

Expected behavior:
```
1. Initialize all activities to score 50
2. Detect tea type is "oolong"
3. ADD TEA-TYPE BONUS: +30 to "Tea Ceremony", +25 to "Social Gatherings", +20 to "Reflection", etc.
4. Result: Domain-appropriate activities score 75-80%
```

### Problem 2: No Flavor-Aware Scoring

Current code:
```
- Floral oolong? → All activities treated identically
- Does Tie Guan Yin have "Orchid" flavor? → Not used in activity matching
```

Expected behavior:
```
- Detect "Floral" flavor profile
- Boost "Contemplation", "Mindfulness Practice", "Appreciation"
- Boost "Social Gatherings" for shared experiences
```

### Problem 3: No Processing/Oxidation Awareness

Current code:
```
- Heavily roasted oolong? → No special food boost
- Light-oxidized oolong? → No special food boost
```

Expected behavior:
```
- For roasted teas: Boost "Roasted Meats", "Grilled Fish", "Dark Chocolate"
- For light-oxidized: Boost "Light Desserts", "Fresh Vegetables", "Seafood"
```

## Recommendation

**Add Tea-Type-Specific Scoring Bonuses** to BOTH systems in parallel:

### For ActivityMatcher.js/ActivityMatcher.js (backend):
```javascript
// After line 166 (after compound profile checks), add:
if (primaryTeaType && primaryTeaType.includes('oolong')) {
  this.addActivityWithTrace(trace, activityScores, "Tea Ceremony", 30, "Tea Type Bonus", "Oolong tea");
  this.addActivityWithTrace(trace, activityScores, "Social Gatherings", 25, "Tea Type Bonus", "Oolong tea");
  this.addActivityWithTrace(trace, activityScores, "Reflection", 20, "Tea Type Bonus", "Oolong tea");
  this.addActivityWithTrace(trace, activityScores, "Appreciation", 15, "Tea Type Bonus", "Oolong tea");
}

if (primaryTeaType && primaryTeaType.includes('green')) {
  this.addActivityWithTrace(trace, activityScores, "Relaxation", 20, "Tea Type Bonus", "Green tea");
  this.addActivityWithTrace(trace, activityScores, "Contemplation", 15, "Tea Type Bonus", "Green tea");
  this.addActivityWithTrace(trace, activityScores, "Daily Enjoyment", 15, "Tea Type Bonus", "Green tea");
}
// ... etc for other tea types
```

### For FoodMatcher.js/FoodMatcher.js (backend):
```javascript
// Add roast-aware scoring:
if (flavorProfile.includes('roasted') || flavorProfile.includes('toasted')) {
  this.addFoodWithScore(scoreMap, "Grilled Meats", 25, "Roast bonus");
  this.addFoodWithScore(scoreMap, "Dark Chocolate", 20, "Roast bonus");
  this.addFoodWithScore(scoreMap, "Roasted Nuts", 20, "Roast bonus");
}

// Add oxidation-level aware scoring:
if (oxidationLevel > 50) { // Heavily roasted
  this.addFoodWithScore(scoreMap, "Aged Cheese", 20, "High oxidation");
} else { // Light oxidation
  this.addFoodWithScore(scoreMap, "Fresh Vegetables", 15, "Light oxidation");
  this.addFoodWithScore(scoreMap, "Seafood", 15, "Light oxidation");
}
```

## Files to Modify

1. **Backend**: `/home/msieur-gab/propertea/backend/src/services/matchers/ActivityMatcher.js` (lines 166-185)
2. **Backend**: `/home/msieur-gab/propertea/backend/src/services/matchers/FoodMatcher.js` (add tea-type detection)
3. **JS**: `/home/msieur-gab/propertea/js/derivation/ActivityMatcher.js` (same as backend)
4. **JS**: `/home/msieur-gab/propertea/js/derivation/FoodMatcher.js` (same as backend)

## Expected Impact

With tea-type-specific bonuses:
- **Activities**: Should improve from 0% success to ~40-60% success (100% matches)
- **Foods**: Should improve from 0-6.7% success to ~30-50% success

This is the **most effective fix** without rewriting the entire matching system.
