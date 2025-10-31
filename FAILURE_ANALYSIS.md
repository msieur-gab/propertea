# Failure Pattern Analysis - Phase 1 Results

## Executive Summary
- **Total Failures**: 59/71 teas (83%)
- **Worst Performers**: Green tea (93% failure), Focusing (0% accuracy), Energizing (18%)
- **Root Causes**: Geography modifiers over-boost CALMING; FOCUSING too weak; ENERGIZING suppressed

---

## 1. GREEN TEA FAILURES (13 failing out of 14 = 93%)

### The Problem
Green teas are **consistently getting CALMING** instead of ENERGIZING/FOCUSING.

### Input Pattern (Typical Green Tea)
```
Caffeine:       3.2/5 (moderate)
L-Theanine:     4.1/5 (moderately high)
Altitude:       712m (mid-altitude)
Temperature:    16.2°C (cool)
Humidity:       81.1% (high)
Flavors:        sweet, fresh, vegetal, floral, delicate
Processing:     pan-fired, minimal oxidation
```

### Score Breakdown (Example: Dragon Well)
```
Calming:        17.3 (TOO HIGH) ← WINNING
Focusing:       17.2 (very close, should win!)
Harmonizing:    16.3
Energizing:     13.7
Elevating:      12.5
```

### Root Cause Analysis
**The geography modifiers are TOO STRONG for CALMING:**

| Factor | Contribution | Issue |
|--------|--------------|-------|
| Tea Type Base | `calming: 4` | Moderate, fine |
| Temperature (16.2°C) | `low: { calming: 0.4 }` × 2.0 weight = **0.8** | Low temperature boosts calming |
| Humidity (81.1%) | `high: { calming: 0.15 }` × 2.0 weight = **0.3** | High humidity boosts calming |
| Geography Total | **+1.1** added to calming | STACKS UP! |
| **Final Score** | 4 (base) + 2.5 (type weight) + 1.1 (geo) = **17.3** | ❌ WRONG |

**For FOCUSING:**
- Tea Type Base: `focusing: 6` → 6 × 2.5 = **15.0**
- No strong geography boosts
- Flavor boost from "vegetal": `focusing: 1` → 1 × 2.0 = **2.0**
- Processing boost: None (pan-fired is `Minimal: {}`)
- **Final Score: 15.0 + 2.0 = 17.0** ← Should win but tied with calming!

### Fix Strategy
**Option A (Recommended)**: Reduce CALMING boosters for cool/humid conditions
- Reduce `temperature.low.calming` from 0.4 → 0.2
- Reduce `humidity.high.calming` from 0.15 → 0.05

**Option B**: Boost ENERGIZING/FOCUSING for green teas
- Increase green tea base: `energizing: 5 → 6`, `focusing: 6 → 7`
- Boost pan-fired processing for focusing

**Option C (Combined)**: Do both for maximum effect

---

## 2. ENERGIZING FAILURES (9 failures)

### The Problem
Red teas with **expected ENERGIZING** are getting **COMFORTING** instead.

### Affected Teas
- 6 Red tea failures (Gong Fu Black Teas, Yunnan Dian Hong)
- 1 Oolong failure (Huang Jin Gui)
- 2 Others

### Score Breakdown (Example: Golden Monkey Black Tea)
```
Comforting:     17.0 (WINNING) ← Should NOT win
Energizing:     16.0 (very close, should win!)
Focusing:       11.2
Grounding:      10.0
Harmonizing:     9.5
```

### Root Cause Analysis
Red tea base effects: `{ energizing: 6, comforting: 6, ... }`

Both start equal, but:
- **Comforting** gets boosted by:
  - No compound modifier (neutral)
  - No flavor boosts
  - Geography: No boost for this temp/altitude
  - Processing (baked): Might add warmth → comforting

- **Energizing** gets suppressed by:
  - High Caffeine Compound modifier: `{ energizing: 1 }` only
  - Should be higher!

### Fix Strategy
**Boost energizing for red teas:**
- Increase red tea base: `energizing: 6 → 7 or 8`
- Strengthen "High Caffeine" modifier: `energizing: 1 → 1.5 or 2`
- Add energizing boost for roasted processing

---

## 3. FOCUSING FAILURES (5 failures)

### The Problem
**FOCUSING has 0% accuracy** - never predicted as dominant effect, rarely as supporting.

### Score Breakdown (Example: Keemun Hao Ya)
```
Comforting:     18.0 (WINNING)
Energizing:     16.0
Harmonizing:    14.5
Focusing:       11.2 (TOO LOW!)
Grounding:      10.0
```

### Root Cause Analysis
**FOCUSING is fundamentally weak:**

| Source | Boost | Problem |
|--------|-------|---------|
| Tea Type Base | Varies (4-6) | Low-moderate |
| Compounds | None | No compound boosts FOCUSING! |
| Flavor: Vegetal | 1 × 2.0 = 2.0 | Weak |
| Flavor: Umami | 1 × 2.0 = 2.0 | Weak, rarely present |
| Geography | 0.1-0.2 × 2.0 = minimal | Too weak |
| Processing | None | No roast boosts it |
| **Total Impact** | **Very Weak** | ❌ Structural issue |

### Fix Strategy
**Make FOCUSING competitive:**

1. **Boost Tea Type Base for green/white**:
   - Green: `focusing: 6 → 7 or 8`
   - White: `focusing: 3 → 5`
   - Yellow: `focusing: 6 → 7`

2. **Add Compound Support**:
   - Create "Balanced Compounds" modifier (both caffeine & theanine high)
   - `{ focusing: 1.5, energizing: 1 }`

3. **Boost Flavor Effect for Focusing**:
   - Vegetal: 1 → 1.5 or 2
   - Umami: 1 → 1.5
   - Add Grassy: `{ focusing: 1.5 }`

4. **Boost Processing for Focusing**:
   - Light roast: `{ focusing: 0.5 }` ← Currently exists
   - Add Minimal: `{ focusing: 0.5 }`

---

## 4. SECONDARY ISSUES

### COMFORTING too strong
- Over-winning against ENERGIZING (6 failures)
- Need to reduce comforting modifiers OR increase energizing

### HARMONIZING too strong
- Winning too many competitions
- Oolong teas expected to be "harmonizing + X" but X is always replaced

### ELEVATING too dominant
- Winning on high-altitude, shade-grown teas
- Beautiful in theory but needs calibration

---

## Summary: Priority Fix Order

### Priority 1: Fix GREEN TEA (93% failure → target 70%+)
**Effort**: Medium | **Impact**: High (13 teas)

Fix strategy: Reduce CALMING boosters for cool/humid conditions:
- `temperature.low.calming`: 0.4 → 0.2
- `humidity.high.calming`: 0.15 → 0.05
- Consider boosting green tea base `energizing` or `focusing`

### Priority 2: Fix FOCUSING (0% failure → target 50%+)
**Effort**: High | **Impact**: Medium (5 direct, affects others)

Fix strategy: Strengthen FOCUSING across the board:
- Increase tea type base for green/white/yellow
- Add compound modifier for balanced caffeine+theanine
- Boost flavor effects (vegetal, umami, grassy)
- Add processing support (light roast, minimal)

### Priority 3: Fix ENERGIZING (18% → target 60%+)
**Effort**: Medium | **Impact**: Medium (9 failures)

Fix strategy: Boost energizing for red tea:
- Increase red tea base `energizing: 6 → 7`
- Strengthen compound modifier for high caffeine
- Boost malty flavor effect

### Priority 4: Balance COMFORTING & ELEVATING
**Effort**: Medium | **Impact**: Medium (various failures)

Fix strategy: Reduce over-performance, calibrate against energizing/focusing

---

## Recommended Test Approach

1. **Test Green Tea Fix First** (highest ROI)
   - Make humidity/temperature adjustment
   - Remeasure: Should jump from 21% → 50%+

2. **Test FOCUSING Fix** (structural changes needed)
   - Adjust base effects + flavor mappings
   - Remeasure systematically

3. **Test ENERGIZING Fix** (red tea specific)
   - Tweak red tea effects

4. **Fine-tune Secondary Effects**
   - Balance remaining failures
