# EffectService Threshold Analysis & Tuning Guide

**Current Accuracy:** 12.7% exact matches (9/71 teas)
**Target:** 70%+ accuracy

---

## Problem Summary

The EffectService is **over-producing "elevating" and "energizing" effects** while under-producing "grounding," "calming," "comforting," and "harmonizing" effects.

### Accuracy by Tea Type:
- ✅ **Puerh:** 50% (1/2) - Best performer
- ✅ **Dark:** 28.6% (2/7)
- ✅ **White:** 25% (3/12)
- ❌ **Green:** 14.3% (2/14) - Consistently predicting "focusing" instead of "calming"/"harmonizing"
- ❌ **Oolong:** 5.9% (1/17) - Consistently predicting "elevating" instead of "grounding"/"calming"
- ❌ **Yellow:** 0% (0/7) - Always getting wrong
- ❌ **Red:** 0% (0/12) - Always predicting "energizing" instead of "comforting"

### Effect Accuracy:
- ✅ **Perfect (100%):** calming→restorative, focusing→energizing
- ⚠️ **Partial (60%):** grounding→comforting
- ❌ **Failing (0%):**
  - harmonizing→elevating (0/4)
  - harmonizing→calming (0/8)
  - energizing→comforting (0/8)
  - grounding→grounding (0/5)
  - elevating→calming (0/2)
  - grounding→harmonizing (0/3)

---

## Root Cause Analysis

### Issue #1: OOLONG Over-Producing "Elevating"
**Problem:** 5/7 oolong mismatches calculate "elevating" when they should be "grounding" or "calming"

**Example Failures:**
- Wuyi Rock Oolong: Expected grounding/harmonizing → Got elevating/harmonizing
- Jin Xuan Milk Oolong: Expected calming/harmonizing → Got elevating/harmonizing
- Bao Zhong Oolong: Expected calming/harmonizing → Got elevating/harmonizing
- Dong Ding Oolong: Expected grounding/harmonizing → Got elevating/harmonizing

**Root Cause:** Oolong base effect weight is too high for "elevating"
```javascript
// CURRENT (line 41):
oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 }
                                       ↑ TOO HIGH
// Should be lower for heavily roasted oolongs which need grounding/comforting
```

**Data Evidence:**
- Wuyi Rock Oolong: heavy roast (should = grounding, not elevating)
- Shui Xian Oolong: strip-style roasted (should = grounding, not elevating)
- Roasted oolongs have 50%+ oxidation (should boost grounding, not elevating)

---

### Issue #2: GREEN Tea Over-Producing "Focusing"
**Problem:** 6/6 green mismatches get "focusing" when they should be "calming" or "harmonizing"

**Example Failures:**
- Dragon Well: Expected focusing/calming → Got focusing/energizing
- Lu Shan Yun Wu: Expected focusing/calming → Got focusing/energizing
- Tai Ping Hou Kui: Expected calming/harmonizing → Got focusing/elevating
- Mao Feng: Expected harmonizing/calming → Got focusing/elevating

**Root Cause:** Green tea effect weights don't account for L-theanine level properly
```javascript
// CURRENT (line 38):
green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 }
                                      ↑ FOCUSING TOO HIGH
                                      ↓ CALMING & HARMONIZING TOO LOW
```

**Data Evidence:**
- Dragon Well: L-theanine: 4/10 (high, should boost calming/harmonizing)
- Bi Luo Chun: L-theanine: 4.5/10 (should be more calming)
- Green teas with high L-theanine should prioritize harmonizing/calming over focusing

---

### Issue #3: RED/BLACK Tea Under-Producing "Comforting"
**Problem:** 0/8 red tea matches; all getting "energizing" when they should be "comforting"

**Example Failures:**
- Lapsang Souchong: Expected comforting/grounding → Got energizing/focusing
- Zheng He Gong Fu: Expected energizing/comforting → Got energizing/focusing (missing comforting)
- All black teas: Supporting should be "comforting" but always "focusing"

**Root Cause:** Red/Black tea effects don't weight roasting properly for comforting
```javascript
// CURRENT (line 42):
red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 }
                                      ↑ FOCUSING TOO HIGH AS SUPPORTING
// Roasted red teas (heavy/charcoal roast) should have higher comforting
```

**Data Evidence:**
- Lapsang Souchong: Pine-smoked (thermal tendency should boost comforting)
- Roast level: Heavy → should add +2.5 to comforting
- Current roast modifier only adds +1.5 max

---

### Issue #4: YELLOW Tea Always Wrong
**Problem:** 0/7 yellow tea matches

**Example Failures:**
- All yellow teas: Expected calming/harmonizing → Got elevating/harmonizing or harmonizing/elevating

**Root Cause:** Yellow tea base effects incorrect
```javascript
// CURRENT (line 40):
yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 }
                                             ↑ TOO HIGH FOR YELLOW
         └─ Yellow teas are lightly oxidized (8-15%), should be more calming than elevating
```

**Data Evidence:**
- Yellow teas are traditionally very soft, gentle, calming
- Meng Ding Huang Ya: L-theanine 4.5/10 (should boost calming significantly)
- Jun Shan Yin Zhen: L-theanine 4/10 (should be more calming than elevating)

---

### Issue #5: Geographic Weights Too Strong
**Problem:** High-altitude, high-humidity teas getting "elevating" when they should respect processing/roast

**Example:**
- Taiwanese High Mountain Oolong: altitude 1600m, humidity 85%
  - Expected: harmonizing/calming
  - Got: elevating/harmonizing
  - Issue: Geographic modifiers (alt +0.6 calming, humidity +0.3 elevating) override processing grounding effect

**Root Cause:** Geographic weight (2.0x) is too high relative to roast adjustments (1.5x)
```javascript
// Geographic boost for high altitude/humidity:
// altitude: high: { elevating: 0.6, calming: 0.4, restorative: 0.5 }
// humidity: veryHigh: { calming: 0.3, restorative: 0.2, harmonizing: 0.15 }
// Total: (0.6 + 0.3) * 2.0 = 1.8 points for elevating+calming
// But roast level (1.5x weight) can only add 2.5 max for grounding = 3.75 max

// Roast should dominate over geography for determining effect
```

---

## Fix Strategy

### Priority 1: Tea Type Base Effects (Lines 37-48)

**FIX #1: Reduce Oolong "elevating", increase "grounding" for heavy roasts**

Current:
```javascript
oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 }
```

Proposed:
```javascript
oolong: { harmonizing: 6.5, elevating: 5.5, focusing: 4, comforting: 5, grounding: 4.5 }
// Reasoning:
// - Reduce elevating from 7 to 5.5 (many oolongs are roasted, not light)
// - Keep harmonizing high (oolong's signature balance)
// - Add grounding: 4.5 (for roasted oolongs)
// - Keep comforting: 5 (roasted warmth)
```

**FIX #2: Reduce Green "focusing", increase "calming"**

Current:
```javascript
green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 }
```

Proposed:
```javascript
green: { harmonizing: 6, focusing: 4.5, calming: 5.5, elevating: 3, energizing: 3.5 }
// Reasoning:
// - Green teas are delicate with high L-theanine (avg 3.8/10)
// - Reduce focusing from 6 to 4.5 (L-theanine provides calming)
// - Increase calming from 4 to 5.5 (main characteristic)
// - Increase harmonizing to 6 (balanced, fresh)
```

**FIX #3: Increase Red/Black "comforting", reduce "focusing"**

Current:
```javascript
red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 }
```

Proposed:
```javascript
red: { energizing: 5.5, comforting: 7, focusing: 3, grounding: 4.5, harmonizing: 3.5 }
// Reasoning:
// - Black teas with roasting should prioritize comforting
// - Increase comforting from 6 to 7 (primary characteristic)
// - Reduce focusing from 4 to 3 (not the main effect)
// - Increase grounding to 4.5 (roasted warmth)
```

**FIX #4: Fix Yellow tea effects**

Current:
```javascript
yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 }
```

Proposed:
```javascript
yellow: { harmonizing: 7, calming: 6, elevating: 4, focusing: 3 }
// Reasoning:
// - Yellow teas are gentle, mild, calming (light oxidation)
// - Keep harmonizing: 7 (balanced, gentle)
// - Increase calming from 4 to 6 (soft profile)
// - Reduce elevating from 6 to 4 (too stimulating for soft teas)
// - Reduce focusing from 6 to 3 (not characteristic)
```

**FIX #5: Add Dark/Heicha support for "grounding"**

Current (line 43):
```javascript
dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 }
```

Keep as-is (this is working well with 28.6% accuracy for puerh):
```javascript
dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 }
// These heavy fermented teas need strong grounding/comforting - correct
```

---

### Priority 2: Compound Effect Modifiers (Lines 50-59)

**FIX #6: Reduce L-Theanine "calming" boost for moderate levels**

Current (line 56):
```javascript
'High L-Theanine': { calming: 3, harmonizing: 1, restorative: 0.5, comforting: 0.5 }
```

Proposed:
```javascript
'High L-Theanine': { calming: 3, harmonizing: 1.5, restorative: 1, comforting: 1 }
// Reasoning:
// - High L-theanine should also support harmonizing (balance)
// - Add comforting boost for smooth/creamy mouthfeel
```

**FIX #7: Keep Caffeine modifiers but refine thresholds**

Current (line 52-53):
```javascript
'Very High Caffeine': { energizing: 2, focusing: 2, grounding: -1, calming: -2 }
'High Caffeine': { energizing: 1, focusing: 1, calming: -1 }
```

These are reasonable. **No change needed.**

---

### Priority 3: Roast Level Impact (Lines 77-84)

**FIX #8: Increase roast modifiers for "comforting" and "grounding"**

Current (lines 78-80):
```javascript
Charcoal: { grounding: 3, comforting: 2, warming: 1 }
Heavy: { grounding: 2.5, comforting: 1.5, warming: 0.5 }
```

Proposed:
```javascript
Charcoal: { grounding: 3.5, comforting: 3, warming: 1.5, restorative: 0.5 }
Heavy: { grounding: 3, comforting: 2.5, warming: 1, restorative: 0.5 }
Medium: { comforting: 1, harmonizing: 0.5, grounding: 0.5 }
Light: { energizing: 1, elevating: 1, focusing: 0.5 }
Minimal: { elevating: 1, focusing: 1, harmonizing: 0.5 }
```

**Reasoning:**
- Heavy roasting should strongly support grounding/comforting
- Charcoal roast is strongest (add restorative too)
- Minimal roast supports elevating (not much thermal effect)

---

### Priority 4: Geographic Modifiers (Lines 91-123)

**FIX #9: Reduce altitude/humidity elevating boost for calm-biased teas**

The issue: High altitude + high humidity always adds elevating, but should respect roast level.

Current logic problem:
- High altitude adds: elevating +0.6, calming +0.4 → net +0.6 elevating
- High humidity adds: calming +0.3, restorative +0.2 → net +0.3 calming
- Together they compete (elevating vs calming)

Proposed solution:
- Reduce altitude "elevating" from 0.6 to 0.4
- Increase altitude "calming" from 0.4 to 0.5
- Keep humidity the same (it's fine)

```javascript
altitude: {
  veryLow: { energizing: 0.3, focusing: 0.1 },
  low: { harmonizing: 0.2, energizing: 0.1 },
  medium: { elevating: 0.3, harmonizing: 0.3, restorative: 0.2 },
  high: { calming: 0.6, elevating: 0.3, restorative: 0.5 }  // CHANGED: elevating 0.6→0.3
}
```

---

## Implementation Steps

### Step 1: Update TEA_TYPE_EFFECTS (Lines 37-48)
```javascript
// File: backend/src/services/EffectService.js
// Find lines 37-48 and replace with:

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

### Step 2: Update ROAST_LEVEL_MODIFIERS (Lines 77-84)
```javascript
// File: backend/src/services/EffectService.js
// Find lines 77-84 and replace with:

const ROAST_LEVEL_MODIFIERS = {
  Charcoal: { grounding: 3.5, comforting: 3, warming: 1.5, restorative: 0.5 },
  Heavy: { grounding: 3, comforting: 2.5, warming: 1, restorative: 0.5 },
  Medium: { comforting: 1, harmonizing: 0.5, grounding: 0.5 },
  Light: { energizing: 1, elevating: 1, focusing: 0.5 },
  Minimal: { elevating: 1, focusing: 1, harmonizing: 0.5 },
  None: {}
};
```

### Step 3: Update GEOGRAPHIC_EFFECT_MODIFIERS altitude (Lines 92-98)
```javascript
// File: backend/src/services/EffectService.js
// Find lines 92-98 and update altitude section:

altitude: {
  veryLow: { energizing: 0.3, focusing: 0.1 },
  low: { harmonizing: 0.2, energizing: 0.1 },
  medium: { elevating: 0.3, harmonizing: 0.3, restorative: 0.2 },
  high: { calming: 0.6, elevating: 0.3, restorative: 0.5 }  // CHANGED
}
```

### Step 4: Update COMPOUND_EFFECT_MODIFIERS (Line 56)
```javascript
// File: backend/src/services/EffectService.js
// Find line 56 and update:

'High L-Theanine': { calming: 3, harmonizing: 1.5, restorative: 1, comforting: 1 },
```

---

## Validation Plan

### Step 1: Apply fixes to EffectService.js
- Update TEA_TYPE_EFFECTS
- Update ROAST_LEVEL_MODIFIERS
- Update GEOGRAPHIC_EFFECT_MODIFIERS
- Update COMPOUND_EFFECT_MODIFIERS

### Step 2: Run validation test
```bash
node test-validation-effect-matching.js
```

### Step 3: Check accuracy by type
- Target: Oolong 50%+ (from 5.9%)
- Target: Green 60%+ (from 14.3%)
- Target: Yellow 60%+ (from 0%)
- Target: Red 60%+ (from 0%)

### Step 4: If still below target, run verbose analysis
```bash
node test-validation-effect-matching.js --verbose --type=oolong
```

### Step 5: Iterate on problem types
- Start with worst performers (yellow, red)
- Then fix green and oolong
- Fine-tune white/puerh last

---

## Expected Impact

### After Priority 1 & 2 fixes (Tea Types + Compounds):
- **Green teas:** 14.3% → 50%+ (reduce over-focusing)
- **Yellow teas:** 0% → 50%+ (fix base effects)
- **Red teas:** 0% → 40%+ (increase comforting)
- **Oolong teas:** 5.9% → 30%+ (reduce over-elevating)
- **Overall:** 12.7% → 25-30%

### After Priority 3 & 4 fixes (Roast + Geography):
- **All roasted teas:** +15-20% accuracy
- **High-altitude teas:** +10% accuracy
- **Overall:** 30% → 50%+

### Final target: 70%+ accuracy
- May require tuning of supporting effect selection algorithm
- May need flavor category weighting adjustments
- Consider dataset edge cases

---

## Monitoring Metrics

Track these during iteration:

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Overall accuracy | 12.7% | 70%+ | P0 |
| Oolong accuracy | 5.9% | 50%+ | P0 |
| Yellow accuracy | 0% | 70%+ | P0 |
| Red accuracy | 0% | 60%+ | P0 |
| Green accuracy | 14.3% | 60%+ | P1 |
| Partial matches | 53.5% | <10% | P1 |

---

## Notes

- **Why not 100% accuracy?** Some teas in the dataset may have conflicting factors (e.g., high caffeine but high altitude → conflicting effects). Aim for 70-80% as realistic target.

- **Order matters:** Always test Priority 1 before Priority 2 before Priority 3, because earlier priorities have larger impact.

- **Preserve White/Puerh:** These types are working well (25% and 50%). Be careful not to break them while fixing others.

- **Complementary effects:** The supporting effect selection (lines 352-385) may also need tuning once dominant effects are correct.

