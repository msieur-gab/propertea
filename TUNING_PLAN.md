# Comprehensive Tuning Plan: Tea Type Effects + Geography Modifiers

## Strategy: Two-Pronged Attack

**Tier 1 (2.5x weight)**: Tea Type Base Effects - HIGH IMPACT
**Tier 2 (2.0x weight)**: Geography Modifiers - STABILIZING

---

## Phase 2a: Tea Type Effects Adjustments

### 1. GREEN TEA (current: 21% accuracy → target: 70%+)

**Current Base Effects**:
```javascript
green: { energizing: 5, focusing: 6, harmonizing: 5, calming: 4, elevating: 4 }
```

**Problem**:
- `calming: 4` gets boosted by cool/humid geography to 17.3
- `focusing: 6` only reaches 17.2 without strong geography support
- `energizing: 5` is weak (13.7 final)

**Proposed Adjustment**:
```javascript
green: { energizing: 6, focusing: 7, harmonizing: 3, calming: 2, elevating: 4 }
```

**Reasoning**:
- `energizing: 5→6` (+1) to compete with calming
- `focusing: 6→7` (+1) to edge out calming even after modifiers
- `calming: 4→2` (-2) since cool/humid regions will still add 1.1
- `harmonizing: 5→3` (-2) to prevent it from interfering

**Expected Impact**: Focusing and energizing should now be 18.2-18.3, beating calming at 17.3

---

### 2. WHITE TEA (current: 50% accuracy → improve to 70%+)

**Current Base Effects**:
```javascript
white: { restorative: 8, calming: 6, comforting: 5, harmonizing: 5, focusing: 3, elevating: 4 }
```

**Problem**:
- `focusing: 3` is critically low
- `calming: 6` and `restorative: 8` dominate everything
- Not enough energizing/focusing support

**Proposed Adjustment**:
```javascript
white: { restorative: 7, calming: 5, comforting: 5, harmonizing: 4, focusing: 5, elevating: 5 }
```

**Reasoning**:
- `focusing: 3→5` (+2) to make it competitive
- `calming: 6→5` (-1) to reduce dominance
- `elevating: 4→5` (+1) to match white tea's delicate nature
- Slight reduction in restorative (8→7) to balance

---

### 3. RED TEA / HONGCHA (current: 33% accuracy → target: 70%+)

**Current Base Effects**:
```javascript
red: { energizing: 6, comforting: 6, focusing: 4, grounding: 4, harmonizing: 3 }
```

**Problem**:
- `energizing: 6` tied with `comforting: 6` - no winner
- `focusing: 4` too low for high-caffeine teas

**Proposed Adjustment**:
```javascript
red: { energizing: 8, comforting: 5, focusing: 5, grounding: 3, harmonizing: 2 }
```

**Reasoning**:
- `energizing: 6→8` (+2) to dominate comforting
- `comforting: 6→5` (-1) to lower it
- `focusing: 4→5` (+1) for better balance
- `grounding/harmonizing` reduced since red should be energizing-dominant

---

### 4. OOLONG (current: 47% accuracy → target: 70%+)

**Current Base Effects**:
```javascript
oolong: { harmonizing: 7, focusing: 5, elevating: 7, comforting: 5 }
```

**Problem**:
- Missing `energizing` entirely
- `focusing: 5` too low for high-caffeine oolongs
- Score issues with elevating vs harmonizing ties

**Proposed Adjustment**:
```javascript
oolong: { harmonizing: 6, focusing: 6, elevating: 7, comforting: 4, energizing: 4 }
```

**Reasoning**:
- Add `energizing: 4` for balance
- `focusing: 5→6` (+1) to support oolongs with high caffeine
- `harmonizing: 7→6` (-1) to prevent over-dominance
- `comforting: 5→4` (-1) to reduce interference

---

### 5. YELLOW TEA (current: 57% accuracy)

**Current Base Effects**:
```javascript
yellow: { harmonizing: 7, focusing: 6, elevating: 6, calming: 4 }
```

**Status**: Performing well, minimal changes needed

**Proposed Adjustment** (minor):
```javascript
yellow: { harmonizing: 6, focusing: 7, elevating: 6, calming: 3 }
```

**Reasoning**:
- `focusing: 6→7` (+1) to align with green tea
- `harmonizing: 7→6` (-1) to prevent over-dominance
- `calming: 4→3` (-1) slight reduction

---

### 6. DARK TEA / HEICHA (current: 100% accuracy - DO NOT CHANGE)

**Current Base Effects**:
```javascript
dark: { grounding: 7, comforting: 7, harmonizing: 4, restorative: 5, calming: 3 }
```

**Status**: PERFECT - 100% accuracy
**Action**: NO CHANGES

---

### 7. PUERH (current: 50% accuracy)

**Current Base Effects**:
```javascript
puerh: {
  sheng: { energizing: 5, focusing: 6, harmonizing: 5, grounding: 6 },
  shou: { grounding: 9, harmonizing: 5, comforting: 8, restorative: 4 }
}
```

**Proposed Adjustments** (minor):

Sheng (young/raw):
```javascript
sheng: { energizing: 6, focusing: 7, harmonizing: 4, grounding: 5 }
```
- `focusing: 6→7` for consistency
- `energizing: 5→6` for balance
- `grounding: 6→5` slight reduction

Shou (ripe):
```javascript
shou: { grounding: 9, harmonizing: 4, comforting: 8, restorative: 5 }
```
- Reduce `harmonizing: 5→4` to let grounding/comforting dominate
- Increase `restorative: 4→5` for fermented benefits

---

## Phase 2b: Geography Modifier Adjustments

### Priority 1: Fix GREEN TEA Calming Over-Boost

**Current Problem**:
- Temperature 16.2°C (cool): `calming: 0.4 × 2.0 = 0.8`
- Humidity 81% (high): `calming: 0.15 × 2.0 = 0.3`
- Total geography boost to calming: 1.1 (too much!)

**Proposed Changes**:

Temperature modifiers:
```javascript
temperature: {
  veryLow:  { calming: 0.3, restorative: 0.2, focusing: 0.1 },  // 0.5→0.3
  low:      { calming: 0.2, restorative: 0.2, elevating: 0.15 }, // 0.4→0.2
  moderate: { harmonizing: 0.3, elevating: 0.3, focusing: 0.1 },
  high:     { energizing: 0.3, focusing: 0.2, grounding: 0.1 },
  veryHigh: { energizing: 0.4, grounding: 0.3, comforting: 0.1 }
}
```

Humidity modifiers:
```javascript
humidity: {
  veryLow:  { energizing: 0.2, focusing: 0.2 },
  low:      { energizing: 0.15, focusing: 0.1 },
  moderate: { harmonizing: 0.2, elevating: 0.1 },
  high:     { elevating: 0.3, harmonizing: 0.2, focusing: 0.15 },  // calming: 0.15→0 (remove!)
  veryHigh: { calming: 0.2, restorative: 0.2, harmonizing: 0.15 }  // calming: 0.3→0.2
}
```

**Why These Changes**:
- Cool temps shouldn't auto-boost calming (cool ≠ calm)
- High humidity in tea regions ≠ calming (it's just moist air)
- Geography should support tea characteristics, not override them

---

## Testing Strategy

### Test 1: Apply Tea Type Changes Only
```bash
# Edit TEA_TYPE_EFFECTS in EffectService.js
# Run: node test-comprehensive-validation.js
# Expected: ~55-60% accuracy (+5-10% improvement)
```

### Test 2: Apply Geography Changes Only
```bash
# Edit GEOGRAPHIC_EFFECT_MODIFIERS in EffectService.js
# Run: node test-comprehensive-validation.js
# Expected: ~50-52% accuracy (less impact than tea type)
```

### Test 3: Apply Both Together
```bash
# Apply both changes
# Run: node test-comprehensive-validation.js
# Expected: ~60-65% accuracy (+15-20% improvement)
```

### Test 4: Run Failure Diagnosis
```bash
# Run: node test-failure-diagnosis.js
# Check which categories improved most
# Identify remaining issues for next iteration
```

---

## Expected Improvements by Category

| Category | Current | Target | Change |
|----------|---------|--------|--------|
| Green Tea | 21% | 70%+ | +49% |
| White Tea | 50% | 70%+ | +20% |
| Red Tea | 33% | 70%+ | +37% |
| Oolong | 47% | 70%+ | +23% |
| Energizing | 18% | 60%+ | +42% |
| Focusing | 0% | 50%+ | +50% |
| Overall | 46.5% | 60%+ | +13%+ |

---

## Commit Strategy

### Commit 1: Tea Type Adjustments
- Adjust TEA_TYPE_EFFECTS for green, white, red, oolong, yellow, puerh
- Test and validate
- Commit message: "Tuning: Adjust tea type base effects for accuracy"

### Commit 2: Geography Modifier Adjustments
- Adjust GEOGRAPHIC_EFFECT_MODIFIERS
- Test and validate
- Commit message: "Tuning: Calibrate geography modifiers to prevent calming over-boost"

### Commit 3: Final Validation
- Run comprehensive test
- Commit message: "Tuning: Tea type + geography calibration complete (46.5% → X%)"

---

## Rollback Plan

If combined changes cause regression:
1. Test each tea type independently
2. Test each geography factor independently
3. Identify which specific change caused regression
4. Adjust only that parameter

Example: If white tea goes down, only adjust white tea back and keep others.
