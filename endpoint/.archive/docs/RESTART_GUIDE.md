# Tea Recommendation API - Restart Guide

## Lessons Learned (3-Day Session - Lost)

This document captures learnings from a failed 3-day optimization attempt. Read this before restarting.

---

## What Went Wrong

### Initial State (✅ Working)
- Effect Calculator: **33.3% accuracy** (18/54 mood matches)
- Timing Matcher: **81.3% accuracy** (13/16)
- Season Matcher: **100% accuracy** (16/16)
- Activity Matcher: Functional
- Food Matcher: Functional

### Final State (❌ Broken)
- Effect Calculator: **18.8% accuracy** (3/16)
- Activity Matcher: Returns "Unknown" for all teas
- Food Matcher: Returns "Aged Cheese" for all teas
- All matchers dependent on EffectService integration that wasn't properly implemented

### Root Causes

1. **Architectural Refactoring + Feature Development Simultaneously**
   - Attempted to refactor EffectService integration while optimizing matchers
   - Code state mismatch: tests expected features that didn't exist in source
   - No isolation between changes

2. **Lost Focus on Working Code**
   - Started with 33.3% → 81.3% → 100% working baseline
   - Got distracted by "elegance" (unified EffectService dependency)
   - Should have just improved matchers directly

3. **Insufficient Testing Strategy**
   - Created tests expecting new functionality before implementing it
   - No regression tests at each step
   - Didn't measure impact until 3 days of work invested

4. **Analysis Paralysis**
   - When accuracy dropped, continued optimizing instead of rolling back
   - Spent days investigating instead of reverting to known good state
   - Didn't stop when user said "I'm exhausted by endless task with no progress"

---

## What Should Have Happened

### Phase 1: Measure Baseline (4-6 hours)
```
1. Clone backend repo
2. Run test-17-tea-validation.js
3. Record all metrics:
   - Per-tea effect accuracy
   - Per-tea mood accuracy
   - Per-tea timing accuracy
   - Per-tea season accuracy
4. Create baseline snapshot (commit)
5. DO NOT PROCEED until baseline captured
```

### Phase 2: Single Matcher Optimization (1 matcher at a time)
```
For ActivityMatcher:
  1. Create feature branch: feature/activity-matcher-improvement
  2. Modify ONLY ActivityMatcher.js scoring weights/logic
  3. Test immediately: npm test
  4. Commit when accuracy improves
  5. Measure per-tea impact
  6. If no improvement after 2 hours → ROLLBACK

Repeat for FoodMatcher, then TimeMatcher
Never touch EffectService unless isolated in own branch
```

### Phase 3: Matcher Combinations (if Phase 2 successful)
```
Only after individual matchers improve, test combinations
Still NO architectural refactoring
```

---

## DO NOT REPEAT

### ❌ Anti-Patterns (Avoid These)

1. **Multi-File Refactoring**
   ```
   DON'T:  Change ActivityMatcher + FoodMatcher + EffectService together
   DO:     Change ActivityMatcher, test, commit, then next file
   ```

2. **Long Branches Without Commits**
   ```
   DON'T:  Work for 3 days without committing
   DO:     Commit after every successful test
   ```

3. **Optimization Without Baseline**
   ```
   DON'T:  Attempt optimization without measuring current performance
   DO:     Record metrics first, only then improve
   ```

4. **Ignore Accuracy Drops**
   ```
   DON'T:  Continue working when metrics decline
   DO:     Rollback immediately if accuracy drops
   ```

5. **Add Dependencies Late**
   ```
   DON'T:  Add EffectService dependency 2 days in
   DO:     Keep matchers independent, use only compound data
   ```

---

## For Next Attempt

### Core Principle
**Keep It Simple. Focus on Matchers. One. At. A. Time.**

### Recommended Approach

#### Step 1: Restore Working Baseline
```bash
# Find the last good commit (33.3% accuracy)
git log --oneline | grep -E "33|validation"
git checkout <commit-hash>
npm test  # Verify 33.3% working
git commit -m "baseline: confirmed 33.3% mood accuracy"
```

#### Step 2: Improve ActivityMatcher Only
```
Goal: 33.3% → 50%+ mood accuracy

Strategy:
  - Don't touch EffectService
  - Don't touch other matchers
  - Only adjust Activity scoring weights
  - Test after each change

Example changes:
  - Fine-tune compound profile → activity mapping
  - Adjust stimulation/relaxation level weights
  - Add new activity recommendations for specific profiles
  - Test with: npm test-activity

Success Metric: 2-3 additional teas matching expected mood/activity
```

#### Step 3: Improve FoodMatcher Only
```
Goal: 33.3% → 50%+ food pairing accuracy

Strategy:
  - Don't touch EffectService
  - Don't touch ActivityMatcher
  - Only expand/adjust food pairing database
  - Add category-specific food logic

Example changes:
  - Add more food options per tea type
  - Refine flavor → food mappings
  - Test with: npm test-food

Success Metric: 2-3 additional teas with accurate top food pairing
```

#### Step 4: Optional - EffectService Integration
```
ONLY after matchers improved individually

Only then consider:
  - Making EffectService optional dependency
  - Creating isolated branch: feature/effect-service-integration
  - Comprehensive regression tests
  - Rollback plan ready

Warning: This is risky. Only do if Phase 2-3 successful.
Better to leave EffectService alone.
```

---

## Architecture Principles

### Current Working State (Don't Break This)
```
Tea Data (caffeine, L-theanine, geography, processing)
    ↓
CompoundService (calculate profiles)
    ↓
Individual Matchers:
  - ActivityMatcher (compound → activities) ✅ WORKS
  - FoodMatcher (flavor → foods) ✅ WORKS
  - TimeMatcher (geography → time) ✅ WORKS
  - SeasonMatcher (geography → season) ✅ WORKS
  - brewingMatcher (processing → method) ✅ WORKS
```

### ❌ Don't Try This (Failed)
```
Tea Data
    ↓
CompoundService
    ↓
EffectService (new dependency)  ← ADDS COMPLEXITY
    ↓
Matchers (now dependent on Effects)  ← BREAKS ISOLATION
```

---

## Metrics to Track

### Before Starting
```
- Effect Calculator: ___% accuracy
- Mood/Energy: ___% accuracy
- Timing: ___% accuracy
- Season: ___% accuracy
- Activity Matcher: ___% quality
- Food Matcher: ___% quality
```

### After Each Change
```
- Which metric improved?
- By how much?
- Any regressions?
- Did you commit?
```

### Success Criteria
```
- At least 1 metric improved by 5%+
- NO regressions in other metrics
- Code committed at each step
- Test suite still passes
```

---

## File Structure

```
endpoint/
├── src/services/
│   ├── EffectService.js              (reference only)
│   ├── CompoundService.js            (core calculation)
│   └── matchers/
│       ├── ActivityMatcher.js        (focus area)
│       ├── FoodMatcher.js            (focus area)
│       ├── TimeMatcher.js            (reference, working)
│       ├── SeasonMatcher.js          (reference, working)
│       └── brewingMatcher.js         (reference, working)
├── validation-dataset-17-tea.json    (test data)
├── SESSION_SUMMARY.md                (previous session notes)
├── ACTIVITY_MATCHER_IMPROVEMENTS.md  (what was attempted)
├── FOODMATCHER_OPTIMIZATION.md       (what was attempted)
└── RESTART_GUIDE.md                  (this file)
```

---

## Time Estimate for Next Attempt

- **Phase 1 (Baseline):** 4-6 hours
- **Phase 2 (Single Matcher):** 6-10 hours each (ActivityMatcher, FoodMatcher)
- **Phase 3 (Test):** 4-6 hours
- **Total:** 20-32 hours (realistic, with contingency)

**Key:** Work in 2-4 hour focused sessions. Stop and review metrics after each session.

---

## Red Flags (Stop & Rollback If You See These)

1. ❌ Accuracy drops more than 2% on any metric
2. ❌ More than 2 files modified in one session
3. ❌ Working for more than 4 hours without testing
4. ❌ More than 1 matcher being changed simultaneously
5. ❌ Can't explain what changed and why in 2 sentences
6. ❌ Tests failing for unclear reasons
7. ❌ Feeling stuck for more than 30 minutes → ask for help or rollback

---

## Success Looks Like

- ✅ ActivityMatcher accuracy: 33.3% → 40-50%
- ✅ FoodMatcher quality: noticeably better recommendations
- ✅ All other matchers: unchanged (no regressions)
- ✅ Season Matcher: still 100%
- ✅ Timing Matcher: still 80%+
- ✅ Code changes committed regularly
- ✅ Clear commit messages explaining each change

---

## Next Team Member Reading This

If this is handed off:
1. Read this guide first
2. Understand the failures
3. Follow Phase 1-2 approach, not ambitious refactoring
4. Measure before and after EVERY change
5. Rollback immediately on regression
6. Keep it simple

The system works at 33% → 81% → 100%. Your job is to improve the 33% part without breaking 81% and 100%.

---

**Last Updated:** Nov 1, 2024
**Prepared After:** 3-day failed optimization attempt
**Lesson:** Don't refactor architecture while optimizing features. Do one thing at a time.
