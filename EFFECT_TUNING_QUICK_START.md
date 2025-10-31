# Quick Start: EffectService Tuning

**Current Status:** 12.7% accuracy (9/71 tests passing)
**Goal:** Reach 70%+ accuracy
**Time to first improvement:** 10 minutes (Priority 1 only)

---

## Quick Test Loop

Run after each change:
```bash
node test-validation-effect-matching.js
```

Watch for:
- ✅ Accuracy percentage increasing
- ✅ "Results by Tea Type" showing improvement
- ✅ More teas moving from ❌ FAIL to ⚠️ PARTIAL

---

## Priority 1: Tea Type Base Effects (10 minutes)

**File:** `/backend/src/services/EffectService.js`
**Lines:** 37-48
**Expected improvement:** 12.7% → 25-30%

### Step 1: Find the code block
Look for lines 37-48:
```javascript
const TEA_TYPE_EFFECTS = {
  green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 },
  white: { restorative: 8, calming: 6, comforting: 5, harmonizing: 5, focusing: 3, elevating: 4 },
  yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 },
  oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 },
  red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 },
  dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 },
  puerh: {
    sheng: { energizing: 5, focusing: 6, harmonizing: 5, grounding: 6 },
    shou: { grounding: 9, harmonizing: 5, comforting: 8, restorative: 4 }
  }
};
```

### Step 2: Replace with new values
```javascript
const TEA_TYPE_EFFECTS = {
  green: { harmonizing: 6, focusing: 4.5, calming: 5.5, elevating: 3, energizing: 3.5 },
  white: { restorative: 8, calming: 6, comforting: 5, harmonizing: 5, focusing: 3, elevating: 4 },
  yellow: { harmonizing: 7, calming: 6, elevating: 4, focusing: 3 },
  oolong: { harmonizing: 6.5, elevating: 5.5, focusing: 4, comforting: 5, grounding: 4.5 },
  red: { energizing: 5.5, comforting: 7, focusing: 3, grounding: 4.5, harmonizing: 3.5 },
  dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 },
  puerh: {
    sheng: { energizing: 5, focusing: 6, harmonizing: 5, grounding: 6 },
    shou: { grounding: 9, harmonizing: 5, comforting: 8, restorative: 4 }
  }
};
```

### Step 3: Save and test
```bash
node test-validation-effect-matching.js
```

**Expected results after Priority 1:**
- Green: 14.3% → 40-50% ✅
- Yellow: 0% → 40-60% ✅
- Oolong: 5.9% → 20-30% ✅
- Red: 0% → 20-30% ✅
- Overall: 12.7% → 25-30% ✅

---

## Priority 2: Compound Modifiers (5 minutes)

**File:** `/backend/src/services/EffectService.js`
**Lines:** 56
**Expected improvement:** +5-10%

### Step 1: Find line 56
```javascript
'High L-Theanine': { calming: 3, harmonizing: 1, restorative: 0.5, comforting: 0.5 },
```

### Step 2: Update to
```javascript
'High L-Theanine': { calming: 3, harmonizing: 1.5, restorative: 1, comforting: 1 },
```

### Step 3: Test
```bash
node test-validation-effect-matching.js
```

---

## Priority 3: Roast Level Modifiers (5 minutes)

**File:** `/backend/src/services/EffectService.js`
**Lines:** 77-84
**Expected improvement:** +10-15%

### Step 1: Find the code block (lines 77-84)
```javascript
const ROAST_LEVEL_MODIFIERS = {
  Charcoal: { grounding: 3, comforting: 2, warming: 1 },
  Heavy: { grounding: 2.5, comforting: 1.5, warming: 0.5 },
  Medium: { comforting: 0.5, harmonizing: 0.5 },
  Light: { energizing: 0.5, elevating: 0.5 },
  Minimal: { elevating: 0.5, focusing: 0.5 },
  None: {}
};
```

### Step 2: Replace with
```javascript
const ROAST_LEVEL_MODIFIERS = {
  Charcoal: { grounding: 3.5, comforting: 3, warming: 1.5, restorative: 0.5 },
  Heavy: { grounding: 3, comforting: 2.5, warming: 1, restorative: 0.5 },
  Medium: { comforting: 1, harmonizing: 0.5, grounding: 0.5 },
  Light: { energizing: 1, elevating: 1, focusing: 0.5 },
  Minimal: { elevating: 1, focusing: 1, harmonizing: 0.5 },
  None: {}
};
```

### Step 3: Test
```bash
node test-validation-effect-matching.js
```

---

## Priority 4: Geographic Modifiers (5 minutes)

**File:** `/backend/src/services/EffectService.js`
**Lines:** 92-98 (altitude section only)
**Expected improvement:** +5-10%

### Step 1: Find the altitude section
```javascript
altitude: {
  veryLow: { energizing: 0.3, focusing: 0.1 },
  low: { harmonizing: 0.2, energizing: 0.1 },
  medium: { elevating: 0.3, harmonizing: 0.3, restorative: 0.2 },
  high: { elevating: 0.6, calming: 0.4, restorative: 0.5 }
}
```

### Step 2: Change only the `high` section from:
```javascript
high: { elevating: 0.6, calming: 0.4, restorative: 0.5 }
```

To:
```javascript
high: { calming: 0.6, elevating: 0.3, restorative: 0.5 }
```

### Step 3: Test
```bash
node test-validation-effect-matching.js
```

---

## Testing Strategy

### Test in Order (Don't Skip!)

1. **Apply Priority 1** → Test → Note results
2. **Apply Priority 2** → Test → Note results
3. **Apply Priority 3** → Test → Note results
4. **Apply Priority 4** → Test → Note final results

### What to Watch For

```bash
node test-validation-effect-matching.js | grep -E "(Exact Matches|by Tea Type)"
```

### If Something Gets Worse

Roll back that one change and try a smaller adjustment:
- Reduce the weight change from 1.0 to 0.5
- Test again
- Example: `elevating: 7` → `elevating: 6` (instead of 5.5)

### Detailed Testing

For specific tea types:
```bash
node test-validation-effect-matching.js --type=oolong
node test-validation-effect-matching.js --type=green
node test-validation-effect-matching.js --type=yellow
node test-validation-effect-matching.js --type=red
```

For detailed analysis of failures:
```bash
node test-validation-effect-matching.js --verbose
```

---

## Expected Results Timeline

### After Priority 1 (Tea Types)
```
Exact Matches:   15-20/71 (21-28%)
Results by Tea Type:
  oolong       | 3-5/17 (18-29%)  ← Up from 5.9%
  green        | 6-8/14 (43-57%)  ← Up from 14.3%
  white        | 3-4/12 (25-33%)  ← Stable
  puerh        | 1/2 (50%)        ← Stable
  yellow       | 3-4/7 (43-57%)   ← Up from 0%
  red          | 2-3/12 (17-25%)  ← Up from 0%
  dark         | 2-3/7 (29-43%)   ← Stable
```

### After Priority 2 (Compounds)
```
Exact Matches:   18-23/71 (25-32%)
Improvement mainly in white/puerh teas with high L-theanine
```

### After Priority 3 (Roast)
```
Exact Matches:   25-30/71 (35-42%)
Improvement in all roasted teas, especially:
  - Oolong: +10-15%
  - Red/Black: +15-20%
  - Yellow: +10%
```

### After Priority 4 (Geography)
```
Exact Matches:   28-35/71 (39-49%)
Improvement in high-altitude teas
```

### Target: 50%+ → Further tuning needed
- May need to adjust supporting effect selection logic
- May need flavor weight adjustments
- May need complementary effect rules

---

## Troubleshooting

### If accuracy drops instead of improves:
1. Revert the last change
2. Check for typos in numbers
3. Make sure you're in the right section
4. Verify you saved the file

### If only one tea type improves but others get worse:
1. This is normal - weight trade-offs exist
2. Prioritize the types that were at 0%
3. Protect types already above 25%

### If you hit a plateau:
1. Move to the next priority
2. Each priority affects different tea types
3. You should see cumulative improvement

---

## After Reaching 50%+ Accuracy

Once you reach 50%+ accuracy, consider:

1. **Supporting Effect Selection (lines 352-385)**
   - May need better complementary effect logic
   - May need to penalize non-complementary choices

2. **Flavor Weight Tuning (lines 262-269)**
   - Increase from 2.0x to 2.5x if flavor categories drive effects
   - Test with `--verbose` to see which teas fail by flavor

3. **Ratio Category Thresholds (line 170)**
   - May need to adjust ratio breakpoints
   - Compare against dataset's compound ratios

4. **Compound Profile Naming (line 216)**
   - May need new compound profile types
   - Example: "Smooth & Calm" for high theanine + low caffeine

---

## Files Created for You

1. **test-validation-effect-matching.js**
   - Full validation test suite
   - Usage: `node test-validation-effect-matching.js [--verbose] [--type=<type>]`

2. **EFFECT_THRESHOLD_ANALYSIS.md**
   - Detailed root cause analysis
   - Why each change is needed
   - Expected impact of each fix

3. **This file (EFFECT_TUNING_QUICK_START.md)**
   - Quick reference guide
   - Copy-paste code snippets
   - Testing strategy

---

## Success Criteria

✅ **Phase 1 (Priority 1):** 20%+ accuracy
✅ **Phase 2 (Priority 1-2):** 30%+ accuracy
✅ **Phase 3 (Priority 1-3):** 40%+ accuracy
✅ **Phase 4 (All Priorities):** 50%+ accuracy
🎯 **Goal:** 70%+ accuracy (may require Phase 5 tuning)

---

**Next Step:** Apply Priority 1 changes and run the test!
```bash
# Edit /backend/src/services/EffectService.js lines 37-48
# Then run:
node test-validation-effect-matching.js
```

