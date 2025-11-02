# Known Issues & Development Tasks

**Current Branch:** `feature/form-integration-and-transport`
**Last Updated:** November 2, 2025

---

## 🔴 Critical Issues (Must Fix)

### 1. SeasonRenderer - Not Returning Recommendations

**Status:** ⚠️ **BLOCKING**

**Issue:**
- SeasonRenderer returns data but the transport layer can't find `result.recommendations`
- The renderer returns `{ recommendations: [...], seasonalScores: {...}, seasonalRange: {...}, analysis: {...} }`
- But the transport layer in `netlify/functions/tea-recommendation.js` only looks for `result.recommendations`

**Root Cause:**
- Transport layer calls: `new SeasonRenderer().render(geographyAnalysis)`
- SeasonRenderer expects 4 parameters: `render(geographyAnalysis, processingAnalysis, teaTypeAnalysis, flavorAnalysis)`
- Only receiving 1 parameter → insufficient data for matching

**Location:**
- **Renderer:** `endpoint/src/processors/renderers/SeasonRenderer.js:51`
- **Transport:** `netlify/functions/tea-recommendation.js:173`

**Fix Required:**
```javascript
// Current (line 173):
const result = new SeasonRenderer().render(geographyAnalysis);

// Should be:
const result = new SeasonRenderer().render(
  geographyAnalysis,
  processingAnalysis,
  teaTypeAnalysis,
  flavorAnalysis
);
```

**Impact:**
- ✅ All season recommendations currently return empty array `[]`
- ✅ Affects both production and trace modes

---

### 2. BrewingRenderer - No Recommendations Property

**Status:** ⚠️ **BLOCKING**

**Issue:**
- BrewingRenderer returns complex object: `{ tea: {...}, brewingStyles: [...], trace: [...], confidence: 0.85 }`
- Transport layer looks for `result.recommendations` property which doesn't exist
- Returns empty array for brewing recommendations

**Root Cause:**
- BrewingRenderer uses different structure: `brewingStyles` array instead of `recommendations`
- Transport layer expects standardized `recommendations` property (like Activity, Food, Time, Season)

**Location:**
- **Renderer:** `endpoint/src/processors/renderers/BrewingRenderer.js:146-200`
- **Transport:** `netlify/functions/tea-recommendation.js:176-179`

**Fix Required - Option 1 (Recommended):**
Normalize BrewingRenderer output to match other renderers:
```javascript
// In BrewingRenderer, after main return object:
// Add recommendations property that maps brewingStyles
return {
  ...existingData,
  recommendations: brewingStyles.map(style => ({
    method: style.style,
    parameters: style.parameters,
    guidance: style.guidance,
    vessels: style.vessels,
    score: 85
  }))
}
```

**Fix Required - Option 2:**
Update transport layer to handle BrewingRenderer's unique structure:
```javascript
if (renderers.includes('brewing')) {
  const result = new BrewingRenderer().render(formData);
  recommendations.brewing = result.brewingStyles || [];  // Use brewingStyles instead
}
```

**Impact:**
- ✅ All brewing recommendations currently return empty array `[]`
- ✅ Affects both production and trace modes
- ⚠️ Requires decision on which approach to use

---

### 3. TimeRenderer - Missing Time Period Labels

**Status:** ⚠️ **MAJOR**

**Issue:**
- TimeRenderer DOES return recommendations with hour data
- But `period` field is coming back as `undefined` in the test output
- UI shows "undefined (Score: 66)" instead of "Morning (Score: 66)"

**Root Cause:**
- TimeRenderer line 143: `period: this._getTimePeriod(hour)`
- The `_getTimePeriod()` method might not be mapping hours to human-readable periods
- Or the `hour` property isn't being included properly in recommendations

**Location:**
- **Renderer:** `endpoint/src/processors/renderers/TimeRenderer.js:139-154`
- **Method:** `endpoint/src/processors/renderers/TimeRenderer.js:_getTimePeriod()`

**Test Output Showing Issue:**
```
⏰ Time Recommendations:
   1. undefined (Score: 66)
   2. undefined (Score: 64)
   3. undefined (Score: 63)
```

**Fix Required:**
1. Check `_getTimePeriod()` method implementation
2. Verify it's returning: "Morning", "Afternoon", "Evening", "Night" (or similar)
3. Ensure `hour` property is preserved in recommendation object
4. Update recommendation to include both `hour` and `period`:
```javascript
{
  hour: 10,
  period: "Morning",
  score: 66
}
```

**Impact:**
- ✅ Recommendations appear but with missing labels
- ✅ Data is correct, just presentation issue
- ✅ Easy to fix (mapping issue)

---

## 🟡 Secondary Issues

### 4. Admin Form Not Integrated with API

**Status:** ⏳ **PENDING**

**Issue:**
- Form exists at `new admin/index.html`
- Test UI exists at `netlify/test-ui.html`
- But admin form is NOT calling the API

**Location:**
- **Form Service:** `new admin/js/services/apiService.js`
- **Form Display:** `new admin/js/modules/analysisDisplay.js`

**Required Steps:**
1. Update `apiService.js` to call `/.netlify/functions/tea-recommendation`
2. Update `analysisDisplay.js` to render response
3. Wire form submission → API call → display flow
4. Add loading states and error handling

**Expected Timeline:** 2-4 hours

---

## ✅ Completed Tasks

- ✅ Transport layer enhancement (dual format: production/trace)
- ✅ Selective renderer execution (renderers parameter)
- ✅ Test UI creation (`netlify/test-ui.html`)
- ✅ Development server (`dev-server.js`)
- ✅ Comprehensive test suite (`test-comprehensive.js`)
- ✅ Project documentation (`README.md`)
- ✅ ActivityRenderer working properly
- ✅ FoodRenderer working properly

---

## 📋 Development Roadmap

### Phase 1: Fix Broken Renderers (Current)
**Estimated:** 2-3 hours

- [ ] Fix SeasonRenderer parameter passing
- [ ] Fix BrewingRenderer recommendations structure
- [ ] Fix TimeRenderer period labels
- [ ] Run comprehensive tests to verify all fixes
- [ ] Manual testing with all 8 test teas

### Phase 2: Form Integration (Next)
**Estimated:** 2-4 hours

- [ ] Wire admin form to API
- [ ] Display recommendations in admin UI
- [ ] Add loading and error states
- [ ] Test end-to-end flow

### Phase 3: Production Optimization (Final)
**Estimated:** 2-4 hours

- [ ] Performance profiling
- [ ] Cache strategy (if needed)
- [ ] Edge case error handling
- [ ] Comprehensive validation testing

---

## 🧪 How to Verify Fixes

### After Fixing SeasonRenderer:

```bash
# Run comprehensive tests
node netlify/functions/test-comprehensive.js

# Expected output:
# 🌱 Season Recommendations:
#    1. Spring (Score: XX)
#    2. Summer (Score: XX)
#    ... (should NOT be empty)
```

### After Fixing BrewingRenderer:

```bash
# Should see brewing recommendations
# ☕ Brewing Recommendations:
#    1. Gongfu (Score: 85)
#    2. Western (Score: 75)
```

### After Fixing TimeRenderer:

```bash
# Should see named time periods
# ⏰ Time Recommendations:
#    1. Morning (Score: 66)
#    2. Afternoon (Score: 64)
#    3. Evening (Score: 63)
```

---

## 🔍 Test Data

8 reference teas in test UI for validation:
1. Gyokuro (calming, high L-Theanine)
2. Sencha (balanced)
3. Da Hong Pao (balanced, roasted)
4. Ali Shan Oolong (floral, high mountain)
5. Assam (high caffeine)
6. Silver Needle (low caffeine, delicate)
7. Aged Ripe Puerh (earthy, aged)
8. Ceremonial Matcha (high caffeine, umami)

Use these for testing before moving to admin form integration.

---

## 📊 Test Results Summary

### Current Status

**Production Format:** ✅ Working
- Activity: 3/3 recommendations ✅
- Food: 5/5 recommendations ✅
- Time: 5/5 recommendations (labels broken) ⚠️
- Season: 0/0 recommendations ❌
- Brewing: 0/0 recommendations ❌

**Trace Format:** ✅ Working
- All analyses present with confidence scores ✅
- Trace arrays populated ✅
- Only renderers with recommendations have trace data ✅

**Response Time:** ✅ Excellent
- Typical: 2-11ms
- Average: ~6ms per phase
- Total pipeline: ~12ms ✅

---

## 🛠️ Code References

### Key Files to Modify

1. **Fix Season:**
   - File: `netlify/functions/tea-recommendation.js:172-174`
   - Change: Add missing parameters to render() call

2. **Fix Brewing:**
   - Option A: `endpoint/src/processors/renderers/BrewingRenderer.js:146-200`
   - Option B: `netlify/functions/tea-recommendation.js:176-179`

3. **Fix TimeRenderer:**
   - File: `endpoint/src/processors/renderers/TimeRenderer.js`
   - Check: `_getTimePeriod()` method implementation
   - Fix: Ensure periods are being returned as strings not undefined

### Test Files

- Test comprehensive: `netlify/functions/test-comprehensive.js`
- Test transport: `netlify/functions/test-transport-layer.js`
- Test UI: `netlify/test-ui.html`

---

## 🚀 Quick Start for Fixes

1. **Start dev server**
   ```bash
   node dev-server.js
   ```

2. **In another terminal, test:**
   ```bash
   node netlify/functions/test-comprehensive.js
   ```

3. **After each fix, rerun test**
   ```bash
   node netlify/functions/test-comprehensive.js
   ```

4. **Visual testing:**
   - Open http://localhost:3000
   - Select different teas
   - Toggle format and renderers
   - Verify recommendations appear

---

## 📞 Notes

- All renderers follow same interface: `render(...) → { recommendations: [...], trace: [...], confidence: number }`
- SeasonRenderer and BrewingRenderer have different return structures that need alignment
- TimeRenderer works structurally but has data display issue
- No breaking changes needed to transport layer - just parameter passing
- Tests are comprehensive and will catch any regression

---

**Priority:** Fix SeasonRenderer and BrewingRenderer before admin form integration.
**Timeline:** Can be completed in 2-3 hours by a developer familiar with the codebase.

Last commit: `4faaf92` - Added transport layer enhancements and test UI
