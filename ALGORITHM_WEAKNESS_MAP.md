# Algorithm Weakness Map & Refinement Guide

**Generated**: 2025-10-31
**Test Dataset**: 54 Unique Teas (Comprehensive)
**Current Accuracy**: 55.6%

---

## Executive Summary

The algorithm has **strong foundations** but exhibits **systematic biases** in effect calculation. Key findings:

- ✅ **Fermented teas (Puerh, Dark/Heicha)**: 100% - 75% accuracy
- ✅ **Restorative & Grounding effects**: 67% - 89% accuracy
- ❌ **Green tea**: 33% accuracy (major issue)
- ❌ **Oolong dominance**: 53% accuracy, over-returns "elevating"
- ❌ **Red tea bias**: Returns "grounding" instead of "energizing"
- ❌ **Comforting effect**: 0% accuracy (completely broken)

---

## Part 1: Tea Type Analysis

### 1. GREEN TEA - **33% Accuracy** ⚠️ CRITICAL ISSUE

**Problem**: Almost ALL green teas return `dominant="focusing" + supporting="energizing"` regardless of expected effect.

**Expected vs Actual**:
```
Dragon Well Green Tea
  Expected: focusing + calming
  Got:      focusing + energizing ❌

Bi Luo Chun
  Expected: harmonizing + focusing
  Got:      focusing + elevating ❌

Huo Shan Huang Ya Green Tea
  Expected: harmonizing + calming
  Got:      focusing + energizing ❌

Tai Ping Hou Kui Green Tea
  Expected: calming + harmonizing
  Got:      focusing + elevating ❌

En Shi Yu Lu Green Tea
  Expected: calming + focusing
  Got:      focusing + energizing ❌

Mao Feng Green Tea
  Expected: harmonizing + calming
  Got:      focusing + elevating ❌

Tian Mu Qing Ding Green Tea
  Expected: calming + focusing
  Got:      focusing + energizing ❌
```

**Only Successes (2 out of 12 green teas)**:
- [21] Liu An Gua Pian: focusing + energizing ✓✓ (perfect match)
- [3] Dragon Well: focusing + energizing ✓ (partial - got dominant right)

**Root Cause Analysis**:

1. **Green tea base effects too strong**: Current definition:
   ```javascript
   green: { energizing: 5, focusing: 7, harmonizing: 5, calming: 2, elevating: 4 }
   ```
   - `focusing: 7` (highest) always wins as dominant
   - `energizing: 5` (second highest) always wins as supporting
   - `calming: 2` (too low) never competes

2. **L-Theanine modifier too weak**: Green teas have high L-Theanine (3.5-4.5) which SHOULD trigger calming, but:
   ```javascript
   'High L-Theanine': { calming: 2, harmonizing: 1, restorative: 0.5, comforting: 0.5 }
   ```
   This `calming: 2` modifier is insufficient against the base `focusing: 7`.

**Proposed Fixes** (Priority: VERY HIGH):

**Option A**: Rebalance green tea base effects to reflect actual variety
```javascript
// Current (broken)
green: { energizing: 5, focusing: 7, harmonizing: 5, calming: 2, elevating: 4 }

// Proposed - reduce focusing dominance
green: { focusing: 6, energizing: 4, harmonizing: 5, calming: 4, elevating: 3 }
// This allows calming to compete when L-Theanine is high
```

**Option B**: Boost L-Theanine modifiers for green teas
```javascript
// When green tea has high L-Theanine, add special handling:
if (canonicalTeaType === 'green' && relaxationLevel === 'High') {
  // Boost calming effect
  compoundModifier = { calming: 3, harmonizing: 1.5, restorative: 1 };
}
```

**Option C**: Add green tea-specific compound logic
```javascript
// In CompoundService: green teas with L-Theanine > 4.0 should favor calming
// This recognizes shade-grown greens (high L-theanine) are more relaxing
```

**Recommendation**: Use **Option A + B** - Rebalance base effects AND boost L-Theanine handling for green tea specifically.

**Expected Impact**: Should improve green tea accuracy from 33% → 75%+ (6-10 more correct)

---

### 2. OOLONG - **53% Accuracy** ⚠️ HIGH PRIORITY ISSUE

**Problem**: Oolong almost always returns `dominant="elevating"` instead of expected diverse effects.

**Current Definition**:
```javascript
oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 }
```

**Issue**: `elevating: 7` ties with `harmonizing: 7` for highest score. When there's a tie, "elevating" wins consistently.

**Expected vs Actual - Pattern**:
```
Traditional Tie Guan Yin (light roast)
  Expected: harmonizing + elevating
  Got:      elevating + harmonizing ❌ (SWAPPED!)

Taiwanese High Mountain (light oxidation)
  Expected: harmonizing + calming
  Got:      elevating + harmonizing ❌ (Wrong dominant)

Shui Xian (medium-heavy roast)
  Expected: grounding + comforting
  Got:      harmonizing + elevating ❌ (Completely wrong!)

Jin Xuan Milk Oolong (light)
  Expected: calming + harmonizing
  Got:      harmonizing + elevating ❌ (Wrong supporting)

Bao Zhong (light oxidation)
  Expected: calming + harmonizing
  Got:      elevating + harmonizing ❌ (Wrong dominant)

Dong Ding (medium roast)
  Expected: grounding + harmonizing
  Got:      elevating + harmonizing ❌ (Heavily roasted but not grounding!)
```

**Only Success (3 out of 15 oolong)**:
- [15] Huang Jin Gui: elevating + harmonizing ✓✓ (perfect)
- [42] Guei Fei: harmonizing + elevating ✓✓ (perfect)
- [40] Da Hong Pao: elevating + harmonizing ✓ (partial - got supporting right)

**Root Cause Analysis**:

1. **Missing roast-level differentiation**: Heavy-roasted oolongs should return "grounding", not "elevating"
   - Wuyi Rock (heavy roast) → expects grounding, gets elevating
   - Shui Xian (medium-heavy roast) → expects grounding, gets harmonizing/elevating
   - Dong Ding (traditional roast) → expects grounding, gets elevating

2. **Roast weight insufficient**: Current processing modifiers:
   ```javascript
   Heavy: { grounding: 2.5, comforting: 1.5, warming: 0.5 }  // weight: 1.5x
   Medium: { comforting: 0.5, harmonizing: 0.5 }
   ```
   This `grounding: 2.5 × 1.5 = 3.75` is too weak against base `elevating: 7 × 2.5 = 17.5`

3. **Complementary effect selection**: When dominant is "elevating", supporting picks from:
   ```javascript
   elevating: ['calming', 'harmonizing', 'focusing', 'energizing']
   ```
   But "harmonizing" wins (score: 7), so we always get "elevating + harmonizing"

**Proposed Fixes** (Priority: HIGH):

**Fix 1**: Increase processing weight multiplier for roasted oolongs
```javascript
// In EffectService._buildEffectScores():
// Change from 1.5x to 2.5x for heavy roasts
const processingWeight = roastLevel === 'Heavy' ? 2.5 : 1.5;

// Heavy: { grounding: 2.5 × 2.5 = 6.25 } vs base elevating: 7 × 2.5 = 17.5
// Still not enough - see Fix 2
```

**Fix 2**: Add oolong-specific roast handling
```javascript
if (canonicalTeaType === 'oolong') {
  if (roastLevel === 'Heavy') {
    // Heavily roasted oolongs should be grounding-forward
    scores.grounding = (scores.grounding || 0) + 5;  // Boost grounding
    scores.elevating = Math.max(0, scores.elevating - 3);  // Reduce elevating
  } else if (roastLevel === 'Medium') {
    // Medium-roasted should balance elevating with grounding
    scores.grounding = (scores.grounding || 0) + 2;
  }
}
```

**Fix 3**: Rebalance oolong base effects to reduce elevating dominance
```javascript
// Current
oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 }

// Proposed - reduce elevating, add grounding capacity
oolong: { harmonizing: 7, focusing: 5, elevating: 5, comforting: 5, grounding: 4 }
// This gives grounding a fighting chance for heavily roasted varieties
```

**Recommendation**: Use **Fix 2 + Fix 3** - Add roast-specific logic for oolong AND rebalance base effects.

**Expected Impact**: Should improve oolong accuracy from 53% → 70%+ (4-5 more correct)

---

### 3. RED TEA - **63% Accuracy** ⚠️ MEDIUM PRIORITY ISSUE

**Problem**: Red teas consistently return `dominant="grounding"` instead of `dominant="energizing"`.

**Expected vs Actual**:
```
Lapsang Souchong (smoked)
  Expected: comforting + grounding
  Got:      grounding + comforting ❌ (SWAPPED!)

Golden Monkey (high caffeine)
  Expected: energizing + comforting
  Got:      grounding + comforting ❌ (Missing energizing!)

Zheng He Gong Fu (high caffeine)
  Expected: energizing + comforting
  Got:      grounding + comforting ❌ (Missing energizing!)

Keemun Hao Ya (balanced)
  Expected: focusing + elevating
  Got:      harmonizing + grounding ❌ (Completely wrong!)

Bailin Gong Fu (high caffeine)
  Expected: energizing + comforting
  Got:      energizing + focusing ✓ (partial - got dominant right!)

Ying De Hong (high caffeine, CTC)
  Expected: energizing + comforting
  Got:      grounding + comforting ❌ (Missing energizing!)

Jin Jun Mei (delicate)
  Expected: elevating + harmonizing
  Got:      grounding + comforting ❌ (Completely wrong!)

Yunnan Dian Hong (high altitude)
  Expected: energizing + comforting
  Got:      energizing + focusing ✓ (partial - comforting missing!)
```

**Root Cause Analysis**:

Current red tea definition:
```javascript
red: { energizing: 5, focusing: 5, harmonizing: 4, grounding: 6, comforting: 5 }
```

**Issue**: `grounding: 6` (highest) always wins as dominant, even for high-caffeine red teas that should be energizing.

Red teas have **4.0 caffeine level** on average (high!), which should trigger energizing, but:
```javascript
'High Caffeine': { energizing: 1, focusing: 1, calming: -1 }  // weight: 2.0x
```
This `energizing: 1 × 2.0 = 2.0` can't overcome base `grounding: 6 × 2.5 = 15.0`

**Proposed Fixes** (Priority: MEDIUM):

**Fix 1**: Boost caffeine modifier for red tea
```javascript
// Add red-tea-specific caffeine handling
if (canonicalTeaType === 'red' && stimulationLevel === 'High') {
  compoundModifier = { energizing: 2, focusing: 1.5, grounding: -1 };
  // This creates: energizing: 2 × 2.8 = 5.6, grounding base: 15.0 - 1×2.8 = 12.2
  // Still not enough - see Fix 2
}
```

**Fix 2**: Rebalance red tea base effects
```javascript
// Current
red: { energizing: 5, focusing: 5, harmonizing: 4, grounding: 6, comforting: 5 }

// Proposed - reduce grounding, boost energizing for high-caffeine nature
red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 }
// energizing and comforting now compete with grounding
```

**Recommendation**: Use **Fix 2** - Rebalance base effects to recognize red tea's energizing caffeine profile.

**Expected Impact**: Should improve red tea accuracy from 63% → 75%+ (2-3 more correct)

---

### 4. WHITE TEA - **57% Accuracy** ✓ ACCEPTABLE BUT IMPROVABLE

**Problems**:
1. Shou Mei White Tea (earthier, aged) expected "comforting + grounding" but gets "restorative + calming"
2. Aged White Tea Cake (medicinal, aged) expected "restorative + comforting" but gets "calming + restorative"
3. White Darjeeling (elevated altitude) expected "elevating + calming" but gets "calming + restorative"

**Root Cause**:
Current definition prioritizes "restorative" for ALL white teas:
```javascript
white: { restorative: 8, calming: 6, harmonizing: 5, focusing: 3, elevating: 4 }
```

This doesn't account for **aged/darker white teas** that should be more "comforting/grounding".

**Proposed Fixes** (Priority: LOW):

**Fix**: Add white tea subtype awareness
```javascript
// Check if white tea is aged/earthier (Shou Mei, old white cake)
if (canonicalTeaType === 'white' && flavorCategories.includes('Earthy/Mineral')) {
  scores.comforting = (scores.comforting || 0) + 3;
  scores.grounding = (scores.grounding || 0) + 2;
  scores.restorative = Math.max(0, scores.restorative - 1);
}
```

**Expected Impact**: Should improve white tea accuracy from 57% → 70%+ (2 more correct)

---

### 5. PUERH & DARK TEA - **75-100% Accuracy** ✅ EXCELLENT

**Status**: These are working well! Dark/Heicha (75%) and Puerh (100%) have solid algorithms.

**Minor Issue**: Some dark teas expect "grounding + grounding" (Liu Bao, Fu Zhuan) but supporting effect calculates to "comforting" instead.

This is actually reasonable since tea can't have same effect twice, and "comforting" is a close pair with "grounding" for fermented teas.

**Recommendation**: No changes needed - maintain current approach.

---

### 6. YELLOW TEA - **50% Accuracy** ⚠️ MEDIUM PRIORITY

**Problem**: Yellow teas have **50% effect reversal** issue (dominant/supporting swapped).

**Expected vs Actual**:
```
Meng Ding Huang Ya
  Expected: calming + harmonizing
  Got:      harmonizing + calming ❌ (SWAPPED!)

Huoshan Huang Ya
  Expected: calming + harmonizing
  Got:      harmonizing + calming ❌ (SWAPPED!)

Mo Gan Huang Ya
  Expected: calming + harmonizing
  Got:      harmonizing + calming ❌ (SWAPPED!)
```

**Root Cause**: Yellow tea base effects:
```javascript
yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 }
```

When `harmonizing: 7` and `calming: 4` are close competitors with modifiers, sometimes harmonizing wins as dominant when calming should.

**Proposed Fixes** (Priority: MEDIUM):

**Fix**: Adjust yellow tea base effects to prefer calming
```javascript
// Current
yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 }

// Proposed - boost calming for smothered/mellowed processing
yellow: { harmonizing: 6, calming: 6, focusing: 5, elevating: 4 }
// This makes calming and harmonizing competitive
```

**Expected Impact**: Should improve yellow tea accuracy from 50% → 75%+ (3 more correct)

---

## Part 2: Effect-Based Analysis

### Effects by Accuracy

| Effect | Accuracy | Total | Perfect | Partial | Issues |
|--------|----------|-------|---------|---------|--------|
| **grounding** | 89% | 9 | 2 | 6 | Very solid! |
| **focusing** | 80% | 5 | 1 | 3 | Good |
| **energizing** | 75% | 8 | 0 | 6 | Gets supporting right, dominant often wrong |
| **elevating** | 60% | 5 | 1 | 2 | High variance |
| **restorative** | 67% | 3 | 2 | 0 | Solid for white tea |
| **harmonizing** | 33% | 12 | 4 | 0 | **MAJOR ISSUE** |
| **calming** | 30% | 10 | 2 | 1 | **CRITICAL ISSUE** |
| **comforting** | 0% | 2 | 0 | 0 | **COMPLETELY BROKEN** |

### 1. CALMING - **30% Accuracy** 🔴 CRITICAL

**Problem**: Calming as dominant effect is almost never returned, even when expected.

**Expected but not matched**:
- Dragon Well Green Tea: expects calming supporting → gets energizing
- Bi Luo Chun: expects calming supporting → gets elevating
- Multiple yellow/white teas: calming gets reversed to harmonizing

**Root Cause**: Calming is systematically outcompeted by other effects in all tea types.

The issue is that `calming` base scores are too low:
- Green: `calming: 2` (way too low)
- White: `calming: 6` (medium)
- Yellow: `calming: 4` (too low)
- Oolong: base doesn't include calming

**Proposed Fixes**:

See **Green Tea Fixes** (Option A/B) and **Yellow Tea Fixes** above - these will directly improve calming.

Additionally: **Boost L-Theanine effect on calming globally**
```javascript
'High L-Theanine': {
  calming: 3,      // was 2 - increase this!
  harmonizing: 1,
  restorative: 0.5,
  comforting: 0.5
}

'Very High L-Theanine': {
  calming: 4,      // was 3 - increase this!
  harmonizing: 2,
  restorative: 1.5,
  elevating: 1
}
```

**Expected Impact**: With green tea + yellow tea fixes + L-Theanine boost, calming should improve to 60%+.

---

### 2. COMFORTING - **0% Accuracy** 🔴 COMPLETELY BROKEN

**Problem**: Comforting effect is NEVER correctly calculated as dominant or supporting.

**Expected instances** (all wrong):
```
Lapsang Souchong: expected comforting → got grounding ❌
Shou Mei White: expected comforting → got restorative ❌
Aged White Tea Cake: expected comforting → got calming ❌
```

**Root Cause**: Comforting has **very low base scores** across all tea types:
- Red: `comforting: 5` (gets outcompeted by grounding: 6 and energizing: 5)
- Dark: `comforting: 7` (only wins when paired with fermented teas)
- White: `comforting: 0` (NOT EVEN IN BASE EFFECTS!)
- Oolong: `comforting: 5` (outcompeted by harmonizing: 7 and elevating: 7)

**Proposed Fixes** (Priority: CRITICAL):

**Fix 1**: Add comforting to white tea base effects
```javascript
// Current
white: { restorative: 8, calming: 6, harmonizing: 5, focusing: 3, elevating: 4 }

// Proposed
white: { restorative: 8, calming: 6, comforting: 5, harmonizing: 4, focusing: 3 }
```

**Fix 2**: Rebalance red tea to allow comforting dominance
```javascript
// Current
red: { energizing: 5, focusing: 5, harmonizing: 4, grounding: 6, comforting: 5 }

// Proposed
red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 }
// comforting now equals energizing, can compete for dominance
```

**Fix 3**: Add special handling for aged/smoked teas
```javascript
// Smoked red teas (Lapsang) should favor comforting
if (canonicalTeaType === 'red' && processingMethods.includes('smoked')) {
  scores.comforting = (scores.comforting || 0) + 3;
  scores.energizing = Math.max(0, scores.energizing - 1);
}
```

**Expected Impact**: With these fixes, comforting should jump from 0% → 75%+.

---

### 3. HARMONIZING - **33% Accuracy** 🟠 HIGH PRIORITY

**Problem**: Harmonizing as dominant effect is often wrong or reversed with other effects.

**Examples**:
- Bi Luo Chun: expects harmonizing → gets focusing
- Huo Shan Huang Ya Green: expects harmonizing → gets focusing
- Mao Feng Green: expects harmonizing → gets focusing
- Multiple oolong reversals (gets elevating instead)
- Yellow tea reversals (gets calming instead)

**Root Cause**: Harmonizing base scores conflict with dominant base scores in same tea type.

For example, green tea:
```javascript
green: { energizing: 5, focusing: 7, harmonizing: 5, calming: 2, elevating: 4 }
```
When harmonizing is expected, `focusing: 7` wins instead.

**Proposed Fixes**: Addressed by fixes in Green Tea, Yellow Tea, and Oolong sections above.

**Expected Impact**: With those fixes, harmonizing should improve to 60%+.

---

## Part 3: Refinement Roadmap

### Priority 1: CRITICAL (Do First)

1. **[GREEN TEA FIX]** Reduce focusing dominance, boost calming
   - Impact: +6 teas correct (33% → 75%)
   - Effort: Low (2 parameter changes)
   - File: `EffectService.js` - TEA_TYPE_EFFECTS and COMPOUND_EFFECT_MODIFIERS

2. **[COMFORTING FIX]** Add comforting to white tea, boost red tea comforting
   - Impact: +2 teas correct (0% → 75%)
   - Effort: Low (3 parameter changes)
   - File: `EffectService.js` - TEA_TYPE_EFFECTS

3. **[CALMING BOOST]** Increase L-Theanine calming modifiers
   - Impact: +3 teas correct (30% → 50%)
   - Effort: Low (2 parameter changes)
   - File: `EffectService.js` - COMPOUND_EFFECT_MODIFIERS

### Priority 2: HIGH (Do Second)

4. **[OOLONG ROAST FIX]** Add roast-level logic for heavy roasts returning grounding
   - Impact: +4 teas correct (53% → 70%)
   - Effort: Medium (add conditional logic)
   - File: `EffectService.js` - _buildEffectScores()

5. **[RED TEA REBALANCE]** Reduce grounding, boost energizing/comforting
   - Impact: +2 teas correct (63% → 75%)
   - Effort: Low (parameter change)
   - File: `EffectService.js` - TEA_TYPE_EFFECTS

6. **[YELLOW TEA REBALANCE]** Make calming/harmonizing competitors
   - Impact: +3 teas correct (50% → 75%)
   - Effort: Low (parameter change)
   - File: `EffectService.js` - TEA_TYPE_EFFECTS

### Priority 3: MEDIUM (Do Third)

7. **[WHITE TEA AGING]** Add special handling for aged white teas
   - Impact: +2 teas correct (57% → 70%)
   - Effort: Medium (add conditional logic)
   - File: `EffectService.js` - _buildEffectScores()

8. **[PROCESSING WEIGHT]** Increase weight multiplier for heavily roasted teas
   - Impact: +2 teas correct (overall)
   - Effort: Low (parameter change)
   - File: `EffectService.js` - _buildEffectScores()

---

## Part 4: Implementation Checklist

```
PRIORITY 1 - Expected Impact: +11 teas (55.6% → 75.9%)
[ ] Green tea: Reduce focusing from 7→6, calming from 2→4
[ ] Add comforting to white tea base effects (value: 5)
[ ] Increase High L-Theanine calming from 2→3
[ ] Increase Very High L-Theanine calming from 3→4
[ ] Rebalance red tea: energizing 5→6, grounding 6→4, comforting 5→6

PRIORITY 2 - Expected Impact: +9 teas (75.9% → 92.5%)
[ ] Add oolong-specific roast handling in _buildEffectScores()
[ ] Yellow tea: Make calming and harmonizing equal (both 6)
[ ] Test and iterate

PRIORITY 3 - Expected Impact: +4 teas (92.5% → 100% theoretical)
[ ] Add aged white tea detection logic
[ ] Increase processing weight multiplier for heavy roasts
[ ] Fine-tune complementary effect selection
```

---

## Part 5: Expected Outcomes by Implementation Phase

### Phase 1 (Priority 1 only): 55.6% → 75.9%
- Green tea: 33% → 75%
- Calming effect: 30% → 50%
- Comforting effect: 0% → 75%

### Phase 2 (+ Priority 2): 75.9% → ~85%
- Oolong: 53% → 70%
- Yellow tea: 50% → 75%

### Phase 3 (+ Priority 3): ~85% → 90%+
- White tea: 57% → 70%
- Minor effect refinements

---

## Part 6: Files to Modify

**Primary File**: `/backend/src/services/EffectService.js`
- TEA_TYPE_EFFECTS (lines 37-47)
- COMPOUND_EFFECT_MODIFIERS (lines 50-54)
- _buildEffectScores() method (lines 178-323)

**Testing**:
- Run: `node test-detailed-comparison.js` after each change
- Track improvements with: `node test-comprehensive-validation.js`

---

## Summary

The algorithm has **solid foundations** but needs **targeted parameter adjustments** to eliminate systematic biases. The biggest wins come from:

1. **Fixing green tea** (currently broken, 33% → 75%)
2. **Adding comforting support** (currently broken, 0% → 75%)
3. **Oolong roast awareness** (needs roast-level logic)

**Estimated total achievable accuracy**: 85-90% with all Priority 1 & 2 fixes implemented.

