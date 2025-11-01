# Tea Recommendation API - Endpoint Snapshot

**Purpose:** Core files and learnings from failed 3-day optimization attempt.

**Status:** Ready to restart with better approach.

---

## Quick Start

### 1. Read First
```
RESTART_GUIDE.md          ← READ THIS FIRST (lessons learned)
SESSION_SUMMARY.md        ← What worked before
```

### 2. Understand the System
```
src/services/CompoundService.js       ← Calculates caffeine/L-theanine
src/services/matchers/                ← Individual recommendation engines
  ├── ActivityMatcher.js              ← Activities (33% accuracy target)
  ├── FoodMatcher.js                  ← Food pairings (improvable)
  ├── TimeMatcher.js                  ← Time of day (81% working)
  ├── SeasonMatcher.js                ← Season (100% working)
  └── brewingMatcher.js               ← Brewing method
```

### 3. Baseline Metrics (Current Working State)
- **Effect Calculator:** 33.3% mood accuracy
- **Timing:** 81.3% accuracy
- **Season:** 100% accuracy
- **Activity & Food:** Functional but improvable

### 4. Test Data
```
validation-dataset-17-tea.json        ← 16 teas with expected results
```

---

## File Inventory

### Core Services
| File | Purpose | Status |
|------|---------|--------|
| `src/services/CompoundService.js` | Calculate caffeine/L-theanine profiles | ✅ Working |
| `src/services/EffectService.js` | Calculate mood effects | ⚠️ 33.3% accurate |

### Matchers (Optimization Targets)
| File | Purpose | Accuracy | Priority |
|------|---------|----------|----------|
| `ActivityMatcher.js` | Map compounds → activities | 33% | HIGH |
| `FoodMatcher.js` | Map flavors → foods | Improvable | HIGH |
| `TimeMatcher.js` | Map compounds → time of day | 81% | MEDIUM |
| `SeasonMatcher.js` | Map geography → season | 100% | LOW |
| `brewingMatcher.js` | Map processing → brewing method | Working | LOW |

### Test Data
| File | Purpose |
|------|---------|
| `validation-dataset-17-tea.json` | 16 reference teas with expected mood, timing, season |

### Documentation
| File | Contains |
|------|----------|
| `RESTART_GUIDE.md` | **CRITICAL:** Lessons learned, what to do/avoid, success criteria |
| `SESSION_SUMMARY.md` | Summary of what worked in previous session |
| `ACTIVITY_MATCHER_IMPROVEMENTS.md` | How ActivityMatcher was improved (reference) |
| `FOODMATCHER_OPTIMIZATION.md` | How FoodMatcher was optimized (reference) |

---

## What Happened (TL;DR)

### The Mistake
- Started with 33% mood accuracy (working)
- Attempted to refactor with EffectService integration
- Broke everything (18.8% accuracy, matchers returning "Unknown")
- Wasted 3 days

### Why It Failed
1. Tried to refactor architecture AND optimize simultaneously
2. No commits for 3 days
3. Continued working after accuracy dropped
4. Changed multiple files at once

### What You Should Do Instead
1. **Read RESTART_GUIDE.md** - It has the complete playbook
2. Change ONE matcher at a time
3. Test after each change
4. Commit when it works
5. Rollback if accuracy drops

---

## Success Criteria for Next Attempt

### Phase 1: Restore Baseline (4-6 hours)
- [ ] Clone files to working directory
- [ ] Confirm current metrics (33%, 81%, 100%)
- [ ] Create baseline commit

### Phase 2: Improve ActivityMatcher (6-10 hours)
- [ ] Fine-tune activity scoring weights
- [ ] Test after each change
- [ ] Goal: 33% → 40-50% accuracy
- [ ] Commit improvements

### Phase 3: Improve FoodMatcher (6-10 hours)
- [ ] Expand/refine food pairing logic
- [ ] Test after each change
- [ ] Commit improvements

### Phase 4: Validate (4-6 hours)
- [ ] All metrics stable or improved
- [ ] No regressions in TimeMatcher/SeasonMatcher
- [ ] Documentation updated

---

## Key Learnings

### ❌ Don't Do This
- Multi-file refactoring (ActivityMatcher + FoodMatcher + EffectService together)
- 3-day branches without commits
- Continue working when accuracy drops
- Change without measuring first

### ✅ Do This Instead
- Change ONE file at a time
- Test and commit after each improvement
- Rollback immediately on regression
- Measure before and after EVERY change

---

## Next Steps

1. **Copy this folder to a clean workspace**
   ```bash
   cp -r endpoint my-tea-api-restart
   cd my-tea-api-restart
   ```

2. **Read the guide**
   ```bash
   cat RESTART_GUIDE.md
   ```

3. **Set up git**
   ```bash
   git init
   git add .
   git commit -m "baseline: core files from failed optimization"
   ```

4. **Follow Phase 1-4 from RESTART_GUIDE.md**

---

## Important Notes

### These Files Are from a Failed Attempt
- Code may not be in perfect state
- Test carefully before using in production
- Use as reference implementation only

### Before Making Any Changes
1. Verify current state works (33% accuracy)
2. Create baseline commit
3. Change ONE thing
4. Test immediately
5. Only then commit

### If You Get Stuck
- Don't optimize further
- Rollback to previous commit
- Re-read RESTART_GUIDE.md section "Red Flags"
- Ask for help or iterate differently

---

## Time Estimate

- **Understanding:** 1-2 hours (read guide + code review)
- **Baseline setup:** 4-6 hours
- **ActivityMatcher improvement:** 6-10 hours
- **FoodMatcher improvement:** 6-10 hours
- **Testing & validation:** 4-6 hours
- **Total:** 20-34 hours (realistic, with contingency)

Work in 2-4 hour focused sessions.

---

## Questions for Next Implementer

Before starting, ask yourself:

1. Have you read RESTART_GUIDE.md completely?
2. Do you understand why the previous attempt failed?
3. Can you commit to the "one file at a time" approach?
4. Do you know what your success metrics are?
5. Can you stop and rollback if accuracy drops?

If you answered "no" to any of these, re-read the guide.

---

**Created:** Nov 1, 2024
**Status:** Ready for restart with better methodology
**Key File:** `RESTART_GUIDE.md` ← Start here
